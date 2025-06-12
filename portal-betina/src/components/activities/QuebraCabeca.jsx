import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import useSound from '../../hooks/useSound'
import useProgress from '../../hooks/useProgress'
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
const THEME_COLOR = 'var(--primary-purple)'
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))'

// Estilos específicos para EmotionalPuzzle
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

const PuzzleDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: var(--space-lg) 0;
  min-height: 200px;
  background: var(--light-gray);
  border-radius: var(--radius-medium);
  border: 2px solid ${THEME_COLOR};
  padding: var(--space-md);
`

const PuzzlePiece = styled(motion.div)`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: ${(props) => (props.draggable ? 'grab' : 'default')};
  background: ${(props) => (props.isPlaced ? 'var(--success-light)' : 'var(--white)')};
  border: 2px solid ${(props) => (props.isPlaced ? 'var(--success)' : 'var(--medium-gray)')};
  border-radius: var(--radius-small);
  box-shadow: var(--shadow-medium);
  user-select: none;

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
`

const PuzzleBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: var(--space-sm);
  width: 100%;
  max-width: 300px;
  min-height: 150px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-medium);
  padding: var(--space-md);
`

const PieceContainer = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  margin: var(--space-lg) 0;
  flex-wrap: wrap;
`

const ContextText = styled.div`
  font-size: var(--font-size-md);
  color: var(--dark-gray);
  text-align: center;
  margin-bottom: var(--space-md);
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
`

const StarDisplay = styled.div`
  display: flex;
  gap: var(--space-xs);
  font-size: var(--font-size-xl);
`

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`

const emotions = [
  {
    id: 'happy',
    name: 'Feliz',
    emoji: '😊',
    pieces: ['😊', '🌞', '🎁'],
    context: 'Ganhar um presente',
    sound: 'happy.mp3',
  },
  {
    id: 'sad',
    name: 'Triste',
    emoji: '😢',
    pieces: ['😢', '🌧️', '💔'],
    context: 'Perder um brinquedo',
    sound: 'sad.mp3',
  },
  {
    id: 'surprised',
    name: 'Surpreso',
    emoji: '😲',
    pieces: ['😲', '🎉', '❓'],
    context: 'Ver algo inesperado',
    sound: 'surprised.mp3',
  },
  {
    id: 'calm',
    name: 'Calmo',
    emoji: '😌',
    pieces: ['😌', '🌊', '🕊️'],
    context: 'Relaxar na praia',
    sound: 'calm.mp3',
  },
]

const encouragingMessages = [
  'Muito bem! Você reconheceu a emoção! 🌟',
  'Excelente! Continue assim! 🎉',
  'Você está ótimo em montar emoções! 😊',
  'Perfeito! Sua paciência é incrível! ✨',
  'Fantástico! Você entende as emoções! 🧠',
]

