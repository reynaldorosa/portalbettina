import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const StyledButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  
  /* Tamanho */
  padding: ${props => {
    switch (props.size) {
      case 'small': return 'var(--space-xs) var(--space-sm)'
      case 'large': return 'var(--space-md) var(--space-xl)'
      default: return 'var(--space-sm) var(--space-md)'
    }
  }};
  
  min-height: ${props => {
    switch (props.size) {
      case 'small': return '32px'
      case 'large': return '56px'
      default: return '44px' /* Tamanho mínimo para acessibilidade */
    }
  }};
  
  /* Estilo */
  background: ${props => {
    switch (props.variant) {
      case 'primary': return 'var(--primary-blue)'
      case 'secondary': return 'var(--primary-green)'
      case 'warning': return 'var(--primary-orange)'
      case 'danger': return 'var(--error)'
      case 'outline': return 'transparent'
      case 'ghost': return 'transparent'
      default: return 'var(--primary-blue)'
    }
  }};
  
  color: ${props => {
    if (props.variant === 'outline' || props.variant === 'ghost') {
      return 'var(--primary-blue)'
    }
    return 'white'
  }};
  
  border: ${props => {
    if (props.variant === 'outline') {
      return '2px solid var(--primary-blue)'
    }
    return 'none'
  }};
  
  border-radius: ${props => {
    switch (props.shape) {
      case 'round': return 'var(--radius-round)'
      case 'square': return 'var(--radius-small)'
      default: return 'var(--radius-medium)'
    }
  }};
  
  font-size: ${props => {
    switch (props.size) {
      case 'small': return 'var(--font-size-sm)'
      case 'large': return 'var(--font-size-lg)'
      default: return 'var(--font-size-md)'
    }
  }};
  
  font-weight: 600;
  font-family: var(--font-family);
  cursor: pointer;
  user-select: none;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-light);
  
  /* Estados */
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--shadow-medium);
    
    background: ${props => {
      switch (props.variant) {
        case 'primary': return 'var(--primary-purple)'
        case 'secondary': return 'var(--success)'
        case 'warning': return '#e8a317'
        case 'danger': return '#c82333'
        case 'outline': return 'var(--primary-blue)'
        case 'ghost': return 'var(--light-gray)'
        default: return 'var(--primary-purple)'
      }
    }};
    
    color: ${props => {
      if (props.variant === 'outline') {
        return 'white'
      }
      return props.variant === 'ghost' ? 'var(--primary-blue)' : 'white'
    }};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-light);
  }
  
  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Animações especiais */
  ${props => props.loading && `
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
  
  /* Responsividade */
  @media (max-width: 768px) {
    min-height: 48px; /* Maior área de toque em mobile */
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
  const handleClick = (e) => {
    if (loading || disabled) return
    if (onClick) onClick(e)
  }

  return (
    <StyledButton
      variant={variant}
      size={size}
      shape={shape}
      loading={loading}
      disabled={disabled || loading}
      onClick={handleClick}
      type={type}
      aria-label={ariaLabel}
      className={className}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {children}
    </StyledButton>
  )
}

export default Button
