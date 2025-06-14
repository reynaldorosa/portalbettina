import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import Header from '../navigation/Header'
import Footer from '../navigation/Footer'
import ActivityMenu from '../navigation/ActivityMenu'
import DonationBanner from '../navigation/DonationBanner'
import ActivityWrapper from '../common/ActivityWrapper'
import DatabaseStatus from '../common/DatabaseStatus'
import TTSDebugPanel from '../common/TTSDebugPanel'
import MobileDataCollectionWrapper from '../MobileDataCollectionWrapper'

// Lazy loading para componentes pesados
const MemoryGame = lazy(() => import('../activities/MemoryGame'))
const ColorMatch = lazy(() => import('../activities/ColorMatch'))
const ImageAssociation = lazy(() => import('../activities/ImageAssociation'))
const MusicalSequence = lazy(() => import('../activities/MusicalSequence'))
const LetterRecognition = lazy(() => import('../activities/LetterRecognition'))
const NumberCounting = lazy(() => import('../activities/NumberCounting'))
const CreativePaintingSimple = lazy(() => import('../activities/CreativePaintingSimple'))
const VisualPatterns = lazy(() => import('../activities/PadroesVisuaisTemp'))
const EmotionalPuzzle = lazy(() => import('../activities/QuebraCabecaTemp'))
const About = lazy(() => import('./About'))
const ProgressReport = lazy(() => import('./ProgressReport'))
const UserProfiles = lazy(() => import('./UserProfiles'))
const PerformanceDashboard = lazy(() => import('./PerformanceDashboard'))
const BackupExport = lazy(() => import('./BackupExport'))
const AdminPanel = lazy(() => import('./AdminPanel'))
const IntegratedSystemDashboard = lazy(() => import('../dashboard/IntegratedSystemDashboard'))

import { useUser } from '../../contexts/UserContext'
import { PremiumAuthProvider } from '../../contexts/PremiumAuthContext'
import { incrementGameUsage } from './utils/gameUsage'
import { initializeSystemOrchestrator } from '../../utils/core/SystemOrchestrator.js'
import databaseService from '../../services/databaseService.js'

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.2) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`

const MainContent = styled.main`
  padding: var(--space-lg);
  padding-bottom: 120px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  flex: 1;

  @media (max-width: 768px) {
    padding: var(--space-md);
    padding-bottom: 100px;
  }
`

const WelcomeSection = styled(motion.section)`
  text-align: center;
  margin: var(--space-xl) 0;
  padding: var(--space-xl);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92));
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-strong);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      var(--primary-blue),
      var(--primary-purple),
      var(--primary-pink)
    );
  }
`

const WelcomeTitle = styled.h1`
  font-size: var(--font-size-title);
  color: var(--primary-blue);
  margin-bottom: var(--space-lg);
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: var(--font-size-xxl);
  }
