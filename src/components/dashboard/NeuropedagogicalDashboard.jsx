import React, { useState, useEffect, useMemo, useCallback, useReducer } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { useUser } from '../../contexts/UserContext'
import databaseService from '../../database/core/DatabaseService.js'
import neuropedagogicalService from '../../utils/metrics/neuropedagogicalService.js'
import logger from '../../config/api-config.js'
import NeuropedagogicalDashboard from '../dashboard/NeuropedagogicalDashboard'
import AIReportsTab from '../reports/AIReportsTab'
import MultisensoryMetricsDashboard from '../dashboard/MultisensoryMetricsDashboard'
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
import { getUsageStats } from '../../utils/game/gameUsage.js'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'

// Register Chart.js components
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

// Theme configuration
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
    normal: '0.2s ease',
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

// Reducer state
const initialState = {
  timeframe: '30d',
  gameFilter: 'all',
  sessionData: [],
  isLoading: false,
  usageStats: null,
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
  loadProgress: null,
  error: null,
}

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
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
    case 'SET_DASHBOARD_METRICS':
      return { ...state, dashboardMetrics: action.payload }
    case 'SET_COGNITIVE_PROFILES':
      return { ...state, cognitiveProfiles: action.payload }
    case 'SET_ENGAGEMENT_METRICS':
      return { ...state, engagementMetrics: action.payload }
    case 'SET_LEARNING_PATTERNS':
      return { ...state, learningPatterns: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

// Styled components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: center;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (orientation: portrait) {
    display: none;
  }
`

const DashboardContent = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.large};
  box-shadow: ${({ theme }) => theme.shadow.medium};
  padding: ${({ theme }) => theme.spacing.xl};
  position: relative;

  @media (max-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`

const DashboardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  @media (max-width: 1024px) {
    text-align: center;
  }
`

const DashboardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.darkGray};
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 1024px) {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`

const DashboardSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.mediumGray};
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  font-weight: 400;

  @media (max-width: 1024px) {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`

const FilterBarStyled = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.radius.medium};

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`

const FilterGroupStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
  min-width: 180px;

  label {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.darkGray};
  }
`

const SelectStyled = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.small};
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  background: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.normal};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryBlue};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  @media (max-width: 1024px) {
    width: 100%;
  }
`

const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.radius.medium};
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1024px) {
    justify-content: flex-start;
  }
`

const TabButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.radius.small};
  background: ${({ $active, theme }) => ($active ? theme.colors.primaryBlue : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.darkGray)};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.normal};
  white-space: nowrap;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primaryBlue : theme.colors.lightGray};
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.primaryBlue)};
  }

  ${({ $premium, $active, theme }) =>
    $premium &&
    !$active &&
    `
    background: ${theme.colors.premiumGold}20;
    color: ${theme.colors.premiumGold};
  `}

  @media (max-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
`

const PremiumGateOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`

const PremiumGateContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.medium};
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.shadow.strong};
`

const PremiumTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const PremiumText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.mediumGray};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const PremiumButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primaryBlue};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.radius.small};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.normal};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryPurple};
  }
`

const ChartSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadow.light};

  @media (max-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const ChartContainer = styled.div`
  height: 320px;
  padding: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 1024px) {
    height: 280px;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.primaryBlue};
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`

const StatCard = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ $bgColor }) => $bgColor};
  border-radius: ${({ theme }) => theme.radius.small};
  transition: ${({ theme }) => theme.transition.normal};

  &:hover {
    transform: translateY(-2px);
  }

  h4 {
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    color: ${({ theme }) => theme.colors.mediumGray};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: 500;
  }

  .stat-value {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 600;
    color: ${({ $textColor }) => $textColor};
  }
`

const ErrorMessage = styled.div`
  background: ${({ $level, theme }) =>
    $level === 'error'
      ? theme.colors.primaryPink + '15'
      : $level === 'warning'
        ? theme.colors.primaryOrange + '15'
        : theme.colors.primaryBlue + '15'};
  border: 1px solid
    ${({ $level, theme }) =>
      $level === 'error'
        ? theme.colors.primaryPink
        : $level === 'warning'
          ? theme.colors.primaryOrange
          : theme.colors.primaryBlue};
  color: ${({ theme }) => theme.colors.darkGray};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.small};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.mediumGray};
    padding: ${({ theme }) => theme.spacing.xs};
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
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px;
  z-index: 9999;

  @media (orientation: portrait) {
    display: flex;
  }
`

