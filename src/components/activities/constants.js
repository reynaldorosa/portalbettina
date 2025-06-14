// Constants for Creative Painting Activity - Coloroterapia System

export const DIFFICULTY_SETTINGS = [
  {
    id: 'EASY',
    name: 'Fácil',
    icon: '😊',
    description: 'Ideal para iniciantes',
    templates: 3,
    coloringSpots: 8, // Número de áreas para colorir
    features: ['Formas simples', 'Poucas áreas', 'Cores básicas']
  },
  {
    id: 'MEDIUM',
    name: 'Médio',
    icon: '🤔',
    description: 'Desafio equilibrado',
    templates: 3,
    coloringSpots: 15, // Mais áreas para colorir
    features: ['Formas detalhadas', 'Áreas médias', 'Mais cores']
  },
  {
    id: 'HARD',
    name: 'Difícil',
    icon: '🧠',
    description: 'Para artistas avançados',
    templates: 3,
    coloringSpots: 25, // Muitas áreas para colorir
    features: ['Formas complexas', 'Muitas áreas', 'Todas as cores']
  }
];

// Paletas de Coloroterapia com significados terapêuticos
export const COLOROTHERAPY_PALETTES = {
  // Cores Energizantes - Estimulam atividade e concentração
  ENERGIZING: {
    name: 'Energizante',
    description: 'Estimula atividade e concentração',
    therapeutic: 'Melhora foco e motivação',
    colors: [
      { hex: '#FF4444', name: 'Vermelho Energia', therapy: 'Estimula ação e coragem' },
      { hex: '#FF8800', name: 'Laranja Vitalidade', therapy: 'Aumenta entusiasmo' },
      { hex: '#FFDD00', name: 'Amarelo Alegria', therapy: 'Promove otimismo' },
      { hex: '#FF6B6B', name: 'Rosa Energia', therapy: 'Equilibra força e amor' }
    ]
  },
  
  // Cores Calmantes - Reduzem ansiedade e promovem relaxamento
  CALMING: {
    name: 'Calmante',
    description: 'Reduz ansiedade e promove relaxamento',
    therapeutic: 'Diminui estresse e agitação',
    colors: [
      { hex: '#4A90E2', name: 'Azul Serenidade', therapy: 'Acalma mente e corpo' },
      { hex: '#50C878', name: 'Verde Harmonia', therapy: 'Equilibra emoções' },
      { hex: '#9B59B6', name: 'Roxo Tranquilidade', therapy: 'Promove paz interior' },
      { hex: '#87CEEB', name: 'Azul Claro Paz', therapy: 'Reduz tensão' }
    ]
  },
  
  // Cores Equilibrantes - Promovem estabilidade emocional
  BALANCING: {
    name: 'Equilibrante',
    description: 'Promove estabilidade emocional',
    therapeutic: 'Harmoniza energias internas',
    colors: [
      { hex: '#2E8B57', name: 'Verde Equilíbrio', therapy: 'Estabiliza emoções' },
      { hex: '#CD853F', name: 'Marrom Terra', therapy: 'Conecta com estabilidade' },
      { hex: '#4682B4', name: 'Azul Aço', therapy: 'Fortalece determinação' },
      { hex: '#DDA0DD', name: 'Lilás Harmonia', therapy: 'Suaviza conflitos internos' }
    ]
  },
  
  // Cores Criativas - Estimulam imaginação e expressão
  CREATIVE: {
    name: 'Criativa',
    description: 'Estimula imaginação e expressão',
    therapeutic: 'Desenvolve criatividade e autoexpressão',
    colors: [
      { hex: '#FF69B4', name: 'Rosa Criativo', therapy: 'Libera expressão artística' },
      { hex: '#32CD32', name: 'Verde Limão', therapy: 'Estimula crescimento criativo' },
      { hex: '#FF1493', name: 'Pink Inspiração', therapy: 'Desperta imaginação' },
      { hex: '#00CED1', name: 'Turquesa Inovação', therapy: 'Promove pensamento original' }
    ]
  },
  
  // Cores Concentração - Melhoram foco e atenção
  FOCUS: {
    name: 'Concentração',
    description: 'Melhora foco e atenção',
    therapeutic: 'Aumenta capacidade de concentração',
    colors: [
      { hex: '#191970', name: 'Azul Marinho Foco', therapy: 'Melhora concentração profunda' },
      { hex: '#556B2F', name: 'Verde Oliva', therapy: 'Sustenta atenção prolongada' },
      { hex: '#483D8B', name: 'Roxo Escuro', therapy: 'Promove meditação focada' },
      { hex: '#2F4F4F', name: 'Cinza Ardósia', therapy: 'Estabiliza pensamentos' }
    ]
  },
  
  // Cores Alegria - Promovem bem-estar e positividade
  JOY: {
    name: 'Alegria',
    description: 'Promove bem-estar e positividade',
    therapeutic: 'Eleva humor e autoestima',
    colors: [
      { hex: '#FFD700', name: 'Dourado Felicidade', therapy: 'Irradia positividade' },
      { hex: '#FFA500', name: 'Laranja Alegria', therapy: 'Desperta entusiasmo' },
      { hex: '#FFFF00', name: 'Amarelo Brilhante', therapy: 'Estimula felicidade' },
      { hex: '#FF6347', name: 'Tomate Vivacidade', therapy: 'Energiza com alegria' }
    ]
  }
};

