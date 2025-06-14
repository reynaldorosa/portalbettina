import React, { useState, useEffect, useMemo, useCallback } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { motion } from 'framer-motion'
import { useUser } from '../../contexts/UserContext.jsx'
import databaseService from '../../database/core/DatabaseService.js'
import neuropedagogicalService from '../../utils/metrics/neuropedagogicalService.js'
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
} from 'chart.js'
import { Bar, Line, Pie, Radar, Doughnut } from 'react-chartjs-2'

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

// Tema para o dashboard
const theme = {
  colors: {
    primary: '#2563EB',
    secondary: '#7C3AED',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',
    light: '#F8FAFC',
    dark: '#0F172A',
    gray: '#64748B',
  },
}

// Styled Components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(16px);
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    color: ${(props) => props.theme.colors.dark};
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  p {
    color: ${(props) => props.theme.colors.gray};
    font-size: 1.2rem;
  }
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`

const MetricCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${(props) => props.$color};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`

const MetricTitle = styled.h3`
  color: ${(props) => props.theme.colors.dark};
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.$color};
  margin-bottom: 0.5rem;
`

const MetricSubtext = styled.p`
  color: ${(props) => props.theme.colors.gray};
  font-size: 0.9rem;
  margin: 0;
`

const ChartSection = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`

const ChartTitle = styled.h3`
  color: ${(props) => props.theme.colors.dark};
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  flex-direction: column;
  gap: 1rem;
`

const Spinner = styled(motion.div)`
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
`

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
`

const NoDataMessage = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.gray};
  padding: 2rem;

  h3 {
    margin-bottom: 1rem;
  }
