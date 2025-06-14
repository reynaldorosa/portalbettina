import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import useSound from '../../hooks/useSound'
import useProgress from '../../hooks/useProgress'
import useTTS from '../../hooks/useTTS'
import { useUser } from '../../contexts/UserContext'
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

// Definição de cores temáticas para esta atividade
const THEME_COLOR = 'var(--primary-orange)'
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-orange), var(--primary-pink))'

// Estilos específicos para ImageAssociation com as cores temáticas
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

const ScoreDisplay = styled.div`
  text-align: center;
  font-size: var(--font-size-lg);
  color: var(--primary-orange);
  font-weight: 600;
`

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
`

const MainItem = styled(motion.div)`
  background: white;
  border: 4px solid var(--primary-orange);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  text-align: center;
  box-shadow: var(--shadow-medium);
  min-width: 200px;
`

const MainEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: var(--space-md);
  line-height: 1;
`

const MainLabel = styled.div`
  font-size: var(--font-size-lg);
  color: var(--dark-gray);
  font-weight: 600;
`

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-md);
  max-width: 600px;
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const OptionCard = styled(motion.button)`
  background: white;
  border: 3px solid
    ${(props) =>
      props.isCorrect === true
        ? 'var(--success)'
        : props.isCorrect === false
          ? 'var(--error)'
          : 'var(--light-gray)'};
  border-radius: var(--radius-medium);
  padding: var(--space-md);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  min-height: 120px;
  box-shadow: var(--shadow-light);
  position: relative;

  &:hover:not(:disabled) {
    border-color: var(--primary-orange);
    transform: translateY(-2px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:focus {
    outline: 3px solid var(--primary-blue);
    outline-offset: 2px;
  }
`

const OptionEmoji = styled.div`
  font-size: 2.5rem;
  line-height: 1;
`

const OptionLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--dark-gray);
  font-weight: 500;
  text-align: center;
`

const FeedbackIcon = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  background: ${(props) => (props.isCorrect ? 'var(--success)' : 'var(--error)')};
  color: white;
  border-radius: var(--radius-round);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-medium);
`

const NextButton = styled(motion.button)`
  background: var(--primary-orange);
  color: white;
  border: none;
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-top: var(--space-md);

  &:disabled {
    background: var(--medium-gray);
    cursor: not-allowed;
  }
`

