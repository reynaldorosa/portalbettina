import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../../contexts/UserContext'
import { setTTSEnabled, isTTSEnabled } from '../../utils/tts/ttsManager.js'
import {
  toggleHighContrast,
  applyAccessibilitySettings,
  saveAccessibilitySettings,
  getCurrentSettings,
} from '../../utils/accessibility/index.js'

// Estilos aprimorados
const AccessibilityButton = styled(motion.button)`
  position: fixed;
  bottom: 15px;
  right: 15px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b48ff, #ff6b9a);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(107, 72, 255, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 18px rgba(107, 72, 255, 0.5);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 107, 154, 0.5);
  }
`

const PanelOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
`

const Panel = styled(motion.div)`
  background: #ffffff;
  width: 90%;
  max-width: 380px;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 80vh;
  border: 1px solid #eee;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`

const PanelTitle = styled.h2`
  font-size: 16px;
  color: #6b48ff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  letter-spacing: 0.5px;
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 14px;
  color: #888;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover,
  &:focus {
    color: #ff6b9a;
  }
`

const SettingsGroup = styled.div`
  margin-bottom: 16px;
  padding: 10px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`

const GroupTitle = styled.h3`
  font-size: 13px;
  margin-bottom: 8px;
  color: #6b48ff;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: #f8f8f8;
  }
`

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #444;
`

const Switch = styled.div`
  position: relative;
  width: 36px;
  height: 18px;
  display: inline-block;

  input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: all 0.3s ease;
    border-radius: 18px;
    border: 1px solid #ddd;
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 14px;
    width: 14px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: all 0.3s ease;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  input:checked + .slider {
    background-color: #10b981 !important;
    border-color: #0f9b7a !important;
  }

  input:focus + .slider {
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }

  input:checked + .slider:before {
    transform: translateX(18px);
  }

  &:hover .slider {
    box-shadow: 0 0 4px rgba(16, 185, 129, 0.3);
  }
`

const ThemePresets = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 5px;
`

const ThemeButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => props.$backgroundColor || 'white'};
  border: 2px solid ${(props) => (props.$active ? '#6b48ff' : '#e0e0e0')};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    right: 0;
    background: ${(props) => props.$accentColor || 'white'};
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 4px rgba(107, 72, 255, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(107, 72, 255, 0.3);
  }
`

const SaveButton = styled(motion.button)`
  background: linear-gradient(135deg, #6b48ff, #ff6b9a);
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-top: 16px;
  font-size: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 3px 10px rgba(107, 72, 255, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 107, 154, 0.5);
  }
`

const Select = styled.select`
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  width: 110px;
  background: white;
  color: #444;
  font-size: 12px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6b48ff;
    box-shadow: 0 0 0 2px rgba(107, 72, 255, 0.2);
  }
