/**
 * @file ExampleUsage.jsx
 * @description Exemplo de uso do sistema integrado de análise
 * Demonstra como integrar com componentes React
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react'
import useIntegratedAnalysis from '../hooks/useIntegratedAnalysis.js'

const AnalysisDashboard = ({ userProfile }) => {
  const {
    // Estados
    isInitialized,
    currentSession,
    isAnalyzing,
    realtimeData,
    sessionResults,
    interventions,
    optimizations,
    error,
    loading,

    // Métodos
    startSession,
    endSession,
    processRealtimeEvent,
    processIntervention,
    processOptimization,
    exportSessionReport,

    // Utilitários
    hasActiveSession,
    hasInterventions,
    hasOptimizations,
    isReady,
  } = useIntegratedAnalysis(userProfile, {
    realtimeAnalysis: true,
    analysisInterval: 3000,
  })

  const [activityData, setActivityData] = useState({
    interactions: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    currentDifficulty: 'medium',
  })

  // Simular eventos de atividade
  const handleUserInteraction = async (eventType, data = {}) => {
    const eventData = {
      type: eventType,
      timestamp: Date.now(),
      performance: data.performance || Math.random(),
      accuracy: data.accuracy || Math.random(),
      responseTime: data.responseTime || Math.random() * 2000 + 500,
      difficulty: activityData.currentDifficulty,
      ...data,
    }

    // Processar evento em tempo real
    await processRealtimeEvent(eventData)

    // Atualizar dados da atividade
    setActivityData((prev) => ({
      ...prev,
      interactions: prev.interactions + 1,
      correctAnswers: eventData.success ? prev.correctAnswers + 1 : prev.correctAnswers,
      totalQuestions:
        eventType === 'question_answered' ? prev.totalQuestions + 1 : prev.totalQuestions,
    }))
  }

  const handleStartSession = async () => {
    try {
      await startSession({
        activityType: 'cognitive_training',
        difficulty: activityData.currentDifficulty,
      })
      setActivityData((prev) => ({
        ...prev,
        interactions: 0,
        correctAnswers: 0,
        totalQuestions: 0,
      }))
    } catch (err) {
      console.error('Erro ao iniciar sessão:', err)
    }
  }

  const handleEndSession = async () => {
    try {
      await endSession()
    } catch (err) {
      console.error('Erro ao finalizar sessão:', err)
    }
  }

  if (loading) {
    return (
      <div className="analysis-dashboard loading">
        <h3>🔄 Carregando sistema de análise...</h3>
      </div>
    )
  }

  if (error) {
    return (
      <div className="analysis-dashboard error">
        <h3>❌ Erro no sistema de análise</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="analysis-dashboard not-ready">
        <h3>⏳ Sistema não está pronto</h3>
        <p>Aguardando inicialização...</p>
      </div>
    )
  }

  return (
    <div className="analysis-dashboard">
      <header>
        <h2>🧠 Dashboard de Análise Integrada</h2>
        <div className="status-indicators">
          <span className={`status ${isInitialized ? 'active' : 'inactive'}`}>
            {isInitialized ? '✅' : '❌'} Sistema
          </span>
          <span className={`status ${hasActiveSession ? 'active' : 'inactive'}`}>
            {hasActiveSession ? '🟢' : '⚪'} Sessão
          </span>
          <span className={`status ${isAnalyzing ? 'active' : 'inactive'}`}>
            {isAnalyzing ? '📊' : '⏸️'} Análise
          </span>
        </div>
      </header>

      {/* Controles de Sessão */}
      <section className="session-controls">
        <h3>🎯 Controles de Sessão</h3>
        {!hasActiveSession ? (
          <button onClick={handleStartSession} className="btn-start" disabled={!isReady}>
            ▶️ Iniciar Sessão
          </button>
        ) : (
          <div>
            <p>📅 Sessão ativa: {currentSession?.sessionId}</p>
            <button onClick={handleEndSession} className="btn-end">
              ⏹️ Finalizar Sessão
            </button>
          </div>
        )}
      </section>

      {/* Simulação de Atividades */}
      {hasActiveSession && (
        <section className="activity-simulation">
          <h3>🎮 Simulação de Atividades</h3>
          <div className="activity-stats">
            <p>🔢 Interações: {activityData.interactions}</p>
            <p>
              ✅ Acertos: {activityData.correctAnswers}/{activityData.totalQuestions}
            </p>
            <p>
              📊 Taxa:{' '}
              {activityData.totalQuestions > 0
                ? Math.round((activityData.correctAnswers / activityData.totalQuestions) * 100)
                : 0}
              %
            </p>
          </div>

          <div className="activity-buttons">
            <button
              onClick={() =>
                handleUserInteraction('question_answered', {
                  success: true,
                  performance: 0.8,
                  responseTime: 1500,
                })
              }
              className="btn-correct"
            >
              ✅ Resposta Correta
            </button>

            <button
              onClick={() =>
                handleUserInteraction('question_answered', {
                  success: false,
                  performance: 0.3,
                  responseTime: 3000,
                })
              }
              className="btn-incorrect"
            >
              ❌ Resposta Incorreta
            </button>

            <button
              onClick={() =>
                handleUserInteraction('help_request', {
                  performance: 0.5,
                  frustrationLevel: 0.7,
                })
              }
              className="btn-help"
            >
              🆘 Pedir Ajuda
            </button>

            <button
              onClick={() =>
                handleUserInteraction('breakthrough', {
                  skill: 'pattern_recognition',
                  improvementScore: 0.9,
                })
              }
              className="btn-breakthrough"
            >
              🚀 Breakthrough!
            </button>
          </div>
        </section>
      )}

      {/* Dados em Tempo Real */}
      {realtimeData && (
        <section className="realtime-data">
          <h3>📈 Análise em Tempo Real</h3>
          <div className="metrics-grid">
            <div className="metric">
              <h4>😊 Estado Emocional</h4>
              <div className="progress-bar">
                <div
                  className="progress-fill emotional"
                  style={{ width: `${(realtimeData.emotional?.engagementLevel || 0) * 100}%` }}
                />
              </div>
              <span>{Math.round((realtimeData.emotional?.engagementLevel || 0) * 100)}%</span>
            </div>

            <div className="metric">
              <h4>🧠 Neuroplasticidade</h4>
              <div className="progress-bar">
                <div
                  className="progress-fill neuroplasticity"
                  style={{
                    width: `${(realtimeData.neuroplasticity?.improvementPotential || 0.5) * 100}%`,
                  }}
                />
              </div>
              <span>
                {Math.round((realtimeData.neuroplasticity?.improvementPotential || 0.5) * 100)}%
              </span>
            </div>

            <div className="metric">
              <h4>⚠️ Risco</h4>
              <div className="progress-bar">
                <div
                  className="progress-fill risk"
                  style={{ width: `${(realtimeData.integrated?.riskScore || 0) * 100}%` }}
                />
              </div>
              <span>{Math.round((realtimeData.integrated?.riskScore || 0) * 100)}%</span>
            </div>

            <div className="metric">
              <h4>🎯 Oportunidade</h4>
              <div className="progress-bar">
                <div
                  className="progress-fill opportunity"
                  style={{ width: `${(realtimeData.integrated?.opportunityScore || 0) * 100}%` }}
                />
              </div>
              <span>{Math.round((realtimeData.integrated?.opportunityScore || 0) * 100)}%</span>
            </div>
          </div>
        </section>
      )}

      {/* Intervenções */}
      {hasInterventions && (
        <section className="interventions">
          <h3>🚨 Intervenções Necessárias</h3>
          <div className="intervention-list">
            {interventions.map((intervention, index) => (
              <div key={index} className={`intervention ${intervention.priority}`}>
                <h4>{intervention.type}</h4>
                <p>{intervention.description || intervention.action}</p>
                <button
                  onClick={() => processIntervention(intervention.id)}
                  className="btn-process"
                >
                  ✅ Processar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Otimizações */}
      {hasOptimizations && (
        <section className="optimizations">
          <h3>⚡ Otimizações Disponíveis</h3>
          <div className="optimization-list">
            {optimizations.map((optimization, index) => (
              <div key={index} className={`optimization ${optimization.priority}`}>
                <h4>{optimization.type}</h4>
                <p>{optimization.description || optimization.action}</p>
                <button
                  onClick={() => processOptimization(optimization.id)}
                  className="btn-process"
                >
                  🚀 Aplicar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Resultados da Sessão */}
      {sessionResults && (
        <section className="session-results">
          <h3>📋 Resultados da Sessão</h3>
          <div className="results-summary">
            <div className="result-item">
              <h4>😊 Bem-estar Geral</h4>
              <span className="score">
                {Math.round((sessionResults.analysis.integrated.overallWellbeing || 0) * 100)}%
              </span>
            </div>
            <div className="result-item">
              <h4>📚 Efetividade de Aprendizagem</h4>
              <span className="score">
                {Math.round((sessionResults.analysis.integrated.learningEffectiveness || 0) * 100)}%
              </span>
            </div>
            <div className="result-item">
              <h4>🧠 Crescimento Cognitivo</h4>
              <span className="score">
                {Math.round((sessionResults.analysis.integrated.cognitiveGrowth || 0) * 100)}%
              </span>
            </div>
          </div>

          <button
            onClick={() => exportSessionReport(currentSession?.sessionId)}
            className="btn-export"
          >
            📊 Exportar Relatório
          </button>
        </section>
      )}
    </div>
  )
}

export default AnalysisDashboard

// Estilos CSS integrados (seria normalmente em arquivo separado)
const styles = `
.analysis-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.status-indicators {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.status {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
}

.status.active {
  background-color: #e8f5e8;
  color: #2d5a2d;
}

.status.inactive {
  background-color: #f5e8e8;
  color: #5a2d2d;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.metric {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-fill.emotional { background-color: #4CAF50; }
.progress-fill.neuroplasticity { background-color: #2196F3; }
.progress-fill.risk { background-color: #f44336; }
.progress-fill.opportunity { background-color: #FF9800; }

.activity-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.activity-buttons button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.btn-correct { background-color: #4CAF50; color: white; }
.btn-incorrect { background-color: #f44336; color: white; }
.btn-help { background-color: #FF9800; color: white; }
.btn-breakthrough { background-color: #9C27B0; color: white; }

.intervention-list, .optimization-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.intervention, .optimization {
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid;
}

.intervention.high { border-left-color: #f44336; background-color: #ffebee; }
.intervention.medium { border-left-color: #FF9800; background-color: #fff3e0; }
.optimization.medium { border-left-color: #2196F3; background-color: #e3f2fd; }

.results-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 15px 0;
}

.result-item {
  text-align: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.score {
  font-size: 24px;
  font-weight: bold;
  color: #2196F3;
}
`

// Injetar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}
