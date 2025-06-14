/**
 * PADRÕES DE COMPONENTIZAÇÃO - PLATAFORMA BETINA
 * Arquivo de padronização para garantir estrutura uniforme e escalável
 *
 * @version 2.0.0
 * @created 2025-06-05
 * @purpose Auditoria e padronização React da plataforma Betina
 */

// ======================== IMPORTS PADRÃO ========================
// Ordem fixa de imports para todos os componentes de atividade

export const STANDARD_IMPORTS = `
import React, { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'

// Hooks customizados - ordem fixa
import useSound from '../../hooks/useSound.js'
import useProgress from '../../hooks/useProgress.js'
import useUser from '../../hooks/useUser.js'

// Componentes comuns
import ActivityTimer from '../common/ActivityTimer.js'
import { announceToScreenReader, vibrateSuccess, vibrateError, prefersHighContrast, prefersReducedMotion } from '../accessibility/index.js'

// Estilos compartilhados
import {
  GameContainer,
  GameHeader,
  ActivityTitleSection,
  ActivityMainTitle,
  ActivitySubtitle,
  BackButton,
  InstructionText as BaseInstructionText,
  DifficultySelector,
  DifficultyButton,
  ControlButtons,
  ActionButton
} from '../../styles/activityCommon'

// ML Adaptativo
import { createAdaptiveModel, getAdaptiveParameters } from '../adaptive/index.js'
`

// ======================== ESTRUTURA PADRÃO DO COMPONENTE ========================

export const COMPONENT_STRUCTURE = {
  // 1. Constantes e configurações
  THEME_CONSTANTS: `
// Definição de cores temáticas para esta atividade
const THEME_COLOR = 'var(--primary-[COLOR])';
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-[COLOR]), var(--primary-pink))';
`,

  // 2. Configurações de dificuldade padronizadas
  DIFFICULTY_CONFIG: `
const DIFFICULTY_LEVELS = {
  easy: {
    name: 'Fácil',
    description: 'Ideal para iniciantes',
    parameters: {
      // parâmetros específicos da atividade
    }
  },
  medium: {
    name: 'Médio', 
    description: 'Desafio intermediário',
    parameters: {
      // parâmetros específicos da atividade
    }
  },
  hard: {
    name: 'Difícil',
    description: 'Para usuários avançados',
    parameters: {
      // parâmetros específicos da atividade
    }
  }
};
`,

  // 3. Estados padrão obrigatórios
  REQUIRED_STATES: `
  // Estados de jogo obrigatórios
  const [gameStarted, setGameStarted] = useState(false)
  const [difficulty, setDifficulty] = useState('easy')
  const [feedback, setFeedback] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Estados de métricas obrigatórios
  const [sessionMetrics, setSessionMetrics] = useState({
    attempts: 0,
    successes: 0,
    errors: 0,
    timeSpent: 0,
    accuracy: 0
  })
  
  // Estados de acessibilidade obrigatórios
  const [accessibilityMode, setAccessibilityMode] = useState({
    highContrast: false,
    reducedMotion: false,
    screenReader: false
  })
`,

  // 4. Hooks padrão obrigatórios
  REQUIRED_HOOKS: `
  // Hooks obrigatórios - ordem fixa
  const { playClick, playSuccess, playError, playSound } = useSound()
  const { userId, userDetails, loading: userLoading } = useUser()
  const {
    progress,
    startActivity,
    pauseActivity,
    resumeActivity,
    finishActivity,
    recordSuccess,
    recordError,
    saveProgress,
    getCurrentTimeMetrics,
    sessionId,
    isActivityActive,
    isActivityPaused
  } = useProgress('[ACTIVITY_ID]')
`,

  // 5. Refs padrão
  STANDARD_REFS: `
  // Refs para ML adaptativo e métricas
  const adaptiveModelRef = useRef(null)
  const sessionStartRef = useRef(null)
  const lastActionRef = useRef(null)
`,

  // 6. Effects de inicialização padrão
  INITIALIZATION_EFFECTS: `
  // Effect de inicialização de acessibilidade
  useEffect(() => {
    const applyAccessibilitySettings = () => {
      setAccessibilityMode({
        highContrast: prefersHighContrast(),
        reducedMotion: prefersReducedMotion(),
        screenReader: window.speechSynthesis !== undefined
      })
    }
    
    applyAccessibilitySettings()
    window.addEventListener('storage', applyAccessibilitySettings)
    
    return () => window.removeEventListener('storage', applyAccessibilitySettings)
  }, [])
  
  // Effect de inicialização do modelo adaptativo
  useEffect(() => {
    if (userId && !adaptiveModelRef.current) {
      adaptiveModelRef.current = createAdaptiveModel('[ACTIVITY_ID]', userId)
    }
  }, [userId])
  
  // Effect de monitoramento de sessão
  useEffect(() => {
    if (gameStarted && !sessionStartRef.current) {
      sessionStartRef.current = Date.now()
      startActivity()
    }
  }, [gameStarted, startActivity])
`,
}

