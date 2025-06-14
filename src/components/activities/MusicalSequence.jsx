import React, { useReducer, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import useSound from '../../hooks/useSound'
import useProgress from '../../hooks/useProgress'
import useAdvancedActivity from '../../hooks/useAdvancedActivity'
import useTTS from '../../hooks/useTTS'
import { useUser } from '../../contexts/UserContext'
import ActivityTimer from '../common/ActivityTimer'
import {
  announceToScreenReader,
  vibrateSuccess,
  vibrateError,
  prefersHighContrast,
  prefersReducedMotion,
} from '../../utils/accessibility/index.js'
import {
  GameContainer,
  GameHeader,
  ActivityTitleSection,
  ActivityMainTitle,
  ActivitySubtitle,
  BackButton,
  InstructionText as BaseInstructionText,
  DifficultySelector,
  DifficultyButton,
  ControlButtons,
  ActionButton,
} from '../../styles/activityCommon'

// Definição de cores temáticas
const THEME_COLOR = 'var(--primary-purple)'
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))'

// Estilos
const InstructionText = styled(BaseInstructionText)`
  background: ${THEME_GRADIENT};
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  box-shadow: var(--shadow-strong);
  font-size: 1.2rem;
  padding: 1.5rem;
  margin: 1rem auto;
  width: 90%;
  max-width: 600px;
  border-radius: 12px;
  text-align: center;

  @media (max-width: 1024px) and (orientation: portrait) {
    font-size: 1rem;
    padding: 1rem;
    width: 94%;
  }

  @media (min-width: 768px) and (orientation: landscape) {
    font-size: 1.3rem;
    padding: 1.5rem;
    width: 80%;
    max-width: 700px;
  }
`

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  gap: 0.75rem;
  height: 100%;
  flex: 1;

  @media (min-width: 768px) and (orientation: landscape) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem;
  }

  @media (min-width: 1024px) and (orientation: landscape) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1rem;
  }
`

const StatsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: 100%;
  max-width: 100%;

  @media (min-width: 768px) and (orientation: landscape) {
    max-width: 240px;
    min-width: 220px;
    flex-shrink: 0;
    height: fit-content;
    padding: 0.5rem;
    gap: 0.5rem;
  }

  @media (min-width: 1024px) and (orientation: landscape) {
    max-width: 260px;
    min-width: 240px;
    flex-shrink: 0;
    height: fit-content;
    padding: 0.75rem;
    gap: 0.75rem;
  }
`

const GameStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  @media (min-width: 768px) and (orientation: landscape) {
    gap: 1rem;
  }

  @media (min-width: 1024px) and (orientation: landscape) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`

const StatItem = styled.div`
  text-align: center;
`

const StatValue = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--primary-purple);

  @media (min-width: 768px) and (orientation: landscape) {
    font-size: 1.6rem;
  }
`

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--medium-gray);

  @media (min-width: 768px) and (orientation: landscape) {
    font-size: 1rem;
  }
`

const SequenceDisplay = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 0.5rem 0;
  min-height: 4rem;
  align-items: center;
  width: 100%;

  @media (max-width: 767px) and (orientation: portrait) {
    gap: 0.75rem;
    min-height: 3rem;
  }

  @media (min-width: 768px) and (orientation: landscape) {
    gap: 1.5rem;
    min-height: 5rem;
  }

  @media (min-width: 1024px) and (orientation: landscape) {
    gap: 1.5rem;
    min-height: 5rem;
    margin: 0.75rem 0;
  }
`

const NoteIndicator = styled(motion.div)`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: ${(props) => (props.isActive ? 'var(--primary-orange)' : 'var(--light-gray)')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
  box-shadow: var(--shadow-medium);
  border: 3px solid ${(props) => (props.isActive ? 'var(--primary-orange)' : 'transparent')};

  @media (max-width: 767px) and (orientation: portrait) {
    width: 3rem;
    height: 3rem;
    font-size: 1.2rem;
  }
`

const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  margin: 1rem auto;

  @media (max-width: 767px) and (orientation: portrait) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    max-width: 100%;
  }

  @media (min-width: 768px) and (orientation: landscape) {
    gap: 1.5rem;
    max-width: 100%;
  }

  @media (min-width: 1024px) and (orientation: landscape) {
    gap: 1.5rem;
    max-width: 100%;
    margin: 1.5rem auto;
  }
`

const SoundButton = styled(motion.button)`
  padding: 1.5rem;
  border: none;
  border-radius: 16px;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-medium);
  min-height: 8rem;
  width: 100%;

  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    padding: 1rem;
    font-size: 1.2rem;
    min-height: 6rem;
  }

  @media (min-width: 768px) and (orientation: landscape) {
    padding: 1.8rem;
    font-size: 1.6rem;
    min-height: 10rem;
  }
`

const DoButton = styled(SoundButton)`
  background: linear-gradient(135deg, var(--primary-pink), var(--primary-orange));
  color: white;
  box-shadow: 0 4px 8px rgba(233, 30, 99, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #f43f5e, #fb923c);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(233, 30, 99, 0.4);
  }
`

const ReButton = styled(SoundButton)`
  background: linear-gradient(135deg, var(--primary-green), var(--primary-cyan));
  color: white;
  box-shadow: 0 4px 8px rgba(126, 211, 33, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #84cc16, #06b6d4);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(126, 211, 33, 0.4);
  }
