      import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import useSound from '../../hooks/useSound'
import useProgress from '../../hooks/useProgress'
import useUser from '../../hooks/useUser'
import useTTS from '../../hooks/useTTS'
import ActivityTimer from '../common/ActivityTimer'
import { announceToScreenReader, vibrateSuccess, vibrateError, prefersHighContrast, prefersReducedMotion } from '../../utils/accessibility'
import { createAdaptiveModel, getAdaptiveParameters } from '../../utils/adaptiveML'
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
  ActionButton
} from '../../styles/activityCommon'

// Definição de cores temáticas para esta atividade
const THEME_COLOR = 'var(--primary-green)';
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-green), var(--primary-blue))';

// Estilos específicos para LetterRecognition com as cores temáticas
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
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
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

// Dados das letras com palavras e emojis associados - EXPANDIDO para +15 perguntas únicas
const letterData = {
  A: { 
    words: ['AVIÃO', 'ÁRVORE', 'ABELHA', 'ÁGUA', 'AMIGO', 'ARCO-ÍRIS'], 
    emojis: ['✈️', '🌳', '🐝', '💧', '👫', '🌈'] 
  },
  B: { 
    words: ['BOLA', 'BANANA', 'BORBOLETA', 'BEBÊ', 'BICICLETA', 'BALÃO'], 
    emojis: ['⚽', '🍌', '🦋', '👶', '🚲', '🎈'] 
  },
  C: { 
    words: ['CASA', 'CACHORRO', 'CORAÇÃO', 'CARRO', 'COROA', 'CHOCOLATE'], 
    emojis: ['🏠', '🐕', '❤️', '🚗', '👑', '🍫'] 
  },
  D: { 
    words: ['DADO', 'DINOSSAURO', 'DOCE', 'DENTE', 'DRAGÃO', 'DIAMANTE'], 
    emojis: ['🎲', '🦕', '🍭', '🦷', '🐉', '💎'] 
  },
  E: { 
    words: ['ELEFANTE', 'ESTRELA', 'ESCADA', 'ESPELHO', 'ESCOLA', 'ENVELOPE'], 
    emojis: ['🐘', '⭐', '🪜', '🪞', '🏫', '✉️'] 
  },
  F: { 
    words: ['FLOR', 'FOGO', 'FESTA', 'FACA', 'FUTEBOL', 'FANTASMA'], 
    emojis: ['🌸', '🔥', '🎉', '🔪', '⚽', '👻'] 
  },
  G: { 
    words: ['GATO', 'GUITARRA', 'GIRASSOL', 'GALINHA', 'GELADO', 'GLOBO'], 
    emojis: ['🐱', '🎸', '🌻', '🐔', '🧊', '🌍'] 
  },
  H: { 
    words: ['HIPOPÓTAMO', 'HAMBÚRGUER', 'HELICÓPTERO', 'HOSPITAL', 'HORAS', 'HARPA'], 
    emojis: ['🦛', '🍔', '🚁', '🏥', '⏰', '🎵'] 
  },
  I: { 
    words: ['IGREJA', 'ILHA', 'ÍNDIO', 'ÍMÃE', 'IGUANA', 'INVERNO'], 
    emojis: ['⛪', '🏝️', '🪶', '🧲', '🦎', '❄️'] 
  },
  J: { 
    words: ['JACARÉ', 'JOANINHA', 'JARDIM', 'JARRO', 'JOIA', 'JANELA'], 
    emojis: ['🐊', '🐞', '🌺', '🏺', '💍', '🪟'] 
  },
  K: { 
    words: ['KIWI', 'KARATÊ', 'KOALA'], 
    emojis: ['🥝', '🥋', '🐨'] 
  },
  L: { 
    words: ['LEÃO', 'LUA', 'LIVRO', 'LÂMPADA', 'LAGARTA', 'LIMÃO'], 
    emojis: ['🦁', '🌙', '📚', '💡', '🐛', '🍋'] 
  },
  M: { 
    words: ['MACACO', 'MAÇÃ', 'MÚSICA', 'MÃOE', 'MEDALHA', 'MONSTRO'], 
    emojis: ['🐵', '🍎', '🎵', '🤲', '🏅', '👹'] 
  },
  N: { 
    words: ['NAVIO', 'NUVEM', 'NATUREZA', 'NINHO', 'NARIZ', 'NOTEBOOK'], 
    emojis: ['🚢', '☁️', '🌿', '🪺', '👃', '💻'] 
  },
  O: { 
    words: ['OLHO', 'OVO', 'OVELHA', 'ÓCULOS', 'OURO', 'ONDA'], 
    emojis: ['👁️', '🥚', '🐑', '👓', '🏆', '🌊'] 
  },
  P: { 
    words: ['PATO', 'PIZZA', 'PRESENTE', 'PALHAÇO', 'PLANETA', 'PEIXE'], 
    emojis: ['🦆', '🍕', '🎁', '🤡', '🪐', '🐟'] 
  },
  Q: { 
    words: ['QUEIJO', 'QUENTE', 'QUADRADO'], 
    emojis: ['🧀', '🔥', '⬜'] 
  },
  R: { 
    words: ['RATO', 'ROSA', 'RELÓGIO', 'ROBÔ', 'RAINHA', 'RAIO'], 
    emojis: ['🐭', '🌹', '⏰', '🤖', '👸', '⚡'] 
  },
  S: { 
    words: ['SOL', 'SAPATO', 'SORRISO', 'SAPO', 'SERPENTE', 'SINO'], 
    emojis: ['☀️', '👟', '😊', '🐸', '🐍', '🔔'] 
  },
  T: { 
    words: ['TIGRE', 'TARTARUGA', 'TELEFONE', 'TESOURA', 'TREM', 'TOMATE'], 
    emojis: ['🐅', '🐢', '📞', '✂️', '🚂', '🍅'] 
  },
  U: { 
    words: ['UVA', 'URSO', 'UNICÓRNIO'], 
    emojis: ['🍇', '🐻', '🦄'] 
  },
  V: { 
    words: ['VACA', 'VIOLÃO', 'VENTILADOR', 'VULCÃO', 'VELA', 'VAMPIRO'], 
    emojis: ['🐄', '🎻', '💨', '🌋', '🕯️', '🧛'] 
  },
  W: { 
    words: ['WIFI', 'WEB'], 
    emojis: ['📶', '🌐'] 
  },
  X: { 
    words: ['XÍCARA', 'XADREZ'], 
    emojis: ['☕', '♟️'] 
  },
  Y: { 
    words: ['YOGA', 'YETI'], 
    emojis: ['🧘', '🦣'] 
  },
  Z: { 
    words: ['ZEBRA', 'ZERO', 'ZANGADO', 'ZÍPER', 'ZUMBI'], 
    emojis: ['🦓', '0️⃣', '😠', '🤐', '🧟'] 
  }
}

