import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import useSound from '../../hooks/useSound'
import useProgress from '../../hooks/useProgress'
import useAdvancedActivity from '../../hooks/useAdvancedActivity'
import useActivity from '../../hooks/useActivity'
import useMobileDataCollection from '../../hooks/useMobileDataCollection'
import { getSystemOrchestrator } from '../../core/SystemOrchestrator'
import useTTS from '../../hooks/useTTS'
import ActivityTimer from '../common/ActivityTimer'
import { EMOJIS, ENCOURAGEMENT_MESSAGES } from '../../utils/shared/constants'
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

// Definição de cores temáticas para esta atividade
const THEME_COLOR = 'var(--primary-blue)'
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-blue), var(--primary-purple))'

// Estilos específicos para MemoryGame com as cores temáticas
const InstructionText = styled(BaseInstructionText)`
  background: ${THEME_GRADIENT};
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  box-shadow: var(--shadow-strong);

  @media (max-width: 768px) {
    font-size: var(--font-size-md);
    padding: var(--space-lg);
  }
`

const GameStats = styled.div`
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
`

const StatItem = styled.div`
  text-align: center;
`

const StatValue = styled.div`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--primary-blue);
`

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
`

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  max-width: 600px;
  margin: 0 auto var(--space-xl);
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-sm);
  }

  @media (max-width: 360px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-xs);
    max-width: 300px;
  }
`

const Card = styled(motion.button)`
  aspect-ratio: 1;
  border: none;
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: 2rem;
  background: ${(props) => (props.isFlipped ? 'white' : 'var(--primary-blue)')};
  color: ${(props) => (props.isFlipped ? 'var(--dark-gray)' : 'white')};
  box-shadow: var(--shadow-light);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  min-height: 80px;

  &:disabled {
    cursor: not-allowed;
  }
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    min-height: 60px;
  }

  @media (max-width: 360px) {
    font-size: 1.2rem;
    min-height: 50px;
  }
`

const CardBack = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: var(--primary-blue);
  color: white;
`

const WinMessage = styled(motion.div)`
  text-align: center;
  padding: var(--space-xl);
  background: linear-gradient(135deg, var(--primary-green), var(--primary-blue));
  color: white;
  border-radius: var(--radius-large);
  margin: var(--space-lg) 0;
`

const WinTitle = styled.h3`
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-md);
  font-weight: 600;
