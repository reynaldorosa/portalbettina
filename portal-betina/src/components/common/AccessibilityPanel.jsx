import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import { setTTSEnabled } from '../../utils/ttsManager';

// Estilos para o painel de acessibilidade
const AccessibilityButton = styled(motion.button)`
  position: fixed;
  bottom: 70px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary-blue);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: var(--shadow-medium);
  z-index: 1000;
  
  &:hover {
    background: var(--primary-purple);
  }
`;

const PanelOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Panel = styled(motion.div)`
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-large);
  max-height: 80vh;
  overflow-y: auto;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  border-bottom: 1px solid var(--light-gray);
  padding-bottom: var(--space-md);
`;

const PanelTitle = styled.h2`
  font-size: var(--font-size-lg);
  color: var(--primary-purple);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--medium-gray);
  cursor: pointer;
  
  &:hover {
    color: var(--primary-blue);
  }
`;

const SettingsGroup = styled.div`
  margin-bottom: var(--space-lg);
`;

const GroupTitle = styled.h3`
  font-size: var(--font-size-md);
  margin-bottom: var(--space-md);
  color: var(--primary-blue);
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px dashed var(--light-gray);
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--font-size-md);
`;

const Switch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--medium-gray);
    transition: .4s;
    border-radius: 24px;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .slider {
    background-color: var(--primary-green);
  }
  
  input:focus + .slider {
    box-shadow: 0 0 1px var(--primary-green);
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
`;

const RangeSlider = styled.input`
  width: 150px;
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: var(--light-gray);
  border-radius: 4px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: var(--primary-blue);
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: var(--primary-blue);
    border-radius: 50%;
    cursor: pointer;
  }
`;

const ColorPreview = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background-color: ${props => props.color};
  cursor: pointer;
  border: 2px solid var(--light-gray);
`;

const ThemePresets = styled.div`
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
`;

const ThemeButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.$backgroundColor || 'white'};
  border: 2px solid ${props => props.$active ? 'var(--primary-blue)' : 'var(--light-gray)'};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    right: 0;
    background: ${props => props.$accentColor || 'white'};
  }
  
  &:hover {
    transform: scale(1.1);
  }
`;

const SaveButton = styled(motion.button)`
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: var(--space-lg);
  
  &:hover {
    background: var(--primary-purple);
  }
`;

const FontSizeDemo = styled.div`
  margin-top: var(--space-sm);
  padding: var(--space-sm);
  border: 1px dashed var(--light-gray);
  border-radius: var(--radius-medium);
  font-size: ${props => props.size}px;