const difficulties = [
  { 
    id: 'EASY', 
    name: 'Fácil', 
    letters: ['A', 'E', 'I', 'O', 'U'] // Todas as vogais
  },
  { 
    id: 'MEDIUM', 
    name: 'Médio', 
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T'] // Letras mais comuns
  },
  { 
    id: 'HARD', 
    name: 'Difícil', 
    letters: Object.keys(letterData) // Todas as letras do alfabeto
  }
]

// Validar consistência dos dados do jogo e corrigir problemas
const validateGameData = () => {
  const allLetters = new Set(Object.keys(letterData));
  
  // Verificar se todas as letras nas dificuldades existem nos dados
  for (const diff of difficulties) {
    const missingLetters = diff.letters.filter(letter => !allLetters.has(letter));
    if (missingLetters.length > 0) {
      // Corrigir: remover letras sem dados
      diff.letters = diff.letters.filter(letter => allLetters.has(letter));
    }
  }
  
  // Validar se cada letra tem dados completos
  for (const letter of allLetters) {
    const data = letterData[letter];
    if (!data.words || data.words.length === 0) {
      console.error(`Letra ${letter} não possui palavras definidas`);
    }
    if (!data.emojis || data.emojis.length === 0) {
      data.emojis = ['📝', '📝', '📝'].slice(0, data.words?.length || 1);
    }
    if (data.emojis?.length < data.words?.length) {
      data.emojis = [
        ...data.emojis, 
        ...Array(data.words.length - data.emojis.length).fill('📝')
      ];
    }
  }
}

// Validar dados ao inicializar
validateGameData();

const encouragingMessages = [
  "Muito bem! Você conhece suas letras! 📚",
  "Excelente! Continue lendo! 🌟",
  "Perfeito! Você está aprendendo muito! ✨",
  "Fantástico! Suas habilidades de leitura são ótimas! 🎓",
  "Incrível! Continue praticando! 💪"
]

