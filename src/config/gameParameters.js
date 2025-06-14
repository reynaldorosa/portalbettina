/**
 * PORTAL BETINA - PARÂMETROS DE JOGO CENTRALIZADOS
 * Sistema unificado de configuração para todas as atividades terapêuticas
 *
 * @version 2.0.0
 * @created 2025-01-08
 * @purpose Eliminar duplicação de parâmetros espalhados em 8+ arquivos
 */

// =====================================================================
// CONFIGURAÇÕES CENTRALIZADAS POR ATIVIDADE
// =====================================================================

export const GAME_PARAMETERS = {
  /**
   * Jogo da Memória - Parâmetros por dificuldade
   * Focado em: Memória de trabalho, atenção sustentada, reconhecimento visual
   */
  'memory-game': {
    EASY: {
      pairs: 4,
      timeLimit: 120,
      hintDuration: 1000,
      maxMistakes: 999, // Sem limite para reduzir frustração
      showTimer: false,
    },
    MEDIUM: {
      pairs: 6,
      timeLimit: 180,
      hintDuration: 800,
      maxMistakes: 10,
      showTimer: true,
    },
    HARD: {
      pairs: 8,
      timeLimit: 240,
      hintDuration: 500,
      maxMistakes: 6,
      showTimer: true,
    },
  },

  /**
   * Combinação de Cores - Parâmetros por dificuldade
   * Focado em: Discriminação visual, categorização, função executiva
   */
  'color-match': {
    EASY: {
      correctItems: 2,
      incorrectItems: 2,
      timeLimit: 60,
      hints: true,
      colorBlindSupport: true,
    },
    MEDIUM: {
      correctItems: 3,
      incorrectItems: 3,
      timeLimit: 45,
      hints: false,
      colorBlindSupport: true,
    },
    HARD: {
      correctItems: 4,
      incorrectItems: 4,
      timeLimit: 30,
      hints: false,
      colorBlindSupport: false,
    },
  },

  /**
   * Sequência Musical - Parâmetros por dificuldade
   * Focado em: Memória auditiva, sequenciação, processamento temporal
   */
  'musical-sequence': {
    EASY: {
      maxNotes: 3,
      speed: 1000,
      allowReplay: true,
      audioHints: true,
      visualFeedback: true,
    },
    MEDIUM: {
      maxNotes: 5,
      speed: 800,
      allowReplay: true,
      audioHints: false,
      visualFeedback: true,
    },
    HARD: {
      maxNotes: 7,
      speed: 600,
      allowReplay: false,
      audioHints: false,
      visualFeedback: false,
    },
  },

  /**
   * Contagem de Números - Parâmetros por dificuldade
   * Focado em: Conceitos numéricos, correspondência um-a-um, atenção visual
   */
  'number-counting': {
    EASY: {
      minCount: 1,
      maxCount: 5,
      options: 3,
      showNumbers: true,
      allowFingerCounting: true,
    },
    MEDIUM: {
      minCount: 1,
      maxCount: 10,
      options: 4,
      showNumbers: false,
      allowFingerCounting: true,
    },
    HARD: {
      minCount: 5,
      maxCount: 15,
      options: 5,
      showNumbers: false,
      allowFingerCounting: false,
    },
  },

  /**
   * Reconhecimento de Letras - Parâmetros por dificuldade
   * Focado em: Alfabetização, discriminação visual, fonologia
   */
  'letter-recognition': {
    EASY: {
      focusLetters: ['A', 'E', 'O'],
      timeLimit: 15,
      audioHints: true,
      showUppercase: true,
      showLowercase: false,
    },
    MEDIUM: {
      focusLetters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      timeLimit: 10,
      audioHints: false,
      showUppercase: true,
      showLowercase: true,
    },
    HARD: {
      focusLetters: ['L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z'],
      timeLimit: 8,
      audioHints: false,
      showUppercase: false,
      showLowercase: true,
    },
  },

  /**
   * Associação de Imagens - Parâmetros por dificuldade
   * Focado em: Categorização semântica, flexibilidade cognitiva, generalização
   */
  'image-association': {
    EASY: {
      categories: ['animals', 'fruits'],
      timeLimit: 20,
      pairs: 4,
      showCategories: true,
      contextHints: true,
    },
    MEDIUM: {
      categories: ['animals', 'fruits', 'toys', 'vehicles'],
      timeLimit: 15,
      pairs: 6,
      showCategories: false,
      contextHints: false,
    },
    HARD: {
      categories: ['all'],
      timeLimit: 10,
      pairs: 8,
      showCategories: false,
      contextHints: false,
    },
  },

  /**
   * Pintura Criativa - Parâmetros por dificuldade
   * Focado em: Criatividade, coordenação motora fina, expressão
   */
  'creative-painting': {
    EASY: {
      minStrokes: 3,
      minColors: 1,
      timeLimit: 180,
      challengeType: 'free-draw',
      templates: true,
      undoAllowed: true,
    },
    MEDIUM: {
      minStrokes: 5,
      minColors: 2,
      timeLimit: 120,
      challengeType: 'guided',
      templates: true,
      undoAllowed: true,
    },
    HARD: {
      minStrokes: 8,
      minColors: 3,
      timeLimit: 90,
      challengeType: 'challenge',
      templates: false,
      undoAllowed: false,
    },
  },

  /**
   * Padrões Visuais - Parâmetros por dificuldade
   * Focado em: Memória visual, sequenciação, atenção sustentada
   */
  'visual-patterns': {
    EASY: {
      sequenceLength: 2,
      timeLimit: 60,
      showProgress: true,
      allowReplay: true,
      shapes: ['circle', 'square', 'triangle'],
    },
    MEDIUM: {
      sequenceLength: 4,
      timeLimit: 45,
      showProgress: true,
      allowReplay: false,
      shapes: ['circle', 'square', 'triangle', 'star'],
    },
    HARD: {
      sequenceLength: 6,
      timeLimit: 30,
      showProgress: false,
      allowReplay: false,
      shapes: ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'],
    },
  },

  /**
   * Quebra-Cabeça Emocional - Parâmetros por dificuldade
   * Focado em: Reconhecimento emocional, teoria da mente, regulação
   */
  'emotional-puzzle': {
    EASY: {
      pieceCount: 4,
      timeLimit: 120,
      contextHints: true,
      emotionCategories: ['happy', 'sad'],
    },
    MEDIUM: {
      pieceCount: 6,
      timeLimit: 90,
      contextHints: false,
      emotionCategories: ['happy', 'sad', 'angry', 'surprised'],
    },
    HARD: {
      pieceCount: 9,
      timeLimit: 60,
      contextHints: false,
      emotionCategories: ['happy', 'sad', 'angry', 'surprised', 'confused', 'excited'],
    },
  },
}