`;

const Select = styled.select`
  padding: var(--space-sm);
  border-radius: var(--radius-medium);
  border: 1px solid var(--light-gray);
  width: 150px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: var(--space-md);
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  cursor: pointer;
`;

// Componente de AccessibilityPanel
const AccessibilityPanel = ({ onClose = () => {} }) => {  const { userId, isDbConnected, userDetails, updateUser } = useUser();  const [settings, setSettings] = useState({
    highContrast: false,
    largeFonts: false,
    reducedMotion: false,
    soundEffects: true,
    textToSpeech: true, // Configuração para ativar/desativar a assistência por voz
    colorScheme: 'default',
    fontSize: 16,
    cursorSize: 'normal',
    focusIndicators: true,
    keyboardNavigation: true,
    screenReaderMode: false,
    textSpacing: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    dyslexiaFriendly: false,
  });
    const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  // Carregar configurações do usuário
  useEffect(() => {
    if (userDetails && userDetails.preferences?.accessibility) {
      setSettings({
        ...settings,
        ...userDetails.preferences.accessibility
      });
    }
  }, [userDetails]);

  // Fechar com tecla ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Aplicar configurações ao documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar alto contraste
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Aplicar fontes grandes
    if (settings.largeFonts) {
      root.style.fontSize = '110%';
    } else {
      root.style.fontSize = '100%';
    }
    
    // Aplicar animações reduzidas
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    // Aplicar esquema de cores
    root.setAttribute('data-theme', settings.colorScheme);
    
    // Aplicar fonte para dislexia
    if (settings.dyslexiaFriendly) {
      root.classList.add('dyslexia-friendly');
    } else {
      root.classList.remove('dyslexia-friendly');
    }
    
    // Aplicar espaçamento de texto
    root.style.setProperty('--text-spacing', settings.textSpacing === 'wide' ? '1px' : '0');
    root.style.setProperty('--line-height', 
      settings.lineHeight === 'loose' ? '1.8' : 
      settings.lineHeight === 'tight' ? '1.2' : '1.5');
    root.style.setProperty('--letter-spacing', 
      settings.letterSpacing === 'wide' ? '0.5px' : 
      settings.letterSpacing === 'tight' ? '-0.5px' : '0px');
    
  }, [settings]);
  // Manipular mudanças nas configurações
  const handleSettingChange = (key, value) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [key]: value
      };
        // Se a configuração de TTS for alterada, aplicar imediatamente
      if (key === 'textToSpeech') {
        // Atualizar a configuração no localStorage e disparar o evento
        setTTSEnabled(value);
      }
      
      return newSettings;
    });
  };  // Salvar configurações
  const handleSave = async () => {
    // Atualizar a configuração de TTS imediatamente no localStorage
    setTTSEnabled(settings.textToSpeech);
    
    if (!userId) return;
    
    try {
      // Atualizar preferências do usuário
      const currentPrefs = userDetails?.preferences || {};
      const updatedPrefs = {
        ...currentPrefs,
        accessibility: settings
      };
      // Salvar no banco de dados se estiver conectado
      if (isDbConnected) {
        await updateUser(userId, { preferences: updatedPrefs });
      } 
      
      // Sempre salvar localmente para acesso rápido
      localStorage.setItem('betina_accessibility_settings', JSON.stringify(settings));
      
      // Disparar evento para notificar componentes que estão observando
      window.dispatchEvent(new Event('tts-settings-changed'));
      
      // Mostrar feedback de sucesso
      setSavedSuccessfully(true);
      setTimeout(() => setSavedSuccessfully(false), 3000);
      
    } catch (error) {
      console.error('Erro ao salvar configurações de acessibilidade:', error);
    }
  };

  // Aplicar tema predefinido
  const applyThemePreset = (preset) => {
    switch (preset) {
      case 'default':
        setSettings(prev => ({
          ...prev,
          colorScheme: 'default',
          highContrast: false,
        }));
        break;
      case 'dark':
        setSettings(prev => ({
          ...prev,
          colorScheme: 'dark',
          highContrast: false,
        }));
        break;
      case 'highContrast':
        setSettings(prev => ({
          ...prev,
          colorScheme: 'default',
          highContrast: true,
        }));
        break;
      case 'warm':
        setSettings(prev => ({
          ...prev,
          colorScheme: 'warm',
          highContrast: false,
        }));
        break;
      case 'cool':
        setSettings(prev => ({
          ...prev,
          colorScheme: 'cool',
          highContrast: false,
        }));
        break;
    }
  };
  return (
    <PanelOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      }}
    >
      <Panel
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <PanelHeader>
          <PanelTitle>
            <span role="img" aria-hidden="true">♿</span> Configurações de Acessibilidade
          </PanelTitle>          <CloseButton 
            onClick={onClose} 
            aria-label="Fechar painel"
          >
            ✕
          </CloseButton>
        </PanelHeader>

              <SettingsGroup>
                <GroupTitle>Aparência</GroupTitle>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">🌓</span> Alto Contraste
                  </OptionLabel>
                  <Switch>
                    <input
                      type="checkbox"
                      checked={settings.highContrast}
                      onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </Switch>
                </OptionRow>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">🔤</span> Fontes Grandes
                  </OptionLabel>
                  <Switch>
                    <input
                      type="checkbox"
                      checked={settings.largeFonts}
                      onChange={(e) => handleSettingChange('largeFonts', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </Switch>
                </OptionRow>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">🎨</span> Esquema de Cores
                  </OptionLabel>
                  <div>
                    <Select 
                      value={settings.colorScheme} 
                      onChange={(e) => handleSettingChange('colorScheme', e.target.value)}
                    >
                      <option value="default">Padrão</option>
                      <option value="dark">Escuro</option>
                      <option value="warm">Quente</option>
                      <option value="cool">Frio</option>
                    </Select>
                    <ThemePresets>
                      <ThemeButton 
                        $backgroundColor="#ffffff" 
                        $accentColor="#6a11cb"
                        $active={settings.colorScheme === 'default' && !settings.highContrast}
                        onClick={() => applyThemePreset('default')}
                        aria-label="Tema padrão"
                      />
                      <ThemeButton 
                        $backgroundColor="#212121" 
                        $accentColor="#6a11cb"
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
                      <ThemeButton 
                        $backgroundColor="#fff9e6" 
                        $accentColor="#e67700"
                        $active={settings.colorScheme === 'warm'}
                        onClick={() => applyThemePreset('warm')}
                        aria-label="Tema quente"
                      />
                      <ThemeButton 
                        $backgroundColor="#e6f7ff" 
                        $accentColor="#0077cc"
                        $active={settings.colorScheme === 'cool'}
                        onClick={() => applyThemePreset('cool')}
                        aria-label="Tema frio"
                      />
                    </ThemePresets>
                  </div>
                </OptionRow>
              </SettingsGroup>
              
              <SettingsGroup>
                <GroupTitle>Texto e Leitura</GroupTitle>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">📏</span> Tamanho da Fonte
                  </OptionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <RangeSlider 
                      type="range" 
                      min="14" 
                      max="24" 
                      value={settings.fontSize} 
                      onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                    />
                    <FontSizeDemo size={settings.fontSize}>
                      Exemplo de texto
                    </FontSizeDemo>
                  </div>
                </OptionRow>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">🧠</span> Modo Amigável para Dislexia
                  </OptionLabel>
                  <Switch>
                    <input
                      type="checkbox"
                      checked={settings.dyslexiaFriendly}
                      onChange={(e) => handleSettingChange('dyslexiaFriendly', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </Switch>
                </OptionRow>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">📝</span> Espaçamento do Texto
                  </OptionLabel>
                  <Select 
                    value={settings.textSpacing} 
                    onChange={(e) => handleSettingChange('textSpacing', e.target.value)}
                  >
                    <option value="normal">Normal</option>
                    <option value="wide">Expandido</option>
                  </Select>
                </OptionRow>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">↕️</span> Altura da Linha
                  </OptionLabel>
                  <Select 
                    value={settings.lineHeight} 
                    onChange={(e) => handleSettingChange('lineHeight', e.target.value)}
                  >
                    <option value="normal">Normal</option>
                    <option value="loose">Espaçado</option>
                    <option value="tight">Compacto</option>
                  </Select>
                </OptionRow>
              </SettingsGroup>
              
              <SettingsGroup>
                <GroupTitle>Som e Mídia</GroupTitle>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">🔊</span> Efeitos Sonoros
                  </OptionLabel>
                  <Switch>
                    <input
                      type="checkbox"
                      checked={settings.soundEffects}
                      onChange={(e) => handleSettingChange('soundEffects', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </Switch>
                </OptionRow>
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">🎙️</span> Assistência por Voz
                  </OptionLabel>
                  <Switch>
                    <input
                      type="checkbox"
                      checked={settings.textToSpeech}
                      onChange={(e) => handleSettingChange('textToSpeech', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </Switch>
                </OptionRow>
              </SettingsGroup>
              
              <SettingsGroup>
                <GroupTitle>Movimento e Interação</GroupTitle>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">✨</span> Reduzir Animações
                  </OptionLabel>
                  <Switch>
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </Switch>
                </OptionRow>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">👆</span> Tamanho do Cursor
                  </OptionLabel>
                  <Select 
                    value={settings.cursorSize} 
                    onChange={(e) => handleSettingChange('cursorSize', e.target.value)}
                  >
                    <option value="normal">Normal</option>
                    <option value="large">Grande</option>
                    <option value="xl">Extra Grande</option>
                  </Select>
                </OptionRow>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">🔍</span> Indicadores de Foco Visíveis
                  </OptionLabel>
                  <Switch>
                    <input
                      type="checkbox"
                      checked={settings.focusIndicators}
                      onChange={(e) => handleSettingChange('focusIndicators', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </Switch>
                </OptionRow>
                
                <OptionRow>
                  <OptionLabel>
                    <span role="img" aria-hidden="true">⌨️</span> Navegação por Teclado
                  </OptionLabel>
                  <Switch>
                    <input
                      type="checkbox"
                      checked={settings.keyboardNavigation}
                      onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </Switch>
                </OptionRow>
              </SettingsGroup>

              <SaveButton 
                onClick={handleSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {savedSuccessfully ? '✓ Salvo com Sucesso!' : 'Salvar Configurações'}
              </SaveButton>        </Panel>
      </PanelOverlay>
  );
};

export default AccessibilityPanel;