// Associações lógicas expandidas para 15 fases com progressão terapêutica
const associations = [
  // FASES 1-3: Associações básicas e diretas (Nível Fácil)
  {
    phase: 1,
    difficulty: 'EASY',
    category: 'animais-básicos',
    concept: 'associação-direta',
    therapeuticFocus: 'reconhecimento-visual',
    main: { emoji: '🐶', label: 'Cachorro' },
    correct: { emoji: '🦴', label: 'Osso' },
    explanation: 'Cachorros adoram roer ossos!',
    options: [
      { emoji: '🦴', label: 'Osso' },
      { emoji: '🐱', label: 'Gato' },
      { emoji: '🌸', label: 'Flor' },
      { emoji: '🚗', label: 'Carro' },
    ],
  },
  {
    phase: 2,
    difficulty: 'EASY',
    category: 'natureza-básica',
    concept: 'habitat-natural',
    therapeuticFocus: 'relações-causais',
    main: { emoji: '🐟', label: 'Peixe' },
    correct: { emoji: '💧', label: 'Água' },
    explanation: 'Peixes vivem na água!',
    options: [
      { emoji: '🔥', label: 'Fogo' },
      { emoji: '💧', label: 'Água' },
      { emoji: '🍕', label: 'Pizza' },
      { emoji: '✈️', label: 'Avião' },
    ],
  },
  {
    phase: 3,
    difficulty: 'EASY',
    category: 'alimentos-origem',
    concept: 'origem-produto',
    therapeuticFocus: 'conhecimento-cotidiano',
    main: { emoji: '🥛', label: 'Leite' },
    correct: { emoji: '🐄', label: 'Vaca' },
    explanation: 'O leite vem da vaca!',
    options: [
      { emoji: '🐄', label: 'Vaca' },
      { emoji: '🐧', label: 'Pinguim' },
      { emoji: '🎈', label: 'Balão' },
      { emoji: '🍎', label: 'Maçã' },
    ],
  },

  // FASES 4-7: Associações funcionais (Nível Médio-Baixo)
  {
    phase: 4,
    difficulty: 'MEDIUM',
    category: 'insetos-plantas',
    concept: 'relação-simbiótica',
    therapeuticFocus: 'compreensão-ecológica',
    main: { emoji: '🐝', label: 'Abelha' },
    correct: { emoji: '🌸', label: 'Flor' },
    explanation: 'Abelhas coletam néctar das flores!',
    options: [
      { emoji: '🌸', label: 'Flor' },
      { emoji: '🐟', label: 'Peixe' },
      { emoji: '🏠', label: 'Casa' },
      { emoji: '⚽', label: 'Bola' },
    ],
  },
  {
    phase: 5,
    difficulty: 'MEDIUM',
    category: 'corpo-função',
    concept: 'função-corporal',
    therapeuticFocus: 'autocuidado',
    main: { emoji: '👁️', label: 'Olho' },
    correct: { emoji: '👓', label: 'Óculos' },
    explanation: 'Óculos ajudam os olhos a enxergar melhor!',
    options: [
      { emoji: '👓', label: 'Óculos' },
      { emoji: '🦷', label: 'Dente' },
      { emoji: '🎧', label: 'Fone' },
      { emoji: '🧠', label: 'Cérebro' },
    ],
  },
  {
    phase: 6,
    difficulty: 'MEDIUM',
    category: 'profissões-ferramentas',
    concept: 'profissão-instrumento',
    therapeuticFocus: 'conhecimento-social',
    main: { emoji: '👨‍⚕️', label: 'Médico' },
    correct: { emoji: '🩺', label: 'Estetoscópio' },
    explanation: 'Médicos usam estetoscópio para auscultar!',
    options: [
      { emoji: '🩺', label: 'Estetoscópio' },
      { emoji: '🔨', label: 'Martelo' },
      { emoji: '📚', label: 'Livro' },
      { emoji: '🎨', label: 'Pincel' },
    ],
  },
  {
    phase: 7,
    difficulty: 'MEDIUM',
    category: 'tempo-ação',
    concept: 'atividade-temporal',
    therapeuticFocus: 'rotina-diária',
    main: { emoji: '🌙', label: 'Noite' },
    correct: { emoji: '😴', label: 'Dormir' },
    explanation: 'À noite é hora de dormir!',
    options: [
      { emoji: '😴', label: 'Dormir' },
      { emoji: '🏃', label: 'Correr' },
      { emoji: '🍽️', label: 'Comer' },
      { emoji: '📖', label: 'Estudar' },
    ],
  },

  // FASES 8-11: Associações conceituais (Nível Médio-Alto)
  {
    phase: 8,
    difficulty: 'MEDIUM',
    category: 'emoções-expressões',
    concept: 'sentimento-expressão',
    therapeuticFocus: 'inteligência-emocional',
    main: { emoji: '😢', label: 'Tristeza' },
    correct: { emoji: '🤗', label: 'Abraço' },
    explanation: 'Um abraço pode consolar a tristeza!',
    options: [
      { emoji: '🤗', label: 'Abraço' },
      { emoji: '🎉', label: 'Festa' },
      { emoji: '⚽', label: 'Futebol' },
      { emoji: '🍰', label: 'Bolo' },
    ],
  },
  {
    phase: 9,
    difficulty: 'MEDIUM',
    category: 'causas-efeitos',
    concept: 'causa-consequência',
    therapeuticFocus: 'raciocínio-lógico',
    main: { emoji: '🌧️', label: 'Chuva' },
    correct: { emoji: '☂️', label: 'Guarda-chuva' },
    explanation: 'Usamos guarda-chuva para nos proteger da chuva!',
    options: [
      { emoji: '☂️', label: 'Guarda-chuva' },
      { emoji: '🕶️', label: 'Óculos de sol' },
      { emoji: '🏖️', label: 'Praia' },
      { emoji: '🔥', label: 'Fogo' },
    ],
  },
  {
    phase: 10,
    difficulty: 'HARD',
    category: 'elementos-opostos',
    concept: 'contraste-complementar',
    therapeuticFocus: 'pensamento-abstrato',
    main: { emoji: '☀️', label: 'Sol' },
    correct: { emoji: '🌙', label: 'Lua' },
    explanation: 'Sol e Lua são opostos que se complementam!',
    options: [
      { emoji: '🌙', label: 'Lua' },
      { emoji: '⭐', label: 'Estrela' },
      { emoji: '🌈', label: 'Arco-íris' },
      { emoji: '☁️', label: 'Nuvem' },
    ],
  },
  {
    phase: 11,
    difficulty: 'HARD',
    category: 'música-instrumentos',
    concept: 'arte-ferramenta',
    therapeuticFocus: 'criatividade-expressão',
    main: { emoji: '🎵', label: 'Música' },
    correct: { emoji: '🎹', label: 'Piano' },
    explanation: 'Piano é um instrumento para fazer música!',
    options: [
      { emoji: '🎹', label: 'Piano' },
      { emoji: '📱', label: 'Celular' },
      { emoji: '🖥️', label: 'Computador' },
      { emoji: '📺', label: 'TV' },
    ],
  },

  // FASES 12-15: Associações abstratas e complexas (Nível Difícil)
  {
    phase: 12,
    difficulty: 'HARD',
    category: 'símbolos-conceitos',
    concept: 'símbolo-significado',
    therapeuticFocus: 'pensamento-simbólico',
    main: { emoji: '💝', label: 'Presente' },
    correct: { emoji: '❤️', label: 'Amor' },
    explanation: 'Presentes são uma forma de demonstrar amor!',
    options: [
      { emoji: '❤️', label: 'Amor' },
      { emoji: '💰', label: 'Dinheiro' },
      { emoji: '🎯', label: 'Alvo' },
      { emoji: '⚖️', label: 'Balança' },
    ],
  },
  {
    phase: 13,
    difficulty: 'HARD',
    category: 'processos-resultados',
    concept: 'processo-produto',
    therapeuticFocus: 'compreensão-sequencial',
    main: { emoji: '🌱', label: 'Semente' },
    correct: { emoji: '🌳', label: 'Árvore' },
    explanation: 'Sementes crescem e se tornam árvores!',
    options: [
      { emoji: '🌳', label: 'Árvore' },
      { emoji: '🍎', label: 'Maçã' },
      { emoji: '🌸', label: 'Flor' },
      { emoji: '🍃', label: 'Folha' },
    ],
  },
  {
    phase: 14,
    difficulty: 'HARD',
    category: 'abstrações-metáforas',
    concept: 'metáfora-visual',
    therapeuticFocus: 'pensamento-metafórico',
    main: { emoji: '🧠', label: 'Cérebro' },
    correct: { emoji: '💡', label: 'Ideia' },
    explanation: 'O cérebro é onde nascem as ideias!',
    options: [
      { emoji: '💡', label: 'Ideia' },
      { emoji: '⚡', label: 'Raio' },
      { emoji: '🔋', label: 'Bateria' },
      { emoji: '🖥️', label: 'Computador' },
    ],
  },
  {
    phase: 15,
    difficulty: 'HARD',
    category: 'ciclos-naturais',
    concept: 'ciclo-renovação',
    therapeuticFocus: 'compreensão-cíclica',
    main: { emoji: '🍂', label: 'Folhas Secas' },
    correct: { emoji: '🌿', label: 'Vida Nova' },
    explanation: 'Folhas secas se decompõem e geram vida nova!',
    options: [
      { emoji: '🌿', label: 'Vida Nova' },
      { emoji: '🗑️', label: 'Lixo' },
      { emoji: '🔥', label: 'Fogo' },
      { emoji: '❄️', label: 'Gelo' },
    ],
  },
]

