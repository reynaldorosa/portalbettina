// filepath: c:\Projetos\portalbettina\portal-betina\src\components\activities\LetterRecognition.jsx
import React, { useReducer, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import useSound from '../../hooks/useSound'
import useProgress from '../../hooks/useProgress'
import { useUser } from '../../contexts/UserContext'
import useTTS from '../../hooks/useTTS'
import useAdvancedActivity from '../../hooks/useAdvancedActivity'
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
  GameTitle,
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
const THEME_COLOR = 'var(--primary-green)'
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-green), var(--primary-blue))'

// Estilos
const InstructionText = styled(BaseInstructionText)`
  background: ${THEME_GRADIENT};
`

const GameStats = styled.div`
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
  justify-content: center;
  margin: var(--space-lg) 0;
`

const StatItem = styled.div`
  text-align: center;
`

const StatValue = styled.div`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--primary-green);
`

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
`

const TargetLetterDisplay = styled(motion.div)`
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple));
  color: white;
  width: 150px;
  height: 150px;
  border-radius: var(--radius-large);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: bold;
  box-shadow: var(--shadow-large);
  margin: var(--space-lg) 0;
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    font-size: 3rem;
  }
`

const LetterInfo = styled.div`
  font-size: 0.8rem;
  margin-top: var(--space-xs);
  opacity: 0.9;
  text-align: center;
`

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-md);
  width: 100%;
  max-width: 600px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }
`

const LetterOption = styled(motion.button)`
  background: white;
  border: 3px solid var(--light-gray);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-medium);
  min-height: 120px;
  &:hover {
    border-color: var(--primary-green);
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
  }
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  &.correct {
    background: var(--success-light);
    border-color: var(--primary-green);
    color: var(--success-dark);
  }
  &.incorrect {
    background: var(--error-light);
    border-color: var(--primary-red);
    color: var(--error-dark);
  }
  @media (max-width: 768px) {
    padding: var(--space-md);
    min-height: 100px;
  }
`

const OptionLetter = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-blue);
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

const OptionWord = styled.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
  text-align: center;
  font-weight: 500;
`

const OptionImage = styled.div`
  font-size: 1.5rem;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
  line-height: 1;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`

const FeedbackMessage = styled(motion.div)`
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  text-align: center;
  font-weight: 600;
  font-size: var(--font-size-md);
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
`

const ProgressDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--font-size-md);
  color: var(--primary-blue);
  font-weight: 600;
  flex-wrap: wrap;
  justify-content: center;
`

const StarDisplay = styled.div`
  display: flex;
  gap: var(--space-xs);
  font-size: var(--font-size-xl);
`