`

const AccessibilityPanel = ({ onClose = () => {}, isButton = false }) => {
  const { userId, isDbConnected, userDetails, updateUser } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  const [settings, setSettings] = useState({
    textToSpeech: true,
    highContrast: false,
    reducedMotion: false,
    colorScheme: 'default',
    dyslexiaFriendly: false,
  })

  const [savedSuccessfully, setSavedSuccessfully] = useState(false)

  const handleTogglePanel = () => {
    setIsOpen((prev) => !prev)
  } // Carregar configurações do localStorage, banco de dados e preferências do sistema
  useEffect(() => {
    console.log('🔄 Carregando configurações de acessibilidade...')

    // Inicializar utilitário de acessibilidade
    applyAccessibilitySettings()

    // Obter configurações atuais do DOM e sistema
    const currentDOMSettings = getCurrentSettings()

    let initialSettings = {
      textToSpeech: true,
      highContrast: currentDOMSettings.highContrast || false,
      reducedMotion: currentDOMSettings.reducedMotion || false,
      colorScheme: 'default',
      dyslexiaFriendly: false,
    }

    // Primeiro carregar do localStorage
    const localSettings = localStorage.getItem('betina_accessibility_settings')
    if (localSettings) {
      try {
        const parsed = JSON.parse(localSettings)
        initialSettings = {
          ...initialSettings,
          textToSpeech: parsed.textToSpeech !== undefined ? parsed.textToSpeech : true,
          highContrast: parsed.highContrast || initialSettings.highContrast,
          reducedMotion: parsed.reducedMotion || initialSettings.reducedMotion,
          colorScheme: parsed.colorScheme || 'default',
          dyslexiaFriendly: parsed.dyslexiaFriendly || false,
        }
        console.log('📂 Configurações carregadas do localStorage:', parsed)
      } catch (e) {
        console.error('❌ Erro ao carregar configurações do localStorage:', e)
      }
    }

    // Sobrescrever com configurações do usuário se disponível
    if (userDetails && userDetails.preferences?.accessibility) {
      initialSettings = {
        ...initialSettings,
        ...userDetails.preferences.accessibility,
      }
      console.log('👤 Configurações do usuário aplicadas:', userDetails.preferences.accessibility)
    }

    setSettings(initialSettings)
    console.log('✅ Configurações finais carregadas:', initialSettings)
  }, [userDetails])
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])
  useEffect(() => {
    console.log('Aplicando configurações de acessibilidade:', settings)
    const root = document.documentElement
    const body = document.body

    // Aplicar alto contraste
    if (settings.highContrast) {
      root.classList.add('high-contrast')
      body.classList.add('high-contrast')
      console.log('Alto contraste ATIVADO')
    } else {
      root.classList.remove('high-contrast')
      body.classList.remove('high-contrast')
      console.log('Alto contraste DESATIVADO')
    }

    // Aplicar animações reduzidas
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion')
      body.classList.add('reduced-motion')
      console.log('Animações reduzidas ATIVADAS')
    } else {
      root.classList.remove('reduced-motion')
      body.classList.remove('reduced-motion')
      console.log('Animações reduzidas DESATIVADAS')
    }

    // Aplicar esquema de cores
    root.setAttribute('data-theme', settings.colorScheme)
    body.setAttribute('data-theme', settings.colorScheme)
    console.log(`Tema aplicado: ${settings.colorScheme}`)

    // Aplicar fonte para dislexia
    if (settings.dyslexiaFriendly) {
      root.classList.add('dyslexia-friendly')
      body.classList.add('dyslexia-friendly')
      console.log('Fonte para dislexia ATIVADA')
    } else {
      root.classList.remove('dyslexia-friendly')
      body.classList.remove('dyslexia-friendly')
      console.log('Fonte para dislexia DESATIVADA')
    }

    // Aplicar TTS
    if (settings.textToSpeech) {
      setTTSEnabled(true)
      console.log('TTS ATIVADO')
    } else {
      setTTSEnabled(false)
      console.log('TTS DESATIVADO')
    }
  }, [settings])
  const handleSettingChange = (key, value) => {
    console.log(`🔧 Alterando configuração ${key} de ${settings[key]} para:`, value)

    setSettings((prev) => {
      const newSettings = {
        ...prev,
        [key]: value,
      }

      console.log(`📊 Estado atualizado:`, newSettings)

      // Aplicar mudanças imediatamente usando as funções do utils/accessibility.js
      const root = document.documentElement
      const body = document.body

      // Aplicar mudanças específicas para cada configuração
      if (key === 'textToSpeech') {
        // Usar função específica do TTS
        setTTSEnabled(value)
        console.log(`🎙️ TTS ${value ? 'ATIVADO' : 'DESATIVADO'}`)

        // Disparar evento específico para texto-para-fala
        window.dispatchEvent(
          new CustomEvent('tts-settings-changed', {
            detail: { enabled: value },
          })
        )
      }

      if (key === 'highContrast') {
        // Aplicar diretamente no DOM e também usar a função de utilitário
        if (value) {
          root.classList.add('high-contrast')
          body.classList.add('high-contrast')
          console.log(`🌓 Alto contraste ATIVADO`)
        } else {
          root.classList.remove('high-contrast')
          body.classList.remove('high-contrast')
          console.log(`🌓 Alto contraste DESATIVADO`)
        }
      }

      if (key === 'reducedMotion') {
        if (value) {
          root.classList.add('reduced-motion')
          body.classList.add('reduced-motion')
          console.log(`✨ Animações reduzidas ATIVADAS`)
        } else {
          root.classList.remove('reduced-motion')
          body.classList.remove('reduced-motion')
          console.log(`✨ Animações reduzidas DESATIVADAS`)
        }
      }

      if (key === 'colorScheme') {
        root.setAttribute('data-theme', value)
        body.setAttribute('data-theme', value)
        console.log(`🎨 Tema aplicado: ${value}`)
      }

      if (key === 'dyslexiaFriendly') {
        if (value) {
          root.classList.add('dyslexia-friendly')
          body.classList.add('dyslexia-friendly')
          console.log(`🧠 Fonte para dislexia ATIVADA`)
        } else {
          root.classList.remove('dyslexia-friendly')
          body.classList.remove('dyslexia-friendly')
          console.log(`🧠 Fonte para dislexia DESATIVADA`)
        }
      }

      // Salvar as configurações usando a função de utilitário
      saveAccessibilitySettings({
        ...getCurrentSettings(),
        highContrast: newSettings.highContrast,
        reducedMotion: newSettings.reducedMotion,
        dyslexiaFriendly: newSettings.dyslexiaFriendly,
        colorScheme: newSettings.colorScheme,
      })

      // Salvar no localStorage específico do painel
      localStorage.setItem('betina_accessibility_settings', JSON.stringify(newSettings))
      console.log(`💾 Configurações salvas no localStorage`)

      // Notificar outros componentes sobre a mudança
      window.dispatchEvent(
        new CustomEvent('accessibility-settings-changed', {
          detail: { settings: newSettings },
        })
      )

      return newSettings
    })

    // Forçar um foco no botão após a mudança para garantir feedback visual
    const focusableElement = document.activeElement
    if (focusableElement && typeof focusableElement.blur === 'function') {
      focusableElement.blur()
      setTimeout(() => focusableElement.focus(), 50)
    }
  }
  const handleSave = async () => {
    console.log(`Salvando configurações de acessibilidade:`, settings)

    // Garantir que o TTS seja atualizado
    setTTSEnabled(settings.textToSpeech)

    try {
      // Salvar no localStorage primeiro (funcionamento offline garantido)
      localStorage.setItem('betina_accessibility_settings', JSON.stringify(settings))

      // Aplicar configurações diretamente ao DOM para garantir efeito imediato
      const root = document.documentElement
      const body = document.body

      // Aplicar alto contraste
      if (settings.highContrast) {
        root.classList.add('high-contrast')
        body.classList.add('high-contrast')
      } else {
        root.classList.remove('high-contrast')
        body.classList.remove('high-contrast')
      }

      // Aplicar animações reduzidas
      if (settings.reducedMotion) {
        root.classList.add('reduced-motion')
        body.classList.add('reduced-motion')
      } else {
        root.classList.remove('reduced-motion')
        body.classList.remove('reduced-motion')
      }

      // Aplicar esquema de cores
      root.setAttribute('data-theme', settings.colorScheme)
      body.setAttribute('data-theme', settings.colorScheme)

      // Aplicar fonte para dislexia
      if (settings.dyslexiaFriendly) {
        root.classList.add('dyslexia-friendly')
        body.classList.add('dyslexia-friendly')
      } else {
        root.classList.remove('dyslexia-friendly')
        body.classList.remove('dyslexia-friendly')
      }

      // Salvar usando também as funções de utilitário do accessibility.js
      saveAccessibilitySettings({
        highContrast: settings.highContrast,
        reducedMotion: settings.reducedMotion,
        dyslexiaFriendly: settings.dyslexiaFriendly,
        colorScheme: settings.colorScheme,
        soundEnabled: !settings.textToSpeech, // Inverter pois o controle é oposto
      })

      // Aplicar configurações usando a função que garante que tudo será aplicado corretamente
      applyAccessibilitySettings()

      // Salvar no banco de dados se tiver conexão
      if (userId && isDbConnected) {
        try {
          const currentPrefs = userDetails?.preferences || {}
          const updatedPrefs = {
            ...currentPrefs,
            accessibility: settings,
          }

          await updateUser(userId, { preferences: updatedPrefs })
          console.log('✅ Configurações salvas no banco de dados')
        } catch (dbError) {
          console.error('Erro ao salvar configurações no banco de dados:', dbError)
          console.log('⚠️ Configurações salvas apenas localmente')
        }
      }

      // Notificar outros componentes da aplicação sobre a mudança
      window.dispatchEvent(
        new CustomEvent('accessibility-settings-changed', {
          detail: { settings, ttsEnabled: settings.textToSpeech },
        })
      )

      // Mostrar feedback de sucesso
      setSavedSuccessfully(true)
      setTimeout(() => setSavedSuccessfully(false), 3000)
    } catch (error) {
      console.error('Erro ao salvar configurações de acessibilidade:', error)
      alert('Ocorreu um erro ao salvar as configurações. Por favor, tente novamente.')
    }
  }
  const applyThemePreset = (preset) => {
    console.log(`Aplicando tema: ${preset}`)

    const root = document.documentElement
    const body = document.body

    switch (preset) {
      case 'default':
        setSettings((prev) => ({
          ...prev,
          colorScheme: 'default',
          highContrast: false,
        }))
        root.setAttribute('data-theme', 'default')
        body.setAttribute('data-theme', 'default')
        root.classList.remove('high-contrast')
        body.classList.remove('high-contrast')

        // Também usar a função de utilitário para salvar a preferência
        saveAccessibilitySettings({
          ...getCurrentSettings(),
          highContrast: false,
          colorScheme: 'default',
        })
        break
      case 'dark':
        setSettings((prev) => ({
          ...prev,
          colorScheme: 'dark',
          highContrast: false,
        }))
        root.setAttribute('data-theme', 'dark')
        body.setAttribute('data-theme', 'dark')
        root.classList.remove('high-contrast')
        body.classList.remove('high-contrast')

        // Também usar a função de utilitário para salvar a preferência
        saveAccessibilitySettings({
          ...getCurrentSettings(),
          highContrast: false,
          colorScheme: 'dark',
        })
        break
      case 'highContrast':
        setSettings((prev) => ({
          ...prev,
          colorScheme: 'default',
          highContrast: true,
        }))
        root.setAttribute('data-theme', 'default')
        body.setAttribute('data-theme', 'default')
        root.classList.add('high-contrast')
        body.classList.add('high-contrast')

        // Também usar a função de utilitário para salvar a preferência
        saveAccessibilitySettings({
          ...getCurrentSettings(),
          highContrast: true,
          colorScheme: 'default',
        })
        break
    }
  }

  return (
    <PanelOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }
      }}
    >
      <Panel
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      >
        <PanelHeader>
          <PanelTitle>
            <span role="img" aria-hidden="true">
              ♿
            </span>{' '}
            Configurações de Acessibilidade
          </PanelTitle>
          <CloseButton onClick={onClose} aria-label="Fechar painel">
            ✕
          </CloseButton>
        </PanelHeader>

        <SettingsGroup>
          <GroupTitle>Aparência</GroupTitle>

          <OptionRow>
            <OptionLabel>
              <span role="img" aria-hidden="true">
                🌓
              </span>{' '}
              Alto Contraste
            </OptionLabel>
            <Switch>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                aria-label="Ativar alto contraste"
              />
              <span className="slider"></span>
            </Switch>
          </OptionRow>

          <OptionRow>
            <OptionLabel>
              <span role="img" aria-hidden="true">
                🎨
              </span>{' '}
              Esquema de Cores
            </OptionLabel>
            <div>
              <Select
                value={settings.colorScheme}
                onChange={(e) => handleSettingChange('colorScheme', e.target.value)}
                aria-label="Selecionar esquema de cores"
              >
                <option value="default">Padrão</option>
                <option value="dark">Escuro</option>
              </Select>
              <ThemePresets>
                <ThemeButton
                  $backgroundColor="#ffffff"
                  $accentColor="#6b48ff"
                  $active={settings.colorScheme === 'default' && !settings.highContrast}
                  onClick={() => applyThemePreset('default')}
                  aria-label="Tema padrão"
                />
                <ThemeButton
                  $backgroundColor="#212121"
                  $accentColor="#6b48ff"
                  $active={settings.colorScheme === 'dark'}
                  onClick={() => applyThemePreset('dark')}
                  aria-label="Tema escuro"
                />
                <ThemeButton
                  $backgroundColor="#ffffff"
                  $accentColor="#000000"
                  $active={settings.highContrast}
                  onClick={() => applyThemePreset('highContrast')}
                  aria-label="Tema alto contraste"
                />
              </ThemePresets>
            </div>
          </OptionRow>
        </SettingsGroup>

        <SettingsGroup>
          <GroupTitle>Texto e Leitura</GroupTitle>

          <OptionRow>
            <OptionLabel>
              <span role="img" aria-hidden="true">
                🧠
              </span>{' '}
              Fonte para Dislexia
            </OptionLabel>
            <Switch>
              <input
                type="checkbox"
                checked={settings.dyslexiaFriendly}
                onChange={(e) => handleSettingChange('dyslexiaFriendly', e.target.checked)}
                aria-label="Ativar fonte para dislexia"
              />
              <span className="slider"></span>
            </Switch>
          </OptionRow>

          <OptionRow>
            <OptionLabel>
              <span role="img" aria-hidden="true">
                🎙️
              </span>{' '}
              Assistência por Voz (TTS)
            </OptionLabel>
            <Switch>
              <input
                type="checkbox"
                checked={settings.textToSpeech}
                onChange={(e) => handleSettingChange('textToSpeech', e.target.checked)}
                aria-label="Ativar texto para fala"
              />
              <span className="slider"></span>
            </Switch>
          </OptionRow>
        </SettingsGroup>

        <SettingsGroup>
          <GroupTitle>Movimento</GroupTitle>

          <OptionRow>
            <OptionLabel>
              <span role="img" aria-hidden="true">
                ✨
              </span>{' '}
              Reduzir Animações
            </OptionLabel>
            <Switch>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                aria-label="Reduzir animações"
              />
              <span className="slider"></span>
            </Switch>
          </OptionRow>
        </SettingsGroup>

        <SaveButton
          onClick={handleSave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={savedSuccessfully ? 'Configurações salvas' : 'Salvar configurações'}
        >
          {savedSuccessfully ? '✓ Salvo com Sucesso!' : 'Salvar Configurações'}
        </SaveButton>
      </Panel>
    </PanelOverlay>
  )
}

export default AccessibilityPanel
