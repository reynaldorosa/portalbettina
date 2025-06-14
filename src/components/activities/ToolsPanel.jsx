import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ActionButton } from '../../styles/activityCommon';

const PanelContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  height: fit-content;
`;

const TabContainer = styled.div`
  display: flex;
  border-radius: var(--radius-medium);
  background: rgba(0, 0, 0, 0.05);
  padding: var(--space-xs);
  gap: var(--space-xs);
`;

const Tab = styled(motion.button)`
  flex: 1;
  padding: var(--space-sm);
  border: none;
  border-radius: var(--radius-small);
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? 'var(--primary-purple)' : 'var(--medium-gray)'};
  font-weight: ${props => props.$active ? '600' : '400'};
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.$active ? 'var(--shadow-light)' : 'none'};

  &:hover {
    background: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  }
`;

const TabContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-md);
  color: var(--primary-purple);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const BrushSizeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const BrushSizeSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, var(--primary-blue), var(--primary-purple));
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    box-shadow: var(--shadow-medium);
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    box-shadow: var(--shadow-medium);
    cursor: pointer;
    border: none;
  }
`;

const BrushPreview = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  margin: 0 auto;
  border: 2px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
`;

const TemplateCard = styled(motion.div)`
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  font-size: 2rem;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    border-color: var(--primary-purple);
  }
`;

const ChallengeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const ChallengeCard = styled(motion.div)`
  padding: var(--space-md);
  background: rgba(0, 0, 0, 0.05);
  border-radius: var(--radius-medium);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    border-color: var(--primary-purple);
  }

  .challenge-title {
    font-weight: 600;
    color: var(--primary-purple);
    margin-bottom: var(--space-xs);
  }

  .challenge-description {
    font-size: var(--font-size-sm);
    color: var(--medium-gray);
  }
`;

const ToolsPanel = ({
  mode,
  difficulty,
  brushSize,
  setBrushSize,
  selectedColor,
  activeTab,
  setActiveTab,
  selectTemplate,
  selectChallenge,
  playClick
}) => {
  const tabs = [
    { id: 'brush', label: '🖌️ Pincel', icon: '🖌️' },
    { id: 'templates', label: '📋 Modelos', icon: '📋' },
    { id: 'challenges', label: '🎯 Desafios', icon: '🎯' }
  ];

  const templates = [
    { id: 1, name: 'Casa', icon: '🏠', type: 'simple' },
    { id: 2, name: 'Árvore', icon: '🌳', type: 'nature' },
    { id: 3, name: 'Sol', icon: '☀️', type: 'simple' },
    { id: 4, name: 'Flor', icon: '🌸', type: 'nature' },
    { id: 5, name: 'Carro', icon: '🚗', type: 'vehicle' },
    { id: 6, name: 'Gato', icon: '🐱', type: 'animal' }
  ];

  const challenges = [
    {
      id: 1,
      title: 'Paisagem Colorida',
      description: 'Desenhe uma paisagem usando pelo menos 5 cores diferentes',
      difficulty: 'easy'
    },
    {
      id: 2,
      title: 'Retrato Criativo',
      description: 'Crie um autorretrato usando formas geométricas',
      difficulty: 'medium'
    },
    {
      id: 3,
      title: 'Arte Abstrata',
      description: 'Expresse suas emoções através de cores e formas livres',
      difficulty: 'hard'
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    playClick();
  };

  const handleTemplateSelect = (template) => {
    selectTemplate(template);
    playClick();
  };

  const handleChallengeSelect = (challenge) => {
    selectChallenge(challenge);
    playClick();
  };

  const renderBrushTools = () => (
    <TabContent
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SectionTitle>
        🖌️ Configurações do Pincel
      </SectionTitle>
      
      <BrushSizeContainer>
        <label htmlFor="brush-size">Tamanho do Pincel: {brushSize}px</label>
        <BrushSizeSlider
          id="brush-size"
          type="range"
          min="2"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
        />
        <BrushPreview size={brushSize} color={selectedColor} />
      </BrushSizeContainer>
    </TabContent>
  );

  const renderTemplates = () => (
    <TabContent
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SectionTitle>
        📋 Modelos para Pintar
      </SectionTitle>
      
      <TemplateGrid>
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {template.icon}
          </TemplateCard>
        ))}
      </TemplateGrid>
    </TabContent>
  );

  const renderChallenges = () => (
    <TabContent
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SectionTitle>
        🎯 Desafios Criativos
      </SectionTitle>
      
      <ChallengeList>
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            onClick={() => handleChallengeSelect(challenge)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="challenge-title">{challenge.title}</div>
            <div className="challenge-description">{challenge.description}</div>
          </ChallengeCard>
        ))}
      </ChallengeList>
    </TabContent>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'brush':
        return renderBrushTools();
      case 'templates':
        return renderTemplates();
      case 'challenges':
        return renderChallenges();
      default:
        return renderBrushTools();
    }
  };

  return (
    <PanelContainer>
      <TabContainer>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon}
          </Tab>
        ))}
      </TabContainer>

      {renderTabContent()}
    </PanelContainer>
  );
};

export default ToolsPanel;
