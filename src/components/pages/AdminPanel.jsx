import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import {
  getUsageStats,
  getGameUsageCounts,
  resetGameUsage,
  getUsageInsights,
  exportAllData,
  clearCache,
} from '../../utils/game/gameUsage'
import activitiesData from '../../data/activities.json'
import AdminCharts from './AdminCharts'
import logger from '../../config/api-config.js'

const AdminContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin: var(--space-lg) 0;
  box-shadow: var(--shadow-medium);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`

const LoginContainer = styled(motion.div)`
  background: white;
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin: var(--space-lg) auto;
  box-shadow: var(--shadow-medium);
  max-width: 400px;
  text-align: center;
`

const LoginInput = styled.input`
  width: 100%;
  padding: var(--space-md);
  margin: var(--space-sm) 0;
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--primary-blue);
  }
`

const LoginButton = styled(motion.button)`
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-cyan));
  color: white;
  border: none;
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-base);
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: var(--space-md);
`

const AdminHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 2px solid var(--light-gray);
`

const AdminTitle = styled.h1`
  font-size: var(--font-size-title);
  color: var(--primary-blue);
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
`

const AdminSubtitle = styled.p`
  color: var(--medium-gray);
  font-size: var(--font-size-lg);
  margin: 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`

const StatCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    ${(props) => props.color || 'var(--primary-blue)'},
    ${(props) => props.colorSecondary || 'var(--primary-cyan)'}
  );
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  color: white;
  text-align: center;
  box-shadow: var(--shadow-medium);
`

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: var(--space-sm);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`

