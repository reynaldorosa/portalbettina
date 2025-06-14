import React, { useState, useEffect, useMemo, useCallback, useReducer } from 'react'
import styled, { ThemeProvider, keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { useUser } from '../../contexts/UserContext'
import databaseService from '../../database/core/DatabaseService.js'
import neuropedagogicalService from '../../utils/metrics/neuropedagogicalService.js'
import logger from '../../config/api-config.js'
import NeuropedagogicalDashboard from '../dashboard/NeuropedagogicalDashboard'
import AIReportsTab from '../reports/AIReportsTab'
import MultisensoryMetricsDashboard from '../dashboard/MultisensoryMetricsDashboard'
// 🎯 INTEGRAÇÃO COM SYSTEM ORCHESTRATOR
import { getSystemOrchestrator } from '../../utils/core/SystemOrchestrator.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from 'chart.js'
import { Bar, Line, Pie, Radar } from 'react-chartjs-2'
import { getUsageStats, getGameUsageCounts, resetGameUsage } from '../../utils/game/gameUsage.js'
import { getProgressSummary } from '../../utils/analytics/progressReports.js'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import { CSVLink } from 'react-csv'

// Registra componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
  RadialLinearScale
)

// Configuração do tema
const theme = {
  colors: {
    primaryBlue: '#2563EB',
    primaryPurple: '#6D28D9',
    primaryPink: '#DB2777',
    primaryOrange: '#EA580C',
    primaryGreen: '#059669',
    primaryCyan: '#0891B2',
    mediumGray: '#4B5563',
    darkGray: '#1E293B',
    lightGray: '#F1F5F9',
    warning: '#B45309',
    white: '#FFFFFF',
    black: '#0F172A',
    premiumGold: '#FBBF24',
    success: '#10B981',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  radius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
  shadow: {
    light: '0 1px 3px rgba(0,0,0,0.1)',
    medium: '0 3px 6px rgba(0,0,0,0.15)',
    strong: '0 6px 12px rgba(0,0,0,0.2)',
  },
  transition: {
    normal: '0.3s ease',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem',
  },
}

// Animação para o cérebro
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
`

// Estado inicial do reducer
const initialState = {
  timeframe: '30d',
  gameFilter: 'all',
  sessionData: [],
  isLoading: false,
  usageStats: null,
  progressData: null,
  stats: {
    totalSessions: 0,
    avgAccuracy: 0,
    avgScore: 0,
    totalTimeSpent: 0,
  },
  activeTab: 'dashboard',
  dashboardMetrics: null,
  cognitiveProfiles: [],
  engagementMetrics: [],
  learningPatterns: [],
  error: null,
  notification: null,
  // 🎯 NOVAS MÉTRICAS DO SYSTEM ORCHESTRATOR
  realTimeMetrics: null,
  cacheMetrics: null,
  systemPerformance: null,
  orchestratorStatus: 'initializing',
}

// Reducer para gerenciar estado
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TIMEFRAME':
      return { ...state, timeframe: action.payload }
    case 'SET_GAME_FILTER':
      return { ...state, gameFilter: action.payload }
    case 'SET_SESSION_DATA':
      return { ...state, sessionData: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USAGE_STATS':
      return { ...state, usageStats: action.payload }
    case 'SET_PROGRESS_DATA':
      return { ...state, progressData: action.payload }
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
    case 'SET_DASHBOARD_METRICS':
      return { ...state, dashboardMetrics: action.payload }
    case 'SET_COGNITIVE_PROFILES':
      return { ...state, cognitiveProfiles: action.payload }
    case 'SET_ENGAGEMENT':
      return { ...state, engagementMetrics: action.payload }
    case 'SET_LEARNING_PATTERNS':
      return { ...state, learningPatterns: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_NOTIFICATION':
      return { ...state, notification: action.payload }
    // 🎯 NOVOS CASES PARA SYSTEM ORCHESTRATOR
    case 'SET_REALTIME_METRICS':
      return { ...state, realTimeMetrics: action.payload }
    case 'SET_CACHE_METRICS':
      return { ...state, cacheMetrics: action.payload }
    case 'SET_SYSTEM_PERFORMANCE':
      return { ...state, systemPerformance: action.payload }
    case 'SET_ORCHESTRATOR_STATUS':
      return { ...state, orchestratorStatus: action.payload }
    default:
      return state
  }
}

// Componentes estilizados
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.lightGray}, ${theme.colors.white});
  padding: ${theme.spacing.xxl};
  display: flex;
  justify-content: center;
  overflow-x: auto;

  @media (max-width: 1200px) {
    padding: ${theme.spacing.lg};
  }

  @media (orientation: portrait) {
    display: none;
  }
`

const DashboardContent = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.large};
  box-shadow: ${theme.shadow.strong};
  padding: ${theme.spacing.xl};
  position: relative;

  @media (max-width: 1200px) {
    padding: ${theme.spacing.md};
  }
`

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.lightGray};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
`

const DashboardTitle = styled.h2`
  font-size: ${theme.fontSizes.xxxl};
  color: ${theme.colors.darkGray};
  margin: 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: ${theme.fontSizes.xl};
  }
`

const DashboardSubtitle = styled.p`
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.mediumGray};
  margin: 8px 0 0;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: ${theme.fontSizes.sm};
  }
`

const ControlPanel = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`

const ActionButton = styled(motion.button)`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: linear-gradient(
    90deg,
    ${({ $bgColor }) => $bgColor || theme.colors.primaryBlue},
    ${({ $bgColor }) => ($bgColor || theme.colors.primaryPurple) + '80'}
  );
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.radius.medium};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  transition: ${theme.transition.normal};
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: linear-gradient(
      90deg,
      ${({ $bgColor }) => $bgColor || theme.colors.primaryPurple},
      ${({ $bgColor }) => ($bgColor || theme.colors.primaryBlue) + '80'}
    );
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: 12px;
  }
`

const FilterBarStyled = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 16px;
  background: ${theme.colors.lightGray};
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
  }
`

const FilterGroupStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 200px;

  label {
    font-size: ${theme.fontSizes.sm};
    font-weight: 600;
    color: ${theme.colors.darkGray};
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`

const SelectStyled = styled.select`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.mediumGray};
  background: ${theme.colors.white};
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  color: ${theme.colors.darkGray};
  transition: ${theme.transition.normal};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primaryBlue};
    box-shadow: 0 0 6px rgba(37, 99, 235, 0.3);
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  padding: 8px;
  background: linear-gradient(180deg, ${theme.colors.white}, ${theme.colors.lightGray});
  border-radius: 12px;
  box-shadow: ${theme.shadow.light};
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`

const TabButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: ${({ $active, theme }) =>
    $active
      ? `linear-gradient(90deg, ${theme.colors.primaryBlue}, ${theme.colors.primaryPurple}80)`
      : 'transparent'};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.darkGray)};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background: ${({ $active, theme }) =>
      $active
        ? `linear-gradient(90deg, ${theme.colors.primaryPurple}, ${theme.colors.primaryBlue}80)`
        : 'rgba(37, 99, 235, 0.1)'};
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.primaryBlue)};
  }

  ${({ $premium, $active, theme }) =>
    $premium &&
    !$active &&
    `
    background: linear-gradient(135deg, ${theme.colors.premiumGold}20, ${theme.colors.premiumGold}10);
    border: 2px solid ${theme.colors.premiumGold}30;
    color: ${theme.colors.premiumGold};
    &:hover {
      background: linear-gradient(135deg, ${theme.colors.premiumGold}30, ${theme.colors.premiumGold}20);
      border-color: ${theme.colors.premiumGold}50;
    }
  `}

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: ${theme.fontSizes.xs};
  }
`

const PremiumGateOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  z-index: 1000;
  padding: 16px;
`

const PremiumGateContent = styled.div`
  background: ${theme.colors.white};
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  width: 90%;
  max-width: 450px;
  box-shadow: ${theme.shadow.strong};
`

const PremiumTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.darkGray};
  margin-bottom: 12px;
`

const PremiumText = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.mediumGray};
  margin-bottom: 20px;
`

const PremiumButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(90deg, ${theme.colors.primaryBlue}, ${theme.colors.primaryPurple}80);
  color: ${theme.colors.white};
  border: none;
  border-radius: 8px;
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  transition: ${theme.transition.normal};

  &:hover {
    background: linear-gradient(
      90deg,
      ${theme.colors.primaryPurple},
      ${theme.colors.primaryBlue}80
    );
  }
`

const ChartSection = styled(motion.div)`
  margin-bottom: 24px;
  background: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  box-shadow: ${theme.shadow.medium};
  transition: ${theme.transition.normal};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${theme.shadow.strong};
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
`

const SectionTitle = styled.h3`
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.darkGray};
  margin-bottom: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ChartContainer = styled.div`
  height: 360px;
  padding: 16px;
  background: ${theme.colors.lightGray + '10'};
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 300px;
  }
`

const BrainLoader = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: url('/assets/brain-icon.svg') no-repeat center; /* Substitua pelo caminho correto */
  background-size: contain;
  animation: ${pulse} 1.5s infinite ease-in-out;
  margin-bottom: 16px;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  flex-direction: column;
  gap: 16px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

const EnhancedStatCard = styled(motion.div)`
  background: ${theme.colors.white};
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: ${theme.shadow.light};
  border: 2px solid ${({ $bgColor }) => $bgColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(
      90deg,
      ${({ $bgColor }) => $bgColor},
      ${({ $bgColor }) => $bgColor + '80'}
    );
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${theme.shadow.strong};
  }
`

const EnhancedStatValue = styled.div`
  font-size: ${theme.fontSizes.xxl};
  font-weight: 800;
  color: ${({ $color }) => $color};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`

const EnhancedStatLabel = styled.div`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.mediumGray};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Notification = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${({ $type, theme }) =>
    $type === 'success'
      ? theme.colors.success
      : $type === 'error'
        ? theme.colors.primaryPink
        : theme.colors.primaryOrange}15;
  border: 1px solid
    ${({ $type, theme }) =>
      $type === 'success'
        ? theme.colors.success
        : $type === 'error'
          ? theme.colors.primaryPink
          : theme.colors.primaryOrange};
  color: ${theme.colors.darkGray};
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: ${theme.shadow.medium};
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2000;

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.colors.mediumGray};
    font-size: 16px;
  }
`

const OrientationMessage = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  color: ${theme.colors.white};
  font-size: 1.5rem;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  z-index: 9999;

  @media (orientation: portrait) {
    display: flex;
  }
`

