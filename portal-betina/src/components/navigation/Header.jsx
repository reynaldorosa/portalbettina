import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { toggleHighContrast } from '../../utils/accessibility/index.js'
import DatabaseStatus from '../common/DatabaseStatus'

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-light);
  position: sticky;
  top: 0;
  z-index: 100;
`

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  position: relative;

  @media (max-width: 768px) {
    padding: var(--space-sm);
    gap: var(--space-sm);
  }

  @media (max-width: 480px) {
    padding: var(--space-xs);
    gap: var(--space-xs);
  }
`

const HeaderSection = styled.div`
  flex: 1;
  display: flex;
`

const LeftSection = styled(HeaderSection)`
  justify-content: flex-start;
`

const CenterSection = styled(HeaderSection)`
  justify-content: center;
  flex: 2;
`

const RightSection = styled(HeaderSection)`
  justify-content: flex-end;
`

const WelcomeTitle = styled(motion.h1)`
  font-size: calc(var(--font-size-xl) * 1.3); /* Aumentado em 30% */
  color: var(--primary-blue);
  margin: 0;
  text-align: center;
  cursor: pointer;
  font-weight: 700; /* Aumentado de 600 para 700 */
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  &:hover {
    color: var(--primary-purple);
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    font-size: calc(var(--font-size-lg) * 1.3);
  }

  @media (max-width: 480px) {
    font-size: calc(var(--font-size-md) * 1.3);
  }
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
`

const Subtitle = styled(motion.h2)`
  font-size: var(--font-size-md);
  color: var(--primary-purple);
  margin: 0;
  text-align: center;
  font-weight: 400;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
  }

  @media (max-width: 480px) {
    font-size: var(--font-size-xs);
  }
`

const AccessibilitySection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`

const AccessibilityButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--primary-blue);
  border-radius: var(--radius-medium);
  padding: var(--space-sm);
  cursor: pointer;
  color: var(--primary-blue);
  font-size: 18px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-light);

  &:hover {
    background: var(--primary-blue);
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  &:focus {
    outline: 3px solid var(--primary-orange);
    outline-offset: 2px;
  }
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
    padding: var(--space-xs);
  }
`

function Header({ onLogoClick }) {
  const handleAccessibilityClick = () => {
    toggleHighContrast()
  }
  return (
    <HeaderContainer>
      {' '}
      <HeaderContent>
        <LeftSection>
          <DatabaseStatus position="header" />
        </LeftSection>

        <CenterSection>
          <WelcomeTitle
            onClick={onLogoClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="Clique para voltar ao início"
          >
            🌟 Bem-vindos ao Portal Bettina! 🌟
          </WelcomeTitle>
        </CenterSection>

        <RightSection>
          <AccessibilitySection>
            <AccessibilityButton
              onClick={handleAccessibilityClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Alternar Alto Contraste - Acessibilidade"
              aria-label="Botão de acessibilidade para alternar alto contraste"
            >
              👁️
            </AccessibilityButton>
          </AccessibilitySection>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  )
}

export default Header
