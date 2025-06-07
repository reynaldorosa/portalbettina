import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import AccessibilityPanel from '../common/AccessibilityPanel'

const FooterContainer = styled(motion.footer)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98));
  backdrop-filter: blur(15px);
  border-top: 2px solid var(--light-gray);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: var(--space-sm) var(--space-md);
  transition: none; /* Sem transição para evitar animações que possam ocultá-lo */
  transform: translateY(0) !important; /* Força o footer a permanecer visível */
  display: block !important; /* Garante que o footer esteja sempre visível */
  visibility: visible !important; /* Certifica-se de que o footer nunca esteja oculto */
`

const FooterToggle = styled(motion.div)`
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(180deg, var(--primary-blue-light, #e0f7ff), rgba(255, 255, 255, 0.95));
  border-radius: var(--radius-medium) var(--radius-medium) 0 0;
  padding: var(--space-xs) var(--space-md);
  border: 2px solid var(--light-gray);
  border-bottom: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--primary-blue);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  z-index: 999;
  
  &:hover {
    background: linear-gradient(180deg, var(--primary-blue), var(--primary-cyan));
    color: white;
    transform: translateX(-50%) translateY(-2px);
  }
  
  &:focus {
    outline: 2px solid var(--primary-orange);
    outline-offset: 2px;
  }
`

const FooterContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`

const NavigationGrid = styled.div`
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  overflow-x: auto;
  
  /* Scroll horizontal suave em dispositivos móveis */
  &::-webkit-scrollbar {
    height: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary-blue);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    gap: var(--space-xs);
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding: 0 var(--space-sm);
  }
  
  @media (max-width: 480px) {
    gap: 2px;
    padding: 0 var(--space-xs);
  }
  
  @media (max-width: 360px) {
    gap: 1px;
    padding: 0 2px;
  }
`

const AccessibilityControls = styled.div`
  display: flex;
  gap: var(--space-sm);
  align-items: center;
`

const AccessibilityButton = styled(motion.button)`
  background: var(--primary-purple);
  color: white;
  border: none;
  border-radius: var(--radius-medium);
  padding: var(--space-xs) var(--space-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  
  &:hover {
    background: var(--primary-blue);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-xs);
    font-size: 10px;
  }
`

const NavButton = styled(motion.button)`
  background: ${props => props.isActive ? 
    'linear-gradient(135deg, var(--primary-blue), var(--primary-cyan))' : 
    props.isSpecial ? 'linear-gradient(135deg, var(--primary-purple), var(--primary-pink))' :
    'white'
  };
  color: ${props => props.isActive || props.isSpecial ? 'white' : 'var(--primary-blue)'};
  border: 2px solid ${props => props.isSpecial ? 'var(--primary-purple)' : 'var(--primary-blue)'};
  border-radius: var(--radius-medium);
  padding: var(--space-xs) var(--space-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 65px;
  min-height: 55px;
  text-align: center;
  position: relative;
  box-shadow: ${props => props.isActive ? 'var(--shadow-medium)' : 'var(--shadow-small)'};
  transition: all 0.2s ease;
  
  ${props => props.isSpecial && `
    box-shadow: 0 0 15px rgba(144, 19, 254, 0.3);
    animation: pulse-accessibility 2s infinite;
  `}
  
  &:hover {
    background: ${props => props.isActive ? 
      'linear-gradient(135deg, var(--primary-blue), var(--primary-cyan))' : 
      props.isSpecial ? 'linear-gradient(135deg, var(--primary-purple), var(--primary-pink))' :
      'linear-gradient(135deg, var(--primary-blue), var(--primary-cyan))'
    };
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
    padding: var(--space-xs);
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
    padding: 2px;
  }
  
  @keyframes pulse-accessibility {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`

const NavIcon = styled.div`
  font-size: 16px;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
  
  @media (max-width: 360px) {
    font-size: 11px;
  }
`

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
`

const activities = [
  { id: 'home', name: 'Início', icon: '🏠', color: 'var(--primary-blue)' },
  { id: 'musical-sequence', name: 'Música', icon: '🎵', color: 'var(--primary-purple)' },
  { id: 'letter-recognition', name: 'Letras', icon: '🔤', color: 'var(--primary-green)' },
  { id: 'number-counting', name: 'Números', icon: '🔢', color: 'var(--primary-orange)' },
  { id: 'memory-game', name: 'Memória', icon: '🧠', color: 'var(--primary-blue)' },
  { id: 'color-match', name: 'Cores', icon: '🌈', color: 'var(--primary-green)' },
  { id: 'image-association', name: 'Imagens', icon: '🧩', color: 'var(--primary-orange)' },
  { id: 'creative-painting', name: 'Pintura', icon: '🎨', color: 'var(--primary-purple)' },
  { id: 'accessibility', name: 'Acessível', icon: '♿', color: 'var(--primary-purple)', isSpecial: true },
  { id: 'admin-panel', name: 'Admin', icon: '🔐', color: 'var(--primary-red)' },
  { id: 'about', name: 'Sobre', icon: 'ℹ️', color: 'var(--primary-blue)' }
]

function Footer({ currentActivity, onActivityChange }) {
  const [showAccessibility, setShowAccessibility] = useState(false)
  
  // Função para lidar com os cliques de atividade
  const handleActivityClick = (activityId) => {
    if (activityId === 'accessibility') {
      setShowAccessibility(true)
    } else {
      onActivityChange(activityId)
    }
  }
  
  return (
    <>
      <FooterContainer>
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
                title={activity.isSpecial ? 'Abrir painel de acessibilidade' : `Ir para ${activity.name}`}
                aria-label={activity.isSpecial ? 'Configurações de acessibilidade' : `Navegar para ${activity.name}`}
              >
                <NavIcon>{activity.icon}</NavIcon>
                <NavLabel>{activity.name}</NavLabel>
              </NavButton>
            ))}
          </NavigationGrid>
        </FooterContent>
      </FooterContainer>

      <AnimatePresence>
        {showAccessibility && (
          <AccessibilityPanel onClose={() => setShowAccessibility(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default Footer