`

const MiButton = styled(SoundButton)`
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
  color: white;
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #3b82f6, #06b6d4);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(74, 144, 226, 0.4);
  }
`

const FaButton = styled(SoundButton)`
  background: linear-gradient(135deg, var(--primary-orange), #ffd700);
  color: white;
  box-shadow: 0 4px 8px rgba(245, 166, 35, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #fb923c, #ffc107);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(245, 166, 35, 0.4);
  }
`

const GameplayArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 0;
  gap: 0.75rem;

  @media (min-width: 768px) and (orientation: landscape) {
    padding-left: 1rem;
    justify-content: flex-start;
    gap: 1rem;
  }

  @media (min-width: 1024px) and (orientation: landscape) {
    padding-left: 1.5rem;
    justify-content: center;
    gap: 1.2rem;
  }
`

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  margin: 1rem auto;
  flex-wrap: wrap;

  @media (max-width: 767px) and (orientation: portrait) {
    gap: 0.75rem;
    flex-direction: column;
    align-items: center;
  }

  @media (min-width: 768px) and (orientation: landscape) {
    gap: 1.5rem;
    max-width: 100%;
  }

  @media (min-width: 1024px) and (orientation: landscape) {
    gap: 1.5rem;
    max-width: 100%;
    margin: 1.5rem auto;
  }
`

const FeedbackMessage = styled(motion.div)`
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  width: 90%;
  max-width: 600px;
  margin: 1rem auto;

  &.success {
    background: var(--success-light);
    color: var(--success-dark);
    border: 2px solid var(--primary-green);
  }

  &.error {
    background: var(--error-light);
    color: var(--error-dark);
    border: 2px solid var(--primary-red);
  }

  @media (max-width: 767px) and (orientation: portrait) {
    font-size: 1rem;
    padding: 0.8rem;
  }

  @media (min-width: 768px) and (orientation: landscape) {
    font-size: 1.2rem;
    padding: 1.2rem;
    width: 80%;
    max-width: 700px;
  }
`

const ProgressDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  color: var(--primary-blue);
  font-weight: 600;
  width: 100%;
  max-width: 600px;
  margin: 1rem auto;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 767px) and (orientation: portrait) {
    font-size: 1rem;
    gap: 0.5rem;
  }

  @media (min-width: 768px) and (orientation: landscape) {
    font-size: 1.2rem;
    gap: 1.2rem;
    max-width: 700px;
  }
`

const PlayerProgressBar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  margin: 1rem auto;
  justify-content: center;
  min-height: 3rem;
  align-items: center;
  width: 100%;
  max-width: 600px;

  @media (max-width: 767px) and (orientation: portrait) {
    padding: 0.8rem;
    min-height: 2.5rem;
  }

  @media (min-width: 768px) and (orientation: landscape) {
    padding: 1.2rem;
    min-height: 3.5rem;
    max-width: 700px;
  }
`

const ProgressDot = styled.div.attrs((props) => ({
  'data-completed': props.$isCompleted,
  'data-current': props.$isCurrent,
}))`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background: ${(props) => {
    if (props.$isCompleted) return 'var(--primary-green)'
    if (props.$isCurrent) return 'var(--primary-orange)'
    return 'var(--light-gray)'
  }};
  transition: all var(--transition-normal);

  ${(props) =>
    props.$isCurrent &&
    `
    transform: scale(1.2);
    box-shadow: 0 0 8px var(--primary-orange);
  `}

  @media (max-width: 767px) and (orientation: portrait) {
    width: 0.6rem;
    height: 0.6rem;
  }

  @media (min-width: 768px) and (orientation: landscape) {
    width: 1rem;
    height: 1rem;
  }
`

const StarDisplay = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 1.4rem;

  @media (max-width: 767px) and (orientation: portrait) {
    font-size: 1.2rem;
  }

  @media (min-width: 768px) and (orientation: landscape) {
    font-size: 1.6rem;
  }
`

const notes = [
  { id: 'do', name: 'Dó', emoji: '🔴', frequency: 261.63, waveType: 'sine' },
  { id: 're', name: 'Ré', emoji: '🟢', frequency: 293.66, waveType: 'sine' },
  { id: 'mi', name: 'Mi', emoji: '🔵', frequency: 329.63, waveType: 'sine' },
  { id: 'fa', name: 'Fá', emoji: '🟡', frequency: 349.23, waveType: 'sine' },
]

const difficulties = [
  { id: 'EASY', name: 'Fácil', sequenceLength: 2, notes: ['do', 're'] },
  { id: 'MEDIUM', name: 'Médio', sequenceLength: 3, notes: ['do', 're', 'mi'] },
  { id: 'HARD', name: 'Difícil', sequenceLength: 4, notes: ['do', 're', 'mi', 'fa'] },
]

const encouragingMessages = [
  'Muito bem! 🎵',
  'Excelente! Continue assim! 🌟',
  'Você tem um ótimo ouvido musical! 🎶',
  'Perfeito! Você está indo muito bem! ✨',
  'Fantástico! Sua memória está ótima! 🧠',
]

const validateNoteData = () => {
  notes.forEach((note) => {
    if (!note.id || !note.name || !note.frequency || !note.waveType) {
      console.error(`Nota inválida: ${JSON.stringify(note)}`)
    }
  })
  difficulties.forEach((diff) => {
    diff.notes = diff.notes.filter((noteId) => notes.some((n) => n.id === noteId))
    if (!diff.sequenceLength || diff.sequenceLength < 1) {
      console.error(`Dificuldade inválida: ${diff.id}`)
      diff.sequenceLength = 2
    }
  })
}

validateNoteData()

const initialState = {
  gameSequence: [],
  playerSequence: [],
  isPlayingSequence: false,
  isPlayerTurn: false,
  gameStarted: false,
  currentLevel: 1,
  difficulty: 'EASY',
  feedback: null,
  playingNote: null,
  consecutiveSuccesses: 0,
  gameMode: 'notes',
  startTime: null,
  moveCount: 0,
  usedSequences: new Set(),
  totalSequencesPlayed: 0,
  sequenceHistory: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_GAME_SEQUENCE':
      return { ...state, gameSequence: action.payload }
    case 'SET_PLAYER_SEQUENCE':
      return { ...state, playerSequence: action.payload }
    case 'SET_IS_PLAYING_SEQUENCE':
      return { ...state, isPlayingSequence: action.payload }
    case 'SET_IS_PLAYER_TURN':
      return { ...state, isPlayerTurn: action.payload }
    case 'SET_GAME_STARTED':
      return { ...state, gameStarted: action.payload }
    case 'SET_CURRENT_LEVEL':
      return { ...state, currentLevel: action.payload }
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload }
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload }
    case 'SET_PLAYING_NOTE':
      return { ...state, playingNote: action.payload }
    case 'SET_CONSECUTIVE_SUCCESSES':
      return { ...state, consecutiveSuccesses: action.payload }
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload }
    case 'SET_START_TIME':
      return { ...state, startTime: action.payload }
    case 'INCREMENT_MOVE_COUNT':
      return { ...state, moveCount: state.moveCount + 1 }
    case 'SET_USED_SEQUENCES':
      return { ...state, usedSequences: action.payload }
    case 'INCREMENT_TOTAL_SEQUENCES':
      return { ...state, totalSequencesPlayed: state.totalSequencesPlayed + 1 }
    case 'ADD_SEQUENCE_HISTORY':
      return { ...state, sequenceHistory: [...state.sequenceHistory, action.payload] }
    case 'RESET_GAME':
      return { ...initialState, difficulty: state.difficulty }
    default:
      return state
  }
}

