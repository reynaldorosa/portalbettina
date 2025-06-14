import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SelectorContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: var(--space-lg);
`;

const SelectorHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-lg);
`;

const SelectorTitle = styled.h3`
  font-size: var(--font-size-xl);
  color: var(--primary-purple);
  margin: 0 0 var(--space-sm) 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
`;

const SelectorSubtitle = styled.p`
  font-size: var(--font-size-md);
  color: var(--medium-gray);
  margin: 0;
`;

const ModesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

const ModeCard = styled(motion.div)`
  background: ${props => props.$active ? 
    'linear-gradient(135deg, var(--primary-blue), var(--primary-purple))' : 
    'rgba(255, 255, 255, 0.8)'
  };
  color: ${props => props.$active ? 'white' : 'var(--dark-gray)'};
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  cursor: pointer;
  border: 2px solid ${props => props.$active ? 'transparent' : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: ${props => props.$active ? 'var(--shadow-strong)' : 'var(--shadow-light)'};
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-strong);
    border-color: var(--primary-purple);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$active ? 
      'none' : 
      'linear-gradient(135deg, var(--primary-blue), var(--primary-purple)'
    };
    opacity: ${props => props.$active ? 1 : 0};
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &:hover::before {
    opacity: ${props => props.$active ? 1 : 0.1};
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const ModeIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-md);
  display: block;
`;

const ModeTitle = styled.h4`
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin: 0 0 var(--space-sm) 0;
`;

const ModeDescription = styled.p`
  font-size: var(--font-size-sm);
  margin: 0 0 var(--space-md) 0;
  opacity: ${props => props.$active ? 0.9 : 0.7};
  line-height: 1.4;
`;

const ModeFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: var(--font-size-sm);
  opacity: ${props => props.$active ? 0.9 : 0.7};
`;

const ModeFeature = styled.li`
  margin-bottom: var(--space-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);

  &::before {
    content: '✓';
    color: ${props => props.$active ? 'rgba(255, 255, 255, 0.8)' : 'var(--primary-green)'};
    font-weight: bold;
  }
`;

const DifficultyBadge = styled.div`
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'var(--primary-orange)'};
  color: ${props => props.$active ? 'white' : 'white'};
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
`;

const ModeSelector = ({ mode, difficulty, onModeChange, playClick }) => {
  const modes = [
    {
      id: 'free',
      title: 'Pintura Livre',
      icon: '🎨',
      description: 'Solte sua criatividade! Desenhe e pinte livremente sem limitações.',
      features: [
        'Canvas em branco',
        'Todas as cores disponíveis',
        'Sem tempo limite',
        'Salvar suas criações'
      ],
      difficulty: 'Fácil'
    },
    {
      id: 'guided',
      title: 'Pintura Guiada',
      icon: '📋',
      description: 'Pinte seguindo modelos e templates para aprender técnicas.',
      features: [
        'Modelos para seguir',
        'Dicas visuais',
        'Progressão gradual',
        'Feedback positivo'
      ],
      difficulty: 'Médio'
    },
    {
      id: 'challenge',
      title: 'Desafios Criativos',
      icon: '🎯',
      description: 'Complete desafios específicos e desenvolva habilidades artísticas.',
      features: [
        'Objetivos específicos',
        'Múltiplos desafios',
        'Sistema de pontuação',
        'Conquistas desbloqueáveis'
      ],
      difficulty: 'Avançado'
    }
  ];

  const handleModeSelect = (selectedMode) => {
    onModeChange(selectedMode.id);
    playClick();
  };

  return (
    <SelectorContainer>
      <SelectorHeader>
        <SelectorTitle>
          🎨 Escolha seu Modo de Pintura
        </SelectorTitle>
        <SelectorSubtitle>
          Selecione como você gostaria de criar sua arte hoje
        </SelectorSubtitle>
      </SelectorHeader>

      <ModesGrid>
        {modes.map((modeOption) => (
          <ModeCard
            key={modeOption.id}
            $active={mode === modeOption.id}
            onClick={() => handleModeSelect(modeOption)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: modes.indexOf(modeOption) * 0.1 }}
          >
            <DifficultyBadge $active={mode === modeOption.id}>
              {modeOption.difficulty}
            </DifficultyBadge>
            
            <ModeIcon>{modeOption.icon}</ModeIcon>
            
            <ModeTitle>{modeOption.title}</ModeTitle>
            
            <ModeDescription $active={mode === modeOption.id}>
              {modeOption.description}
            </ModeDescription>
            
            <ModeFeatures $active={mode === modeOption.id}>
              {modeOption.features.map((feature, index) => (
                <ModeFeature key={index} $active={mode === modeOption.id}>
                  {feature}
                </ModeFeature>
              ))}
            </ModeFeatures>
          </ModeCard>
        ))}
      </ModesGrid>
    </SelectorContainer>
  );
};

export default ModeSelector;
