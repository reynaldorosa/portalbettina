// Constantes do Portal Betina

// Níveis de dificuldade
export const DIFFICULTY_LEVELS = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3
}

// Categorias de atividades
export const ACTIVITY_CATEGORIES = {
  MEMORY: 'memory',
  COLORS: 'colors',
  SHAPES: 'shapes',
  NUMBERS: 'numbers',
  LETTERS: 'letters',
  EMOTIONS: 'emotions',
  SOUNDS: 'sounds',
  COORDINATION: 'coordination'
}

// Faixas etárias
export const AGE_RANGES = {
  TODDLER: '2-4',
  PRESCHOOL: '4-6', 
  EARLY_SCHOOL: '6-8',
  SCHOOL: '8-12',
  ALL: '2-12'
}

// Cores do tema
export const THEME_COLORS = {
  PRIMARY_BLUE: '#4A90E2',
  PRIMARY_GREEN: '#7ED321',
  PRIMARY_ORANGE: '#F5A623',
  PRIMARY_PURPLE: '#9013FE',
  PRIMARY_PINK: '#E91E63',
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F8F9FA',
  MEDIUM_GRAY: '#6C757D',
  DARK_GRAY: '#343A40',
  SUCCESS: '#28A745',
  WARNING: '#FFC107',
  ERROR: '#DC3545',
  INFO: '#17A2B8'
}

// Emojis para feedback e atividades
export const EMOJIS = {
  ACTIVITIES: {
    MEMORY: '🧠',
    COLORS: '🌈',
    SHAPES: '🔷',
    NUMBERS: '🔢',
    LETTERS: '🔤',
    EMOTIONS: '😊',
    SOUNDS: '🎵',
    COORDINATION: '🎯'
  },
  FEEDBACK: {
    SUCCESS: ['🎉', '⭐', '👏', '🌟', '✨', '🎊'],
    GREAT: ['🚀', '💫', '🏆', '👑', '🎯', '💎'],
    GOOD: ['👍', '😊', '✅', '💚', '🙌', '😄'],
    TRY_AGAIN: ['💪', '🌱', '📚', '🎈', '🌺', '🦋'],
    ENCOURAGEMENT: ['❤️', '🤗', '🌈', '☀️', '🌸', '🎨']
  },
  ANIMALS: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
  FRUITS: ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍', '🥥', '🫐', '🍈', '🍉', '🍋'],
  OBJECTS: ['⚽', '🏀', '🎾', '🏈', '🎱', '🏓', '🏸', '🥎', '🏐', '🏉', '🎳', '🏹', '🎣', '🥊', '🛼']
}

// Configurações de jogabilidade
export const GAME_SETTINGS = {
  MEMORY_GAME: {
    EASY: { pairs: 3, timeLimit: 120 },
    MEDIUM: { pairs: 6, timeLimit: 180 },
    HARD: { pairs: 8, timeLimit: 240 }
  },
  COLOR_MATCH: {
    EASY: { items: 4, timeLimit: 90 },
    MEDIUM: { items: 6, timeLimit: 120 },
    HARD: { items: 8, timeLimit: 150 }
  },
  IMAGE_ASSOCIATION: {
    EASY: { pairs: 4, timeLimit: 100 },
    MEDIUM: { pairs: 6, timeLimit: 140 },
    HARD: { pairs: 8, timeLimit: 180 }
  }
}

// Pontuação e recompensas
export const SCORING = {
  POINTS: {
    CORRECT_ANSWER: 10,
    SPEED_BONUS: 5,
    PERFECT_ROUND: 25,
    FIRST_TRY: 15
  },
  STARS: {
    ONE_STAR: 50,    // 50% de acertos
    TWO_STARS: 70,   // 70% de acertos
    THREE_STARS: 90  // 90% de acertos
  }
}

// Mensagens de encorajamento
export const ENCOURAGEMENT_MESSAGES = {
  START: [
    'Vamos começar esta aventura!',
    'Você consegue!',
    'Que tal explorar algo novo?',
    'Hora de se divertir aprendendo!'
  ],
  SUCCESS: [
    'Parabéns! Você acertou!',
    'Incrível! Continue assim!',
    'Muito bem! Você é demais!',
    'Perfeito! Que talento!'
  ],
  GREAT_PERFORMANCE: [
    'Uau! Você é um gênio!',
    'Fantástico! Nota 10!',
    'Incrível! Você surpreendeu!',
    'Brilhante! Que inteligência!'
  ],
  TRY_AGAIN: [
    'Quase lá! Tente novamente!',
    'Não desista! Você consegue!',
    'Continue tentando! Está melhorando!',
    'Cada tentativa te deixa mais forte!'
  ],
  COMPLETION: [
    'Missão cumprida! Parabéns!',
    'Você completou a atividade!',
    'Sucesso total! Que orgulho!',
    'Terminou! Você foi incrível!'
  ]
}

// Configurações de acessibilidade
export const ACCESSIBILITY = {
  MIN_TOUCH_TARGET: 44, // pixels
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  CONTRAST_RATIOS: {
    NORMAL: 4.5,
    LARGE_TEXT: 3,
    HIGH_CONTRAST: 7
  },
  FONT_SIZES: {
    SMALL: '14px',
    NORMAL: '16px', 
    LARGE: '18px',
    EXTRA_LARGE: '24px'
  }
}

// URLs e links úteis
export const EXTERNAL_LINKS = {
  DONATION: {
    PIX: 'seuchavepix@email.com', // Substituir pela chave PIX real
    QRCODE_URL: '/images/qr-code-pix.png'
  },
  RESOURCES: {
    AUTISM_INFO: 'https://www.autism.org.br',
    ADHD_INFO: 'https://www.tdah.org.br',
    PARENT_SUPPORT: 'https://www.inclusao.org.br'
  }
}

// Configurações de desenvolvimento
export const DEV_CONFIG = {
  DEBUG_MODE: import.meta.env.DEV,
  ENABLE_CONSOLE_LOGS: true,
  SHOW_PERFORMANCE_METRICS: false
}

// Expressões regulares úteis
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  PIX_KEY: /^[a-zA-Z0-9@._-]+$/
}

// Configurações de localStorage
export const STORAGE_KEYS = {
  ACCESSIBILITY_SETTINGS: 'betina_accessibility',
  PROGRESS_PREFIX: 'betina_progress_',
  USER_PREFERENCES: 'betina_preferences',
  LAST_ACTIVITY: 'betina_last_activity',
  TOTAL_TIME_PLAYED: 'betina_total_time'
}

// Tempo de espera para diferentes ações
export const TIMEOUTS = {
  FEEDBACK_DISPLAY: 2000,    // 2 segundos
  AUTO_ADVANCE: 3000,        // 3 segundos
  IDLE_WARNING: 300000,      // 5 minutos
  SESSION_TIMEOUT: 1800000   // 30 minutos
}

// Breakpoints responsivos
export const BREAKPOINTS = {
  MOBILE: '768px',
  TABLET: '1024px',
  DESKTOP: '1200px'
}

export default {
  DIFFICULTY_LEVELS,
  ACTIVITY_CATEGORIES,
  AGE_RANGES,
  THEME_COLORS,
  EMOJIS,
  GAME_SETTINGS,
  SCORING,
  ENCOURAGEMENT_MESSAGES,
  ACCESSIBILITY,
  EXTERNAL_LINKS,
  DEV_CONFIG,
  REGEX_PATTERNS,
  STORAGE_KEYS,
  TIMEOUTS,
  BREAKPOINTS
}