`

const RelatorioADashboard = ({ userId, timeframe = '30d', isPremiumUser = false }) => {
  const { userDetails } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)

  // Verificação de acesso premium
  if (!isPremiumUser) {
    return (
      <DashboardContainer>
        <DashboardContent>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ color: theme.colors.warning, marginBottom: '1rem' }}>
              🔒 Acesso Premium Necessário
            </h2>
            <p style={{ color: theme.colors.gray, marginBottom: '2rem' }}>
              O Relatório A é exclusivo para usuários premium.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: theme.colors.primary,
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
              onClick={() => (window.location.href = '/premium')}
            >
              Assinar Premium
            </motion.button>
          </div>
        </DashboardContent>
      </DashboardContainer>
    )
  }

  // Carregar dados do relatório
  const fetchRelatorioData = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      // Buscar dados específicos para o Relatório A
      const [
        sessions,
        cognitiveProfiles,
        engagementMetrics,
        neuroplasticityData,
        adaptiveParameters,
      ] = await Promise.all([
        databaseService.getGameSessions(userId, null, 100),
        neuropedagogicalService.getCognitiveProfiles(userId, null, 20),
        neuropedagogicalService.getEngagementMetrics(userId, null, 50),
        neuropedagogicalService.getNeuroplasticityTracking(userId, null, 30),
        neuropedagogicalService.getAdaptiveParameters(userId),
      ])

      setDashboardData({
        sessions,
        cognitiveProfiles,
        engagementMetrics,
        neuroplasticityData,
        adaptiveParameters,
        processedAt: new Date().toISOString(),
      })

      logger.info('Dados do Relatório A carregados com sucesso', { userId })
    } catch (err) {
      logger.error('Erro ao carregar dados do Relatório A', { error: err.message })
      setError('Erro ao carregar dados do relatório. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchRelatorioData()
  }, [fetchRelatorioData, timeframe])

  // Processar métricas específicas do Relatório A
  const processedMetrics = useMemo(() => {
    if (!dashboardData) return null

    const { sessions, cognitiveProfiles, engagementMetrics, neuroplasticityData } = dashboardData

    // Métricas de Performance Avançada
    const performanceMetrics = {
      progressaoGeral:
        sessions.length > 0
          ? sessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / sessions.length
          : 0,
      consistencia:
        sessions.length > 1
          ? 100 - (Math.abs(sessions[0]?.accuracy - sessions[sessions.length - 1]?.accuracy) || 0)
          : 0,
      velocidadeAprendizado:
        cognitiveProfiles.length > 0 ? cognitiveProfiles[0]?.processing_speed || 0 : 0,
      retencaoInformacao:
        cognitiveProfiles.length > 0 ? cognitiveProfiles[0]?.working_memory || 0 : 0,
    }

    // Métricas de Engajamento
    const engagementSummary = {
      focoMedio:
        engagementMetrics.length > 0
          ? engagementMetrics.reduce((acc, e) => acc + (e.flow_state_duration || 0), 0) /
            engagementMetrics.length
          : 0,
      interacaoTotal: engagementMetrics.reduce((acc, e) => acc + (e.total_interactions || 0), 0),
      quedaAtencao: engagementMetrics.reduce((acc, e) => acc + (e.attention_drops || 0), 0),
      nivelFrustacao:
        engagementMetrics.length > 0
          ? engagementMetrics.reduce((acc, e) => acc + (e.frustration_level || 0), 0) /
            engagementMetrics.length
          : 0,
    }

    // Análise de Neuroplasticidade
    const neuroplasticityAnalysis = {
      dominiosCognitivos: neuroplasticityData.reduce((acc, n) => {
        if (!acc[n.cognitive_domain]) {
          acc[n.cognitive_domain] = {
            baseline: n.baseline_score || 0,
            current: n.current_score || 0,
            improvement: n.improvement_rate || 0,
          }
        }
        return acc
      }, {}),
      progressoGlobal:
        neuroplasticityData.length > 0
          ? neuroplasticityData.reduce((acc, n) => acc + (n.improvement_rate || 0), 0) /
            neuroplasticityData.length
          : 0,
    }

    return {
      performanceMetrics,
      engagementSummary,
      neuroplasticityAnalysis,
      totalSessions: sessions.length,
      dataRange: timeframe,
    }
  }, [dashboardData, timeframe])

  // Dados para gráficos
  const chartData = useMemo(() => {
    if (!processedMetrics) return null

    return {
      performanceChart: {
        labels: ['Progressão', 'Consistência', 'Velocidade', 'Retenção'],
        datasets: [
          {
            label: 'Performance (%)',
            data: [
              processedMetrics.performanceMetrics.progressaoGeral,
              processedMetrics.performanceMetrics.consistencia,
              processedMetrics.performanceMetrics.velocidadeAprendizado,
              processedMetrics.performanceMetrics.retencaoInformacao,
            ],
            backgroundColor: [
              theme.colors.success + '80',
              theme.colors.info + '80',
              theme.colors.warning + '80',
              theme.colors.secondary + '80',
            ],
            borderColor: [
              theme.colors.success,
              theme.colors.info,
              theme.colors.warning,
              theme.colors.secondary,
            ],
            borderWidth: 2,
          },
        ],
      },

      engagementChart: {
        labels: ['Foco Médio (min)', 'Interações', 'Queda Atenção', 'Frustração (%)'],
        datasets: [
          {
            label: 'Métricas de Engajamento',
            data: [
              Math.round(processedMetrics.engagementSummary.focoMedio / 60),
              processedMetrics.engagementSummary.interacaoTotal,
              processedMetrics.engagementSummary.quedaAtencao,
              processedMetrics.engagementSummary.nivelFrustacao,
            ],
            backgroundColor: theme.colors.primary + '20',
            borderColor: theme.colors.primary,
            borderWidth: 2,
            fill: true,
          },
        ],
      },

      neuroplasticityChart: {
        labels: Object.keys(processedMetrics.neuroplasticityAnalysis.dominiosCognitivos),
        datasets: [
          {
            label: 'Baseline',
            data: Object.values(processedMetrics.neuroplasticityAnalysis.dominiosCognitivos).map(
              (d) => d.baseline
            ),
            backgroundColor: theme.colors.gray + '60',
            borderColor: theme.colors.gray,
            borderWidth: 1,
          },
          {
            label: 'Atual',
            data: Object.values(processedMetrics.neuroplasticityAnalysis.dominiosCognitivos).map(
              (d) => d.current
            ),
            backgroundColor: theme.colors.success + '60',
            borderColor: theme.colors.success,
            borderWidth: 1,
          },
        ],
      },
    }
  }, [processedMetrics])

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <DashboardContainer>
          <DashboardContent>
            <LoadingContainer>
              <Spinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p>Carregando Relatório A...</p>
            </LoadingContainer>
          </DashboardContent>
        </DashboardContainer>
      </ThemeProvider>
    )
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <DashboardContainer>
          <DashboardContent>
            <ErrorMessage>
              <h3>❌ Erro ao Carregar Dados</h3>
              <p>{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchRelatorioData}
                style={{
                  background: theme.colors.primary,
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  marginTop: '1rem',
                  cursor: 'pointer',
                }}
              >
                Tentar Novamente
              </motion.button>
            </ErrorMessage>
          </DashboardContent>
        </DashboardContainer>
      </ThemeProvider>
    )
  }

  if (!processedMetrics) {
    return (
      <ThemeProvider theme={theme}>
        <DashboardContainer>
          <DashboardContent>
            <NoDataMessage>
              <h3>📋 Sem Dados Suficientes</h3>
              <p>Não há dados suficientes para gerar o Relatório A.</p>
              <p>Continue utilizando as atividades para ver as análises aqui.</p>
            </NoDataMessage>
          </DashboardContent>
        </DashboardContainer>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <DashboardContainer>
        <DashboardContent>
          <Header>
            <h1>📋 Relatório A - Análise Avançada</h1>
            <p>Análise detalhada do desenvolvimento cognitivo e engajamento</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              Usuário: {userDetails?.displayName || 'N/A'} | Período: {timeframe} | Gerado em:{' '}
              {new Date().toLocaleString('pt-BR')}
            </p>
          </Header>

          {/* Métricas Principais */}
          <MetricsGrid>
            <MetricCard
              $color={theme.colors.success}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MetricTitle>📈 Progressão Geral</MetricTitle>
              <MetricValue $color={theme.colors.success}>
                {Math.round(processedMetrics.performanceMetrics.progressaoGeral)}%
              </MetricValue>
              <MetricSubtext>Baseado em {processedMetrics.totalSessions} sessões</MetricSubtext>
            </MetricCard>

            <MetricCard
              $color={theme.colors.info}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MetricTitle>🎯 Consistência</MetricTitle>
              <MetricValue $color={theme.colors.info}>
                {Math.round(processedMetrics.performanceMetrics.consistencia)}%
              </MetricValue>
              <MetricSubtext>Estabilidade do desempenho</MetricSubtext>
            </MetricCard>

            <MetricCard
              $color={theme.colors.warning}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MetricTitle>⚡ Velocidade Processamento</MetricTitle>
              <MetricValue $color={theme.colors.warning}>
                {Math.round(processedMetrics.performanceMetrics.velocidadeAprendizado)}%
              </MetricValue>
              <MetricSubtext>Capacidade de processamento cognitivo</MetricSubtext>
            </MetricCard>

            <MetricCard
              $color={theme.colors.secondary}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MetricTitle>🧠 Retenção Informação</MetricTitle>
              <MetricValue $color={theme.colors.secondary}>
                {Math.round(processedMetrics.performanceMetrics.retencaoInformacao)}%
              </MetricValue>
              <MetricSubtext>Memória de trabalho</MetricSubtext>
            </MetricCard>
          </MetricsGrid>

          {/* Gráfico de Performance */}
          {chartData && (
            <ChartSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ChartTitle>📊 Análise de Performance</ChartTitle>
              <div style={{ height: '400px' }}>
                <Bar
                  data={chartData.performanceChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.parsed.y.toFixed(1)}%`,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: (value) => `${value}%`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </ChartSection>
          )}

          {/* Gráfico de Engajamento */}
          {chartData && (
            <ChartSection
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <ChartTitle>🤝 Métricas de Engajamento</ChartTitle>
              <div style={{ height: '400px' }}>
                <Line
                  data={chartData.engagementChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
            </ChartSection>
          )}

          {/* Gráfico de Neuroplasticidade */}
          {chartData &&
            Object.keys(processedMetrics.neuroplasticityAnalysis.dominiosCognitivos).length > 0 && (
              <ChartSection
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <ChartTitle>🧩 Análise de Neuroplasticidade</ChartTitle>
                <div style={{ height: '400px' }}>
                  <Bar
                    data={chartData.neuroplasticityChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                      },
                      scales: {
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: theme.colors.gray,
                  }}
                >
                  <strong>💡 Interpretação:</strong> Este gráfico mostra a evolução dos domínios
                  cognitivos. Barras verdes mais altas que as cinzas indicam progresso positivo.
                </div>
              </ChartSection>
            )}

          {/* Resumo Executivo */}
          <ChartSection
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ChartTitle>📝 Resumo Executivo</ChartTitle>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div
                style={{
                  padding: '1.5rem',
                  background: '#f0f9ff',
                  borderRadius: '12px',
                  borderLeft: `4px solid ${theme.colors.info}`,
                }}
              >
                <h4 style={{ color: theme.colors.info, marginBottom: '1rem' }}>🎯 Pontos Fortes</h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: theme.colors.dark }}>
                  {processedMetrics.performanceMetrics.progressaoGeral > 70 && (
                    <li>Excelente progressão geral</li>
                  )}
                  {processedMetrics.performanceMetrics.consistencia > 80 && (
                    <li>Alta consistência no desempenho</li>
                  )}
                  {processedMetrics.engagementSummary.focoMedio > 300 && (
                    <li>Boa capacidade de manter foco</li>
                  )}
                  {processedMetrics.neuroplasticityAnalysis.progressoGlobal > 0 && (
                    <li>Desenvolvimento neuroplástico positivo</li>
                  )}
                </ul>
              </div>

              <div
                style={{
                  padding: '1.5rem',
                  background: '#fef3c7',
                  borderRadius: '12px',
                  borderLeft: `4px solid ${theme.colors.warning}`,
                }}
              >
                <h4 style={{ color: theme.colors.warning, marginBottom: '1rem' }}>
                  ⚠️ Áreas de Atenção
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: theme.colors.dark }}>
                  {processedMetrics.performanceMetrics.velocidadeAprendizado < 50 && (
                    <li>Velocidade de processamento pode ser melhorada</li>
                  )}
                  {processedMetrics.engagementSummary.nivelFrustacao > 30 && (
                    <li>Nível de frustração elevado detectado</li>
                  )}
                  {processedMetrics.engagementSummary.quedaAtencao > 5 && (
                    <li>Muitas quedas de atenção durante as atividades</li>
                  )}
                  {processedMetrics.performanceMetrics.retencaoInformacao < 60 && (
                    <li>Memória de trabalho precisa de fortalecimento</li>
                  )}
                </ul>
              </div>
            </div>
          </ChartSection>
        </DashboardContent>
      </DashboardContainer>
    </ThemeProvider>
  )
}

export default RelatorioADashboard