// ======================== MÉTRICAS PADRONIZADAS ========================

export const METRICS_STANDARDS = {
  // Estrutura obrigatória de métricas
  REQUIRED_METRICS: [
    'sessionId',
    'userId',
    'activityId',
    'difficulty',
    'startTime',
    'endTime',
    'duration',
    'attempts',
    'successes',
    'errors',
    'accuracy',
    'score',
    'adaptiveData',
  ],

  // Função padrão de coleta de métricas
  METRICS_COLLECTION: `
  const collectSessionMetrics = useCallback(() => {
    const endTime = Date.now()
    const duration = sessionStartRef.current ? endTime - sessionStartRef.current : 0
    
    const metrics = {
      sessionId,
      userId,
      activityId: '[ACTIVITY_ID]',
      difficulty,
      startTime: sessionStartRef.current,
      endTime,
      duration,
      attempts: sessionMetrics.attempts,
      successes: sessionMetrics.successes,      errors: sessionMetrics.errors,
      accuracy: sessionMetrics.attempts > 0 ? Math.min(100, (sessionMetrics.successes / sessionMetrics.attempts) * 100) : 0,
      score: sessionMetrics.successes * 10,
      adaptiveData: adaptiveModelRef.current ? adaptiveModelRef.current.getGameHistory() : null
    }
    
    return metrics
  }, [sessionId, userId, difficulty, sessionMetrics])
`,

  // Função padrão de salvamento de progresso
  SAVE_PROGRESS: `
  const handleSaveProgress = useCallback(async () => {
    try {
      const metrics = collectSessionMetrics()
      await saveProgress(metrics)
      
      // Salvar no modelo adaptativo
      if (adaptiveModelRef.current) {
        adaptiveModelRef.current.saveGameData(metrics)
      }
      
      return true
    } catch (error) {
      console.error('Erro ao salvar progresso:', error)
      return false
    }
  }, [collectSessionMetrics, saveProgress])
`,
}

// ======================== ACESSIBILIDADE PADRONIZADA ========================

export const ACCESSIBILITY_STANDARDS = {
  // Funções obrigatórias de acessibilidade
  REQUIRED_FUNCTIONS: `
  const announceGameEvent = useCallback((message, priority = 'polite') => {
    if (accessibilityMode.screenReader) {
      announceToScreenReader(message, priority)
    }
  }, [accessibilityMode.screenReader])
  
  const handleVibration = useCallback((type = 'success') => {
    if ('vibrate' in navigator) {
      if (type === 'success') {
        vibrateSuccess()
      } else if (type === 'error') {
        vibrateError()
      }
    }
  }, [])
  
  const handleKeyboardNavigation = useCallback((event) => {
    // Implementar navegação por teclado específica da atividade
    const { key } = event
    
    switch (key) {
      case 'Escape':
        // Voltar ou pausar
        break
      case 'Enter':
      case ' ':
        // Ação principal
        break
      case 'Tab':
        // Navegação entre elementos
        break
      default:
        break
    }
  }, [])
`,

  // Event listeners padrão
  EVENT_LISTENERS: `
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardNavigation)
    return () => document.removeEventListener('keydown', handleKeyboardNavigation)
  }, [handleKeyboardNavigation])
`,
}

// ======================== DOCKER E API STANDARDS ========================

