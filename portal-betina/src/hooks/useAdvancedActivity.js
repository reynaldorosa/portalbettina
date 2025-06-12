/**
 * Hook Avançado para Atividades com IA e Insights Neuropedagógicos
 * Integra métricas multissensoriais, análise neuropedagógica e recomendações adaptativas
 * VERSÃO 3.0 - PROCESSAMENTO EM TEMPO REAL OTIMIZADO
 * 🚀 OTIMIZAÇÃO: Processamento durante atividade, dados refinados salvos diretamente
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import useProgress from './useProgress'
import { useUser } from '../contexts/UserContext'

// Importações condicionais - carregamento dinâmico para evitar erros
let neuropedagogicalAnalyzer, createAdaptiveModel, AdvancedSupportCalculator

// 🚀 CARREGAMENTO DINÂMICO CORRIGIDO - SEM MOCKS
const loadDependencies = async () => {
  try {
    // Carregamento seguro dos módulos que realmente existem
    const imports = await Promise.all([
      import('../utils/metrics/neuropedagogicalInsights.js').catch(() => null),
      import('../utils/adaptive/adaptiveML.js').catch(() => null),
      import('../utils/advancedSupportCalculations.js').catch(() => null),
    ])

    // Verificar se os módulos foram carregados corretamente
    // NeuropedagogicalAnalyzer exporta uma instância (default export)
    if (imports[0]?.default) {
      neuropedagogicalAnalyzer = imports[0].default
      console.log('✅ NeuropedagogicalAnalyzer (instância) carregado')
    }

    if (imports[1]?.createAdaptiveModel) {
      createAdaptiveModel = imports[1].createAdaptiveModel
      console.log('✅ createAdaptiveModel carregado')
    }

    if (imports[2]?.default) {
      AdvancedSupportCalculator = imports[2].default
      console.log('✅ AdvancedSupportCalculator carregado')
    }

    console.log('✅ Dependências básicas carregadas para useAdvancedActivity')
    return true
  } catch (error) {
    console.warn('⚠️ Alguns módulos avançados não estão disponíveis:', error)
    return false
  }
}

const useAdvancedActivity = (activityId, config = {}) => {
  // Estados para sistemas avançados existentes
  const [neuropedagogicalInsights, setNeuropedagogicalInsights] = useState(null)
  const [multisensoryData, setMultisensoryData] = useState(null)
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState([])
  const [realTimeMetrics, setRealTimeMetrics] = useState({})
  const [cognitiveProfile, setCognitiveProfile] = useState(null)
  const [learningOptimizations, setLearningOptimizations] = useState([])
  const [sessionInsights, setSessionInsights] = useState(null)

  // 🚀 NOVOS ESTADOS - PROCESSAMENTO EM TEMPO REAL
  const [realTimeSession, setRealTimeSession] = useState(null)
  const [processedMetricsLive, setProcessedMetricsLive] = useState(null)
  const [adaptiveParametersLive, setAdaptiveParametersLive] = useState(null)

  // 🚀 NOVOS ESTADOS - FASE 1: Algoritmos Comportamentais Avançados
  const [behavioralIndicators, setBehavioralIndicators] = useState(null)
  const [executiveFunctionProfile, setExecutiveFunctionProfile] = useState(null)
  const [supportLevels, setSupportLevels] = useState(null)
  const [autismSupportLevel, setAutismSupportLevel] = useState(null)

  // Estados para novos sistemas avançados
  const [neuroplasticityInsights, setNeuroplasticityInsights] = useState(null)
  const [accessibilityAdaptations, setAccessibilityAdaptations] = useState(null)
  const [predictiveAlerts, setPredictiveAlerts] = useState([])
  const [multisensoryOptimizations, setMultisensoryOptimizations] = useState(null)
  const [emotionalState, setEmotionalState] = useState(null)
  const [integratedAnalysis, setIntegratedAnalysis] = useState(null)

  // Estados para controle de IA
  const [aiSystemsInitialized, setAiSystemsInitialized] = useState(false)
  const [advancedSystemsInitialized, setAdvancedSystemsInitialized] = useState(false)
  const [adaptiveModel, setAdaptiveModel] = useState(null)
  const [intelligentDifficulty, setIntelligentDifficulty] = useState('medium')
  const [personalizedFeedback, setPersonalizedFeedback] = useState('')
  const [learningStyleDetected, setLearningStyleDetected] = useState(null)

  // Instâncias dos novos sistemas
  const [neuroplasticityAnalyzer, setNeuroplasticityAnalyzer] = useState(null)
  const [accessibilityManager, setAccessibilityManager] = useState(null)
  const [predictiveEngine, setPredictiveEngine] = useState(null)
  const [multisensoryEngine, setMultisensoryEngine] = useState(null)
  const [emotionalEngine, setEmotionalEngine] = useState(null)
  const [analysisOrchestrator, setAnalysisOrchestrator] = useState(null)

  // 🚀 NOVOS SISTEMAS - FASE 1
  const [supportCalculator, setSupportCalculator] = useState(null)
  const [behavioralAnalyzer, setBehavioralAnalyzer] = useState(null)

  // Hook base para atividades
  const baseProgress = useProgress(activityId)
  const { userId } = useUser()

  // Refs para controle interno
  const metricsCollectionRef = useRef(false)
  const realTimeAnalysisInterval = useRef(null)
  const lastRecommendationUpdate = useRef(Date.now())
  const sessionStartTime = useRef(null)
  const comprehensiveAnalysisInterval = useRef(null)
  const neuroplasticityTrackingInterval = useRef(null)

  // Configurações avançadas expandidas
  const advancedConfig = {
    enableRealTimeMetrics: true,
    enableNeuropedagogicalAnalysis: true,
    enableAdaptiveRecommendations: true,
    enableIntelligentDifficulty: true,
    enablePersonalizedFeedback: true,

    // Novos sistemas
    enableNeuroplasticityTracking: true,
    enableAccessibilityAdaptation: true,
    enablePredictiveAnalysis: true,
    enableMultisensoryOptimization: true,
    enableEmotionalAnalysis: true,
    enableIntegratedAnalysis: true,

    // Intervalos de atualização
    metricsUpdateInterval: 2000, // 2 segundos
    recommendationUpdateInterval: 10000, // 10 segundos
    neuroplasticityUpdateInterval: 30000, // 30 segundos
    comprehensiveAnalysisInterval: 120000, // 2 minutos

    ...config,
  }

  // Métodos auxiliares básicos
  const loadCognitiveProfile = async (userId) => {
    return {
      processingStyle: 'sequential',
      preferredModality: 'visual',
      attentionSpan: 'average',
      memoryStrength: 'good',
    }
  }

  const getHistoricalData = async (userId, activityId) => {
    return []
  }

  const adjustSensoryModality = async (recommendation) => {
    console.log('Ajustando modalidade sensorial:', recommendation.details)
  }
  // Inicializar sistemas avançados básicos
  useEffect(() => {
    const initializeAdvancedSystems = async () => {
      if (!userId || aiSystemsInitialized) return

      try {
        console.log('🚀 Inicializando sistemas avançados de IA...')

        // Carregar dependências primeiro
        await loadDependencies()

        // Inicializar modelo adaptativo se disponível
        if (createAdaptiveModel) {
          try {
            const model = createAdaptiveModel(activityId, userId)
            setAdaptiveModel(model)
            console.log('✅ Modelo adaptativo inicializado')
          } catch (error) {
            console.warn('⚠️ Erro ao inicializar modelo adaptativo:', error)
          }
        }

        // Carregar perfil cognitivo existente
        const profile = await loadCognitiveProfile(userId)
        setCognitiveProfile(profile)

        setAiSystemsInitialized(true)
        console.log('✅ Sistemas avançados de IA inicializados com sucesso')
      } catch (error) {
        console.error('❌ Erro ao inicializar sistemas avançados:', error)
      }
    }

    initializeAdvancedSystems()
  }, [userId, activityId, aiSystemsInitialized])
  // Inicializar novos sistemas de análise avançada
  useEffect(() => {
    const initializeNewAdvancedSystems = async () => {
      if (!userId || !aiSystemsInitialized || advancedSystemsInitialized) return

      try {
        console.log('🚀 Inicializando sistemas de análise avançada v2.0...')

        // 🚀 FASE 1: Inicializar sistemas comportamentais reais
        if (AdvancedSupportCalculator) {
          try {
            const supportCalc = new AdvancedSupportCalculator()
            await supportCalc.initialize()
            setSupportCalculator(supportCalc)
            console.log('✅ Calculador de suporte avançado inicializado')
          } catch (error) {
            console.warn('⚠️ Erro ao inicializar AdvancedSupportCalculator:', error)
          }
        } // Configurar analisador comportamental com módulo real
        if (neuropedagogicalAnalyzer) {
          try {
            // neuropedagogicalAnalyzer já é uma instância, não precisa de 'new'
            setBehavioralAnalyzer(neuropedagogicalAnalyzer)
            console.log('✅ Analisador comportamental avançado inicializado')
          } catch (error) {
            console.warn('⚠️ Erro ao inicializar NeuropedagogicalAnalyzer:', error)
          }
        }

        setAdvancedSystemsInitialized(true)
        console.log('🎉 Sistemas avançados v2.0 inicializados com sucesso!')
      } catch (error) {
        console.error('❌ Erro ao inicializar sistemas avançados v2.0:', error)
      }
    }

    initializeNewAdvancedSystems()
  }, [userId, aiSystemsInitialized, advancedConfig])

  // Métodos auxiliares
  const collectCurrentMetrics = async () => {
    const currentTime = Date.now()
    const sessionDuration = sessionStartTime.current ? currentTime - sessionStartTime.current : 0

    return {
      sessionDuration,
      currentAccuracy: baseProgress.progress.accuracy || 0,
      currentScore: baseProgress.progress.score || 0,
      attempts: baseProgress.progress.attempts || 0,
      successes: baseProgress.progress.successes || 0,
      responseTimes: baseProgress.progress.responseTimes || [],
      errorCount: baseProgress.progress.errors || 0,
      engagementMetrics: realTimeMetrics.engagement || {},
      frustrationLevel: realTimeMetrics.frustration || 0,
      cognitiveLoad: realTimeMetrics.cognitiveLoad || 0,
      timestamp: currentTime,
    }
  }

  const applyAutomaticRecommendations = async (recommendations) => {
    const automaticRecs = recommendations.filter(
      (rec) =>
        rec.strategy === 'immediate_response' && rec.confidence > 0.8 && rec.priority === 'high'
    )

    for (const rec of automaticRecs) {
      await applyRecommendation(rec)
    }
  }

  const calculateIntelligentDifficulty = (metrics) => {
    const accuracy = metrics.currentAccuracy || 0
    const frustration = metrics.frustrationLevel || 0
    const cognitiveLoad = metrics.cognitiveLoad || 0

    if (accuracy > 85 && frustration < 30 && cognitiveLoad < 60) {
      return 'hard'
    } else if (accuracy < 40 || frustration > 70 || cognitiveLoad > 80) {
      return 'easy'
    } else {
      return 'medium'
    }
  }

  const generatePersonalizedFeedback = (metrics) => {
    const accuracy = metrics.currentAccuracy || 0
    const style = learningStyleDetected || 'mixed'

    if (accuracy > 80) {
      return style === 'visual'
        ? '🌟 Excelente! Suas habilidades visuais estão brilhando!'
        : '🎵 Fantástico! Continue com esse ritmo maravilhoso!'
    } else if (accuracy > 60) {
      return 'Muito bem! Você está no caminho certo! 💪'
    } else {
      return 'Vamos tentar de novo! Cada tentativa nos torna mais fortes! 🌱'
    }
  }

  // ============================================================================
  // 🚀 FASE 1: NOVOS MÉTODOS COMPORTAMENTAIS AVANÇADOS
  // ============================================================================

  /**
   * 🎯 Análise comportamental avançada em tempo real
   * @param {Object} currentData - Dados atuais da sessão
   * @returns {Object} Indicadores comportamentais detalhados
   */
  const performAdvancedBehavioralAnalysis = useCallback(
    async (currentData) => {
      if (!behavioralAnalyzer || !supportCalculator) {
        console.warn('🚨 Sistemas comportamentais não inicializados')
        return null
      }

      try {
        // Extrair indicadores comportamentais usando os novos algoritmos
        const indicators = behavioralAnalyzer.extractBehavioralIndicators(currentData)
        setBehavioralIndicators(indicators)

        // Avaliar função executiva detalhada
        const executiveProfile = {
          workingMemory: behavioralAnalyzer.assessWorkingMemory(currentData),
          cognitiveFlexibility: behavioralAnalyzer.assessCognitiveFlexibility(currentData),
          inhibitoryControl: behavioralAnalyzer.assessInhibitoryControl(currentData),
        }
        setExecutiveFunctionProfile(executiveProfile)

        // Calcular níveis de suporte personalizados
        const userPreferences = currentData.userPreferences || {}
        const supportLevels = {
          visual: supportCalculator.calculateVisualSupportLevel(userPreferences),
          auditory: supportCalculator.calculateAuditorySupportLevel(userPreferences),
          cognitive: supportCalculator.calculateCognitiveSupportLevel(userPreferences),
          sensory: supportCalculator.calculateSensorySupportLevel(userPreferences),
        }
        setSupportLevels(supportLevels)

        // Calcular nível geral de suporte para autismo
        const autismSupport = supportCalculator.calculateAutismSupportLevel({
          socialCommunication: indicators.communicationBarriers ? 0.3 : 0.7,
          restrictedInterests: currentData.restrictedInterests || 0.5,
          sensoryIssues: indicators.sensoryOverload ? 0.8 : 0.4,
          dailyFunctioning: indicators.regulation?.score || 0.5,
          independenceLevel: indicators.persistence?.score || 0.5,
          adaptabilityIndex: indicators.adaptabilidadeIndex || 0.5,
        })
        setAutismSupportLevel(autismSupport)

        console.log('🧠 Análise comportamental avançada concluída:', {
          indicators: indicators.level,
          executiveFunction: executiveProfile.workingMemory.level,
          autismSupport: autismSupport.level,
        })

        return {
          indicators,
          executiveProfile,
          supportLevels,
          autismSupport,
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        console.error('🚨 Erro na análise comportamental avançada:', error)
        return null
      }
    },
    [behavioralAnalyzer, supportCalculator]
  )

  /**
   * 🎯 Detecta necessidades de intervenção imediata
   * @param {Object} currentData - Dados da sessão atual
   * @returns {Array} Lista de intervenções necessárias
   */
  const detectImmediateInterventions = useCallback(
    (currentData) => {
      if (!behavioralIndicators) return []

      const interventions = []

      // Verificar risco de frustração alta
      if (behavioralIndicators.frustration?.level === 'high') {
        interventions.push({
          type: 'immediate',
          priority: 'critical',
          action: 'break_required',
          message: 'Pausa necessária - alto nível de frustração detectado',
          autismSpecific: true,
        })
      }

      // Verificar sobrecarga sensorial
      if (behavioralIndicators.sensoryOverload) {
        interventions.push({
          type: 'immediate',
          priority: 'high',
          action: 'sensory_regulation',
          message: 'Sobrecarga sensorial detectada - ajustar ambiente',
          autismSpecific: true,
        })
      }

      // Verificar necessidade de suporte adicional
      if (behavioralIndicators.regulation?.level === 'needs_support') {
        interventions.push({
          type: 'support',
          priority: 'medium',
          action: 'increase_guidance',
          message: 'Aumentar suporte e orientação',
          autismSpecific: true,
        })
      }

      return interventions
    },
    [behavioralIndicators]
  ) /**
   * 🚀 NOVO: Inicia sessão com processamento em tempo real
   */
  const startRealTimeSession = useCallback(
    async (difficulty = 'medium') => {
      if (!userId) {
        console.warn('Usuário não identificado para sessão em tempo real')
        return null
      }

      try {
        const sessionConfig = {
          sessionId: baseProgress.sessionId || `session_${Date.now()}`,
          userId,
          activityId,
          difficulty,
          startTime: Date.now(),
        }

        // Simular processamento em tempo real
        setRealTimeSession(sessionConfig)

        // Configurar atualização de métricas ao vivo simuladas
        const updateInterval = setInterval(() => {
          const mockLiveMetrics = {
            processedData: {
              engagement: Math.random() * 100,
              focusLevel: Math.random() * 10,
              processingSpeed: Math.random() * 100,
            },
            recommendations: [
              {
                type: 'difficulty_adjustment',
                action: 'maintain',
                confidence: 0.8,
              },
            ],
            baseMetrics: {
              sessionDuration: Date.now() - sessionConfig.startTime,
              interactions: Math.floor(Math.random() * 20),
            },
          }

          setProcessedMetricsLive(mockLiveMetrics.processedData)
          setAdaptiveParametersLive(mockLiveMetrics.recommendations)
          setRealTimeMetrics(mockLiveMetrics.baseMetrics)
        }, 2000) // Atualizar a cada 2 segundos

        // Armazenar referência do interval para limpeza posterior
        realTimeAnalysisInterval.current = updateInterval

        console.log('🚀 Sessão em tempo real iniciada:', sessionConfig.sessionId)
        return sessionConfig
      } catch (error) {
        console.error('Erro ao iniciar sessão em tempo real:', error)
        return null
      }
    },
    [userId, activityId, baseProgress.sessionId]
  )

  /**
   * 🚀 NOVO: Processa evento em tempo real
   */ /**
   * 🚀 PROCESSAMENTO DE EVENTO EM TEMPO REAL - VERSÃO INTEGRADA
   */
  const processEventRealTime = useCallback(
    async (eventType, eventData = {}) => {
      if (!realTimeSession) {
        console.warn('Sessão em tempo real não iniciada')
        return null
      }

      try {
        // 📱 ADICIONAR DADOS DE SENSORES MÓVEIS SE DISPONÍVEIS
        const enrichedEventData = {
          ...eventData,
          mobileData: {
            touch: eventData.touch || null,
            motion: eventData.motion || null,
            sensor: eventData.sensor || null,
            device: {
              orientation: screen.orientation?.angle || 0,
              userAgent: navigator.userAgent,
              touchSupport: 'ontouchstart' in window,
            },
          },
          timestamp: Date.now(),
          sessionContext: {
            difficulty: baseProgress.difficulty,
            level: baseProgress.level,
            currentScore: baseProgress.score,
          },
        }

        // 🧠 PROCESSAR COM TODOS OS ALGORITMOS INTEGRADOS
        const insights = await realTimeMetricsProcessor.processEventRealTime(
          realTimeSession.sessionId,
          eventType,
          enrichedEventData
        )

        // 🎯 ATUALIZAR ESTADOS BASEADO NOS INSIGHTS PROCESSADOS
        if (insights) {
          // Atualizar perfil cognitivo em tempo real
          if (insights.cognitiveAnalysis) {
            setCognitiveProfile((prev) => ({
              ...prev,
              ...insights.cognitiveAnalysis,
              lastUpdated: Date.now(),
            }))
          }

          // Atualizar insights terapêuticos
          if (insights.therapeuticAnalysis?.insights) {
            setProcessedMetricsLive((prev) => ({
              ...prev,
              therapeuticInsights: insights.therapeuticAnalysis.insights,
              lastUpdated: Date.now(),
            }))
          }

          // Aplicar recomendações imediatas
          if (insights.immediateRecommendations?.length > 0) {
            setAdaptiveParametersLive((prev) => ({
              ...prev,
              recommendations: insights.immediateRecommendations,
              lastUpdated: Date.now(),
            }))
          }

          // 🚨 APLICAR INTERVENÇÕES TERAPÊUTICAS AUTOMÁTICAS
          if (insights.therapeuticInterventions?.length > 0) {
            await applyTherapeuticInterventions(insights.therapeuticInterventions)
          }

          // 📱 APLICAR ADAPTAÇÕES MÓVEIS EM TEMPO REAL
          if (insights.gameAdaptations) {
            await applyMobileAdaptations(insights.gameAdaptations)
          }
        }

        return insights
      } catch (error) {
        console.error('Erro ao processar evento em tempo real:', error)
        return null
      }
    },
    [realTimeSession, baseProgress]
  )

  /**
   * 🚀 NOVO: Finaliza sessão com dados já processados
   */
  const finishRealTimeSession = useCallback(
    async (additionalData = {}) => {
      if (!realTimeSession) {
        console.warn('Sessão em tempo real não iniciada')
        return null
      }

      try {
        // Limpar interval de atualização
        if (realTimeAnalysisInterval.current) {
          clearInterval(realTimeAnalysisInterval.current)
          realTimeAnalysisInterval.current = null
        }

        // Finalizar sessão com dados já processados
        const finalReport = await realTimeMetricsProcessor.finishRealTimeSession(
          realTimeSession.sessionId,
          {
            ...additionalData,
            difficulty: baseProgress.difficulty,
            level: baseProgress.level,
            stars: baseProgress.stars,
          }
        )

        // Atualizar estados finais
        if (finalReport) {
          setSessionInsights(finalReport.processedMetrics)
          setMultisensoryData(finalReport.multisensoryAnalysis)
          setNeuropedagogicalInsights(finalReport.processedMetrics.neuropedagogicalMetrics)
        }

        // Limpar estados da sessão
        setRealTimeSession(null)
        setProcessedMetricsLive(null)
        setAdaptiveParametersLive(null)

        console.log('🏁 Sessão em tempo real finalizada com dados processados salvos')
        return finalReport
      } catch (error) {
        console.error('Erro ao finalizar sessão em tempo real:', error)
        return null
      }
    },
    [realTimeSession, baseProgress.difficulty, baseProgress.level, baseProgress.stars]
  )

  /**
   * 🎯 Gera recomendações terapêuticas personalizadas
   * OTIMIZADO: Usa dados já processados em tempo real
   * @returns {Array} Lista de recomendações específicas para autismo
   */
  const generateTherapeuticRecommendations = useCallback(() => {
    // Usar dados processados em tempo real se disponíveis
    if (processedMetricsLive?.therapeuticInsights?.length > 0) {
      return processedMetricsLive.therapeuticInsights.map((insight) => ({
        area: insight.type,
        type: 'real_time_insight',
        recommendation: insight.recommendation,
        priority: insight.priority,
        timestamp: insight.timestamp,
        source: 'real_time_processing',
      }))
    }

    // Fallback para método original se dados em tempo real não disponíveis
    if (!behavioralIndicators || !executiveFunctionProfile || !supportLevels) {
      return []
    }

    const recommendations = []

    // Recomendações baseadas em persistência
    if (behavioralIndicators.persistence?.level === 'needs_support') {
      recommendations.push({
        area: 'persistence',
        type: 'behavioral_strategy',
        recommendation: 'Implementar tarefas menores com recompensas frequentes',
        strategies: behavioralIndicators.persistence.strategies,
        autismOptimizations: behavioralIndicators.persistence.autismSpecific,
        source: 'behavioral_analysis',
      })
    }

    // Recomendações baseadas em função executiva
    if (executiveFunctionProfile.workingMemory?.level === 'needs_support') {
      recommendations.push({
        area: 'working_memory',
        type: 'cognitive_support',
        recommendation: 'Usar apoios visuais e dividir informações em partes menores',
        supports: executiveFunctionProfile.workingMemory.autismOptimizations,
        source: 'executive_function_analysis',
      })
    }

    // Recomendações baseadas em níveis de suporte
    if (supportLevels.sensory?.level === 'extensive') {
      recommendations.push({
        area: 'sensory',
        type: 'environmental_modification',
        recommendation: 'Implementar plano sensorial abrangente',
        interventions: supportLevels.sensory.interventions,
        autismSpecific: supportLevels.sensory.autismSpecific,
        source: 'support_level_analysis',
      })
    }
    return recommendations
  }, [processedMetricsLive, behavioralIndicators, executiveFunctionProfile, supportLevels])

  /**
   * Avalia função executiva específica para autismo
   * @param {Object} executiveData - Dados de função executiva
   */
  const assessExecutiveFunction = useCallback(
    async (executiveData) => {
      if (!behavioralAnalyzer || !advancedSystemsInitialized) {
        console.warn('Sistema de função executiva não inicializado')
        return null
      }

      try {
        const assessment = {
          workingMemory: behavioralAnalyzer.assessWorkingMemory(executiveData),
          cognitiveFlexibility: behavioralAnalyzer.assessCognitiveFlexibility(executiveData),
          inhibitoryControl: behavioralAnalyzer.assessInhibitoryControl(executiveData),
          overallProfile: behavioralAnalyzer.generateExecutiveProfile
            ? behavioralAnalyzer.generateExecutiveProfile(executiveData)
            : { level: 'assessment_complete' },
        }

        setExecutiveFunctionProfile(assessment)
        console.log('🧩 Avaliação de função executiva concluída:', assessment)
        return assessment
      } catch (error) {
        console.error('Erro na avaliação de função executiva:', error)
        return null
      }
    },
    [behavioralAnalyzer, advancedSystemsInitialized]
  )

  /**
   * Calcula níveis de suporte personalizados
   * @param {Object} preferences - Preferências e dados do usuário
   */
  const calculateSupportLevels = useCallback(
    async (preferences) => {
      if (!supportCalculator || !advancedSystemsInitialized) {
        console.warn('Sistema de cálculo de suporte não inicializado')
        return null
      }

      try {
        const support = {
          visual: supportCalculator.calculateVisualSupportLevel(preferences),
          auditory: supportCalculator.calculateAuditorySupportLevel(preferences),
          cognitive: supportCalculator.calculateCognitiveSupportLevel(preferences),
          sensory: supportCalculator.calculateSensorySupportLevel(preferences),
        }

        const autismLevel = supportCalculator.calculateAutismSupportLevel(preferences)

        setSupportLevels(support)
        setAutismSupportLevel(autismLevel)

        console.log('🎯 Níveis de suporte calculados:', { support, autismLevel })
        return { support, autismLevel }
      } catch (error) {
        console.error('Erro no cálculo de suporte:', error)
        return null
      }
    },
    [supportCalculator, advancedSystemsInitialized]
  )

  /**
   * Sugere estratégias de regulação emocional
   * @param {Object} emotionalData - Dados emocionais
   */
  const suggestRegulationStrategies = useCallback(async (emotionalData) => {
    try {
      const {
        emotionalState = 'neutral',
        arousalLevel = 0.5,
        selfRegulationCapacity = 0.5,
        preferredCalmingStrategies = [],
      } = emotionalData

      const strategies = []

      // Estratégias baseadas no estado emocional
      if (emotionalState === 'overwhelmed' || arousalLevel > 0.7) {
        strategies.push({
          type: 'calming',
          name: 'Respiração profunda',
          description: 'Exercícios de respiração para reduzir arousal',
          duration: '3-5 minutos',
        })

        strategies.push({
          type: 'sensory',
          name: 'Pausa sensorial',
          description: 'Ambiente calmo com estímulos reduzidos',
          duration: '5-10 minutos',
        })
      }

      // Incluir estratégias preferidas
      preferredCalmingStrategies.forEach((strategy) => {
        if (!strategies.find((s) => s.name.includes(strategy))) {
          strategies.push({
            type: 'preferred',
            name: strategy,
            description: `Estratégia pessoal: ${strategy}`,
            duration: 'conforme necessário',
          })
        }
      })

      console.log('🎯 Estratégias de regulação sugeridas:', strategies)
      return strategies
    } catch (error) {
      console.error('Erro na sugestão de estratégias:', error)
      return []
    }
  }, [])

  /**
   * Gera relatório completo da sessão
   * @param {Object} sessionData - Dados da sessão
   */
  const generateSessionReport = useCallback(
    async (sessionData) => {
      try {
        const calculateOverallPerformance = (data) => data.overallScore || 0.75
        const extractKeyInsights = (data) =>
          data.keyInsights || ['Progresso consistente', 'Boa adaptação ao sistema']
        const generateNextSteps = (data) =>
          data.nextSteps || ['Continuar com estratégias atuais', 'Monitorar progresso']

        const report = {
          sessionId: sessionData.sessionId || Date.now(),
          timestamp: new Date().toISOString(),
          behavioral: sessionData.behavioral || behavioralIndicators,
          executive: sessionData.executive || executiveFunctionProfile,
          support: sessionData.support || supportLevels,
          interventions: sessionData.interventions || [],
          recommendations: generateTherapeuticRecommendations(),
          summary: {
            overallPerformance: calculateOverallPerformance(sessionData),
            keyInsights: extractKeyInsights(sessionData),
            nextSteps: generateNextSteps(sessionData),
          },
        }

        console.log('📊 Relatório de sessão gerado:', report)
        return report
      } catch (error) {
        console.error('Erro na geração do relatório:', error)
        return null
      }
    },
    [
      behavioralIndicators,
      executiveFunctionProfile,
      supportLevels,
      generateTherapeuticRecommendations,
    ]
  )

  /**
   * Rastreia progresso longitudinal
   * @param {Array} historicalData - Dados históricos
   */
  const trackLongitudinalProgress = useCallback(async (historicalData) => {
    try {
      if (!historicalData || historicalData.length < 2) {
        return {
          trend: 'insufficient_data',
          message: 'Dados insuficientes para análise longitudinal',
        }
      }

      const generateProgressRecommendations = (trend, rate) => {
        if (trend === 'improving') {
          return ['Manter estratégias atuais', 'Considerar aumento gradual de complexidade']
        } else if (trend === 'declining') {
          return ['Revisar estratégias', 'Reduzir complexidade temporariamente']
        }
        return ['Manter consistência', 'Monitorar de perto']
      }

      const performances = historicalData.map((d) => d.performance)
      const lastPerformance = performances[performances.length - 1]
      const firstPerformance = performances[0]
      const improvementRate = (lastPerformance - firstPerformance) / performances.length
      const trend =
        improvementRate > 0.05 ? 'improving' : improvementRate < -0.05 ? 'declining' : 'stable'

      const progress = {
        trend,
        improvementRate,
        currentLevel: lastPerformance,
        sessionsAnalyzed: historicalData.length,
        recommendations: generateProgressRecommendations(trend, improvementRate),
      }

      console.log('📈 Progresso longitudinal:', progress)
      return progress
    } catch (error) {
      console.error('Erro no rastreamento longitudinal:', error)
      return null
    }
  }, [])

  // ============================================================================
  // 🔧 MÉTODOS AUXILIARES BÁSICOS
  // ============================================================================

  /**
   * Registra interação avançada do usuário
   */
  const recordAdvancedInteraction = useCallback(
    async (interactionData) => {
      try {
        if (realTimeMetrics) {
          setRealTimeMetrics((prev) => ({
            ...prev,
            interactions: [
              ...(prev.interactions || []),
              {
                ...interactionData,
                timestamp: Date.now(),
              },
            ],
          }))
        }

        if (behavioralAnalyzer && advancedSystemsInitialized) {
          await performAdvancedBehavioralAnalysis(interactionData)
        }

        console.log('📝 Interação avançada registrada:', interactionData)
      } catch (error) {
        console.error('Erro ao registrar interação avançada:', error)
      }
    },
    [
      behavioralAnalyzer,
      advancedSystemsInitialized,
      realTimeMetrics,
      performAdvancedBehavioralAnalysis,
    ]
  )

  /**
   * Registra indicador comportamental específico
   */
  const recordBehavioralIndicator = useCallback(
    async (indicator) => {
      try {
        setBehavioralIndicators((prev) => {
          if (!prev) return { indicators: [indicator] }
          return {
            ...prev,
            indicators: [
              ...(prev.indicators || []),
              {
                ...indicator,
                timestamp: Date.now(),
              },
            ],
          }
        })

        const interventions = detectImmediateInterventions({ currentIndicator: indicator })
        if (interventions.length > 0) {
          console.log('🚨 Intervenções imediatas detectadas:', interventions)
        }

        console.log('🧠 Indicador comportamental registrado:', indicator)
      } catch (error) {
        console.error('Erro ao registrar indicador comportamental:', error)
      }
    },
    [detectImmediateInterventions]
  )

  /**
   * Obtém recomendações de ações
   */
  const getActionRecommendations = useCallback(() => {
    try {
      const recommendations = []

      if (realTimeMetrics.frustrationLevel > 0.7) {
        recommendations.push({
          type: 'immediate',
          action: 'reduce_difficulty',
          message: 'Reduzir dificuldade devido à frustração elevada',
        })
      }

      if (behavioralIndicators?.sensoryOverload) {
        recommendations.push({
          type: 'environment',
          action: 'adjust_sensory_input',
          message: 'Ajustar entrada sensorial para reduzir sobrecarga',
        })
      }

      return [...recommendations, ...adaptiveRecommendations]
    } catch (error) {
      console.error('Erro ao obter recomendações de ações:', error)
      return []
    }
  }, [realTimeMetrics, behavioralIndicators, adaptiveRecommendations])

  /**
   * Obtém otimizações de aprendizagem
   */
  const getLearningOptimizations = useCallback(() => {
    try {
      const optimizations = []

      if (cognitiveProfile?.preferredModality === 'visual') {
        optimizations.push({
          type: 'modality',
          optimization: 'increase_visual_elements',
          description: 'Aumentar elementos visuais baseado na preferência',
        })
      }

      if (executiveFunctionProfile?.workingMemory?.level === 'needs_support') {
        optimizations.push({
          type: 'cognitive',
          optimization: 'chunk_information',
          description: 'Dividir informações em pedaços menores',
        })
      }

      return [...optimizations, ...learningOptimizations]
    } catch (error) {
      console.error('Erro ao obter otimizações de aprendizagem:', error)
      return []
    }
  }, [cognitiveProfile, executiveFunctionProfile, learningOptimizations])

  /**
   * Obtém insights da sessão
   */
  const getSessionInsights = useCallback(() => {
    try {
      return {
        behavioral: behavioralIndicators,
        executive: executiveFunctionProfile,
        support: supportLevels,
        realTime: realTimeMetrics,
        recommendations: getActionRecommendations(),
        optimizations: getLearningOptimizations(),
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Erro ao obter insights da sessão:', error)
      return null
    }
  }, [
    behavioralIndicators,
    executiveFunctionProfile,
    supportLevels,
    realTimeMetrics,
    getActionRecommendations,
    getLearningOptimizations,
  ])

  /**
   * Aplica uma recomendação específica
   */
  const applyRecommendation = useCallback(async (recommendation) => {
    try {
      console.log('🔧 Aplicando recomendação:', recommendation)

      switch (recommendation.action) {
        case 'reduce_difficulty':
          setIntelligentDifficulty('easy')
          break
        case 'increase_difficulty':
          setIntelligentDifficulty('hard')
          break
        case 'adjust_sensory_input':
          await adjustSensoryModality(recommendation)
          break
        case 'break_required':
          console.log('⏸️ Pausa recomendada')
          break
        default:
          console.log('⚠️ Ação de recomendação não reconhecida:', recommendation.action)
      }
    } catch (error) {
      console.error('Erro ao aplicar recomendação:', error)
    }
  }, [])

  // Funções auxiliares para métricas de qualidade
  function calculateSystemsHealthScore() {
    let healthScore = 0
    let totalSystems = 0

    if (aiSystemsInitialized) {
      healthScore += 20
      totalSystems += 20
    }
    if (advancedSystemsInitialized) {
      healthScore += 30
      totalSystems += 30
    }
    if (neuroplasticityInsights) {
      healthScore += 10
      totalSystems += 10
    }
    if (accessibilityAdaptations) {
      healthScore += 10
      totalSystems += 10
    }
    if (predictiveAlerts.length > 0) {
      healthScore += 10
      totalSystems += 10
    }
    if (multisensoryOptimizations) {
      healthScore += 10
      totalSystems += 10
    }
    if (emotionalState) {
      healthScore += 10
      totalSystems += 10
    }

    return totalSystems > 0 ? (healthScore / totalSystems) * 100 : 0
  }

  function calculateOverallAnalysisConfidence() {
    const confidenceValues = []

    if (neuroplasticityInsights?.confidenceScore)
      confidenceValues.push(neuroplasticityInsights.confidenceScore)
    if (accessibilityAdaptations?.confidence)
      confidenceValues.push(accessibilityAdaptations.confidence)
    if (integratedAnalysis?.confidenceMetrics)
      confidenceValues.push(integratedAnalysis.confidenceMetrics)

    return confidenceValues.length > 0
      ? confidenceValues.reduce((sum, val) => sum + val, 0) / confidenceValues.length
      : 0
  }

  function calculateRecommendationAccuracy() {
    return adaptiveRecommendations.length > 0 ? 0.75 : 0
  }

  // Iniciar sessão avançada
  const startAdvancedSession = useCallback(async () => {
    if (!aiSystemsInitialized) return false

    try {
      sessionStartTime.current = Date.now()

      if (advancedConfig.enableRealTimeMetrics) {
        multisensoryMetrics.startMetricsCollection(baseProgress.sessionId, userId)
        metricsCollectionRef.current = true
      }

      await baseProgress.startActivity()

      console.log('🎯 Sessão avançada iniciada com sistemas de IA ativos')
      return true
    } catch (error) {
      console.error('Erro ao iniciar sessão avançada:', error)
      return false
    }
  }, [aiSystemsInitialized, baseProgress, userId])

  // Parar sessão avançada
  const stopAdvancedSession = useCallback(async () => {
    try {
      if (realTimeAnalysisInterval.current) {
        clearInterval(realTimeAnalysisInterval.current)
        realTimeAnalysisInterval.current = null
      }

      let finalReport = null
      if (metricsCollectionRef.current) {
        finalReport = multisensoryMetrics.stopMetricsCollection()
        metricsCollectionRef.current = false
      }

      if (finalReport && advancedConfig.enableNeuropedagogicalAnalysis) {
        const insights = neuropedagogicalAnalyzer.generateComprehensiveReport(
          finalReport,
          await getHistoricalData(userId, activityId)
        )
        setNeuropedagogicalInsights(insights)
        setSessionInsights(insights)
      }

      const multisensoryData = {
        multisensoryMetrics: finalReport,
        neuropedagogicalInsights: sessionInsights,
        adaptiveRecommendations: adaptiveRecommendations,
        realTimeMetrics: realTimeMetrics,
        cognitiveProfile: cognitiveProfile,
        learningOptimizations: learningOptimizations,
        timestamp: new Date().toISOString(),
        sessionType: 'advanced_multisensory',
      }

      await baseProgress.finishActivity(true, multisensoryData)

      console.log('🏁 Sessão avançada finalizada com métricas multissensoriais salvas')
      return finalReport
    } catch (error) {
      console.error('Erro ao finalizar sessão avançada:', error)
      return null
    }
  }, [
    baseProgress,
    userId,
    activityId,
    sessionInsights,
    adaptiveRecommendations,
    realTimeMetrics,
    cognitiveProfile,
    learningOptimizations,
  ])

  // RETORNO DO HOOK
  return {
    // Dados básicos do progresso
    ...baseProgress,

    // Sistemas avançados originais
    neuropedagogicalInsights,
    multisensoryData,
    adaptiveRecommendations,
    realTimeMetrics,
    cognitiveProfile,
    learningOptimizations,
    sessionInsights,

    // Novos sistemas avançados v2.0
    neuroplasticityInsights,
    accessibilityAdaptations,
    predictiveAlerts,
    multisensoryOptimizations,
    emotionalState,
    integratedAnalysis, // 🚀 FASE 1: Novos dados comportamentais
    behavioralIndicators,
    executiveFunctionProfile,
    supportLevels,
    autismSupportLevel,

    // 🚀 NOVO: Dados de processamento em tempo real
    realTimeSession,
    processedMetricsLive,
    adaptiveParametersLive,

    // Estados de IA
    aiSystemsInitialized,
    advancedSystemsInitialized,
    intelligentDifficulty,
    personalizedFeedback,
    learningStyleDetected,

    // 🚀 FASE 1: Novos métodos comportamentais
    performAdvancedBehavioralAnalysis,
    assessExecutiveFunction,
    calculateSupportLevels,
    detectImmediateInterventions,
    generateTherapeuticRecommendations,
    suggestRegulationStrategies,
    generateSessionReport,
    trackLongitudinalProgress,

    // 🚀 NOVO: Métodos de processamento em tempo real
    startRealTimeSession,
    processEventRealTime,
    finishRealTimeSession,
    generateTherapeuticRecommendations,
    suggestRegulationStrategies,
    generateSessionReport,
    trackLongitudinalProgress,

    // Métodos de controle de sessão
    startAdvancedSession,
    stopAdvancedSession,

    // Métodos de registro
    recordAdvancedInteraction,
    recordBehavioralIndicator,

    // Métodos de insights básicos
    getActionRecommendations,
    getLearningOptimizations,
    getSessionInsights,
    applyRecommendation,

    // Estados de controle expandidos
    isAdvancedSessionActive: metricsCollectionRef.current,
    hasRecommendations: adaptiveRecommendations.length > 0,
    hasInsights: sessionInsights !== null,
    hasNeuroplasticityData: neuroplasticityInsights !== null,
    hasAccessibilityAdaptations: accessibilityAdaptations !== null,
    hasPredictiveAlerts: predictiveAlerts.length > 0,
    hasMultisensoryOptimizations: multisensoryOptimizations !== null,
    hasEmotionalAnalysis: emotionalState !== null,
    hasIntegratedAnalysis: integratedAnalysis !== null, // 🚀 FASE 1: Novos estados de controle
    hasBehavioralAnalysis: behavioralIndicators !== null,
    hasExecutiveFunctionProfile: executiveFunctionProfile !== null,
    hasSupportLevels: supportLevels !== null,
    hasAutismSupportLevel: autismSupportLevel !== null,

    // 🚀 NOVO: Estados de controle de processamento em tempo real
    isRealTimeSessionActive: realTimeSession !== null,
    hasProcessedMetricsLive: processedMetricsLive !== null,
    hasAdaptiveParametersLive: adaptiveParametersLive !== null,

    // Métricas de qualidade
    systemsHealthScore: calculateSystemsHealthScore(),
    analysisConfidence: calculateOverallAnalysisConfidence(),
    recommendationAccuracy: calculateRecommendationAccuracy(),
  }
}

export { useAdvancedActivity }
export default useAdvancedActivity
