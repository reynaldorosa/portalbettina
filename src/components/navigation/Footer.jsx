import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import AccessibilityPanel from '../common/AccessibilityPanel';

// Função reutilizável para gradientes
const getGradient = (type) => {
  switch (type) {
    case 'active':
      return 'linear-gradient(135deg, var(--primary-blue), var(--primary-cyan))';
    case 'special':
      return 'linear-gradient(135deg, var(--primary-purple), var(--primary-pink))';
    case 'accessibility':
      return 'linear-gradient(135deg, #0078d4, #6b48ff)';
    case 'toggle':
      return 'linear-gradient(180deg, var(--primary-blue-light, #e0f7ff), rgba(255, 255, 255, 0.95))';
    default:
      return 'white';
  }
};

const FooterContainer = styled(motion.footer)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98));
  backdrop-filter: blur(15px);
  border-top: 2px solid var(--light-gray);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: var(--space-xs) var(--space-sm) var(--space-xxs);
  overflow-x: hidden;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-xs);

  @media (max-width: 768px) {
    padding: 0 var(--space-xxs);
  }
`;

const NavigationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: var(--space-xs);
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
  padding: var(--space-xs) 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
    gap: var(--space-xxs);
    padding: var(--space-xxs) 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
    gap: 2px;
  }

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--primary-blue);
    border-radius: 4px;
  }
`;

const NavButton = styled(motion.button)`  background: ${({ isActive, isSpecial }) =>
    isActive ? getGradient('active') : isSpecial ? getGradient('accessibility') : 'white'};
  color: ${({ isActive, isSpecial }) => (isActive || isSpecial ? 'white' : 'var(--primary-blue)')};
  border: ${({ isSpecial }) => (isSpecial ? '3px solid #0078d4' : '2px solid var(--primary-blue)')};
  border-radius: var(--radius-medium);
  padding: var(--space-xxs) var(--space-xs) var(--space-xxxs);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  min-width: 60px;
  min-height: 50px;
  text-align: center;
  box-shadow: ${({ isActive }) => (isActive ? 'var(--shadow-medium)' : 'var(--shadow-small)')};
  transition: all 0.2s ease;
  ${({ isSpecial }) =>
    isSpecial &&
    `
    box-shadow: 0 0 12px rgba(144, 19, 254, 0.4);
    animation: pulse-accessibility 3s infinite ease-in-out;
    min-width: 65px;
    min-height: 55px;
    font-size: 13px;
    border-width: 3px;
    position: relative;
    z-index: 1;
    overflow: hidden;
  `}

  &:hover {    background: ${({ isActive, isSpecial }) =>
      isActive ? getGradient('active') : isSpecial ? getGradient('accessibility') : getGradient('active')};
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    min-width: 50px;
    min-height: 45px;
    padding: var(--space-xxs) var(--space-xxs) var(--space-xxxs);
    font-size: 10px;
  }

  @media (max-width: 480px) {
    min-width: 45px;
    min-height: 40px;
    font-size: 9px;
    gap: 1px;
  }

  @media (max-width: 360px) {
    min-width: 40px;
    min-height: 35px;
    font-size: 8px;
    padding: var(--space-xxxs);
  }
  @keyframes pulse-accessibility {
    0% { 
      box-shadow: 0 0 10px rgba(144, 19, 254, 0.4);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 0 16px rgba(144, 19, 254, 0.6); 
      transform: scale(1.03);
    }
    100% { 
      box-shadow: 0 0 10px rgba(144, 19, 254, 0.4);
      transform: scale(1);
    }
  }
`;

const NavIcon = styled.div`
  font-size: 18px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }

  @media (max-width: 360px) {
    font-size: 12px;
  }
`;

const NavLabel = styled.div`
  font-size: inherit;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  @media (max-width: 360px) {
    font-size: 7px;
  }
`;

const activities = [
  { id: 'home', name: 'Início', icon: '🏠', color: 'var(--primary-blue)' },
  { id: 'musical-sequence', name: 'Música', icon: '🎵', color: 'var(--primary-purple)' },
  { id: 'letter-recognition', name: 'Letras', icon: '🔤', color: 'var(--primary-green)' },
  { id: 'number-counting', name: 'Números', icon: '🔢', color: 'var(--primary-orange)' },
  { id: 'memory-game', name: 'Memória', icon: '🧠', color: 'var(--primary-blue)' },
  { id: 'visual-patterns', name: 'Padrões', icon: '🔷', color: 'var(--primary-cyan)' },
  { id: 'emotional-puzzle', name: 'Emoções', icon: '😊', color: 'var(--primary-purple)' },
  { id: 'color-match', name: 'Cores', icon: '🌈', color: 'var(--primary-green)' },
  { id: 'image-association', name: 'Imagens', icon: '🧩', color: 'var(--primary-orange)' },
  { id: 'creative-painting', name: 'Pintura', icon: '🎨', color: 'var(--primary-purple)' },
  { id: 'accessibility', name: 'Acessibilidade', icon: '♿', color: '#0078d4', isSpecial: true },
  { id: 'admin-panel', name: 'Admin', icon: '🔐', color: 'var(--primary-red)' },
  { id: 'about', name: 'Sobre', icon: 'ℹ️', color: 'var(--primary-blue)' },
];

function Footer({ currentActivity, onActivityChange }) {
  const [showAccessibility, setShowAccessibility] = useState(false);

  const handleActivityClick = (activityId) => {
    if (activityId === 'accessibility') {
      setShowAccessibility(true);
    } else {
      onActivityChange(activityId);
    }
  };
  return (
    <>
      <FooterContainer
        role="navigation"
        aria-label="Navegação principal"
      >
        <FooterContent>
          <NavigationGrid>
            {activities.map((activity) => (
              <NavButton
                key={activity.id}
                isActive={currentActivity === activity.id}
                isSpecial={activity.isSpecial}
                onClick={() => handleActivityClick(activity.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: activities.indexOf(activity) * 0.05 }}
                role="button"
                aria-label={activity.isSpecial ? 'Configurações de acessibilidade' : `Navegar para ${activity.name}`}
              aria-pressed={showAccessibility && activity.isSpecial}
              >
                <NavIcon>{activity.icon}</NavIcon>
                <NavLabel>{activity.name}</NavLabel>
              </NavButton>
            ))}
          </NavigationGrid>
        </FooterContent>
      </FooterContainer>
      
      <AnimatePresence>
        {showAccessibility && <AccessibilityPanel onClose={() => setShowAccessibility(false)} />}
      </AnimatePresence>
    </>
  );
}

export default Footer;