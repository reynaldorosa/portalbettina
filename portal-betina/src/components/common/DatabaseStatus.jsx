import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';

const StatusContainer = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.$isConnected ? 'rgba(38, 166, 154, 0.15)' : 'rgba(255, 167, 38, 0.15)'};
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => props.$isConnected ? 'var(--primary-green)' : 'var(--primary-orange)'};
  border: 1px solid ${props => props.$isConnected ? 'var(--primary-green)' : 'var(--primary-orange)'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  cursor: default;
  transition: all 0.2s ease;

  &.header {
    position: static;
    margin-right: auto;
  }

  &.fixed {
    position: fixed;
    bottom: 16px;
    right: 16px;
  }

  @media (max-width: 1024px) {
    padding: 5px 10px;
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    &.fixed {
      bottom: 12px;
      right: 12px;
    }
  }

  @media (orientation: portrait) {
    display: none;
  }
`;

const StatusIndicator = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$isConnected ? 'var(--primary-green)' : 'var(--primary-orange)'};
  box-shadow: 0 0 6px ${props => props.$isConnected ? 'rgba(38, 166, 154, 0.4)' : 'rgba(255, 167, 38, 0.4)'};
`;

const StatusText = styled.span`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const OrientationMessage = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px;
  z-index: 9999;

  @media (orientation: portrait) {
    display: flex;
  }
`;

const DatabaseStatus = ({ position = 'fixed' }) => {
  const { isDbConnected, loading } = useUser();

  if (loading) {
    return null;
  }

  return (
    <>
      <OrientationMessage>
        Por favor, gire seu dispositivo para a orientação horizontal.
      </OrientationMessage>
      <StatusContainer
        $isConnected={isDbConnected}
        className={position}
        title={isDbConnected ? 'Banco de dados conectado' : 'Usando armazenamento local'}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        whileHover={{ scale: 1.05 }}
      >
        <StatusIndicator
          $isConnected={isDbConnected}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
        <StatusText>{isDbConnected ? 'Conectado' : 'Offline'}</StatusText>
      </StatusContainer>
    </>
  );
};

export default DatabaseStatus;