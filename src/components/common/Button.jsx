import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const StyledButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: ${props => {
    switch (props.size) {
      case 'small': return '8px 12px';
      case 'large': return '14px 24px';
      default: return '10px 16px';
    }
  }};
  min-height: ${props => {
    switch (props.size) {
      case 'small': return '36px';
      case 'large': return '60px';
      default: return '48px';
    }
  }};
  background: ${props => {
    switch (props.variant) {
      case 'primary': return 'var(--primary-blue)';
      case 'secondary': return 'var(--primary-green)';
      case 'warning': return 'var(--primary-orange)';
      case 'danger': return 'var(--error)';
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return 'var(--primary-blue)';
    }
  }};
  color: ${props => {
    if (props.variant === 'outline' || props.variant === 'ghost') {
      return 'var(--primary-blue)';
    }
    return 'white';
  }};
  border: ${props => {
    if (props.variant === 'outline') {
      return '2px solid var(--primary-blue)';
    }
    return 'none';
  }};
  border-radius: ${props => {
    switch (props.shape) {
      case 'round': return '999px';
      case 'square': return '4px';
      default: return '8px';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '0.875rem';
      case 'large': return '1.125rem';
      default: return '1rem';
    }
  }};
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  touch-action: manipulation;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    background: ${props => {
      switch (props.variant) {
        case 'primary': return 'var(--primary-purple)';
        case 'secondary': return 'var(--success)';
        case 'warning': return '#d19415';
        case 'danger': return '#b71c1c';
        case 'outline': return 'var(--primary-blue)';
        case 'ghost': return 'var(--light-gray)';
        default: return 'var(--primary-purple)';
      }
    }};
    color: ${props => props.variant === 'outline' ? 'white' : props.variant === 'ghost' ? 'var(--primary-blue)' : 'white'};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  ${props => props.loading && `
    position: relative;
    color: transparent !important;
    
    &::after {
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      border: 2px solid transparent;
      border-top-color: ${props.variant === 'outline' || props.variant === 'ghost' ? 'var(--primary-blue)' : 'white'};
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}

  @media (max-width: 1024px) {
    min-height: 52px;
    padding: ${props => {
      switch (props.size) {
        case 'small': return '10px 14px';
        case 'large': return '16px 28px';
        default: return '12px 18px';
      }
    }};
    font-size: ${props => {
      switch (props.size) {
        case 'small': return '0.85rem';
        case 'large': return '1.1rem';
        default: return '0.95rem';
      }
    }};
  }

  @media (max-width: 768px) {
    min-height: 56px;
    gap: 8px;
  }

  @media (orientation: portrait) {
    display: none;
  }
`

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
`

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  shape = 'rounded',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ariaLabel,
  className,
  ...props
}) => {
  const handleClick = React.useCallback((e) => {
    if (loading || disabled) return;
    onClick?.(e);
  }, [loading, disabled, onClick]);

  return (
    <>
      <OrientationMessage>
        Por favor, gire seu dispositivo para a orientação horizontal.
      </OrientationMessage>
      <StyledButton
        variant={variant}
        size={size}
        shape={shape}
        loading={loading}
        disabled={disabled || loading}
        onClick={handleClick}
        type={type}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        className={className}
        whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </StyledButton>
    </>
  )
}

export default Button