`

const PlayAgainButton = styled(motion.button)`
  background: white;
  color: var(--primary-blue);
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-top: var(--space-md);
`

// Emojis para o jogo da memória
const emojis = ['🐶', '🐱', '🐼', '🦊', '🐸', '🦋', '🌸', '⭐']

// Definição das dificuldades disponíveis
const difficulties = [
  {
    id: 'EASY',
    name: '🟢 Fácil',
    description: '6 pares para encontrar',
    pairs: 6,
    icon: '😊',
  },
  {
    id: 'MEDIUM',
    name: '🟡 Médio',
    description: '8 pares para encontrar',
    pairs: 8,
    icon: '🤔',
  },
  {
    id: 'HARD',
    name: '🔴 Difícil',
    description: '12 pares para encontrar',
    pairs: 12,
    icon: '🧠',
  },
]

// Mensagens de encorajamento específicas para o jogo da memória
const memoryEncouragementMessages = [
  'Sua memória é incrível! 🧠',
  'Que memória fotográfica! 📸',
  'Continue assim, você está arrasando! 🌟',
  'Sua concentração está excelente! 🎯',
  'Você tem um talento especial para este jogo! 🏆',
]

function MemoryGame({ onBack }) {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [moves, setMoves] = useState(0)
  const [isWin, setIsWin] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [difficulty, setDifficulty] = useState('MEDIUM') // EASY, MEDIUM, HARD
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [consecutiveWrong, setConsecutiveWrong] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [showDifficultySelector, setShowDifficultySelector] = useState(true)
  // SystemOrchestrator for unified metrics
  const [orchestratorRef, setOrchestratorRef] = useState(null)
  // Hooks personalizados
  const { playSuccess, playError, playClick } = useSound()
  const { speak, speakInstruction, speakFeedback, speakQuestion, autoSpeak, stop, isTTSEnabled } =
    useTTS()
  // Progress and Activity hooks
  const {
    progress,
    isCompleted,
    recordSuccess: progressRecordSuccess,
    recordError: progressRecordError,
    getStats,
    getEncouragementMessage,
    resetSession,
    updateTimeSpent,
    startActivity,
    pauseActivity,
    resumeActivity,
    finishActivity,
    sessionId,
    isActivityActive,
    isActivityPaused,
    getFormattedTime,
    getCurrentTimeMetrics,
  } = useProgress('memory-game')

  // Activity metrics hook
  const {
    recordSuccess: activityRecordSuccess,
    recordError: activityRecordError,
    calculateResponseTime,
    getCurrentSession,
  } = useActivity('memory-game')

  // Mobile data collection for sensorial metrics
  const { startCollection, stopCollection, isCollecting, sensorData } = useMobileDataCollection()

  // Hook para métricas multissensoriais avançadas
  const {
    recordAdvancedInteraction,
    recordBehavioralIndicator,
    startAdvancedSession,
    stopAdvancedSession,
    sessionInsights,
  } = useAdvancedActivity('memory-game', {
    enableSensorTracking: true,
    enableGeoLocation: true,
    enableNeurodivergenceAnalysis: true,
  })

  // Initialize SystemOrchestrator
  useEffect(() => {
    const initOrchestrator = async () => {
      try {
        const orchestrator = getSystemOrchestrator()
        setOrchestratorRef(orchestrator)
        console.log('🎮 MemoryGame: SystemOrchestrator initialized')
      } catch (error) {
        console.error('❌ MemoryGame: Failed to initialize SystemOrchestrator:', error)
      }
    }
    initOrchestrator()
  }, [])

  // Combined success handler
  const recordSuccess = async (metadata = {}) => {
    const timestamp = Date.now()
    const responseTime = calculateResponseTime()

    // Record with traditional hooks
    progressRecordSuccess()
    activityRecordSuccess(metadata)

    // Send unified metrics via SystemOrchestrator
    if (orchestratorRef) {
      try {
        await orchestratorRef.processBehavioralMetrics({
          sessionId: sessionId || getCurrentSession()?.id,
          activityId: 'memory-game',
          userId: 'demo-user',
          eventType: 'success',
          timestamp,
          responseTime,
          accuracy: getStats().accuracy,
          score: progress.stars,
          difficulty,
          metadata: {
            moves,
            matchedPairs: matchedCards.length / 2,
            totalPairs: cards.length / 2,
            gameTime,
            consecutiveCorrect: consecutiveCorrect + 1,
            ...metadata,
          },
        })
        console.log('✅ MemoryGame: Success metrics sent to SystemOrchestrator')
      } catch (error) {
        console.error('❌ MemoryGame: Failed to send success metrics:', error)
      }
    }
  }

  // Combined error handler
  const recordError = async (metadata = {}) => {
    const timestamp = Date.now()
    const responseTime = calculateResponseTime()

    // Record with traditional hooks
    progressRecordError()
    activityRecordError(metadata)

    // Send unified metrics via SystemOrchestrator
    if (orchestratorRef) {
      try {
        await orchestratorRef.processBehavioralMetrics({
          sessionId: sessionId || getCurrentSession()?.id,
          activityId: 'memory-game',
          userId: 'demo-user',
          eventType: 'error',
          timestamp,
          responseTime,
          accuracy: getStats().accuracy,
          score: progress.stars,
          difficulty,
          metadata: {
            moves,
            matchedPairs: matchedCards.length / 2,
            totalPairs: cards.length / 2,
            gameTime,
            consecutiveWrong: consecutiveWrong + 1,
            ...metadata,
          },
        })
        console.log('✅ MemoryGame: Error metrics sent to SystemOrchestrator')
      } catch (error) {
        console.error('❌ MemoryGame: Failed to send error metrics:', error)
      }
    }
  }

  // Start sensorial data collection
  const startGameSession = async () => {
    try {
      // Start mobile data collection for sensorial metrics
      await startCollection()
      console.log('📱 MemoryGame: Sensorial data collection started')
    } catch (error) {
      console.error('❌ MemoryGame: Failed to start sensorial collection:', error)
    }
  }

  // Stop sensorial data collection
  const stopGameSession = async () => {
    try {
      // Stop mobile data collection
      await stopCollection()
      console.log('📱 MemoryGame: Sensorial data collection stopped')
    } catch (error) {
      console.error('❌ MemoryGame: Failed to stop sensorial collection:', error)
    }
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
  // Inicializar configurações de acessibilidade
  useEffect(() => {
    applyAccessibilitySettings()
  }, [])

  // Funções de controle da cronometragem
  const handlePauseResume = async () => {
    if (isActivityPaused) {
      await resumeActivity()
    } else {
      await pauseActivity()
    }
  }
  const handleFinishActivity = async () => {
    try {
      // Stop sensorial data collection
      await stopGameSession()

      // Finalizar sessão avançada com dados multissensoriais
      const finalReport = await stopAdvancedSession()

      if (finalReport) {
        console.log('✅ Sessão finalizada com dados multissensoriais:', finalReport)
      } else {
        // Fallback: finalizar sessão base
        await finishActivity()
        console.log('✅ Sessão finalizada (modo básico)')
      }

      // Send session end metrics via SystemOrchestrator
      if (orchestratorRef) {
        try {
          await orchestratorRef.processBehavioralMetrics({
            sessionId: sessionId,
            activityId: 'memory-game',
            userId: 'demo-user',
            eventType: 'session_end',
            timestamp: Date.now(),
            responseTime: 0,
            accuracy: getStats().accuracy,
            score: progress.stars,
            difficulty,
            metadata: {
              totalMoves: moves,
              totalGameTime: gameTime,
              matchedPairs: matchedCards.length / 2,
              totalPairs: cards.length / 2,
              gameCompleted: isWin,
              finalReport: finalReport || null,
            },
          })
          console.log('🎮 MemoryGame: Session end metrics sent to SystemOrchestrator')
        } catch (error) {
          console.error('❌ MemoryGame: Failed to send session end metrics:', error)
        }
      }
    } catch (error) {
      console.error('Erro ao finalizar atividade:', error)
      // Fallback: finalizar sem dados multissensoriais
      await finishActivity()
    }
  }

  // Cronometrar o jogo
  useEffect(() => {
    let timer
    if (gameStarted && !isWin) {
      timer = setInterval(() => {
        setGameTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameStarted, isWin])

  // Ajustar dificuldade com base no desempenho
  const adjustDifficulty = () => {
    const difficultyMap = {
      EASY: { pairs: 6, minTime: 10 },
      MEDIUM: { pairs: 8, minTime: 15 },
      HARD: { pairs: 12, minTime: 20 },
    }

    if (consecutiveCorrect >= 3) {
      setConsecutiveCorrect(0)
      if (difficulty === 'EASY') {
        setDifficulty('MEDIUM')
        announceToScreenReader('Dificuldade aumentou para médio!')
      } else if (difficulty === 'MEDIUM') {
        setDifficulty('HARD')
        announceToScreenReader('Dificuldade aumentou para difícil!')
      }
    } else if (consecutiveWrong >= 3) {
      setConsecutiveWrong(0)
      if (difficulty === 'HARD') {
        setDifficulty('MEDIUM')
        announceToScreenReader('Dificuldade reduzida para médio!')
      } else if (difficulty === 'MEDIUM') {
        setDifficulty('EASY')
        announceToScreenReader('Dificuldade reduzida para fácil!')
      }
    }
  }
  // Inicializar jogo com dificuldade atual
  const initializeGame = async () => {
    await startActivity()

    // Start sensorial data collection
    await startGameSession()

    // Iniciar sessão avançada multissensorial
    const advancedStarted = await startAdvancedSession()
    if (advancedStarted) {
      console.log('🚀 Sessão avançada iniciada com sucesso')
    }

    setGameStarted(true)
    setShowDifficultySelector(false)
    setStartTime(Date.now())
    setGameTime(0)
    setMoves(0)
    setFlippedCards([])
    setMatchedCards([])
    setIsWin(false)
    resetSession()

    // Send session start metrics via SystemOrchestrator
    if (orchestratorRef) {
      try {
        await orchestratorRef.processBehavioralMetrics({
          sessionId: sessionId,
          activityId: 'memory-game',
          userId: 'demo-user',
          eventType: 'session_start',
          timestamp: Date.now(),
          responseTime: 0,
          accuracy: null,
          score: 0,
          difficulty,
          metadata: {
            gameInitialization: true,
            numPairs: difficulty === 'EASY' ? 6 : difficulty === 'MEDIUM' ? 8 : 10,
            deviceInfo: {
              userAgent: navigator.userAgent,
              screenResolution: `${screen.width}x${screen.height}`,
              colorDepth: screen.colorDepth,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          },
        })
        console.log('🎮 MemoryGame: Session start metrics sent to SystemOrchestrator')
      } catch (error) {
        console.error('❌ MemoryGame: Failed to send session start metrics:', error)
      }
    }

    // Tracking multissensorial: início da sessão
    recordAdvancedInteraction({
      type: 'session_start',
      subtype: 'game_initialization',
      elementId: 'memory-game',
      responseTime: 0,
      accuracy: null,
      sensoryModality: 'visual',
      coordinates: { x: 0, y: 0 },
      context: {
        sessionStart: true,
        difficulty,
        timestamp: Date.now(),
        deviceInfo: {
          userAgent: navigator.userAgent,
          screenResolution: `${screen.width}x${screen.height}`,
          colorDepth: screen.colorDepth,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
    })

    console.log('🎮 Jogo da Memória iniciado com tracking multissensorial ativado')
    // Definir número de pares baseado na dificuldade
    const numPairs = difficulty === 'EASY' ? 6 : difficulty === 'MEDIUM' ? 8 : 10

    // Combinar todos os emojis disponíveis
    const allEmojis = [...EMOJIS.ANIMALS, ...EMOJIS.FRUITS, ...EMOJIS.OBJECTS]

    // Selecionar emojis aleatorios
    const shuffledEmojis = [...allEmojis].sort(() => Math.random() - 0.5).slice(0, numPairs)

    // Criar cartas duplicadas (pares) e misturar
    const cardPairs = shuffledEmojis
      .flatMap((emoji, index) => [
        { id: `card-${index}-a`, emoji, matched: false },
        { id: `card-${index}-b`, emoji, matched: false },
      ])
      .sort(() => Math.random() - 0.5)

    setCards(cardPairs)
    announceToScreenReader(
      `Novo jogo iniciado! Dificuldade: ${difficulty.toLowerCase()}. Encontre ${numPairs} pares.`
    ) // TTS: Anunciar início do jogo apenas se o TTS estiver ativado
    if (isTTSEnabled) {
      const difficultyName =
        difficulty === 'EASY' ? 'fácil' : difficulty === 'MEDIUM' ? 'médio' : 'difícil'
      autoSpeak(
        `Jogo da memória iniciado! Dificuldade ${difficultyName}. Encontre ${numPairs} pares de cartas iguais.`,
        1000
      )
    }
  } // Verificar vitória
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      const endTime = Date.now()
      const gameTimeInSeconds = Math.floor((endTime - startTime) / 1000)
      setGameTime(gameTimeInSeconds)
      updateTimeSpent(gameTimeInSeconds)

      setIsWin(true)
      playSuccess()
      vibrateSuccess()

      const stats = getStats()
      const encouragement = getEncouragementMessage()

      // Salvar estatísticas de jogo para machine learning
      const gameData = {
        difficulty,
        moves,
        timeSpent: gameTimeInSeconds,
        pairs: cards.length / 2,
        accuracy: stats.accuracy,
        timestamp: new Date().toISOString(),
      }

      // Salvar em localStorage para análise futura
      try {
        const gameHistory = JSON.parse(localStorage.getItem('betina_memory_history') || '[]')
        gameHistory.push(gameData)
        localStorage.setItem('betina_memory_history', JSON.stringify(gameHistory.slice(-20))) // Manter apenas as últimas 20 partidas
      } catch (error) {
        console.warn('Erro ao salvar histórico de jogo:', error)
      }
      announceToScreenReader(
        `Parabéns! Você completou o jogo! ${encouragement} Precisão: ${stats.accuracy}%`
      ) // TTS: Anunciar vitória apenas se o TTS estiver ativado
      if (isTTSEnabled) {
        speakFeedback(
          `Parabéns! Você completou o jogo da memória! ${encouragement} Sua precisão foi de ${stats.accuracy} por cento!`,
          true
        )
      }

      // Atualizar tempo gasto
      updateTimeSpent()
    }
  }, [matchedCards.length, cards.length]) // Removido as funções das dependências  // Lógica para verificar pares
  useEffect(() => {
    const checkPairs = async () => {
      if (flippedCards.length === 2) {
        const [first, second] = flippedCards
        setMoves((prev) => prev + 1)

        if (cards[first].emoji === cards[second].emoji) {
          // Par encontrado!
          playSuccess()
          vibrateSuccess()

          // Use unified success handler
          await recordSuccess({
            cardPair: cards[first].emoji,
            firstCardIndex: first,
            secondCardIndex: second,
            matchTime: Date.now() - startTime,
          })

          const encouragement = getEncouragementMessage()
          announceToScreenReader(`Par encontrado! ${encouragement}`)

          // TTS: Anunciar par encontrado apenas se o TTS estiver ativado
          if (isTTSEnabled) {
            speakFeedback(`Par encontrado! ${encouragement}`, true)
          }

          setMatchedCards((prev) => [...prev, first, second])
          setFlippedCards([])
          setConsecutiveCorrect((prev) => prev + 1)
          setConsecutiveWrong(0)
        } else {
          // Não é par, virar de volta após um tempo
          playError()
          vibrateError()

          // Use unified error handler
          await recordError({
            firstCard: cards[first].emoji,
            secondCard: cards[second].emoji,
            firstCardIndex: first,
            secondCardIndex: second,
            attemptTime: Date.now() - startTime,
          })

          announceToScreenReader('Não é um par. Tente novamente!')

          // TTS: Anunciar erro apenas se o TTS estiver ativado
          if (isTTSEnabled) {
            speakFeedback('Não é um par. Tente novamente!', false)
          }

          setTimeout(() => {
            setFlippedCards([])
          }, 1000)
          setConsecutiveWrong((prev) => prev + 1)
          setConsecutiveCorrect(0)
        }
      }
    }

    checkPairs()
  }, [flippedCards.length, cards]) // Removido as funções das dependências
  const handleCardClick = (index) => {
    // Não permitir clique se já tem 2 cartas viradas ou se a carta já está virada
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return
    } // Tracking multissensorial: registrar interação do usuário
    recordAdvancedInteraction({
      type: 'card_interaction',
      subtype: 'card_click',
      context: {
        cardIndex: index,
        currentDifficulty: difficulty,
        movesCount: moves,
        gameTime,
        flippedCardsCount: flippedCards.length,
        matchedCardsCount: matchedCards.length,
        timestamp: Date.now(),
      },
    })

    // Feedback sonoro e tátil
    playClick()

    setFlippedCards((prev) => [...prev, index])

    // Anunciar para leitores de tela
    const card = cards[index]
    if (card) {
      announceToScreenReader(`Carta revelada: ${card.emoji}`)
      // Tracking de acessibilidade
      recordAdvancedInteraction({
        type: 'accessibility',
        subtype: 'screen_reader_announcement',
        context: {
          feature: 'screen_reader_announcement',
          content: `Card revealed: ${card.emoji}`,
          timestamp: Date.now(),
        },
      })
    }
  }

  const isCardFlipped = (index) => {
    return flippedCards.includes(index) || matchedCards.includes(index)
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
          <span>🧠</span>
          <span>Jogo da Memória</span>
        </ActivityMainTitle>
        <ActivitySubtitle>Exercite sua memória visual e concentração</ActivitySubtitle>
      </ActivityTitleSection>
      {gameStarted && !showDifficultySelector && (
        <GameStats>
          <StatItem>
            <StatValue>{moves}</StatValue>
            <StatLabel>Jogadas</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{matchedCards.length / 2}</StatValue>
            <StatLabel>Pares</StatLabel>
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
          if (isTTSEnabled) {
            if (showDifficultySelector) {
              speakInstruction(
                'Exercite sua memória encontrando os pares iguais! Escolha a dificuldade para começar.'
              )
            } else {
              speakInstruction('Clique nas cartas para encontrar os pares iguais!')
            }
          }
        }}
      >
        {showDifficultySelector
          ? `🧠 Exercite sua memória encontrando os pares iguais! Escolha a dificuldade para começar. ${!isTTSEnabled ? '(🔇 TTS desativado)' : ''}`
          : `🧠 Clique nas cartas para encontrar os pares iguais! ${!isTTSEnabled ? '(🔇 TTS desativado)' : ''}`}
      </InstructionText>
      {showDifficultySelector && (
        <>
          <DifficultySelector>
            {[
              {
                id: 'EASY',
                name: '🟢 Fácil',
                description: '2 pares (6 cartas)',
                icon: '😊',
              },
              {
                id: 'MEDIUM',
                name: '🟡 Médio',
                description: '3 pares (8 cartas)',
                icon: '😐',
              },
              {
                id: 'HARD',
                name: '🔴 Difícil',
                description: '4 pares (10 cartas)',
                icon: '🧠',
              },
            ].map((diff) => (
              <DifficultyButton
                key={diff.id}
                isActive={difficulty === diff.id}
                onClick={() => {
                  setDifficulty(diff.id)
                  playClick()
                  // TTS: Anunciar dificuldade selecionada apenas se TTS estiver ativado
                  if (isTTSEnabled) {
                    speak(`Dificuldade ${diff.name} selecionada. ${diff.description}`)
                  }
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
                if (isTTSEnabled) {
                  speak('Começando jogo da memória!')
                }
                initializeGame()
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              themeColor={THEME_COLOR}
            >
              🧠 Começar Jogo
            </ActionButton>
          </ControlButtons>
        </>
      )}
      {/* Cronômetro da Atividade - invisível, apenas para métricas internas */}
      <ActivityTimer
        timeMetrics={isActivityActive ? getCurrentTimeMetrics() : null}
        onStart={startActivity}
        onPause={pauseActivity}
        onResume={resumeActivity}
        onFinish={finishActivity}
        showControls={false}
        compact={false}
        invisible={true}
      />{' '}
      {!showDifficultySelector && (
        <>
          <AnimatePresence>
            {isWin && (
              <WinMessage
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
              >
                <WinTitle>🎉 Parabéns! Você conseguiu! 🎉</WinTitle>
                <p>Você encontrou todos os pares em {moves} jogadas!</p>
                <p>⭐ Estrelas ganhas: {progress.stars}/3</p>
                <p>🎯 Precisão: {getStats().accuracy}%</p>
                <p style={{ marginTop: '16px', fontSize: '1.1em' }}>{getEncouragementMessage()}</p>
                <PlayAgainButton
                  onClick={() => {
                    if (isTTSEnabled) {
                      speak('Preparando novo jogo!')
                    }
                    setShowDifficultySelector(true)
                    setIsWin(false)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 Jogar Novamente
                </PlayAgainButton>
              </WinMessage>
            )}
          </AnimatePresence>

          <GameBoard>
            {cards.map((card, index) => (
              <Card
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={flippedCards.length === 2 && !flippedCards.includes(index)}
                isFlipped={isCardFlipped(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  rotateY: isCardFlipped(index) ? 180 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {isCardFlipped(index) ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    {card.emoji}
                  </motion.div>
                ) : (
                  <CardBack>❓</CardBack>
                )}
              </Card>
            ))}
          </GameBoard>
        </>
      )}{' '}
      <div
        style={{ textAlign: 'center', color: 'var(--medium-gray)', cursor: 'pointer' }}
        onClick={() => {
          if (isTTSEnabled) {
            speakInstruction('Dica: Clique nas cartas para encontrar os pares iguais!')
          } else {
            // Mostrar tooltip ou feedback visual quando áudio está desativado
            announceToScreenReader('Áudio de texto para voz está desativado nas configurações')
          }
        }}
      >
        <p>
          💡 Dica: Clique nas cartas para encontrar os pares iguais!{' '}
          {!isTTSEnabled && '(🔇 TTS desativado)'}
        </p>
      </div>
    </GameContainer>
  )
}

export default MemoryGame