// =====================================================================
// CONFIGURAÇÕES ESPECÍFICAS PARA AUTISMO
// =====================================================================

/**
 * Parâmetros especializados para crianças com autismo
 * Baseado em pesquisas de neuropedagogia e terapia comportamental
 */
export const AUTISM_SPECIFIC_PARAMETERS = {
  sensory: {
    // Redução de sobrecarga sensorial
    lowStimulation: {
      reducedAnimations: true,
      mutedColors: true,
      minimizedSounds: true,
      simplifiedUI: true,
    },

    // Suporte para hipersensibilidade
    hyperSensitivity: {
      vibrationDisabled: true,
      flashingDisabled: true,
      loudSoundsDisabled: true,
      suddenChangesMinimized: true,
    },
  },

  cognitive: {
    // Suporte para função executiva
    executiveFunction: {
      extraProcessingTime: 1.5, // Multiplicador de tempo
      stepByStepInstructions: true,
      visualSchedules: true,
      transitionWarnings: true,
    },

    // Suporte para rigidez cognitiva
    flexibility: {
      predictableRoutines: true,
      changeNotifications: true,
      familiarityFirst: true,
      choiceReduction: true,
    },
  },

  behavioral: {
    // Estratégias de regulação
    regulation: {
      frequentBreaks: true,
      calmingTools: true,
      selfRegulationPrompts: true,
      stressIndicators: true,
    },

    // Reforço positivo
    reinforcement: {
      immediatefeedback: true,
      visualRewards: true,
      consistentPraise: true,
      achievementTracking: true,
    },
  },
}

// =====================================================================
// FUNÇÕES DE ACESSO E UTILIDADE
// =====================================================================

/**
 * Obtém parâmetros para um jogo específico e dificuldade
 * @param {string} gameId - ID do jogo
 * @param {string} difficulty - Nível de dificuldade (EASY, MEDIUM, HARD)
 * @returns {Object} Parâmetros do jogo
 */
export const getGameParameters = (gameId, difficulty = 'MEDIUM') => {
  const gameParams = GAME_PARAMETERS[gameId]
  if (!gameParams) {
    console.warn(`⚠️ Parâmetros não encontrados para o jogo: ${gameId}`)
    return {}
  }

  const difficultyParams = gameParams[difficulty]
  if (!difficultyParams) {
    console.warn(`⚠️ Dificuldade '${difficulty}' não encontrada para ${gameId}, usando MEDIUM`)
    return gameParams.MEDIUM || gameParams.EASY || {}
  }

  return { ...difficultyParams }
}

/**
 * Valida se um jogo e dificuldade existem
 * @param {string} gameId - ID do jogo
 * @param {string} difficulty - Nível de dificuldade
 * @returns {boolean} True se válido
 */
