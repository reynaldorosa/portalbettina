import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { motion } from 'framer-motion'
import { useUser } from '../../contexts/UserContext'
import multisensoryMetricsService from '../../utils/metrics/multisensoryMetricsService.js'
import multisensoryMetrics from '../../utils/multisensoryAnalysis/multisensoryMetrics.js'
import logger from '../../config/api-config.js'
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
  PolarAreaController,
} from 'chart.js'
import { Line, Doughnut, Radar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
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
  PolarAreaController
)

// Theme configuration
const theme = {
  colors: {
    primaryBlue: '#3B82F6',
    primaryPurple: '#7C3AED',
    primaryPink: '#EC4899',
    primaryOrange: '#F59E0B',
    primaryGreen: '#10B981',
    primaryCyan: '#06B6D4',
    premiumGold: '#FFD700',
    neurodivergenceViolet: '#9D4EDD',
    accessibilityGreen: '#059669',
    sensorOrange: '#EA580C',
    geolocationBlue: '#0EA5E9',
    multisensoryRainbow: 'linear-gradient(90deg, #3B82F6, #7C3AED, #EC4899, #F59E0B)',
    darkGray: '#1F2A44',
    mediumGray: '#6B7280',
    lightGray: '#F3F4F6',
    white: '#FFFFFF',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  radius: {
    small: '6px',
    medium: '10px',
    large: '14px',
  },
  shadow: {
    light: '0 2px 6px rgba(0,0,0,0.1)',
    medium: '0 4px 12px rgba(0,0,0,0.15)',
    strong: '0 8px 24px rgba(0,0,0,0.2)',
  },
}

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.radius.large};
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.sm};
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (orientation: portrait) {
    display: none;
  }
`

const HeaderSection = styled.div`
  background: ${({ theme }) => theme.colors.multisensoryRainbow};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadow.medium};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
    top: -60px;
    right: -60px;
    border-radius: 50%;
  }

  @media (max-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

const HeaderTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: 1.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

  @media (max-width: 1024px) {
    font-size: 1.4rem;
  }
`

const HeaderSubtitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.9;
  max-width: 85%;
  line-height: 1.4;

  @media (max-width: 1024px) {
    font-size: 0.85rem;
    max-width: 95%;
  }
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
`

const MetricCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadow.light};
  border-left: 4px solid ${({ borderColor }) => borderColor};
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadow.medium};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`

const MetricTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.darkGray};
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 1024px) {
    font-size: 1rem;
  }
`

const ChartContainer = styled.div`
  height: 260px;
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 1024px) {
    height: 220px;
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`

const StatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ bgColor }) => bgColor || '#f8fafc'};
  border-radius: ${({ theme }) => theme.radius.small};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ bgColor }) => (bgColor ? bgColor.replace('20', '30') : '#f1f5f9')};
  }
`

const StatValue = styled.div`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ color }) => color || theme.colors.primaryBlue};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 1024px) {
    font-size: 1.2rem;
  }
`

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.mediumGray};
  font-weight: 500;
`

const InsightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
`

const InsightItem = styled(motion.li)`
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  background: ${({ bgColor }) => bgColor || '#f0f9ff'};
  border-radius: ${({ theme }) => theme.radius.small};
  border-left: 3px solid ${({ borderColor }) => borderColor || theme.colors.primaryBlue};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.darkGray};
  line-height: 1.4;

  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }
`

const LoadingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.primaryPurple};
  font-size: 1rem;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 200px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.mediumGray};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadow.light};

  .icon {
    font-size: 2.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primaryBlue};
  }

  .message {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  .submessage {
    font-size: 0.85rem;
    opacity: 0.85;
    max-width: 80%;
    margin: 0 auto;
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

const MultisensoryMetricsDashboard = ({
  timeframe = '30d',
  userId = null,
  isPremiumUser = false,
}) => {
  const { userId: currentUserId } = useUser()
  const finalUserId = userId || currentUserId

  const [isLoading, setIsLoading] = useState(true)
  const [multisensoryData, setMultisensoryData] = useState(null)
  const [sensorData, setSensorData] = useState([])
  const [neurodivergenceMetrics, setNeurodivergenceMetrics] = useState([])
  const [accessibilityMetrics, setAccessibilityMetrics] = useState([])
  const [interactionData, setInteractionData] = useState([])

  const fetchMultisensoryData = useCallback(async () => {
    if (!finalUserId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const [sensorResults, neuroResults, accessResults, interactionResults] = await Promise.all([
        multisensoryMetricsService.getMobileSensorData(finalUserId, timeframe),
        multisensoryMetricsService.getNeurodivergenceMetrics(finalUserId, timeframe),
        multisensoryMetricsService.getAccessibilityMetrics(finalUserId, timeframe),
        multisensoryMetricsService.getMultisensoryInteractions(finalUserId, timeframe),
      ])

      setSensorData(sensorResults)
      setNeurodivergenceMetrics(neuroResults)
      setAccessibilityMetrics(accessResults)
      setInteractionData(interactionResults)

      const currentReport = multisensoryMetrics.generateFinalReport()
      setMultisensoryData(currentReport)
    } catch (error) {
      logger.error('Erro ao carregar dados multissensoriais:', error)
    } finally {
      setIsLoading(false)
    }
  }, [finalUserId, timeframe])

  useEffect(() => {
    fetchMultisensoryData()
  }, [fetchMultisensoryData])

  const sensorChartData = useMemo(() => {
    if (!sensorData?.length) return null

    const labels = sensorData.map((d) =>
      new Date(d.timestamp).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      })
    )

    return {
      labels,
      datasets: [
        {
          label: 'Atividade de Movimento',
          data: sensorData.map((d) => d.movement_intensity),
          borderColor: theme.colors.sensorOrange,
          backgroundColor: theme.colors.sensorOrange + '20',
          tension: 0.3,
          fill: true,
          pointRadius: 3,
        },
        {
          label: 'Estabilidade',
          data: sensorData.map((d) => d.stability_score),
          borderColor: theme.colors.primaryGreen,
          backgroundColor: theme.colors.primaryGreen + '20',
          tension: 0.3,
          fill: true,
          pointRadius: 3,
        },
      ],
    }
  }, [sensorData])

  const neurodivergenceChartData = useMemo(() => {
    if (!neurodivergenceMetrics?.length) return null

    const avgMetrics = neurodivergenceMetrics.reduce(
      (acc, metric) => {
        acc.attention += metric.attention_variability || 0
        acc.hyperactivity += metric.hyperactivity_indicators || 0
        acc.impulsivity += metric.impulsivity_markers || 0
        acc.processing += metric.processing_speed_variation || 0
        acc.sensory += metric.sensory_processing_differences || 0
        return acc
      },
      { attention: 0, hyperactivity: 0, impulsivity: 0, processing: 0, sensory: 0 }
    )

    const count = neurodivergenceMetrics.length
    Object.keys(avgMetrics).forEach((key) => {
      avgMetrics[key] = (avgMetrics[key] / count) * 100
    })

    return {
      labels: ['Atenção', 'Hiperatividade', 'Impulsividade', 'Velocidade', 'Sensorial'],
      datasets: [
        {
          label: 'Padrões Neurodivergentes',
          data: [
            avgMetrics.attention,
            avgMetrics.hyperactivity,
            avgMetrics.impulsivity,
            avgMetrics.processing,
            avgMetrics.sensory,
          ],
          borderColor: theme.colors.neurodivergenceViolet,
          backgroundColor: theme.colors.neurodivergenceViolet + '30',
          pointBackgroundColor: theme.colors.neurodivergenceViolet,
          pointBorderColor: theme.colors.white,
          pointHoverBackgroundColor: theme.colors.white,
          pointHoverBorderColor: theme.colors.neurodivergenceViolet,
          pointRadius: 4,
        },
      ],
    }
  }, [neurodivergenceMetrics])

  const accessibilityChartData = useMemo(() => {
    if (!accessibilityMetrics?.length) return null

    const toolUsage = accessibilityMetrics.reduce((acc, metric) => {
      const tools = metric.accessibility_tools_used || []
      tools.forEach((tool) => {
        acc[tool] = (acc[tool] || 0) + 1
      })
      return acc
    }, {})

    return {
      labels: Object.keys(toolUsage),
      datasets: [
        {
          label: 'Uso de Ferramentas de Acessibilidade',
          data: Object.values(toolUsage),
          backgroundColor: [
            theme.colors.accessibilityGreen + '80',
            theme.colors.primaryBlue + '80',
            theme.colors.primaryPurple + '80',
            theme.colors.primaryOrange + '80',
            theme.colors.primaryPink + '80',
          ],
          borderWidth: 1,
          borderColor: theme.colors.white,
        },
      ],
    }
  }, [accessibilityMetrics])

  const insights = useMemo(() => {
    if (!multisensoryData && !sensorData?.length) return []

    const insights = []

    if (sensorData?.length > 0) {
      const avgMovement =
        sensorData.reduce((sum, d) => sum + (d.movement_intensity || 0), 0) / sensorData.length
      const avgStability =
        sensorData.reduce((sum, d) => sum + (d.stability_score || 0), 0) / sensorData.length

      if (avgMovement > 0.7) {
        insights.push({
          type: 'sensor',
          message: 'Alta atividade de movimento detectada - considere pausas mais frequentes.',
          color: theme.colors.sensorOrange,
        })
      }

      if (avgStability < 0.5) {
        insights.push({
          type: 'sensor',
          message: 'Estabilidade motora variável - ambientes mais calmos podem ajudar.',
          color: theme.colors.primaryOrange,
        })
      }
    }

    if (neurodivergenceMetrics?.length > 0) {
      const avgAttention =
        neurodivergenceMetrics.reduce((sum, m) => sum + (m.attention_variability || 0), 0) /
        neurodivergenceMetrics.length

      if (avgAttention > 0.6) {
        insights.push({
          type: 'neurodivergence',
          message:
            'Padrões de atenção variável identificados - estratégias de foco podem ser benéficas.',
          color: theme.colors.neurodivergenceViolet,
        })
      }
    }

    if (accessibilityMetrics?.length > 0) {
      const toolCount = accessibilityMetrics.reduce(
        (sum, m) => sum + (m.accessibility_tools_used?.length || 0),
        0
      )

      if (toolCount > 0) {
        insights.push({
          type: 'accessibility',
          message: `Uso ativo de ${toolCount} ferramenta${toolCount > 1 ? 's' : ''} de acessibilidade - excelente adaptação!`,
          color: theme.colors.accessibilityGreen,
        })
      }
    }

    if (multisensoryData?.insights) {
      multisensoryData.insights.forEach((insight) => {
        insights.push({
          type: 'session',
          message: insight,
          color: theme.colors.primaryPurple,
        })
      })
    }

    return insights
  }, [multisensoryData, sensorData, neurodivergenceMetrics, accessibilityMetrics])

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <OrientationMessage>
          Por favor, gire seu dispositivo para a orientação horizontal.
        </OrientationMessage>
        <LoadingIndicator
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <span style={{ fontSize: '1.3rem' }}>🧠</span>
          Carregando métricas...
        </LoadingIndicator>
      </ThemeProvider>
    )
  }

  const hasData =
    sensorData?.length > 0 ||
    neurodivergenceMetrics?.length > 0 ||
    accessibilityMetrics?.length > 0 ||
    multisensoryData

  if (!hasData) {
    return (
      <ThemeProvider theme={theme}>
        <OrientationMessage>
          Por favor, gire seu dispositivo para a orientação horizontal.
        </OrientationMessage>
        <EmptyState>
          <div className="icon">📊</div>
          <div className="message">Sem Dados Multissensoriais</div>
          <div className="submessage">
            Continue usando atividades premium para gerar análises detalhadas.
          </div>
        </EmptyState>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <OrientationMessage>
        Por favor, gire seu dispositivo para a orientação horizontal.
      </OrientationMessage>
      <DashboardContainer>
        <HeaderSection>
          <HeaderTitle>🧠 Dashboard Multissensorial</HeaderTitle>
          <HeaderSubtitle>
            Análises avançadas de sensores, padrões neurodivergentes e acessibilidade
          </HeaderSubtitle>
        </HeaderSection>

        <MetricsGrid>
          {sensorData?.length > 0 && (
            <MetricCard
              borderColor={theme.colors.sensorOrange}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <MetricTitle>📱 Sensores Móveis</MetricTitle>
              <ChartContainer>
                <Line
                  data={sensorChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: { font: { size: 12 } },
                      },
                      title: {
                        display: true,
                        text: 'Movimento e Estabilidade',
                        font: { size: 14 },
                      },
                      tooltip: {
                        backgroundColor: theme.colors.darkGray,
                        padding: 10,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: { stepSize: 0.2 },
                      },
                      x: {
                        ticks: { maxRotation: 45, minRotation: 45 },
                      },
                    },
                  }}
                />
              </ChartContainer>
              <StatsGrid>
                <StatItem bgColor={theme.colors.sensorOrange + '20'}>
                  <StatValue color={theme.colors.sensorOrange}>{sensorData.length}</StatValue>
                  <StatLabel>Registros</StatLabel>
                </StatItem>
                <StatItem bgColor={theme.colors.primaryGreen + '20'}>
                  <StatValue color={theme.colors.primaryGreen}>
                    {Math.round(
                      (sensorData.reduce((sum, d) => sum + (d.stability_score || 0), 0) /
                        sensorData.length) *
                        100
                    )}
                    %
                  </StatValue>
                  <StatLabel>Estabilidade Média</StatLabel>
                </StatItem>
              </StatsGrid>
            </MetricCard>
          )}

          {neurodivergenceMetrics?.length > 0 && (
            <MetricCard
              borderColor={theme.colors.neurodivergenceViolet}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <MetricTitle>🧩 Padrões Neurodivergentes</MetricTitle>
              <ChartContainer>
                <Radar
                  data={neurodivergenceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: { font: { size: 12 } },
                      },
                      title: {
                        display: true,
                        text: 'Perfil Neurodivergente',
                        font: { size: 14 },
                      },
                    },
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          stepSize: 20,
                          font: { size: 10 },
                        },
                      },
                    },
                  }}
                />
              </ChartContainer>
              <StatsGrid>
                <StatItem bgColor={theme.colors.neurodivergenceViolet + '20'}>
                  <StatValue color={theme.colors.neurodivergenceViolet}>
                    {neurodivergenceMetrics.length}
                  </StatValue>
                  <StatLabel>Análises</StatLabel>
                </StatItem>
              </StatsGrid>
            </MetricCard>
          )}

          {accessibilityMetrics?.length > 0 && (
            <MetricCard
              borderColor={theme.colors.accessibilityGreen}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <MetricTitle>♿ Acessibilidade</MetricTitle>
              <ChartContainer>
                <Doughnut
                  data={accessibilityChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          font: { size: 11 },
                          boxWidth: 12,
                        },
                      },
                      title: {
                        display: true,
                        text: 'Ferramentas Utilizadas',
                        font: { size: 14 },
                      },
                    },
                  }}
                />
              </ChartContainer>
              <StatsGrid>
                <StatItem bgColor={theme.colors.accessibilityGreen + '20'}>
                  <StatValue color={theme.colors.accessibilityGreen}>
                    {accessibilityMetrics.reduce(
                      (sum, m) => sum + (m.accessibility_tools_used?.length || 0),
                      0
                    )}
                  </StatValue>
                  <StatLabel>Ferramentas</StatLabel>
                </StatItem>
                <StatItem bgColor={theme.colors.primaryBlue + '20'}>
                  <StatValue color={theme.colors.primaryBlue}>
                    {Math.round(
                      (accessibilityMetrics.reduce(
                        (sum, m) => sum + (m.effectiveness_score || 0),
                        0
                      ) /
                        accessibilityMetrics.length) *
                        100
                    )}
                    %
                  </StatValue>
                  <StatLabel>Eficácia Média</StatLabel>
                </StatItem>
              </StatsGrid>
            </MetricCard>
          )}

          {interactionData?.length > 0 && (
            <MetricCard
              borderColor={theme.colors.primaryCyan}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <MetricTitle>🤝 Interações Multissensoriais</MetricTitle>
              <StatsGrid>
                <StatItem bgColor={theme.colors.primaryCyan + '20'}>
                  <StatValue color={theme.colors.primaryCyan}>{interactionData.length}</StatValue>
                  <StatLabel>Interações</StatLabel>
                </StatItem>
                <StatItem bgColor={theme.colors.primaryPink + '20'}>
                  <StatValue color={theme.colors.primaryPink}>
                    {Math.round(
                      (interactionData.reduce((sum, i) => sum + (i.complexity_score || 0), 0) /
                        interactionData.length) *
                        100
                    )}
                    %
                  </StatValue>
                  <StatLabel>Complexidade</StatLabel>
                </StatItem>
              </StatsGrid>
            </MetricCard>
          )}

          {multisensoryData && (
            <MetricCard
              borderColor={theme.colors.primaryPurple}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <MetricTitle>⚡ Sessão Atual</MetricTitle>
              <StatsGrid>
                <StatItem bgColor={theme.colors.primaryPurple + '20'}>
                  <StatValue color={theme.colors.primaryPurple}>
                    {multisensoryData.sessionDuration
                      ? Math.round(multisensoryData.sessionDuration / 1000)
                      : 0}
                    s
                  </StatValue>
                  <StatLabel>Duração</StatLabel>
                </StatItem>
                <StatItem bgColor={theme.colors.primaryBlue + '20'}>
                  <StatValue color={theme.colors.primaryBlue}>
                    {Object.keys(multisensoryData.sensorMetrics || {}).length}
                  </StatValue>
                  <StatLabel>Sensores Ativos</StatLabel>
                </StatItem>
                <StatItem bgColor={theme.colors.primaryGreen + '20'}>
                  <StatValue color={theme.colors.primaryGreen}>
                    {multisensoryData.recommendations?.length || 0}
                  </StatValue>
                  <StatLabel>Recomendações</StatLabel>
                </StatItem>
              </StatsGrid>
            </MetricCard>
          )}
        </MetricsGrid>

        {insights.length > 0 && (
          <MetricCard
            borderColor={theme.colors.premiumGold}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <MetricTitle>💡 Insights Multissensoriais</MetricTitle>
            <InsightsList>
              {insights.map((insight, index) => (
                <InsightItem
                  key={index}
                  bgColor={insight.color + '15'}
                  borderColor={insight.color}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.2 }}
                >
                  {insight.message}
                </InsightItem>
              ))}
            </InsightsList>
          </MetricCard>
        )}
      </DashboardContainer>
    </ThemeProvider>
  )
}

export default MultisensoryMetricsDashboard
