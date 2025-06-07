import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FeedbackOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
`;

const FeedbackCard = styled(motion.div)`
  background: white;
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  box-shadow: var(--shadow-strong);
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
  border: 3px solid ${props => {
    switch (props.type) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--error)';
      case 'warning': return 'var(--warning)';
      case 'info': return 'var(--info)';
      default: return 'var(--primary-purple)';
    }
  }};
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  cursor: pointer;
  color: var(--medium-gray);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: var(--dark-gray);
  }
`;

const FeedbackIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--space-lg);
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `
          color: var(--success);
          &::before { content: '🎉'; }
        `;
      case 'error':
        return `
          color: var(--error);
          &::before { content: '😔'; }
        `;
      case 'warning':
        return `
          color: var(--warning);
          &::before { content: '⚠️'; }
        `;
      case 'info':
        return `
          color: var(--info);
          &::before { content: 'ℹ️'; }
        `;
      default:
        return `
          color: var(--primary-purple);
          &::before { content: '🎨'; }
        `;
    }
  }}
`;

const FeedbackTitle = styled.h3`
  font-size: var(--font-size-xl);
  color: ${props => {
    switch (props.type) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--error)';
      case 'warning': return 'var(--warning)';
      case 'info': return 'var(--info)';
      default: return 'var(--primary-purple)';
    }
  }};
  margin: 0 0 var(--space-md) 0;
  font-weight: 700;
`;

const FeedbackMessage = styled.p`
  font-size: var(--font-size-md);
  color: var(--dark-gray);
  margin: 0 0 var(--space-lg) 0;
  line-height: 1.5;
`;

const FeedbackActions = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  background: ${props => {
    switch (props.variant) {
      case 'primary': return 'var(--primary-purple)';
      case 'success': return 'var(--success)';
      case 'secondary': return 'var(--medium-gray)';
      default: return 'var(--primary-purple)';
    }
  }};
  color: white;
  border: none;
  border-radius: var(--radius-medium);
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FeedbackComponent = ({ feedback, reducedMotion, onClose }) => {
  useEffect(() => {
    // Auto-close success messages after 3 seconds
    if (feedback.type === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [feedback.type, onClose]);

  useEffect(() => {
    // Prevent body scroll when feedback is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getFeedbackTitle = () => {
    switch (feedback.type) {
      case 'success':
        return 'Parabéns!';
      case 'error':
        return 'Ops!';
      case 'warning':
        return 'Atenção!';
      case 'info':
        return 'Informação';
      default:
        return 'Feedback';
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <FeedbackOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.3 }}
      onClick={handleOverlayClick}
    >
      <FeedbackCard
        type={feedback.type}
        initial={reducedMotion ? {} : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={reducedMotion ? {} : { scale: 0.8, opacity: 0 }}
        transition={reducedMotion ? { duration: 0 } : { 
          type: 'spring', 
          damping: 25, 
          stiffness: 300 
        }}
      >
        <CloseButton onClick={onClose} aria-label="Fechar feedback">
          ✕
        </CloseButton>

        <FeedbackIcon type={feedback.type} />

        <FeedbackTitle type={feedback.type}>
          {getFeedbackTitle()}
        </FeedbackTitle>

        <FeedbackMessage>
          {feedback.message}
        </FeedbackMessage>

        <FeedbackActions>
          {feedback.actions ? (
            feedback.actions.map((action, index) => (
              <ActionButton
                key={index}
                variant={action.variant || 'primary'}
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                whileHover={reducedMotion ? {} : { scale: 1.05 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
              >
                {action.label}
              </ActionButton>
            ))
          ) : (
            <ActionButton
              variant="primary"
              onClick={onClose}
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
            >
              Entendi
            </ActionButton>
          )}
        </FeedbackActions>
      </FeedbackCard>
    </FeedbackOverlay>
  );
};

export default FeedbackComponent;
