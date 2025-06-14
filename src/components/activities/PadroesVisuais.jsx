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
const THEME_COLOR = 'var(--primary-blue)'
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-blue), var(--primary-purple))'

// Estilos específicos para VisualPatterns com as cores temáticas
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

const SequenceDisplay = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  margin: var(--space-lg) 0;
  min-height: 80px;
  align-items: center;
`

const ShapeIndicator = styled(motion.div)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${(props) => (props.isActive ? 'var(--primary-orange)' : 'var(--light-gray)')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: var(--shadow-medium);
  border: 3px solid ${(props) => (props.isActive ? 'var(--primary-orange)' : 'transparent')};

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
`

const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    gap: var(--space-sm);
  }
`

const ShapeButton = styled(motion.button)`
  padding: var(--space-lg);
  border: none;
  border-radius: var(--radius-large);
  font-size: var(--font-size-xl);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-medium);
  min-height: 100px;

  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: var(--space-md);
    font-size: var(--font-size-lg);
    min-height: 80px;
  }
`

const StarButton = styled(ShapeButton)`
  background: linear-gradient(135deg, var(--primary-yellow), var(--primary-orange));
  color: white;
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #ffc107, #fb923c);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(255, 193, 7, 0.4);
  }
`

const CircleButton = styled(ShapeButton)`
  background: linear-gradient(135deg, var(--primary-green), var(--primary-cyan));
  color: white;
  box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #22c55e, #06b6d4);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(34, 197, 94, 0.4);
  }
`

const TriangleButton = styled(ShapeButton)`
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
  color: white;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #3b82f6, #06b6d4);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.4);
  }
`

const SquareButton = styled(ShapeButton)`
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

const PlayerProgressBar = styled.div`
  display: flex;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-medium);
  margin: var(--space-sm) 0;
  justify-content: center;
  min-height: 40px;
  align-items: center;
`

const ProgressDot = styled.div.attrs((props) => ({
  'data-completed': props.$isCompleted,
  'data-current': props.$isCurrent,
}))`
  width: 12px;
  height: 12px;
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
`

const StarDisplay = styled.div`
  display: flex;
  gap: var(--space-xs);
  font-size: var(--font-size-xl);
`

const shapes = [
  { id: 'star', name: 'Estrela', emoji: '⭐', sound: 'star.mp3' },
  { id: 'circle', name: 'Círculo', emoji: '🟢', sound: 'circle.mp3' },
  { id: 'triangle', name: 'Triângulo', emoji: '🔺', sound: 'triangle.mp3' },
  { id: 'square', name: 'Quadrado', emoji: '🟥', sound: 'square.mp3' },
]

const encouragingMessages = [
  'Muito bem! 🌟',
  'Excelente! Continue assim! 🎉',
  'Você tem um ótimo olho para padrões! 👀',
  'Perfeito! Você está indo muito bem! ✨',
  'Fantástico! Sua memória está ótima! 🧠',
]