const FilterBar = ({ timeframe, gameFilter, onTimeframeChange, onGameFilterChange }) => (
  <FilterBarStyled>
    <FilterGroupStyled>
      <label htmlFor="timeframe">Período</label>
      <SelectStyled id="timeframe" value={timeframe} onChange={onTimeframeChange}>
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
      <SelectStyled id="gameFilter" value={gameFilter} onChange={onGameFilterChange}>
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

const PerformanceDashboard = () => {
  const { userId, isDbConnected, userDetails } = useUser()
  const [state, dispatch] = useReducer(dashboardReducer, initialState)
  const [isPremiumUser, setIsPremiumUser] = useState(false)

  useEffect(() => {
    setIsPremiumUser(userDetails?.subscription?.isPremium || false)
  }, [userDetails])

  const getGameName = useCallback(
    (gameId) =>
      ({
        memory: 'Jogo da Memória',
        colorMatch: 'Combinar Cores',
        imageAssociation: 'Associação de Imagens',
        letterRecognition: 'Reconhecimento de Letras',
        numberCounting: 'Contagem de Números',
        musicalSequence: 'Sequência Musical',
        'visual-patterns': 'Padrões Visuais',
        'emotional-puzzle': 'Quebra-Cabeça Emocional',
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
        logger.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed: ${error.message}`)
        if (attempt === maxRetries) throw error
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
      }
    }
  }, [])

  const fetchDashboardData = useCallback(async () => {
    if (!userId || !isDbConnected) {
      dispatch({
        type: 'SET_ERROR',
        payload: { level: 'warning', message: 'Sem conexão ou usuário não identificado' },
      })
      return
    }

    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const [sessions, profiles, engagement, patterns] = await Promise.all([
        withRetry(() =>
          databaseService.getGameSessions(
            userId,
            state.gameFilter === 'all' ? null : state.gameFilter,
            100
          )
        ),
        withRetry(() => neuropedagogicalService.getCognitiveProfiles(userId, null, 10)),
        withRetry(() => neuropedagogicalService.getEngagementMetrics(userId, null, 50)),
        withRetry(() => neuropedagogicalService.getLearningPatterns(userId, null, 20)),
      ])

      let metrics = null
      try {
        metrics = await withRetry(() => neuropedagogicalService.getDashboardMetrics(userId))
      } catch (error) {
        logger.warn('Failed to fetch dashboard metrics, proceeding with available data')
        dispatch({
          type: 'SET_ERROR',
          payload: {
            level: 'warning',
            message: 'Métricas do dashboard indisponíveis, usando dados locais',
          },
        })
      }

      dispatch({ type: 'SET_SESSION_DATA', payload: sessions })
      dispatch({ type: 'SET_DASHBOARD_METRICS', payload: metrics })
      dispatch({ type: 'SET_COGNITIVE_PROFILES', payload: profiles })
      dispatch({ type: 'SET_ENGAGEMENT_METRICS', payload: engagement })
      dispatch({ type: 'SET_LEARNING_PATTERNS', payload: patterns })
      dispatch({ type: 'SET_STATS', payload: calculateStatsFromAPI(metrics, sessions) })
      dispatch({ type: 'SET_USAGE_STATS', payload: getUsageStats() })

      localStorage.setItem(
        `dashboard_cache_${userId}`,
        JSON.stringify({
          timestamp: Date.now(),
          sessions,
          metrics,
          profiles,
          stats: calculateStatsFromAPI(metrics, sessions),
        })
      )
    } catch (error) {
      logger.error('Error fetching dashboard data:', error)
      try {
        const cachedData = JSON.parse(localStorage.getItem(`dashboard_cache_${userId}`))
        if (cachedData && Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000) {
          dispatch({ type: 'SET_SESSION_DATA', payload: cachedData.sessions })
          dispatch({ type: 'SET_DASHBOARD_METRICS', payload: cachedData.metrics })
          dispatch({ type: 'SET_COGNITIVE_PROFILES', payload: cachedData.profiles })
          dispatch({ type: 'SET_STATS', payload: cachedData.stats })
          dispatch({
            type: 'SET_ERROR',
            payload: { level: 'warning', message: 'Usando dados em cache' },
          })
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
          dispatch({
            type: 'SET_ERROR',
            payload: { level: 'error', message: 'Dados limitados devido a erro na API' },
          })
        }
      } catch (fallbackError) {
        logger.error('Fallback error:', fallbackError)
        dispatch({
          type: 'SET_ERROR',
          payload: { level: 'error', message: 'Erro ao carregar dados' },
        })
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [
    userId,
    isDbConnected,
    state.gameFilter,
    state.timeframe,
    filterSessionsByTimeframe,
    calculateStats,
    calculateStatsFromAPI,
  ])

  const debouncedTimeframeChange = useCallback(
    debounce((value) => {
      dispatch({ type: 'SET_TIMEFRAME', payload: value })
    }, 200),
    []
  )

  const debouncedGameFilterChange = useCallback(
    debounce((value) => {
      dispatch({ type: 'SET_GAME_FILTER', payload: value })
    }, 200),
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
            label: 'Pontuação Média',
            data: gameScores.map((item) => item.avgScore),
            backgroundColor: backgroundColors,
          },
        ],
      },
      pieData: {
        labels: gameScores.map((item) => getGameName(item.gameId)),
        datasets: [
          {
            label: 'Sessões',
            data: gameScores.map((item) => item.totalSessions),
            backgroundColor: backgroundColors,
          },
        ],
      },
      cognitiveRadarData: cognitiveRadar.datasets?.length
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
                label: 'Perfil Cognitivo',
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: theme.colors.primaryPurple,
                backgroundColor: theme.colors.primaryPurple + '20',
              },
            ],
          },
    }
  }, [state.sessionData, state.dashboardMetrics, state.cognitiveProfiles, getGameName])

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
            <DashboardTitle>Dashboard de Performance</DashboardTitle>
            <DashboardSubtitle>Acompanhe o progresso e desempenho</DashboardSubtitle>
          </DashboardHeader>

          <FilterBar
            timeframe={state.timeframe}
            gameFilter={state.gameFilter}
            onTimeframeChange={handleTimeframeChange}
            onGameFilterChange={handleGameFilterChange}
          />

          <TabsContainer>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'neuropedagogical', label: 'Neuropedagógica', icon: '🧠' },
              { id: 'multisensory', label: 'Multissensorial', icon: '🧠✨', premium: true },
              { id: 'ai-reports', label: 'Relatórios IA', icon: '🤖', premium: true },
            ].map((tab) => (
              <TabButton
                key={tab.id}
                $active={state.activeTab === tab.id}
                $premium={tab.premium}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.icon} {tab.label}
              </TabButton>
            ))}
          </TabsContainer>

          {state.isLoading ? (
            <LoadingSpinner>
              <span style={{ fontSize: '1.5rem' }}>🔄</span>
              Carregando...
            </LoadingSpinner>
          ) : (
            <>
              {state.activeTab === 'dashboard' && chartData && (
                <>
                  <ChartsGrid>
                    <ChartSection>
                      <SectionTitle>Progresso</SectionTitle>
                      <ChartContainer>
                        <Line
                          data={chartData.lineData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'top' },
                              title: { display: true, text: 'Pontuação Média', font: { size: 14 } },
                            },
                            scales: { y: { beginAtZero: true } },
                          }}
                        />
                      </ChartContainer>
                    </ChartSection>

                    <ChartSection>
                      <SectionTitle>Desempenho por Jogo</SectionTitle>
                      <ChartContainer>
                        <Bar
                          data={chartData.barData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'top' },
                              title: { display: true, text: 'Pontuação Média', font: { size: 14 } },
                            },
                            scales: { y: { beginAtZero: true } },
                          }}
                        />
                      </ChartContainer>
                    </ChartSection>

                    <ChartSection>
                      <SectionTitle>Sessões</SectionTitle>
                      <ChartContainer>
                        <Pie
                          data={chartData.pieData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'right', labels: { font: { size: 10 } } },
                              title: {
                                display: true,
                                text: 'Sessões por Jogo',
                                font: { size: 14 },
                              },
                            },
                          }}
                        />
                      </ChartContainer>
                    </ChartSection>

                    <ChartSection>
                      <SectionTitle>Perfil Cognitivo</SectionTitle>
                      <ChartContainer>
                        <Radar
                          data={chartData.cognitiveRadarData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'top' },
                              title: {
                                display: true,
                                text: 'Análise Cognitiva',
                                font: { size: 14 },
                              },
                            },
                            scales: {
                              r: {
                                beginAtZero: true,
                                max: 100,
                                ticks: { stepSize: 20, font: { size: 10 } },
                              },
                            },
                          }}
                        />
                      </ChartContainer>
                    </ChartSection>
                  </ChartsGrid>

                  {state.engagementMetrics?.length > 0 && (
                    <ChartSection>
                      <SectionTitle>Engajamento</SectionTitle>
                      <StatsGrid>
                        {(() => {
                          const processed = neuropedagogicalService.processEngagementMetrics(
                            state.engagementMetrics
                          )
                          return [
                            {
                              label: 'Foco',
                              value: `${processed.focus_duration}s`,
                              color: theme.colors.primaryGreen,
                            },
                            {
                              label: 'Interação',
                              value: `${processed.interaction_rate}%`,
                              color: theme.colors.primaryCyan,
                            },
                            {
                              label: 'Frustração',
                              value: `${processed.frustration_level}%`,
                              color: theme.colors.primaryOrange,
                            },
                            {
                              label: 'Engajamento',
                              value: `${processed.engagement_score}%`,
                              color: theme.colors.primaryPink,
                            },
                          ].map((stat, i) => (
                            <StatCard key={i} $bgColor={stat.color + '20'} $textColor={stat.color}>
                              <h4>{stat.label}</h4>
                              <p className="stat-value">{stat.value}</p>
                            </StatCard>
                          ))
                        })()}
                      </StatsGrid>
                    </ChartSection>
                  )}

                  <ChartSection>
                    <SectionTitle>Estatísticas</SectionTitle>
                    <StatsGrid>
                      {[
                        {
                          label: 'Sessões',
                          value: state.stats.totalSessions,
                          color: theme.colors.primaryBlue,
                        },
                        {
                          label: 'Precisão',
                          value: `${state.stats.avgAccuracy}%`,
                          color: theme.colors.primaryPurple,
                        },
                        {
                          label: 'Pontuação',
                          value: state.stats.avgScore,
                          color: theme.colors.primaryPink,
                        },
                        {
                          label: 'Tempo (min)',
                          value: Math.round(state.stats.totalTimeSpent / 60),
                          color: theme.colors.primaryOrange,
                        },
                      ].map((stat, i) => (
                        <StatCard key={i} $bgColor={stat.color + '20'} $textColor={stat.color}>
                          <h4>{stat.label}</h4>
                          <p className="stat-value">{stat.value}</p>
                        </StatCard>
                      ))}
                    </StatsGrid>
                  </ChartSection>
                </>
              )}

              {state.activeTab === 'neuropedagogical' && (
                <NeuropedagogicalDashboard userId={userId} />
              )}

              {state.activeTab === 'multisensory' && (
                <>
                  {!isPremiumUser && (
                    <PremiumGateOverlay>
                      <PremiumGateContent>
                        <PremiumTitle>Acesso Premium</PremiumTitle>
                        <PremiumText>
                          Métricas Multissensoriais requerem assinatura premium.
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
                    <PremiumGateOverlay>
                      <PremiumGateContent>
                        <PremiumTitle>Acesso Premium</PremiumTitle>
                        <PremiumText>Relatórios de IA requerem assinatura premium.</PremiumText>
                        <PremiumButton onClick={() => (window.location.href = '/premium')}>
                          Assinar Premium
                        </PremiumButton>
                      </PremiumGateContent>
                    </PremiumGateOverlay>
                  )}
                  {isPremiumUser && <AIReportsTab />}
                </>
              )}

              {state.error && (
                <ErrorMessage $level={state.error.level}>
                  <p>{state.error.message}</p>
                  <button onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}>✕</button>
                </ErrorMessage>
              )}
            </>
          )}
        </DashboardContent>
      </DashboardContainer>
    </ThemeProvider>
  )
}

export default PerformanceDashboard