const FilterBar = ({ timeframe, gameFilter, onTimeframeChange, onGameFilterChange }) => (
  <FilterBarStyled>
    <FilterGroupStyled>
      <label htmlFor="timeframe">Período</label>
      <SelectStyled
        id="timeframe"
        value={timeframe}
        onChange={onTimeframeChange}
        aria-label="Selecionar período"
      >
        {[
          { value: '7d', label: '7 Dias' },
          { value: '30d', label: '30 Dias' },
          { value: '90d', label: '90 Dias' },
          { value: 'all', label: 'Tudo' },
        ].map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectStyled>
    </FilterGroupStyled>
    <FilterGroupStyled>
      <label htmlFor="gameFilter">Jogo</label>
      <SelectStyled
        id="gameFilter"
        value={gameFilter}
        onChange={onGameFilterChange}
        aria-label="Selecionar jogo"
      >
        {[
          { value: 'all', label: 'Todos' },
          { value: 'memory', label: 'Memória' },
          { value: 'colorMatch', label: 'Cores' },
          { value: 'imageAssociation', label: 'Associação' },
          { value: 'letterRecognition', label: 'Letras' },
          { value: 'numberCounting', label: 'Números' },
          { value: 'musicalSequence', label: 'Música' },
          { value: 'visual-patterns', label: 'Padrões' },
          { value: 'emotional-puzzle', label: 'Emoções' },
        ].map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectStyled>
    </FilterGroupStyled>
  </FilterBarStyled>
)

FilterBar.propTypes = {
  timeframe: PropTypes.string.isRequired,
  gameFilter: PropTypes.string.isRequired,
  onTimeframeChange: PropTypes.func.isRequired,
  onGameFilterChange: PropTypes.func.isRequired,
}

// Função auxiliar para formatar tempo
const formatTotalTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes} minutos`
}

// Componente para listar jogos por ranking de uso
const UsageGamesList = () => {
  const usage = getGameUsageCounts()
  const gameNames = {
    'memory-game': '🧠 Jogo da Memória',
    'color-match': '🌈 Combinar Cores',
    'image-association': '🧩 Associação de Imagens',
    'musical-sequence': '🎵 Sequência Musical',
    'letter-recognition': '📚 Reconhecimento de Letras',
    'number-counting': '🔢 Números e Contagem',
  }

  const gameUsageArray = Object.entries(usage)
    .filter(([key, value]) => typeof value === 'number' && !key.includes('_lastPlayed'))
    .map(([gameId, count]) => ({
      gameId,
      name: gameNames[gameId] || gameId,
      count,
      lastPlayed: usage[`${gameId}_lastPlayed`],
    }))
    .sort((a, b) => b.count - a.count)

  return gameUsageArray.length === 0 ? (
    <p style={{ textAlign: 'center', color: theme.colors.mediumGray }}>
      Nenhum jogo foi jogado ainda.
    </p>
  ) : (
    <div style={{ display: 'grid', gap: '8px' }}>
      {gameUsageArray.map((game, index) => (
        <motion.div
          key={game.gameId}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: index < 3 ? theme.colors.primaryBlue : theme.colors.lightGray,
            color: index < 3 ? theme.colors.white : theme.colors.darkGray,
            borderRadius: '8px',
            fontSize: '14px',
          }}
        >
          <span>
            {index === 0 && '🥇 '}
            {index === 1 && '🥈 '}
            {index === 2 && '🥉 '}
            {index > 2 && `${index + 1}º `}
            {game.name}
          </span>
          <span style={{ fontWeight: '600' }}>
            {game.count}x
            {game.lastPlayed && (
              <span style={{ fontSize: '0.8em', opacity: 0.7, marginLeft: '8px' }}>
                ({new Date(game.lastPlayed).toLocaleDateString('pt-BR')})
              </span>
            )}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

// 🎯 COMPONENTE PARA MÉTRICAS EM TEMPO REAL DO SYSTEM ORCHESTRATOR
const RealTimeMetricsPanel = ({
  realTimeMetrics,
  cacheMetrics,
  systemPerformance,
  orchestratorStatus,
}) => {
  if (!realTimeMetrics && orchestratorStatus !== 'connected') {
    return (
      <ChartSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SectionTitle>🎯 Sistema Orquestrador</SectionTitle>
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background:
                  orchestratorStatus === 'connecting'
                    ? '#f59e0b'
                    : orchestratorStatus === 'error'
                      ? '#ef4444'
                      : '#22c55e',
                animation: orchestratorStatus === 'connecting' ? 'pulse 1.5s infinite' : 'none',
              }}
            />
            <span>
              {orchestratorStatus === 'connecting' && 'Conectando ao SystemOrchestrator...'}
              {orchestratorStatus === 'error' && 'Erro na conexão com SystemOrchestrator'}
              {orchestratorStatus === 'connected' && 'SystemOrchestrator Ativo'}
            </span>
          </div>
        </div>
      </ChartSection>
    )
  }

  return (
    <ChartSection
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionTitle>🎯 Métricas do Sistema Orquestrador</SectionTitle>

      <StatsGrid>
        {/* Sessões Ativas */}
        <EnhancedStatCard
          $bgColor={theme.colors.primaryBlue}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <EnhancedStatValue $color={theme.colors.primaryBlue}>
            🎮 {realTimeMetrics?.activeSessions || 0}
          </EnhancedStatValue>
          <EnhancedStatLabel>Sessões Ativas</EnhancedStatLabel>
        </EnhancedStatCard>

        {/* Cache Hit Rate */}
        <EnhancedStatCard
          $bgColor={theme.colors.primaryGreen}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <EnhancedStatValue $color={theme.colors.primaryGreen}>
            💾 {cacheMetrics?.hitRate || '0%'}
          </EnhancedStatValue>
          <EnhancedStatLabel>Taxa de Cache</EnhancedStatLabel>
        </EnhancedStatCard>

        {/* Métricas Processadas */}
        <EnhancedStatCard
          $bgColor={theme.colors.primaryPurple}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <EnhancedStatValue $color={theme.colors.primaryPurple}>
            📊 {realTimeMetrics?.processedMetrics || 0}
          </EnhancedStatValue>
          <EnhancedStatLabel>Métricas Processadas</EnhancedStatLabel>
        </EnhancedStatCard>

        {/* Performance do Sistema */}
        <EnhancedStatCard
          $bgColor={theme.colors.primaryOrange}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <EnhancedStatValue $color={theme.colors.primaryOrange}>
            ⚡ {systemPerformance?.avgResponseTime || 0}ms
          </EnhancedStatValue>
          <EnhancedStatLabel>Tempo de Resposta</EnhancedStatLabel>
        </EnhancedStatCard>
      </StatsGrid>

      {/* Detalhes Expandidos */}
      {cacheMetrics && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: theme.colors.darkGray }}>
            🔍 Detalhes do Cache Inteligente
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
            }}
          >
            <div>
              <strong>Hits:</strong> {cacheMetrics.hits || 0}
            </div>
            <div>
              <strong>Misses:</strong> {cacheMetrics.misses || 0}
            </div>
            <div>
              <strong>Tamanho:</strong> {cacheMetrics.cacheSize || 0}/{cacheMetrics.maxSize || 100}
            </div>
            <div>
              <strong>Memória:</strong> {Math.round((cacheMetrics.memoryUsage || 0) / 1024)}KB
            </div>
          </div>
        </div>
      )}
    </ChartSection>
  )
}

const PerformanceDashboard = () => {
  const { userId, isDbConnected, userDetails } = useUser()
  const [state, dispatch] = useReducer(dashboardReducer, initialState)
  const [isPremiumUser, setIsPremiumUser] = useState(false)
  // 🎯 SYSTEM ORCHESTRATOR INTEGRATION
  const [orchestratorRef, setOrchestratorRef] = useState(null)
  const [metricsInterval, setMetricsInterval] = useState(null)

  useEffect(() => {
    setIsPremiumUser(userDetails?.subscription?.isPremium || false)
  }, [userDetails])

  // 🎯 INICIALIZAR SYSTEM ORCHESTRATOR
  useEffect(() => {
    const initializeOrchestrator = async () => {
      try {
        dispatch({ type: 'SET_ORCHESTRATOR_STATUS', payload: 'connecting' })
        const orchestrator = await getSystemOrchestrator()
        setOrchestratorRef(orchestrator)
        dispatch({ type: 'SET_ORCHESTRATOR_STATUS', payload: 'connected' })

        logger.info('🎯 SystemOrchestrator conectado ao PerformanceDashboard')

        // Configurar coleta de métricas em tempo real
        startRealTimeMetricsCollection(orchestrator)
      } catch (error) {
        logger.error('Erro ao conectar SystemOrchestrator:', error)
        dispatch({ type: 'SET_ORCHESTRATOR_STATUS', payload: 'error' })
      }
    }

    initializeOrchestrator()

    return () => {
      if (metricsInterval) {
        clearInterval(metricsInterval)
      }
    }
  }, [])

  // 🎯 COLETA DE MÉTRICAS EM TEMPO REAL
  const startRealTimeMetricsCollection = useCallback((orchestrator) => {
    const interval = setInterval(async () => {
      try {
        // Coletar métricas do SystemOrchestrator
        const realTimeMetrics = await orchestrator.getRealTimeMetrics()
        const cacheMetrics = await orchestrator.getCacheStatistics()
        const systemPerformance = await orchestrator.getSystemPerformance()

        dispatch({ type: 'SET_REALTIME_METRICS', payload: realTimeMetrics })
        dispatch({ type: 'SET_CACHE_METRICS', payload: cacheMetrics })
        dispatch({ type: 'SET_SYSTEM_PERFORMANCE', payload: systemPerformance })

        logger.debug('📊 Métricas em tempo real atualizadas', {
          realTimeMetrics: realTimeMetrics?.activeSessions || 0,
          cacheHitRate: cacheMetrics?.hitRate || '0%',
          systemLoad: systemPerformance?.cpuUsage || 0,
        })
      } catch (error) {
        logger.error('Erro ao coletar métricas em tempo real:', error)
      }
    }, 5000) // Atualizar a cada 5 segundos

    setMetricsInterval(interval)
  }, [])

  // 🎯 FUNÇÃO PARA OBTER MÉTRICAS UNIFICADAS
  const getUnifiedMetrics = useCallback(async () => {
    if (!orchestratorRef || !userId) return null

    try {
      const unifiedStats = await orchestratorRef.getUnifiedStatistics(userId)
      return unifiedStats
    } catch (error) {
      logger.error('Erro ao obter métricas unificadas:', error)
      return null
    }
  }, [orchestratorRef, userId])

  // Função para exibir notificações temporárias
  const showNotification = useCallback((message, type = 'success') => {
    dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } })
    setTimeout(() => dispatch({ type: 'SET_NOTIFICATION', payload: null }), 5000)
  }, [])

  const getGameName = useCallback(
    (gameId) =>
      ({
        memory: 'Memória',
        colorMatch: 'Cores',
        imageAssociation: 'Associação',
        letterRecognition: 'Letras',
        numberCounting: 'Números',
        musicalSequence: 'Música',
        'visual-patterns': 'Padrões',
        'emotional-puzzle': 'Emoções',
      })[gameId] || gameId,
    []
  )

  const filterSessionsByTimeframe = useCallback((sessions, timeframe) => {
    if (timeframe === 'all') return sessions
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeframe))
    return sessions.filter((s) => new Date(s.created_at) >= cutoffDate)
  }, [])

  const calculateStats = useCallback((sessions) => {
    if (!sessions?.length)
      return { totalSessions: 0, avgAccuracy: 0, avgScore: 0, totalTimeSpent: 0 }
    const totalSessions = sessions.length
    return {
      totalSessions,
      avgAccuracy:
        Math.round(
          (sessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / totalSessions) * 100
        ) / 100,
      avgScore:
        Math.round((sessions.reduce((sum, s) => sum + (s.score || 0), 0) / totalSessions) * 100) /
        100,
      totalTimeSpent: Math.round(sessions.reduce((sum, s) => sum + (s.time_spent || 0), 0)),
    }
  }, [])

  const calculateStatsFromAPI = useCallback(
    (metrics, sessions) => {
      if (metrics?.summary) {
        return {
          totalSessions: metrics.summary.total_sessions || 0,
          avgAccuracy: Math.round((metrics.summary.avg_accuracy || 0) * 100) / 100,
          avgScore: Math.round((metrics.summary.avg_score || 0) * 100) / 100,
          totalTimeSpent: Math.round(metrics.summary.total_time_spent || 0),
        }
      }
      return calculateStats(sessions)
    },
    [calculateStats]
  )

  const withRetry = useCallback(async (fn, args = [], maxRetries = 3) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args)
      } catch (error) {
        logger.warn(`Tentativa ${attempt + 1}/${maxRetries + 1} falhou: ${error.message}`)
        if (attempt === maxRetries) throw error
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
      }
    }
  }, [])
  const fetchDashboardData = useCallback(
    async (force = false) => {
      if (!userId || !isDbConnected) {
        showNotification('Sem conexão ou usuário não identificado', 'warning')
        return
      }

      dispatch({ type: 'SET_LOADING', payload: true })

      try {
        // 🎯 OBTER MÉTRICAS UNIFICADAS DO SYSTEM ORCHESTRATOR PRIMEIRO
        let unifiedMetrics = null
        if (orchestratorRef) {
          try {
            unifiedMetrics = await getUnifiedMetrics()
            if (unifiedMetrics) {
              logger.info('📊 Métricas unificadas obtidas do SystemOrchestrator', unifiedMetrics)
            }
          } catch (error) {
            logger.warn('Erro ao obter métricas unificadas, usando fontes tradicionais:', error)
          }
        }

        const [sessions, metrics, profiles, engagement, patterns] = await Promise.all([
          withRetry(() =>
            databaseService.getGameSessions(
              userId,
              state.gameFilter === 'all' ? null : state.gameFilter,
              100
            )
          ),
          force ? withRetry(() => neuropedagogicalService.getDashboardMetrics(userId)) : null,
          withRetry(() => neuropedagogicalService.getCognitiveProfiles(userId, null, 10)),
          withRetry(() => neuropedagogicalService.getEngagementMetrics(userId, null, 50)),
          withRetry(() => neuropedagogicalService.getLearningPatterns(userId, null, 20)),
        ])

        // 🎯 MESCLAR DADOS TRADICIONAIS COM MÉTRICAS UNIFICADAS
        const enhancedSessions = unifiedMetrics?.sessions
          ? [...sessions, ...unifiedMetrics.sessions]
          : sessions

        const enhancedMetrics = unifiedMetrics?.behavioralMetrics
          ? { ...metrics, unified: unifiedMetrics.behavioralMetrics }
          : metrics

        dispatch({ type: 'SET_SESSION_DATA', payload: enhancedSessions })
        dispatch({ type: 'SET_DASHBOARD_METRICS', payload: enhancedMetrics })
        dispatch({ type: 'SET_COGNITIVE_PROFILES', payload: profiles })
        dispatch({ type: 'SET_ENGAGEMENT', payload: engagement })
        dispatch({ type: 'SET_LEARNING_PATTERNS', payload: patterns })

        // 🎯 CALCULAR ESTATÍSTICAS CONSIDERANDO DADOS UNIFICADOS
        const calculatedStats =
          unifiedMetrics?.combinedStats || calculateStatsFromAPI(enhancedMetrics, enhancedSessions)

        dispatch({ type: 'SET_STATS', payload: calculatedStats })
        dispatch({ type: 'SET_USAGE_STATS', payload: getUsageStats() })

        localStorage.setItem(
          `dashboard_cache_${userId}`,
          JSON.stringify({
            timestamp: Date.now(),
            sessions: enhancedSessions,
            metrics: enhancedMetrics,
            profiles,
            stats: calculatedStats,
          })
        )
        showNotification('Dados carregados com sucesso!', 'success')
      } catch (error) {
        try {
          const cachedData = JSON.parse(localStorage.getItem(`dashboard_cache_${userId}`))
          if (cachedData && Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000) {
            dispatch({ type: 'SET_SESSION_DATA', payload: cachedData.sessions })
            dispatch({ type: 'SET_DASHBOARD_METRICS', payload: cachedData.metrics })
            dispatch({ type: 'SET_COGNITIVE_PROFILES', payload: cachedData.profiles })
            dispatch({ type: 'SET_STATS', payload: cachedData.stats })
            showNotification('Usando dados em cache', 'warning')
          } else {
            const localSessions = await withRetry(() =>
              databaseService.getGameSessions(
                userId,
                state.gameFilter === 'all' ? null : state.gameFilter,
                100
              )
            )
            const filteredSessions = filterSessionsByTimeframe(localSessions, state.timeframe)
            dispatch({ type: 'SET_SESSION_DATA', payload: filteredSessions })
            dispatch({ type: 'SET_STATS', payload: calculateStats(filteredSessions) })
            dispatch({ type: 'SET_USAGE_STATS', payload: getUsageStats() })
            showNotification('Dados limitados devido a erro na API', 'error')
          }
        } catch (fallbackError) {
          showNotification('Erro ao carregar dados', 'error')
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [
      userId,
      isDbConnected,
      state.gameFilter,
      state.timeframe,
      orchestratorRef,
      filterSessionsByTimeframe,
      calculateStats,
      calculateStatsFromAPI,
      getUnifiedMetrics,
      showNotification,
    ]
  )

  const debouncedTimeframeChange = useCallback(
    debounce((value) => {
      dispatch({ type: 'SET_TIMEFRAME', payload: value })
    }, 100),
    []
  )

  const debouncedGameFilterChange = useCallback(
    debounce((value) => {
      dispatch({ type: 'SET_GAME_FILTER', payload: value })
    }, 100),
    []
  )

  const handleTimeframeChange = useCallback(
    (e) => debouncedTimeframeChange(e.target.value),
    [debouncedTimeframeChange]
  )
  const handleGameFilterChange = useCallback(
    (e) => debouncedGameFilterChange(e.target.value),
    [debouncedGameFilterChange]
  )
  const handleTabChange = useCallback(
    (tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }),
    []
  )

  // Função para gerar relatório
  const handleGenerateReport = useCallback(async () => {
    if (!userId) {
      showNotification('Usuário não identificado', 'error')
      return
    }
    try {
      const summary = await getProgressSummary(userId)
      dispatch({ type: 'SET_PROGRESS_DATA', payload: summary })
      showNotification('Relatório de progresso gerado com sucesso!', 'success')
    } catch (error) {
      showNotification('Erro ao gerar relatório', 'error')
    }
  }, [userId, showNotification])

  // Função para exportar dados em CSV
  const handleExportCSV = useCallback(() => {
    if (!state.sessionData.length) {
      showNotification('Nenhum dado disponível para exportação', 'warning')
      return
    }
    showNotification('Dados exportados com sucesso!', 'success')
  }, [state.sessionData, showNotification])

  // Função para limpar cache
  const handleClearCache = useCallback(() => {
    if (
      window.confirm('Tem certeza que deseja limpar o cache? Isso exigirá recarregar os dados.')
    ) {
      localStorage.removeItem(`dashboard_cache_${userId}`)
      fetchDashboardData(true)
      showNotification('Cache limpo com sucesso!', 'success')
    }
  }, [userId, fetchDashboardData, showNotification])

  // Preparar dados para exportação em CSV
  const csvData = useMemo(() => {
    return state.sessionData.map((session) => ({
      game_id: getGameName(session.game_id),
      score: session.score || 0,
      accuracy: session.accuracy || 0,
      time_spent: formatTotalTime(session.time_spent || 0),
      created_at: new Date(session.created_at).toLocaleString('pt-BR'),
    }))
  }, [state.sessionData, getGameName])

  const chartData = useMemo(() => {
    if (!state.sessionData?.length && !state.dashboardMetrics?.game_sessions) return null

    const sessions = state.sessionData || state.dashboardMetrics?.game_sessions || []
    const gameData = {}
    sessions.forEach((s) => {
      gameData[s.game_id] = gameData[s.game_id] || []
      gameData[s.game_id].push(s)
    })

    const gameScores = Object.entries(gameData).map(([gameId, sessions]) => ({
      gameId,
      avgScore: sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length,
      totalSessions: sessions.length,
    }))

    const backgroundColors = [
      theme.colors.primaryBlue + '80',
      theme.colors.primaryPurple + '80',
      theme.colors.primaryPink + '80',
      theme.colors.primaryOrange + '80',
      theme.colors.primaryGreen + '80',
      theme.colors.primaryCyan + '80',
      theme.colors.warning + '80',
    ]

    const lineData = neuropedagogicalService.processPerformanceData(sessions)
    const cognitiveRadar = neuropedagogicalService.processCognitiveProfile(state.cognitiveProfiles)

    return {
      lineData: lineData.datasets?.length
        ? lineData
        : {
            labels: [],
            datasets: [
              {
                label: 'Pontuação',
                data: [],
                borderColor: theme.colors.primaryBlue,
                backgroundColor: theme.colors.primaryBlue + '20',
                tension: 0.3,
                fill: true,
              },
            ],
          },
      barData: {
        labels: gameScores.map((item) => getGameName(item.gameId)),
        datasets: [
          {
            label: 'Pontuação',
            data: gameScores.map((item) => item.avgScore),
            backgroundColor: backgroundColors,
          },
        ],
      },
      pieData: {
        labels: gameScores.map((item) => getGameName(item.gameId)),
        datasets: [
          { data: gameScores.map((item) => item.totalSessions), backgroundColor: backgroundColors },
        ],
      },
      cognitiveRadar: cognitiveRadar?.datasets?.length
        ? cognitiveRadar
        : {
            labels: [
              'Carga Cognitiva',
              'Atenção',
              'Memória',
              'Velocidade',
              'Visual',
              'Auditivo',
              'Multissensorial',
              'Motor',
            ],
            datasets: [
              {
                label: 'Score',
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: theme.colors.primaryPurple,
                backgroundColor: theme.colors.primaryPurple + '20',
              },
            ],
          },
    }
  }, [state.sessionData, state.dashboardMetrics, getGameName, state.cognitiveProfiles])

  // Opções para o radar de dados
  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: theme.colors.darkGray, font: { size: 14, weight: 'bold' } },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: theme.colors.darkGray,
        bodyColor: theme.colors.darkGray,
        borderColor: theme.colors.primaryPurple,
        borderWidth: 1,
        callbacks: { label: (context) => `${context.dataset.label}: ${context.parsed.r}%` },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: theme.colors.mediumGray,
          font: { size: 12, weight: 'bold' },
          callback: (value) => `${value}%`,
        },
        grid: { color: 'rgba(74, 144, 235, 0.2)', lineWidth: 2 },
        angleLines: { color: 'rgba(74, 144, 235, 0.5)', lineWidth: 1 },
        pointLabels: { color: theme.colors.darkGray, font: { size: 13, weight: 'bold' } },
      },
    },
    interaction: { intersect: false, mode: 'point' },
  }

  // Variantes de animação
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.3 } }),
  }

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return (
    <ThemeProvider theme={theme}>
      <OrientationMessage>
        Por favor, gire seu dispositivo para a orientação horizontal.
      </OrientationMessage>
      <DashboardContainer>
        <DashboardContent>
          <DashboardHeader>
            <div>
              <DashboardTitle>
                <span role="img" aria-label="gráfico">
                  📊
                </span>{' '}
                Dashboard de Desempenho
              </DashboardTitle>
              <DashboardSubtitle>
                Acompanhe o progresso de {userDetails?.displayName || 'Usuário'}
              </DashboardSubtitle>
            </div>
            <ControlPanel>
              <ActionButton
                $bgColor={theme.colors.primaryBlue}
                onClick={handleGenerateReport}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Gerar relatório"
              >
                📚 Gerar Relatório
              </ActionButton>
              <ActionButton
                $bgColor={theme.colors.primaryGreen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Exportar CSV"
              >
                <CSVLink
                  data={csvData}
                  filename={`desempenho_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  onClick={handleExportCSV}
                >
                  📊 Exportar CSV
                </CSVLink>
              </ActionButton>
              <ActionButton
                $bgColor={theme.colors.primaryOrange}
                onClick={handleClearCache}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Limpar cache"
              >
                🗑️ Limpar Cache
              </ActionButton>
            </ControlPanel>
          </DashboardHeader>

          <TabsContainer role="tablist">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'neuropedagogical', label: 'Neuropedagógica', icon: '🧠' },
              { id: 'multisensorial', label: 'Multissensorial', icon: '💡', premium: true },
              { id: 'ai-reports', label: 'Relatórios IA', icon: '🤖', premium: true },
            ].map((tab) => (
              <TabButton
                key={tab.id}
                $active={state.activeTab === tab.id}
                $premium={tab.premium}
                onClick={() => handleTabChange(tab.id)}
                role="tab"
                aria-selected={state.activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
              >
                {tab.icon} {tab.label}{' '}
                {tab.premium && <span style={{ fontSize: '0.8em', opacity: 0.8 }}>(Premium)</span>}
              </TabButton>
            ))}
          </TabsContainer>

          {state.progressData?.overallProgress?.offlineData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: `${theme.colors.warning}15`,
                borderLeft: `4px solid ${theme.colors.warning}`,
                padding: '16px',
                marginBottom: '24px',
                borderRadius: '8px',
              }}
            >
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>⚠️ Modo Offline:</strong> Alguns dados estão sendo exibidos do armazenamento
                local. Eles serão sincronizados ao reconectar com o servidor.
              </p>
            </motion.div>
          )}

          {state.isLoading ? (
            <LoadingContainer aria-live="polite">
              <BrainLoader
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              />
              <span role="status">Processando dados...</span>
            </LoadingContainer>
          ) : (
            <>
              <div
                role="tabpanel"
                id={`panel-${state.activeTab}`}
                aria-labelledby={`tab-${state.activeTab}`}
              >
                {' '}
                {state.activeTab === 'dashboard' && chartData && (
                  <>
                    {/* 🎯 PAINEL DE MÉTRICAS EM TEMPO REAL DO SYSTEM ORCHESTRATOR */}
                    <RealTimeMetricsPanel
                      realTimeMetrics={state.realTimeMetrics}
                      cacheMetrics={state.cacheMetrics}
                      systemPerformance={state.systemPerformance}
                      orchestratorStatus={state.orchestratorStatus}
                    />

                    <FilterBar
                      timeframe={state.timeframe}
                      gameFilter={state.gameFilter}
                      onTimeframeChange={handleTimeframeChange}
                      onGameFilterChange={handleGameFilterChange}
                    />

                    <StatsGrid>
                      {state.stats.totalSessions > 0 ? (
                        [
                          {
                            label: 'Sessões',
                            value: state.stats.totalSessions,
                            color: theme.colors.primaryBlue,
                            icon: '🎮',
                          },
                          {
                            label: 'Precisão',
                            value: `${state.stats.avgAccuracy}%`,
                            color: theme.colors.primaryPurple,
                            icon: '🎯',
                          },
                          {
                            label: 'Pontuação',
                            value: state.stats.avgScore,
                            color: theme.colors.primaryPink,
                            icon: '⭐',
                          },
                          {
                            label: 'Tempo Total',
                            value: formatTotalTime(state.stats.totalTimeSpent),
                            color: theme.colors.primaryOrange,
                            icon: '⏱️',
                          },
                        ].map((stat, index) => (
                          <EnhancedStatCard
                            $bgColor={stat.color}
                            key={index}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                          >
                            <EnhancedStatValue $color={stat.color}>
                              {stat.icon} {stat.value}
                            </EnhancedStatValue>
                            <EnhancedStatLabel>{stat.label}</EnhancedStatLabel>
                          </EnhancedStatCard>
                        ))
                      ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '24px' }}>
                          <p style={{ color: theme.colors.mediumGray }}>
                            Aguardando dados de sessões...
                          </p>
                        </div>
                      )}
                    </StatsGrid>

                    <ChartsGrid>
                      <ChartSection
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <SectionTitle>Evolução Temporal</SectionTitle>
                        <ChartContainer>
                          <Line
                            data={chartData.lineData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { position: 'top' },
                                title: {
                                  display: true,
                                  text: 'Pontuação Média',
                                  font: { size: 16 },
                                },
                              },
                              scales: { y: { beginAtZero: true } },
                            }}
                          />
                        </ChartContainer>
                      </ChartSection>

                      <ChartSection
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <SectionTitle>Desempenho por Jogo</SectionTitle>
                        <ChartContainer>
                          <Bar
                            data={chartData.barData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { position: 'top' },
                                title: {
                                  display: true,
                                  text: 'Pontuação Média',
                                  font: { size: 16 },
                                },
                              },
                              scales: { y: { beginAtZero: true } },
                            }}
                          />
                        </ChartContainer>
                      </ChartSection>

                      <ChartSection
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <SectionTitle>Sessões por Jogo</SectionTitle>
                        <ChartContainer>
                          <Pie
                            data={chartData.pieData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { position: 'right', labels: { font: { size: 12 } } },
                                title: {
                                  display: true,
                                  text: 'Distribuição de Sessões',
                                  font: { size: 16 },
                                },
                              },
                            }}
                          />
                        </ChartContainer>
                      </ChartSection>

                      <ChartSection
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <SectionTitle>Perfil Cognitivo</SectionTitle>
                        <ChartContainer>
                          <Radar data={chartData.cognitiveRadar} options={radarChartOptions} />
                        </ChartContainer>
                      </ChartSection>
                    </ChartsGrid>

                    {state.engagementMetrics?.length > 0 && (
                      <ChartSection
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <SectionTitle>Engajamento</SectionTitle>
                        <StatsGrid>
                          {(() => {
                            const processed = neuropedagogicalService.processEngagementMetrics(
                              state.engagementMetrics
                            )
                            return [
                              {
                                label: 'Foco',
                                value: `${processed.focus_duration || 0}s`,
                                color: theme.colors.primaryGreen,
                                icon: '🧘',
                              },
                              {
                                label: 'Interação',
                                value: `${processed.interaction_rate || 0}%`,
                                color: theme.colors.primaryCyan,
                                icon: '🤝',
                              },
                              {
                                label: 'Frustração',
                                value: `${processed.frustration_level || 0}%`,
                                color: theme.colors.primaryOrange,
                                icon: '😣',
                              },
                              {
                                label: 'Engajamento',
                                value: `${processed.engagement_score || 0}%`,
                                color: theme.colors.primaryPink,
                                icon: '🔥',
                              },
                            ].map((stat, index) => (
                              <EnhancedStatCard
                                $bgColor={stat.color}
                                key={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                custom={index + 4}
                              >
                                <EnhancedStatValue $color={stat.color}>
                                  {stat.icon} {stat.value}
                                </EnhancedStatValue>
                                <EnhancedStatLabel>{stat.label}</EnhancedStatLabel>
                              </EnhancedStatCard>
                            ))
                          })()}
                        </StatsGrid>
                      </ChartSection>
                    )}

                    <ChartSection
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <SectionTitle>🎯 Ranking de Jogos Mais Utilizados</SectionTitle>
                      {state.usageStats && state.usageStats.totalUsage > 0 ? (
                        <div>
                          <StatsGrid>
                            <EnhancedStatCard
                              $bgColor={theme.colors.primaryCyan}
                              variants={cardVariants}
                              custom={8}
                              initial="hidden"
                              animate="visible"
                            >
                              <EnhancedStatValue $color={theme.colors.primaryCyan}>
                                {state.usageStats.totalUsage}
                              </EnhancedStatValue>
                              <EnhancedStatLabel>Total de Jogadas</EnhancedStatLabel>
                            </EnhancedStatCard>
                            <EnhancedStatCard
                              $bgColor={theme.colors.primaryPink}
                              variants={cardVariants}
                              custom={9}
                              initial="hidden"
                              animate="visible"
                            >
                              <EnhancedStatValue $color={theme.colors.primaryPink}>
                                {state.usageStats.totalGames}
                              </EnhancedStatValue>
                              <EnhancedStatLabel>Jogos Utilizados</EnhancedStatLabel>
                            </EnhancedStatCard>
                          </StatsGrid>
                          <div
                            style={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              padding: '16px',
                              borderRadius: '12px',
                              border: `1px solid ${theme.colors.lightGray}`,
                              marginTop: '16px',
                            }}
                          >
                            <h4 style={{ color: theme.colors.primaryBlue, marginBottom: '12px' }}>
                              📊 Detalhes de Uso por Jogo
                            </h4>
                            <UsageGamesList />
                            <div style={{ marginTop: '16px', textAlign: 'center' }}>
                              <ActionButton
                                $bgColor={theme.colors.primaryOrange}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      'Tem certeza que deseja resetar as estatísticas de uso?'
                                    )
                                  ) {
                                    resetGameUsage()
                                    dispatch({ type: 'SET_USAGE_STATS', payload: getUsageStats() })
                                    showNotification('Estatísticas de uso resetadas!', 'success')
                                  }
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Resetar estatísticas"
                              >
                                🔄 Resetar
                              </ActionButton>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            textAlign: 'center',
                            color: theme.colors.mediumGray,
                            padding: '24px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '12px',
                            border: `1px solid ${theme.colors.lightGray}`,
                          }}
                        >
                          <p>🎮 Nenhum jogo foi utilizado até o momento.</p>
                          <p>Jogue para começar a ver suas sessões aqui!</p>
                        </div>
                      )}
                    </ChartSection>

                    <ChartSection
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <SectionTitle>🧠 Mapa de Habilidades</SectionTitle>
                      <ChartContainer style={{ height: '450px' }}>
                        <Radar data={chartData?.cognitiveRadar} options={radarChartOptions} />
                      </ChartContainer>
                      <p
                        style={{
                          textAlign: 'center',
                          fontSize: '14px',
                          marginTop: '12px',
                          color: theme.colors.mediumGray,
                          backgroundColor: 'rgba(74, 144, 226, 0.1)',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(74, 140, 226, 0.2)',
                        }}
                      >
                        💡 **Como interpretar**: Este radar mostra as habilidades desenvolvidas nos
                        jogos. Áreas mais amplas indicam um desenvolvimento cognitivo equilibrado.
                      </p>
                    </ChartSection>
                  </>
                )}
                {state.activeTab === 'neuropedagogical' && (
                  <NeuropedagogicalDashboard userId={userId} />
                )}
                {state.activeTab === 'multisensorial' && (
                  <>
                    {!isPremiumUser && (
                      <PremiumGateOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PremiumGateContent>
                          <PremiumTitle>Acesso Premium</PremiumTitle>
                          <PremiumText>
                            As métricas multissensoriais são exclusivas para assinantes premium.
                          </PremiumText>
                          <PremiumButton onClick={() => (window.location.href = '/premium')}>
                            Assinar Premium
                          </PremiumButton>
                        </PremiumGateContent>
                      </PremiumGateOverlay>
                    )}
                    {isPremiumUser && (
                      <MultisensoryMetricsDashboard
                        timeframe={state.timeframe}
                        userId={userId}
                        isPremiumUser={isPremiumUser}
                      />
                    )}
                  </>
                )}
                {state.activeTab === 'ai-reports' && (
                  <>
                    {!isPremiumUser && (
                      <PremiumGateOverlay
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PremiumGateContent>
                          <PremiumTitle>Acesso Premium</PremiumTitle>
                          <PremiumText>
                            Os relatórios de IA são exclusivos para assinantes premium.
                          </PremiumText>
                          <PremiumButton onClick={() => (window.location.href = '/premium')}>
                            Assinar Premium
                          </PremiumButton>
                        </PremiumGateContent>
                      </PremiumGateOverlay>
                    )}
                    {isPremiumUser && (
                      <AIReportsTab sessionData={state.sessionData} userId={userId} />
                    )}
                  </>
                )}
              </div>

              {state.error && (
                <Notification
                  $type={state.error.level}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                >
                  <p>{state.error.message}</p>
                  <button
                    onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
                    aria-label="Fechar erro"
                  >
                    ✕
                  </button>
                </Notification>
              )}

              {state.notification && (
                <Notification
                  $type={state.notification.type}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                >
                  <p>{state.notification.message}</p>
                  <button
                    onClick={() => dispatch({ type: 'SET_NOTIFICATION', payload: null })}
                    aria-label="Fechar notificação"
                  >
                    ✕
                  </button>
                </Notification>
              )}
            </>
          )}
        </DashboardContent>
      </DashboardContainer>
    </ThemeProvider>
  )
}

export default PerformanceDashboard
