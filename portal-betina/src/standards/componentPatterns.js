/**
 * PADRÕES DE COMPONENTIZAÇÃO PADRONIZADOS
 * Plataforma BETINA - Estruturas Uniformes e Escaláveis
 * 
 * Este arquivo define padrões consistentes para:
 * - Estrutura de componentes React
 * - Coleta padronizada de métricas
 * - Conectividade com API e dashboard
 * - Preparação para expansão com IA
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'

// =============== ESTRUTURA PADRONIZADA DE IMPORTS ===============
export const STANDARD_IMPORTS = {
  react: 'React, { useState, useEffect, useRef, useCallback }',
  styling: 'styled, motion, AnimatePresence',
  hooks: 'useSound, useProgress, useUser',
  services: 'databaseService, adaptiveML',
  utils: 'accessibility, constants',
  common: 'ActivityWrapper, ActivityTimer'
}

// =============== ESTRUTURA PADRONIZADA DE ESTADO ===============
export const createStandardState = (activityType) => ({
  // Estados de jogo
  gameStarted: false,
  gameCompleted: false,
  isLoading: false,
  isPaused: false,
  
  // Estados de UI
  difficulty: 'EASY',
  showInstructions: true,
  showMetrics: false,
  feedback: null,
  
  // Estados de dados
  score: 0,
  attempts: 0,
  correctAnswers: 0,
  sessionStartTime: null,
  sessionData: [],
  
  // Estados específicos por atividade
  ...getActivitySpecificState(activityType)
})

const getActivitySpecificState = (type) => {
  const states = {
    'memory-game': {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      moves: 0
    },
    'color-match': {
      targetColor: null,
      availableColors: [],
      selectedColor: null
    },
    'creative-painting': {
      canvas: null,
      selectedColor: '#000000',
      brushSize: 10,
      strokeCount: 0,
      colorsUsed: new Set()
    },
    'number-counting': {
      targetNumber: 0,
      objects: [],
      countedObjects: [],
      userAnswer: null
    }
  }
  return states[type] || {}
}

// =============== HOOKS PADRONIZADOS ===============
export const useStandardHooks = (activityId, userId) => {
  const { playClick, playSuccess, playError } = useSound()
  const { recordSuccess, getCurrentTimeMetrics } = useProgress(activityId)
  const { user, isDbConnected } = useUser()
  const adaptiveModel = useRef(null)
  
  return {
    playClick,
    playSuccess, 
    playError,
    recordSuccess,
    getCurrentTimeMetrics,
    user,
    isDbConnected,
    adaptiveModel
  }
}

// =============== COLETA PADRONIZADA DE MÉTRICAS ===============
export const StandardMetricsCollector = {
  // Métricas básicas para todas as atividades
  collectBaseMetrics: (state, startTime) => ({
    sessionId: generateSessionId(),
    userId: state.userId,
    activityId: state.activityId,
    difficulty: state.difficulty,
    score: state.score,
    accuracy: calculateAccuracy(state.correctAnswers, state.attempts),
    timeSpent: startTime ? Date.now() - startTime : 0,
    attempts: state.attempts,
    correctAnswers: state.correctAnswers,
    timestamp: new Date().toISOString(),
    deviceInfo: getDeviceInfo(),
    accessibilityFeatures: getActiveAccessibilityFeatures()
  }),

  // Métricas específicas por atividade
  collectActivityMetrics: (activityType, state) => {
    const collectors = {
      'memory-game': () => ({
        moves: state.moves,
        matchedPairs: state.matchedPairs,
        totalPairs: state.cards.length / 2,
        memoryEfficiency: state.matchedPairs / state.moves
      }),
      'color-match': () => ({
        colorAccuracy: state.colorAccuracy,
        responseTime: state.averageResponseTime,
        colorBlindnessSupport: state.useColorBlindSupport
      }),
      'creative-painting': () => ({
        strokeCount: state.strokeCount,
        colorsUsed: state.colorsUsed.size,
        canvasComplexity: calculateCanvasComplexity(state.canvas),
        creativity: calculateCreativityScore(state)
      }),
      'number-counting': () => ({
        countingAccuracy: state.countingAccuracy,
        numberRange: state.numberRange,
        visualProcessing: state.visualProcessingScore
      })
    }
    
    return collectors[activityType] ? collectors[activityType]() : {}
  },

  // Enviar métricas para dashboard e API
  async sendMetrics(baseMetrics, activityMetrics, userId) {
    const combinedMetrics = {
      ...baseMetrics,
      ...activityMetrics,
      adaptiveInsights: await this.getAdaptiveInsights(userId, baseMetrics)
    }
    
    try {
      // Enviar para database local
      await databaseService.saveSession(combinedMetrics)
      
      // Enviar para API externa (se disponível)
      if (window.BETINA_CONFIG?.externalAPI) {
        await fetch(window.BETINA_CONFIG.externalAPI + '/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(combinedMetrics)
        })
      }
      
      // Atualizar modelo adaptativo
      if (window.adaptiveML && userId) {
        await window.adaptiveML.updateModel(userId, combinedMetrics)
      }
      
      return combinedMetrics
    } catch (error) {
      console.error('Erro ao enviar métricas:', error)
      return null
    }
  },

  // Gerar insights adaptativos
  async getAdaptiveInsights(userId, metrics) {
    try {
      if (!window.adaptiveML || !userId) return null
      
      return await window.adaptiveML.generateInsights(userId, metrics)
    } catch (error) {
      console.error('Erro ao gerar insights adaptativos:', error)
      return null
    }
  }
}

// =============== ESTRUTURA PADRONIZADA DE COMPONENTE ===============
export const StandardActivityStructure = {
  // Template de estrutura JSX
  getJSXStructure: () => `
    <GameContainer>
      <GameHeader>
        <ActivityTitleSection>
          <BackButton onClick={onBack}>⬅️ Voltar</BackButton>
          <ActivityMainTitle>{activityConfig.title}</ActivityMainTitle>
          <ActivitySubtitle>{activityConfig.subtitle}</ActivitySubtitle>
        </ActivityTitleSection>
        <DatabaseStatus />
      </GameHeader>

      {showInstructions && (
        <InstructionText>
          <p>{activityConfig.instructions}</p>
          <ActionButton onClick={startGame}>
            🎮 Começar Atividade
          </ActionButton>
        </InstructionText>
      )}

      {gameStarted && (
        <>
          <DifficultySelector>
            {difficulties.map(diff => (
              <DifficultyButton 
                key={diff.id}
                active={difficulty === diff.id}
                onClick={() => setDifficulty(diff.id)}
              >
                {diff.icon} {diff.name}
              </DifficultyButton>
            ))}
          </DifficultySelector>

          <ActivityTimer 
            isActive={gameStarted && !gameCompleted}
            onTimeUpdate={handleTimeUpdate}
          />

          {/* ÁREA ESPECÍFICA DA ATIVIDADE */}
          <ActivityGameArea>
            {renderActivityContent()}
          </ActivityGameArea>

          {/* PAINEL DE MÉTRICAS */}
          {showMetrics && (
            <MetricsPanel>
              {renderMetrics()}
            </MetricsPanel>
          )}
        </>
      )}

      {feedback && (
        <FeedbackModal>
          {renderFeedback()}
        </FeedbackModal>
      )}
    </GameContainer>
  `,

  // Configuração padrão de dificuldades
  standardDifficulties: [
    { 
      id: 'EASY', 
      name: 'Fácil', 
      icon: '😊',
      description: 'Ideal para iniciantes',
      params: { time: 60, complexity: 1 }
    },
    { 
      id: 'MEDIUM', 
      name: 'Médio', 
      icon: '🤔',
      description: 'Desafio equilibrado',
      params: { time: 45, complexity: 2 }
    },
    { 
      id: 'HARD', 
      name: 'Difícil', 
      icon: '🧠',
      description: 'Para experts',
      params: { time: 30, complexity: 3 }
    }
  ]
}

// =============== ESTILOS PADRONIZADOS ===============
export const StandardStyles = {
  // Container principal padronizado
  ActivityContainer: styled.div`
    min-height: 100vh;
    padding: var(--space-lg);
    background: var(--gradient-bg);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    
    @media (max-width: 768px) {
      padding: var(--space-md);
      gap: var(--space-md);
    }
  `,

  // Área de jogo padronizada
  GameArea: styled.div`
    background: rgba(255, 255, 255, 0.95);
    border-radius: var(--radius-large);
    padding: var(--space-xl);
    box-shadow: var(--shadow-medium);
    min-height: 400px;
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    
    @media (max-width: 768px) {
      padding: var(--space-lg);
      min-height: 300px;
    }
  `,

  // Painel de métricas padronizado
  MetricsPanel: styled.div`
    background: var(--surface-secondary);
    border-radius: var(--radius-medium);
    padding: var(--space-lg);
    border-left: 4px solid var(--primary-blue);
    
    h3 {
      margin: 0 0 var(--space-md) 0;
      color: var(--primary-blue);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
  `,

  // Item de métrica padronizado
  MetricItem: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm) 0;
    border-bottom: 1px solid var(--border-light);
    
    &:last-child {
      border-bottom: none;
    }
    
    .metric-label {
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .metric-value {
      color: var(--text-primary);
      font-weight: 600;
    }
  `,

  // Feedback modal padronizado
  FeedbackModal: styled(motion.div)`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: var(--radius-large);
    padding: var(--space-xl);
    box-shadow: var(--shadow-strong);
    z-index: 1000;
    min-width: 300px;
    text-align: center;
  `
}