export const DOCKER_API_STANDARDS = {
  // Configurações de environment para Docker
  DOCKER_ENV_VARS: ['VITE_API_URL', 'VITE_DB_URL', 'VITE_ENVIRONMENT', 'VITE_VERSION'],
  // Estrutura padrão de conexão com API
  API_CONNECTION: `
  // Helper para obter variáveis de ambiente
  const getEnvVar = (varName, defaultValue = '') => {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[varName] || defaultValue;
    }
    if (typeof window !== 'undefined' && window.ENV) {
      return window.ENV[varName] || defaultValue;
    }
    return defaultValue;
  };

  // Verificação de conectividade com API
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetch(getEnvVar('VITE_API_URL', 'http://localhost:3000/api') + '/health')
        if (response.ok) {
          console.log('✅ API conectada com sucesso')
        }
      } catch (error) {
        console.warn('⚠️ API offline, modo local ativado')
      }
    }
      checkApiConnection()
  }, [])
`,

  // Headers padrão para requisições
  API_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Version':
      (typeof process !== 'undefined' && process.env?.REACT_APP_VERSION) || '1.0.0',
  },
}

// ======================== ESCALABILIDADE E IA ========================

export const SCALABILITY_STANDARDS = {
  // Estrutura preparada para IA preditiva
  AI_READY_STRUCTURE: `
  // Preparação para integração com IA preditiva
  const [aiPredictions, setAiPredictions] = useState(null)
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState([])
  
  const prepareDataForAI = useCallback(() => {
    return {
      userProfile: userDetails,
      sessionHistory: adaptiveModelRef.current?.getGameHistory() || [],
      currentMetrics: sessionMetrics,
      contextualData: {
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        sessionLength: Date.now() - (sessionStartRef.current || Date.now())
      }
    }
  }, [userDetails, sessionMetrics])
`,

  // Hooks preparados para expansão
  EXPANSION_HOOKS: `
  // Hooks preparados para funcionalidades futuras
  const [multiplayerSession, setMultiplayerSession] = useState(null)
  const [parentalControls, setParentalControls] = useState({})
  const [therapeuticGoals, setTherapeuticGoals] = useState([])
`,
}

// ======================== TEMPLATE COMPLETO ========================

export const COMPLETE_COMPONENT_TEMPLATE = `
${STANDARD_IMPORTS}

${COMPONENT_STRUCTURE.THEME_CONSTANTS}
${COMPONENT_STRUCTURE.DIFFICULTY_CONFIG}

// Configurações específicas da atividade
const ACTIVITY_CONFIG = {
  id: '[ACTIVITY_ID]',
  name: '[ACTIVITY_NAME]',
  category: '[CATEGORY]',
  minAge: 3,
  maxAge: 12,
  therapeuticFocus: ['cognitive', 'motor', 'social']
};

function [ComponentName]({ onBack }) {
${COMPONENT_STRUCTURE.REQUIRED_STATES}
${COMPONENT_STRUCTURE.REQUIRED_HOOKS}
${COMPONENT_STRUCTURE.STANDARD_REFS}

${ACCESSIBILITY_STANDARDS.REQUIRED_FUNCTIONS}
${METRICS_STANDARDS.METRICS_COLLECTION}
${METRICS_STANDARDS.SAVE_PROGRESS}

${COMPONENT_STRUCTURE.INITIALIZATION_EFFECTS}
${ACCESSIBILITY_STANDARDS.EVENT_LISTENERS}
${DOCKER_API_STANDARDS.API_CONNECTION}

  // Lógica específica da atividade aqui...

  return (
    <GameContainer>
      <GameHeader>
        <BackButton onClick={onBack} aria-label="Voltar ao menu">
          ← Voltar
        </BackButton>
        <ActivityTitleSection>
          <ActivityMainTitle>{ACTIVITY_CONFIG.name}</ActivityMainTitle>
          <ActivitySubtitle>Nível: {DIFFICULTY_LEVELS[difficulty].name}</ActivitySubtitle>
        </ActivityTitleSection>
        <ActivityTimer />
      </GameHeader>
      
      {/* Conteúdo específico da atividade */}
      
    </GameContainer>
  )
}

export default [ComponentName]
`

export default {
  STANDARD_IMPORTS,
  COMPONENT_STRUCTURE,
  METRICS_STANDARDS,
  ACCESSIBILITY_STANDARDS,
  DOCKER_API_STANDARDS,
  SCALABILITY_STANDARDS,
  COMPLETE_COMPONENT_TEMPLATE,
}