`

const activityComponents = {
  'memory-game': { component: MemoryGame, title: 'Jogo da Memória', emoji: '🧠' },
  'color-match': { component: ColorMatch, title: 'Combinar Cores', emoji: '🌈' },
  'image-association': { component: ImageAssociation, title: 'Associação de Imagens', emoji: '🖼️' },
  'musical-sequence': { component: MusicalSequence, title: 'Sequência Musical', emoji: '🎵' },
  'letter-recognition': {
    component: LetterRecognition,
    title: 'Reconhecimento de Letras',
    emoji: '📚',
  },
  'number-counting': { component: NumberCounting, title: 'Números e Contagem', emoji: '🔢' },
  'creative-painting': {
    component: CreativePaintingSimple,
    title: 'Pintura Criativa',
    emoji: '🎨',
  },
  'visual-patterns': { component: VisualPatterns, title: 'Padrões Visuais', emoji: '🔷' },
  'emotional-puzzle': { component: EmotionalPuzzle, title: 'Quebra-Cabeça Emocional', emoji: '😊' },
  about: { component: About, title: 'Sobre o Portal', emoji: '💡' },
  'progress-report': { component: ProgressReport, title: 'Relatório de Progresso', emoji: '📊' },
  'user-profiles': { component: UserProfiles, title: 'Perfis de Usuário', emoji: '👤' },
  'performance-dashboard': {
    component: PerformanceDashboard,
    title: 'Painel de Desempenho',
    emoji: '📈',
  },
  'integrated-system-dashboard': {
    component: IntegratedSystemDashboard,
    title: 'Dashboard Integrado',
    emoji: '🎯',
  },
  'backup-export': { component: BackupExport, title: 'Exportação de Backup', emoji: '💾' },
  'admin-panel': { component: AdminPanel, title: 'Painel Administrativo', emoji: '🔐' },
}

function App() {
  const [currentActivity, setCurrentActivity] = useState('home')
  const { isDbConnected, loading, user } = useUser()
  const [mobileDataSession, setMobileDataSession] = useState(null)
  const [orchestratorInitialized, setOrchestratorInitialized] = useState(false)
  const [dataCollectionStats, setDataCollectionStats] = useState({
    touchEvents: 0,
    sensorReadings: 0,
    neurodivergenceIndicators: 0,
  })

  // Inicializar o Sistema Orquestrador
  useEffect(() => {
    const initOrchestrator = async () => {
      try {
        if (isDbConnected && !orchestratorInitialized) {
          console.log('🎯 Inicializando Sistema Orquestrador...')
          const orchestrator = initializeSystemOrchestrator(databaseService, {
            enableRealTimeOrchestration: true,
            enableCrossSystemLearning: true,
            enablePredictiveCoordination: true,
            enableTherapeuticIntegration: true,
            enableAIAugmentedAnalysis: true,
          })
          setOrchestratorInitialized(true)
          console.log('✅ Sistema Orquestrador inicializado com sucesso')
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar Sistema Orquestrador:', error)
      }
    }

    initOrchestrator()
  }, [isDbConnected, orchestratorInitialized])

  const isMobileDevice = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const screenWidth = window.screen.width
    const minDimension = Math.min(screenWidth, window.screen.height)
    return /mobile|tablet|phone|android|iphone|ipad/.test(userAgent) || minDimension <= 1024
  }, [])

  const handleDataCollected = useCallback((data) => {
    setDataCollectionStats(data.dataStats)
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Dados coletados:', data)
    }
  }, [])

  const handleSessionComplete = useCallback((sessionData) => {
    console.log('🏁 Sessão de coleta concluída:', sessionData)
    setMobileDataSession(null)
  }, [])

  const gameActivities = useMemo(
    () => [
      'memory-game',
      'color-match',
      'image-association',
      'musical-sequence',
      'letter-recognition',
      'number-counting',
      'creative-painting',
      'visual-patterns',
      'emotional-puzzle',
    ],
    []
  )

  const handleActivitySelect = useCallback(
    (activityId) => {
      if (gameActivities.includes(activityId)) {
        incrementGameUsage(activityId)
      }
      setCurrentActivity(activityId)
    },
    [gameActivities]
  )

  const handleBackToMenu = useCallback(() => {
    setCurrentActivity('home')
  }, [])
  // Componente de fallback para lazy loading
  const LoadingFallback = useMemo(
    () => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 'var(--radius-large)',
          margin: 'var(--space-lg) 0',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: '2rem' }}
        >
          🧠
        </motion.div>
        <span style={{ marginLeft: '1rem', fontSize: '1.1rem' }}>Carregando atividade...</span>
      </div>
    ),
    []
  )

  const renderActivity = useCallback(() => {
    if (currentActivity === 'home') {
      return (
        <>
          <WelcomeSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <DonationBanner />
          </WelcomeSection>
          <ActivityMenu onActivitySelect={handleActivitySelect} />
        </>
      )
    }

    const Activity = activityComponents[currentActivity]?.component
    const title = activityComponents[currentActivity]?.title
    const emoji = activityComponents[currentActivity]?.emoji

    if (!Activity) return null

    return (
      <ActivityWrapper title={title} emoji={emoji}>
        <Suspense fallback={LoadingFallback}>
          <Activity onBack={handleBackToMenu} />
        </Suspense>
      </ActivityWrapper>
    )
  }, [currentActivity, handleActivitySelect, handleBackToMenu, LoadingFallback])

  const mobileSessionConfig = useMemo(
    () => ({
      enableLocation: false,
      collectTouchData: true,
      collectSensorData: true,
      syncInterval: 30000,
      touchSampleRate: 60,
      sensorSampleRate: 30,
    }),
    []
  )
  // Memoizar configurações estáticas
  const shouldEnableMobileCollection = useMemo(
    () => isMobileDevice() && user?.id,
    [isMobileDevice, user?.id]
  )

  const showDebugPanel = useMemo(() => process.env.NODE_ENV === 'development', [])

  // Memoizar título do header para evitar re-renderizações
  const headerTitle = useMemo(
    () =>
      activityComponents[currentActivity]?.title ||
      (shouldEnableMobileCollection ? 'Portal Betina - Mobile' : 'Portal Betina'),
    [currentActivity, shouldEnableMobileCollection]
  )

  return (
    <PremiumAuthProvider>
      <AppContainer>
        {shouldEnableMobileCollection ? (
          <MobileDataCollectionWrapper
            userId={user.id}
            activityId={currentActivity}
            sessionConfig={mobileSessionConfig}
            onDataCollected={handleDataCollected}
            onSessionComplete={handleSessionComplete}
          >
            {' '}
            <Header title={headerTitle} onLogoClick={handleBackToMenu} />
            <MainContent>
              {renderActivity()}
              {showDebugPanel && <TTSDebugPanel />}
              <DatabaseStatus isConnected={isDbConnected} loading={loading} />
            </MainContent>
            <Footer currentActivity={currentActivity} onActivityChange={handleActivitySelect} />
          </MobileDataCollectionWrapper>
        ) : (
          <>
            {' '}
            <Header title={headerTitle} onLogoClick={handleBackToMenu} />
            <MainContent>
              {renderActivity()}
              {showDebugPanel && <TTSDebugPanel />}
              <DatabaseStatus isConnected={isDbConnected} loading={loading} />
            </MainContent>
            <Footer currentActivity={currentActivity} onActivityChange={handleActivitySelect} />
          </>
        )}
      </AppContainer>
    </PremiumAuthProvider>
  )
}

export default App
