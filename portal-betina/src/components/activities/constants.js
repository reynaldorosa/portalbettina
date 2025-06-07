// Constants for Creative Painting Activity

export const DIFFICULTY_SETTINGS = [
  {
    id: 'EASY',
    name: 'Fácil',
    icon: '😊',
    description: 'Ideal para iniciantes',
    brushSizes: [5, 10, 15, 20],
    maxColors: 8,
    features: ['Canvas livre', 'Cores básicas', 'Modelos simples']
  },
  {
    id: 'MEDIUM',
    name: 'Médio',
    icon: '🤔',
    description: 'Desafio equilibrado',
    brushSizes: [2, 5, 10, 15, 25],
    maxColors: 12,
    features: ['Mais cores', 'Modelos detalhados', 'Desafios criativos']
  },
  {
    id: 'HARD',
    name: 'Difícil',
    icon: '🧠',
    description: 'Para artistas avançados',
    brushSizes: [1, 3, 5, 8, 12, 20, 30, 50],
    maxColors: 16,
    features: ['Todas as cores', 'Modelos complexos', 'Desafios avançados']
  }
];

export const COLOR_PALETTE = {
  primary: [
    { name: 'Vermelho', color: '#FF4444', category: 'primary' },
    { name: 'Azul', color: '#4444FF', category: 'primary' },
    { name: 'Amarelo', color: '#FFFF44', category: 'primary' },
    { name: 'Verde', color: '#44FF44', category: 'primary' },
    { name: 'Preto', color: '#000000', category: 'basic' },
    { name: 'Branco', color: '#FFFFFF', category: 'basic' },
    { name: 'Marrom', color: '#8B4513', category: 'earth' },
    { name: 'Rosa', color: '#FF44AA', category: 'secondary' }
  ],
  secondary: [
    { name: 'Laranja', color: '#FF8844', category: 'secondary' },
    { name: 'Roxo', color: '#8844FF', category: 'secondary' },
    { name: 'Verde Claro', color: '#88FF88', category: 'pastel' },
    { name: 'Azul Claro', color: '#87CEEB', category: 'pastel' },
    { name: 'Rosa Claro', color: '#FFB6C1', category: 'pastel' },
    { name: 'Amarelo Claro', color: '#FFFFE0', category: 'pastel' },
    { name: 'Cinza', color: '#888888', category: 'neutral' },
    { name: 'Verde Escuro', color: '#228B22', category: 'earth' }
  ],
  advanced: [
    { name: 'Turquesa', color: '#40E0D0', category: 'advanced' },
    { name: 'Coral', color: '#FF7F50', category: 'advanced' },
    { name: 'Lavanda', color: '#E6E6FA', category: 'advanced' },
    { name: 'Dourado', color: '#FFD700', category: 'advanced' },
    { name: 'Prata', color: '#C0C0C0', category: 'advanced' },
    { name: 'Índigo', color: '#4B0082', category: 'advanced' },
    { name: 'Salmão', color: '#FA8072', category: 'advanced' },
    { name: 'Oliva', color: '#808000', category: 'advanced' }
  ]
};

export const PAINT_MODES = {
  FREE: {
    id: 'free',
    name: 'Pintura Livre',
    icon: '🎨',
    description: 'Solte sua criatividade sem limitações',
    features: ['Canvas em branco', 'Todas as ferramentas', 'Sem tempo limite']
  },
  GUIDED: {
    id: 'guided',
    name: 'Pintura Guiada',
    icon: '📋',
    description: 'Siga modelos e templates',
    features: ['Modelos para seguir', 'Dicas visuais', 'Aprendizado gradual']
  },
  CHALLENGE: {
    id: 'challenge',
    name: 'Desafios Criativos',
    icon: '🎯',
    description: 'Complete desafios específicos',
    features: ['Objetivos claros', 'Pontuação', 'Conquistas']
  }
};

export const TEMPLATES = {
  NATURE: [
    { id: 1, name: 'Árvore', icon: '🌳', difficulty: 'easy', category: 'nature' },
    { id: 2, name: 'Flor', icon: '🌸', difficulty: 'easy', category: 'nature' },
    { id: 3, name: 'Sol', icon: '☀️', difficulty: 'easy', category: 'nature' },
    { id: 4, name: 'Nuvem', icon: '☁️', difficulty: 'easy', category: 'nature' },
    { id: 5, name: 'Montanha', icon: '⛰️', difficulty: 'medium', category: 'nature' },
    { id: 6, name: 'Arco-íris', icon: '🌈', difficulty: 'medium', category: 'nature' }
  ],
  ANIMALS: [
    { id: 7, name: 'Gato', icon: '🐱', difficulty: 'easy', category: 'animals' },
    { id: 8, name: 'Cachorro', icon: '🐶', difficulty: 'easy', category: 'animals' },
    { id: 9, name: 'Pássaro', icon: '🐦', difficulty: 'medium', category: 'animals' },
    { id: 10, name: 'Peixe', icon: '🐠', difficulty: 'medium', category: 'animals' },
    { id: 11, name: 'Borboleta', icon: '🦋', difficulty: 'medium', category: 'animals' },
    { id: 12, name: 'Elefante', icon: '🐘', difficulty: 'hard', category: 'animals' }
  ],
  OBJECTS: [
    { id: 13, name: 'Casa', icon: '🏠', difficulty: 'easy', category: 'objects' },
    { id: 14, name: 'Carro', icon: '🚗', difficulty: 'medium', category: 'objects' },
    { id: 15, name: 'Bola', icon: '⚽', difficulty: 'easy', category: 'objects' },
    { id: 16, name: 'Estrela', icon: '⭐', difficulty: 'easy', category: 'objects' },
    { id: 17, name: 'Coração', icon: '❤️', difficulty: 'easy', category: 'objects' },
    { id: 18, name: 'Foguete', icon: '🚀', difficulty: 'hard', category: 'objects' }
  ]
};

