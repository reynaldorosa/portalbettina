import { useRef, useCallback, useEffect } from 'react'
import { playGeneratedSound, SOUNDS } from '../utils/audio/audioGenerator.js'

// Contexto de áudio compartilhado para evitar múltiplas instâncias
let sharedAudioContext = null
let isAudioInitialized = false

const getAudioContext = async () => {
  if (!sharedAudioContext) {
    try {
      sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn('AudioContext não suportado:', error)
      return null
    }
  }

  // Retomar contexto se estiver suspenso
  if (sharedAudioContext.state === 'suspended') {
    try {
      await sharedAudioContext.resume()
      console.log('AudioContext retomado com sucesso')
    } catch (error) {
      console.warn('Erro ao retomar AudioContext:', error)
    }
  }

  return sharedAudioContext
}

// Inicializar áudio após primeira interação do usuário
const initializeAudio = async () => {
  if (!isAudioInitialized) {
    const context = await getAudioContext()
    if (context && context.state === 'running') {
      isAudioInitialized = true
      console.log('Sistema de áudio inicializado com sucesso')
    }
  }
}

const useSound = () => {
  const audioRef = useRef(new Map())

  // Inicializar áudio na primeira renderização
  useEffect(() => {
    const handleFirstInteraction = async () => {
      await initializeAudio()
      // Remover listeners após primeira interação
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }

    // Adicionar listeners para primeira interação do usuário
    document.addEventListener('click', handleFirstInteraction, { once: true })
    document.addEventListener('touchstart', handleFirstInteraction, { once: true })
    document.addEventListener('keydown', handleFirstInteraction, { once: true })

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [])

  const preloadSound = useCallback((name, url) => {
    if (!audioRef.current.has(name)) {
      const audio = new Audio(url)
      audio.preload = 'auto'
      // Adicionar event listeners para debug
      audio.addEventListener('canplaythrough', () => {
        console.log(`Som ${name} carregado com sucesso`)
      })
      audio.addEventListener('error', (e) => {
        console.warn(`Erro ao carregar som ${name}:`, e)
      })
      audioRef.current.set(name, audio)
    }
  }, [])

  const playSound = useCallback(async (name, volume = 0.5) => {
    await initializeAudio() // Garantir que o áudio está inicializado

    const audio = audioRef.current.get(name)
    if (audio) {
      try {
        audio.volume = volume
        audio.currentTime = 0
        await audio.play()
        console.log(`Som ${name} reproduzido com sucesso`)
      } catch (error) {
        console.warn(`Erro ao reproduzir som ${name}:`, error)
      }
    }
  }, [])

  const stopSound = useCallback((name) => {
    const audio = audioRef.current.get(name)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  const stopAllSounds = useCallback(() => {
    audioRef.current.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }, []) // Sons pré-configurados para feedback
  const playSuccess = useCallback(async () => {
    try {
      const audioContext = await getAudioContext()
      if (!audioContext) return

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)

      console.log('Som de sucesso reproduzido')
    } catch (error) {
      console.warn('Erro no áudio de sucesso:', error)
    }
  }, [])

  const playError = useCallback(async () => {
    try {
      const audioContext = await getAudioContext()
      if (!audioContext) return

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)

      console.log('Som de erro reproduzido')
    } catch (error) {
      console.warn('Erro no áudio de erro:', error)
    }
  }, [])

  const playClick = useCallback(async () => {
    try {
      const audioContext = await getAudioContext()
      if (!audioContext) return

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)

      console.log('Som de clique reproduzido')
    } catch (error) {
      console.warn('Erro no áudio de clique:', error)
    }
  }, [])

  // Tocar nota musical
  const playNote = useCallback(async (note = 'C', octave = 4) => {
    try {
      const audioContext = await getAudioContext()
      if (!audioContext) return

      // Frequências das notas musicais
      const noteFrequencies = {
        C: 261.63,
        D: 293.66,
        E: 329.63,
        F: 349.23,
        G: 392.0,
        A: 440.0,
        B: 493.88,
      }

      const baseFreq = noteFrequencies[note.toUpperCase()] || noteFrequencies.C
      const frequency = baseFreq * Math.pow(2, octave - 4) // Ajustar para a oitava

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)

      console.log(`Nota ${note}${octave} reproduzida (${frequency}Hz)`)
    } catch (error) {
      console.warn(`Erro ao reproduzir nota ${note}:`, error)
    }
  }, [])

  // Tocar sequência de notas
  const playSequence = useCallback(
    async (sequence, tempo = 600) => {
      for (let i = 0; i < sequence.length; i++) {
        setTimeout(() => {
          if (typeof sequence[i] === 'string') {
            playNote(sequence[i])
          } else if (sequence[i].note) {
            playNote(sequence[i].note, sequence[i].octave || 4)
          }
        }, i * tempo)
      }
    },
    [playNote]
  )

  return {
    preloadSound,
    playSound,
    stopSound,
    stopAllSounds,
    playSuccess,
    playError,
    playClick,
    playNote,
    playSequence,
  }
}

export default useSound
