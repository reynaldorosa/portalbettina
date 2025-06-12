import { useCallback, useRef, useEffect, useState } from 'react'
import { isTTSEnabled as checkTTSEnabled } from '../utils/tts/ttsManager.js'
import { logTTSEvent } from '../utils/tts/ttsDebug.js'

/**
 * Hook personalizado para Text-to-Speech (TTS)
 * Converte automaticamente textos em áudio para melhor acessibilidade
 * Com opção de ativação/desativação baseada nas configurações de acessibilidade
 */
const useTTS = () => {
  const utteranceRef = useRef(null)
  const isInitializedRef = useRef(false)
  const speechQueueRef = useRef([])
  const isSpeakingRef = useRef(false)
  // Estado para controlar se o TTS está habilitado
  const [isTTSEnabled, setIsTTSEnabled] = useState(checkTTSEnabled())
  const checkAttemptsRef = useRef(0)

  // Inicializar TTS e carregar configuração
  useEffect(() => {
    // Verificar se o navegador suporta TTS
    if ('speechSynthesis' in window && !isInitializedRef.current) {
      // Aguardar carregamento das vozes
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          isInitializedRef.current = true
          console.log(`useTTS - TTS inicializado com ${voices.length} vozes disponíveis`)
        }
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    // Atualizar estado com base na configuração atual
    const currentEnabled = checkTTSEnabled()
    console.log(`useTTS - Carregando configuração inicial. TTS Enabled: ${currentEnabled}`)
    setIsTTSEnabled(currentEnabled)

    // Realizar verificações periódicas para garantir que a configuração esteja sincronizada
    // Isso ajuda em casos onde o localStorage pode mudar por outros componentes
    const syncCheckInterval = setInterval(() => {
      checkAttemptsRef.current += 1
      const latestSetting = checkTTSEnabled()

      if (checkAttemptsRef.current <= 5) {
        console.log(
          `useTTS - Verificação periódica #${checkAttemptsRef.current} do estado TTS: ${latestSetting}`
        )
      }

      // Se a configuração local for diferente da armazenada, sincronizar
      if (isTTSEnabled !== latestSetting) {
        console.log(
          `useTTS - Sincronizando estado local (${isTTSEnabled}) com localStorage (${latestSetting})`
        )
        setIsTTSEnabled(latestSetting)
      }
    }, 2000)
    const cleanup = () => {
      clearInterval(syncCheckInterval)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('tts-settings-changed', handleTTSSettingsChange)
    }
    // Observar mudanças…
    // Observar mudanças nas configurações de acessibilidade
    const handleStorageChange = (event) => {
      if (event.key === 'betina_accessibility_settings' || event.key === 'betina_tts_enabled') {
        const newEnabled = checkTTSEnabled()
        console.log(`useTTS - Storage changed. New TTS Enabled: ${newEnabled}`)
        setIsTTSEnabled(newEnabled)

        // Se o TTS for desativado, parar qualquer fala em andamento
        if (!newEnabled && window.speechSynthesis) {
          console.log('useTTS - Storage change causou cancelamento da fala')
          window.speechSynthesis.cancel()
        }

        logTTSEvent({
          type: 'settings_changed',
          source: 'storage_event',
          enabled: newEnabled,
          key: event.key,
        })
      }
    }

    // Observar evento personalizado de mudança nas configurações de TTS
    const handleTTSSettingsChange = (event) => {
      // Forçar leitura da configuração mais recente
      const newEnabled = checkTTSEnabled()
      console.log(`useTTS - TTS settings changed event. New TTS Enabled: ${newEnabled}`)
      setIsTTSEnabled(newEnabled)

      // Se o TTS for desativado, parar qualquer fala em andamento
      if (!newEnabled && window.speechSynthesis) {
        console.log('useTTS - Evento de configurações causou cancelamento da fala')
        window.speechSynthesis.cancel()
      }

      logTTSEvent({
        type: 'settings_changed',
        source: 'custom_event',
        enabled: newEnabled,
        eventDetail: event.detail || {},
      })
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('tts-settings-changed', handleTTSSettingsChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('tts-settings-changed', handleTTSSettingsChange)
    }
  }, [])

  // Função para processar fila de TTS
  const processQueue = useCallback(() => {
    if (isSpeakingRef.current || speechQueueRef.current.length === 0) {
      return
    }

    const { text, options } = speechQueueRef.current.shift()
    isSpeakingRef.current = true

    // Verificar novamente se TTS está habilitado
    if (!checkTTSEnabled()) {
      isSpeakingRef.current = false
      processQueue() // Processar próximo item
      return
    }

    try {
      // Configurações padrão
      const config = {
        lang: 'pt-BR',
        rate: 0.8,
        pitch: 1.0,
        volume: 0.8,
        ...options,
      }

      // Criar utterance
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = config.lang
      utterance.rate = config.rate
      utterance.pitch = config.pitch
      utterance.volume = config.volume

      // Tentar usar voz em português
      const voices = window.speechSynthesis.getVoices()
      const portugueseVoice = voices.find(
        (voice) =>
          voice.lang.startsWith('pt') ||
          voice.name.toLowerCase().includes('portuguese') ||
          voice.name.toLowerCase().includes('brasil')
      )

      if (portugueseVoice) {
        utterance.voice = portugueseVoice
      }

      // Event handlers
      utterance.onstart = () => {
        logTTSEvent({
          type: 'speech_started',
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
          options: config,
        })
        console.log('TTS iniciado:', text.substring(0, 50))
      }

      utterance.onend = () => {
        logTTSEvent({
          type: 'speech_ended',
          success: true,
        })
        console.log('TTS finalizado')
        isSpeakingRef.current = false
        // Processar próximo item da fila
        setTimeout(processQueue, 100)
      }

      utterance.onerror = (event) => {
        // Não logar erro "interrupted" como erro, pois é comum e esperado
        if (event.error === 'interrupted') {
          logTTSEvent({
            type: 'speech_interrupted',
            reason: 'normal_interruption',
          })
          console.log('TTS interrompido (normal)')
        } else {
          logTTSEvent({
            type: 'speech_error',
            error: event.error,
          })
          console.error('Erro no TTS:', event.error)
        }
        isSpeakingRef.current = false
        // Processar próximo item da fila
        setTimeout(processQueue, 100)
      }

      // Armazenar referência e iniciar fala
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      logTTSEvent({
        type: 'speech_exception',
        error: error.message,
      })
      console.error('Erro ao executar TTS:', error)
      isSpeakingRef.current = false
      setTimeout(processQueue, 100)
    }
  }, [])

  // Função principal para falar texto
  const speak = useCallback(
    (text, options = {}) => {
      // Obter a configuração mais recente diretamente
      const currentTTSEnabled = checkTTSEnabled()

      console.log(`useTTS.speak - Verificando TTS estado atual: ${currentTTSEnabled}`)

      // Verificar se o TTS está habilitado nas configurações mais recentes
      if (!currentTTSEnabled) {
        console.log('TTS está desativado, não reproduzindo texto:', text?.substring(0, 30))
        logTTSEvent({
          type: 'speak_blocked',
          reason: 'tts_disabled',
          text: text?.substring(0, 50) + (text?.length > 50 ? '...' : ''),
        })
        return
      }

      if (!text || typeof text !== 'string' || text.trim() === '') {
        console.log('Texto inválido para TTS:', text)
        logTTSEvent({
          type: 'speak_blocked',
          reason: 'invalid_text',
          text,
        })
        return
      }

      // Verificar suporte do navegador
      if (!('speechSynthesis' in window)) {
        logTTSEvent({
          type: 'speak_blocked',
          reason: 'browser_unsupported',
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        })
        return
      }

      // Adicionar à fila e processar
      speechQueueRef.current.push({ text, options })
      processQueue()
    },
    [processQueue]
  )

  // Parar fala atual
  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      // Limpar a fila de falas pendentes
      speechQueueRef.current = []
      isSpeakingRef.current = false
      logTTSEvent({
        type: 'speech_stopped',
      })
    }
  }, [])

  // Verificar se está falando
  const isSpeaking = useCallback(() => {
    return window.speechSynthesis ? window.speechSynthesis.speaking : false
  }, [])

  // Funções específicas para diferentes tipos de conteúdo
  const speakInstruction = useCallback(
    (text) => {
      speak(text, { rate: 0.7, pitch: 1.1 })
    },
    [speak]
  )

  const speakFeedback = useCallback(
    (text, isSuccess = true) => {
      const config = isSuccess ? { rate: 0.8, pitch: 1.2 } : { rate: 0.7, pitch: 0.9 }
      speak(text, config)
    },
    [speak]
  )

  const speakQuestion = useCallback(
    (text) => {
      speak(text, { rate: 0.7, pitch: 1.0 })
    },
    [speak]
  )

  const speakOption = useCallback(
    (text) => {
      speak(text, { rate: 0.8, pitch: 1.0 })
    },
    [speak]
  )

  const speakNumber = useCallback(
    (number) => {
      speak(number.toString(), { rate: 0.8, pitch: 1.2 })
    },
    [speak]
  )

  const speakLetter = useCallback(
    (letter) => {
      speak(letter, { rate: 0.8, pitch: 1.2 })
    },
    [speak]
  )

  const speakWord = useCallback(
    (word) => {
      speak(word, { rate: 0.7, pitch: 1.1 })
    },
    [speak]
  )

  const speakColor = useCallback(
    (color) => {
      speak(color, { rate: 0.8, pitch: 1.1 })
    },
    [speak]
  )

  // Função para falar automaticamente textos de interface
  const autoSpeak = useCallback(
    (text, delay = 500) => {
      if (!text) return

      setTimeout(() => {
        speak(text)
      }, delay)
    },
    [speak]
  )

  return {
    speak,
    stop,
    isSpeaking,
    speakInstruction,
    speakFeedback,
    speakQuestion,
    speakOption,
    speakNumber,
    speakLetter,
    speakWord,
    speakColor,
    autoSpeak,
    isTTSEnabled, // Expondo o estado para os componentes que usam o hook
  }
}

export default useTTS