// Dados das letras com correções de erros tipográficos
const letterData = {
  A: {
    words: ['AVIÃO', 'ÁRVORE', 'ABELHA', 'ÁGUA', 'AMIGO', 'ARCO-ÍRIS'],
    emojis: ['✈️', '🌳', '🐝', '💧', '👫', '🌈'],
  },
  B: {
    words: ['BOLA', 'BANANA', 'BORBOLETA', 'BEBÊ', 'BICICLETA', 'BALÃO'],
    emojis: ['⚽', '🍌', '🦋', '👶', '🚲', '🎈'],
  },
  C: {
    words: ['CASA', 'CACHORRO', 'CORAÇÃO', 'CARRO', 'COROA', 'CHOCOLATE'],
    emojis: ['🏠', '🐕', '❤️', '🚗', '👑', '🍫'],
  },
  D: {
    words: ['DADO', 'DINOSSAURO', 'DOCE', 'DENTE', 'DRAGÃO', 'DIAMANTE'],
    emojis: ['🎲', '🦕', '🍭', '🦷', '🐉', '💎'],
  },
  E: {
    words: ['ELEFANTE', 'ESTRELA', 'ESCADA', 'ESPELHO', 'ESCOLA', 'ENVELOPE'],
    emojis: ['🐘', '⭐', '🪜', '🪞', '🏫', '✉️'],
  },
  F: {
    words: ['FLOR', 'FOGO', 'FESTA', 'FACA', 'FUTEBOL', 'FANTASMA'],
    emojis: ['🌸', '🔥', '🎉', '🔪', '⚽', '👻'],
  },
  G: {
    words: ['GATO', 'GUITARRA', 'GIRASSOL', 'GALINHA', 'GELADO', 'GLOBO'],
    emojis: ['🐱', '🎸', '🌻', '🐔', '🧊', '🌍'],
  },
  H: {
    words: ['HIPOPÓTAMO', 'HAMBÚRGUER', 'HELICÓPTERO', 'HOSPITAL', 'HORAS', 'HARPA'],
    emojis: ['🦛', '🍔', '🚁', '🏥', '⏰', '🎵'],
  },
  I: {
    words: ['IGREJA', 'ILHA', 'ÍNDIO', 'ÍMÃ', 'IGUANA', 'INVERNO'],
    emojis: ['⛪', '🏝️', '🪶', '🧲', '🦎', '❄️'],
  },
  J: {
    words: ['JACARÉ', 'JOANINHA', 'JARDIM', 'JARRO', 'JOIA', 'JANELA'],
    emojis: ['🐊', '🐞', '🌺', '🏺', '💍', '🪟'],
  },
  K: { words: ['KIWI', 'KARATÊ', 'KOALA'], emojis: ['🥝', '🥋', '🐨'] },
  L: {
    words: ['LEÃO', 'LUA', 'LIVRO', 'LÂMPADA', 'LAGARTA', 'LIMÃO'],
    emojis: ['🦁', '🌙', '📚', '💡', '🐛', '🍋'],
  },
  M: {
    words: ['MACACO', 'MAÇÃ', 'MÚSICA', 'MÃO', 'MEDALHA', 'MONSTRO'],
    emojis: ['🐵', '🍎', '🎵', '🤲', '🏅', '👹'],
  },
  N: {
    words: ['NAVIO', 'NUVEM', 'NATUREZA', 'NINHO', 'NARIZ', 'NOTEBOOK'],
    emojis: ['🚢', '☁️', '🌿', '🪺', '👃', '💻'],
  },
  O: {
    words: ['OLHO', 'OVO', 'OVELHA', 'ÓCULOS', 'OURO', 'ONDA'],
    emojis: ['👁️', '🥚', '🐑', '👓', '🏆', '🌊'],
  },
  P: {
    words: ['PATO', 'PIZZA', 'PRESENTE', 'PALHAÇO', 'PLANETA', 'PEIXE'],
    emojis: ['🦆', '🍕', '🎁', '🤡', '🪐', '🐟'],
  },
  Q: { words: ['QUEIJO', 'QUENTE', 'QUADRADO'], emojis: ['🧀', '🔥', '⬜'] },
  R: {
    words: ['RATO', 'ROSA', 'RELÓGIO', 'ROBÔ', 'RAINHA', 'RAIO'],
    emojis: ['🐭', '🌹', '⏰', '🤖', '👸', '⚡'],
  },
  S: {
    words: ['SOL', 'SAPATO', 'SORRISO', 'SAPO', 'SERPENTE', 'SINO'],
    emojis: ['☀️', '👟', '😊', '🐸', '🐍', '🔔'],
  },
  T: {
    words: ['TIGRE', 'TARTARUGA', 'TELEFONE', 'TESOURA', 'TREM', 'TOMATE'],
    emojis: ['🐅', '🐢', '📞', '✂️', '🚂', '🍅'],
  },
  U: { words: ['UVA', 'URSO', 'UNICÓRNIO'], emojis: ['🍇', '🐻', '🦄'] },
  V: {
    words: ['VACA', 'VIOLÃO', 'VENTILADOR', 'VULCÃO', 'VELA', 'VAMPIRO'],
    emojis: ['🐄', '🎻', '💨', '🌋', '🕯️', '🧛'],
  },
  W: { words: ['WIFI', 'WEB'], emojis: ['📶', '🌐'] },
  X: { words: ['XÍCARA', 'XADREZ'], emojis: ['☕', '♟️'] },
  Y: { words: ['YOGA', 'YETI'], emojis: ['🧘', '🦣'] },
  Z: {
    words: ['ZEBRA', 'ZERO', 'ZANGADO', 'ZÍPER', 'ZUMBI'],
    emojis: ['🦓', '0️⃣', '😠', '🤐', '🧟'],
  },
}

