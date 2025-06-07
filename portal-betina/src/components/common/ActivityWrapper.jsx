import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const WrapperContainer = styled(motion.div)`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-md);
  min-height: calc(100vh - 200px);

  @media (max-width: 768px) {
    padding: var(--space-sm);
  }
`

const ActivityContent = styled.div`
  /* O conteúdo da atividade vai aqui */
  position: relative;
`

function ActivityWrapper({
  title,
  emoji,
  subtitle,
  children
}) {
  return (
    <WrapperContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ActivityContent>
        {children}
      </ActivityContent>
    </WrapperContainer>
  )
}

export default ActivityWrapper
