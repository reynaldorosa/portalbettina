import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import useSound from '../../hooks/useSound'
import useProgress from '../../hooks/useProgress'
import useTTS from '../../hooks/useTTS'
import { useUser } from '../../contexts/UserContext'
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
const THEME_COLOR = 'var(--primary-purple)';
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-purple), var(--primary-blue))';

// Estilos específicos para MusicalSequence com as cores temáticas
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

const NoteIndicator = styled(motion.div)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.isActive ? 'var(--primary-orange)' : 'var(--light-gray)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: var(--shadow-medium);
  border: 3px solid ${props => props.isActive ? 'var(--primary-orange)' : 'transparent'};
  
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

const SoundButton = styled(motion.button)`
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

const DoButton = styled(SoundButton)`
  background: linear-gradient(135deg, var(--primary-pink), var(--primary-orange));
  color: white;
  box-shadow: 0 4px 8px rgba(233, 30, 99, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #F43F5E, #FB923C);
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
    background: linear-gradient(135deg, #84CC16, #06B6D4);
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
    background: linear-gradient(135deg, #3B82F6, #06B6D4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(74, 144, 226, 0.4);
  }
`

const FaButton = styled(SoundButton)`
  background: linear-gradient(135deg, var(--primary-orange), #FFD700);
  color: white;
  box-shadow: 0 4px 8px rgba(245, 166, 35, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-large);
    background: linear-gradient(135deg, #FB923C, #FFC107);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(245, 166, 35, 0.4);
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

const ProgressDot = styled.div.attrs(props => ({
  'data-completed': props.$isCompleted,
  'data-current': props.$isCurrent
}))`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    if (props.$isCompleted) return 'var(--primary-green)'
    if (props.$isCurrent) return 'var(--primary-orange)'
    return 'var(--light-gray)'
  }};
  transition: all var(--transition-normal);
  
  ${props => props.$isCurrent && `
    transform: scale(1.2);
    box-shadow: 0 0 8px var(--primary-orange);
  `}
`

const StarDisplay = styled.div`
  display: flex;
  gap: var(--space-xs);
  font-size: var(--font-size-xl);
`

const notes = [
  { id: 'do', name: 'Dó', emoji: '🔴', frequency: 261.63, waveType: 'sine' }, // C4
  { id: 're', name: 'Ré', emoji: '🟢', frequency: 293.66, waveType: 'sine' }, // D4 - mudado para sine para melhor áudio
  { id: 'mi', name: 'Mi', emoji: '🔵', frequency: 329.63, waveType: 'sine' }, // E4 - mudado para sine para melhor áudio
  { id: 'fa', name: 'Fá', emoji: '🟡', frequency: 349.23, waveType: 'sine' }  // F4 - mudado emoji para amarelo e waveType para sine
]

const encouragingMessages = [
  "Muito bem! 🎵",
  "Excelente! Continue assim! 🌟",
  "Você tem um ótimo ouvido musical! 🎶",
  "Perfeito! Você está indo muito bem! ✨",
  "Fantástico! Sua memória está ótima! 🧠"
]

function MusicalSequence({ onBack }) {
  const [gameSequence, setGameSequence] = useState([])
  const [playerSequence, setPlayerSequence] = useState([])
  const [isPlayingSequence, setIsPlayingSequence] = useState(false)
  const [isPlayerTurn, setIsPlayerTurn] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [selectedDifficulty, setSelectedDifficulty] = useState('EASY') // Nova state para dificuldade
  const [feedback, setFeedback] = useState(null)
  const [playingNote, setPlayingNote] = useState(null)
  const [consecutiveSuccesses, setConsecutiveSuccesses] = useState(0);
  const { playSound, playSuccess, playError, playClick } = useSound();
  const { recordPerformance } = useUser();

  // TTS Hook para conversão de texto em áudio
  const {
    speak,
    speakInstruction,
    speakFeedback,
    speakQuestion,
    autoSpeak,
    stop,
    isTTSEnabled
  } = useTTS();
  const { 
    progress,
    incrementAttempts,
    recordSuccess,
    recordError,
    resetProgress,
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
    getFormattedTime
  } = useProgress('musical-sequence');
  // Gerar nova sequência
  const generateSequence = (length = currentLevel + 1) => {
    const sequence = [];
    let lastNoteIndex = -1
    
    for (let i = 0; i < length; i++) {
      // Evitar repetições consecutivas da mesma nota
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * notes.length);
      } while (randomIndex === lastNoteIndex && notes.length > 1);
      
      lastNoteIndex = randomIndex;
      const randomNote = notes[randomIndex];
      sequence.push(randomNote.id);    }
    return sequence;
  };  // Reproduzir som de uma nota
  const playNote = async (noteId) => {
    setPlayingNote(noteId);
    const note = notes.find(n => n.id === noteId);
    
    if (!note) {
      console.warn(`Nota não encontrada: ${noteId}`);
      setPlayingNote(null);
      return;
    }
    
    try {
      // Para feedback de sucesso/erro, usar useSound
      if (noteId === 'success') {
        playSuccess();
        setTimeout(() => setPlayingNote(null), 500);
        return;
      } else if (noteId === 'error') {
        playError();
        setTimeout(() => setPlayingNote(null), 500);
        return;
      }
      
      // Para notas musicais, usar Web Audio API melhorada
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      
      if (!AudioContext) {
        console.warn('Web Audio API não suportada');
        // Fallback para feedback visual apenas
        setTimeout(() => setPlayingNote(null), 500);
        announceToScreenReader(`Nota ${note.name} selecionada`);
        return;
      }
      
      const audioContext = new AudioContext();
      
      // Garantir que o contexto está ativo
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Criar nós de áudio com configuração otimizada
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      // Conectar os nós
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configurar o oscilador com frequência correta
      oscillator.frequency.setValueAtTime(note.frequency, audioContext.currentTime);
      oscillator.type = 'sine'; // Usar sempre sine para melhor compatibilidade
      
      // Configurar o filtro para suavizar o som
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);
      filterNode.Q.setValueAtTime(0.5, audioContext.currentTime);
      
      // Configurar envelope de volume melhorado
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02); // Attack rápido
      gainNode.gain.setValueAtTime(0.15, now + 0.1); // Sustain
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5); // Release suave
        // Tocar a nota
      oscillator.start(now);
      oscillator.stop(now + 0.5);
      
      // Limpeza otimizada
      setTimeout(() => {
        try {
          if (oscillator && oscillator.disconnect) oscillator.disconnect();
          if (filterNode && filterNode.disconnect) filterNode.disconnect();
          if (gainNode && gainNode.disconnect) gainNode.disconnect();
          if (audioContext && audioContext.state !== 'closed') {
            audioContext.close().catch(e => console.warn('Erro ao fechar AudioContext:', e.message));
          }
        } catch (e) {
          console.warn('Aviso na limpeza do AudioContext:', e.message);
        }
        setPlayingNote(null);
      }, 600);
      
    } catch (error) {
      console.error('Erro ao reproduzir áudio para', note.name, ':', error);
      // Fallback: apenas feedback visual
      setTimeout(() => {
        setPlayingNote(null);
      }, 300);
    }
    
    // Anunciar para leitores de tela
    announceToScreenReader(`Nota ${note.name} reproduzida`);
  };

  // Reproduzir sequência completa
  const playSequence = async () => {
    setIsPlayingSequence(true);
    setIsPlayerTurn(false);
      for (let i = 0; i < gameSequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      await playNote(gameSequence[i]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
      setIsPlayingSequence(false);
    setIsPlayerTurn(true);
    announceToScreenReader("Agora é sua vez! Repita a sequência que você ouviu.");

    // TTS: Anunciar vez do jogador apenas se TTS estiver ativado
    if (isTTSEnabled) {
      speakInstruction("Agora é sua vez! Repita a sequência que você ouviu tocando as notas.");
    }
  };  // Iniciar novo jogo
  const startNewGame = async () => {
    // Iniciar cronometragem da atividade
    await startActivity();

    // Não resetamos o progresso totalmente para manter a pontuação de sessões anteriores
    // Em vez disso, resetamos apenas a sessão atual
    resetSession(); // Usa resetSession em vez de resetProgress para manter a pontuação acumulada

    // Definir nível inicial baseado na dificuldade selecionada
    const initialLevel = getDifficultyLevel(selectedDifficulty);
    const initialSequenceLength = getDifficultySequenceLength(selectedDifficulty);

    setCurrentLevel(initialLevel);
    setConsecutiveSuccesses(0);
    setPlayerSequence([]);
    setGameStarted(true);
    setFeedback(null);
    setIsPlayerTurn(false);
    setIsPlayingSequence(false);

    const newSequence = generateSequence(initialSequenceLength);
    setGameSequence(newSequence);

    // Iniciando novo jogo - pontuação atual registrada
    announceToScreenReader(`Novo jogo iniciado no nível ${getDifficultyName(selectedDifficulty)}! Escute a sequência musical.`);    // TTS: Anunciar início do jogo apenas se TTS estiver ativado
    if (isTTSEnabled) {
      autoSpeak(`Novo jogo de sequência musical iniciado! Dificuldade ${getDifficultyName(selectedDifficulty)}. Escute a sequência musical e repita tocando as notas na ordem correta.`, 1000);
    }
  };
  // Reiniciar jogo atual
  const restartGame = () => {
    setCurrentLevel(1);
    setPlayerSequence([]);    setFeedback(null);
    setIsPlayerTurn(false);
    setIsPlayingSequence(false);
    
    const newSequence = generateSequence(2);
    setGameSequence(newSequence);
    
    announceToScreenReader("Jogo reiniciado! Escute a nova sequência.");
  };

  // Finalizar atividade e salvar dados de timing
  const handleFinishActivity = async () => {
    if (sessionId) {
      await finishActivity();
      announceToScreenReader("Atividade finalizada! Dados de tempo salvos.");
    }
  };

  // Pausar/Retomar atividade
  const handlePauseResume = () => {
    if (isActivityPaused) {
      resumeActivity();
      announceToScreenReader("Atividade retomada.");
    } else {
      pauseActivity();
      announceToScreenReader("Atividade pausada.");
    }
  };
  // Aplicar configurações de acessibilidade
  const applyAccessibilitySettings = () => {
    if (prefersHighContrast()) {
      document.body.classList.add('high-contrast');
    }
    if (prefersReducedMotion()) {
      document.body.classList.add('reduced-motion');
    }
  };

  useEffect(() => {
    applyAccessibilitySettings();
  }, []);  // Funções auxiliares para gerenciar dificuldade
  const getDifficultyLevel = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 1;
      case 'MEDIUM': return 3;
      case 'HARD': return 5;
      default: return 1;
    }
  };

  const getDifficultySequenceLength = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 2;
      case 'MEDIUM': return 3;
      case 'HARD': return 4;
      default: return 2;
    }
  };

  const getDifficultyName = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'Fácil';
      case 'MEDIUM': return 'Médio';
      case 'HARD': return 'Difícil';
      default: return 'Fácil';
    }
  };

  const calculateScore = (level, sequenceLength) => {
    const basePoints = 10;
    const levelBonus = level * 5;
    const sequenceBonus = sequenceLength * 5; // Aumentado para dar mais peso ao comprimento da sequência
    const totalPoints = basePoints + levelBonus + sequenceBonus;

    // Pontuação calculada: base + levelBonus + sequenceBonus = total
    return totalPoints;
  };

  // Lidar com clique do jogador
  const handlePlayerNote = (noteId) => {
    if (!isPlayerTurn || isPlayingSequence) return;
    
    playNote(noteId);
    const newPlayerSequence = [...playerSequence, noteId];
    setPlayerSequence(newPlayerSequence);
      // Verificar se a nota está correta
    const currentIndex = newPlayerSequence.length - 1;
    const isCorrect = gameSequence[currentIndex] === noteId;
      
    if (!isCorrect) {
      // Erro - reiniciar sequência
      recordError(); // Registra o erro sem afetar a pontuação já acumulada
      incrementAttempts();
      vibrateError();      playError();      setConsecutiveSuccesses(0); // Resetar contador de acertos consecutivos
      setFeedback({ type: 'error', message: 'Ops! Tente novamente.' });      // TTS: Anunciar erro apenas se TTS estiver ativado
      if (isTTSEnabled) {
        speakFeedback('Ops! Tente novamente. Escute a sequência mais uma vez.', false);
      }

      // Registrar desempenho para ajuste adaptativo
      const performanceData = {
        correct: 0,
        incorrect: 1,
        responseTimes: [500], // tempo médio de resposta estimado
        level: currentLevel,
        sequenceLength: gameSequence.length,
        errorType: 'wrong_note',
        notePosition: currentIndex
      };
      recordPerformance('musical-sequence', performanceData);
        setTimeout(() => {
        setPlayerSequence([]);
        setFeedback(null);
        playSequence();
      }, 2000);
      return;
    }    // Verificar se completou a sequência
    if (newPlayerSequence.length === gameSequence.length) {
      // Sucesso!
      const bonusPoints = calculateScore(currentLevel, gameSequence.length) - 10; // Subtrair os pontos base (10)
      
      // Registrar o sucesso com os pontos de bônus adicionais
      const updatedScore = recordSuccess(bonusPoints);
      
      vibrateSuccess();
      playSuccess();
        // Contar acertos consecutivos e ajustar dificuldade
      const newConsecutiveSuccesses = consecutiveSuccesses + 1;
      setConsecutiveSuccesses(newConsecutiveSuccesses);
      
      // Registrar desempenho para ajuste adaptativo
      const performanceData = {
        correct: 1,
        incorrect: 0,        responseTimes: [500], // tempo médio de resposta estimado
        level: currentLevel,
        sequenceLength: gameSequence.length,
        consecutiveSuccesses: newConsecutiveSuccesses,
        score: bonusPoints + 10, // Total de pontos desta sequência
        timestamp: new Date().toISOString(),
        activityType: 'musical-sequence'
      };
      
      // Registrar desempenho
      recordPerformance('musical-sequence', performanceData);
        // Mensagem de feedback com base no desempenho
      let feedbackMessage = `Parabéns! Você ganhou ${bonusPoints + 10} pontos!`;
      if (newConsecutiveSuccesses >= 3) {
        feedbackMessage += " Dificuldade aumentada!";
      }
      setFeedback({ type: 'success', message: feedbackMessage });      // TTS: Anunciar sucesso apenas se TTS estiver ativado
      if (isTTSEnabled) {
        speakFeedback(feedbackMessage, true);
      }

      // Próximo nível após delay
      setTimeout(() => {
        let nextLevel = currentLevel + 1;        // Aumentar dificuldade mais rápido após 3 acertos consecutivos
        if (newConsecutiveSuccesses >= 3) {
          nextLevel += 1;
          setConsecutiveSuccesses(0); // Resetar contador
        }
        setCurrentLevel(nextLevel);
        setPlayerSequence([]);
        setFeedback(null);
        
        const nextSequence = generateSequence(Math.min(nextLevel + 1, 6)); // Máximo 6 notas
        setGameSequence(nextSequence);
          announceToScreenReader(`Nível ${nextLevel}! Escute a nova sequência.`);          // TTS: Anunciar novo nível apenas se TTS estiver ativado
          if (isTTSEnabled) {
            autoSpeak(`Nível ${nextLevel}! Escute a nova sequência musical.`, 500);
          }
      }, 2000);
    }
  };

  // Reproduzir sequência quando ela muda
  useEffect(() => {
    if (gameSequence.length > 0 && gameStarted) {
      const timer = setTimeout(() => {
        playSequence();      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameSequence, gameStarted]);    return (
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
          <span>🎵</span>
          <span>Sequência Musical</span>
        </ActivityMainTitle>
        <ActivitySubtitle>
          Desenvolva sua memória auditiva e senso musical
        </ActivitySubtitle>
      </ActivityTitleSection>      {/* Cronômetro da Atividade - invisível, apenas para métricas internas */}
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
          onClick={() => isTTSEnabled && speakInstruction('Escute com atenção a sequência musical.')}
        >
          🎧 Escute com atenção...
        </InstructionText>
      )}

      {gameStarted && isPlayerTurn && (
        <InstructionText
          onClick={() => isTTSEnabled && speakInstruction('Sua vez! Repita a sequência tocando as notas.')}
        >
          🎹 Sua vez! Repita a sequência
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
              <span key={i}>
                {i < progress.stars ? '⭐' : '☆'}
              </span>
            ))}
          </StarDisplay>
        </ProgressDisplay>
      )}

      <SequenceDisplay>
        <AnimatePresence>
          {gameSequence.map((noteId, index) => {
            const note = notes.find(n => n.id === noteId)
            const isCurrentlyPlaying = playingNote === noteId
            
            return (
              <NoteIndicator
                key={`${noteId}-${index}`}
                isActive={isCurrentlyPlaying}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isCurrentlyPlaying ? 1.2 : 1, 
                  opacity: 1 
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {note.emoji}
              </NoteIndicator>
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
      )}      {!gameStarted ? (
        <>
          <InstructionText
            onClick={() => isTTSEnabled && speakInstruction('Escute a sequência musical e repita tocando as notas na ordem correta! Escolha a dificuldade para começar.')}
          >
            🎵 Escute a sequência musical e repita tocando as notas na ordem correta!<br/>
            Escolha a dificuldade para começar.
          </InstructionText>

          <DifficultySelector>
            {[
              {
                id: 'EASY',
                name: '🟢 Fácil',
                description: 'Sequências de 2 notas',
                icon: '😊'
              },
              {
                id: 'MEDIUM',
                name: '🟡 Médio',
                description: 'Sequências de 3 notas',
                icon: '🤔'
              },
              {
                id: 'HARD',
                name: '🔴 Difícil',
                description: 'Sequências de 4 notas',
                icon: '🧠'
              }
            ].map((diff) => (
              <DifficultyButton
                key={diff.id}
                isActive={selectedDifficulty === diff.id}
                onClick={() => {
                  setSelectedDifficulty(diff.id);
                  playClick();
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
              🎵 Começar Jogo Musical
            </ActionButton>
          </ControlButtons>
        </>
      ) : (
        <>
          <ButtonsContainer>            <DoButton
              onClick={() => handlePlayerNote('do')}
              disabled={!isPlayerTurn}
              whileHover={isPlayerTurn ? { scale: 1.05 } : {}}
              whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
              animate={playingNote === 'do' ? { 
                scale: [1, 1.1, 1], 
                boxShadow: [
                  '0 4px 8px rgba(233, 30, 99, 0.3)',
                  '0 8px 16px rgba(233, 30, 99, 0.6)',
                  '0 4px 8px rgba(233, 30, 99, 0.3)'
                ]
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <span>🔴</span>
              <span>Dó</span>
            </DoButton>
            
            <ReButton
              onClick={() => handlePlayerNote('re')}
              disabled={!isPlayerTurn}
              whileHover={isPlayerTurn ? { scale: 1.05 } : {}}
              whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
              animate={playingNote === 're' ? { 
                scale: [1, 1.1, 1], 
                boxShadow: [
                  '0 4px 8px rgba(126, 211, 33, 0.3)',
                  '0 8px 16px rgba(126, 211, 33, 0.6)',
                  '0 4px 8px rgba(126, 211, 33, 0.3)'
                ]
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <span>🟢</span>
              <span>Ré</span>
            </ReButton>
            
            <MiButton
              onClick={() => handlePlayerNote('mi')}
              disabled={!isPlayerTurn}
              whileHover={isPlayerTurn ? { scale: 1.05 } : {}}
              whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
              animate={playingNote === 'mi' ? { 
                scale: [1, 1.1, 1], 
                boxShadow: [
                  '0 4px 8px rgba(74, 144, 226, 0.3)',
                  '0 8px 16px rgba(74, 144, 226, 0.6)',
                  '0 4px 8px rgba(74, 144, 226, 0.3)'
                ]
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <span>🔵</span>
              <span>Mi</span>
            </MiButton>
              <FaButton
              onClick={() => handlePlayerNote('fa')}
              disabled={!isPlayerTurn}
              whileHover={isPlayerTurn ? { scale: 1.05 } : {}}
              whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
              animate={playingNote === 'fa' ? { 
                scale: [1, 1.1, 1], 
                boxShadow: [
                  '0 4px 8px rgba(245, 166, 35, 0.3)',
                  '0 8px 16px rgba(245, 166, 35, 0.6)',
                  '0 4px 8px rgba(245, 166, 35, 0.3)'
                ]
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <span>🟡</span>
              <span>Fá</span>
            </FaButton>
          </ButtonsContainer>          <ActionButtonsContainer>
            <ActionButton
              onClick={playSequence}
              disabled={isPlayingSequence || !gameStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Ouvir Novamente
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
      )}      <AnimatePresence>
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

export default MusicalSequence