function EmotionalPuzzle({ onBack }) {
  const [gameEmotion, setGameEmotion] = useState(null)
  const [placedPieces, setPlacedPieces] = useState([])
  const [isPlayingContext, setIsPlayingContext] = useState(false)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [selectedDifficulty, setSelectedDifficulty] = useState('EASY')
  const [feedback, setFeedback] = useState(null)
  const [consecutiveSuccesses, setConsecutiveSuccesses] = useState(0)
  const [adaptiveModel, setAdaptiveModel] = useState(null)
  const [adaptiveParams, setAdaptiveParams] = useState(null)
  const { playSound, playSuccess, playError, playClick } = useSound()
  const { recordPerformance } = useUser()
  const {
    progress,
    incrementAttempts,
    recordSuccess,
    recordError,
    resetSession,
    startActivity,
    pauseActivity,
    resumeActivity,
    finishActivity,
    getCurrentTimeMetrics,
    sessionId,
    isActivityActive,
    isActivityPaused,
  } = useProgress('emotional-puzzle')
  const { speak, speakInstruction, speakFeedback, autoSpeak, isTTSEnabled } = useTTS()

  const generatePuzzle = () => {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)]
    const pieceCount = getDifficultyPieceCount(selectedDifficulty)
    const selectedPieces = randomEmotion.pieces.slice(0, pieceCount).map((piece) => ({
      emoji: piece,
      id: `${piece}-${Math.random().toString(36).substr(2, 9)}`,
      isPlaced: false,
    }))
    return { ...randomEmotion, pieces: selectedPieces }
  }

  const playContext = async (emotion) => {
    setIsPlayingContext(true)
    try {
      await playSound(emotion.sound)
      announceToScreenReader(`Emoção: ${emotion.name}. Contexto: ${emotion.context}`)
      if (isTTSEnabled) {
        speakInstruction(
          `Monte o quebra-cabeça da emoção ${emotion.name}. Contexto: ${emotion.context}.`
        )
      }
    } catch (error) {
      console.error('Erro ao reproduzir som:', error)
    }
    setIsPlayingContext(false)
    setIsPlayerTurn(true)
  }

  const startNewGame = async () => {
    await startActivity()
    resetSession()
    setCurrentLevel(getDifficultyLevel(selectedDifficulty))
    setConsecutiveSuccesses(0)
    setPlacedPieces([])
    setGameStarted(true)
    setFeedback(null)
    setIsPlayerTurn(false)
    setIsPlayingContext(false)

    const newPuzzle = generatePuzzle()
    setGameEmotion(newPuzzle)

    announceToScreenReader(
      `Novo jogo iniciado no nível ${getDifficultyName(selectedDifficulty)}! Monte o quebra-cabeça da emoção.`
    )
    if (isTTSEnabled) {
      autoSpeak(
        `Novo jogo de quebra-cabeça emocional iniciado! Dificuldade ${getDifficultyName(selectedDifficulty)}. Monte o quebra-cabeça da emoção.`,
        1000
      )
    }
  }

  const restartGame = () => {
    setCurrentLevel(1)
    setPlacedPieces([])
    setFeedback(null)
    setIsPlayerTurn(false)
    setIsPlayingContext(false)

    const newPuzzle = generatePuzzle()
    setGameEmotion(newPuzzle)

    announceToScreenReader('Jogo reiniciado! Monte o novo quebra-cabeça.')
  }

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

  const applyAccessibilitySettings = () => {
    if (prefersHighContrast()) {
      document.body.classList.add('high-contrast')
    }
    if (prefersReducedMotion()) {
      document.body.classList.add('reduced-motion')
    }
  }
  useEffect(() => {
    applyAccessibilitySettings()

    // Inicializar sistema ML adaptativo
    const initializeAdaptive = async () => {
      try {
        const model = await createAdaptiveModel('emotional-puzzle')
        const params = await getAdaptiveParameters('emotional-puzzle')
        setAdaptiveModel(model)
        setAdaptiveParams(params)
      } catch (error) {
        console.error('Erro ao inicializar sistema adaptativo:', error)
      }
    }

    initializeAdaptive()
  }, [])

  const getDifficultyLevel = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return 1
      case 'MEDIUM':
        return 3
      case 'HARD':
        return 5
      default:
        return 1
    }
  }
  const getDifficultyPieceCount = (difficulty) => {
    let baseCount
    switch (difficulty) {
      case 'EASY':
        baseCount = 2
        break
      case 'MEDIUM':
        baseCount = 3
        break
      case 'HARD':
        baseCount = 4
        break
      default:
        baseCount = 2
    }

    // Aplicar ajuste adaptativo se disponível
    if (adaptiveParams && adaptiveParams.pieceCount) {
      const adjustment = Math.round(adaptiveParams.pieceCount - baseCount)
      baseCount = Math.max(2, Math.min(4, baseCount + adjustment))
    }

    return baseCount
  }

  const getDifficultyName = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return 'Fácil'
      case 'MEDIUM':
        return 'Médio'
      case 'HARD':
        return 'Difícil'
      default:
        return 'Fácil'
    }
  }

  const calculateScore = (level, pieceCount) => {
    const basePoints = 10
    const levelBonus = level * 5
    const pieceBonus = pieceCount * 5
    return basePoints + levelBonus + pieceBonus
  }

  const handlePieceDrop = (pieceId) => {
    if (!isPlayerTurn || isPlayingContext) return

    const pieceIndex = gameEmotion.pieces.findIndex((p) => p.id === pieceId)
    if (pieceIndex === -1) return

    const newPlacedPieces = [...placedPieces, pieceId]
    setPlacedPieces(newPlacedPieces)

    const updatedPieces = gameEmotion.pieces.map((piece) =>
      piece.id === pieceId ? { ...piece, isPlaced: true } : piece
    )
    setGameEmotion({ ...gameEmotion, pieces: updatedPieces })

    playSound('place.mp3')
    announceToScreenReader(`Peça ${gameEmotion.pieces[pieceIndex].emoji} colocada.`)

    if (newPlacedPieces.length === gameEmotion.pieces.length) {
      const bonusPoints = calculateScore(currentLevel, gameEmotion.pieces.length) - 10
      const updatedScore = recordSuccess(bonusPoints)

      vibrateSuccess()
      playSuccess()
      const newConsecutiveSuccesses = consecutiveSuccesses + 1
      setConsecutiveSuccesses(newConsecutiveSuccesses)
      const performanceData = {
        correct: 1,
        incorrect: 0,
        responseTimes: [500],
        level: currentLevel,
        pieceCount: gameEmotion.pieces.length,
        consecutiveSuccesses: newConsecutiveSuccesses,
        score: bonusPoints + 10,
        timestamp: new Date().toISOString(),
        activityType: 'emotional-puzzle',
        emotion: gameEmotion.name,
      }

      recordPerformance('emotional-puzzle', performanceData)

      // Salvar dados no sistema ML adaptativo
      if (adaptiveModel) {
        const gameData = {
          userId: sessionId,
          activityType: 'emotional-puzzle',
          difficulty: selectedDifficulty,
          level: currentLevel,
          score: bonusPoints + 10,
          timeSpent: getCurrentTimeMetrics()?.totalTime || 0,
          errorsCount: 0,
          hintsUsed: 0,
          completed: true,
          performance: {
            accuracy: 100,
            speed: 'normal',
            emotionType: gameEmotion.name,
            pieceCount: gameEmotion.pieces.length,
          },
          timestamp: new Date().toISOString(),
        }
        try {
          adaptiveModel.saveGameData(gameData)
        } catch (error) {
          console.error('Erro ao salvar dados adaptativos:', error)
        }
      }

      let feedbackMessage = `Parabéns! Você completou o quebra-cabeça ${gameEmotion.name}! Ganhou ${bonusPoints + 10} pontos!`
      if (newConsecutiveSuccesses >= 3) {
        feedbackMessage += ' Dificuldade aumentada!'
      }
      setFeedback({ type: 'success', message: feedbackMessage })
      if (isTTSEnabled) {
        speakFeedback(feedbackMessage, true)
      }

      setTimeout(() => {
        let nextLevel = currentLevel + 1
        if (newConsecutiveSuccesses >= 3) {
          nextLevel += 1
          setConsecutiveSuccesses(0)
        }
        setCurrentLevel(nextLevel)
        setPlacedPieces([])
        setFeedback(null)

        const nextPuzzle = generatePuzzle()
        setGameEmotion(nextPuzzle)

        announceToScreenReader(`Nível ${nextLevel}! Monte o próximo quebra-cabeça.`)
        if (isTTSEnabled) {
          autoSpeak(`Nível ${nextLevel}! Monte o próximo quebra-cabeça emocional.`, 500)
        }
      }, 2000)
    }
  }

  useEffect(() => {
    if (gameEmotion && gameStarted) {
      const timer = setTimeout(() => {
        playContext(gameEmotion)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [gameEmotion, gameStarted])

  return (
    <GameContainer>
      <GameHeader>
        <BackButton onClick={onBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          ⬅️ Voltar
        </BackButton>
      </GameHeader>

      <ActivityTitleSection>
        <ActivityMainTitle>
          <span>😊</span>
          <span>Quebra-Cabeça Emocional</span>
        </ActivityMainTitle>
        <ActivitySubtitle>Monte quebra-cabeças para reconhecer e entender emoções</ActivitySubtitle>
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

      {gameStarted && isPlayingContext && (
        <InstructionText
          onClick={() =>
            isTTSEnabled && speakInstruction(`Observe a emoção e monte o quebra-cabeça.`)
          }
        >
          👀 Observe a emoção...
        </InstructionText>
      )}

      {gameStarted && isPlayerTurn && (
        <InstructionText
          onClick={() =>
            isTTSEnabled &&
            speakInstruction(`Monte o quebra-cabeça da emoção ${gameEmotion?.name}.`)
          }
        >
          🖐️ Monte o quebra-cabeça
        </InstructionText>
      )}

      {gameStarted && gameEmotion && (
        <>
          <ProgressDisplay>
            <span>Nível: {currentLevel}</span>
            <span>•</span>
            <span>Pontos: {progress.score}</span>
            <span>•</span>
            <StarDisplay>
              {Array.from({ length: 3 }, (_, i) => (
                <span key={i}>{i < progress.stars ? '⭐' : '☆'}</span>
              ))}
            </StarDisplay>
          </ProgressDisplay>

          <ContextText>
            Emoção: {gameEmotion.name} ({gameEmotion.context})
          </ContextText>

          <PuzzleDisplay>
            <PuzzleBoard columns={Math.ceil(Math.sqrt(gameEmotion.pieces.length))}>
              {gameEmotion.pieces.map((piece, index) => (
                <PuzzlePiece
                  key={piece.id}
                  isPlaced={piece.isPlaced}
                  draggable={false}
                  animate={piece.isPlaced ? { scale: 1.1, opacity: 1 } : { opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  {piece.isPlaced ? piece.emoji : '□'}
                </PuzzlePiece>
              ))}
            </PuzzleBoard>
          </PuzzleDisplay>

          {isPlayerTurn && (
            <PieceContainer>
              {gameEmotion.pieces
                .filter((piece) => !piece.isPlaced)
                .map((piece) => (
                  <PuzzlePiece
                    key={piece.id}
                    draggable={true}
                    onClick={() => handlePieceDrop(piece.id)}
                    whileHover={isPlayerTurn ? { scale: 1.1 } : {}}
                    whileTap={isPlayerTurn ? { scale: 0.9 } : {}}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {piece.emoji}
                  </PuzzlePiece>
                ))}
            </PieceContainer>
          )}
        </>
      )}

      {!gameStarted ? (
        <>
          <InstructionText
            onClick={() =>
              isTTSEnabled &&
              speakInstruction(
                'Monte o quebra-cabeça para reconhecer a emoção! Escolha a dificuldade para começar.'
              )
            }
          >
            😊 Monte o quebra-cabeça para reconhecer a emoção!
            <br />
            Escolha a dificuldade para começar.
          </InstructionText>

          <DifficultySelector>
            {[
              {
                id: 'EASY',
                name: '🟢 Fácil',
                description: '2 peças por emoção',
                icon: '😊',
              },
              {
                id: 'MEDIUM',
                name: '🟡 Médio',
                description: '3 peças por emoção',
                icon: '🤔',
              },
              {
                id: 'HARD',
                name: '🔴 Difícil',
                description: '4 peças por emoção',
                icon: '🧠',
              },
            ].map((diff) => (
              <DifficultyButton
                key={diff.id}
                isActive={selectedDifficulty === diff.id}
                onClick={() => {
                  setSelectedDifficulty(diff.id)
                  playClick()
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
              onClick={startNewGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              themeColor={THEME_COLOR}
            >
              😊 Começar Jogo de Quebra-Cabeça Emocional
            </ActionButton>
          </ControlButtons>
        </>
      ) : (
        <ActionButtonsContainer>
          <ActionButton
            onClick={() => playContext(gameEmotion)}
            disabled={isPlayingContext || !gameStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Ver Contexto Novamente
          </ActionButton>

          <ActionButton
            className="restart"
            onClick={restartGame}
            disabled={isPlayingContext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎮 Reiniciar Jogo
          </ActionButton>
        </ActionButtonsContainer>
      )}

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

export default EmotionalPuzzle