const StatLabel = styled.div`
  font-size: var(--font-size-md);
  opacity: 0.9;
  font-weight: 500;
`

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-blue);
  margin: var(--space-xl) 0 var(--space-lg) 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`

const GamesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const GameCard = styled.div`
  background: white;
  border: 2px solid var(--light-gray);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  transition: all var(--transition-normal);

  &:hover {
    border-color: var(--primary-blue);
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`

const GameIcon = styled.div`
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(
    135deg,
    ${(props) => props.color || 'var(--primary-blue)'},
    ${(props) => props.colorSecondary || 'var(--primary-cyan)'}
  );
  border-radius: var(--radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`

const GameInfo = styled.div`
  flex: 1;
`

const GameName = styled.h3`
  font-size: var(--font-size-lg);
  color: var(--dark-gray);
  margin: 0 0 var(--space-xs) 0;
`

const GameStats = styled.div`
  color: var(--medium-gray);
  font-size: var(--font-size-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`

const ControlsSection = styled.div`
  background: var(--light-gray);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  margin-top: var(--space-xl);
`

const ActionButton = styled(motion.button)`
  background: ${(props) => (props.danger ? 'var(--error-color)' : 'var(--primary-green)')};
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-md);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin: var(--space-sm) var(--space-sm) 0 0;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
`

const InfoBox = styled.div`
  background: rgba(74, 144, 226, 0.1);
  border: 1px solid var(--primary-blue);
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  margin: var(--space-lg) 0;
  color: var(--primary-blue);
  font-size: var(--font-size-sm);
`

const LastUpdateInfo = styled.div`
  text-align: center;
  color: var(--medium-gray);
  font-size: var(--font-size-sm);
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--light-gray);
`

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginInput, setLoginInput] = useState('')
  const [loginError, setLoginError] = useState('')

  const [stats, setStats] = useState({
    totalGames: 0,
    totalUsage: 0,
    mostPlayed: null,
    lastUpdate: null,
  })
  const [gameUsage, setGameUsage] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [insights, setInsights] = useState(null)

  // Senha simples para demo - em produção usar hash/JWT
  const ADMIN_PASSWORD = 'betina2025'

  const handleLogin = () => {
    if (loginInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setLoginError('')
      localStorage.setItem('portalBetina_adminAuth', 'true')
    } else {
      setLoginError('Senha incorreta. Tente novamente.')
      setLoginInput('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('portalBetina_adminAuth')
  }

  // Verifica autenticação ao carregar
  useEffect(() => {
    const isAuth = localStorage.getItem('portalBetina_adminAuth') === 'true'
    setIsAuthenticated(isAuth)
  }, [])

  const gameMapping = {
    'memory-game': {
      name: 'Jogo da Memória',
      icon: '🧠',
      color: 'var(--primary-blue)',
      colorSecondary: 'var(--primary-cyan)',
    },
    'color-match': {
      name: 'Combinar Cores',
      icon: '🌈',
      color: 'var(--primary-green)',
      colorSecondary: '#7ED321',
    },
    'image-association': {
      name: 'Associação de Imagens',
      icon: '🧩',
      color: 'var(--primary-orange)',
      colorSecondary: '#F5A623',
    },
    'musical-sequence': {
      name: 'Sequência Musical',
      icon: '🎵',
      color: 'var(--primary-purple)',
      colorSecondary: '#9013FE',
    },
    'letter-recognition': {
      name: 'Reconhecimento de Letras',
      icon: '📚',
      color: 'var(--primary-pink)',
      colorSecondary: '#E91E63',
    },
    'number-counting': {
      name: 'Números e Contagem',
      icon: '🔢',
      color: 'var(--primary-cyan)',
      colorSecondary: '#00BCD4',
    },
    'sound-recognition': {
      name: 'Sons e Música',
      icon: '🎵',
      color: 'var(--primary-purple)',
      colorSecondary: '#9013FE',
    },
    'number-sequence': {
      name: 'Números Divertidos',
      icon: '🔢',
      color: 'var(--primary-cyan)',
      colorSecondary: '#00BCD4',
    },
    emotions: {
      name: 'Reconhecer Emoções',
      icon: '😊',
      color: 'var(--primary-pink)',
      colorSecondary: '#FF6B6B',
    },
  }

  useEffect(() => {
    loadData()
  }, [])
  const loadData = () => {
    setIsLoading(true)
    try {
      const usageStats = getUsageStats()
      const usage = getGameUsageCounts()
      const usageInsights = getUsageInsights()

      setStats(usageStats)
      setGameUsage(usage)
      setInsights(usageInsights)
      setIsLoading(false)
    } catch (error) {
      logger.error('Erro ao carregar dados do admin:', error)
      setIsLoading(false)
    }
  }

  const handleResetStats = () => {
    if (
      window.confirm(
        '⚠️ Tem certeza que deseja resetar todas as estatísticas? Esta ação não pode ser desfeita.'
      )
    ) {
      resetGameUsage()
      loadData()
      alert('✅ Estatísticas resetadas com sucesso!')
    }
  }
  const exportData = () => {
    try {
      const data = exportAllData()
      const dataStr = JSON.stringify(data, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })

      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `portal-betina-dados-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      logger.info('📥 Dados exportados com sucesso')
      alert('✅ Dados exportados com sucesso!')
    } catch (error) {
      logger.error('Erro ao exportar dados:', error)
      alert('❌ Erro ao exportar dados. Verifique o console.')
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Nunca'
    return new Date(parseInt(timestamp)).toLocaleString('pt-BR')
  }

  const formatDaysAgo = (timestamp) => {
    if (!timestamp) return 'Nunca'
    const days = Math.floor((Date.now() - parseInt(timestamp)) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Hoje'
    if (days === 1) return 'Ontem'
    return `${days} dias atrás`
  }

  const getGamesByUsage = () => {
    const games = Object.entries(gameUsage)
      .filter(([key, value]) => typeof value === 'number' && !key.includes('_lastPlayed'))
      .map(([gameId, count]) => {
        const gameInfo = gameMapping[gameId] || {
          name: gameId,
          icon: '🎮',
          color: 'var(--primary-blue)',
        }
        return {
          id: gameId,
          ...gameInfo,
          count,
          lastPlayed: gameUsage[`${gameId}_lastPlayed`],
        }
      })
      .sort((a, b) => b.count - a.count)

    return games
  }
  if (isLoading) {
    return (
      <AdminContainer>
        <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>⚡</div>
          <div>Carregando dados administrativos...</div>
        </div>
      </AdminContainer>
    )
  }

  // Tela de login
  if (!isAuthenticated) {
    return (
      <LoginContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🔐</div>
        <h2 style={{ color: 'var(--primary-blue)', marginBottom: 'var(--space-lg)' }}>
          Acesso Administrativo
        </h2>
        <p style={{ color: 'var(--medium-gray)', marginBottom: 'var(--space-lg)' }}>
          Digite a senha para acessar o painel administrativo do Portal Betina
        </p>

        <LoginInput
          type="password"
          placeholder="Digite a senha de administrador"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />

        {loginError && (
          <div
            style={{
              color: 'var(--primary-pink)',
              fontSize: '0.9em',
              marginTop: 'var(--space-sm)',
            }}
          >
            {loginError}
          </div>
        )}

        <LoginButton onClick={handleLogin} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          🚀 Entrar
        </LoginButton>

        <div
          style={{
            marginTop: 'var(--space-lg)',
            fontSize: '0.8em',
            color: 'var(--medium-gray)',
          }}
        >
          Portal Betina - Sistema de Métricas v1.0
        </div>
      </LoginContainer>
    )
  }
  return (
    <AdminContainer>
      <AdminHeader>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <div>
            <AdminTitle>🔐 Painel Administrativo</AdminTitle>
            <AdminSubtitle>Métricas e estatísticas detalhadas do Portal Betina</AdminSubtitle>
          </div>
          <ActionButton
            onClick={handleLogout}
            style={{ marginTop: 0, padding: 'var(--space-sm) var(--space-md)', fontSize: '0.9em' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🚪 Sair
          </ActionButton>
        </div>
      </AdminHeader>
      <InfoBox>
        📊 <strong>Status do Sistema:</strong> Este painel mostra estatísticas em tempo real do uso
        dos jogos. Os dados são salvos localmente no navegador e atualizados automaticamente
        conforme o uso.
      </InfoBox>
      <SectionTitle>📈 Estatísticas Gerais</SectionTitle>
      <StatsGrid>
        <StatCard
          color="var(--primary-blue)"
          colorSecondary="var(--primary-cyan)"
          whileHover={{ scale: 1.02 }}
        >
          <StatNumber>{stats.totalUsage}</StatNumber>
          <StatLabel>Total de Jogadas</StatLabel>
        </StatCard>
        <StatCard
          color="var(--primary-green)"
          colorSecondary="#7ED321"
          whileHover={{ scale: 1.02 }}
        >
          <StatNumber>{stats.totalGames}</StatNumber>
          <StatLabel>Jogos Utilizados</StatLabel>
        </StatCard>
        <StatCard
          color="var(--primary-orange)"
          colorSecondary="#F5A623"
          whileHover={{ scale: 1.02 }}
        >
          <StatNumber>
            {stats.mostPlayed
              ? gameMapping[stats.mostPlayed]?.name?.split(' ')[0] || stats.mostPlayed
              : 'N/A'}
          </StatNumber>
          <StatLabel>Jogo Mais Jogado</StatLabel>
        </StatCard>{' '}
        <StatCard
          color="var(--primary-purple)"
          colorSecondary="#9013FE"
          whileHover={{ scale: 1.02 }}
        >
          <StatNumber>{getGamesByUsage().length}</StatNumber>
          <StatLabel>Jogos no Ranking</StatLabel>
        </StatCard>
      </StatsGrid>{' '}
      {/* Gráficos Interativos */}
      <SectionTitle>📊 Visualizações Avançadas</SectionTitle>
      <AdminCharts
        gameUsage={gameUsage}
        gameMapping={gameMapping}
        activitiesData={activitiesData}
      />
      {/* Insights Inteligentes */}
      {insights && (
        <>
          <SectionTitle>🧠 Insights Inteligentes</SectionTitle>
          <StatsGrid>
            <StatCard
              color="var(--primary-cyan)"
              colorSecondary="#00BCD4"
              whileHover={{ scale: 1.02 }}
            >
              <StatNumber>{insights.totalEngagement}</StatNumber>
              <StatLabel>Engajamento Total</StatLabel>
            </StatCard>

            <StatCard
              color="var(--primary-pink)"
              colorSecondary="#FF6B6B"
              whileHover={{ scale: 1.02 }}
            >
              <StatNumber>{Math.round(insights.diversityScore)}%</StatNumber>
              <StatLabel>Score de Diversidade</StatLabel>
            </StatCard>

            <StatCard
              color="var(--primary-orange)"
              colorSecondary="#F5A623"
              whileHover={{ scale: 1.02 }}
            >
              <StatNumber>{insights.recommendations.length}</StatNumber>
              <StatLabel>Recomendações</StatLabel>
            </StatCard>
          </StatsGrid>

          {insights.recommendations.length > 0 && (
            <div style={{ margin: 'var(--space-lg) 0' }}>
              {insights.recommendations.map((rec, index) => (
                <InfoBox key={index}>
                  💡 <strong>{rec.type === 'diversity' ? 'Diversidade' : 'Conquista'}:</strong>{' '}
                  {rec.message}
                </InfoBox>
              ))}
            </div>
          )}
        </>
      )}
      <SectionTitle>🎮 Detalhes por Jogo</SectionTitle>
      {getGamesByUsage().length === 0 ? (
        <InfoBox>
          🎯 Ainda não há dados de uso registrados. Os jogos aparecerão aqui conforme forem sendo
          utilizados.
        </InfoBox>
      ) : (
        <GamesList>
          {getGamesByUsage().map((game) => (
            <GameCard key={game.id}>
              <GameIcon color={game.color} colorSecondary={game.colorSecondary}>
                {game.icon}
              </GameIcon>
              <GameInfo>
                <GameName>{game.name}</GameName>
                <GameStats>
                  <div>
                    <strong>{game.count}</strong> jogadas
                  </div>
                  <div>Última vez: {formatDaysAgo(game.lastPlayed)}</div>
                  <div style={{ fontSize: '0.8em', opacity: 0.7 }}>
                    {formatDate(game.lastPlayed)}
                  </div>
                </GameStats>
              </GameInfo>
            </GameCard>
          ))}
        </GamesList>
      )}
      <SectionTitle>⚙️ Controles Administrativos</SectionTitle>
      <ControlsSection>
        <h3 style={{ margin: '0 0 var(--space-md) 0', color: 'var(--dark-gray)' }}>
          Ações Disponíveis
        </h3>
        <p style={{ margin: '0 0 var(--space-lg) 0', color: 'var(--medium-gray)' }}>
          Use estes controles para gerenciar os dados do portal:
        </p>
        <ButtonGroup>
          <ActionButton
            onClick={exportData}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📥 Exportar Dados
          </ActionButton>

          <ActionButton onClick={loadData} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            🔄 Atualizar Dados
          </ActionButton>

          <ActionButton
            onClick={() => {
              clearCache()
              loadData()
              alert('✅ Cache limpo com sucesso!')
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🧹 Limpar Cache
          </ActionButton>

          <ActionButton
            danger
            onClick={handleResetStats}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🗑️ Resetar Estatísticas
          </ActionButton>
        </ButtonGroup>
      </ControlsSection>
      <LastUpdateInfo>
        <div>Última atualização: {new Date().toLocaleString('pt-BR')}</div>
        <div style={{ marginTop: 'var(--space-xs)', fontSize: '0.9em' }}>
          Portal Betina v1.0.0 - Sistema de Métricas Inteligente
        </div>
      </LastUpdateInfo>
    </AdminContainer>
  )
}

export default AdminPanel