export const CHALLENGES = [
  {
    id: 1,
    title: 'Paisagem Colorida',
    description: 'Desenhe uma paisagem usando pelo menos 5 cores diferentes',
    difficulty: 'easy',
    objectives: [
      'Use pelo menos 5 cores',
      'Inclua elementos da natureza',
      'Preencha todo o canvas'
    ],
    timeLimit: 300, // 5 minutes
    points: 100
  },
  {
    id: 2,
    title: 'Retrato Criativo',
    description: 'Crie um autorretrato usando formas geométricas',
    difficulty: 'medium',
    objectives: [
      'Use apenas formas geométricas',
      'Represente características faciais',
      'Use pelo menos 3 cores'
    ],
    timeLimit: 420, // 7 minutes
    points: 150
  },
  {
    id: 3,
    title: 'Arte Abstrata',
    description: 'Expresse suas emoções através de cores e formas livres',
    difficulty: 'medium',
    objectives: [
      'Use cores que representem emoções',
      'Crie padrões interessantes',
      'Preencha pelo menos 80% do canvas'
    ],
    timeLimit: 480, // 8 minutes
    points: 200
  },
  {
    id: 4,
    title: 'Mandala Simétrica',
    description: 'Crie uma mandala com padrões simétricos',
    difficulty: 'hard',
    objectives: [
      'Mantenha simetria radial',
      'Use pelo menos 6 cores',
      'Crie padrões repetitivos'
    ],
    timeLimit: 600, // 10 minutes
    points: 300
  },
  {
    id: 5,
    title: 'História em Quadrinhos',
    description: 'Desenhe uma pequena história em 4 quadros',
    difficulty: 'hard',
    objectives: [
      'Divida o canvas em 4 partes',
      'Conte uma história simples',
      'Use personagens consistentes'
    ],
    timeLimit: 720, // 12 minutes
    points: 400
  }
];

export const BRUSH_TYPES = {
  ROUND: {
    id: 'round',
    name: 'Redondo',
    icon: '⚫',
    description: 'Pincel padrão para desenho geral'
  },
  SQUARE: {
    id: 'square',
    name: 'Quadrado',
    icon: '⬛',
    description: 'Para linhas retas e preenchimentos'
  },
  SPRAY: {
    id: 'spray',
    name: 'Spray',
    icon: '💨',
    description: 'Efeito de tinta borrifada'
  }
};

export const CANVAS_SIZES = {
  SMALL: { width: 400, height: 300, name: 'Pequeno' },
  MEDIUM: { width: 600, height: 450, name: 'Médio' },
  LARGE: { width: 800, height: 600, name: 'Grande' }
};

export const ACHIEVEMENT_TYPES = {
  FIRST_PAINTING: {
    id: 'first_painting',
    name: 'Primeira Obra',
    description: 'Complete sua primeira pintura',
    icon: '🎨',
    points: 50
  },
  COLOR_MASTER: {
    id: 'color_master',
    name: 'Mestre das Cores',
    description: 'Use todas as cores disponíveis em uma pintura',
    icon: '🌈',
    points: 100
  },
  SPEED_ARTIST: {
    id: 'speed_artist',
    name: 'Artista Veloz',
    description: 'Complete um desafio em menos de 2 minutos',
    icon: '⚡',
    points: 150
  },
  PERFECTIONIST: {
    id: 'perfectionist',
    name: 'Perfeccionista',
    description: 'Complete 5 desafios com pontuação máxima',
    icon: '⭐',
    points: 200
  }
};

export const FEEDBACK_MESSAGES = {
  PAINTING_STARTED: [
    'Que bela tela em branco! Vamos criar algo incrível!',
    'Hora de soltar a criatividade!',
    'Suas mãos são mágicas, vamos pintar!'
  ],
  COLOR_SELECTED: [
    'Ótima escolha de cor!',
    'Essa cor vai ficar linda!',
    'Que cor vibrante!'
  ],
  CHALLENGE_COMPLETED: [
    'Parabéns! Desafio concluído com sucesso!',
    'Incrível! Você é um verdadeiro artista!',
    'Que talento! Obra-prima criada!'
  ],
  PAINTING_SAVED: [
    'Sua arte foi salva! Que orgulho!',
    'Obra-prima preservada para sempre!',
    'Arte salva com sucesso!'
  ]
};

export default {
  DIFFICULTY_SETTINGS,
  COLOR_PALETTE,
  PAINT_MODES,
  TEMPLATES,
  CHALLENGES,
  BRUSH_TYPES,
  CANVAS_SIZES,
  ACHIEVEMENT_TYPES,
  FEEDBACK_MESSAGES
};
