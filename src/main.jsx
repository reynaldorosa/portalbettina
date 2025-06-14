import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from 'styled-components'
import i18n from './utils/shared/i18n'
import { UserProvider } from './contexts/UserContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import GlobalStyles from './styles/global'
import { lightTheme, darkTheme } from './styles/themes'
import './styles/reset.css'
import logger from './utils/logger'

// Importar o SystemOrchestrator Terapêutico (CORRIGIDO)
import {
  initializeSystem,
  setSystemMode,
  getSystemOrchestrator,
} from './utils/core/SystemOrchestrator.js'
import { OPERATION_MODES } from './utils/core/SystemOrchestrator.js'

// Helper para obter variáveis de ambiente compatível com Node.js e browser
function getEnvVar(varName, defaultValue = '') {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[varName] || defaultValue;
  }
  if (typeof window !== 'undefined' && window.ENV) {
    return window.ENV[varName] || defaultValue;
  }
  return defaultValue;
}

// Lazy load do App para otimizar o carregamento inicial
const App = lazy(() => import('./App'))

// Configuração do react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: parseInt(getEnvVar('VITE_API_RETRY_ATTEMPTS', '3')) || 3,
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 30 * 60 * 1000, // 30 minutos
      refetchOnWindowFocus: false,
    },
  },
})

// Cloud Nandrophic: Sistema de terapia para autismo integrado completo
const initializeAutismTherapySystem = async () => {
  logger.info('🧠 CLOUD NANDROPHIC: Inicializando sistema completo de terapia para autismo')

  try {
    // Inicializar SystemOrchestrator integrado (novos + existentes)
    await initializeSystem()
    setSystemMode(OPERATION_MODES.PRODUCTION)

    const orchestrator = getSystemOrchestrator()

    // Initialize real-time metrics collection
    if (typeof window !== 'undefined') {
      window.autismTherapyMetrics = {
        sessionStart: Date.now(),
        cognitiveLoad: 'optimal',
        sensoryEnvironment: 'controlled',
        adaptiveParameters: 'active',
        systemOrchestrator: orchestrator,
      }

      // Integrar sistemas existentes globalmente
      window.portalBetinaSystem = {
        orchestrator,
        utils: await import('./utils/index.js'),
        startSession: (sessionId, gameId, userId, options) =>
          orchestrator.startUnifiedSession(sessionId, gameId, userId, options),
        finishSession: (sessionId, additionalData) =>
          orchestrator.finishUnifiedSession(sessionId, additionalData),
        getStats: () => orchestrator.getUnifiedStatistics(),
      }

      // Real-time sensory monitoring
      window.addEventListener('beforeunload', () => {
        const sessionDuration = Date.now() - window.autismTherapyMetrics.sessionStart
        logger.info('🎯 Sessão completa:', {
          duration: sessionDuration,
          systemStats: orchestrator.getUnifiedStatistics(),
        })
      })

      logger.info('✅ Sistema completo de terapia inicializado com sucesso', {
        componentsActive: orchestrator.components.size,
        integrationsActive: orchestrator.integrations.size,
      })
    }
  } catch (error) {
    logger.error('❌ Erro ao inicializar sistema de terapia:', error)
    // Continuar mesmo com erro para não quebrar a aplicação
  }
}

const initializeAppComplete = async () => {
  try {    // Inicializar sistema de terapia completo
    await initializeAutismTherapySystem();
    
    logger.info('🎉 Portal Betina inicializado completamente', {
      environment: getEnvVar('MODE', 'development'),
      systemMode: (getEnvVar('NODE_ENV') === 'development' || getEnvVar('MODE') === 'development') ? 'DEVELOPMENT' : 'PRODUCTION',
      integratedSystems:
        typeof window !== 'undefined' && window.portalBetinaSystem ? 'ATIVO' : 'INATIVO',
    })
  } catch (error) {
    logger.error('❌ Erro na inicialização da aplicação:', error)
  }
}

// Configuração de tema baseado na preferência do usuário
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) return savedTheme === 'dark' ? darkTheme : lightTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme
}

// Inicialização da aplicação
const bootstrap = async () => {
  try {
    // Inicializar sistemas completos primeiro
    await initializeAppComplete()    // Sistema modular - inicializar após sistemas base
    const isDevelopment = getEnvVar('NODE_ENV') === 'development' || getEnvVar('MODE') === 'development';
    setSystemMode(isDevelopment ? OPERATION_MODES.DEVELOPMENT : OPERATION_MODES.PRODUCTION);
    await initializeAutismTherapySystem()
    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <HelmetProvider>
            <I18nextProvider i18n={i18n}>
              <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={getInitialTheme()}>
                  <UserProvider>
                    <Suspense fallback={<div>Loading...</div>}>
                      <App />
                    </Suspense>
                    <GlobalStyles />
                  </UserProvider>
                </ThemeProvider>
              </QueryClientProvider>
            </I18nextProvider>
          </HelmetProvider>
        </ErrorBoundary>      </React.StrictMode>
    );
    
    logger.info('Aplicação inicializada com sucesso', {
      environment: getEnvVar('VITE_ENVIRONMENT', 'development'),
    })
  } catch (error) {
    logger.error('Erro ao inicializar a aplicação', { error: error.message })
  }
}

bootstrap()