function VisualPatterns({ onBack }) {
  const [gameSequence, setGameSequence] = useState([])
  const [playerSequence, setPlayerSequence] = useState([])
  const [isPlayingSequence, setIsPlayingSequence] = useState(false)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [selectedDifficulty, setSelectedDifficulty] = useState('EASY')
  const [feedback, setFeedback] = useState(null)
  const [playingShape, setPlayingShape] = useState(null)
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
    saveProgress,
    startActivity,
    pauseActivity,
    resumeActivity,
    finishActivity,
    getCurrentTimeMetrics,
    sessionId,
    isActivityActive,
    isActivityPaused,
  } = useProgress('visual-patterns')
  const { speak, speakInstruction, speakFeedback, autoSpeak, isTTSEnabled } = useTTS()

  const generateSequence = (length = currentLevel + 1) => {
    const sequence = []
    let lastShapeIndex = -1

    for (let i = 0; i < length; i++) {
      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * shapes.length)
      } while (randomIndex === lastShapeIndex && shapes.length > 1)

      lastShapeIndex = randomIndex
      sequence.push(shapes[randomIndex].id)
    }
    return sequence
  }

  const playShape = async (shapeId) => {
    setPlayingShape(shapeId)
    const shape = shapes.find((s) => s.id === shapeId)

    if (!shape) {
      console.warn(`Forma não encontrada: ${shapeId}`)
      setPlayingShape(null)
      return
    }

    try {
      if (shapeId === 'success') {
        playSuccess()
        setTimeout(() => setPlayingShape(null), 500)
        return
      } else if (shapeId === 'error') {
        playError()
        setTimeout(() => setPlayingShape(null), 500)
        return
      }

      await playSound(shape.sound)
      setTimeout(() => setPlayingShape(null), 600)
      announceToScreenReader(`Forma ${shape.name} exibida`)
    } catch (error) {
      console.error('Erro ao reproduzir som para', shape.name, ':', error)
      setTimeout(() => setPlayingShape(null), 300)
    }
  }

  const playSequence = async () => {
    setIsPlayingSequence(true)
    setIsPlayerTurn(false)
    for (let i = 0; i < gameSequence.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      await playShape(gameSequence[i])
      await new Promise((resolve) => setTimeout(resolve, 600))
    }
    setIsPlayingSequence(false)
    setIsPlayerTurn(true)
    announceToScreenReader('Agora é sua vez! Repita a sequência que você viu.')
    if (isTTSEnabled) {
      speakInstruction('Agora é sua vez! Repita a sequência tocando nas formas na ordem correta.')
    }
  }

  const startNewGame = async () => {
    await startActivity()
    resetSession()
    setCurrentLevel(getDifficultyLevel(selectedDifficulty))
    setConsecutiveSuccesses(0)
    setPlayerSequence([])
    setGameStarted(true)
    setFeedback(null)
    setIsPlayerTurn(false)
    setIsPlayingSequence(false)

    const newSequence = generateSequence(getDifficultySequenceLength(selectedDifficulty))
    setGameSequence(newSequence)

    announceToScreenReader(
      `Novo jogo iniciado no nível ${getDifficultyName(selectedDifficulty)}! Observe a sequência de formas.`
    )
    if (isTTSEnabled) {
      autoSpeak(
        `Novo jogo de padrões visuais iniciado! Dificuldade ${getDifficultyName(selectedDifficulty)}. Observe a sequência de formas e repita tocando nas formas na ordem correta.`,
        1000
      )
    }
  }

  const restartGame = () => {
    setCurrentLevel(1)
    setPlayerSequence([])
    setFeedback(null)
    setIsPlayerTurn(false)
    setIsPlayingSequence(false)

    const newSequence = generateSequence(2)
    setGameSequence(newSequence)

    announceToScreenReader('Jogo reiniciado! Observe a nova sequência.')
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
        const model = await createAdaptiveModel('visual-patterns')
        const params = await getAdaptiveParameters('visual-patterns')
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
  const getDifficultySequenceLength = (difficulty) => {
    let baseLength
    switch (difficulty) {
      case 'EASY':
        baseLength = 2
        break
      case 'MEDIUM':
        baseLength = 3
        break
      case 'HARD':
        baseLength = 4
        break
      default:
        baseLength = 2
    }

    // Aplicar ajuste adaptativo se disponível
    if (adaptiveParams && adaptiveParams.sequenceLength) {
      const adjustment = Math.round(adaptiveParams.sequenceLength - baseLength)
      baseLength = Math.max(2, Math.min(6, baseLength + adjustment))
    }

    return baseLength
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

  const calculateScore = (level, sequenceLength) => {
    const basePoints = 10
    const levelBonus = level * 5
    const sequenceBonus = sequenceLength * 5
    return basePoints + levelBonus + sequenceBonus
  }

  const handlePlayerShape = (shapeId) => {
    if (!isPlayerTurn || isPlayingSequence) return

    playShape(shapeId)
    const newPlayerSequence = [...playerSequence, shapeId]
    setPlayerSequence(newPlayerSequence)

    const currentIndex = newPlayerSequence.length - 1
    const isCorrect = gameSequence[currentIndex] === shapeId

    if (!isCorrect) {
      recordError()
      incrementAttempts()
      vibrateError()
      playError()
      setConsecutiveSuccesses(0)
      setFeedback({ type: 'error', message: 'Ops! Tente novamente.' })
      if (isTTSEnabled) {
        speakFeedback('Ops! Tente novamente. Observe a sequência mais uma vez.', false)
      }

      const performanceData = {
        correct: 0,
        incorrect: 1,
        responseTimes: [500],
        level: currentLevel,
        sequenceLength: gameSequence.length,
        errorType: 'wrong_shape',
        shapePosition: currentIndex,
      }
      recordPerformance('visual-patterns', performanceData)

      setTimeout(() => {
        setPlayerSequence([])
        setFeedback(null)
        playSequence()
      }, 2000)
      return
    }

    if (newPlayerSequence.length === gameSequence.length) {
      const bonusPoints = calculateScore(currentLevel, gameSequence.length) - 10
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
        sequenceLength: gameSequence.length,
        consecutiveSuccesses: newConsecutiveSuccesses,
        score: bonusPoints + 10,
        timestamp: new Date().toISOString(),
        activityType: 'visual-patterns',
      }

      recordPerformance('visual-patterns', performanceData)

      // Salvar dados no sistema ML adaptativo
      if (adaptiveModel) {
        const gameData = {
          userId: sessionId,
          activityType: 'visual-patterns',
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
            sequenceLength: gameSequence.length,
            shapeTypes: gameSequence,
          },
          timestamp: new Date().toISOString(),
        }
        try {
          adaptiveModel.saveGameData(gameData)
        } catch (error) {
          console.error('Erro ao salvar dados adaptativos:', error)
        }
      }

      let feedbackMessage = `Parabéns! Você ganhou ${bonusPoints + 10} pontos!`
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
        setPlayerSequence([])
        setFeedback(null)

        const nextSequence = generateSequence(Math.min(nextLevel + 1, 6))
        setGameSequence(nextSequence)

        announceToScreenReader(`Nível ${nextLevel}! Observe a nova sequência.`)
        if (isTTSEnabled) {
          autoSpeak(`Nível ${nextLevel}! Observe a nova sequência de formas.`, 500)
        }
      }, 2000)
    }
  }

  useEffect(() => {
    if (gameSequence.length > 0 && gameStarted) {
      const timer = setTimeout(() => {
        playSequence()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [gameSequence, gameStarted])

  return (
    <GameContainer>
      <GameHeader>
        <BackButton onClick={onBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          ⬅️ Voltar
        </BackButton>
      </GameHeader>

      <ActivityTitleSection>
        <ActivityMainTitle>
          <span>👀</span>
          <span>Padrões Visuais</span>
        </ActivityMainTitle>
        <ActivitySubtitle>
          Desenvolva sua memória visual e reconhecimento de padrões
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

      {gameStarted && isPlayingSequence && (
        <InstructionText
          onClick={() =>
            isTTSEnabled && speakInstruction('Observe com atenção a sequência de formas.')
          }
        >
          👀 Observe com atenção...
        </InstructionText>
      )}

      {gameStarted && isPlayerTurn && (
        <InstructionText
          onClick={() =>
            isTTSEnabled && speakInstruction('Sua vez! Repita a sequência tocando nas formas.')
          }
        >
          🖐️ Sua vez! Repita a sequência
        </InstructionText>
      )}

      {gameStarted && (
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
      )}

      <SequenceDisplay>
        <AnimatePresence>
          {gameSequence.map((shapeId, index) => {
            const shape = shapes.find((s) => s.id === shapeId)
            const isCurrentlyPlaying = playingShape === shapeId

            return (
              <ShapeIndicator
                key={`${shapeId}-${index}`}
                isActive={isCurrentlyPlaying}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isCurrentlyPlaying ? 1.2 : 1,
                  opacity: 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {shape.emoji}
              </ShapeIndicator>
            )
          })}
        </AnimatePresence>
      </SequenceDisplay>

      {gameStarted && isPlayerTurn && (
        <PlayerProgressBar>
          {gameSequence.map((_, index) => (
            <ProgressDot
              key={index}
              $isCompleted={index < playerSequence.length}
              $isCurrent={index === playerSequence.length}
            />
          ))}
        </PlayerProgressBar>
      )}

      {!gameStarted ? (
        <>
          <InstructionText
            onClick={() =>
              isTTSEnabled &&
              speakInstruction(
                'Observe a sequência de formas e repita tocando nas formas na ordem correta! Escolha a dificuldade para começar.'
              )
            }
          >
            👀 Observe a sequência de formas e repita tocando nas formas na ordem correta!
            <br />
            Escolha a dificuldade para começar.
          </InstructionText>

          <DifficultySelector>
            {[
              {
                id: 'EASY',
                name: '🟢 Fácil',
                description: 'Sequências de 2 formas',
                icon: '😊',
              },
              {
                id: 'MEDIUM',
                name: '🟡 Médio',
                description: 'Sequências de 3 formas',
                icon: '🤔',
              },
              {
                id: 'HARD',
                name: '🔴 Difícil',
                description: 'Sequências de 4 formas',
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
              👀 Começar Jogo de Padrões Visuais
            </ActionButton>
          </ControlButtons>
        </>
      ) : (
        <>
          <ButtonsContainer>
            <StarButton
              onClick={() => handlePlayerShape('star')}
              disabled={!isPlayerTurn}
              whileHover={isPlayerTurn ? { scale: 1.05 } : {}}
              whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
              animate={
                playingShape === 'star'
                  ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 4px 8px rgba(255, 193, 7, 0.3)',
                        '0 8px 16px rgba(255, 193, 7, 0.6)',
                        '0 4px 8px rgba(255, 193, 7, 0.3)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.3 }}
            >
              <span>⭐</span>
              <span>Estrela</span>
            </StarButton>

            <CircleButton
              onClick={() => handlePlayerShape('circle')}
              disabled={!isPlayerTurn}
              whileHover={isPlayerTurn ? { scale: 1.05 } : {}}
              whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
              animate={
                playingShape === 'circle'
                  ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 4px 8px rgba(34, 197, 94, 0.3)',
                        '0 8px 16px rgba(34, 197, 94, 0.6)',
                        '0 4px 8px rgba(34, 197, 94, 0.3)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.3 }}
            >
              <span>🟢</span>
              <span>Círculo</span>
            </CircleButton>

            <TriangleButton
              onClick={() => handlePlayerShape('triangle')}
              disabled={!isPlayerTurn}
              whileHover={isPlayerTurn ? { scale: 1.05 } : {}}
              whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
              animate={
                playingShape === 'triangle'
                  ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 4px 8px rgba(59, 130, 246, 0.3)',
                        '0 8px 16px rgba(59, 130, 246, 0.6)',
                        '0 4px 8px rgba(59, 130, 246, 0.3)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.3 }}
            >
              <span>🔺</span>
              <span>Triângulo</span>
            </TriangleButton>

            <SquareButton
              onClick={() => handlePlayerShape('square')}
              disabled={!isPlayerTurn}
              whileHover={isPlayerTurn ? { scale: 1.05 } : {}}
              whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
              animate={
                playingShape === 'square'
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
            >
              <span>🟥</span>
              <span>Quadrado</span>
            </SquareButton>
          </ButtonsContainer>

          <ActionButtonsContainer>
            <ActionButton
              onClick={playSequence}
              disabled={isPlayingSequence || !gameStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Ver Novamente
            </ActionButton>

            <ActionButton
              className="restart"
              onClick={restartGame}
              disabled={isPlayingSequence}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 Reiniciar Jogo
            </ActionButton>
          </ActionButtonsContainer>
        </>
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

export default VisualPatterns
