import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

// Constantes para tamanhos
const SIZES = {
  small: { width: '32px', height: '32px', fontSize: '1rem' },
  medium: { width: '40px', height: '40px', fontSize: '1.2rem' },
  large: { width: '48px', height: '48px', fontSize: '1.4rem' }
};

const SpeechButton = styled(motion.button)`
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 50%;
  width: ${({ $size }) => SIZES[$size]?.width || SIZES.medium.width};
  height: ${({ $size }) => SIZES[$size]?.height || SIZES.medium.height};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: ${({ $size }) => SIZES[$size]?.fontSize || SIZES.medium.fontSize};
  box-shadow: var(--shadow-medium);
  position: relative;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover:enabled {
    background: var(--primary-purple);
    transform: scale(1.1);
  }

  &:focus-visible {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $speaking }) =>
    $speaking &&
    `
    background: var(--primary-green);
    animation: pulse 1s infinite;
  `}

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const TextToSpeech = ({ 
  text = '', 
  voice = null, 
  rate = 0.9, 
  pitch = 1, 
  size = 'medium', 
  ariaLabel = null,
  onStart = null,
  onEnd = null,
  onError = null 
}) => {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [error, setError] = useState(null);
  const utteranceRef = useRef(null);
  
  // Memoizar a verificação de suporte
  const supported = useMemo(() => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }, []);

  // Memoizar a voz portuguesa
  const portugueseVoice = useMemo(() => {
    return voices.find(v => 
      v.lang.startsWith('pt') || 
      v.name.toLowerCase().includes('portuguese') ||
      v.name.toLowerCase().includes('brasil')
    );
  }, [voices]);
  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Função para verificar se as vozes já estão carregadas
    const checkVoicesLoaded = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        return true;
      }
      return false;
    };

    // Tentar carregar vozes imediatamente
    if (!checkVoicesLoaded()) {
      // Se não houver vozes, aguardar o evento
      const handleVoicesChanged = () => {
        loadVoices();
      };
      
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, [supported]);
  // Cleanup quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (supported && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  const speak = useCallback(() => {
    if (!supported || !text.trim()) {
      return;
    }

    // Parar qualquer fala anterior
    window.speechSynthesis.cancel();
    setError(null);

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.rate = Math.max(0.1, Math.min(rate, 2)); // Clamp rate to valid range
    utterance.pitch = Math.max(0, Math.min(pitch, 2)); // Clamp pitch to valid range
    utterance.volume = 1;
    utterance.lang = 'pt-BR'; // Definir idioma explicitamente

    // Usar a voz especificada, ou a portuguesa, ou a padrão
    utterance.voice = voice || portugueseVoice || null;

    utterance.onstart = () => {
      setSpeaking(true);
      onStart?.(utterance);
    };
    
    utterance.onend = () => {
      setSpeaking(false);
      utteranceRef.current = null;
      onEnd?.(utterance);
    };
    
    utterance.onerror = (event) => {
      console.error('Text-to-Speech error:', event.error);
      const errorMessage = `Erro de Text-to-Speech: ${event.error}`;
      setError(errorMessage);
      setSpeaking(false);
      utteranceRef.current = null;
      onError?.(event);
    };

    utteranceRef.current = utterance;
    
    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Erro ao iniciar Text-to-Speech:', err);
      setError('Erro ao iniciar a leitura');
      setSpeaking(false);
    }
  }, [text, voice, rate, pitch, supported, portugueseVoice, onStart, onEnd, onError]);
  const stopSpeaking = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setError(null);
      utteranceRef.current = null;
    }
  }, [supported]);

  const handleClick = useCallback(() => {
    if (speaking) {
      stopSpeaking();
    } else {
      speak();
    }
  }, [speaking, speak, stopSpeaking]);

  // Gerar aria-label mais descritivo
  const generateAriaLabel = useCallback(() => {
    if (ariaLabel) return ariaLabel;
    
    const action = speaking ? 'Parar' : 'Ouvir';
    const textPreview = text.length > 50 ? `${text.substring(0, 50)}...` : text;
    return `${action} texto: ${textPreview}`;
  }, [ariaLabel, speaking, text]);

  if (!supported) {
    return null;
  }
  return (
    <>
      <SpeechButton
        onClick={handleClick}
        $speaking={speaking}
        $size={size}
        disabled={!text.trim()}
        aria-label={generateAriaLabel()}
        title={speaking ? 'Parar leitura' : 'Ouvir texto'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        role="button"
        aria-pressed={speaking}
      >
        {speaking ? '⏸️' : '🔊'}
      </SpeechButton>
      {error && (
        <div role="alert" style={{ 
          position: 'absolute', 
          left: '-10000px', 
          width: '1px', 
          height: '1px', 
          overflow: 'hidden' 
        }}>
          {error}
        </div>
      )}
    </>
  );
};

// PropTypes para validação
TextToSpeech.propTypes = {
  text: PropTypes.string,
  voice: PropTypes.object,
  rate: PropTypes.number,
  pitch: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  ariaLabel: PropTypes.string,
  onStart: PropTypes.func,
  onEnd: PropTypes.func,
  onError: PropTypes.func
};

export default TextToSpeech;