const difficulties = [
  { id: 'EASY', name: 'Fácil', letters: ['A', 'E', 'I', 'O', 'U'] },
  {
    id: 'MEDIUM',
    name: 'Médio',
    letters: [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'L',
      'M',
      'N',
      'O',
      'P',
      'R',
      'S',
      'T',
    ],
  },
  { id: 'HARD', name: 'Difícil', letters: Object.keys(letterData) },
]

// Validação de dados do jogo
const validateGameData = () => {
  const allLetters = new Set(Object.keys(letterData))
  for (const diff of difficulties) {
    diff.letters = diff.letters.filter((letter) => allLetters.has(letter))
  }
  for (const letter of allLetters) {
    const data = letterData[letter]
    if (!data.words || data.words.length === 0) {
      console.error(`Letra ${letter} não possui palavras definidas`)
      data.words = ['PALAVRA']
    }
    if (!data.emojis || data.emojis.length === 0) {
      data.emojis = Array(data.words.length).fill('📝')
    }
    if (data.emojis.length < data.words.length) {
      data.emojis = [...data.emojis, ...Array(data.words.length - data.emojis.length).fill('📝')]
    }
  }
}

validateGameData()

const encouragingMessages = [
  'Muito bem! Você conhece suas letras! 📚',
  'Excelente! Continue aprendendo! 🌟',
  'Perfeito! Você está arrasando! ✨',
  'Fantástico! Suas habilidades estão ótimas! 🎓',
  'Incrível! Continue praticando! 💪',
]

// Reducer para gerenciar estado do jogo
const initialState = {
  currentLetter: null,
  options: [],
  gameStarted: false,
  difficulty: 'EASY',
  feedback: null,
  selectedOption: null,
  gameMode: 'word',
  startTime: null,
  moveCount: 0,
  usedQuestions: new Set(),
  totalQuestionsAnswered: 0,
  questionHistory: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_LETTER':
      return { ...state, currentLetter: action.payload }
    case 'SET_OPTIONS':
      return { ...state, options: action.payload }
    case 'SET_GAME_STARTED':
      return { ...state, gameStarted: action.payload }
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload }
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload }
    case 'SET_SELECTED_OPTION':
      return { ...state, selectedOption: action.payload }
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload }
    case 'SET_START_TIME':
      return { ...state, startTime: action.payload }
    case 'INCREMENT_MOVE_COUNT':
      return { ...state, moveCount: state.moveCount + 1 }
    case 'SET_USED_QUESTIONS':
      return { ...state, usedQuestions: action.payload }
    case 'INCREMENT_TOTAL_QUESTIONS':
      return { ...state, totalQuestionsAnswered: state.totalQuestionsAnswered + 1 }
    case 'ADD_QUESTION_HISTORY':
      return { ...state, questionHistory: [...state.questionHistory, action.payload] }
    case 'RESET_QUESTION_HISTORY':
      return { ...state, questionHistory: [] }
    case 'RESET_GAME':
      return { ...initialState, difficulty: state.difficulty }
    default:
      return state
  }
}

