// Estilos comuns para todas as atividades
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const GameContainer = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--radius-large);
  padding: var(--space-md);
  margin: 0;
  box-shadow: var(--shadow-large);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  max-width: 98vw;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  height: 75vh;
  max-height: 75vh;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: var(--space-sm);
    gap: var(--space-xs);
    max-width: 98vw;
    height: 85vh;
    max-height: 85vh;
  }

  @media (min-width: 1024px) and (orientation: landscape) {
    max-width: 98vw;
    padding: var(--space-md);
    gap: var(--space-sm);
    height: 70vh;
    max-height: 70vh;
  }

  @media (min-width: 1366px) and (orientation: landscape) {
    max-width: 96vw;
    padding: var(--space-lg);
    gap: var(--space-md);
    height: 68vh;
    max-height: 68vh;
  }
`;

export const ActivityTitleSection = styled.div`
  text-align: center;
  margin-bottom: var(--space-xl);
  width: 100%;

  @media (max-width: 768px) {
    margin-bottom: var(--space-lg);
  }
`;

export const ActivityMainTitle = styled.h1`
  font-size: var(--font-size-xxl);
  color: var(--primary-blue);
  margin: 0 0 var(--space-sm) 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: var(--font-size-xl);
    flex-direction: column;
    gap: var(--space-xs);
  }

  @media (max-width: 480px) {
    font-size: var(--font-size-lg);
  }
`;

export const ActivitySubtitle = styled.p`
  color: var(--primary-purple);
  font-size: var(--font-size-md);
  margin: 0 0 var(--space-md) 0;
  font-weight: 400;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
  }
`;

export const GameHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: var(--space-lg);
  width: 100%;
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  z-index: 10;

  @media (max-width: 768px) {
    margin-bottom: var(--space-md);
    top: var(--space-sm);
    right: var(--space-sm);
  }
`;

export const GameTitle = styled.h2`
  font-size: var(--font-size-xl);
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-weight: 600;
`;

export const BackButton = styled(motion.button)`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const InstructionText = styled.div`
  color: white;
  text-align: center;
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-lg);
  padding: var(--space-lg);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-medium);
  font-weight: 500;
  width: 100%;
  line-height: 1.5;

  /* Cada atividade definirá seu próprio background com gradiente */

  @media (max-width: 768px) {
    font-size: var(--font-size-md);
    padding: var(--space-md);
    margin-bottom: var(--space-md);
  }
`;

export const DifficultySelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
    max-width: 300px;
  }
`;

export const DifficultyButton = styled(motion.button)`
  background: ${props => props.isActive ?
    `linear-gradient(135deg, ${props.themeColor || 'var(--primary-orange)'}, ${props.themeColor || 'var(--primary-pink)'})` :
    'rgba(255, 255, 255, 0.95)'
  };
  color: ${props => props.isActive ? 'white' : props.themeColor || 'var(--primary-blue)'};
  border: 3px solid ${props => props.isActive ? 'transparent' : props.themeColor || 'var(--primary-orange)'};
  padding: var(--space-lg) var(--space-xl);
  border-radius: var(--radius-large);
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  min-width: 180px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  box-shadow: ${props => props.isActive ? 'var(--shadow-strong)' : 'var(--shadow-medium)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.isActive ?
      'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))' :
      'none'
    };
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: var(--shadow-strong);
    border-color: ${props => props.themeColor || 'var(--primary-orange)'};
    background: ${props => props.isActive ?
      `linear-gradient(135deg, ${props.themeColor || 'var(--primary-orange)'}, ${props.themeColor || 'var(--primary-pink)'})` :
      'rgba(255, 255, 255, 1)'
    };
  }

  &:focus {
    outline: 3px solid ${props => props.themeColor || 'var(--primary-orange)'};
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    min-width: 150px;
    min-height: 100px;
    padding: var(--space-md) var(--space-lg);
  }
`;

export const ControlButtons = styled.div`
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: var(--space-sm);
  }
`;

export const ActionButton = styled(motion.button)`
  background: ${props => props.themeColor || 'var(--primary-green)'};
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-large);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
`;
