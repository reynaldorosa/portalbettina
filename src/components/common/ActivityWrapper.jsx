import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const WrapperContainer = styled(motion.div)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: var(--space-md);
  min-height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: var(--space-sm);
    max-width: 90vw;
  }

  @media (max-width: 768px) {
    padding: var(--space-xs);
    min-height: calc(100vh - 120px);
  }

  @media (orientation: portrait) {
    display: none; /* Oculta o conteúdo em modo retrato */
  }
`

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: var(--space-lg);
  width: 100%;
  justify-content: center;
`

const Title = styled.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-blue);
  font-weight: 600;
  margin: 0;
  text-align: center;

  @media (max-width: 1024px) {
    font-size: var(--font-size-lg);
  }
`

const Emoji = styled.span`
  font-size: var(--font-size-xxl);
  line-height: 1;

  @media (max-width: 1024px) {
    font-size: var(--font-size-xl);
  }
`

const Subtitle = styled.p`
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin: 8px 0 0;
  text-align: center;
  max-width: 80%;

  @media (max-width: 1024px) {
    font-size: var(--font-size-sm);
    max-width: 90%;
  }
`

const ActivityContent = styled.div`
  width: 100%;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
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
  font-size: var(--font-size-lg);
  font-weight: 500;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-md);
  z-index: 9999;

  @media (orientation: portrait) {
    display: flex;
  }
`

function ActivityWrapper({
  title,
  emoji,
  subtitle,
  children
}) {
  return (
    <>
      <OrientationMessage>
        Por favor, gire seu dispositivo para a orientação horizontal para usar esta atividade.
      </OrientationMessage>
      <WrapperContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {(title || emoji) && (
          <HeaderSection>
            {emoji && <Emoji>{emoji}</Emoji>}
            {title && <Title>{title}</Title>}
          </HeaderSection>
        )}
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        <ActivityContent>
          {children}
        </ActivityContent>
      </WrapperContainer>
    </>
  )
}

export default ActivityWrapper