export const validateGameParameters = (gameId, difficulty) => {
  return GAME_PARAMETERS[gameId] && GAME_PARAMETERS[gameId][difficulty]
}

/**
 * Obtém todos os jogos disponíveis
 * @returns {Array<string>} Lista de IDs de jogos
 */
export const getAvailableGames = () => {
  return Object.keys(GAME_PARAMETERS)
}

/**
 * Obtém dificuldades disponíveis para um jogo
 * @param {string} gameId - ID do jogo
 * @returns {Array<string>} Lista de dificuldades
 */
export const getAvailableDifficulties = (gameId) => {
  const gameParams = GAME_PARAMETERS[gameId]
  return gameParams ? Object.keys(gameParams) : []
}

/**
 * Aplica modificações específicas para autismo nos parâmetros
 * @param {Object} baseParams - Parâmetros base do jogo
 * @param {Object} userProfile - Perfil do usuário com necessidades específicas
 * @returns {Object} Parâmetros modificados
 */
export const applyAutismOptimizations = (baseParams, userProfile = {}) => {
  const optimizedParams = { ...baseParams }

  // Aplicar ajustes sensoriais se necessário
  if (userProfile.sensoryProfile?.needsLowStimulation) {
    optimizedParams.reducedAnimations = true
    optimizedParams.mutedColors = true
    optimizedParams.timeLimit = Math.floor(optimizedParams.timeLimit * 1.5)
  }

  // Aplicar ajustes cognitivos se necessário
  if (userProfile.cognitiveProfile?.needsExecutiveSupport) {
    optimizedParams.extraProcessingTime = true
    optimizedParams.stepByStepInstructions = true
    optimizedParams.timeLimit = Math.floor(optimizedParams.timeLimit * 1.3)
  }

  // Aplicar ajustes comportamentais se necessário
  if (userProfile.behavioralProfile?.needsRegulationSupport) {
    optimizedParams.frequentBreaks = true
    optimizedParams.calmingTools = true
    optimizedParams.immediateFeeback = true
  }

  return optimizedParams
}

/**
 * Obtém parâmetros otimizados para o perfil do usuário
 * @param {string} gameId - ID do jogo
 * @param {string} difficulty - Dificuldade
 * @param {Object} userProfile - Perfil completo do usuário
 * @returns {Object} Parâmetros personalizados
 */
export const getPersonalizedParameters = (gameId, difficulty, userProfile = {}) => {
  const baseParams = getGameParameters(gameId, difficulty)
  return applyAutismOptimizations(baseParams, userProfile)
}

// =====================================================================
// CONFIGURAÇÕES DE ACESSIBILIDADE
// =====================================================================

export const ACCESSIBILITY_PARAMETERS = {
  // Suporte para deficiência visual
  visual: {
    highContrast: true,
    largerTexts: true,
    screenReaderSupport: true,
    alternativeText: true,
  },

  // Suporte para deficiência auditiva
  auditory: {
    visualCues: true,
    subtitles: true,
    signLanguageSupport: false, // Futuro
    vibrationFeedback: true,
  },

  // Suporte para deficiência motora
  motor: {
    largerButtons: true,
    longerTimeouts: true,
    alternativeInputs: true,
    switchControl: false, // Futuro
  },
}

// =====================================================================
// CONSTANTES GLOBAIS
// =====================================================================

export const DIFFICULTY_LEVELS = ['EASY', 'MEDIUM', 'HARD']

export const THERAPEUTIC_FOCUS_AREAS = [
  'memory', // Memória
  'attention', // Atenção
  'executive_function', // Função executiva
  'social_skills', // Habilidades sociais
  'communication', // Comunicação
  'sensory_processing', // Processamento sensorial
  'emotional_regulation', // Regulação emocional
  'motor_skills', // Habilidades motoras
]

export const AUTISM_SUPPORT_LEVELS = {
  LEVEL_1: 'requiring_support', // Nível 1: Requer apoio
  LEVEL_2: 'requiring_substantial_support', // Nível 2: Requer apoio substancial
  LEVEL_3: 'requiring_very_substantial_support', // Nível 3: Requer apoio muito substancial
}

// Exportação padrão para compatibilidade
export default {
  GAME_PARAMETERS,
  AUTISM_SPECIFIC_PARAMETERS,
  ACCESSIBILITY_PARAMETERS,
  getGameParameters,
  validateGameParameters,
  getAvailableGames,
  getAvailableDifficulties,
  applyAutismOptimizations,
  getPersonalizedParameters,
  DIFFICULTY_LEVELS,
  THERAPEUTIC_FOCUS_AREAS,
  AUTISM_SUPPORT_LEVELS,
}
