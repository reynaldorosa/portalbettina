/**
 * @file autismIntegrationExample.js
 * @description Exemplo de como integrar o sistema de análise cognitiva para autismo
 * nas atividades existentes do Portal Betina
 */

// ==================== EXEMPLO DE INTEGRAÇÃO EM UMA ATIVIDADE ====================

/**
 * Como usar o hook de análise cognitiva para autismo em uma atividade
 */

// 1. IMPORTAÇÃO DOS HOOKS
import { useAutismCognitiveAnalysis } from '../hooks/useAutismCognitiveAnalysis.js'
import { useAdvancedActivity } from '../hooks/useAdvancedActivity.js'
import { useActivity } from '../hooks/useActivity.js'

// 2. EXEMPLO DE USO EM UM COMPONENTE DE ATIVIDADE
function ExampleAutismIntegratedActivity({ onBack }) {
  // Hooks básicos da atividade
  const activity = useActivity('example-activity', {
    enableAdaptiveML: true,
    enableMetrics: true,
    enableAccessibility: true,
  })

  // Hook avançado para métricas multissensoriais
  const advanced = useAdvancedActivity('example-activity', {
    enableRealTimeMetrics: true,
    enableNeuropedagogicalAnalysis: true,
  })

  // 🧩 NOVO: Hook especializado para análise cognitiva de autismo
  const autismAnalysis = useAutismCognitiveAnalysis('example-activity', {
    enableRealTimeAnalysis: true,
    enableAdaptations: true,
    enableTherapyOptimizations: true,
  })

  // 3. USAR OS INSIGHTS DA ANÁLISE PARA ADAPTAR A ATIVIDADE
  useEffect(() => {
    if (autismAnalysis.hasAnalysis) {
      const insights = autismAnalysis.getInsights()

      // Aplicar adaptações sensoriais
      if (insights.sensoryProfile?.adaptations) {
        applySensoryAdaptations(insights.sensoryProfile.adaptations)
      }

      // Adaptar comunicação baseada no nível
      if (insights.communicationLevel?.level !== undefined) {
        adaptCommunicationLevel(insights.communicationLevel.level)
      }

      // Ajustar dificuldade baseada no nível de suporte
      if (insights.supportLevel?.level) {
        adjustDifficultyForSupportLevel(insights.supportLevel.level)
      }
    }
  }, [autismAnalysis.hasAnalysis, autismAnalysis.currentAdaptations])

  // 4. EXEMPLOS DE FUNÇÕES DE ADAPTAÇÃO
  const applySensoryAdaptations = useCallback((adaptations) => {
    adaptations.forEach((adaptation) => {
      switch (adaptation.type) {
        case 'visual':
          // Ajustar contraste, brilho, cores
          document.documentElement.style.setProperty('--contrast-level', adaptation.value)
          break
        case 'auditory':
          // Ajustar volume, filtros de ruído
          adjustAudioSettings(adaptation.value)
          break
        case 'tactile':
          // Configurar vibração, feedback tátil
          configureTactileFeedback(adaptation.value)
          break
      }
    })
  }, [])

  const adaptCommunicationLevel = useCallback((level) => {
    // Nível 0: Não verbal - usar apenas símbolos/imagens
    // Nível 1: Palavras simples - usar texto básico
    // Nível 2: Frases - usar instruções curtas
    // Nível 3: Sentenças - usar instruções completas
    // Nível 4: Avançado - usar linguagem complexa

    const communicationModes = {
      0: 'symbols-only',
      1: 'simple-words',
      2: 'short-phrases',
      3: 'full-sentences',
      4: 'complex-language',
    }

    setCommunicationMode(communicationModes[level] || 'simple-words')
  }, [])

  const adjustDifficultyForSupportLevel = useCallback(
    (supportLevel) => {
      // Nível 1: Suporte necessário - dificuldade adaptativa
      // Nível 2: Suporte substancial - dificuldade reduzida
      // Nível 3: Suporte muito substancial - dificuldade mínima

      const difficultyMapping = {
        1: 'adaptive',
        2: 'easy',
        3: 'minimal',
      }

      activity.changeDifficulty(difficultyMapping[supportLevel] || 'easy')
    },
    [activity]
  )

  // 5. EXIBIR RECOMENDAÇÕES PARA TERAPEUTAS
  const renderTherapyRecommendations = () => {
    const recommendations = autismAnalysis.getTherapyRecommendations()

    if (recommendations.length === 0) return null

    return (
      <div className="therapy-recommendations">
        <h3>💡 Recomendações Terapêuticas</h3>
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>
              <strong>{rec.domain}:</strong> {rec.description}
              {rec.priority === 'high' && <span className="priority-high">🔴 Alta Prioridade</span>}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // 6. EXIBIR ADAPTAÇÕES ATIVAS
  const renderActiveAdaptations = () => {
    const adaptations = autismAnalysis.getAdaptationRecommendations()

    if (adaptations.length === 0) return null

    return (
      <div className="active-adaptations">
        <h3>🎯 Adaptações Ativas</h3>
        <div className="adaptations-grid">
          {adaptations.map((adaptation, index) => (
            <div key={index} className={`adaptation-card ${adaptation.type}`}>
              <span className="adaptation-icon">{adaptation.icon}</span>
              <span className="adaptation-text">{adaptation.description}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 7. RENDER DO COMPONENTE
  return (
    <ActivityWrapper title="Atividade Integrada com Análise de Autismo" emoji="🧩">
      {/* Indicadores de análise */}
      {autismAnalysis.isAnalyzing && (
        <div className="analysis-indicator">🧩 Analisando características cognitivas...</div>
      )}

      {/* Nível de suporte identificado */}
      {autismAnalysis.supportLevel && (
        <div className="support-level-indicator">
          📊 Nível de Suporte: {autismAnalysis.supportLevel.description}
        </div>
      )}

      {/* Conteúdo principal da atividade */}
      <div className="activity-content">{/* Sua atividade aqui */}</div>

      {/* Adaptações ativas */}
      {renderActiveAdaptations()}

      {/* Recomendações terapêuticas */}
      {renderTherapyRecommendations()}

      {/* Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="debug-info">
          <summary>🔍 Debug - Análise Cognitiva</summary>
          <pre>{JSON.stringify(autismAnalysis.getInsights(), null, 2)}</pre>
        </details>
      )}
    </ActivityWrapper>
  )
}

// ==================== EXEMPLO DE INTEGRAÇÃO COM HOOKS EXISTENTES ====================

/**
 * Exemplo de como integrar com useAdvancedActivity para análise completa
 */
function AdvancedAutismIntegrationExample() {
  const advanced = useAdvancedActivity('activity-id')
  const autism = useAutismCognitiveAnalysis('activity-id')

  // Combinar insights de ambos os sistemas
  const getCombinedInsights = useCallback(() => {
    return {
      // Insights neuropedagógicos gerais
      neuropedagogical: advanced.neuropedagogicalInsights,

      // Insights específicos para autismo
      autismSpecific: autism.getInsights(),

      // Recomendações combinadas
      combinedRecommendations: [
        ...advanced.adaptiveRecommendations,
        ...autism.getAdaptationRecommendations(),
        ...autism.getTherapyRecommendations(),
      ],
    }
  }, [advanced, autism])

  return getCombinedInsights()
}

// ==================== EXEMPLO DE CONFIGURAÇÃO PERSONALIZADA ====================

/**
 * Configuração específica para diferentes perfis de autismo
 */
const autismProfileConfigs = {
  'high-functioning': {
    enableRealTimeAnalysis: true,
    enableAdaptations: true,
    enableTherapyOptimizations: true,
    adaptationSensitivity: 'medium',
    communicationMode: 'advanced',
  },

  'moderate-support': {
    enableRealTimeAnalysis: true,
    enableAdaptations: true,
    enableTherapyOptimizations: true,
    adaptationSensitivity: 'high',
    communicationMode: 'simple',
  },

  'high-support': {
    enableRealTimeAnalysis: false, // Menos estímulo
    enableAdaptations: true,
    enableTherapyOptimizations: true,
    adaptationSensitivity: 'very-high',
    communicationMode: 'visual',
  },
}

function ConfiguredAutismActivity({ userProfile, onBack }) {
  const config =
    autismProfileConfigs[userProfile?.autismLevel] || autismProfileConfigs['moderate-support']

  const autism = useAutismCognitiveAnalysis('activity-id', config)

  // Resto da implementação...
}

// ==================== EXEMPLO DE MONITORAMENTO EM TEMPO REAL ====================

/**
 * Hook personalizado para monitoramento específico
 */
function useAutismRealTimeMonitoring(activityId) {
  const autism = useAutismCognitiveAnalysis(activityId)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    if (autism.hasAnalysis) {
      const insights = autism.getInsights()
      const newAlerts = []

      // Detectar possível sobrecarga sensorial
      if (insights.sensoryProfile?.overloadRisk > 0.7) {
        newAlerts.push({
          type: 'sensory-overload',
          message: 'Possível sobrecarga sensorial detectada',
          priority: 'high',
          recommendations: ['Reduzir estímulos visuais', 'Pausar atividade', 'Ambiente mais calmo'],
        })
      }

      // Detectar dificuldades de comunicação
      if (insights.communicationLevel?.barriers?.length > 2) {
        newAlerts.push({
          type: 'communication-barrier',
          message: 'Múltiplas barreiras de comunicação identificadas',
          priority: 'medium',
          recommendations: [
            'Simplificar instruções',
            'Usar apoios visuais',
            'Reduzir demandas verbais',
          ],
        })
      }

      // Detectar necessidade de suporte adicional
      if (insights.supportLevel?.level >= 2) {
        newAlerts.push({
          type: 'support-needed',
          message: 'Suporte adicional pode ser necessário',
          priority: 'medium',
          recommendations: ['Aumentar apoio', 'Adaptar tarefa', 'Considerar pausa'],
        })
      }

      setAlerts(newAlerts)
    }
  }, [autism.hasAnalysis, autism.currentAdaptations])

  return { alerts, autism }
}

export {
  ExampleAutismIntegratedActivity,
  AdvancedAutismIntegrationExample,
  ConfiguredAutismActivity,
  useAutismRealTimeMonitoring,
  autismProfileConfigs,
}
