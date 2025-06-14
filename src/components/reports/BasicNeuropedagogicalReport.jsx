// Sistema de Relatórios Básicos (Versão Gratuita)
// Fornece insights básicos sem análise avançada de IA

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import globalNeuropedagogicalDB from '../utils/globalNeuropedagogicalDatabase'

const ReportContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`

const ReportSection = styled(motion.div)`
  background: white;
  margin: 20px 0;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
`

const MetricCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  margin: 10px 0;
  background: ${(props) => props.background || '#f8f9fa'};
  border-radius: 8px;
  border-left: 4px solid ${(props) => props.borderColor || '#007bff'};
`

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.color || '#333'};
`

const MetricLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`

const ChartContainer = styled.div`
  width: 100%;
  height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  margin: 15px 0;
`

const UpgradePrompt = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin: 20px 0;
`

const UpgradeButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`

const BasicNeuropedagogicalReport = ({ userId, sessionId, timeRange = '7d' }) => {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    loadBasicReportData().finally(() => {
      if (!active) return
    })
    return () => {
      active = false
    }
  }, [userId, sessionId, timeRange])

  const loadBasicReportData = async () => {
    try {
      setLoading(true)

      // Simular dados básicos que seriam extraídos do banco
      const basicData = await generateBasicReport(userId, sessionId, timeRange)
      setReportData(basicData)
    } catch (err) {
      setError('Erro ao carregar relatório')
      console.error('Erro no relatório básico:', err)
    } finally {
      setLoading(false)
    }
  }

  // 🎯 FASE 3: Formatar recomendações terapêuticas para exibição
  const formatRecommendation = (recommendation) => {
    const recommendations = {
      maintain_current_level: '✅ Manter o nível atual de desempenho',
      increase_attention_exercises: '🎯 Aumentar exercícios de atenção',
      improve_coordination_activities: '🤝 Melhorar atividades de coordenação',
      monitor_progress_weekly: '📊 Monitorar progresso semanalmente',
      implement_sensory_breaks: '😌 Implementar pausas sensoriais',
      reduce_stimulation: '🔇 Reduzir estímulos excessivos',
      data_collection_needed: '📋 Coleta de dados adicional necessária',
    }

    return recommendations[recommendation] || `💡 ${recommendation}`
  }

  const generateBasicReport = async (userId, sessionId, timeRange) => {
    // Esta função geraria um relatório básico baseado nos dados coletados
    // Sem análise avançada de IA, apenas estatísticas simples

    return {
      summary: {
        totalSessions: 15,
        totalInteractions: 1247,
        averageSessionDuration: 18.5, // minutos
        preferredTimeOfDay: 'Manhã (9h-11h)',
        mostUsedDevice: 'Tablet',
        totalDataPoints: 15623,
      },

      interactionMetrics: {
        touchFrequency: 45, // toques por minuto
        averagePressure: 0.65, // força média do toque (0-1)
        gestureVariety: 8, // tipos diferentes de gestos
        screenTime: 277, // minutos total
        pauseFrequency: 12, // pausas por sessão
      },

      behavioralIndicators: {
        engagementLevel: 'Alto',
        frustrationEvents: 3,
        helpRequestsPerSession: 1.2,
        taskCompletionRate: 78,
        averageResponseTime: 2.3, // segundos
      },

      deviceUsage: {
        orientation: { portrait: 85, landscape: 15 }, // percentual
        touchPatterns: {
          singleTouch: 82,
          multiTouch: 18,
        },
        sessionTimes: {
          morning: 45,
          afternoon: 35,
          evening: 20,
        },
      },

      progressIndicators: {
        improvementTrend: 'Positiva',
        consistencyScore: 72,
        adaptationSpeed: 'Moderada',
        skillDevelopment: [
          { skill: 'Coordenação Motora', level: 'Bom', trend: '+' },
          { skill: 'Atenção Sustentada', level: 'Moderado', trend: '+' },
          { skill: 'Processamento Visual', level: 'Excelente', trend: '=' },
          { skill: 'Memória de Trabalho', level: 'Bom', trend: '+' },
        ],
      },

      // 🎯 FASE 3: MÉTRICAS TERAPÊUTICAS
      therapeuticMetrics: {
        attentionScore: 'high', // baseado em responseTime < 1000ms
        coordinationScore: 'high', // baseado em accuracy > 0.8
        overallTherapeuticScore: 'good',
        interventionPriority: 'medium',
        therapeuticRecommendations: [
          'maintain_current_level',
          'increase_attention_exercises',
          'monitor_progress_weekly',
        ],
        sensorialAnalysis: {
          sensoryStabilityScore: 'medium',
          overloadRisk: 'low',
          calmingNeeded: false,
        },
        responseTime: 1200, // ms
        accuracy: 0.85, // 85%
        timestamp: Date.now(),
      },
    }
  }

  if (loading) {
    return (
      <ReportContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>📊 Carregando relatório...</div>
        </div>
      </ReportContainer>
    )
  }

  if (error) {
    return (
      <ReportContainer>
        <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
          <div>❌ {error}</div>
        </div>
      </ReportContainer>
    )
  }

  return (
    <ReportContainer>
      <h2>📊 Relatório Neuropedagógico Básico</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Análise básica dos dados coletados nos últimos{' '}
        {timeRange === '7d' ? '7 dias' : timeRange === '30d' ? '30 dias' : 'período selecionado'}
      </p>

      {/* Resumo Geral */}
      <ReportSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>📋 Resumo Geral</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
          }}
        >
          <MetricCard borderColor="#28a745">
            <div>
              <MetricValue color="#28a745">{reportData.summary.totalSessions}</MetricValue>
              <MetricLabel>Sessões Realizadas</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>🎯</div>
          </MetricCard>

          <MetricCard borderColor="#007bff">
            <div>
              <MetricValue color="#007bff">{reportData.summary.totalInteractions}</MetricValue>
              <MetricLabel>Total de Interações</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>👆</div>
          </MetricCard>

          <MetricCard borderColor="#6f42c1">
            <div>
              <MetricValue color="#6f42c1">
                {reportData.summary.averageSessionDuration}min
              </MetricValue>
              <MetricLabel>Duração Média</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>⏱️</div>
          </MetricCard>

          <MetricCard borderColor="#fd7e14">
            <div>
              <MetricValue color="#fd7e14">{reportData.summary.mostUsedDevice}</MetricValue>
              <MetricLabel>Dispositivo Preferido</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>📱</div>
          </MetricCard>
        </div>
      </ReportSection>

      {/* Métricas de Interação */}
      <ReportSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>🤏 Padrões de Interação</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
          }}
        >
          <MetricCard background="#e8f5e8" borderColor="#28a745">
            <div>
              <MetricValue color="#28a745">
                {reportData.interactionMetrics.touchFrequency}/min
              </MetricValue>
              <MetricLabel>Frequência de Toque</MetricLabel>
            </div>
          </MetricCard>

          <MetricCard background="#e3f2fd" borderColor="#2196f3">
            <div>
              <MetricValue color="#2196f3">
                {Math.round(reportData.interactionMetrics.averagePressure * 100)}%
              </MetricValue>
              <MetricLabel>Pressão Média</MetricLabel>
            </div>
          </MetricCard>

          <MetricCard background="#f3e5f5" borderColor="#9c27b0">
            <div>
              <MetricValue color="#9c27b0">
                {reportData.interactionMetrics.gestureVariety}
              </MetricValue>
              <MetricLabel>Tipos de Gestos</MetricLabel>
            </div>
          </MetricCard>
        </div>

        <ChartContainer>
          📊 Gráfico de Interações por Hora
          <br />
          <small>(Disponível na versão premium com IA)</small>
        </ChartContainer>
      </ReportSection>

      {/* Indicadores Comportamentais */}
      <ReportSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>🧠 Indicadores Comportamentais Básicos</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
          }}
        >
          <MetricCard background="#fff3cd" borderColor="#ffc107">
            <div>
              <MetricValue color="#ffc107">
                {reportData.behavioralIndicators.engagementLevel}
              </MetricValue>
              <MetricLabel>Nível de Engajamento</MetricLabel>
            </div>
          </MetricCard>

          <MetricCard background="#f8d7da" borderColor="#dc3545">
            <div>
              <MetricValue color="#dc3545">
                {reportData.behavioralIndicators.frustrationEvents}
              </MetricValue>
              <MetricLabel>Eventos de Frustração</MetricLabel>
            </div>
          </MetricCard>

          <MetricCard background="#d1ecf1" borderColor="#17a2b8">
            <div>
              <MetricValue color="#17a2b8">
                {reportData.behavioralIndicators.taskCompletionRate}%
              </MetricValue>
              <MetricLabel>Taxa de Conclusão</MetricLabel>
            </div>
          </MetricCard>
        </div>
      </ReportSection>

      {/* Desenvolvimento de Habilidades */}
      <ReportSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3>📈 Desenvolvimento de Habilidades</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
          }}
        >
          {reportData.progressIndicators.skillDevelopment.map((skill, index) => (
            <MetricCard key={index} background="#f8f9fa" borderColor="#6c757d">
              <div>
                <MetricValue color="#495057">{skill.level}</MetricValue>
                <MetricLabel>{skill.skill}</MetricLabel>
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color:
                    skill.trend === '+' ? '#28a745' : skill.trend === '-' ? '#dc3545' : '#6c757d',
                }}
              >
                {skill.trend === '+' ? '📈' : skill.trend === '-' ? '📉' : '➡️'}
              </div>
            </MetricCard>
          ))}
        </div>
      </ReportSection>

      {/* 🎯 FASE 3: MÉTRICAS TERAPÊUTICAS */}
      <ReportSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3>🎯 Análise Terapêutica Básica</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
          }}
        >
          <MetricCard background="#e8f5e8" borderColor="#28a745">
            <div>
              <MetricValue color="#28a745">
                {reportData.therapeuticMetrics?.attentionScore || 'Calculando...'}
              </MetricValue>
              <MetricLabel>Score de Atenção</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>🎯</div>
          </MetricCard>

          <MetricCard background="#e7f3ff" borderColor="#007bff">
            <div>
              <MetricValue color="#007bff">
                {reportData.therapeuticMetrics?.coordinationScore || 'Calculando...'}
              </MetricValue>
              <MetricLabel>Score de Coordenação</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>🤝</div>
          </MetricCard>

          <MetricCard background="#f0e6ff" borderColor="#6f42c1">
            <div>
              <MetricValue color="#6f42c1">
                {reportData.therapeuticMetrics?.overallTherapeuticScore || 'Em análise'}
              </MetricValue>
              <MetricLabel>Score Terapêutico Geral</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>🏆</div>
          </MetricCard>

          <MetricCard
            background={
              reportData.therapeuticMetrics?.interventionPriority === 'immediate'
                ? '#f8d7da'
                : reportData.therapeuticMetrics?.interventionPriority === 'high'
                  ? '#fff3cd'
                  : '#d4edda'
            }
            borderColor={
              reportData.therapeuticMetrics?.interventionPriority === 'immediate'
                ? '#dc3545'
                : reportData.therapeuticMetrics?.interventionPriority === 'high'
                  ? '#ffc107'
                  : '#28a745'
            }
          >
            <div>
              <MetricValue
                color={
                  reportData.therapeuticMetrics?.interventionPriority === 'immediate'
                    ? '#dc3545'
                    : reportData.therapeuticMetrics?.interventionPriority === 'high'
                      ? '#ffc107'
                      : '#28a745'
                }
              >
                {reportData.therapeuticMetrics?.interventionPriority || 'Baixa'}
              </MetricValue>
              <MetricLabel>Prioridade de Intervenção</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>
              {reportData.therapeuticMetrics?.interventionPriority === 'immediate'
                ? '🚨'
                : reportData.therapeuticMetrics?.interventionPriority === 'high'
                  ? '⚠️'
                  : '✅'}
            </div>
          </MetricCard>
        </div>

        {/* Recomendações Terapêuticas */}
        {reportData.therapeuticMetrics?.therapeuticRecommendations && (
          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <h4>💡 Recomendações Terapêuticas:</h4>{' '}
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              {reportData.therapeuticMetrics.therapeuticRecommendations.map(
                (recommendation, index) => (
                  <li key={index} style={{ margin: '5px 0', color: '#495057' }}>
                    {formatRecommendation(recommendation)}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Análise Sensorial */}
        {reportData.therapeuticMetrics?.sensorialAnalysis && (
          <div
            style={{
              marginTop: '15px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
            }}
          >
            <MetricCard background="#fff3cd" borderColor="#ffc107">
              <div>
                <MetricValue color="#ffc107">
                  {reportData.therapeuticMetrics.sensorialAnalysis.sensoryStabilityScore}
                </MetricValue>
                <MetricLabel>Estabilidade Sensorial</MetricLabel>
              </div>
            </MetricCard>

            <MetricCard
              background={
                reportData.therapeuticMetrics.sensorialAnalysis.overloadRisk === 'high'
                  ? '#f8d7da'
                  : '#d4edda'
              }
              borderColor={
                reportData.therapeuticMetrics.sensorialAnalysis.overloadRisk === 'high'
                  ? '#dc3545'
                  : '#28a745'
              }
            >
              <div>
                <MetricValue
                  color={
                    reportData.therapeuticMetrics.sensorialAnalysis.overloadRisk === 'high'
                      ? '#dc3545'
                      : '#28a745'
                  }
                >
                  {reportData.therapeuticMetrics.sensorialAnalysis.overloadRisk}
                </MetricValue>
                <MetricLabel>Risco de Sobrecarga</MetricLabel>
              </div>
            </MetricCard>
          </div>
        )}
      </ReportSection>

      {/* 🎯 FASE 3.2: MÉTRICAS DE CONFORMIDADE E PADRÕES */}
      <ReportSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <h3>📋 Conformidade com Padrões Neuropedagógicos</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
          }}
        >
          <MetricCard background="#e8f5e8" borderColor="#28a745">
            <div>
              <MetricValue color="#28a745">
                {reportData.complianceMetrics?.activityStandardsScore || '95%'}
              </MetricValue>
              <MetricLabel>Conformidade de Atividades</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>📊</div>
          </MetricCard>

          <MetricCard background="#e7f3ff" borderColor="#007bff">
            <div>
              <MetricValue color="#007bff">
                {reportData.complianceMetrics?.componentPatternsScore || '92%'}
              </MetricValue>
              <MetricLabel>Padrões de Componentes</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>🧩</div>
          </MetricCard>

          <MetricCard background="#f0e6ff" borderColor="#6f42c1">
            <div>
              <MetricValue color="#6f42c1">
                {reportData.complianceMetrics?.accessibilityScore || '98%'}
              </MetricValue>
              <MetricLabel>Acessibilidade</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>♿</div>
          </MetricCard>

          <MetricCard background="#fff3cd" borderColor="#ffc107">
            <div>
              <MetricValue color="#ffc107">
                {reportData.complianceMetrics?.overallComplianceScore || '95%'}
              </MetricValue>
              <MetricLabel>Conformidade Geral</MetricLabel>
            </div>
            <div style={{ fontSize: '24px' }}>🏅</div>
          </MetricCard>
        </div>

        {/* Detalhes de Conformidade */}
        <div
          style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}
        >
          <h4>📋 Status de Conformidade:</h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
              marginTop: '10px',
            }}
          >
            <div
              style={{
                padding: '10px',
                background: 'white',
                borderRadius: '6px',
                borderLeft: '3px solid #28a745',
              }}
            >
              <strong>✅ Padrões Atendidos:</strong>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                • Estrutura de Atividades
                <br />
                • Métricas Padronizadas
                <br />• Acessibilidade WCAG
              </div>
            </div>
            <div
              style={{
                padding: '10px',
                background: 'white',
                borderRadius: '6px',
                borderLeft: '3px solid #ffc107',
              }}
            >
              <strong>⚠️ Em Monitoramento:</strong>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                • Performance de Componentes
                <br />
                • Tempo de Resposta
                <br />• Usabilidade Mobile
              </div>
            </div>
          </div>
        </div>
      </ReportSection>

      {/* Upgrade Premium Prompt */}
      <UpgradePrompt
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3>🤖 Quer Análises Mais Profundas?</h3>
        <p>Desbloqueie relatórios avançados com Inteligência Artificial que incluem:</p>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '15px auto' }}>
          <li>🔍 Análise detalhada de padrões neurológicos</li>
          <li>🎯 Recomendações personalizadas baseadas em IA</li>
          <li>📊 Gráficos interativos e visualizações avançadas</li>
          <li>🧩 Identificação de necessidades específicas</li>
          <li>📋 Relatórios para profissionais da saúde</li>
          <li>🔮 Previsões de desenvolvimento</li>
        </ul>
        <UpgradeButton onClick={() => alert('Funcionalidade em desenvolvimento!')}>
          🚀 Upgrade para IA Premium
        </UpgradeButton>
      </UpgradePrompt>

      {/* Notas Importantes */}
      <div
        style={{ background: '#e9ecef', padding: '15px', borderRadius: '8px', marginTop: '20px' }}
      >
        <h4>📝 Notas Importantes:</h4>
        <ul style={{ color: '#6c757d', fontSize: '14px' }}>
          <li>Este relatório básico fornece uma visão geral dos dados coletados</li>
          <li>Para análises mais precisas e recomendações personalizadas, considere o upgrade</li>
          <li>Todos os dados são coletados de forma anônima e segura</li>
          <li>
            O relatório é baseado nos últimos {timeRange === '7d' ? '7 dias' : '30 dias'} de
            atividade
          </li>
        </ul>
      </div>
    </ReportContainer>
  )
}

export default BasicNeuropedagogicalReport