// Templates para colorir - array único com propriedade difficulty
export const COLORING_TEMPLATES = [
  // EASY Templates
  {
    id: 'easy_sun',
    name: 'Sol Feliz',
    description: 'Um sol sorridente com raios simples',
    difficulty: 'EASY',
    icon: '☀️',
    areas: 8,
    recommendedPalette: 'JOY',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="40" fill="none" stroke="#333" stroke-width="2" data-area="1"/>
      <circle cx="85" cy="90" r="3" fill="#333" data-area="face"/>
      <circle cx="115" cy="90" r="3" fill="#333" data-area="face"/>
      <path d="M 85 110 Q 100 120 115 110" stroke="#333" stroke-width="2" fill="none" data-area="face"/>
      <line x1="100" y1="30" x2="100" y2="50" stroke="#333" stroke-width="3" data-area="2"/>
      <line x1="150" y1="100" x2="130" y2="100" stroke="#333" stroke-width="3" data-area="3"/>
      <line x1="100" y1="170" x2="100" y2="150" stroke="#333" stroke-width="3" data-area="4"/>
      <line x1="50" y1="100" x2="70" y2="100" stroke="#333" stroke-width="3" data-area="5"/>
      <line x1="135" y1="65" x2="125" y2="75" stroke="#333" stroke-width="3" data-area="6"/>
      <line x1="135" y1="135" x2="125" y2="125" stroke="#333" stroke-width="3" data-area="7"/>
      <line x1="65" y1="135" x2="75" y2="125" stroke="#333" stroke-width="3" data-area="8"/>
    </svg>`
  },
  {
    id: 'easy_flower',
    name: 'Flor Simples',
    description: 'Uma flor com pétalas grandes',
    difficulty: 'EASY',
    icon: '🌸',
    areas: 8,
    recommendedPalette: 'CALMING',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="15" fill="none" stroke="#333" stroke-width="2" data-area="center"/>
      <ellipse cx="100" cy="65" rx="15" ry="25" fill="none" stroke="#333" stroke-width="2" data-area="1"/>
      <ellipse cx="135" cy="100" rx="25" ry="15" fill="none" stroke="#333" stroke-width="2" data-area="2"/>
      <ellipse cx="100" cy="135" rx="15" ry="25" fill="none" stroke="#333" stroke-width="2" data-area="3"/>
      <ellipse cx="65" cy="100" rx="25" ry="15" fill="none" stroke="#333" stroke-width="2" data-area="4"/>
      <ellipse cx="120" cy="80" rx="12" ry="10" fill="none" stroke="#333" stroke-width="2" data-area="5"/>
      <ellipse cx="120" cy="120" rx="12" ry="10" fill="none" stroke="#333" stroke-width="2" data-area="6"/>
      <ellipse cx="80" cy="120" rx="12" ry="10" fill="none" stroke="#333" stroke-width="2" data-area="7"/>
      <ellipse cx="80" cy="80" rx="12" ry="10" fill="none" stroke="#333" stroke-width="2" data-area="8"/>
    </svg>`
  },
  {
    id: 'easy_heart',
    name: 'Coração Alegre',
    description: 'Um coração grande com detalhes simples',
    difficulty: 'EASY',
    icon: '💖',
    areas: 8,
    recommendedPalette: 'ENERGIZING',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <path d="M100,180 C80,160 20,120 20,80 C20,50 40,30 70,30 C85,30 100,40 100,40 C100,40 115,30 130,30 C160,30 180,50 180,80 C180,120 120,160 100,180 Z" fill="none" stroke="#333" stroke-width="2" data-area="main"/>
      <circle cx="60" cy="65" r="8" fill="none" stroke="#333" stroke-width="2" data-area="1"/>
      <circle cx="140" cy="65" r="8" fill="none" stroke="#333" stroke-width="2" data-area="2"/>
      <circle cx="100" cy="85" r="6" fill="none" stroke="#333" stroke-width="2" data-area="3"/>
      <circle cx="80" cy="105" r="5" fill="none" stroke="#333" stroke-width="2" data-area="4"/>
      <circle cx="120" cy="105" r="5" fill="none" stroke="#333" stroke-width="2" data-area="5"/>
      <circle cx="100" cy="125" r="4" fill="none" stroke="#333" stroke-width="2" data-area="6"/>
      <circle cx="90" cy="145" r="3" fill="none" stroke="#333" stroke-width="2" data-area="7"/>
    </svg>`
  },
  
  // MEDIUM Templates  
  {
    id: 'medium_butterfly',
    name: 'Borboleta Colorida',
    description: 'Uma borboleta com asas detalhadas',
    difficulty: 'MEDIUM',
    icon: '🦋',
    areas: 15,
    recommendedPalette: 'CREATIVE',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="100" rx="3" ry="30" fill="none" stroke="#333" stroke-width="2" data-area="body"/>
      <circle cx="100" cy="75" r="4" fill="none" stroke="#333" stroke-width="2" data-area="head"/>
      <path d="M97,85 Q75,60 65,80 Q70,100 97,95 Z" fill="none" stroke="#333" stroke-width="2" data-area="1"/>
      <path d="M103,85 Q125,60 135,80 Q130,100 103,95 Z" fill="none" stroke="#333" stroke-width="2" data-area="2"/>
      <path d="M97,105 Q75,140 65,120 Q70,100 97,105 Z" fill="none" stroke="#333" stroke-width="2" data-area="3"/>
      <path d="M103,105 Q125,140 135,120 Q130,100 103,105 Z" fill="none" stroke="#333" stroke-width="2" data-area="4"/>
      <circle cx="80" cy="75" r="4" fill="none" stroke="#333" stroke-width="2" data-area="5"/>
      <circle cx="120" cy="75" r="4" fill="none" stroke="#333" stroke-width="2" data-area="6"/>
      <circle cx="80" cy="125" r="3" fill="none" stroke="#333" stroke-width="2" data-area="7"/>
      <circle cx="120" cy="125" r="3" fill="none" stroke="#333" stroke-width="2" data-area="8"/>
      <circle cx="75" cy="90" r="2" fill="none" stroke="#333" stroke-width="1" data-area="9"/>
      <circle cx="125" cy="90" r="2" fill="none" stroke="#333" stroke-width="1" data-area="10"/>
      <circle cx="75" cy="110" r="2" fill="none" stroke="#333" stroke-width="1" data-area="11"/>
      <circle cx="125" cy="110" r="2" fill="none" stroke="#333" stroke-width="1" data-area="12"/>
      <circle cx="85" cy="85" r="1.5" fill="none" stroke="#333" stroke-width="1" data-area="13"/>
      <circle cx="115" cy="85" r="1.5" fill="none" stroke="#333" stroke-width="1" data-area="14"/>
      <circle cx="100" cy="90" r="1" fill="none" stroke="#333" stroke-width="1" data-area="15"/>
    </svg>`
  },
  {
    id: 'medium_tree',
    name: 'Árvore da Vida',
    description: 'Uma árvore com galhos e folhas',
    difficulty: 'MEDIUM',
    icon: '🌳',
    areas: 15,
    recommendedPalette: 'BALANCING',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="90" y="140" width="20" height="40" fill="none" stroke="#333" stroke-width="2" data-area="trunk"/>
      <circle cx="100" cy="120" r="25" fill="none" stroke="#333" stroke-width="2" data-area="crown"/>
      <circle cx="80" cy="105" r="15" fill="none" stroke="#333" stroke-width="2" data-area="1"/>
      <circle cx="120" cy="105" r="15" fill="none" stroke="#333" stroke-width="2" data-area="2"/>
      <circle cx="100" cy="95" r="12" fill="none" stroke="#333" stroke-width="2" data-area="3"/>
      <circle cx="85" cy="125" r="10" fill="none" stroke="#333" stroke-width="2" data-area="4"/>
      <circle cx="115" cy="125" r="10" fill="none" stroke="#333" stroke-width="2" data-area="5"/>
      <circle cx="70" cy="115" r="8" fill="none" stroke="#333" stroke-width="2" data-area="6"/>
      <circle cx="130" cy="115" r="8" fill="none" stroke="#333" stroke-width="2" data-area="7"/>
      <circle cx="90" cy="85" r="6" fill="none" stroke="#333" stroke-width="2" data-area="8"/>
      <circle cx="110" cy="85" r="6" fill="none" stroke="#333" stroke-width="2" data-area="9"/>
      <circle cx="75" cy="95" r="5" fill="none" stroke="#333" stroke-width="2" data-area="10"/>
      <circle cx="125" cy="95" r="5" fill="none" stroke="#333" stroke-width="2" data-area="11"/>
      <circle cx="100" cy="135" r="4" fill="none" stroke="#333" stroke-width="2" data-area="12"/>
      <circle cx="85" cy="140" r="3" fill="none" stroke="#333" stroke-width="2" data-area="13"/>
      <circle cx="115" cy="140" r="3" fill="none" stroke="#333" stroke-width="2" data-area="14"/>
      <circle cx="100" cy="155" r="2" fill="none" stroke="#333" stroke-width="2" data-area="15"/>
    </svg>`
  },
  {
    id: 'medium_mandala',
    name: 'Mandala Simples',
    description: 'Um padrão mandala com formas geométricas',
    difficulty: 'MEDIUM',
    icon: '🌀',
    areas: 15,
    recommendedPalette: 'FOCUS',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="8" fill="none" stroke="#333" stroke-width="2" data-area="center"/>
      <circle cx="100" cy="100" r="20" fill="none" stroke="#333" stroke-width="2" data-area="inner"/>
      <circle cx="100" cy="100" r="35" fill="none" stroke="#333" stroke-width="2" data-area="middle"/>
      <circle cx="100" cy="100" r="50" fill="none" stroke="#333" stroke-width="2" data-area="outer"/>
      <path d="M100,50 L105,65 L100,80 L95,65 Z" fill="none" stroke="#333" stroke-width="2" data-area="1"/>
      <path d="M150,100 L135,105 L120,100 L135,95 Z" fill="none" stroke="#333" stroke-width="2" data-area="2"/>
      <path d="M100,150 L95,135 L100,120 L105,135 Z" fill="none" stroke="#333" stroke-width="2" data-area="3"/>
      <path d="M50,100 L65,95 L80,100 L65,105 Z" fill="none" stroke="#333" stroke-width="2" data-area="4"/>
      <circle cx="100" cy="65" r="4" fill="none" stroke="#333" stroke-width="2" data-area="5"/>
      <circle cx="135" cy="100" r="4" fill="none" stroke="#333" stroke-width="2" data-area="6"/>
      <circle cx="100" cy="135" r="4" fill="none" stroke="#333" stroke-width="2" data-area="7"/>
      <circle cx="65" cy="100" r="4" fill="none" stroke="#333" stroke-width="2" data-area="8"/>
      <circle cx="125" cy="75" r="3" fill="none" stroke="#333" stroke-width="2" data-area="9"/>
      <circle cx="125" cy="125" r="3" fill="none" stroke="#333" stroke-width="2" data-area="10"/>
      <circle cx="75" cy="125" r="3" fill="none" stroke="#333" stroke-width="2" data-area="11"/>
      <circle cx="75" cy="75" r="3" fill="none" stroke="#333" stroke-width="2" data-area="12"/>
      <circle cx="115" cy="85" r="2" fill="none" stroke="#333" stroke-width="1" data-area="13"/>
      <circle cx="115" cy="115" r="2" fill="none" stroke="#333" stroke-width="1" data-area="14"/>
      <circle cx="85" cy="115" r="2" fill="none" stroke="#333" stroke-width="1" data-area="15"/>
    </svg>`
  },

  // HARD Templates
  {
    id: 'hard_dragon',
    name: 'Dragão Místico',
    description: 'Um dragão com muitos detalhes e escalas',
    difficulty: 'HARD',
    icon: '🐲',
    areas: 25,
    recommendedPalette: 'CREATIVE',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="120" cy="100" rx="40" ry="20" fill="none" stroke="#333" stroke-width="2" data-area="body"/>
      <circle cx="70" cy="90" r="18" fill="none" stroke="#333" stroke-width="2" data-area="head"/>
      <ellipse cx="50" cy="88" rx="12" ry="8" fill="none" stroke="#333" stroke-width="2" data-area="snout"/>
      <circle cx="65" cy="85" r="2" fill="#333" data-area="eye"/>
      <path d="M60,75 L65,70 L70,75" stroke="#333" stroke-width="2" fill="none" data-area="horn1"/>
      <path d="M70,75 L75,70 L80,75" stroke="#333" stroke-width="2" fill="none" data-area="horn2"/>
      <path d="M140,85 Q160,70 170,85 Q165,95 155,90 Q150,85 140,85" fill="none" stroke="#333" stroke-width="2" data-area="wing1"/>
      <path d="M140,115 Q160,130 170,115 Q165,105 155,110 Q150,115 140,115" fill="none" stroke="#333" stroke-width="2" data-area="wing2"/>
      <ellipse cx="170" cy="100" rx="15" ry="30" fill="none" stroke="#333" stroke-width="2" data-area="tail"/>
      <circle cx="105" cy="95" r="3" fill="none" stroke="#333" stroke-width="1" data-area="scale1"/>
      <circle cx="115" cy="100" r="3" fill="none" stroke="#333" stroke-width="1" data-area="scale2"/>
      <circle cx="125" cy="95" r="3" fill="none" stroke="#333" stroke-width="1" data-area="scale3"/>
      <circle cx="105" cy="105" r="3" fill="none" stroke="#333" stroke-width="1" data-area="scale4"/>
      <circle cx="115" cy="110" r="3" fill="none" stroke="#333" stroke-width="1" data-area="scale5"/>
      <circle cx="125" cy="105" r="3" fill="none" stroke="#333" stroke-width="1" data-area="scale6"/>
      <circle cx="135" cy="95" r="2" fill="none" stroke="#333" stroke-width="1" data-area="scale7"/>
      <circle cx="135" cy="105" r="2" fill="none" stroke="#333" stroke-width="1" data-area="scale8"/>
      <circle cx="145" cy="100" r="2" fill="none" stroke="#333" stroke-width="1" data-area="scale9"/>
      <circle cx="155" cy="95" r="2" fill="none" stroke="#333" stroke-width="1" data-area="scale10"/>
      <circle cx="155" cy="105" r="2" fill="none" stroke="#333" stroke-width="1" data-area="scale11"/>
      <circle cx="165" cy="85" r="1.5" fill="none" stroke="#333" stroke-width="1" data-area="scale12"/>
      <circle cx="165" cy="115" r="1.5" fill="none" stroke="#333" stroke-width="1" data-area="scale13"/>
      <circle cx="175" cy="90" r="1.5" fill="none" stroke="#333" stroke-width="1" data-area="scale14"/>
      <circle cx="175" cy="110" r="1.5" fill="none" stroke="#333" stroke-width="1" data-area="scale15"/>
    </svg>`
  },
  {
    id: 'hard_castle',
    name: 'Castelo Encantado',
    description: 'Um castelo com torres e muitos detalhes',
    difficulty: 'HARD',
    icon: '🏰',
    areas: 25,
    recommendedPalette: 'BALANCING',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="120" width="80" height="60" fill="none" stroke="#333" stroke-width="2" data-area="main"/>
      <rect x="40" y="100" width="20" height="80" fill="none" stroke="#333" stroke-width="2" data-area="tower1"/>
      <rect x="140" y="100" width="20" height="80" fill="none" stroke="#333" stroke-width="2" data-area="tower2"/>
      <rect x="90" y="80" width="20" height="100" fill="none" stroke="#333" stroke-width="2" data-area="tower3"/>
      <polygon points="40,100 50,80 60,100" fill="none" stroke="#333" stroke-width="2" data-area="roof1"/>
      <polygon points="140,100 150,80 160,100" fill="none" stroke="#333" stroke-width="2" data-area="roof2"/>
      <polygon points="90,80 100,60 110,80" fill="none" stroke="#333" stroke-width="2" data-area="roof3"/>
      <rect x="85" y="150" width="12" height="20" fill="none" stroke="#333" stroke-width="2" data-area="door"/>
      <rect x="70" y="140" width="8" height="8" fill="none" stroke="#333" stroke-width="2" data-area="window1"/>
      <rect x="122" y="140" width="8" height="8" fill="none" stroke="#333" stroke-width="2" data-area="window2"/>
      <rect x="46" y="130" width="8" height="8" fill="none" stroke="#333" stroke-width="2" data-area="window3"/>
      <rect x="146" y="130" width="8" height="8" fill="none" stroke="#333" stroke-width="2" data-area="window4"/>
      <rect x="96" y="110" width="8" height="8" fill="none" stroke="#333" stroke-width="2" data-area="window5"/>
      <rect x="65" y="160" width="6" height="6" fill="none" stroke="#333" stroke-width="1" data-area="stone1"/>
      <rect x="75" y="160" width="6" height="6" fill="none" stroke="#333" stroke-width="1" data-area="stone2"/>
      <rect x="119" y="160" width="6" height="6" fill="none" stroke="#333" stroke-width="1" data-area="stone3"/>
      <rect x="129" y="160" width="6" height="6" fill="none" stroke="#333" stroke-width="1" data-area="stone4"/>
      <rect x="65" y="170" width="6" height="6" fill="none" stroke="#333" stroke-width="1" data-area="stone5"/>
      <rect x="75" y="170" width="6" height="6" fill="none" stroke="#333" stroke-width="1" data-area="stone6"/>
      <rect x="119" y="170" width="6" height="6" fill="none" stroke="#333" stroke-width="1" data-area="stone7"/>
      <rect x="129" y="170" width="6" height="6" fill="none" stroke="#333" stroke-width="1" data-area="stone8"/>
      <circle cx="50" cy="90" r="2" fill="none" stroke="#333" stroke-width="1" data-area="flag1"/>
      <circle cx="150" cy="90" r="2" fill="none" stroke="#333" stroke-width="1" data-area="flag2"/>
      <circle cx="100" cy="50" r="2" fill="none" stroke="#333" stroke-width="1" data-area="flag3"/>
    </svg>`
  },
  {
    id: 'hard_garden',
    name: 'Jardim Complexo',
    description: 'Um jardim com muitas flores e detalhes',
    difficulty: 'HARD',
    icon: '🌺',
    areas: 25,
    recommendedPalette: 'CALMING',
    svg: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="160" width="180" height="20" fill="none" stroke="#333" stroke-width="2" data-area="ground"/>
      <ellipse cx="50" cy="140" rx="8" ry="20" fill="none" stroke="#333" stroke-width="2" data-area="tree1"/>
      <ellipse cx="150" cy="140" rx="8" ry="20" fill="none" stroke="#333" stroke-width="2" data-area="tree2"/>
      <circle cx="50" cy="120" r="12" fill="none" stroke="#333" stroke-width="2" data-area="crown1"/>
      <circle cx="150" cy="120" r="12" fill="none" stroke="#333" stroke-width="2" data-area="crown2"/>
      <circle cx="80" cy="150" r="8" fill="none" stroke="#333" stroke-width="2" data-area="flower1"/>
      <circle cx="120" cy="150" r="8" fill="none" stroke="#333" stroke-width="2" data-area="flower2"/>
      <circle cx="100" cy="140" r="6" fill="none" stroke="#333" stroke-width="2" data-area="flower3"/>
      <circle cx="70" cy="135" r="5" fill="none" stroke="#333" stroke-width="2" data-area="flower4"/>
      <circle cx="130" cy="135" r="5" fill="none" stroke="#333" stroke-width="2" data-area="flower5"/>
      <circle cx="90" cy="125" r="4" fill="none" stroke="#333" stroke-width="2" data-area="flower6"/>
      <circle cx="110" cy="125" r="4" fill="none" stroke="#333" stroke-width="2" data-area="flower7"/>
      <circle cx="60" cy="145" r="3" fill="none" stroke="#333" stroke-width="1" data-area="bud1"/>
      <circle cx="140" cy="145" r="3" fill="none" stroke="#333" stroke-width="1" data-area="bud2"/>
      <circle cx="85" cy="130" r="2" fill="none" stroke="#333" stroke-width="1" data-area="bud3"/>
      <circle cx="115" cy="130" r="2" fill="none" stroke="#333" stroke-width="1" data-area="bud4"/>
      <circle cx="75" cy="120" r="2" fill="none" stroke="#333" stroke-width="1" data-area="bud5"/>
      <circle cx="125" cy="120" r="2" fill="none" stroke="#333" stroke-width="1" data-area="bud6"/>
      <line x1="80" y1="150" x2="80" y2="160" stroke="#333" stroke-width="2" data-area="stem1"/>
      <line x1="120" y1="150" x2="120" y2="160" stroke="#333" stroke-width="2" data-area="stem2"/>
      <line x1="100" y1="140" x2="100" y2="155" stroke="#333" stroke-width="2" data-area="stem3"/>
      <line x1="70" y1="135" x2="70" y2="150" stroke="#333" stroke-width="1" data-area="stem4"/>
      <line x1="130" y1="135" x2="130" y2="150" stroke="#333" stroke-width="1" data-area="stem5"/>
      <ellipse cx="30" cy="155" rx="8" ry="4" fill="none" stroke="#333" stroke-width="1" data-area="grass1"/>
      <ellipse cx="170" cy="155" rx="8" ry="4" fill="none" stroke="#333" stroke-width="1" data-area="grass2"/>
    </svg>`
  }
];

// Métricas de coloroterapia para análise
export const COLOR_METRICS = {
  therapeutic_benefits: {
    ENERGIZING: { energy: 5, focus: 4, calm: 1, creativity: 3, joy: 4 },
    CALMING: { energy: 1, focus: 3, calm: 5, creativity: 2, joy: 3 },
    BALANCING: { energy: 3, focus: 4, calm: 4, creativity: 3, joy: 3 },
    CREATIVE: { energy: 4, focus: 3, calm: 2, creativity: 5, joy: 4 },
    FOCUS: { energy: 2, focus: 5, calm: 4, creativity: 2, joy: 2 },
    JOY: { energy: 4, focus: 2, calm: 2, creativity: 3, joy: 5 }
  },
  
  usage_patterns: {
    frequent_use: 'Preferência por esta família de cores',
    color_mixing: 'Combinação de diferentes famílias',
    completion_time: 'Tempo gasto colorindo',
    pressure_sensitivity: 'Intensidade da aplicação',
    area_coverage: 'Porcentagem de área colorida'
  }
};

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
