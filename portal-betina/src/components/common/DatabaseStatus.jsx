import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.$isConnected ? 'rgba(0, 128, 0, 0.2)' : 'rgba(255, 165, 0, 0.2)'};
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  color: ${props => props.$isConnected ? 'var(--primary-green)' : 'var(--primary-orange)'};
  border: 1px solid ${props => props.$isConnected ? 'var(--primary-green)' : 'var(--primary-orange)'};
  z-index: 1000;
  cursor: pointer;
  
  /* Quando no cabeçalho (header) */
  &.header {
    position: static;
    margin-right: auto; /* Empurra para a esquerda */
  }
  
  /* Quando fixo na tela (modo original) */
  &.fixed {
    position: fixed;
    bottom: 10px;
    right: 10px;
  }
`;

const StatusIndicator = styled(motion.div)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$isConnected ? 'var(--primary-green)' : 'var(--primary-orange)'};
`;

const DatabaseStatus = ({ position = 'fixed' }) => {
  const { isDbConnected } = useUser();
    return (
    <StatusContainer 
      $isConnected={isDbConnected} 
      title={isDbConnected ? 'Banco de dados conectado' : 'Usando armazenamento local'}
      className={position}
    >
      <StatusIndicator 
        $isConnected={isDbConnected}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <span>{isDbConnected ? 'BD Conectado' : 'Modo Local'}</span>
    </StatusContainer>
  );
};

export default DatabaseStatus;
