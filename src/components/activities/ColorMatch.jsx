import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import useSound from '../../hooks/useSound'
import useProgress from '../../hooks/useProgress'
import useAdvancedActivity from '../../hooks/useAdvancedActivity'
import useTTS from '../../hooks/useTTS'
import ActivityTimer from '../common/ActivityTimer'
import { announceToScreenReader, vibrateSuccess, vibrateError, prefersHighContrast, prefersReducedMotion } from '../../utils/accessibility'
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
  ActionButton
} from '../../styles/activityCommon'

// Definição de cores temáticas para esta atividade
const THEME_COLOR = 'var(--primary-green)';
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-green), var(--primary-blue))';

// Estilos específicos para ColorMatch com as cores temáticas
const InstructionText = styled(BaseInstructionText)`
  background: ${THEME_GRADIENT};
`

const GameControlButton = styled(motion.button)`
  background: var(--medium-gray);
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  
  &:hover {
    background: var(--dark-gray);
  }
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

const ScoreDisplay = styled.div`
  text-align: center;
  font-size: var(--font-size-lg);
  color: var(--primary-green);
  font-weight: 600;
`

const GameArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
`

const ColorPrompt = styled(motion.div)`
  text-align: center;
  padding: var(--space-lg);
  background: linear-gradient(135deg, var(--primary-green), var(--primary-blue));
  color: white;
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-medium);
`

const PromptText = styled.h3`
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-md);
  font-weight: 600;
`