// Mensagens de encorajamento específicas por dificuldade
const encouragementMessages = {
  EASY: [
    'Muito bem! Você está aprendendo! 🌟',
    'Excelente! Continue assim! 👏',
    'Perfeito! Você entendeu! ✨',
  ],
  MEDIUM: [
    'Ótimo raciocínio! Você está evoluindo! 🧠',
    'Incrível! Seu pensamento está se desenvolvendo! 🚀',
    'Fantástico! Você está pensando como um especialista! 💪',
  ],
  HARD: [
    'Extraordinário! Pensamento avançado! 🎓',
    'Brilhante! Você dominou conceitos complexos! 🌟',
    'Excepcional! Raciocínio de alto nível! 🏆',
  ],
}

// Dicas terapêuticas por categoria
const therapeuticTips = {
  'animais-básicos': 'Observe as características dos animais e o que eles usam.',
  'natureza-básica': 'Pense onde cada ser vivo prefere estar.',
  'alimentos-origem': 'Reflita sobre de onde vêm os alimentos que consumimos.',
  'insetos-plantas': 'Considere como os seres vivos ajudam uns aos outros.',
  'corpo-função': 'Pense em como cuidamos de nosso corpo.',
  'profissões-ferramentas': 'Observe que ferramentas cada profissional usa.',
  'tempo-ação': 'Relacione momentos do dia com atividades adequadas.',
  'emoções-expressões': 'Conecte sentimentos com formas de expressá-los.',
  'causas-efeitos': 'Analise o que causa cada situação.',
  'elementos-opostos': 'Busque elementos que se completam ou contrastam.',
  'música-instrumentos': 'Associe expressões artísticas com suas ferramentas.',
  'símbolos-conceitos': 'Interprete o significado mais profundo dos símbolos.',
  'processos-resultados': 'Visualize o resultado final de cada processo.',
  'abstrações-metáforas': 'Use sua imaginação para entender comparações.',
  'ciclos-naturais': 'Compreenda como a natureza se renova continuamente.',
}