// Componente principal
const LetterRecognition = ({ onBack }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { playSound, playClick, playSuccess, playError } = useSound()
  const {
    speak,
    speakInstruction,
    speakFeedback,
    speakLetter,
    speakWord,
    autoSpeak,
    isTTSEnabled,
  } = useTTS()
  const {
    progress,
    saveProgress,
    incrementAttempts,
    incrementSuccesses,
    recordSuccess,
    recordError,
    startActivity,
    getCurrentTimeMetrics,
  } = useProgress('letter-recognition')
  const { userId } = useUser()

  // 🧠 Sistema Multissensorial - Configuração avançada
  const {
    recordAdvancedInteraction,
    recordBehavioralIndicator,
    startAdvancedSession,
    stopAdvancedSession,
    sessionInsights,
  } = useAdvancedActivity('letter-recognition', {
    enableSensorTracking: true,
    enableGeoLocation: false,
    enableNeurodivergenceAnalysis: true,
    enableVisualProcessing: true,
    enableAuditoryProcessing: true,
  })
  // Aplicar configurações de acessibilidade
  useEffect(() => {
    if (prefersHighContrast()) document.body.classList.add('high-contrast')
    if (prefersReducedMotion()) document.body.classList.add('reduced-motion')
    return () => {
      document.body.classList.remove('high-contrast', 'reduced-motion')
    }
  }, [])

  // 🏁 Cleanup e finalização da sessão multissensorial
  useEffect(() => {
    return () => {
      const handleExit = async () => {
        const finalReport = await stopAdvancedSession()
        if (finalReport) {
          console.log('🏁 Sessão LetterRecognition finalizada:', finalReport)
        }
      }
      handleExit()
    }
  }, [stopAdvancedSession])

  // Função para gerar pergunta única
  const generateUniqueQuestion = useCallback(
    (availableLetters) => {
      const maxAttempts = 50
      let attempts = 0

      if (!availableLetters?.length) {
        console.warn('Nenhuma letra disponível, usando fallback')
        return {
          targetLetter: 'A',
          wordIndex: 0,
          questionKey: 'A-0-word',
          word: 'AVIÃO',
          emoji: '✈️',
        }
      }

      while (attempts < maxAttempts) {
        const targetLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)]
        const letterDataForTarget = letterData[targetLetter]
        if (!letterDataForTarget?.words?.length) {
          attempts++
          continue
        }

        for (let i = 0; i < letterDataForTarget.words.length; i++) {
          const questionKey = `${targetLetter}-${i}-${state.gameMode}`
          if (!state.usedQuestions.has(questionKey)) {
            return {
              targetLetter,
              wordIndex: i,
              questionKey,
              word: letterDataForTarget.words[i],
              emoji: letterDataForTarget.emojis[i] || '📝',
            }
          }
        }
        attempts++
      }

      console.log('🔄 Todas as perguntas usadas, resetando...')
      dispatch({ type: 'SET_USED_QUESTIONS', payload: new Set() })
      dispatch({ type: 'ADD_QUESTION_HISTORY', payload: [] })
      const targetLetter = availableLetters[0]
      const wordIndex = 0
      return {
        targetLetter,
        wordIndex,
        questionKey: `${targetLetter}-${wordIndex}-${state.gameMode}`,
        word: letterData[targetLetter].words[wordIndex],
        emoji: letterData[targetLetter].emojis[wordIndex] || '📝',
      }
    },
    [state.gameMode, state.usedQuestions]
  )
  // Gerar nova rodada
  const generateNewRound = useCallback(() => {
    try {
      const availableLetters =
        difficulties.find((d) => d.id === state.difficulty)?.letters || Object.keys(letterData)
      const { targetLetter, wordIndex, questionKey, word, emoji } =
        generateUniqueQuestion(availableLetters)

      // 🎯 Tracking de geração de nova rodada
      recordAdvancedInteraction({
        type: 'round_generation',
        subtype: 'letter_pattern_presentation',
        sensoryModality: 'visual',
        context: {
          targetLetter,
          difficulty: state.difficulty,
          gameMode: state.gameMode,
          questionType:
            state.gameMode === 'word' ? 'letter_to_word_matching' : 'word_to_letter_matching',
          visualPattern: state.gameMode === 'word' ? 'letter_recognition' : 'word_analysis',
          totalQuestions: state.totalQuestionsAnswered + 1,
        },
      })

      // 🔤 Tracking de apresentação de letra/palavra
      recordAdvancedInteraction({
        type: 'pattern_presentation',
        subtype: state.gameMode === 'word' ? 'letter_display' : 'word_display',
        sensoryModality: 'visual',
        context: {
          presentedStimulus: state.gameMode === 'word' ? targetLetter : word,
          stimulusType: state.gameMode === 'word' ? 'alphabetic_character' : 'lexical_unit',
          cognitiveLoad: state.difficulty,
          visualProcessingPattern: 'character_recognition',
        },
      })

      dispatch({
        type: 'SET_USED_QUESTIONS',
        payload: new Set([...state.usedQuestions, questionKey]),
      })
      dispatch({ type: 'ADD_QUESTION_HISTORY', payload: questionKey })
      dispatch({ type: 'INCREMENT_TOTAL_QUESTIONS' })

      if (state.gameMode === 'word') {
        dispatch({ type: 'SET_CURRENT_LETTER', payload: targetLetter })
        const correctOption = { letter: targetLetter, word, emoji, isCorrect: true }
        const incorrectOptions = []
        const otherLetters = availableLetters.filter((l) => l !== targetLetter)

        while (incorrectOptions.length < 3 && otherLetters.length > 0) {
          const randomLetter = otherLetters[Math.floor(Math.random() * otherLetters.length)]
          const randomData = letterData[randomLetter]
          if (randomData?.words?.length) {
            const randomIndex = Math.floor(Math.random() * randomData.words.length)
            const option = {
              letter: randomLetter,
              word: randomData.words[randomIndex],
              emoji: randomData.emojis?.[randomIndex] || '📝',
              isCorrect: false,
            }
            if (!incorrectOptions.some((opt) => opt.word === option.word)) {
              incorrectOptions.push(option)
            }
          }
          otherLetters.splice(otherLetters.indexOf(randomLetter), 1)
        }

        dispatch({
          type: 'SET_OPTIONS',
          payload: [...incorrectOptions, correctOption].sort(() => Math.random() - 0.5),
        })
      } else {
        dispatch({ type: 'SET_CURRENT_LETTER', payload: { word, letter: targetLetter } })
        const incorrectLetters = []
        const otherLetters = availableLetters.filter((l) => l !== targetLetter)

        while (incorrectLetters.length < 3 && otherLetters.length > 0) {
          const randomLetter = otherLetters[Math.floor(Math.random() * otherLetters.length)]
          if (!incorrectLetters.includes(randomLetter)) {
            incorrectLetters.push(randomLetter)
          }
          otherLetters.splice(otherLetters.indexOf(randomLetter), 1)
        }

        const allOptions = [
          ...incorrectLetters.map((letter) => ({ letter, isCorrect: false })),
          { letter: targetLetter, isCorrect: true },
        ]
        dispatch({ type: 'SET_OPTIONS', payload: allOptions.sort(() => Math.random() - 0.5) })
      }

      dispatch({ type: 'SET_SELECTED_OPTION', payload: null })
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
  }, [state.difficulty, state.gameMode, state.usedQuestions, state.totalQuestionsAnswered])
  // Iniciar jogo
  const startGame = useCallback(async () => {
    try {
      await startActivity()

      // 🎯 Iniciar sessão multissensorial avançada
      await startAdvancedSession()

      // 📊 Tracking de início da atividade
      recordAdvancedInteraction({
        type: 'activity_start',
        subtype: 'letter_recognition_initiation',
        sensoryModality: 'visual',
        context: {
          difficulty: state.difficulty,
          gameMode: state.gameMode,
          activityType: 'pattern_recognition',
          cognitiveSkills: ['visual_processing', 'letter_recognition', 'phonetic_awareness'],
          expectedOutcomes: ['alphabet_mastery', 'reading_readiness'],
        },
      })

      dispatch({ type: 'SET_GAME_STARTED', payload: true })
      dispatch({ type: 'SET_USED_QUESTIONS', payload: new Set() })
      dispatch({ type: 'SET_START_TIME', payload: Date.now() })
      generateNewRound()
      announceToScreenReader('Jogo de reconhecimento de letras iniciado!')
      autoSpeak('Jogo de reconhecimento de letras iniciado! Vamos aprender o alfabeto!', 1000)
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error)
      dispatch({
        type: 'SET_FEEDBACK',
        payload: { type: 'error', message: 'Erro ao iniciar o jogo. Tente novamente.' },
      })
    }
  }, [startActivity, startAdvancedSession, state.difficulty, state.gameMode, generateNewRound])
  // Alternar modo de jogo
  const toggleGameMode = useCallback(() => {
    const newMode = state.gameMode === 'word' ? 'letter' : 'word'

    // 🔄 Tracking de mudança de modo
    recordAdvancedInteraction({
      type: 'mode_change',
      subtype: 'cognitive_strategy_shift',
      sensoryModality: 'visual',
      context: {
        previousMode: state.gameMode,
        newMode,
        cognitiveAdaptation:
          newMode === 'word' ? 'letter_to_word_association' : 'word_to_letter_decomposition',
        learningStrategy: 'multimodal_approach',
      },
    })

    dispatch({ type: 'SET_GAME_MODE', payload: newMode })
    dispatch({ type: 'SET_SELECTED_OPTION', payload: null })
    dispatch({ type: 'SET_FEEDBACK', payload: null })
    if (state.gameStarted && state.currentLetter) {
      setTimeout(generateNewRound, 100)
    }
    announceToScreenReader(
      `Modo alterado para: ${newMode === 'word' ? 'Reconhecer palavras' : 'Reconhecer letras'}`
    )
    speakInstruction(
      `Modo alterado para ${newMode === 'word' ? 'reconhecer palavras' : 'reconhecer letras'}.`
    )
  }, [
    state.gameMode,
    state.gameStarted,
    state.currentLetter,
    generateNewRound,
    recordAdvancedInteraction,
  ]) // Lidar com seleção de opção
  const handleOptionSelect = useCallback(
    (option) => {
      if (!option || state.selectedOption) return

      const responseTime = Date.now() - state.startTime
      const isCorrect = option.isCorrect

      // 🎯 Tracking detalhado da seleção
      recordAdvancedInteraction({
        type: 'pattern_selection',
        subtype: state.gameMode === 'word' ? 'word_choice' : 'letter_choice',
        sensoryModality: 'visual',
        responseTime,
        accuracy: isCorrect,
        context: {
          selectedOption: state.gameMode === 'word' ? option.word : option.letter,
          correctAnswer:
            state.gameMode === 'word'
              ? state.options.find((opt) => opt.isCorrect)?.word
              : state.options.find((opt) => opt.isCorrect)?.letter,
          difficulty: state.difficulty,
          cognitiveProcess:
            state.gameMode === 'word' ? 'letter_word_association' : 'word_letter_analysis',
          visualProcessingSpeed:
            responseTime < 3000 ? 'fast' : responseTime < 6000 ? 'moderate' : 'slow',
        },
      })

      dispatch({ type: 'SET_SELECTED_OPTION', payload: option })
      incrementAttempts()
      dispatch({ type: 'INCREMENT_MOVE_COUNT' })

      if (option.isCorrect) {
        incrementSuccesses()

        // ✅ Tracking de sucesso específico para reconhecimento de padrões
        recordAdvancedInteraction({
          type: 'pattern_success',
          subtype: 'letter_recognition_success',
          sensoryModality: 'visual',
          responseTime,
          accuracy: true,
          context: {
            patternType:
              state.gameMode === 'word' ? 'letter_to_word_matching' : 'word_to_letter_matching',
            cognitiveAchievement: 'visual_pattern_recognition',
            learningIndicator: 'alphabet_mastery_progress',
          },
        })

        const difficultyBonus =
          state.difficulty === 'EASY' ? 5 : state.difficulty === 'MEDIUM' ? 10 : 15
        const timeBonus = Math.max(0, 10 - Math.floor((Date.now() - state.startTime) / 1000))
        const baseScore = 10
        const totalScore = recordSuccess(baseScore + difficultyBonus + timeBonus)
        vibrateSuccess()
        playSuccess()
        const successMessage =
          encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]

        // Mostrar feedback de sucesso para o usuário
        speakFeedback(successMessage, true)
        dispatch({
          type: 'SET_FEEDBACK',
          payload: {
            type: 'success',
            message: `${successMessage} +${baseScore + difficultyBonus + timeBonus} pontos!`,
          },
        })
        setTimeout(() => {
          dispatch({ type: 'SET_FEEDBACK', payload: null })
          dispatch({ type: 'SET_SELECTED_OPTION', payload: null })
          generateNewRound()
        }, 2000)
      } else {
        recordError()

        // ❌ Tracking de erro específico para reconhecimento de padrões
        recordAdvancedInteraction({
          type: 'pattern_error',
          subtype: 'letter_recognition_error',
          sensoryModality: 'visual',
          responseTime,
          accuracy: false,
          context: {
            errorType: state.gameMode === 'word' ? 'letter_word_mismatch' : 'word_letter_mismatch',
            selectedWrong: state.gameMode === 'word' ? option.word : option.letter,
            correctAnswer:
              state.gameMode === 'word'
                ? state.options.find((opt) => opt.isCorrect)?.word
                : state.options.find((opt) => opt.isCorrect)?.letter,
            visualProcessingChallenge: 'pattern_discrimination',
            potentialLearningGap: 'alphabet_recognition',
          },
        })

        vibrateError()
        playError()
        const errorMessage = 'Tente novamente! Pense na primeira letra da palavra. 🤔'
        dispatch({ type: 'SET_FEEDBACK', payload: { type: 'error', message: errorMessage } })
        speakFeedback(errorMessage.replace('🤔', ''), false)
        setTimeout(() => {
          dispatch({ type: 'SET_SELECTED_OPTION', payload: null })
          dispatch({ type: 'SET_FEEDBACK', payload: null })
        }, 1500)
      }
    },
    [
      state.selectedOption,
      state.difficulty,
      state.startTime,
      state.gameMode,
      state.options,
      incrementAttempts,
      incrementSuccesses,
      recordSuccess,
      recordError,
      saveProgress,
      generateNewRound,
      recordAdvancedInteraction,
    ]
  )

  // Componente de renderização
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
          <span>🔤</span>
          <span>Reconhecimento de Letras</span>
        </ActivityMainTitle>
        <ActivitySubtitle>
          {!state.gameStarted
            ? 'Vamos aprender as letras do alfabeto'
            : `Modo: ${state.gameMode === 'word' ? 'Palavra' : 'Letra'} - ${progress.score || 0} pontos`}
        </ActivitySubtitle>
      </ActivityTitleSection>

      {!state.gameStarted ? (
        <>
          <InstructionText
            onClick={() =>
              speakInstruction('Vamos aprender as letras! Escolha a dificuldade para começar.')
            }
            role="button"
            aria-label="Instrução: Vamos aprender as letras"
          >
            📚 Vamos aprender as letras! Escolha a dificuldade para começar.
          </InstructionText>
          <DifficultySelector>
            {[
              { id: 'EASY', name: '🟢 Fácil', description: 'Vogais básicas', icon: '😊' },
              { id: 'MEDIUM', name: '🟡 Médio', description: 'Letras comuns', icon: '😐' },
              { id: 'HARD', name: '🔴 Difícil', description: 'Todas as letras', icon: '🧠' },
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
              onClick={() => {
                playClick()
                autoSpeak('Começando jogo de reconhecimento de letras!')
                startGame()
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              themeColor={THEME_COLOR}
              aria-label="Iniciar jogo de reconhecimento de letras"
            >
              🔤🎵 Começar a Aprender
            </ActionButton>
          </ControlButtons>
        </>
      ) : (
        <>
          <InstructionText
            onClick={() =>
              speakInstruction(
                state.gameMode === 'word'
                  ? 'Qual palavra começa com esta letra?'
                  : 'Com qual letra esta palavra começa?'
              )
            }
            role="button"
            aria-label="Instrução do jogo"
          >
            {state.gameMode === 'word'
              ? 'Qual palavra começa com esta letra?'
              : 'Com qual letra esta palavra começa?'}
          </InstructionText>
          <ControlButtons>
            <ActionButton
              className="secondary"
              onClick={toggleGameMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Trocar para modo ${state.gameMode === 'word' ? 'letra' : 'palavra'}`}
            >
              🔄 Trocar Modo: {state.gameMode === 'word' ? 'Palavra→Letra' : 'Letra→Palavra'}
            </ActionButton>{' '}
            <ActionButton
              className={isTTSEnabled ? 'audio' : 'audio disabled'}
              onClick={() => {
                if (!isTTSEnabled) {
                  dispatch({
                    type: 'SET_FEEDBACK',
                    payload: {
                      type: 'info',
                      message: 'Texto para voz desativado nas configurações.',
                    },
                  })
                  setTimeout(() => dispatch({ type: 'SET_FEEDBACK', payload: null }), 3000)
                  return
                }

                // 🔊 Tracking de uso de TTS
                recordAdvancedInteraction({
                  type: 'audio_playback',
                  subtype: 'tts_activation',
                  sensoryModality: 'auditory',
                  context: {
                    ttsContent:
                      state.gameMode === 'word' ? state.currentLetter : state.currentLetter?.word,
                    auditorySupport: 'speech_synthesis',
                    accessibilityFeature: 'text_to_speech',
                    learningModality: 'auditory_reinforcement',
                  },
                })

                if (state.gameMode === 'word') {
                  speakLetter(state.currentLetter || 'A')
                } else {
                  speakWord(state.currentLetter?.word || '')
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!state.currentLetter}
              aria-label={isTTSEnabled ? 'Ouvir novamente' : 'Áudio desativado'}
            >
              {isTTSEnabled ? '🔊 Ouvir Novamente' : '🔇 Áudio Desativado'}
            </ActionButton>
          </ControlButtons>
          <ProgressDisplay>
            <span>Pontos: {progress.score || 0}</span>
            <span>•</span>
            <span>Precisão: {progress.accuracy || 0}%</span>
            <span>•</span>
            <span>📝 Perguntas: {state.totalQuestionsAnswered}</span>
            <span>•</span>
            <StarDisplay>
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i}>{i < (progress.stars || 0) ? '⭐' : '☆'}</span>
              ))}
            </StarDisplay>
          </ProgressDisplay>
          <ActivityTimer
            timeMetrics={getCurrentTimeMetrics()}
            onStart={startActivity}
            showControls={false}
            compact={false}
            invisible={true}
          />
          {state.currentLetter && (
            <TargetLetterDisplay
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => {
                // 🔊 Tracking de interação com TTS na área principal
                recordAdvancedInteraction({
                  type: 'audio_interaction',
                  subtype: 'target_audio_request',
                  sensoryModality: 'auditory',
                  context: {
                    interactionType: 'click_to_hear',
                    targetContent:
                      state.gameMode === 'word' ? state.currentLetter : state.currentLetter?.word,
                    auditoryLearning: 'direct_audio_feedback',
                    userInitiated: true,
                  },
                })

                if (state.gameMode === 'word') {
                  speakLetter(state.currentLetter || 'A')
                } else {
                  speakWord(state.currentLetter?.word || '')
                }
              }}
              role="button"
              aria-label={state.gameMode === 'word' ? 'Ouvir letra' : 'Ouvir palavra'}
            >
              <div className="target-display">
                {state.gameMode === 'word' ? state.currentLetter : state.currentLetter?.word || '?'}
              </div>
              <LetterInfo>
                {state.gameMode === 'word'
                  ? 'Clique para ouvir a letra'
                  : 'Clique para ouvir a palavra'}
              </LetterInfo>
            </TargetLetterDisplay>
          )}
          {state.options.length > 0 && (
            <OptionsGrid>
              {state.options.map((option, index) => (
                <LetterOption
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={
                    state.selectedOption === option
                      ? option.isCorrect
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  aria-label={
                    state.gameMode === 'word'
                      ? `Opção: ${option.word}`
                      : `Opção: letra ${option.letter}`
                  }
                >
                  {state.gameMode === 'word' ? (
                    <>
                      <OptionImage>{option.emoji || '📝'}</OptionImage>
                      <OptionWord>{option.word}</OptionWord>
                    </>
                  ) : (
                    <OptionLetter>{option.letter}</OptionLetter>
                  )}
                </LetterOption>
              ))}
            </OptionsGrid>
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
        </>
      )}
    </GameContainer>
  )
}

LetterRecognition.propTypes = {
  onBack: PropTypes.func.isRequired,
}

export default LetterRecognition
