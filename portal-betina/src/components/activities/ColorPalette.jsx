import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PaletteContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const PaletteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-sm);
    align-items: stretch;
  }
`;

const PaletteTitle = styled.h3`
  font-size: var(--font-size-lg);
  color: var(--primary-purple);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const SelectedColorDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: rgba(0, 0, 0, 0.05);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-medium);
`;

const SelectedColorSwatch = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 3px solid white;
  box-shadow: var(--shadow-light);
`;

const SelectedColorName = styled.span`
  font-weight: 600;
  color: var(--dark-gray);
`;

const ColorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
    gap: var(--space-xs);
  }
`;

const ColorSwatch = styled(motion.button)`
  aspect-ratio: 1;
  border-radius: 50%;
  background: ${props => props.color};
  border: 3px solid ${props => props.$selected ? 'var(--primary-purple)' : 'white'};
  box-shadow: ${props => props.$selected ? 'var(--shadow-medium)' : 'var(--shadow-light)'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-medium);
  }
  
  &:focus {
    outline: 2px solid var(--primary-purple);
    outline-offset: 2px;
  }
  
  ${props => props.$selected && `
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
  `}
`;

const PaletteSection = styled.div`
  margin-bottom: var(--space-lg);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  font-size: var(--font-size-md);
  color: var(--medium-gray);
  margin: 0 0 var(--space-sm) 0;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
`;

const QuickStats = styled.div`
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
  padding: var(--space-md);
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-medium);
  
  @media (max-width: 768px) {
    gap: var(--space-md);
  }
`;

const StatItem = styled.div`
  text-align: center;
  
  .stat-value {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--primary-purple);
    display: block;
  }
  
  .stat-label {
    font-size: var(--font-size-sm);
    color: var(--medium-gray);
    margin-top: var(--space-xs);
  }
`;

const ColorPalette = ({
  palette,
  selectedColor,
  setSelectedColor,
  difficulty,
  showMetrics,
  sessionStartTime,
  colorsUsed,
  strokeCount,
  brushSize,
  playClick
}) => {
  // Default color palette
  const defaultPalette = [
    { name: 'Preto', color: '#000000', category: 'basic' },
    { name: 'Branco', color: '#FFFFFF', category: 'basic' },
    { name: 'Vermelho', color: '#FF4444', category: 'primary' },
    { name: 'Azul', color: '#4444FF', category: 'primary' },
    { name: 'Amarelo', color: '#FFFF44', category: 'primary' },
    { name: 'Verde', color: '#44FF44', category: 'primary' },
    { name: 'Laranja', color: '#FF8844', category: 'secondary' },
    { name: 'Roxo', color: '#8844FF', category: 'secondary' },
    { name: 'Rosa', color: '#FF44AA', category: 'secondary' },
    { name: 'Marrom', color: '#8B4513', category: 'earth' },
    { name: 'Cinza', color: '#888888', category: 'neutral' },
    { name: 'Verde Escuro', color: '#228B22', category: 'earth' },
    { name: 'Azul Claro', color: '#87CEEB', category: 'pastel' },
    { name: 'Rosa Claro', color: '#FFB6C1', category: 'pastel' },
    { name: 'Amarelo Claro', color: '#FFFFE0', category: 'pastel' },
    { name: 'Lavanda', color: '#E6E6FA', category: 'pastel' }
  ];

  const colors = Array.isArray(palette) ? palette : defaultPalette;

  // Group colors by category
  const colorsByCategory = colors.reduce((acc, color) => {
    if (!acc[color.category]) {
      acc[color.category] = [];
    }
    acc[color.category].push(color);
    return acc;
  }, {});

  const categoryLabels = {
    basic: '⚫ Básicas',
    primary: '🔴 Primárias',
    secondary: '🟠 Secundárias',
    earth: '🟤 Terra',
    neutral: '⚪ Neutras',
    pastel: '🌸 Pastéis'
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color.color);
    playClick();
  };

  const getSelectedColorName = () => {
    const color = colors.find(c => c.color === selectedColor);
    return color ? color.name : 'Cor Personalizada';
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return 0;
    return Math.floor((Date.now() - sessionStartTime) / 1000 / 60);
  };

  return (
    <PaletteContainer>
      <PaletteHeader>
        <PaletteTitle>
          🎨 Paleta de Cores
        </PaletteTitle>
        
        <SelectedColorDisplay>
          <SelectedColorSwatch color={selectedColor} />
          <SelectedColorName>{getSelectedColorName()}</SelectedColorName>
        </SelectedColorDisplay>
      </PaletteHeader>

      {Object.entries(colorsByCategory).map(([category, categoryColors]) => (
        <PaletteSection key={category}>
          <SectionTitle>
            {categoryLabels[category] || category}
          </SectionTitle>
          
          <ColorsGrid>
            {categoryColors.map((color, index) => (
              <ColorSwatch
                key={`${category}-${index}`}
                color={color.color}
                $selected={selectedColor === color.color}
                onClick={() => handleColorSelect(color)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Selecionar cor ${color.name}`}
                title={color.name}
              />
            ))}
          </ColorsGrid>
        </PaletteSection>
      ))}

      {showMetrics && (
        <QuickStats>
          <StatItem>
            <span className="stat-value">{colorsUsed.size}</span>
            <div className="stat-label">Cores Usadas</div>
          </StatItem>
          
          <StatItem>
            <span className="stat-value">{strokeCount}</span>
            <div className="stat-label">Traços</div>
          </StatItem>
          
          <StatItem>
            <span className="stat-value">{brushSize}px</span>
            <div className="stat-label">Pincel</div>
          </StatItem>
          
          <StatItem>
            <span className="stat-value">{getSessionDuration()}min</span>
            <div className="stat-label">Tempo</div>
          </StatItem>
        </QuickStats>
      )}
    </PaletteContainer>
  );
};

export default ColorPalette;