function MusicalSequence({ onBack }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { playSound, playSuccess, playError, playClick } = useSound()
  const { recordPerformance } = useUser()
  const { speak, speakInstruction, speakFeedback, autoSpeak, isTTSEnabled } = useTTS()
  const {
    progress,
    incrementAttempts,
    recordSuccess,
    recordError,
    resetSession,
    saveProgress,
    startActivity,
    pauseActivity,
    resumeActivity,
    finishActivity,
    getCurrentTimeMetrics,
    sessionId,
    isActivityActive,
    isActivityPaused,
  } = useProgress('musical-sequence')

  // 🔥 HOOK MULTISSENSORIAL - Sistema avançado de métricas auditivas
  const {
    recordAdvancedInteraction,
    recordBehavioralIndicator,
    startAdvancedSession,
    stopAdvancedSession,
    sessionInsights,
  } = useAdvancedActivity('musical-sequence', {
    enableSensorTracking: true,
    enableGeoLocation: false,
    enableNeurodivergenceAnalysis: true,
    enableAudioProcessing: true, // Específico para atividades musicais
  })

  const generateUniqueSequence = useCallback(
    (length) => {
      const maxAttempts = 50
      let attempts = 0
      const availableNotes =
        difficulties.find((d) => d.id === state.difficulty)?.notes || notes.map((n) => n.id)

      while (attempts < maxAttempts) {
        const sequence = []
        let lastNoteIndex = -1
        for (let i = 0; i < length; i++) {
          let randomIndex
          do {
            randomIndex = Math.floor(Math.random() * availableNotes.length)
          } while (randomIndex === lastNoteIndex && availableNotes.length > 1)
          lastNoteIndex = randomIndex
          sequence.push(availableNotes[randomIndex])
        }
        const sequenceKey = sequence.join('-')
        if (!state.usedSequences.has(sequenceKey)) {
          return { sequence, sequenceKey }
        }
        attempts++
      }

      dispatch({ type: 'SET_USED_SEQUENCES', payload: new Set() })
      dispatch({ type: 'ADD_SEQUENCE_HISTORY', payload: [] })
      const sequence = Array(length).fill(availableNotes[0])
      return { sequence, sequenceKey: sequence.join('-') }
    },
    [state.difficulty, state.usedSequences]
  )

  const playNote = async (noteId) => {
    dispatch({ type: 'SET_PLAYING_NOTE', payload: noteId })
    const note = notes.find((n) => n.id === noteId)

    if (!note) {
      console.warn(`Nota não encontrada: ${noteId}`)
      dispatch({ type: 'SET_PLAYING_NOTE', payload: null })
      return
    }

    try {
      // 🔥 TRACKING: Reprodução de nota individual
      const notePlayStartTime = Date.now()

      if (noteId === 'success') {
        playSuccess()
        setTimeout(() => dispatch({ type: 'SET_PLAYING_NOTE', payload: null }), 500)
        return
      } else if (noteId === 'error') {
        playError()
        setTimeout(() => dispatch({ type: 'SET_PLAYING_NOTE', payload: null }), 500)
        return
      }

      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) {
        console.warn('Web Audio API não suportada')
        setTimeout(() => dispatch({ type: 'SET_PLAYING_NOTE', payload: null }), 500)
        announceToScreenReader(`Nota ${note.name} selecionada`)
        return
      }

      const audioContext = new AudioContext()
      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      const filterNode = audioContext.createBiquadFilter()

      oscillator.connect(filterNode)
      filterNode.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(note.frequency, audioContext.currentTime)
      oscillator.type = 'sine'

      filterNode.type = 'lowpass'
      filterNode.frequency.setValueAtTime(2000, audioContext.currentTime)
      filterNode.Q.setValueAtTime(0.5, audioContext.currentTime)

      const now = audioContext.currentTime
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02)
      gainNode.gain.setValueAtTime(0.15, now + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

      oscillator.start(now)
      oscillator.stop(now + 0.5)

      // 🔥 TRACKING: Métricas da nota reproduzida
      recordAdvancedInteraction({
        type: 'note_synthesis',
        subtype: 'audio_generation',
        sensoryModality: 'auditory',
        responseTime: Date.now() - notePlayStartTime,
        accuracy: true,
        context: {
          noteId: noteId,
          noteName: note.name,
          frequency: note.frequency,
          waveType: note.waveType,
          duration: 500,
          audioContextState: audioContext.state,
          synthesis: 'web_audio_api',
          auditoryProcessing: 'frequency_generation',
        },
      })

      setTimeout(() => {
        try {
          oscillator.disconnect()
          filterNode.disconnect()
          gainNode.disconnect()
          audioContext.close().catch((e) => console.warn('Erro ao fechar AudioContext:', e.message))
        } catch (e) {
          console.warn('Aviso na limpeza do AudioContext:', e.message)
        }
        dispatch({ type: 'SET_PLAYING_NOTE', payload: null })
      }, 600)
    } catch (error) {
      console.error('Erro ao reproduzir áudio para', note.name, ':', error)
      setTimeout(() => dispatch({ type: 'SET_PLAYING_NOTE', payload: null }), 300)
    }

    announceToScreenReader(`Nota ${note.name} reproduzida`)
  }

  const playSequence = async () => {
    dispatch({ type: 'SET_IS_PLAYING_SEQUENCE', payload: true })
    dispatch({ type: 'SET_IS_PLAYER_TURN', payload: false })

    // 🔥 TRACKING: Início da reprodução da sequência musical
    recordAdvancedInteraction({
      type: 'sequence_playback',
      subtype: 'musical_sequence_presentation',
      sensoryModality: 'auditory',
      responseTime: 0,
      accuracy: true,
      context: {
        sequenceLength: state.gameSequence.length,
        currentLevel: state.currentLevel,
        difficulty: state.difficulty,
        gameMode: state.gameMode,
        notes: state.gameSequence
          .map((noteId) => notes.find((n) => n.id === noteId)?.name)
          .join('-'),
        totalSequencesPlayed: state.totalSequencesPlayed,
        activityType: 'auditory_sequence_learning',
      },
    })

    for (let i = 0; i < state.gameSequence.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200))

      // 🔥 TRACKING: Cada nota da sequência reproduzida
      const noteStartTime = Date.now()
      await playNote(state.gameSequence[i])

      recordAdvancedInteraction({
        type: 'note_playback',
        subtype: 'sequence_note_presentation',
        sensoryModality: 'auditory',
        responseTime: Date.now() - noteStartTime,
        accuracy: true,
        context: {
          noteId: state.gameSequence[i],
          noteName: notes.find((n) => n.id === state.gameSequence[i])?.name,
          notePosition: i,
          frequency: notes.find((n) => n.id === state.gameSequence[i])?.frequency,
          sequenceLength: state.gameSequence.length,
          isLastNote: i === state.gameSequence.length - 1,
        },
      })

      await new Promise((resolve) => setTimeout(resolve, 600))
    }

    dispatch({ type: 'SET_IS_PLAYING_SEQUENCE', payload: false })
    dispatch({ type: 'SET_IS_PLAYER_TURN', payload: true })
    announceToScreenReader('Agora é sua vez! Repita a sequência que você ouviu.')
    if (isTTSEnabled) {
      speakInstruction('Agora é sua vez! Repita a sequência que você ouviu tocando as notas.')
    }
  }

  const generateNewRound = useCallback(() => {
    try {
      const diff = difficulties.find((d) => d.id === state.difficulty) || difficulties[0]
      const sequenceLength = Math.min(diff.sequenceLength + state.currentLevel - 1, 6)
      const { sequence, sequenceKey } = generateUniqueSequence(sequenceLength)

      // 🔥 TRACKING: Nova rodada musical gerada
      recordAdvancedInteraction({
        type: 'round_generation',
        subtype: 'musical_sequence_creation',
        sensoryModality: 'auditory',
        responseTime: 0,
        accuracy: true,
        context: {
          newSequence: sequence,
          sequenceLength: sequenceLength,
          difficulty: state.difficulty,
          level: state.currentLevel,
          totalSequencesPlayed: state.totalSequencesPlayed,
          usedSequencesCount: state.usedSequences.size,
          adaptiveProgression: sequenceLength > diff.sequenceLength,
          musicalNotes: sequence
            .map((noteId) => notes.find((n) => n.id === noteId)?.name)
            .join('-'),
          gameMode: state.gameMode,
        },
      })

      dispatch({
        type: 'SET_USED_SEQUENCES',
        payload: new Set([...state.usedSequences, sequenceKey]),
      })
      dispatch({ type: 'ADD_SEQUENCE_HISTORY', payload: sequenceKey })
      dispatch({ type: 'INCREMENT_TOTAL_SEQUENCES' })
      dispatch({ type: 'SET_GAME_SEQUENCE', payload: sequence })
      dispatch({ type: 'SET_PLAYER_SEQUENCE', payload: [] })
      dispatch({ type: 'SET_FEEDBACK', payload: null })
      dispatch({ type: 'SET_START_TIME', payload: Date.now() })
      dispatch({ type: 'INCREMENT_MOVE_COUNT' })
    } catch (error) {
      console.error('Erro ao gerar nova rodada:', error)
      dispatch({
        type: 'SET_FEEDBACK',
        payload: { type: 'error', message: 'Erro ao carregar nova rodada. Tente novamente.' },
      })
    }
  }, [
    state.difficulty,
    state.currentLevel,
    state.usedSequences,
    state.totalSequencesPlayed,
    state.gameMode,
    generateUniqueSequence,
    recordAdvancedInteraction,
  ])

  const startNewGame = useCallback(async () => {
    try {
      await startActivity()

      // 🔥 INICIAR SESSÃO MULTISSENSORIAL AVANÇADA
      const advancedStarted = await startAdvancedSession()
      if (advancedStarted) {
        console.log('🚀 Sessão avançada MusicalSequence iniciada')

        // Tracking de início da atividade musical
        recordAdvancedInteraction({
          type: 'session_start',
          subtype: 'musical_activity_initialization',
          sensoryModality: 'auditory',
          context: {
            difficulty: state.difficulty,
            gameMode: state.gameMode,
            deviceAudioSupport: !!(window.AudioContext || window.webkitAudioContext),
            activityType: 'auditory_memory_training',
          },
        })
      }

      resetSession()
      dispatch({ type: 'SET_GAME_STARTED', payload: true })
      dispatch({ type: 'SET_USED_SEQUENCES', payload: new Set() })
      dispatch({ type: 'SET_CURRENT_LEVEL', payload: 1 })
      dispatch({ type: 'SET_CONSECUTIVE_SUCCESSES', payload: 0 })
      dispatch({ type: 'SET_START_TIME', payload: Date.now() })
      generateNewRound()
      announceToScreenReader(
        `Novo jogo iniciado no nível ${state.difficulty}! Escute a sequência musical.`
      )
      if (isTTSEnabled) {
        autoSpeak(
          `Novo jogo de sequência musical iniciado! Dificuldade ${state.difficulty}. Escute a sequência musical e repita tocando as notas na ordem correta.`,
          1000
        )
      }
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error)
      dispatch({
        type: 'SET_FEEDBACK',
        payload: { type: 'error', message: 'Erro ao iniciar o jogo. Tente novamente.' },
      })
    }
  }, [
    startActivity,
    generateNewRound,
    state.difficulty,
    state.gameMode,
    startAdvancedSession,
    recordAdvancedInteraction,
  ])

  const toggleGameMode = useCallback(() => {
    const newMode = state.gameMode === 'notes' ? 'rhythm' : 'notes'
    dispatch({ type: 'SET_GAME_MODE', payload: newMode })
    dispatch({ type: 'SET_FEEDBACK', payload: null })
    if (state.gameStarted) {
      setTimeout(generateNewRound, 100)
    }
    announceToScreenReader(`Modo alterado para: ${newMode === 'notes' ? 'Notas' : 'Ritmo'}`)
    speakInstruction(`Modo alterado para ${newMode === 'notes' ? 'notas' : 'ritmo'}.`)
  }, [state.gameMode, state.gameStarted, generateNewRound])

  const calculateScore = (level, sequenceLength) => {
    const basePoints = 10
    const levelBonus = level * 5
    const sequenceBonus = sequenceLength * 5
    const timeBonus = Math.max(0, 10 - Math.floor((Date.now() - state.startTime) / 1000))
    return basePoints + levelBonus + sequenceBonus + timeBonus
  }

  const handlePlayerNote = useCallback(
    (noteId) => {
      if (!state.isPlayerTurn || state.isPlayingSequence) return

      // 🔥 TRACKING: Início da interação do jogador
      const playerInteractionStartTime = Date.now()
      window.musicalPlayerStartTime = playerInteractionStartTime

      playNote(noteId)
      const newPlayerSequence = [...state.playerSequence, noteId]
      dispatch({ type: 'SET_PLAYER_SEQUENCE', payload: newPlayerSequence })
      dispatch({ type: 'INCREMENT_MOVE_COUNT' })
      incrementAttempts()

      const currentIndex = newPlayerSequence.length - 1
      const isCorrect = state.gameSequence[currentIndex] === noteId
      const responseTime =
        playerInteractionStartTime - (window.musicalPlayerStartTime || playerInteractionStartTime)

      // 🔥 TRACKING: Interação musical do jogador
      recordAdvancedInteraction({
        type: 'player_note_input',
        subtype: 'musical_note_selection',
        sensoryModality: 'auditory',
        responseTime: Math.max(responseTime, 100),
        accuracy: isCorrect,
        context: {
          selectedNote: noteId,
          selectedNoteName: notes.find((n) => n.id === noteId)?.name,
          expectedNote: state.gameSequence[currentIndex],
          expectedNoteName: notes.find((n) => n.id === state.gameSequence[currentIndex])?.name,
          notePosition: currentIndex,
          sequenceLength: state.gameSequence.length,
          playerSequenceProgress: newPlayerSequence.length,
          frequency: notes.find((n) => n.id === noteId)?.frequency,
          level: state.currentLevel,
          difficulty: state.difficulty,
          gameMode: state.gameMode,
          consecutiveSuccesses: state.consecutiveSuccesses,
          auditoryMemoryPattern: 'sequential_note_recall',
        },
      })

      if (!isCorrect) {
        recordError()
        vibrateError()
        playError()
        dispatch({ type: 'SET_CONSECUTIVE_SUCCESSES', payload: 0 })
        dispatch({
          type: 'SET_FEEDBACK',
          payload: { type: 'error', message: 'Ops! Tente novamente.' },
        })

        // 🔥 TRACKING: Erro musical específico
        recordAdvancedInteraction({
          type: 'musical_error',
          subtype: 'wrong_note_selection',
          sensoryModality: 'auditory',
          responseTime: responseTime,
          accuracy: false,
          context: {
            errorType: 'auditory_sequence_mismatch',
            selectedNote: noteId,
            expectedNote: state.gameSequence[currentIndex],
            notePosition: currentIndex,
            sequenceLength: state.gameSequence.length,
            difficulty: state.difficulty,
            level: state.currentLevel,
            frequencyDifference: Math.abs(
              notes.find((n) => n.id === noteId)?.frequency -
                notes.find((n) => n.id === state.gameSequence[currentIndex])?.frequency
            ),
            recoveryStrategy: 'sequence_replay',
            auditoryProcessingChallenge: 'pitch_discrimination',
          },
        })

        if (isTTSEnabled) {
          speakFeedback('Ops! Tente novamente. Escute a sequência mais uma vez.', false)
        }
        const performanceData = {
          correct: 0,
          incorrect: 1,
          responseTimes: [500],
          level: state.currentLevel,
          sequenceLength: state.gameSequence.length,
          errorType: 'wrong_note',
          notePosition: currentIndex,
        }
        recordPerformance('musical-sequence', performanceData)
        setTimeout(() => {
          dispatch({ type: 'SET_PLAYER_SEQUENCE', payload: [] })
          dispatch({ type: 'SET_FEEDBACK', payload: null })
          playSequence()
        }, 2000)
        return
      }

      if (newPlayerSequence.length === state.gameSequence.length) {
        const totalPoints = calculateScore(state.currentLevel, state.gameSequence.length)
        recordSuccess(totalPoints - 10)
        vibrateSuccess()
        playSuccess()
        const newConsecutiveSuccesses = state.consecutiveSuccesses + 1
        dispatch({ type: 'SET_CONSECUTIVE_SUCCESSES', payload: newConsecutiveSuccesses })
        const successMessage =
          encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
        const feedbackMessage = `${successMessage} +${totalPoints} pontos!`
        dispatch({ type: 'SET_FEEDBACK', payload: { type: 'success', message: feedbackMessage } })

        // 🔥 TRACKING: Sucesso musical completo
        recordAdvancedInteraction({
          type: 'sequence_completion',
          subtype: 'musical_sequence_success',
          sensoryModality: 'auditory',
          responseTime: Date.now() - state.startTime,
          accuracy: true,
          context: {
            sequenceLength: state.gameSequence.length,
            totalScore: totalPoints,
            level: state.currentLevel,
            difficulty: state.difficulty,
            consecutiveSuccesses: newConsecutiveSuccesses,
            averageNoteResponseTime: responseTime,
            auditoryMemorySkill: 'sequential_pattern_recognition',
            musicalProgress: 'improved_auditory_processing',
            notesCompleted: state.gameSequence
              .map((noteId) => notes.find((n) => n.id === noteId)?.name)
              .join('-'),
          },
        })

        if (isTTSEnabled) {
          speakFeedback(feedbackMessage, true)
        }
        const performanceData = {
          correct: 1,
          incorrect: 0,
          responseTimes: [500],
          level: state.currentLevel,
          sequenceLength: state.gameSequence.length,
          consecutiveSuccesses: newConsecutiveSuccesses,
          score: totalPoints,
          timestamp: new Date().toISOString(),
          activityType: 'musical-sequence',
        }
        recordPerformance('musical-sequence', performanceData)
        saveProgress()
        setTimeout(() => {
          let nextLevel = state.currentLevel + 1
          if (newConsecutiveSuccesses >= 3) {
            nextLevel += 1
            dispatch({ type: 'SET_CONSECUTIVE_SUCCESSES', payload: 0 })
          }
          dispatch({ type: 'SET_CURRENT_LEVEL', payload: nextLevel })
          dispatch({ type: 'SET_PLAYER_SEQUENCE', payload: [] })
          dispatch({ type: 'SET_FEEDBACK', payload: null })
          generateNewRound()
          announceToScreenReader(`Nível ${nextLevel}! Escute a nova sequência.`)
          if (isTTSEnabled) {
            autoSpeak(`Nível ${nextLevel}! Escute a nova sequência musical.`, 500)
          }
        }, 2000)
      }
    },
    [
      state.isPlayerTurn,
      state.isPlayingSequence,
      state.playerSequence,
      state.gameSequence,
      state.currentLevel,
      state.consecutiveSuccesses,
      state.startTime,
      incrementAttempts,
      recordSuccess,
      recordError,
      saveProgress,
      generateNewRound,
      recordAdvancedInteraction,
      playNote,
      speakFeedback,
      isTTSEnabled,
      recordPerformance,
      calculateScore,
      playSequence,
    ]
  )

  const restartGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
    generateNewRound()
    announceToScreenReader('Jogo reiniciado! Escute a nova sequência.')
  }, [generateNewRound])

  const handleFinishActivity = async () => {
    if (sessionId) {
      await finishActivity()
      announceToScreenReader('Atividade finalizada! Dados de tempo salvos.')
    }
  }

  const handlePauseResume = () => {
    if (isActivityPaused) {
      resumeActivity()
      announceToScreenReader('Atividade retomada.')
    } else {
      pauseActivity()
      announceToScreenReader('Atividade pausada.')
    }
  }

  useEffect(() => {
    if (prefersHighContrast()) document.body.classList.add('high-contrast')
    if (prefersReducedMotion()) document.body.classList.add('reduced-motion')
    return () => {
      document.body.classList.remove('high-contrast', 'reduced-motion')
    }
  }, [])

  useEffect(() => {
    if (state.gameSequence.length > 0 && state.gameStarted) {
      const timer = setTimeout(() => {
        playSequence()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [state.gameSequence, state.gameStarted])

  // 🔥 CLEANUP MULTISSENSORIAL - Finalizar sessão ao sair da atividade
  useEffect(() => {
    return () => {
      finishActivity()
      const handleExit = async () => {
        const finalReport = await stopAdvancedSession()
        if (finalReport) {
          console.log('🏁 Sessão MusicalSequence finalizada:', finalReport)
        }
      }
      handleExit()
    }
  }, [finishActivity, stopAdvancedSession])

  return (
    <GameContainer>
      <GameHeader>
        <BackButton
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Voltar ao menu principal"
        >
          ⬅️ Voltar
        </BackButton>
      </GameHeader>

      <ActivityTitleSection>
        <ActivityMainTitle>
          <span>🎵</span>
          <span>Sequência Musical</span>
        </ActivityMainTitle>
        <ActivitySubtitle>
          {state.gameStarted
            ? `Modo: ${state.gameMode === 'notes' ? 'Notas' : 'Ritmo'} - ${progress.score || 0} pontos`
            : 'Desenvolva sua memória auditiva e senso musical'}
        </ActivitySubtitle>
      </ActivityTitleSection>

      <ActivityTimer
        timeMetrics={isActivityActive ? getCurrentTimeMetrics() : null}
        onStart={startActivity}
        onPause={pauseActivity}
        onResume={resumeActivity}
        onFinish={finishActivity}
        showControls={false}
        compact={false}
        invisible={true}
      />

      {state.gameStarted ? (
        <MainLayout>
          <StatsPanel>
            <GameStats>
              <StatItem>
                <StatValue>{state.currentLevel}</StatValue>
                <StatLabel>Nível</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{progress.score || 0}</StatValue>
                <StatLabel>Pontos</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{state.totalSequencesPlayed}</StatValue>
                <StatLabel>Sequências</StatLabel>
              </StatItem>
              <StatItem>
                <StarDisplay>
                  {Array.from({ length: 3 }, (_, i) => (
                    <span key={i}>{i < (progress.stars || 0) ? '⭐' : '☆'}</span>
                  ))}
                </StarDisplay>
                <StatLabel>Estrelas</StatLabel>
              </StatItem>
            </GameStats>
            {state.isPlayingSequence && (
              <InstructionText
                onClick={() =>
                  isTTSEnabled && speakInstruction('Escute com atenção a sequência musical.')
                }
                role="button"
                aria-label="Instrução: Escute com atenção"
              >
                🎧 Escute com atenção...
              </InstructionText>
            )}
            {state.isPlayerTurn && (
              <InstructionText
                onClick={() =>
                  isTTSEnabled && speakInstruction('Sua vez! Repita a sequência tocando as notas.')
                }
                role="button"
                aria-label="Instrução: Sua vez"
              >
                🎹 Sua vez! Repita a sequência
              </InstructionText>
            )}
            <SequenceDisplay>
              <AnimatePresence>
                {state.gameSequence.map((noteId, index) => {
                  const note = notes.find((n) => n.id === noteId)
                  const isCurrentlyPlaying = state.playingNote === noteId

                  return (
                    <NoteIndicator
                      key={`${noteId}-${index}`}
                      isActive={isCurrentlyPlaying}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: isCurrentlyPlaying ? 1.2 : 1,
                        opacity: 1,
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {note?.emoji || '🎵'}
                    </NoteIndicator>
                  )
                })}
              </AnimatePresence>
            </SequenceDisplay>
            {state.isPlayerTurn && (
              <PlayerProgressBar>
                {state.gameSequence.map((_, index) => (
                  <ProgressDot
                    key={index}
                    $isCompleted={index < state.playerSequence.length}
                    $isCurrent={index === state.playerSequence.length}
                  />
                ))}
              </PlayerProgressBar>
            )}
          </StatsPanel>
          <GameplayArea>
            <ControlButtons>
              <ActionButton
                className="secondary"
                onClick={toggleGameMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Trocar para modo ${state.gameMode === 'notes' ? 'ritmo' : 'notas'}`}
              >
                🔄 Trocar Modo: {state.gameMode === 'notes' ? 'Notas→Ritmo' : 'Ritmo→Notas'}
              </ActionButton>
              <ActionButton
                onClick={playSequence}
                disabled={state.isPlayingSequence || !state.gameStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Ouvir sequência novamente"
              >
                🔊 Ouvir Novamente
              </ActionButton>
            </ControlButtons>

            <ButtonsContainer>
              <DoButton
                onClick={() => handlePlayerNote('do')}
                disabled={!state.isPlayerTurn}
                whileHover={state.isPlayerTurn ? { scale: 1.05 } : {}}
                whileTap={state.isPlayerTurn ? { scale: 0.95 } : {}}
                animate={
                  state.playingNote === 'do'
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 4px 8px rgba(233, 30, 99, 0.3)',
                          '0 8px 16px rgba(233, 30, 99, 0.6)',
                          '0 4px 8px rgba(233, 30, 99, 0.3)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.3 }}
                aria-label="Tocar nota Dó"
              >
                <span>🎵</span>
                <span>Dó</span>
              </DoButton>

              <ReButton
                onClick={() => handlePlayerNote('re')}
                disabled={!state.isPlayerTurn}
                whileHover={state.isPlayerTurn ? { scale: 1.05 } : {}}
                whileTap={state.isPlayerTurn ? { scale: 0.95 } : {}}
                animate={
                  state.playingNote === 're'
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 4px 8px rgba(126, 211, 33, 0.3)',
                          '0 8px 16px rgba(126, 211, 33, 0.6)',
                          '0 4px 8px rgba(126, 211, 33, 0.3)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.3 }}
                aria-label="Tocar nota Ré"
              >
                <span>🎶</span>
                <span>Ré</span>
              </ReButton>

              <MiButton
                onClick={() => handlePlayerNote('mi')}
                disabled={!state.isPlayerTurn}
                whileHover={state.isPlayerTurn ? { scale: 1.05 } : {}}
                whileTap={state.isPlayerTurn ? { scale: 0.95 } : {}}
                animate={
                  state.playingNote === 'mi'
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 4px 8px rgba(74, 144, 226, 0.3)',
                          '0 8px 16px rgba(74, 144, 226, 0.6)',
                          '0 4px 8px rgba(74, 144, 226, 0.3)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.3 }}
                aria-label="Tocar nota Mi"
              >
                <span>🎼</span>
                <span>Mi</span>
              </MiButton>

              <FaButton
                onClick={() => handlePlayerNote('fa')}
                disabled={!state.isPlayerTurn}
                whileHover={state.isPlayerTurn ? { scale: 1.05 } : {}}
                whileTap={state.isPlayerTurn ? { scale: 0.95 } : {}}
                animate={
                  state.playingNote === 'fa'
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 4px 8px rgba(245, 166, 35, 0.3)',
                          '0 8px 16px rgba(245, 166, 35, 0.6)',
                          '0 4px 8px rgba(245, 166, 35, 0.3)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.3 }}
                aria-label="Tocar nota Fá"
              >
                <span>🟡</span>
                <span>Fá</span>
              </FaButton>
            </ButtonsContainer>

            <ActionButtonsContainer>
              <ActionButton
                className="restart"
                onClick={restartGame}
                disabled={state.isPlayingSequence}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Reiniciar jogo"
              >
                🎮 Reiniciar Jogo
              </ActionButton>
            </ActionButtonsContainer>
          </GameplayArea>
        </MainLayout>
      ) : (
        <MainLayout>
          <InstructionText
            onClick={() =>
              isTTSEnabled &&
              speakInstruction(
                'Escute a sequência musical e repita tocando as notas na ordem correta! Escolha a dificuldade para começar.'
              )
            }
            role="button"
            aria-label="Instrução: Escolha a dificuldade"
          >
            🎵 Escute a sequência musical e repita tocando as notas na ordem correta!
            <br />
            Escolha a dificuldade para começar.
          </InstructionText>

          <DifficultySelector>
            {[
              { id: 'EASY', name: '🟢 Fácil', description: 'Sequências de 2 notas', icon: '😊' },
              { id: 'MEDIUM', name: '🟡 Médio', description: 'Sequências de 3 notas', icon: '🤔' },
              { id: 'HARD', name: '🔴 Difícil', description: 'Sequências de 4 notas', icon: '🧠' },
            ].map((diff) => (
              <DifficultyButton
                key={diff.id}
                isActive={state.difficulty === diff.id}
                onClick={() => {
                  dispatch({ type: 'SET_DIFFICULTY', payload: diff.id })
                  playClick()
                  speak(`Dificuldade ${diff.name} selecionada. ${diff.description}`)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                themeColor={THEME_COLOR}
                aria-label={`Selecionar dificuldade ${diff.name}`}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{diff.icon}</div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{diff.name}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{diff.description}</div>
              </DifficultyButton>
            ))}
          </DifficultySelector>

          <ControlButtons>
            <ActionButton
              onClick={startNewGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              themeColor={THEME_COLOR}
              aria-label="Iniciar jogo musical"
            >
              🎵 Começar Jogo Musical
            </ActionButton>
          </ControlButtons>
        </MainLayout>
      )}

      <AnimatePresence>
        {state.feedback && (
          <FeedbackMessage
            className={state.feedback.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {state.feedback.message}
          </FeedbackMessage>
        )}
      </AnimatePresence>
    </GameContainer>
  )
}

MusicalSequence.propTypes = {
  onBack: PropTypes.func.isRequired,
}

export default MusicalSequence