// =============== UTILITÁRIOS AUXILIARES ===============
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const calculateAccuracy = (correct, total) => total > 0 ? (correct / total) * 100 : 0

const getDeviceInfo = () => ({
  userAgent: navigator.userAgent,
  screenWidth: window.screen.width,
  screenHeight: window.screen.height,
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
  touchSupport: 'ontouchstart' in window
})

const getActiveAccessibilityFeatures = () => ({
  highContrast: document.body.classList.contains('high-contrast'),
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  screenReader: navigator.userAgent.includes('NVDA') || navigator.userAgent.includes('JAWS')
})

const calculateCanvasComplexity = (canvas) => {
  if (!canvas) return 0
  // Implementar análise de complexidade do canvas
  return Math.random() * 100 // Placeholder
}

const calculateCreativityScore = (state) => {
  if (!state.colorsUsed || !state.strokeCount) return 0
  
  const colorDiversity = state.colorsUsed.size * 10
  const strokeComplexity = Math.min(state.strokeCount / 5, 20)
  
  return Math.min(colorDiversity + strokeComplexity, 100)
}

// =============== EXPORTAÇÕES ===============
export default {
  STANDARD_IMPORTS,
  createStandardState,
  useStandardHooks,
  StandardMetricsCollector,
  StandardActivityStructure,
  StandardStyles
}
