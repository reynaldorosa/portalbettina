import { useCallback, useRef, useEffect, useState } from 'react';
import { isTTSEnabled as checkTTSEnabled } from '../utils/ttsManager';
import { logTTSEvent } from '../utils/ttsDebug';

/**
 * Hook personalizado para Text-to-Speech (TTS)
 * Converte automaticamente textos em áudio para melhor acessibilidade
 * Com opção de ativação/desativação baseada nas configurações de acessibilidade
 */
const useTTS = () => {
  const utteranceRef = useRef(null);
  const isInitializedRef = useRef(false);
  // Estado para controlar se o TTS está habilitado
  const [isTTSEnabled, setIsTTSEnabled] = useState(checkTTSEnabled());

  // Inicializar TTS e carregar configuração
  useEffect(() => {
    // Verificar se o navegador suporta TTS
    if ('speechSynthesis' in window && !isInitializedRef.current) {
      // Aguardar carregamento das vozes
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          isInitializedRef.current = true;
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Atualizar estado com base na configuração atual
    setIsTTSEnabled(checkTTSEnabled());
    
    // Observar mudanças nas configurações de acessibilidade
    const handleStorageChange = (event) => {
      if (event.key === 'betina_accessibility_settings') {
        setIsTTSEnabled(checkTTSEnabled());
      }
    };
    
    // Observar evento personalizado de mudança nas configurações de TTS
    const handleTTSSettingsChange = () => {
      setIsTTSEnabled(checkTTSEnabled());
      
      logTTSEvent({
        type: 'settings_changed',
        source: 'custom_event',
        enabled: checkTTSEnabled()
      });
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tts-settings-changed', handleTTSSettingsChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tts-settings-changed', handleTTSSettingsChange);
    };
  }, []);

  // Função principal para falar texto
  const speak = useCallback((text, options = {}) => {
    // Obter a configuração mais recente diretamente
    const currentTTSEnabled = checkTTSEnabled();
    
    // Verificar se o TTS está habilitado nas configurações mais recentes
    if (!currentTTSEnabled) {
      logTTSEvent({
        type: 'speak_blocked',
        reason: 'tts_disabled',
        text: text?.substring(0, 50) + (text?.length > 50 ? '...' : '')
      });
      return;
    }
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      logTTSEvent({
        type: 'speak_blocked',
        reason: 'invalid_text',
        text
      });
      return;
    }

    // Verificar suporte do navegador
    if (!('speechSynthesis' in window)) {
      logTTSEvent({
        type: 'speak_blocked',
        reason: 'browser_unsupported',
        text: text.substring(0, 50) + (text.length > 50 ? '...' : '')
      });
      return;
    }

    try {
      // Cancelar qualquer fala em andamento
      window.speechSynthesis.cancel();

      // Configurações padrão
      const config = {
        lang: 'pt-BR',
        rate: 0.8,
        pitch: 1.0,
        volume: 0.8,
        ...options
      };

      // Criar utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = config.lang;
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;

      // Tentar usar voz em português
      const voices = window.speechSynthesis.getVoices();
      const portugueseVoice = voices.find(voice => 
        voice.lang.startsWith('pt') || 
        voice.name.toLowerCase().includes('portuguese') ||
        voice.name.toLowerCase().includes('brasil')
      );

      if (portugueseVoice) {
        utterance.voice = portugueseVoice;
      }

      // Event handlers
      utterance.onstart = () => {
        logTTSEvent({
          type: 'speech_started',
          text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
          options: config
        });
        console.log('TTS iniciado:', text.substring(0, 50));
      };

      utterance.onend = () => {
        logTTSEvent({
          type: 'speech_ended',
          success: true
        });
        console.log('TTS finalizado');
      };

      utterance.onerror = (event) => {
        logTTSEvent({
          type: 'speech_error',
          error: event.error
        });
        console.error('Erro no TTS:', event.error);
      };

      // Armazenar referência e iniciar fala
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      logTTSEvent({
        type: 'speech_exception',
        error: error.message
      });
      console.error('Erro ao executar TTS:', error);
    }
  }, []);

  // Parar fala atual
  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      logTTSEvent({
        type: 'speech_stopped'
      });
    }
  }, []);

  // Verificar se está falando
  const isSpeaking = useCallback(() => {
    return window.speechSynthesis ? window.speechSynthesis.speaking : false;
  }, []);

  // Funções específicas para diferentes tipos de conteúdo
  const speakInstruction = useCallback((text) => {
    speak(text, { rate: 0.7, pitch: 1.1 });
  }, [speak]);

  const speakFeedback = useCallback((text, isSuccess = true) => {
    const config = isSuccess 
      ? { rate: 0.8, pitch: 1.2 } 
      : { rate: 0.7, pitch: 0.9 };
    speak(text, config);
  }, [speak]);

  const speakQuestion = useCallback((text) => {
    speak(text, { rate: 0.7, pitch: 1.0 });
  }, [speak]);

  const speakOption = useCallback((text) => {
    speak(text, { rate: 0.8, pitch: 1.0 });
  }, [speak]);

  const speakNumber = useCallback((number) => {
    speak(number.toString(), { rate: 0.8, pitch: 1.2 });
  }, [speak]);

  const speakLetter = useCallback((letter) => {
    speak(letter, { rate: 0.8, pitch: 1.2 });
  }, [speak]);

  const speakWord = useCallback((word) => {
    speak(word, { rate: 0.7, pitch: 1.1 });
  }, [speak]);

  const speakColor = useCallback((color) => {
    speak(color, { rate: 0.8, pitch: 1.1 });
  }, [speak]);

  // Função para falar automaticamente textos de interface
  const autoSpeak = useCallback((text, delay = 500) => {
    if (!text) return;
    
    setTimeout(() => {
      speak(text);
    }, delay);
  }, [speak]);

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
    isTTSEnabled // Expondo o estado para os componentes que usam o hook
  };
};

export default useTTS;
