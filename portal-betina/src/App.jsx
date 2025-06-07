import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import Header from './components/navigation/Header'
import Footer from './components/navigation/Footer'
import ActivityMenu from './components/navigation/ActivityMenu'
import DonationBanner from './components/navigation/DonationBanner'
import ActivityWrapper from './components/common/ActivityWrapper'
import DatabaseStatus from './components/common/DatabaseStatus'
import MemoryGame from './components/activities/MemoryGame'
import ColorMatch from './components/activities/ColorMatch'
import ImageAssociation from './components/activities/ImageAssociation'
import MusicalSequence from './components/activities/MusicalSequence'
import LetterRecognition from './components/activities/LetterRecognition'
import NumberCounting from './components/activities/NumberCounting'
import CreativePainting from './components/activities/CreativePainting'
import About from './components/pages/About'
import ProgressReport from './components/pages/ProgressReport'
import UserProfiles from './components/pages/UserProfiles'
import PerformanceDashboard from './components/pages/PerformanceDashboard'
import BackupExport from './components/pages/BackupExport'
import AdminPanel from './components/pages/AdminPanel'
import { useUser } from './contexts/UserContext'
import { incrementGameUsage } from './utils/gameUsage'

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;

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
  padding-bottom: 120px; /* Espaço para o footer fixo */
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

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
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple), var(--primary-pink));
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

function App() {
  const [currentActivity, setCurrentActivity] = useState('home')
  const { isDbConnected, loading } = useUser()
  
  const handleActivitySelect = (activityId) => {
    // Lista de jogos que devem ter uso contabilizado
    const gameActivities = [
      'memory-game', 
      'color-match', 
      'image-association', 
      'musical-sequence', 
      'letter-recognition', 
      'number-counting',
      'creative-painting'
    ];
    
    // Se for um jogo, incrementa contador de uso
    if (gameActivities.includes(activityId)) {
      incrementGameUsage(activityId);
    }
    
    setCurrentActivity(activityId)
  }
  const handleBackToMenu = () => {
    setCurrentActivity('home')
  }
  
  const getActivityTitle = () => {
    const titles = {
      'memory-game': '🧠 Jogo da Memória',
      'color-match': '🌈 Combinar Cores',
      'image-association': '🧩 Associação de Imagens',
      'musical-sequence': '🎵 Sequência Musical',
      'letter-recognition': '🔤 Reconhecimento de Letras',
      'number-counting': '🔢 Números e Contagem',
      'creative-painting': '🎨 Pintura Criativa',
      'about': '💡 Sobre o Portal',
      'progress-report': '📊 Relatório de Progresso',
      'admin-panel': '🔐 Painel Administrativo'
    }
    return titles[currentActivity] || null
  }
  
  const renderActivity = () => {
    switch (currentActivity) {
      case 'memory-game':
        return (
          <ActivityWrapper
            title="Jogo da Memória"
            emoji="🧠"
          >
            <MemoryGame onBack={handleBackToMenu} />
          </ActivityWrapper>
        )
      case 'color-match':
        return (
          <ActivityWrapper
            title="Combinar Cores"
            emoji="🌈"
          >
            <ColorMatch onBack={handleBackToMenu} />
          </ActivityWrapper>
        )
      case 'image-association':
        return (
          <ActivityWrapper
            title="Associação de Imagens"
            emoji="🖼️"
          >
            <ImageAssociation onBack={handleBackToMenu} />
          </ActivityWrapper>
        )
      case 'musical-sequence':
        return (
          <ActivityWrapper
            title="Sequência Musical"
            emoji="🎵"
          >
            <MusicalSequence onBack={handleBackToMenu} />
          </ActivityWrapper>
        )
      case 'letter-recognition':
        return (
          <ActivityWrapper
            title="Reconhecimento de Letras"
            emoji="📚"
          >
            <LetterRecognition onBack={handleBackToMenu} />
          </ActivityWrapper>
        )
      case 'number-counting':
        return (
          <ActivityWrapper
            title="Números e Contagem"
            emoji="🔢"
          >
            <NumberCounting onBack={handleBackToMenu} />
          </ActivityWrapper>
        )
      case 'creative-painting':
        return (
          <ActivityWrapper
            title="Pintura Criativa"
            emoji="🎨"
          >
            <CreativePainting onBack={handleBackToMenu} />
          </ActivityWrapper>
        )
      case 'about':
        return <About />
      case 'progress-report':
        return <ProgressReport onBack={handleBackToMenu} />
      case 'user-profiles':
        return <UserProfiles onBack={handleBackToMenu} />
      case 'performance-dashboard':
        return <PerformanceDashboard />
      case 'backup-export':
        return <BackupExport />
      case 'admin-panel':
        return <AdminPanel />
      case 'home':
      default:
        return (
          <>            <WelcomeSection
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
  }
  return (
    <AppContainer>
      <Header 
        title={getActivityTitle() || "Portal Betina"}
        onLogoClick={handleBackToMenu}
      />
        <MainContent>
        {renderActivity()}
      </MainContent>      <Footer
        currentActivity={currentActivity}
        onActivityChange={handleActivitySelect}
      />
    </AppContainer>
  )
}

export default App