const TargetColor = styled.div`
  width: 80px;
  height: 80px;
  border-radius: var(--radius-round);
  background: ${props => props.color};
  margin: 0 auto;
  box-shadow: var(--shadow-medium);
  border: 4px solid white;
`

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-md);
  max-width: 600px;
  width: 100%;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 360px) {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`

const ItemCard = styled(motion.button)`
  background: ${props => props.isSelected ? 'var(--success-light)' : 'white'};
  border: 3px solid ${props => {
    if (props.isSelected && props.isCorrect) return 'var(--primary-green)'
    if (props.isSelected && !props.isCorrect) return 'var(--primary-red)'
    return 'var(--light-gray)'
  }};
  border-radius: var(--radius-medium);
  padding: var(--space-md);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  min-height: 120px;
  box-shadow: ${props => {
    if (props.isSelected && props.isCorrect) return '0 4px 12px rgba(76, 175, 80, 0.3)'
    if (props.isSelected && !props.isCorrect) return '0 4px 12px rgba(244, 67, 54, 0.3)'
    return 'var(--shadow-light)'
  }};
  position: relative;
  transition: all var(--transition-normal);
  
  &:hover:not(:disabled) {
    border-color: var(--primary-green);
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }  
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  /* Efeito de sucesso */
  ${props => props.isSelected && props.isCorrect && `
    background: var(--success-light);
    border-color: var(--primary-green);
    
    &::after {
      content: '✓';
      position: absolute;
      top: 5px;
      right: 5px;
      background: var(--primary-green);
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
  `}
  
  /* Efeito de erro temporário */
  ${props => props.isSelected && !props.isCorrect && `
    background: var(--error-light);
    border-color: var(--primary-red);
    
    &::after {
      content: '✗';
      position: absolute;
      top: 5px;
      right: 5px;
      background: var(--primary-red);
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }
  `}
`

const ItemEmoji = styled.div`
  font-size: 2rem;
  margin-bottom: var(--space-xs);
`

const ItemName = styled.div`
  font-size: var(--font-size-sm);
  color: var(--dark-gray);
  text-align: center;
  font-weight: 500;
`

const FeedbackMessage = styled(motion.div)`
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  text-align: center;
  font-weight: 600;
  font-size: var(--font-size-md);
  margin: var(--space-md) 0;
  
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

const GameControls = styled.div`
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  justify-content: center;
  margin: var(--space-lg) 0;
`

// Dados do jogo
const colors = {
  RED: '#e91e63',
  GREEN: '#4CAF50',
  BLUE: '#2196F3',
  YELLOW: '#FFC107',
  PURPLE: '#9C27B0',
  ORANGE: '#FF9800'
}

const colorNames = {
  RED: 'Vermelho',
  GREEN: 'Verde',
  BLUE: 'Azul',
  YELLOW: 'Amarelo',
  PURPLE: 'Roxo',
  ORANGE: 'Laranja'
}

// Itens com suas cores associadas
const items = [
  { id: 1, name: 'Maçã', emoji: '🍎', color: 'RED' },
  { id: 2, name: 'Morango', emoji: '🍓', color: 'RED' },
  { id: 3, name: 'Cereja', emoji: '🍒', color: 'RED' },
  { id: 4, name: 'Tomate', emoji: '🍅', color: 'RED' },
  { id: 5, name: 'Melancia', emoji: '🍉', color: 'RED' },
  { id: 6, name: 'Pimenta', emoji: '🌶️', color: 'RED' },
  { id: 7, name: 'Coração', emoji: '❤️', color: 'RED' },
  { id: 8, name: 'Folha', emoji: '🍃', color: 'GREEN' },
  { id: 9, name: 'Árvore', emoji: '🌲', color: 'GREEN' },
  { id: 10, name: 'Brócolis', emoji: '🥦', color: 'GREEN' },
  { id: 11, name: 'Sapo', emoji: '🐸', color: 'GREEN' },
  { id: 12, name: 'Pepino', emoji: '🥒', color: 'GREEN' },
  { id: 13, name: 'Maçã Verde', emoji: '🍏', color: 'GREEN' },
  { id: 14, name: 'Planta', emoji: '🌱', color: 'GREEN' },
  { id: 15, name: 'Oceano', emoji: '🌊', color: 'BLUE' },
  { id: 16, name: 'Peixe', emoji: '🐟', color: 'BLUE' },
  { id: 17, name: 'Golfinho', emoji: '🐬', color: 'BLUE' },
  { id: 18, name: 'Borboleta Azul', emoji: '🦋', color: 'BLUE' },
  { id: 19, name: 'Baleia', emoji: '🐳', color: 'BLUE' },
  { id: 20, name: 'Chapéu', emoji: '🧢', color: 'BLUE' },
  { id: 21, name: 'Jeans', emoji: '👖', color: 'BLUE' },
  { id: 22, name: 'Banana', emoji: '🍌', color: 'YELLOW' },
  { id: 23, name: 'Limão', emoji: '🍋', color: 'YELLOW' },
  { id: 24, name: 'Girassol', emoji: '🌻', color: 'YELLOW' },
  { id: 25, name: 'Estrela', emoji: '⭐', color: 'YELLOW' },
  { id: 26, name: 'Sino', emoji: '🔔', color: 'YELLOW' },
  { id: 27, name: 'Abelha', emoji: '🐝', color: 'YELLOW' },
  { id: 28, name: 'Pintinho', emoji: '🐤', color: 'YELLOW' },
  { id: 29, name: 'Uva', emoji: '🍇', color: 'PURPLE' },
  { id: 30, name: 'Berinjela', emoji: '🍆', color: 'PURPLE' },
  { id: 31, name: 'Vestido', emoji: '👗', color: 'PURPLE' },
  { id: 32, name: 'Cristal', emoji: '💎', color: 'PURPLE' },
  { id: 33, name: 'Borboleta', emoji: '🦄', color: 'PURPLE' },
  { id: 34, name: 'Flor Roxa', emoji: '💜', color: 'PURPLE' },
  { id: 35, name: 'Laranja', emoji: '🍊', color: 'ORANGE' },
  { id: 36, name: 'Abóbora', emoji: '🎃', color: 'ORANGE' },
  { id: 37, name: 'Cenoura', emoji: '🥕', color: 'ORANGE' },
  { id: 38, name: 'Raposa', emoji: '🦊', color: 'ORANGE' },
  { id: 39, name: 'Peixe Dourado', emoji: '🐠', color: 'ORANGE' },
  { id: 40, name: 'Folha de Outono', emoji: '🍂', color: 'ORANGE' }
];

// Constantes para dificuldade configurável pelo usuário
const DIFFICULTY_LEVELS = {
  EASY: { correctItems: 2, incorrectItems: 2, name: 'Fácil' },
  MEDIUM: { correctItems: 3, incorrectItems: 3, name: 'Médio' },
  HARD: { correctItems: 4, incorrectItems: 4, name: 'Difícil' }
};

function ColorMatch({ onBack }) {
  const [currentColor, setCurrentColor] = useState(null)
  const [gameItems, setGameItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [gameStarted, setGameStarted] = useState(false)
  const [roundsCompleted, setRoundsCompleted] = useState(0)
  const [showDifficultySelector, setShowDifficultySelector] = useState(!gameStarted)
  
  const { playSuccess, playError, playClick } = useSound()
  const {
    speak,
    speakInstruction,
    speakFeedback,
    speakQuestion,
    speakColor,
    autoSpeak,
    stop,
    isTTSEnabled
  } = useTTS();

  // Hook de progresso com sistema de cronometragem
  const {
    progress,
    incrementAttempts,
    recordSuccess,
    recordError,
    resetProgress,
    updateScore,
    incrementSuccesses,
    getCurrentTimeMetrics,
    startActivity,
    pauseActivity,
    resumeActivity,
    finishActivity,
    isActivityActive,
    isActivityPaused,
    getStats,
    getEncouragementMessage,
    saveProgress  } = useProgress('color-match')

  // Hook avançado de atividade multissensorial
  const {
    recordAdvancedInteraction,
    recordBehavioralIndicator,
    startAdvancedSession,
    stopAdvancedSession,
    sessionInsights
  } = useAdvancedActivity('color-match', {
    enableSensorTracking: true,
    enableGeoLocation: false,
    enableNeurodivergenceAnalysis: true
  })
  
  // Progresso local para métricas durante o jogo
  const [localProgress, setLocalProgress] = useState({
    score: 0,
    accuracy: 100,
    stars: 0
  })
    // Efeito para garantir que ActivityTimer está sincronizado
  useEffect(() => {
    // Limpar timers na desmontagem
    return () => {
      finishActivity()
      // 🔥 FINALIZAR SESSÃO MULTISSENSORIAL ao sair
      const handleExit = async () => {
        try {
          const finalReport = await stopAdvancedSession()
          if (finalReport) {
            console.log('🏁 Sessão ColorMatch finalizada:', finalReport)
          }
        } catch (error) {
          console.error('Erro ao finalizar sessão avançada:', error)
        }
      }
      handleExit()
    }
  }, [])
    // Iniciar novo jogo
  const startNewGame = async () => {
    try {
      // Iniciar cronometragem
      await startActivity()
      
      // Iniciar sessão avançada multissensorial
      const advancedStarted = await startAdvancedSession()
      if (advancedStarted) {
        console.log('🚀 Sessão avançada ColorMatch iniciada')
      }
      
      // Configurar jogo
      setGameStarted(true)
      setShowDifficultySelector(false)
      resetProgress()
      setRoundsCompleted(0)
      setSelectedItems([])
      setLocalProgress({
        score: 0,
        accuracy: 100,
        stars: 0
      })
      
      // Gerar primeira rodada
      generateNewRound()
      announceToScreenReader("Jogo de cores iniciado! Encontre todos os itens da cor indicada.")      // TTS: Anunciar início do jogo apenas se TTS estiver ativado
      if (isTTSEnabled) {
        autoSpeak("Jogo de cores iniciado! Encontre todos os itens da cor indicada.", 1000);
      }
      
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error)
    }
  }    // Gerar nova rodada
  const generateNewRound = () => {
    // Reset completo do estado anterior
    setSelectedItems([])
    setFeedback(null)
    
    // Marcar tempo de início da rodada para tracking
    window.colorMatchStartTime = Date.now()
    
    // Escolher uma cor aleatória
    const availableColors = Object.keys(colors)
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)]
    setCurrentColor(randomColor)
    
    // 🔥 TRACKING MULTISSENSORIAL - Nova rodada iniciada
    recordAdvancedInteraction({
      type: 'round_start',
      subtype: 'color_challenge_presented',
      sensoryModality: 'visual',
      context: {
        targetColor: randomColor,
        colorName: colorNames[randomColor],
        difficulty,
        roundNumber: roundsCompleted + 1,
        challengeType: 'color_discrimination'
      }
    })
    
    // Filtrar itens da cor escolhida
    const correctItemsForColor = items.filter(item => item.color === randomColor)
    const incorrectItems = items.filter(item => item.color !== randomColor)
    
    // Selecionar aleatoriamente o número correto de itens com base na dificuldade
    const shuffleArray = array => [...array].sort(() => Math.random() - 0.5)
    
    const difficultyConfig = DIFFICULTY_LEVELS[difficulty]
    
    // Garantir que temos itens suficientes e variedade
    const selectedCorrectItems = shuffleArray(correctItemsForColor)
      .slice(0, difficultyConfig.correctItems)
    
    const selectedIncorrectItems = shuffleArray(incorrectItems)
      .slice(0, difficultyConfig.incorrectItems)
    
    // Combinar e embaralhar os itens para posicionamento aleatório
    const allGameItems = shuffleArray([...selectedCorrectItems, ...selectedIncorrectItems])
    
    setGameItems(allGameItems)
    
    // Anunciar novo desafio para acessibilidade
    setTimeout(() => {
      announceToScreenReader(`Novo desafio! Encontre ${difficultyConfig.correctItems} itens da cor ${colorNames[randomColor].toLowerCase()}.`)      // TTS: Anunciar novo desafio apenas se TTS estiver ativado
      if (isTTSEnabled) {
        speakQuestion(`Novo desafio! Encontre ${difficultyConfig.correctItems} itens da cor ${colorNames[randomColor].toLowerCase()}.`);
      }
    }, 500)  }
  
  // Verificar se todos os itens corretos foram encontrados
  const checkRoundComplete = (currentSelectedItems) => {
    const correctItems = gameItems.filter(item => item.color === currentColor)
    const allCorrectFound = correctItems.every(item => 
      currentSelectedItems.some(selected => selected.id === item.id)
    )
    
    if (allCorrectFound && currentSelectedItems.length === correctItems.length) {
      // Calcular pontuação melhorada
      const difficultyBonus = difficulty === 'EASY' ? 15 : difficulty === 'MEDIUM' ? 25 : 40
      const perfectBonus = currentSelectedItems.length === correctItems.length ? 10 : 0
      const score = difficultyBonus + (DIFFICULTY_LEVELS[difficulty].correctItems * 8) + perfectBonus
      
      // Atualizar progresso de forma mais robusta
      recordSuccess()
      incrementSuccesses()
      
      // Atualizar progresso local imediatamente para UI responsiva
      setLocalProgress(prev => {
        const newScore = prev.score + score
        const newStars = Math.min(3, Math.floor(newScore / 80)) // Reduzido para mais estrelas
        return {
          ...prev,
          score: newScore,
          stars: newStars,
          accuracy: Math.round((roundsCompleted + 1) / Math.max(1, roundsCompleted + 1) * 100)
        }
      })
      setRoundsCompleted(prev => prev + 1)
      
      // Feedback de sucesso melhorado
      const encouragingMessages = [
        `🎉 Perfeito! Todos os itens ${colorNames[currentColor].toLowerCase()}!`,
        `🌟 Excelente! Você encontrou todas as cores certas!`,
        `✨ Fantástico! Sua percepção de cores está ótima!`,
        `🎯 Incrível! Continue assim!`,
        `💫 Muito bem! Você é um expert em cores!`
      ]
      const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
      
      setFeedback({ 
        isCorrect: true, 
        message: `${randomMessage} +${score} pontos!` 
      })
        // Som e vibração de sucesso
      playSuccess()
      vibrateSuccess();
      announceToScreenReader(`${randomMessage} Você ganhou ${score} pontos!`)

      // TTS: Anunciar sucesso apenas se TTS estiver ativado
      if (isTTSEnabled) {
        speakFeedback(`${randomMessage} Você ganhou ${score} pontos!`, true);
      }
      
      // Salvar progresso
      saveProgress()
      
      // TRANSIÇÃO AUTOMÁTICA: avançar para próximo desafio após 3 segundos
      setTimeout(() => {
        setFeedback(null) // Limpar feedback primeiro
        setTimeout(() => {
          generateNewRound() // Gerar novo desafio automaticamente
          announceToScreenReader(`Novo desafio! Encontre os itens ${colorNames[currentColor] ? colorNames[currentColor].toLowerCase() : 'da nova cor'}.`)
        }, 500)
      }, 3000) // 3 segundos para a criança ver o sucesso
    }
  }
  // Lidar com clique em item
  const handleItemClick = (item) => {
    if (selectedItems.some(selected => selected.id === item.id)) {
      return // Item já selecionado
    }
    
    playClick()
    incrementAttempts()
    
    // 🔥 TRACKING MULTISSENSORIAL - Registrar interação de seleção
    recordAdvancedInteraction({
      type: 'item_selection',
      subtype: 'color_discrimination',
      sensoryModality: 'visual',
      isCorrect: item.color === currentColor,
      responseTime: Date.now() - (window.colorMatchStartTime || Date.now()),
      context: {
        targetColor: currentColor,
        selectedItem: {
          name: item.name,
          color: item.color,
          category: item.category
        },
        difficulty,
        roundNumber: roundsCompleted + 1,
        previousAttempts: selectedItems.length
      }
    })
    
    // Adicionar item à seleção
    const newSelectedItems = [...selectedItems, item]
    setSelectedItems(newSelectedItems)
    
    // Verificar se o item é da cor correta
    if (item.color === currentColor) {
      // Correto - som de confirmação suave
      vibrateSuccess()
      announceToScreenReader(`Correto! ${item.name} é da cor ${colorNames[currentColor].toLowerCase()}.`)
      
      // 🔥 TRACKING MULTISSENSORIAL - Sucesso na discriminação de cores
      recordAdvancedInteraction({
        type: 'success_response',
        subtype: 'color_match_correct',
        sensoryModality: 'visual-motor',
        context: {
          colorAccuracy: 'high',
          visualProcessing: 'effective',
          reactionPattern: 'accurate'
        }
      })
      
      // Verificar se completou o desafio (usar newSelectedItems atualizado)
      checkRoundComplete(newSelectedItems)
    } else {
      // Incorreto - feedback imediato mas não bloqueante
      recordError()
      playError()
      vibrateError()
      
      // 🔥 TRACKING MULTISSENSORIAL - Erro na discriminação de cores
      recordAdvancedInteraction({
        type: 'error_response',
        subtype: 'color_discrimination_error',
        sensoryModality: 'visual',
        context: {
          confusionType: `${item.color}_vs_${currentColor}`,
          errorPattern: 'color_mismatch',
          supportNeeded: 'visual_discrimination'
        }
      })
      
      const errorMessages = [
        `🤔 Ops! ${item.name} não é da cor ${colorNames[currentColor].toLowerCase()}.`,
        `🎨 Hmm, ${item.name} tem uma cor diferente. Tente outro!`,
        `🌈 Não é bem essa cor. Observe bem e tente novamente!`,
        `💡 Essa não é a cor certa. Você consegue encontrar a correta!`
      ]
      const randomErrorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)]
        announceToScreenReader(`${randomErrorMessage} Continue tentando!`)

      // TTS: Anunciar erro apenas se TTS estiver ativado
      if (isTTSEnabled) {
        speakFeedback(`${randomErrorMessage} Continue tentando!`, false);
      }
      setFeedback({ 
        isCorrect: false, 
        message: `${randomErrorMessage} Continue!` 
      })
      
      // Remover item incorreto da seleção após um breve delay
      setTimeout(() => {
        setSelectedItems(prev => prev.filter(selected => selected.id !== item.id))
        setFeedback(null)
      }, 1500) // 1.5 segundos para ver o erro, depois remove automaticamente
    }
  }
    const isItemSelected = (item) => {
    return selectedItems.some(selected => selected.id === item.id)
  }
  
  const isItemCorrect = (item) => {
    return item.color === currentColor
  }
    return (
    <GameContainer>
      <GameHeader>
        <BackButton
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⬅️ Voltar
        </BackButton>
      </GameHeader>

      <ActivityTitleSection>
        <ActivityMainTitle>
          <span>🌈</span>
          <span>Combinar Cores</span>
        </ActivityMainTitle>
        <ActivitySubtitle>
          Encontre todos os objetos da cor indicada
        </ActivitySubtitle>
      </ActivityTitleSection>

      {gameStarted && !showDifficultySelector && (
        <GameStats>
          <StatItem>
            <StatValue>{progress.score}</StatValue>
            <StatLabel>Pontos</StatLabel>
          </StatItem>          <StatItem>
            <StatValue>{roundsCompleted + 1}</StatValue>
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
      
      {showDifficultySelector ? (
        <>
          <InstructionText
            onClick={() => {
              if (isTTSEnabled) {
                speakInstruction("Encontre todos os itens da cor indicada! Escolha a dificuldade para começar.");
              } else {
                // Feedback visual quando TTS está desativado
                announceToScreenReader("Áudio de texto para voz está desativado nas configurações");
              }
            }}
          >
            🌈 Encontre todos os itens da cor indicada! Escolha a dificuldade para começar.
          </InstructionText>
          
          <DifficultySelector>
            {[
              {
                id: 'EASY',
                name: '🟢 Fácil',
                description: '2 itens da mesma cor',
                icon: '😊'
              },
              {
                id: 'MEDIUM',
                name: '🟡 Médio',
                description: '3 itens da mesma cor',
                icon: '😐'
              },
              {
                id: 'HARD',
                name: '🔴 Difícil',
                description: '4 itens da mesma cor',
                icon: '🧠'
              }
            ].map((diff) => (
              <DifficultyButton
                key={diff.id}
                isActive={difficulty === diff.id}
                onClick={() => {
                  setDifficulty(diff.id);
                  playClick();
                  // TTS: Anunciar dificuldade selecionada
                  if (isTTSEnabled) {
                    speak(`Dificuldade ${diff.name} selecionada. ${diff.description}`);
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
                playClick();
                if (isTTSEnabled) {
                  speak("Começando jogo de cores!");
                }
                startNewGame();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              themeColor={THEME_COLOR}
            >
              🌈 Começar Jogo
            </ActionButton>
          </ControlButtons>
        </>
      ) : (
        <>
          <GameControls>
            <ScoreDisplay>
              Nível: {DIFFICULTY_LEVELS[difficulty].name} | Pontos: {localProgress.score} | ⭐ {localProgress.stars}/3 | 🎯 {localProgress.accuracy}%
            </ScoreDisplay>
              <GameControlButton
              onClick={() => setShowDifficultySelector(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎛️ Trocar Nível
            </GameControlButton>
            
            <GameControlButton
              onClick={startNewGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Novo Jogo
            </GameControlButton>
          </GameControls>
          
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
          />
      
          <GameArea>
            {currentColor && (
              <ColorPrompt
                key={currentColor}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PromptText>
                  Encontre todos os {DIFFICULTY_LEVELS[difficulty].correctItems} itens da cor {colorNames[currentColor].toLowerCase()}{!isTTSEnabled && ' 🔇'}:
                </PromptText>
                <TargetColor color={colors[currentColor]} />
                {!isTTSEnabled && (
                  <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '8px' }}>
                    Áudio de texto para voz está desativado nas configurações
                  </div>
                )}
              </ColorPrompt>
            )}

            <AnimatePresence>
              {feedback && (                <FeedbackMessage
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={feedback.isCorrect ? 'success' : 'error'}
                >
                  {feedback.message}
                </FeedbackMessage>
              )}
            </AnimatePresence>            <ItemsGrid>
              {gameItems.map((item, index) => (
                <ItemCard
                  key={`${item.id}-${index}`}
                  onClick={() => handleItemClick(item)}
                  isSelected={isItemSelected(item)}
                  isCorrect={isItemCorrect(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: isItemSelected(item) ? 1.02 : 1 
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    scale: { duration: 0.2 }
                  }}
                >
                  <ItemEmoji>{item.emoji}</ItemEmoji>
                  <ItemName>{item.name}</ItemName>
                </ItemCard>
              ))}
            </ItemsGrid>            {currentColor && (
              <div style={{ textAlign: 'center', color: 'var(--medium-gray)', marginTop: 'var(--space-md)' }}>
                <p>💡 Dica: Clique nos itens que têm a cor <strong style={{color: colors[currentColor]}}>{colorNames[currentColor].toLowerCase()}</strong>!</p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: 'var(--space-sm)',
                  fontSize: 'var(--font-size-md)',
                  fontWeight: '600',
                  color: 'var(--primary-blue)'
                }}>
                  <span>Progresso:</span>
                  <span style={{color: 'var(--primary-green)'}}>
                    {selectedItems.filter(item => item.color === currentColor).length}
                  </span>
                  <span>/</span>
                  <span>{DIFFICULTY_LEVELS[difficulty].correctItems}</span>
                  <span style={{fontSize: '1.2rem'}}>
                    {selectedItems.filter(item => item.color === currentColor).length === DIFFICULTY_LEVELS[difficulty].correctItems ? '🎉' : '🎯'}
                  </span>
                </div>
              </div>
            )}
          </GameArea>
        </>
      )}
    </GameContainer>
  )
}

export default ColorMatch
