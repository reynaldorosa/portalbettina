/**
 * @file IntegratedSystemDashboard.jsx
 * @description Dashboard Integrado do Sistema Orquestrador
 * Visualização em tempo real de todos os sistemas do Portal Betina
 * @version 1.0.0
 * @created 2025-01-10
 */

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import useSystemOrchestrator from '../../hooks/useSystemOrchestrator.js'
import { useUser } from '../../contexts/UserContext.jsx'

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const DashboardHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const DashboardTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`

const DashboardSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin: 0;
`

const SystemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const SystemCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`

const SystemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`

const SystemTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const SystemStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${(props) =>
    props.$status === 'active' ? '#22c55e' : props.$status === 'warning' ? '#f59e0b' : '#ef4444'};
`

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.$status === 'active' ? '#22c55e' : props.$status === 'warning' ? '#f59e0b' : '#ef4444'};
  animation: ${(props) => (props.$status === 'active' ? 'pulse 2s infinite' : 'none')};

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`

const MetricLabel = styled.span`
  font-size: 0.9rem;
  color: #666;
`

const MetricValue = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
`

const InsightsSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`

const InsightsHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`

const InsightCard = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
`

const InsightTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const InsightDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
`

const RecommendationsSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`

const RecommendationItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #667eea;

  &:last-child {
    margin-bottom: 0;
  }
`

const RecommendationIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
`

const RecommendationContent = styled.div`
  flex: 1;
`

const RecommendationTitle = styled.h5`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`

const RecommendationDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
`

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const IntegratedSystemDashboard = () => {
  const { userId } = useUser()
  const {
    isReady,
    isActive,
    systemHealth,
    activeInterventions,
    lastSync,
    error,
    realTimeInsights,
    adaptiveRecommendations,
    therapeuticInsights,
    accessibilityAdaptations,
    startUserSession,
    generateReport,
  } = useSystemOrchestrator({
    enableRealTimeUpdates: true,
    updateInterval: 3000,
  })

  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [lastReport, setLastReport] = useState(null)

  useEffect(() => {
    if (isReady && userId && !isActive) {
      startUserSession()
    }
  }, [isReady, userId, isActive, startUserSession])

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true)
    try {
      const report = await generateReport('comprehensive')
      setLastReport(report)
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Nunca'
    return new Date(timestamp).toLocaleString('pt-BR')
  }

  const getSystemStatusColor = (health) => {
    if (health >= 0.8) return 'active'
    if (health >= 0.6) return 'warning'
    return 'error'
  }

  const systems = [
    {
      id: 'orchestrator',
      name: '🎯 Orquestrador',
      status: isActive ? 'active' : 'error',
      health: isActive ? 0.95 : 0,
      metrics: {
        Estado: isActive ? 'Ativo' : 'Inativo',
        'Última Sync': formatTimestamp(lastSync),
        'Intervenções Ativas': activeInterventions || 0,
      },
    },
    {
      id: 'metrics',
      name: '📊 Métricas Avançadas',
      status: systemHealth.metrics ? getSystemStatusColor(systemHealth.metrics) : 'warning',
      health: systemHealth.metrics || 0.7,
      metrics: {
        Performance: `${((systemHealth.metrics || 0.7) * 100).toFixed(1)}%`,
        Análises: realTimeInsights.metricsCount || 0,
        'Última Análise': formatTimestamp(realTimeInsights.lastMetricsUpdate),
      },
    },
    {
      id: 'ml',
      name: '🤖 Machine Learning',
      status: systemHealth.ml ? getSystemStatusColor(systemHealth.ml) : 'warning',
      health: systemHealth.ml || 0.8,
      metrics: {
        'Modelos Ativos': realTimeInsights.activeModels || 4,
        'Predições/min': realTimeInsights.predictionsPerMinute || 12,
        Acurácia: `${((systemHealth.ml || 0.8) * 100).toFixed(1)}%`,
      },
    },
    {
      id: 'therapeutic',
      name: '🏥 Análise Terapêutica',
      status: systemHealth.therapeutic ? getSystemStatusColor(systemHealth.therapeutic) : 'warning',
      health: systemHealth.therapeutic || 0.85,
      metrics: {
        'Análises Completas': therapeuticInsights.completedAnalyses || 0,
        Recomendações: therapeuticInsights.activeRecommendations || 0,
        Progresso: `${((systemHealth.therapeutic || 0.85) * 100).toFixed(1)}%`,
      },
    },
    {
      id: 'accessibility',
      name: '♿ Acessibilidade',
      status: systemHealth.accessibility
        ? getSystemStatusColor(systemHealth.accessibility)
        : 'active',
      health: systemHealth.accessibility || 0.9,
      metrics: {
        'Adaptações Ativas': Object.keys(accessibilityAdaptations).length || 0,
        'Suporte Habilitado': 'Completo',
        'Última Adaptação': formatTimestamp(accessibilityAdaptations.lastUpdate),
      },
    },
    {
      id: 'ai',
      name: '🧠 IA DeepSeek',
      status: systemHealth.ai ? getSystemStatusColor(systemHealth.ai) : 'warning',
      health: systemHealth.ai || 0.75,
      metrics: {
        Conexão: systemHealth.ai ? 'Conectada' : 'Verificando...',
        'Relatórios Gerados': realTimeInsights.aiReportsCount || 0,
        'Resposta Média': `${realTimeInsights.aiResponseTime || 2.1}s`,
      },
    },
  ]

  const insights = [
    {
      title: 'Engajamento do Usuário',
      description: `${((realTimeInsights.userEngagement?.score || 0.85) * 100).toFixed(1)}% - Nível Alto`,
      icon: '📈',
    },
    {
      title: 'Predições Adaptativas',
      description: `${adaptiveRecommendations.length} recomendações pendentes`,
      icon: '🎯',
    },
    {
      title: 'Progresso Terapêutico',
      description: `${((therapeuticInsights.overallProgress || 0.72) * 100).toFixed(1)}% de progresso geral`,
      icon: '🏆',
    },
    {
      title: 'Acessibilidade',
      description: `${Object.keys(accessibilityAdaptations).length} adaptações aplicadas`,
      icon: '✨',
    },
  ]

  if (!isReady) {
    return (
      <DashboardContainer>
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      </DashboardContainer>
    )
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>🎯 Sistema Orquestrador Portal Betina</DashboardTitle>
        <DashboardSubtitle>
          Monitoramento integrado de sistemas avançados com IA e ML
        </DashboardSubtitle>
      </DashboardHeader>

      {error && <ErrorMessage>⚠️ Erro no sistema: {error}</ErrorMessage>}

      {/* Status dos Sistemas */}
      <SystemsGrid>
        <AnimatePresence>
          {systems.map((system) => (
            <SystemCard
              key={system.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ position: 'relative' }}
            >
              <SystemHeader>
                <SystemTitle>{system.name}</SystemTitle>
                <SystemStatus $status={system.status}>
                  <StatusIndicator $status={system.status} />
                  {system.status === 'active'
                    ? 'Ativo'
                    : system.status === 'warning'
                      ? 'Atenção'
                      : 'Inativo'}
                </SystemStatus>
              </SystemHeader>

              {Object.entries(system.metrics).map(([key, value]) => (
                <MetricRow key={key}>
                  <MetricLabel>{key}:</MetricLabel>
                  <MetricValue>{value}</MetricValue>
                </MetricRow>
              ))}
            </SystemCard>
          ))}
        </AnimatePresence>
      </SystemsGrid>

      {/* Insights em Tempo Real */}
      <InsightsSection>
        <InsightsHeader>🧠 Insights em Tempo Real</InsightsHeader>
        <InsightsGrid>
          <AnimatePresence>
            {insights.map((insight, index) => (
              <InsightCard
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <InsightTitle>
                  {insight.icon} {insight.title}
                </InsightTitle>
                <InsightDescription>{insight.description}</InsightDescription>
              </InsightCard>
            ))}
          </AnimatePresence>
        </InsightsGrid>
      </InsightsSection>

      {/* Recomendações Adaptativas */}
      {adaptiveRecommendations.length > 0 && (
        <RecommendationsSection>
          <InsightsHeader>🎯 Recomendações Adaptativas</InsightsHeader>
          <AnimatePresence>
            {adaptiveRecommendations.slice(0, 5).map((recommendation, index) => (
              <RecommendationItem
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <RecommendationIcon>{recommendation.icon || '💡'}</RecommendationIcon>
                <RecommendationContent>
                  <RecommendationTitle>
                    {recommendation.title || 'Recomendação Adaptativa'}
                  </RecommendationTitle>
                  <RecommendationDescription>
                    {recommendation.description || 'Otimização sugerida pelo sistema ML'}
                  </RecommendationDescription>
                </RecommendationContent>
              </RecommendationItem>
            ))}
          </AnimatePresence>
        </RecommendationsSection>
      )}

      {/* Ações do Dashboard */}
      <RecommendationsSection>
        <InsightsHeader>⚙️ Ações do Sistema</InsightsHeader>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              position: 'relative',
            }}
          >
            {isGeneratingReport ? (
              <>
                <LoadingSpinner style={{ width: '16px', height: '16px', marginRight: '0.5rem' }} />
                Gerando Relatório...
              </>
            ) : (
              '📊 Gerar Relatório Integrado'
            )}
          </motion.button>

          {lastReport && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: '1rem',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                color: '#0369a1',
              }}
            >
              ✅ Último relatório: {formatTimestamp(lastReport.generatedAt)}
            </motion.div>
          )}
        </div>
      </RecommendationsSection>
    </DashboardContainer>
  )
}

export default IntegratedSystemDashboard