function LetterRecognition({ onBack }) {  const [currentLetter, setCurrentLetter] = useState(null);
  const [options, setOptions] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('EASY');
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [gameMode, setGameMode] = useState('word'); // 'word' ou 'letter'
  const [startTime, setStartTime] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [adaptiveModel, setAdaptiveModel] = useState(null);
  const [adaptiveParams, setAdaptiveParams] = useState(null);
    // ✨ NOVO: Estados para controle de rotação de perguntas
  const [usedQuestions, setUsedQuestions] = useState(new Set())
  const [questionHistory, setQuestionHistory] = useState([])
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0)
  
  const { playSound, playClick, playSuccess, playError } = useSound();
  const {
    speak,
    speakInstruction,
    speakFeedback,
    speakQuestion,
    speakLetter,
    speakWord,
    autoSpeak,
    stop
  } = useTTS();

  const {
    progress,
    saveProgress,
    incrementAttempts,
    incrementSuccesses,
    completeActivity,
    updateScore,
    updateLevel,
    recordSuccess,
    recordError,
    resetProgress,
    // Sistema de timing avançado
    startActivity,
    pauseActivity,
    resumeActivity,
    finishActivity,
    getCurrentTimeMetrics,
    sessionId,
    isActivityActive,
    isActivityPaused,
    getFormattedTime  } = useProgress('letter-recognition');

  const { userId } = useUser();

  // Funções de controle de timing
  const handlePauseResume = () => {
    if (isActivityPaused) {
      resumeActivity()
    } else {
      pauseActivity()
    }
  }

  const handleFinishActivity = () => {
    finishActivity(true) // true indica atividade completada com sucesso
  }

  // Aplicar configurações de acessibilidade
  const applyAccessibilitySettings = () => {
    if (prefersHighContrast()) {
      document.body.classList.add('high-contrast')
    }
    if (prefersReducedMotion()) {
      document.body.classList.add('reduced-motion')
    }  }
  
  useEffect(() => {
    applyAccessibilitySettings();
      // Inicializar modelo adaptativo com fallback
    const initAdaptive = async () => {
      try {
        const model = createAdaptiveModel('letter-recognition', userId);
        setAdaptiveModel(model);
        
        // Obter parâmetros adaptados com fallback
        let params;
        try {
          params = await getAdaptiveParameters('letter-recognition', difficulty);
        } catch (error) {
          console.warn('Falha ao obter parâmetros adaptativos, usando padrões:', error);
          params = {
            difficulty,
            parameters: {
              focusLetters: difficulties.find(d => d.id === difficulty)?.letters || []
            }          }        }
        // Parâmetros adaptativos obtidos silenciosamente
        setAdaptiveParams(params);
        
        if (params && params.difficulty !== difficulty) {
          setDifficulty(params.difficulty);
        }
      } catch (error) {
        console.error('Erro ao inicializar modelo adaptativo:', error);
      }
    }
    
    initAdaptive();
  }, [difficulty]);
  // Reproduzir som da letra usando TTS hook
  const speakLetterCustom = (letter) => {
    if (!letter) {
      console.warn('Tentativa de falar letra nula ou indefinida');
      return;
    }

    try {
      speakLetter(letter);
      announceToScreenReader(`Letra ${letter}`);
    } catch (error) {
      console.error('Erro ao sintetizar voz da letra:', error);
    }
  }

  // Reproduzir palavra usando TTS hook
  const speakWordCustom = (word) => {
    if (!word) {
      console.warn('Tentativa de falar palavra nula ou indefinida');
      return;
    }

    try {
      speakWord(word);
      announceToScreenReader(`Palavra ${word}`);
    } catch (error) {
      console.error('Erro ao sintetizar voz da palavra:', error);
    }
  }
  
  // Gerar nova rodada
  const generateNewRound = () => {
    try {      // CORREÇÃO: Validar dificuldade antes de usar
      const difficultyData = difficulties.find(d => d.id === difficulty);
      if (!difficultyData || !difficultyData.letters || difficultyData.letters.length === 0) {
        console.warn(`Dificuldade "${difficulty}" não encontrada, usando "EASY" como fallback`);
        setDifficulty('EASY');
        // Usar dificuldade fácil como fallback
        const easyData = difficulties.find(d => d.id === 'EASY');
        if (!easyData) {
          console.error('Falha crítica: dificuldade "EASY" não encontrada');
          return;
        }
        var availableLetters = easyData.letters;
      } else {
        var availableLetters = difficultyData.letters;
      }
      
      // Filtrar apenas letras que têm dados válidos
      availableLetters = availableLetters.filter(letter => 
        letterData[letter] && 
        letterData[letter].words && 
        letterData[letter].words.length > 0
      );
      
      if (availableLetters.length === 0) {
        console.error('Nenhuma letra válida encontrada para a dificuldade');
        // Usar letras básicas como último recurso
        availableLetters = ['A', 'B', 'C'].filter(letter => letterData[letter]);
      }
      
      // Usar recomendações do modelo adaptativo para personalizar a dificuldade
      if (adaptiveParams?.parameters?.focusLetters) {
        const focusLetters = adaptiveParams.parameters.focusLetters.filter(letter => 
          letterData[letter] && availableLetters.includes(letter)
        );
        if (focusLetters.length > 0) {
          availableLetters = [...new Set([...focusLetters, ...availableLetters])].slice(0, availableLetters.length);
        }
      }
        // ✨ NOVO: Gerar pergunta única usando sistema de rotação
      const questionData = generateUniqueQuestion(availableLetters);
      const { targetLetter, wordIndex, questionKey, word, emoji } = questionData;
      
      // Marcar pergunta como usada
      setUsedQuestions(prev => new Set([...prev, questionKey]));
      setQuestionHistory(prev => [...prev, questionKey]);
      setTotalQuestionsAnswered(prev => prev + 1);
      
      console.log(`🎯 Nova pergunta única: ${targetLetter} - ${word} (${totalQuestionsAnswered + 1}ª pergunta)`);
      
      if (gameMode === 'word') {
        setCurrentLetter(targetLetter);
      } else {
        setCurrentLetter({ word, letter: targetLetter });
      }
      
      // Resetar contadores
      setMoveCount(0);
      setStartTime(Date.now());
      
      // Gerar opções usando dados da pergunta única
      const correctData = letterData[targetLetter];
      const correctIndex = wordIndex; // Usar índice específico da pergunta única
      
      if (gameMode === 'word') {
        // Modo: mostrar letra, escolher palavra correta
        const correctWord = correctData.words[correctIndex];
        const correctEmoji = correctData.emojis[correctIndex] || '📝';
        
        // Gerar palavras incorretas de outras letras
        const incorrectOptions = [];
        const otherLetters = availableLetters.filter(l => l !== targetLetter);
        
        while (incorrectOptions.length < 3 && otherLetters.length > 0) {
          const randomLetter = otherLetters[Math.floor(Math.random() * otherLetters.length)];
          const randomData = letterData[randomLetter];
          
          if (randomData && randomData.words && randomData.words.length > 0) {
            const randomIndex = Math.floor(Math.random() * randomData.words.length);
            const option = {
              letter: randomLetter,
              word: randomData.words[randomIndex],
              emoji: randomData.emojis ? randomData.emojis[randomIndex] || '📝' : '📝',
              isCorrect: false
            }
            
            if (!incorrectOptions.some(opt => opt.word === option.word)) {
              incorrectOptions.push(option);
            }
          }
          
          // Remover letra usada para evitar repetição
          const index = otherLetters.indexOf(randomLetter);
          if (index > -1) otherLetters.splice(index, 1);
        }
        
        // Se não conseguiu gerar opções suficientes, usar palavras padrão
        while (incorrectOptions.length < 3) {
          const fallbackWords = [
            { letter: 'A', word: 'AVIÃO', emoji: '✈️' },
            { letter: 'B', word: 'BOLA', emoji: '⚽' },
            { letter: 'C', word: 'CASA', emoji: '🏠' }
          ].filter(opt => opt.letter !== targetLetter);
          
          for (const opt of fallbackWords) {
            if (incorrectOptions.length < 3 && !incorrectOptions.some(existing => existing.word === opt.word)) {
              incorrectOptions.push({ ...opt, isCorrect: false });
            }
          }
          break; // Evitar loop infinito
        }
        
        // Adicionar opção correta
        const allOptions = [
          ...incorrectOptions,
          {
            letter: targetLetter,
            word: correctWord,
            emoji: correctEmoji,
            isCorrect: true
          }
        ];
        
        // Embaralhar opções
        setOptions(allOptions.sort(() => Math.random() - 0.5));
        
      } else {
        // Modo: mostrar palavra, escolher letra correta
        const correctWord = correctData.words[correctIndex];
        setCurrentLetter({ word: correctWord, letter: targetLetter });
        
        // Gerar letras incorretas
        const incorrectLetters = [];
        const otherLetters = availableLetters.filter(l => l !== targetLetter);
        
        while (incorrectLetters.length < 3 && otherLetters.length > 0) {
          const randomLetter = otherLetters[Math.floor(Math.random() * otherLetters.length)];
          if (!incorrectLetters.includes(randomLetter)) {
            incorrectLetters.push(randomLetter);
          }
          // Remover letra para evitar repetição
          const index = otherLetters.indexOf(randomLetter);
          if (index > -1) otherLetters.splice(index, 1);
        }
        
        // Se não conseguiu gerar letras suficientes, usar letras padrão
        while (incorrectLetters.length < 3) {
          const fallbackLetters = ['A', 'B', 'C', 'D', 'E'].filter(l => 
            l !== targetLetter && !incorrectLetters.includes(l)
          );
          if (fallbackLetters.length > 0) {
            incorrectLetters.push(fallbackLetters[0]);
          } else {
            break; // Evitar loop infinito
          }
        }
        
        // Criar opções de letras
        const allOptions = [
          ...incorrectLetters.map(letter => ({ letter, isCorrect: false })),
          { letter: targetLetter, isCorrect: true }
        ];
        
        setOptions(allOptions.sort(() => Math.random() - 0.5));
      }
      
      setSelectedOption(null);
      setFeedback(null);
      
    } catch (error) {
      console.error('Erro ao gerar nova rodada:', error);
      // Em caso de erro, definir um estado mínimo funcional
      setCurrentLetter('A');
      setOptions([
        { letter: 'A', word: 'AVIÃO', emoji: '✈️', isCorrect: true },
        { letter: 'B', word: 'BOLA', emoji: '⚽', isCorrect: false },
        { letter: 'C', word: 'CASA', emoji: '🏠', isCorrect: false }
      ]);
    }
  }  // ✨ NOVA: Função para gerar pergunta única com rotação inteligente - CORRIGIDA
  const generateUniqueQuestion = (availableLetters) => {
    const maxAttempts = 50; // Evitar loop infinito
    let attempts = 0;
    
    // Verificar se temos letras disponíveis
    if (!availableLetters || availableLetters.length === 0) {
      console.error('Não há letras disponíveis para gerar perguntas');
      // Usar letras básicas como fallback
      availableLetters = ['A', 'B', 'C', 'D', 'E'];
    }
    
    while (attempts < maxAttempts) {
      // Escolher letra aleatória com verificação de segurança
      const randomIndex = Math.floor(Math.random() * availableLetters.length);
      const targetLetter = availableLetters[randomIndex] || 'A'; // Fallback para 'A' se undefined
      const letterDataForTarget = letterData[targetLetter];
      
      // Verificar se temos dados para esta letra
      if (!letterDataForTarget || !letterDataForTarget.words || !letterDataForTarget.words.length) {
        console.warn(`Dados ausentes para a letra ${targetLetter}, tentando outra letra`);
        attempts++;
        continue;
      }
      
      // Verificar todas as palavras desta letra para encontrar uma não usada
      for (let i = 0; i < letterDataForTarget.words.length; i++) {
        const questionKey = `${targetLetter}-${i}-${gameMode}`;
        
        if (!usedQuestions || !usedQuestions.has(questionKey)) {
          // Garantir que emoji exista e seja válido
          const word = letterDataForTarget.words[i];
          const emoji = letterDataForTarget.emojis && i < letterDataForTarget.emojis.length 
                      ? letterDataForTarget.emojis[i] 
                      : '📝';
          
          return {
            targetLetter,
            wordIndex: i,
            questionKey,
            word: word || targetLetter, // Fallback para letra se palavra for undefined
            emoji: emoji
          };
        }
      }
      
      attempts++;
    }
    
    // Se chegou aqui, todas as perguntas foram usadas - resetar histórico
    console.log('🔄 Todas as perguntas foram usadas! Resetando para novas rodadas...');
    try {
      setUsedQuestions(new Set());
      setQuestionHistory([]);
    } catch (error) {
      console.error('Erro ao resetar histórico de perguntas:', error);
    }
    
    // Gerar pergunta após reset com verificações de segurança
    const safeIndex = Math.floor(Math.random() * availableLetters.length);
    const targetLetter = availableLetters[safeIndex] || 'A';
    const letterDataForTarget = letterData[targetLetter] || letterData['A'];
    
    // Verificar se temos palavras disponíveis
    if (!letterDataForTarget.words || !letterDataForTarget.words.length) {
      // Criar dados de fallback
      return {
        targetLetter,
        wordIndex: 0,
        questionKey: `${targetLetter}-0-${gameMode}`,
        word: targetLetter === 'A' ? 'AVE' : targetLetter + 'ALA',
        emoji: '📝'
      };
    }
    
    const wordIndex = Math.floor(Math.random() * letterDataForTarget.words.length);
    
    return {
      targetLetter,
      wordIndex,
      questionKey: `${targetLetter}-${wordIndex}-${gameMode}`,
      word: letterDataForTarget.words[wordIndex] || targetLetter,
      emoji: letterDataForTarget.emojis && wordIndex < letterDataForTarget.emojis.length
           ? letterDataForTarget.emojis[wordIndex] 
           : '📝'
    };
  };
  // Lidar com seleção de opção
  const handleOptionSelect = (option) => {
    if (!option) {
      console.error('Opção selecionada é nula ou indefinida');
      return;
    }
    
    if (selectedOption) return // Evitar cliques múltiplos
    
    try {
      setSelectedOption(option)
      incrementAttempts() // Sempre incrementar tentativas
      setMoveCount(prev => prev + 1)
        if (option.isCorrect) {
        incrementSuccesses()
        
        // Calcular pontuação baseada na dificuldade e tempo de resposta
        const difficultyBonus = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15
        const timeBonus = Math.max(0, 10 - Math.floor((Date.now() - startTime) / 1000))
        const additionalPoints = difficultyBonus + timeBonus
          // recordSuccess já adiciona 10 pontos base + bônus adicional
        const totalScore = recordSuccess(additionalPoints)
        
        console.log(`Pontuação atualizada: ${totalScore} (10 base + ${additionalPoints} bônus)`)
        
        vibrateSuccess()
        playSuccess()
          // Salvar dados para o modelo adaptativo
        if (adaptiveModel) {
          const gameData = {
            difficulty,
            letter: typeof currentLetter === 'string' ? currentLetter : currentLetter.letter,
            timeSpent: Math.floor((Date.now() - startTime) / 1000),
            moveCount,
            accuracy: 100,
            score: 10 + additionalPoints, // Score total desta rodada
            gameMode
          }
        
        // Obter recomendação para próxima rodada
        const recommendation = adaptiveModel.saveGameData(gameData)
        if (recommendation && recommendation !== difficulty) {
          setDifficulty(recommendation)
        }
      }
          // Mensagem de feedback positivo com pontuação
        const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
        setFeedback({
          type: 'success',
          message: `${message} +${10 + additionalPoints} pontos!`
        })

        // TTS: Anunciar sucesso
        speakFeedback(`${message} Ganhou ${10 + additionalPoints} pontos!`, true)
        // Salvar progresso geral
      saveProgress()
      
      // Transição automática após acerto (3 segundos)
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
        generateNewRound();
      }, 3000)
    } else {
      recordError()
      vibrateError()
      playError()
      
      // Salvar dados para o modelo adaptativo mesmo em caso de erro
      if (adaptiveModel) {
        const gameData = {
          difficulty,
          letter: typeof currentLetter === 'string' ? currentLetter : currentLetter.letter,
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
          moveCount,
          accuracy: 0,
          score: 0,
          gameMode
        }
        adaptiveModel.saveGameData(gameData)
      }
      
      setFeedback({
        type: 'error',
        message: 'Tente novamente! Pense na primeira letra da palavra. 🤔'
      })

      // TTS: Anunciar erro
      speakFeedback('Tente novamente! Pense na primeira letra da palavra.', false)      // Resetar após delay
      setTimeout(() => {
        setSelectedOption(null)
        setFeedback(null)
      }, 2000)
    }
    } catch (error) {
      console.error('Erro ao processar seleção de opção:', error);
      // Feedback de erro para o usuário em caso de falha
      setFeedback({
        type: 'error',
        message: 'Ocorreu um erro. Tente novamente!'
      });
      setTimeout(() => {
        setSelectedOption(null)
        setFeedback(null)      }, 2000);
    }
  }
  
  // Iniciar jogo
  const startGame = async () => {
    console.log('🎮 Iniciando jogo de reconhecimento de letras...');
    
    // ✅ CORREÇÃO: Iniciar cronometragem da atividade ANTES de resetar
    await startActivity();
    
    // Resetar apenas a sessão, não o progresso total
    setUsedQuestions(new Set());
    setQuestionHistory([]);
    setTotalQuestionsAnswered(0);
    
    // Garantir que o modelo adaptativo está inicializado
    if (!adaptiveModel || !adaptiveParams) {      console.log('🤖 Inicializando modelo adaptativo...');
      try {
        const model = createAdaptiveModel('letter-recognition', userId);
        setAdaptiveModel(model);
        
        // Obter parâmetros adaptados com fallback
        let params;
        try {
          params = await getAdaptiveParameters('letter-recognition', difficulty);
          console.log('⚙️ Parâmetros adaptativos obtidos:', params);
          setAdaptiveParams(params);
          
          if (params && params.difficulty !== difficulty) {
            setDifficulty(params.difficulty);
          }
        } catch (error) {
          console.warn('⚠️ Falha ao obter parâmetros adaptativos, usando padrões:', error);
          params = {
            difficulty,
            parameters: {
              focusLetters: difficulties.find(d => d.id === difficulty)?.letters || []
            }
          };
          setAdaptiveParams(params);
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar modelo adaptativo:', error);
      }
    }
    
    setGameStarted(true);
    setFeedback(null);
    setSelectedOption(null);
    setStartTime(Date.now());
      console.log('📊 Progresso inicial:', progress);
    
    generateNewRound();
    announceToScreenReader("Jogo de reconhecimento de letras iniciado!");

    // TTS: Anunciar início do jogo
    autoSpeak("Jogo de reconhecimento de letras iniciado! Vamos aprender o alfabeto!", 1000);
  }

  // Alternar modo de jogo
  const toggleGameMode = () => {
    try {
      const newMode = gameMode === 'word' ? 'letter' : 'word';
      setGameMode(newMode);
      
      // Limpar estado atual
      setSelectedOption(null);
      setFeedback(null);
      
      // Regenerar o jogo para o novo modo
      if (gameStarted && currentLetter) {
        // Pequeno delay para garantir que o estado foi atualizado
        setTimeout(() => {
          generateNewRound();
        }, 100);
      }
      
      // Anunciar mudança para acessibilidade
      announceToScreenReader(`Modo alterado para: ${newMode === 'word' ? 'Reconhecer palavras' : 'Reconhecer letras'}`);

      // TTS: Anunciar mudança de modo
      speakInstruction(`Modo alterado para ${newMode === 'word' ? 'reconhecer palavras' : 'reconhecer letras'}.`);    } catch (error) {
      console.error('Erro ao alternar modo de jogo:', error);
    }
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
          <span>🔤</span>
          <span>Reconhecimento de Letras</span>
        </ActivityMainTitle>
        <ActivitySubtitle>
          {!gameStarted ? 
            "Vamos aprender as letras do alfabeto" :
            `Modo: ${gameMode === 'word' ? 'Palavra' : 'Letra'} - ${progress.score || 0} pontos`
          }
        </ActivitySubtitle>
      </ActivityTitleSection>

      <InstructionText
        onClick={() => {
          if (!gameStarted) {
            speakInstruction("Vamos aprender as letras! Escolha a dificuldade para começar.")
          } else if (gameMode === 'word') {
            speakInstruction("Qual palavra começa com esta letra?")
          } else {
            speakInstruction("Com qual letra esta palavra começa?")
          }
        }}
      >
        {!gameStarted ? (
          "📚 Vamos aprender as letras! Escolha a dificuldade para começar."
        ) : gameMode === 'word' ? (
          "Qual palavra começa com esta letra?"
        ) : (
          "Com qual letra esta palavra começa?"
        )}
      </InstructionText>

      {!gameStarted ? (
        <>
          <DifficultySelector>
            {[
              {
                id: 'easy',
                name: '🟢 Fácil',
                description: '2 letras básicas',
                icon: '😊'
              },
              {
                id: 'medium',
                name: '🟡 Médio',
                description: '3 letras variadas',
                icon: '😐'
              },
              {
                id: 'hard',
                name: '🔴 Difícil',
                description: '4 letras complexas',
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
                  speak(`Dificuldade ${diff.name} selecionada. ${diff.description}`);
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
                autoSpeak("Começando jogo de reconhecimento de letras!");
                startGame();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              themeColor={THEME_COLOR}
            >
              🔤🎵 Começar a Aprender
            </ActionButton>
          </ControlButtons>
        </>
      ) : (
        <ControlButtons>
          <ActionButton
            className="secondary"
            onClick={toggleGameMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Trocar Modo: {gameMode === 'word' ? 'Palavra→Letra' : 'Letra→Palavra'}
          </ActionButton>
            <ActionButton
            className={isTTSEnabled ? "audio" : "audio disabled"}
            onClick={() => {
              try {
                if (!isTTSEnabled) {
                  // Mostrar mensagem informando que o TTS está desabilitado
                  setFeedback({
                    type: 'info',
                    message: 'Conversão de texto para voz está desativada nas configurações de acessibilidade'
                  });
                  setTimeout(() => setFeedback(null), 3000);
                  return;
                }
                
                if (gameMode === 'word') {
                  const letterToSpeak = typeof currentLetter === 'string' ? currentLetter : 
                                       (currentLetter && currentLetter.letter) ? currentLetter.letter : null;
                  if (letterToSpeak) {
                    speakLetter(letterToSpeak);
                  }
                } else if (currentLetter && typeof currentLetter === 'object') {
                  if (currentLetter.word) {
                    speakWord(currentLetter.word);
                  }
                }
              } catch (error) {
                console.error('Erro ao tentar reproduzir áudio:', error);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!currentLetter}
            title={isTTSEnabled ? "Ouvir novamente" : "Texto para voz desativado nas configurações"}
          >
            {isTTSEnabled ? "🔊 Ouvir Novamente" : "🔇 Áudio Desativado"}
          </ActionButton>
        </ControlButtons>
      )}      {gameStarted && (        
        <ProgressDisplay>
          <span>Pontos: {progress.score}</span>
          <span>•</span>
          <span>Precisão: {progress.accuracy}%</span>
          <span>•</span>
          <span>📝 Perguntas: {totalQuestionsAnswered}</span>
          <span>•</span>
          <StarDisplay>
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i}>
                {i < progress.stars ? '⭐' : '☆'}
              </span>
            ))}
          </StarDisplay>        
        </ProgressDisplay>
      )}{/* Timer da atividade - invisível, apenas para métricas internas */}
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
      
      {gameStarted && currentLetter && (
        <TargetLetterDisplay
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}          onClick={() => {
            try {
              if (gameMode === 'word') {
                const letterToSpeak = typeof currentLetter === 'string' ? currentLetter : 
                                     (currentLetter && currentLetter.letter) ? currentLetter.letter : 'A';
                // Reproduzindo letra usando TTS hook
                speakLetterCustom(letterToSpeak);
              } else {
                const wordToSpeak = typeof currentLetter === 'object' && currentLetter.word ? currentLetter.word : '';
                // Reproduzindo palavra usando TTS hook
                speakWordCustom(wordToSpeak);
              }
            } catch (error) {
              console.error('Erro ao falar letra/palavra:', error);
            }
          }}
        >
          {gameMode === 'word' ? (
            // Modo letra: mostrar a letra
            <div className="target-display">
              {typeof currentLetter === 'string' ? currentLetter : 
               (currentLetter && currentLetter.letter) ? currentLetter.letter : '?'}
            </div>
          ) : (
            // Modo palavra: mostrar a palavra
            <div className="target-display">
              {typeof currentLetter === 'object' && currentLetter.word ? currentLetter.word : '?'}
            </div>
          )}
          <LetterInfo>
            {gameMode === 'word' ? 'Clique para ouvir a letra' : 'Clique para ouvir a palavra'}
          </LetterInfo>        </TargetLetterDisplay>
      )}

      {gameStarted && options.length > 0 && (
        <OptionsGrid>
          {options.map((option, index) => (
            <LetterOption
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={
                selectedOption === option 
                  ? option.isCorrect ? 'correct' : 'incorrect'
                  : ''
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {gameMode === 'word' ? (
                <>
                  <OptionImage>
                    {option.emoji || '📝'}
                  </OptionImage>
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

export default LetterRecognition
