import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
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
import { createAdaptiveModel, getAdaptiveParameters } from '../../utils/adaptive'
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

// Definição de cores temáticas para esta atividade
const THEME_COLOR = 'var(--primary-orange)'
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-orange), var(--primary-pink))'

// Estilos específicos para NumberCounting com as cores temáticas
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
  color: var(--primary-orange);
`

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
`

const CountingArea = styled.div`
  background: linear-gradient(135deg, var(--light-gray), var(--white));
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  width: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  box-shadow: var(--shadow-medium);

  @media (max-width: 768px) {
    padding: var(--space-lg);
    min-height: 250px;
  }
`

const ObjectsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: var(--space-md);
  width: 100%;
  max-width: 500px;
  justify-items: center;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    gap: var(--space-sm);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
    gap: var(--space-xs);
    max-width: 400px;
  }

  @media (max-width: 360px) {
    grid-template-columns: repeat(3, 1fr);
    max-width: 300px;
  }
`

const CountableObject = styled(motion.div)`
  width: 60px;
  height: 60px;
  background: white;
  border-radius: var(--radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: var(--shadow-light);
  cursor: pointer;
  border: 3px solid transparent;
  transition: all var(--transition-normal);

  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-medium);
  }

  &.counted {
    border-color: var(--primary-green);
    background: var(--success-light);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
`

const QuestionDisplay = styled.div`
  text-align: center;
  font-size: var(--font-size-lg);
  color: var(--primary-blue);
  font-weight: 600;
  margin-bottom: var(--space-md);

  @media (max-width: 768px) {
    font-size: var(--font-size-md);
  }
`

const NumberOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: var(--space-md);
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-sm);
  }
`

const NumberOption = styled(motion.button)`
  background: white;
  border: 3px solid var(--primary-blue);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  cursor: pointer;
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-blue);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-medium);
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--primary-blue);
    color: white;
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
    font-size: 1.5rem;
    min-height: 60px;
  }
`

// Estilos específicos para botões dessa atividade
const NumberActionButton = styled(ActionButton)`
  &.secondary {
    background: var(--primary-blue);
  }

  &.audio {
    background: var(--primary-purple);
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

const CountingHelper = styled.div`
  font-size: var(--font-size-md);
  color: var(--medium-gray);
  text-align: center;
  margin-top: var(--space-sm);
`

// Objetos para contar com diferentes categorias
const countableObjects = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  fruits: ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🥭', '🍍', '🥥'],
  toys: ['⚽', '🏀', '🎾', '🧸', '🪀', '🎲', '🧩', '🎸', '🎯', '🎮'],
  vehicles: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐'],
  flowers: ['🌸', '🌺', '🌻', '🌷', '🌹', '🏵️', '💐', '🌼', '🌿', '🍀'],
  food: ['🍰', '🧁', '🍪', '🍩', '🍭', '🍬', '🍫', '🎂', '🍯', '🍔'],
}

const difficulties = [
  { id: 'easy', name: 'Fácil (1-5)', min: 1, max: 5, options: 3 },
  { id: 'medium', name: 'Médio (1-10)', min: 1, max: 10, options: 4 },
  { id: 'hard', name: 'Difícil (1-15)', min: 1, max: 15, options: 5 },
]

const encouragingMessages = [
  'Muito bem! Você sabe contar! 🔢',
  'Excelente! Seus números estão perfeitos! 🌟',
  'Fantástico! Continue contando! ✨',
  'Incrível! Você é ótimo com números! 💪',
  'Parabéns! Matemática é divertida! 🎉',
]

function NumberCounting({ onBack }) {
  const [objects, setObjects] = useState([])
  const [correctCount, setCorrectCount] = useState(0)
  const [numberOptions, setNumberOptions] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [feedback, setFeedback] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [countedObjects, setCountedObjects] = useState([])
  const [gameMode, setGameMode] = useState('count') // 'count' ou 'select'
  const [currentCategory, setCurrentCategory] = useState('animals')
  const [startTime, setStartTime] = useState(null)
  const [moveCount, setMoveCount] = useState(0)
  const [adaptiveModel, setAdaptiveModel] = useState(null)
  const [adaptiveParams, setAdaptiveParams] = useState(null)
  const { playSound, playClick, playSuccess, playError } = useSound()

  const { speak, speakInstruction, speakFeedback, speakQuestion, speakNumber, autoSpeak, stop } =
    useTTS()

  const { userId } = useUser()

  // 🧠 Sistema Multissensorial - Configuração avançada
  const {
    recordAdvancedInteraction,
    recordBehavioralIndicator,
    startAdvancedSession,
    stopAdvancedSession,
    sessionInsights,
  } = useAdvancedActivity('number-counting', {
    enableSensorTracking: true,
    enableGeoLocation: false,
    enableNeurodivergenceAnalysis: true,
    enableVisualProcessing: true,
    enableMathematicalProcessing: true, // Específico para atividades matemáticas
  })

  const {
    progress,
    incrementSuccesses,
    incrementAttempts,
    recordSuccess,
    recordError,
    resetProgress,
    updateTimeSpent,
    saveProgress,
    startActivity,
    pauseActivity,
    resumeActivity,
    finishActivity,
    getCurrentTimeMetrics,
    sessionId,
    isActivityActive,
    isActivityPaused,
    getFormattedTime,
    getStats,
    getEncouragementMessage,
  } = useProgress('number-counting')

  // Funções de controle da cronometragem
  const handlePauseResume = async () => {
    if (isActivityPaused) {
      await resumeActivity()
    } else {
      await pauseActivity()
    }
  }

  const handleFinishActivity = async () => {
    await finishActivity()
    // Opcional: redirecionar ou mostrar relatório final
  }

  // Aplicar configurações de acessibilidade
  const applyAccessibilitySettings = () => {
    if (prefersHighContrast()) {
      document.body.classList.add('high-contrast')
    }
    if (prefersReducedMotion()) {
      document.body.classList.add('reduced-motion')
    }
  }
  // Função async para inicializar o modelo adaptativo
  const initializeAdaptiveModel = async () => {
    try {
      // Inicializar modelo adaptativo
      const model = createAdaptiveModel('number-counting', userId)
      setAdaptiveModel(model)

      // Obter parâmetros adaptados
      try {
        const params = await getAdaptiveParameters('number-counting', difficulty)
        setAdaptiveParams(params)

        if (params && params.difficulty !== difficulty) {
          setDifficulty(params.difficulty)
        }
      } catch (error) {
        console.warn('Erro ao obter parâmetros adaptativos:', error)
        // Usar configuração padrão como fallback
        setAdaptiveParams({
          difficulty: difficulty || 'easy',
          parameters: {
            maxCount: difficulties.find((d) => d.id === (difficulty || 'easy'))?.max || 5,
            minCount: difficulties.find((d) => d.id === (difficulty || 'easy'))?.min || 1,
            options: difficulties.find((d) => d.id === (difficulty || 'easy'))?.options || 3,
          },
        })
      }
    } catch (error) {
      console.error('Erro ao inicializar modelo adaptativo:', error)
    }
  }
  useEffect(() => {
    applyAccessibilitySettings()

    // Verificar se a dificuldade é válida
    if (!difficulty || !difficulties.some((d) => d.id === difficulty)) {
      console.log('Definindo dificuldade inicial para "easy"')
      setDifficulty('easy')
    }

    // Inicializar modelo adaptativo
    initializeAdaptiveModel()
  }, [])

  // 🏁 Cleanup e finalização da sessão multissensorial
  useEffect(() => {
    return () => {
      const handleExit = async () => {
        const finalReport = await stopAdvancedSession()
        if (finalReport) {
          console.log('🏁 Sessão NumberCounting finalizada:', finalReport)
        }
      }
      handleExit()
    }
  }, [stopAdvancedSession])

  // Reproduzir número falado - usando TTS hook
  const speakNumberCustom = (number) => {
    speakNumber(number)
    announceToScreenReader(`Número ${number}`)
  }

  // Calcular pontuação
  const calculateScore = (isCorrect, movesMade, difficultyLevel) => {
    const basePoints = isCorrect ? 10 : 0
    const difficultyBonus = difficultyLevel === 'easy' ? 0 : difficultyLevel === 'medium' ? 5 : 10
    const efficiencyBonus = Math.max(0, 10 - Math.min(movesMade - correctCount, 10))
    return basePoints + difficultyBonus + efficiencyBonus
  } // Iniciar o jogo
  const startGame = async () => {
    // Iniciar cronometragem da atividade
    await startActivity()

    // 🎯 Iniciar sessão multissensorial avançada
    await startAdvancedSession()

    // 📊 Tracking de início da atividade matemática
    recordAdvancedInteraction({
      type: 'activity_start',
      subtype: 'mathematical_counting_initiation',
      sensoryModality: 'visual',
      context: {
        difficulty: difficulty,
        gameMode: gameMode,
        activityType: 'numerical_counting',
        cognitiveSkills: ['mathematical_reasoning', 'visual_processing', 'quantity_recognition'],
        expectedOutcomes: ['number_sense_development', 'counting_proficiency'],
      },
    })

    // Verificar se a dificuldade está definida corretamente
    if (!difficulty || !difficulties.some((d) => d.id === difficulty)) {
      console.log('Definindo dificuldade padrão para "easy"')
      setDifficulty('easy')
    }

    setGameStarted(true)
    resetProgress()
    setStartTime(Date.now())

    // Aguardar um momento para garantir que a dificuldade foi definida
    setTimeout(() => {
      generateNewRound()
    }, 100)

    announceToScreenReader('Jogo iniciado! Conte os objetos na tela.')

    // TTS: Anunciar início do jogo
    autoSpeak(
      'Jogo de contagem iniciado! Conte os objetos na tela e escolha o número correto.',
      1000
    )
  }
  // Alternar entre os modos de jogo
  const toggleGameMode = () => {
    const newMode = gameMode === 'count' ? 'select' : 'count'

    // 🔄 Tracking de mudança de modo matemático
    recordAdvancedInteraction({
      type: 'mode_change',
      subtype: 'mathematical_strategy_shift',
      sensoryModality: 'visual',
      context: {
        previousMode: gameMode,
        newMode: newMode,
        cognitiveAdaptation:
          newMode === 'count' ? 'sequential_counting_approach' : 'visual_quantity_assessment',
        mathematicalStrategy: 'multimodal_counting_approach',
      },
    })

    setGameMode(newMode)
    setCountedObjects([])
    setObjects(objects.map((obj) => ({ ...obj, counted: false })))
    announceToScreenReader(
      newMode === 'count'
        ? 'Modo contagem: clique nos objetos para contá-los.'
        : 'Modo seleção: escolha o número correto de objetos.'
    )

    // TTS: Anunciar mudança de modo
    speakInstruction(
      newMode === 'count'
        ? 'Modo contagem ativado. Clique nos objetos para contá-los um por um.'
        : 'Modo seleção ativado. Conte os objetos e escolha o número correto.'
    )
  }

  // Reiniciar contagem
  const resetCounting = () => {
    setCountedObjects([])
    setMoveCount(0)
    setObjects(objects.map((obj) => ({ ...obj, counted: false })))
    announceToScreenReader('Contagem reiniciada!')

    // TTS: Anunciar reinício da contagem
    speakInstruction('Contagem reiniciada! Comece a contar novamente.')
  } // Gerar nova rodada
  const generateNewRound = () => {
    // Verificar se a dificuldade é válida e fazer fallback para 'easy' se necessário
    let currentDifficulty = difficulty
    if (!currentDifficulty || !difficulties.some((d) => d.id === currentDifficulty)) {
      console.warn(`Dificuldade "${currentDifficulty}" inválida, usando "easy" como fallback`)
      currentDifficulty = 'easy'
      setDifficulty('easy')
    }

    const difficultyData = difficulties.find((d) => d.id === currentDifficulty)

    // Verificar se os dados de dificuldade existem
    if (!difficultyData) {
      console.error('Dados de dificuldade não encontrados para:', currentDifficulty)
      // Usar a primeira dificuldade como fallback
      const fallbackDifficulty = difficulties[0]
      if (fallbackDifficulty) {
        console.log('Usando primeira dificuldade como fallback:', fallbackDifficulty.id)
        setDifficulty(fallbackDifficulty.id)
        // Tentar novamente com a nova dificuldade
        setTimeout(generateNewRound, 0)
      }
      return
    }

    // Usar parâmetros adaptados se disponíveis
    const adaptedMax = adaptiveParams?.parameters?.maxCount || difficultyData.max
    const adaptedMin = adaptiveParams?.parameters?.minCount || difficultyData.min
    const adaptedOptions = adaptiveParams?.parameters?.options || difficultyData.options

    // Escolher quantidade aleatória
    const count = Math.floor(Math.random() * (adaptedMax - adaptedMin + 1)) + adaptedMin
    setCorrectCount(count)
    setMoveCount(0)
    // Escolher categoria aleatória
    const categories = Object.keys(countableObjects)
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    setCurrentCategory(randomCategory)

    // 🎯 Tracking de geração de nova rodada matemática
    recordAdvancedInteraction({
      type: 'mathematical_round_generation',
      subtype: 'counting_pattern_presentation',
      sensoryModality: 'visual',
      context: {
        targetNumber: count,
        difficulty: currentDifficulty,
        gameMode: gameMode,
        category: randomCategory,
        cognitiveSkill: 'numerical_counting',
        mathematicalConcept: 'one_to_one_correspondence',
        visualPattern: 'object_enumeration',
      },
    })

    // Gerar objetos
    const categoryObjects = countableObjects[randomCategory]
    const selectedObjects = []

    for (let i = 0; i < count; i++) {
      const randomObject = categoryObjects[Math.floor(Math.random() * categoryObjects.length)]
      selectedObjects.push({
        id: i,
        emoji: randomObject,
        counted: false,
      })
    }
    setObjects(selectedObjects)
    setCountedObjects([])

    // 🔢 Tracking de apresentação de objetos para contagem
    recordAdvancedInteraction({
      type: 'object_presentation',
      subtype: 'mathematical_stimulus_display',
      sensoryModality: 'visual',
      context: {
        objectCount: count,
        objectCategory: randomCategory,
        visualArrangement: 'grid_layout',
        mathematicalChallenge:
          gameMode === 'count' ? 'sequential_counting' : 'quantity_recognition',
        cognitiveLoad: currentDifficulty,
      },
    })

    // Gerar opções de números
    const options = [count]
    while (options.length < adaptedOptions) {
      // Gerar números mais próximos do correto para dificultar
      let offset = difficulty === 'hard' ? 1 : 2
      let wrongNumber

      if (Math.random() < 0.7) {
        // 70% de chance de gerar um número próximo
        wrongNumber =
          count + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * offset) + 1)
      } else {
        // 30% de chance de gerar um número qualquer
        wrongNumber = Math.floor(Math.random() * adaptedMax) + 1
      }

      // Garantir que está no intervalo válido
      wrongNumber = Math.max(1, Math.min(adaptedMax, wrongNumber))

      if (!options.includes(wrongNumber)) {
        options.push(wrongNumber)
      }
    }

    setNumberOptions(
      options
        .sort(() => Math.random() - 0.5)
        .map((num) => ({
          number: num,
          isCorrect: num === count,
        }))
    )

    setSelectedAnswer(null)
    setFeedback(null)
  } // Lidar com clique em objeto (modo contagem)
  const handleObjectClick = (objectId) => {
    if (gameMode !== 'count') return

    const object = objects.find((obj) => obj.id === objectId)
    if (!object || object.counted) return

    const newCountedObjects = [...countedObjects, objectId]

    // 🖱️ Tracking de interação de contagem
    recordAdvancedInteraction({
      type: 'counting_interaction',
      subtype: 'object_selection',
      sensoryModality: 'visual',
      context: {
        objectId: objectId,
        currentCount: newCountedObjects.length,
        totalObjects: correctCount,
        countingProgress: (newCountedObjects.length / correctCount) * 100,
        mathematicalSkill: 'sequential_counting',
        cognitiveProcess: 'one_to_one_correspondence',
      },
    })

    playClick()
    setMoveCount((prev) => prev + 1)
    setCountedObjects(newCountedObjects)

    // Atualizar objeto como contado
    setObjects(objects.map((obj) => (obj.id === objectId ? { ...obj, counted: true } : obj)))

    // Tocar som de contagem
    speakNumberCustom(newCountedObjects.length)

    // Verificar se terminou de contar
    if (newCountedObjects.length === correctCount) {
      // ✅ Tracking de sucesso na contagem
      recordAdvancedInteraction({
        type: 'counting_success',
        subtype: 'mathematical_completion',
        sensoryModality: 'visual',
        context: {
          finalCount: correctCount,
          totalMoves: moveCount + 1,
          countingAccuracy: 100,
          mathematicalAchievement: 'numerical_counting_mastery',
          cognitiveSkill: 'quantity_recognition',
        },
      })

      setTimeout(() => {
        // Registrar sucesso
        recordSuccess()
        incrementSuccesses()
        incrementAttempts()
        vibrateSuccess()
        playSuccess()

        // Calcular pontuação baseado na dificuldade e eficiência
        const score = calculateScore(true, moveCount, difficulty)

        // Salvar dados para modelo adaptativo
        if (adaptiveModel) {
          const gameData = {
            difficulty,
            correctCount,
            moveCount,
            timeSpent: Math.floor((Date.now() - startTime) / 1000),
            accuracy: 100,
            score,
          }

          // Obter recomendação para próxima rodada
          const recommendation = adaptiveModel.saveGameData(gameData)
          if (recommendation && recommendation !== difficulty) {
            setDifficulty(recommendation)
          }
        }

        const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
        setFeedback({
          type: 'success',
          message: `${message} Você contou ${correctCount} objetos! +${score} pontos!`,
        })

        // TTS: Anunciar sucesso
        speakFeedback(
          `${message} Você contou ${correctCount} objetos corretamente! Ganhou ${score} pontos!`,
          true
        )

        // Salvar progresso geral
        saveProgress()

        // Próxima rodada após delay
        setTimeout(() => {
          generateNewRound()
        }, 3000)
      }, 500)
    }
  } // Lidar com seleção de número (modo seleção)
  const handleNumberSelect = (option) => {
    if (selectedAnswer || gameMode !== 'select') return

    // 🔢 Tracking de seleção de número
    recordAdvancedInteraction({
      type: 'number_selection',
      subtype: 'mathematical_choice',
      sensoryModality: 'visual',
      accuracy: option.isCorrect,
      context: {
        selectedNumber: option.number,
        correctNumber: correctCount,
        numberOfOptions: numberOptions.length,
        mathematicalSkill: 'quantity_recognition',
        cognitiveProcess: 'visual_counting_assessment',
      },
    })

    playClick()
    setMoveCount((prev) => prev + 1)
    setSelectedAnswer(option)

    if (option.isCorrect) {
      // ✅ Tracking de sucesso na seleção de número
      recordAdvancedInteraction({
        type: 'mathematical_success',
        subtype: 'number_recognition_success',
        sensoryModality: 'visual',
        accuracy: true,
        context: {
          correctAnswer: correctCount,
          mathematicalAchievement: 'quantity_assessment_mastery',
          cognitiveSkill: 'numerical_recognition',
        },
      })

      recordSuccess()
      incrementSuccesses()
      incrementAttempts()
      vibrateSuccess()
      playSuccess()

      // Calcular pontuação
      const score = calculateScore(true, moveCount, difficulty)

      // Salvar dados para modelo adaptativo
      if (adaptiveModel) {
        const gameData = {
          difficulty,
          correctCount,
          moveCount,
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
          accuracy: 100,
          score,
        }

        // Obter recomendação para próxima rodada
        const recommendation = adaptiveModel.saveGameData(gameData)
        if (recommendation && recommendation !== difficulty) {
          setDifficulty(recommendation)
        }
      }

      const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
      setFeedback({
        type: 'success',
        message: `${message} Há ${correctCount} objetos! +${score} pontos!`,
      })

      // TTS: Anunciar sucesso na seleção
      speakFeedback(`${message} Correto! Há ${correctCount} objetos! Ganhou ${score} pontos!`, true)

      // Salvar progresso geral
      saveProgress()

      // Próxima rodada após delay
      setTimeout(() => {
        generateNewRound()
      }, 2500)
    } else {
      // ❌ Tracking de erro na seleção de número
      recordAdvancedInteraction({
        type: 'mathematical_error',
        subtype: 'number_recognition_error',
        sensoryModality: 'visual',
        accuracy: false,
        context: {
          selectedWrong: option.number,
          correctAnswer: correctCount,
          errorType: 'quantity_miscounting',
          mathematicalChallenge: 'visual_counting_assessment',
        },
      })

      recordError()
      incrementAttempts()
      vibrateError()
      playSound('error')

      setFeedback({
        type: 'error',
        message: 'Conte novamente! Observe bem todos os objetos. 🔍',
      })

      // TTS: Anunciar erro
      speakFeedback('Conte novamente! Observe bem todos os objetos.', false)

      // Resetar após delay
      setTimeout(() => {
        setSelectedAnswer(null)
        setFeedback(null)
      }, 2000)
    }
  }
  return (
    <GameContainer>
      <GameHeader>
        <BackButton onClick={onBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          ⬅️ Voltar
        </BackButton>
      </GameHeader>
      <ActivityTitleSection>
        <ActivityMainTitle>
          <span>🔢</span>
          <span>Contando Números</span>
        </ActivityMainTitle>
        <ActivitySubtitle>Aprenda a contar objetos de forma divertida</ActivitySubtitle>
      </ActivityTitleSection>
      {gameStarted && (
        <GameStats>
          <StatItem>
            <StatValue>{progress.score}</StatValue>
            <StatLabel>Pontos</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{progress.level}</StatValue>
            <StatLabel>Nível</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{progress.stars}</StatValue>
            <StatLabel>⭐ Estrelas</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{getStats().accuracy}%</StatValue>
            <StatLabel>Precisão</StatLabel>
          </StatItem>
        </GameStats>
      )}
      <InstructionText
        onClick={() => {
          if (!gameStarted) {
            speakInstruction('Vamos aprender a contar! Escolha a dificuldade para começar.')
          } else if (gameMode === 'count') {
            speakInstruction('Clique nos objetos para contá-los um por um!')
          } else {
            speakInstruction('Quantos objetos você vê? Clique no número correto!')
          }
        }}
      >
        {!gameStarted
          ? '🔢 Vamos aprender a contar! Escolha a dificuldade para começar.'
          : gameMode === 'count'
            ? 'Clique nos objetos para contá-los um por um!'
            : 'Quantos objetos você vê? Clique no número correto!'}
      </InstructionText>
      {!gameStarted && (
        <DifficultySelector>
          {[
            {
              id: 'easy',
              name: '🟢 Fácil',
              description: '2 objetos (1-5)',
              icon: '😊',
            },
            {
              id: 'medium',
              name: '🟡 Médio',
              description: '3 objetos (1-10)',
              icon: '😐',
            },
            {
              id: 'hard',
              name: '🔴 Difícil',
              description: '4 objetos (1-15)',
              icon: '🧠',
            },
          ].map((diff) => (
            <DifficultyButton
              key={diff.id}
              isActive={difficulty === diff.id}
              onClick={() => {
                setDifficulty(diff.id)
                playClick()
                // TTS: Anunciar dificuldade selecionada
                speak(`Dificuldade ${diff.name} selecionada. ${diff.description}`)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              themeColor={THEME_COLOR}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{diff.icon}</div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{diff.name}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{diff.description}</div>
            </DifficultyButton>
          ))}
        </DifficultySelector>
      )}{' '}
      {gameStarted && (
        <ProgressDisplay>
          <span>Pontos: {progress.score}</span>
          <span>•</span>
          <span>Precisão: {progress.accuracy}%</span>
          <span>•</span>
          <StarDisplay>
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i}>{i < progress.stars ? '⭐' : '☆'}</span>
            ))}
          </StarDisplay>
        </ProgressDisplay>
      )}{' '}
      {/* Timer da atividade - invisível, apenas para métricas internas */}
      <ActivityTimer
        timeMetrics={isActivityActive ? getCurrentTimeMetrics() : null}
        onStart={startActivity}
        onPause={pauseActivity}
        onResume={resumeActivity}
        onFinish={finishActivity}
        compact={false}
        invisible={true}
      />
      {objects.length > 0 && (
        <CountingArea>
          <QuestionDisplay>
            {gameMode === 'count' ? `Conte os objetos clicando neles:` : `Quantos objetos há aqui?`}
          </QuestionDisplay>

          <ObjectsContainer>
            {objects.map((object) => (
              <CountableObject
                key={object.id}
                className={object.counted ? 'counted' : ''}
                onClick={() => handleObjectClick(object.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: object.id * 0.1 }}
              >
                {object.emoji}
              </CountableObject>
            ))}
          </ObjectsContainer>

          {gameMode === 'count' && countedObjects.length > 0 && (
            <CountingHelper>
              Você contou: {countedObjects.length} objeto{countedObjects.length !== 1 ? 's' : ''}
            </CountingHelper>
          )}
        </CountingArea>
      )}
      {gameMode === 'select' && numberOptions.length > 0 && (
        <NumberOptionsGrid>
          {numberOptions.map((option, index) => (
            <NumberOption
              key={index}
              onClick={() => handleNumberSelect(option)}
              className={
                selectedAnswer === option ? (option.isCorrect ? 'correct' : 'incorrect') : ''
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {option.number}
            </NumberOption>
          ))}
        </NumberOptionsGrid>
      )}
      <ControlButtons>
        {!gameStarted ? (
          <ActionButton
            onClick={() => {
              playClick()
              speak('Começando jogo de contagem!')
              startGame()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            themeColor={THEME_COLOR}
          >
            🔢 Começar a Contar
          </ActionButton>
        ) : (
          <>
            <ActionButton
              className="secondary"
              onClick={toggleGameMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Modo: {gameMode === 'count' ? 'Contar→Escolher' : 'Escolher→Contar'}
            </ActionButton>

            {gameMode === 'count' && (
              <ActionButton
                className="audio"
                onClick={resetCounting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔄 Recomeçar Contagem
              </ActionButton>
            )}
            <ActionButton
              className="audio"
              onClick={() => {
                // 🔊 Tracking de uso de TTS para resposta
                recordAdvancedInteraction({
                  type: 'audio_playback',
                  subtype: 'answer_audio_request',
                  sensoryModality: 'auditory',
                  context: {
                    requestedNumber: correctCount,
                    auditorySupport: 'number_pronunciation',
                    accessibilityFeature: 'text_to_speech',
                    learningModality: 'auditory_reinforcement',
                  },
                })

                speakNumberCustom(correctCount)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔊 Ouvir Resposta
            </ActionButton>
          </>
        )}
      </ControlButtons>
      <AnimatePresence>
        {feedback && (
          <FeedbackMessage
            className={feedback.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {feedback.message}
          </FeedbackMessage>
        )}
      </AnimatePresence>
    </GameContainer>
  )
}

export default NumberCounting
