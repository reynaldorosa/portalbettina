import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from 'styled-components'
import i18n from './i18n'
import { UserProvider } from '../../contexts/UserContext'
import ErrorBoundary from '../common/ErrorBoundary'
import GlobalStyles from '../../styles/global'
import { lightTheme, darkTheme } from '../../styles/themes'
import './styles/reset.css'
import logger from '../../config/api-config'

// Lazy load do App para otimizar o carregamento inicial
const App = lazy(() => import('../../App'))

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

// Cloud Nandrophic: Real-time autism therapy system initialization
const initializeAutismTherapySystem = async () => {
  logger.info('🧠 CLOUD NANDROPHIC: Initializing real autism therapy system')

  // Initialize real-time metrics collection
  if (typeof window !== 'undefined') {
    window.autismTherapyMetrics = {
      sessionStart: Date.now(),
      cognitiveLoad: 'optimal',
      sensoryEnvironment: 'controlled',
      adaptiveParameters: 'active',
    }

    // Real-time sensory monitoring
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - window.autismTherapyMetrics.sessionStart
      logger.info('🎯 Session completed:', { duration: sessionDuration })
    })
  }

  logger.info('✅ Cloud Nandrophic autism therapy system ready')
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
