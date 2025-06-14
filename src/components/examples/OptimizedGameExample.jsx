/**
 * EXEMPLO DE IMPLEMENTAÇÃO - PROCESSAMENTO EM TEMPO REAL
 * Demonstra como usar o novo sistema otimizado
 *
 * ANTES: Atividade → Dados Brutos → Banco → Algoritmos → ML → Relatórios
 * DEPOIS: Atividade → Processamento Real-time → Dados Refinados → Banco → Relatórios Instantâneos
 */

import React, { useEffect, useCallback } from 'react'
import useAdvancedActivity from '../hooks/useAdvancedActivity'

const OptimizedGameExample = ({ gameId, userId }) => {
  // Hook otimizado com processamento em tempo real
  const {
    // Métodos de processamento em tempo real
    startRealTimeSession,
    processEventRealTime,
    finishRealTimeSession,
    generateTherapeuticRecommendations,

    // Estados de processamento em tempo real
    isRealTimeSessionActive,
    processedMetricsLive,
    adaptiveParametersLive,
    realTimeMetrics,

    // Estados tradicionais para fallback
    progress,
    sessionId,
  } = useAdvancedActivity(gameId)

  // Iniciar sessão com processamento em tempo real
  useEffect(() => {
    const initializeOptimizedSession = async () => {
      console.log('🚀 Iniciando sessão otimizada para', gameId)

      try {
        // Iniciar processamento em tempo real
        const session = await startRealTimeSession('medium')

        if (session) {
          console.log('✅ Sessão em tempo real iniciada:', session.sessionId)
        } else {
          console.warn('⚠️ Fallback para modo tradicional')
        }
      } catch (error) {
        console.error('Erro ao iniciar sessão otimizada:', error)
      }
    }

    if (userId && gameId) {
      initializeOptimizedSession()
    }

    // Cleanup ao desmontar componente
    return () => {
      if (isRealTimeSessionActive) {
        finishRealTimeSession()
      }
    }
  }, [userId, gameId, startRealTimeSession, finishRealTimeSession, isRealTimeSessionActive])

  // Exemplo: Processar tentativa do usuário
  const handleUserAttempt = useCallback(
    async (attemptData) => {
      if (isRealTimeSessionActive) {
        // NOVO: Processamento em tempo real
        const insights = processEventRealTime('attempt', {
          responseTime: attemptData.responseTime,
          accuracy: attemptData.isCorrect,
          difficulty: attemptData.difficulty,
          sequenceLength: attemptData.sequenceLength,
          timestamp: Date.now(),
        })

        // Insights já processados e disponíveis instantaneamente
        if (insights) {
          console.log('📊 Insights em tempo real:', insights)

          // Aplicar ajustes adaptativos imediatamente
          if (insights.adaptive?.recommendations) {
            console.log('🎯 Aplicando ajustes adaptativos:', insights.adaptive.recommendations)
          }

          // Mostrar recomendações terapêuticas se disponíveis
          if (insights.therapeutic?.newInsights) {
            console.log('🧠 Novas recomendações terapêuticas:', insights.therapeutic.newInsights)
          }
        }
      } else {
        // Fallback para modo tradicional
        console.log('📝 Modo tradicional - processamento posterior')
      }
    },
    [isRealTimeSessionActive, processEventRealTime]
  )

  // Exemplo: Processar erro do usuário
  const handleUserError = useCallback(
    async (errorData) => {
      if (isRealTimeSessionActive) {
        const insights = processEventRealTime('error', {
          consecutive: errorData.consecutiveErrors,
          errorType: errorData.type,
          responseTime: errorData.responseTime,
          timestamp: Date.now(),
        })

        // Detectar necessidade de intervenção imediata
        if (insights?.therapeutic?.newInsights) {
          const urgentInsights = insights.therapeutic.newInsights.filter(
            (insight) => insight.priority === 'high'
          )

          if (urgentInsights.length > 0) {
            console.log('🚨 Intervenção imediata necessária:', urgentInsights)
            // Aqui você pode mostrar uma notificação ou ajustar a interface
          }
        }
      }
    },
    [isRealTimeSessionActive, processEventRealTime]
  )

  // Exemplo: Finalizar sessão com dados já processados
  const handleGameCompletion = useCallback(async () => {
    if (isRealTimeSessionActive) {
      console.log('🏁 Finalizando sessão otimizada...')

      const finalReport = await finishRealTimeSession({
        completed: true,
        finalScore: progress.score,
        finalAccuracy: progress.accuracy,
      })

      if (finalReport) {
        console.log('✅ Relatório final com dados já processados:', finalReport)

        // Dados já estão refinados e salvos no banco
        // Relatórios podem ser gerados instantaneamente

        // Obter recomendações terapêuticas finais
        const therapeuticRecommendations = generateTherapeuticRecommendations()
        console.log('🎯 Recomendações terapêuticas finais:', therapeuticRecommendations)

        return finalReport
      }
    }

    return null
  }, [isRealTimeSessionActive, finishRealTimeSession, progress, generateTherapeuticRecommendations])

  // Renderizar interface com dados em tempo real
  return (
    <div className="optimized-game-container">
      <div className="game-header">
        <h2>Jogo Otimizado - {gameId}</h2>
        <div className="status-indicators">
          <div className={`status ${isRealTimeSessionActive ? 'active' : 'inactive'}`}>
            {isRealTimeSessionActive ? '🚀 Processamento em Tempo Real' : '📝 Modo Tradicional'}
          </div>
        </div>
      </div>

      {/* Métricas em tempo real */}
      {processedMetricsLive && (
        <div className="real-time-metrics">
          <h3>📊 Métricas Processadas em Tempo Real</h3>

          {/* Perfil cognitivo atualizado em tempo real */}
          {processedMetricsLive.cognitiveProfile && (
            <div className="cognitive-profile">
              <h4>🧠 Perfil Cognitivo</h4>
              <p>
                Velocidade de Processamento: {processedMetricsLive.cognitiveProfile.processingSpeed}
              </p>
              <p>Atenção Sustentada: {processedMetricsLive.cognitiveProfile.attentionSpan}</p>
              <p>Memória de Trabalho: {processedMetricsLive.cognitiveProfile.workingMemory}</p>
            </div>
          )}

          {/* Insights terapêuticos em tempo real */}
          {processedMetricsLive.therapeuticInsights?.length > 0 && (
            <div className="therapeutic-insights">
              <h4>🎯 Insights Terapêuticos</h4>
              {processedMetricsLive.therapeuticInsights.map((insight, index) => (
                <div key={index} className={`insight priority-${insight.priority}`}>
                  <strong>{insight.type}:</strong> {insight.recommendation}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Parâmetros adaptativos em tempo real */}
      {adaptiveParametersLive?.length > 0 && (
        <div className="adaptive-parameters">
          <h3>⚙️ Ajustes Adaptativos</h3>
          {adaptiveParametersLive.map((param, index) => (
            <div key={index} className="parameter">
              <strong>{param.type}:</strong> {param.value}
              <small>({param.reason})</small>
            </div>
          ))}
        </div>
      )}

      {/* Métricas base em tempo real */}
      {realTimeMetrics && (
        <div className="base-metrics">
          <h3>📈 Métricas Base</h3>
          <div className="metrics-grid">
            <div>Tentativas: {realTimeMetrics.attempts}</div>
            <div>Acertos: {realTimeMetrics.successes}</div>
            <div>Precisão: {realTimeMetrics.currentAccuracy}%</div>
            <div>Pontuação: {realTimeMetrics.score}</div>
            <div>Nível Adaptativo: {realTimeMetrics.adaptiveLevel}</div>
          </div>
        </div>
      )}

      {/* Área do jogo */}
      <div className="game-area">
        {/* Aqui seria renderizado o jogo específico */}
        <div className="game-placeholder">
          <p>🎮 Área do Jogo - {gameId}</p>

          {/* Botões de exemplo para testar o processamento */}
          <div className="test-controls">
            <button
              onClick={() =>
                handleUserAttempt({
                  responseTime: Math.random() * 3000 + 1000,
                  isCorrect: Math.random() > 0.3,
                  difficulty: 'medium',
                  sequenceLength: 3,
                })
              }
              disabled={!isRealTimeSessionActive}
            >
              Simular Tentativa
            </button>

            <button
              onClick={() =>
                handleUserError({
                  consecutiveErrors: 2,
                  type: 'timeout',
                  responseTime: 5000,
                })
              }
              disabled={!isRealTimeSessionActive}
            >
              Simular Erro
            </button>

            <button onClick={handleGameCompletion} disabled={!isRealTimeSessionActive}>
              Finalizar Jogo
            </button>
          </div>
        </div>
      </div>

      {/* Informações de debug */}
      <div className="debug-info">
        <details>
          <summary>🔧 Informações de Debug</summary>
          <pre>
            {JSON.stringify(
              {
                isRealTimeSessionActive,
                hasProcessedMetrics: !!processedMetricsLive,
                hasAdaptiveParams: !!adaptiveParametersLive,
                sessionId,
              },
              null,
              2
            )}
          </pre>
        </details>
      </div>
    </div>
  )
}

export default OptimizedGameExample
