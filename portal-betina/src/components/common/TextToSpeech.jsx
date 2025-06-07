import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const SpeechButton = styled(motion.button)`
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: var(--shadow-medium);
  position: relative;
  
  &:hover {
    background: var(--primary-purple);
    transform: scale(1.1);
  }
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Animação quando falando */
  ${props => props.$speaking && `
    background: var(--primary-green);
    animation: pulse 1s infinite;
  `}
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`

const TextToSpeech = ({ 
  text, 
  voice = null, 
  rate = 0.9, 
  pitch = 1,
  size = 'medium',
  ariaLabel = null 
}) => {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)

  const speak = useCallback(() => {
    // Verificar suporte do navegador
    if (!('speechSynthesis' in window)) {
      setSupported(false)
      console.warn('Text-to-Speech não é suportado neste navegador')
      return
    }

    // Parar qualquer fala em andamento
    window.speechSynthesis.cancel()

    if (!text || text.trim() === '') {
      return
    }

    setSpeaking(true)

    // Criar utterance
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Configurar propriedades da voz
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = 1
    
    // Tentar definir voz em português se disponível
    const voices = window.speechSynthesis.getVoices()
    const portugueseVoice = voices.find(voice => 
      voice.lang.startsWith('pt') || voice.name.includes('Portuguese')
    )
    
    if (voice) {
      utterance.voice = voice
    } else if (portugueseVoice) {
      utterance.voice = portugueseVoice
    }

    // Eventos da utterance
    utterance.onstart = () => {
      setSpeaking(true)
    }

    utterance.onend = () => {
      setSpeaking(false)
    }

    utterance.onerror = (event) => {
      console.error('Erro no Text-to-Speech:', event.error)
      setSpeaking(false)
    }

    // Iniciar fala
    window.speechSynthesis.speak(utterance)
  }, [text, voice, rate, pitch])

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [])

  const handleClick = () => {
    if (speaking) {
      stopSpeaking()
    } else {
      speak()
    }
  }

  if (!supported) {
    return null // Não renderizar se não suportado
  }

  const buttonSize = size === 'small' ? '32px' : size === 'large' ? '48px' : '40px'
  const fontSize = size === 'small' ? '1rem' : size === 'large' ? '1.4rem' : '1.2rem'

  return (
    <SpeechButton
      onClick={handleClick}
      $speaking={speaking}
      aria-label={ariaLabel || `${speaking ? 'Parar' : 'Ouvir'} texto: ${text.substring(0, 50)}...`}
      title={speaking ? 'Parar leitura' : 'Ouvir texto'}
      style={{ 
        width: buttonSize, 
        height: buttonSize, 
        fontSize: fontSize 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {speaking ? '⏸️' : '🔊'}
    </SpeechButton>
  )
}

export default TextToSpeech