// Configurações de dificuldade para ImageAssociation
const difficulties = [
  { id: 'EASY', name: 'Fácil (3 opções)', options: 3 },
  { id: 'MEDIUM', name: 'Médio (4 opções)', options: 4 },
  { id: 'HARD', name: 'Difícil (5 opções)', options: 5 },
]

function ImageAssociation({ onBack }) {
  const [currentAssociation, setCurrentAssociation] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [feedback, setFeedback] = useState({})
  const [currentPhase, setCurrentPhase] = useState(1) // Mudou de 'round' para 'currentPhase'
  const [showNext, setShowNext] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [moveCount, setMoveCount] = useState(0)
  const [adaptiveModel, setAdaptiveModel] = useState(null)
  const [adaptiveParams, setAdaptiveParams] = useState(null)
  const [difficulty, setDifficulty] = useState('EASY') // Começar no fácil
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [isGameCompleted, setIsGameCompleted] = useState(false)
  const [therapeuticInsights, setTherapeuticInsights] = useState([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [gameStarted, setGameStarted] = useState(false) // Estado para controlar início do jogo
  // Hooks
  const { playSuccess, playError, playClick } = useSound()
  const { userId } = useUser()

  // Sistema Multissensorial - Hook para métricas avançadas
  const { recordAdvancedInteraction, startAdvancedSession, stopAdvancedSession } =
    useAdvancedActivity('image-association', {
      enableVisualProcessing: true,
      enableCognitiveProcessing: true,
      enableSemanticMemory: true,
    })

  // TTS Hook para conversão de texto em áudio
  const { speak, speakInstruction, speakFeedback, speakQuestion, autoSpeak, stop } = useTTS()

  const {
    progress,
    incrementSuccesses,
    incrementAttempts,
    resetProgress,
    recordSuccess,
    recordError,
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
    resetSession,
    getEncouragementMessage,
  } = useProgress('image-association')
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
  } // Aplicar configurações de acessibilidade
  const applyAccessibilitySettings = () => {
    if (prefersHighContrast()) {
      document.body.classList.add('high-contrast')
    }
    if (prefersReducedMotion()) {
      document.body.classList.add('reduced-motion')
    }
  }

  useEffect(() => {
    // Apenas aplicar configurações de acessibilidade na montagem do componente
    applyAccessibilitySettings()
  }, []) // Função para inicializar o jogo com dificuldade selecionada
  const initializeGame = async () => {
    // Inicializar sessão multissensorial
    await startAdvancedSession()

    // Registrar início da atividade
    recordAdvancedInteraction({
      type: 'activity_start',
      subtype: 'visual_association_initiation',
      context: {
        difficulty,
        therapeuticFocus: 'visual_semantic_processing',
        cognitiveProcess: 'semantic_association',
        totalPhases: 15,
      },
    })

    // Inicializar cronometragem da atividade
    await startActivity()
    setGameStarted(true)

    // Inicializar modelo adaptativo
    const model = createAdaptiveModel('image-association', userId)
    setAdaptiveModel(model)

    // Obter parâmetros adaptados
    const params = getAdaptiveParameters('image-association', difficulty)
    setAdaptiveParams(params)

    if (params && params.difficulty !== difficulty) {
      setDifficulty(params.difficulty)
    }

    // Reset do jogo
    setCurrentPhase(1)
    setSelectedOption(null)
    setFeedback({})
    setShowNext(false)
    setStartTime(Date.now())
    setMoveCount(0)
    setConsecutiveCorrect(0)
    setIsGameCompleted(false)
    setTherapeuticInsights([])
    setShowExplanation(false)
    resetProgress() // Usar resetProgress() para zerar a pontuação completamente

    startNewPhase()

    // TTS: Anunciar início do jogo
    autoSpeak(
      'Jogo de associação de imagens iniciado! Encontre as associações corretas entre imagens e conceitos.',
      1000
    )
  }

  // Obter associação atual com base na fase
  const getCurrentAssociation = () => {
    return associations.find((assoc) => assoc.phase === currentPhase) || associations[0]
  }
  const startNewPhase = () => {
    if (currentPhase <= 15) {
      const association = getCurrentAssociation()

      if (!association) {
        console.error(`Associação não encontrada para a fase ${currentPhase}`)
        return
      }

      // Registrar geração de nova fase
      recordAdvancedInteraction({
        type: 'phase_generation',
        subtype: 'semantic_pattern_presentation',
        context: {
          phase: currentPhase,
          difficulty: association.difficulty,
          category: association.category,
          concept: association.concept,
          therapeuticFocus: association.therapeuticFocus,
          visualPattern: 'semantic_association',
        },
      })

      // Registrar apresentação de estímulo principal
      recordAdvancedInteraction({
        type: 'stimulus_presentation',
        subtype: 'visual_semantic_display',
        context: {
          mainItem: association.main.label,
          cognitiveProcess: 'semantic_recognition',
          visualProcessing: 'symbol_interpretation',
        },
      })

      // Embaralhar as opções para cada nova tentativa
      const shuffledOptions = [...association.options].sort(() => Math.random() - 0.5)

      // Definir a associação atual com opções embaralhadas
      setCurrentAssociation({
        ...association,
        options: shuffledOptions,
      })

      setSelectedOption(null)
      setFeedback({})
      setShowNext(false)
      setShowExplanation(false)
      setStartTime(Date.now())
      setMoveCount(0)

      // Anunciar nova fase
      announceToScreenReader(
        `Fase ${currentPhase}: ${association.therapeuticFocus}. ${therapeuticTips[association.category]}`
      )

      // TTS: Anunciar nova fase
      speakQuestion(`Fase ${currentPhase}. ${association.main.label}. Qual é a associação correta?`)
    } else {
      // Jogo completo
      setIsGameCompleted(true)
      setCurrentAssociation(null)
    }
  }
  const handleOptionClick = (option, index) => {
    if (selectedOption !== null) return // Já selecionou uma opção

    setSelectedOption(index)
    setMoveCount((prev) => prev + 1)
    playClick()

    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const isCorrect = option.emoji === currentAssociation.correct.emoji

    // Registrar seleção de opção
    recordAdvancedInteraction({
      type: 'semantic_selection',
      subtype: 'association_choice',
      responseTime: timeSpent * 1000,
      accuracy: isCorrect,
      context: {
        selectedOption: option.label,
        correctOption: currentAssociation.correct.label,
        cognitiveProcess: 'semantic_association_judgment',
        visualProcessing: 'pattern_recognition',
      },
    })

    if (isCorrect) {
      setFeedback({ [index]: true })

      // Registrar sucesso da associação
      recordAdvancedInteraction({
        type: 'association_success',
        subtype: 'semantic_recognition_success',
        responseTime: timeSpent * 1000,
        context: {
          phase: currentPhase,
          category: currentAssociation.category,
          concept: currentAssociation.concept,
          therapeuticFocus: currentAssociation.therapeuticFocus,
          cognitiveSkill: 'semantic_memory_retrieval',
        },
      })

      // Contadores de progresso
      const newConsecutiveCorrect = consecutiveCorrect + 1
      setConsecutiveCorrect(newConsecutiveCorrect)

      // Calcular pontuação baseada na dificuldade e desempenho
      const basePoints = 10
      const difficultyBonus =
        currentAssociation.difficulty === 'EASY'
          ? 0
          : currentAssociation.difficulty === 'MEDIUM'
            ? 5
            : 10
      const timeBonus = Math.max(0, 20 - timeSpent)
      const consecutiveBonus = Math.min(newConsecutiveCorrect * 2, 10)
      const score = basePoints + difficultyBonus + timeBonus + consecutiveBonus

      // Registrar sucesso
      incrementSuccesses()
      incrementAttempts()
      recordSuccess()
      playSuccess()
      vibrateSuccess()

      // Mensagem de encorajamento baseada na dificuldade
      const encouragementMsg = encouragementMessages[currentAssociation.difficulty]
      const randomMsg = encouragementMsg[Math.floor(Math.random() * encouragementMsg.length)]

      // Salvar insight terapêutico
      const insight = {
        phase: currentPhase,
        category: currentAssociation.category,
        concept: currentAssociation.concept,
        therapeuticFocus: currentAssociation.therapeuticFocus,
        timeSpent,
        difficulty: currentAssociation.difficulty,
        score,
      }
      setTherapeuticInsights((prev) => [...prev, insight])
      // Mostrar explicação automaticamente
      setTimeout(() => {
        setShowExplanation(true)
      }, 1000)

      // Salvar dados para o modelo adaptativo
      if (adaptiveModel) {
        const gameData = {
          phase: currentPhase,
          difficulty: currentAssociation.difficulty,
          timeSpent,
          moveCount,
          accuracy: 100,
          score,
          category: currentAssociation.category,
          therapeuticFocus: currentAssociation.therapeuticFocus,
          consecutiveCorrect: newConsecutiveCorrect,
        }
        const recommendation = adaptiveModel.saveGameData(gameData)
        if (recommendation && recommendation !== difficulty) {
          // Registrar mudança adaptativa de dificuldade
          recordAdvancedInteraction({
            type: 'difficulty_change',
            subtype: 'adaptive_semantic_adjustment',
            context: {
              fromDifficulty: difficulty,
              toDifficulty: recommendation,
              trigger: 'adaptive_success_pattern',
              cognitiveAdaptation: 'semantic_complexity_increase',
            },
          })

          setDifficulty(recommendation)
        }
      }

      announceToScreenReader(`${randomMsg} ${currentAssociation.explanation}`) // TTS: Anunciar sucesso e explicação
      speakFeedback(`${randomMsg} ${currentAssociation.explanation}`, true)

      // Registrar TTS quando usado
      if (autoSpeak) {
        recordAdvancedInteraction({
          type: 'audio_playback',
          subtype: 'tts_feedback_success',
          context: {
            message: randomMsg,
            explanation: currentAssociation.explanation,
            cognitiveSupport: 'auditory_reinforcement',
          },
        })
      }

      // TRANSIÇÃO AUTOMÁTICA: avançar para próxima fase após 3 segundos quando acertar
      setTimeout(() => {
        const nextPhase = currentPhase + 1

        if (nextPhase <= 15) {
          setCurrentPhase(nextPhase)
          startNewPhase()

          // Verificar se deve ajustar dificuldade a cada 3 fases
          if (nextPhase % 3 === 1 && adaptiveModel) {
            const params = getAdaptiveParameters('image-association', difficulty)
            if (params && params.difficulty !== difficulty) {
              setDifficulty(params.difficulty)
            }
          }
        } else {
          // Completar jogo
          setIsGameCompleted(true)
          setCurrentAssociation(null)

          // Salvar dados finais
          if (adaptiveModel) {
            const finalStats = {
              completedPhases: 15,
              totalScore: progress.score,
              accuracy: progress.accuracy,
              finalDifficulty: difficulty,
              therapeuticInsights: therapeuticInsights.length,
            }
            adaptiveModel.saveGameData(finalStats)
          }

          // Mostrar mensagem de parabéns
          announceToScreenReader(
            `Parabéns! Você completou todas as 15 fases do jogo de associação com ${Math.round(progress.accuracy || 0)}% de precisão!`
          )

          // Aguardar um momento antes de mostrar o seletor de dificuldade novamente
          setTimeout(() => {
            finishActivity()
            setGameStarted(false)
            resetProgress()
          }, 2000)
        }

        // Salvar progresso geral
        saveProgress()
      }, 3000) // Transição automática após 3 segundos    } else {
      setFeedback({ [index]: false })

      // Registrar erro da associação
      recordAdvancedInteraction({
        type: 'association_error',
        subtype: 'semantic_recognition_error',
        responseTime: timeSpent * 1000,
        context: {
          selectedOption: option.label,
          correctOption: currentAssociation.correct.label,
          phase: currentPhase,
          category: currentAssociation.category,
          cognitiveProcess: 'semantic_association_failure',
        },
      })

      // Resetar contador de consecutivos
      setConsecutiveCorrect(0)

      // Registrar erro
      incrementAttempts()
      recordError()
      playError()
      vibrateError()

      // Mostrar a resposta correta após 1 segundo
      setTimeout(() => {
        const correctIndex = currentAssociation.options.findIndex(
          (opt) => opt.emoji === currentAssociation.correct.emoji
        )
        setFeedback((prev) => ({ ...prev, [correctIndex]: true }))

        // Mostrar explicação depois do erro
        setTimeout(() => {
          setShowExplanation(true)
        }, 1000)
      }, 1000)

      // Salvar dados do erro
      if (adaptiveModel) {
        const gameData = {
          phase: currentPhase,
          difficulty: currentAssociation.difficulty,
          timeSpent,
          moveCount,
          accuracy: 0,
          score: 0,
          category: currentAssociation.category,
          error: true,
        }

        adaptiveModel.saveGameData(gameData)
      }
      announceToScreenReader(`Não é essa. ${currentAssociation.explanation}`) // TTS: Anunciar erro e explicação
      speakFeedback(`Não é essa. ${currentAssociation.explanation}`, false)

      // Registrar TTS quando usado
      if (autoSpeak) {
        recordAdvancedInteraction({
          type: 'audio_playback',
          subtype: 'tts_feedback_error',
          context: {
            explanation: currentAssociation.explanation,
            cognitiveSupport: 'auditory_correction',
          },
        })
      }

      // Mostrar botão "Próximo" apenas quando errar (para dar chance de tentar novamente ou avançar)
      setTimeout(() => {
        setShowNext(true)
      }, 3000) // Dar tempo para absorver a explicação
    }

    // Salvar progresso geral apenas se foi erro (se foi acerto, já foi salvo na transição automática)
    if (!isCorrect) {
      saveProgress()
    }
  }
  // Função handleNext mantida apenas para casos de erro (quando o usuário precisa avançar manualmente)
  const handleNext = () => {
    const nextPhase = currentPhase + 1

    if (nextPhase <= 15) {
      setCurrentPhase(nextPhase)
      startNewPhase()

      // Verificar se deve ajustar dificuldade a cada 3 fases
      if (nextPhase % 3 === 1 && adaptiveModel) {
        const params = getAdaptiveParameters('image-association', difficulty)
        if (params && params.difficulty !== difficulty) {
          setDifficulty(params.difficulty)
        }
      }
    } else {
      // Completar jogo
      setIsGameCompleted(true)
      setCurrentAssociation(null)

      // Salvar dados finais
      if (adaptiveModel) {
        const finalStats = {
          completedPhases: 15,
          totalScore: progress.score,
          accuracy: progress.accuracy,
          finalDifficulty: difficulty,
          therapeuticInsights: therapeuticInsights.length,
        }
        adaptiveModel.saveGameData(finalStats)
      }

      // Mostrar mensagem de parabéns
      announceToScreenReader(
        `Parabéns! Você completou todas as 15 fases do jogo de associação com ${Math.round(progress.accuracy || 0)}% de precisão!`
      )

      // Aguardar um momento antes de mostrar o seletor de dificuldade novamente
      setTimeout(() => {
        finishActivity()
        setGameStarted(false)
        resetProgress()
      }, 2000)
    }

    // Salvar progresso geral
    saveProgress()
  }

  const restartGame = () => {
    setCurrentPhase(1)
    setConsecutiveCorrect(0)
    setIsGameCompleted(false)
    setTherapeuticInsights([])
    resetProgress()

    // Voltar para a tela inicial
    setGameStarted(false)

    // Resetar dificuldade baseada no modelo adaptativo
    if (adaptiveModel) {
      const params = getAdaptiveParameters('image-association', 'EASY')
      if (params && params.difficulty) {
        setDifficulty(params.difficulty)
      }
    }

    announceToScreenReader('Pronto para nova partida! Escolha a dificuldade para começar.')
  }
  // Interface de jogo completo
  if (isGameCompleted) {
    return (
      <GameContainer>
        <GameHeader>
          <BackButton
            onClick={async () => {
              await stopAdvancedSession()
              onBack()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⬅️ Voltar
          </BackButton>
        </GameHeader>

        <ActivityTitleSection>
          <ActivityMainTitle>
            <span>🧩</span>
            <span>Associação de Imagens</span>
          </ActivityMainTitle>
          <ActivitySubtitle>Jornada completa!</ActivitySubtitle>
        </ActivityTitleSection>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: 'center',
            padding: 'var(--space-xl)',
            background: 'linear-gradient(135deg, var(--success), var(--primary-green))',
            color: 'white',
            borderRadius: 'var(--radius-large)',
            margin: 'var(--space-lg) 0',
          }}
        >
          <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-md)' }}>
            🎉 Parabéns! Jornada Completa! 🎉
          </h3>{' '}
          <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-md)' }}>
            Você completou todas as 15 fases!
          </p>
          <p style={{ marginBottom: 'var(--space-md)' }}>⭐ Estrelas ganhas: {progress.stars}/3</p>{' '}
          <p style={{ marginBottom: 'var(--space-md)' }}>
            🎯 Precisão: {Math.round((progress.successes / progress.attempts) * 100) || 0}%
          </p>
          <p style={{ marginTop: '16px', fontSize: '1.1em', marginBottom: 'var(--space-md)' }}>
            {getEncouragementMessage()}
          </p>
          <p style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-lg)' }}>
            <strong>Sua pontuação final:</strong> {progress.score} pontos
            <br />
            <strong>Precisão:</strong> {Math.round(progress.accuracy || 0)}%<br />
            <strong>Insights terapêuticos coletados:</strong> {therapeuticInsights.length}
          </p>
          {/* Resumo das conquistas terapêuticas */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: 'var(--space-md)',
              borderRadius: 'var(--radius-medium)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            <h4>🌟 Habilidades Desenvolvidas:</h4>
            <div
              style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}
            >
              {[...new Set(therapeuticInsights.map((t) => t.therapeuticFocus))].map((focus) => (
                <span
                  key={focus}
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: 'var(--primary-blue)',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {focus.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
          <NextButton onClick={restartGame} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            🔄 Jogar Novamente
          </NextButton>{' '}
        </motion.div>
      </GameContainer>
    )
  }
  if (!gameStarted) {
    // Se o jogo não iniciou, não precisamos checar currentAssociation
    return (
      <GameContainer>
        <GameHeader>
          <BackButton
            onClick={async () => {
              await stopAdvancedSession()
              onBack()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⬅️ Voltar
          </BackButton>
        </GameHeader>

        <ActivityTitleSection>
          <ActivityMainTitle>
            <span>🧩</span>
            <span>Associação de Imagens</span>
          </ActivityMainTitle>
          <ActivitySubtitle>
            Encontre as associações corretas entre imagens e conceitos
          </ActivitySubtitle>
        </ActivityTitleSection>

        <InstructionText
          onClick={() =>
            speakInstruction(
              'Encontre as associações corretas entre imagens e conceitos! Escolha a dificuldade para começar.'
            )
          }
        >
          🧩 Encontre as associações corretas entre imagens e conceitos! Escolha a dificuldade para
          começar.
        </InstructionText>

        <DifficultySelector>
          {[
            {
              id: 'EASY',
              name: '🟢 Fácil',
              description: '2 opções simples',
              icon: '😊',
            },
            {
              id: 'MEDIUM',
              name: '🟡 Médio',
              description: '3 opções variadas',
              icon: '😐',
            },
            {
              id: 'HARD',
              name: '🔴 Difícil',
              description: '4 opções complexas',
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

        <ControlButtons>
          <ActionButton
            onClick={() => {
              playClick()
              speak('Começando jogo de associação de imagens!')
              initializeGame()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            themeColor={THEME_COLOR}
          >
            🧩 Começar Jogo
          </ActionButton>
        </ControlButtons>
      </GameContainer>
    )
  }
  if (gameStarted && !currentAssociation) {
    // Log para debug - remover em produção
    console.log('Aguardando associação ser definida:', { currentPhase, gameStarted })
    // Tente iniciar uma nova fase caso currentAssociation não esteja definido
    if (currentPhase <= 15) {
      startNewPhase()
    }

    return (
      <GameContainer>
        <GameHeader>
          <BackButton
            onClick={async () => {
              await stopAdvancedSession()
              onBack()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⬅️ Voltar
          </BackButton>
        </GameHeader>

        <ActivityTitleSection>
          <ActivityMainTitle>
            <span>🧩</span>
            <span>Carregando fase...</span>
          </ActivityMainTitle>
        </ActivityTitleSection>
      </GameContainer>
    )
  }
  return (
    <GameContainer>
      <GameHeader>
        <BackButton
          onClick={async () => {
            await stopAdvancedSession()
            onBack()
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⬅️ Voltar
        </BackButton>
      </GameHeader>

      <ActivityTitleSection>
        <ActivityMainTitle>
          <span>🧩</span>
          <span>Associação de Imagens</span>
        </ActivityMainTitle>
        <ActivitySubtitle>
          Fase {currentPhase}/15 - {progress.score} pontos
        </ActivitySubtitle>
      </ActivityTitleSection>

      <InstructionText initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        {!gameStarted
          ? '🧩 Encontre as associações corretas entre imagens e conceitos! Escolha a dificuldade para começar.'
          : 'O que combina com isso?'}
      </InstructionText>
      {/* ActivityTimer - invisível, apenas para métricas internas */}
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
      {gameStarted && (
        <GameArea>
          <MainItem
            key={currentAssociation.main.emoji}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <MainEmoji>{currentAssociation.main.emoji}</MainEmoji>
            <MainLabel>{currentAssociation.main.label}</MainLabel>
          </MainItem>

          <OptionsGrid>
            {currentAssociation.options.map((option, index) => (
              <OptionCard
                key={`${option.emoji}-${index}`}
                onClick={() => handleOptionClick(option, index)}
                disabled={selectedOption !== null}
                isCorrect={feedback[index]}
                whileHover={selectedOption === null ? { scale: 1.05 } : {}}
                whileTap={selectedOption === null ? { scale: 0.95 } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <OptionEmoji>{option.emoji}</OptionEmoji>
                <OptionLabel>{option.label}</OptionLabel>

                <AnimatePresence>
                  {feedback[index] !== undefined && (
                    <FeedbackIcon
                      isCorrect={feedback[index]}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {feedback[index] ? '✓' : '✗'}
                    </FeedbackIcon>
                  )}
                </AnimatePresence>
              </OptionCard>
            ))}{' '}
          </OptionsGrid>

          <AnimatePresence>
            {showNext && (
              <NextButton
                onClick={handleNext}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentPhase < 15 ? 'Próxima ➡️' : 'Finalizar 🎉'}
              </NextButton>
            )}
          </AnimatePresence>

          <div
            style={{
              textAlign: 'center',
              color: 'var(--medium-gray)',
              marginTop: 'var(--space-md)',
            }}
          >
            <p>💡 Dica: Clique no item que tem relação com a imagem principal!</p>
          </div>
        </GameArea>
      )}
    </GameContainer>
  )
}

export default ImageAssociation
