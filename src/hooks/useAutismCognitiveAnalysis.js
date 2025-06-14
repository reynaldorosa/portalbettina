/**
 * @file useAutismCognitiveAnalysis.js
 * @description Hook de integração para análise cognitiva específica para autismo
 * Conecta o AutismCognitiveAnalyzer com os hooks existentes do sistema
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useUser } from '../contexts/UserContext'
import useProgress from './useProgress'
import autismCognitiveAnalyzer from '../utils/autismCognitiveAnalyzer.js'

/**
 * Hook integrado para análise cognitiva de autismo
 * @param {string} activityId - ID da atividade
 * @param {Object} options - Opções de configuração
 * @returns {Object} Interface completa de análise cognitiva para autismo
 */
export const useAutismCognitiveAnalysis = (activityId, options = {}) => {
  const {
    enableRealTimeAnalysis = true,
    enableAdaptations = true,
    enableTherapyOptimizations = true,
    autoInitialize = true,
    ...customOptions
  } = options

  // Estados da análise
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentAdaptations, setCurrentAdaptations] = useState(null)
  const [therapyOptimizations, setTherapyOptimizations] = useState(null)
  const [cognitiveLevel, setCognitiveLevel] = useState(null)
  const [communicationLevel, setCommunicationLevel] = useState(null)
  const [sensoryProfile, setSensoryProfile] = useState(null)
  const [executiveFunction, setExecutiveFunction] = useState(null)
  const [behavioralProfile, setBehavioralProfile] = useState(null)
  const [supportLevel, setSupportLevel] = useState(null)
  const [analysisHistory, setAnalysisHistory] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Hooks externos
  const { userId, userDetails } = useUser()
  const progress = useProgress(activityId)

  // Refs para controle
  const sessionDataRef = useRef({})
  const lastAnalysisRef = useRef(null)
  const analysisIntervalRef = useRef(null)

  // Inicialização do analisador
  const initializeAnalyzer = useCallback(async () => {
    if (!userId || isInitialized) return false

    try {
      await autismCognitiveAnalyzer.initialize()
      setIsInitialized(true)
      console.log('🧩 Hook de análise cognitiva para autismo inicializado')
      return true
    } catch (error) {
      console.error('Erro ao inicializar análise cognitiva para autismo:', error)
      return false
    }
  }, [userId, isInitialized])

  // Coletar dados da sessão atual
  const collectSessionData = useCallback(() => {
    const baseData = {
      activityId,
      userId,
      timestamp: new Date().toISOString(),

      // Dados do progresso
      accuracy: progress.progress?.accuracy || 0,
      attempts: progress.progress?.attempts || 0,
      successes: progress.progress?.successes || 0,
      errors: progress.progress?.errors || 0,
      timeSpent: progress.progress?.timeSpent || 0,

      // Dados do usuário
      userAge: userDetails?.age || 0,
      userProfile: userDetails?.profile || {},

      // Métricas comportamentais estimadas baseadas no desempenho
      responseLatency: progress.progress?.responseLatency || [],
      interactionPatterns: progress.progress?.interactionPatterns || {},
      engagementLevel: progress.progress?.engagementLevel || 0.5,
      frustrationIndicators: progress.progress?.frustrationIndicators || 0,

      ...customOptions,
    }

    // Enriquecer dados com estimativas cognitivas
    const enrichedData = {
      ...baseData,

      // Estimativas de comunicação social baseadas no desempenho
      eyeContactFrequency: baseData.engagementLevel || 0.5,
      socialReciprocity: Math.min(baseData.accuracy / 100, 1) || 0.5,
      nonVerbalCommunication: baseData.engagementLevel || 0.5,

      // Estimativas sensoriais baseadas na atividade
      visualProcessingSpeed: baseData.accuracy > 70 ? 0.7 : 0.5,
      auditoryProcessingSpeed: baseData.accuracy > 70 ? 0.7 : 0.5,
      tactileProcessingSpeed: 0.5,

      // Estimativas de função executiva baseadas no erro
      planningSkills: baseData.errors < 3 ? 0.7 : 0.4,
      cognitiveFlexibility:
        baseData.attempts > 0 ? Math.max(0.2, 1 - baseData.errors / baseData.attempts) : 0.5,
      inhibitoryControl: baseData.errors < 2 ? 0.8 : 0.4,

      // Estimativas de interesse baseadas no tempo
      interestIntensity: baseData.timeSpent > 300000 ? 0.8 : 0.5, // > 5 min
      fixationLevel: baseData.timeSpent > 600000 ? 0.7 : 0.3, // > 10 min

      // Estimativas de comportamentos repetitivos
      repetitiveBehaviorFrequency: baseData.frustrationIndicators || 0.2,
      repetitiveBehaviorIntensity: baseData.frustrationIndicators || 0.2,
    }

    sessionDataRef.current = enrichedData
    return enrichedData
  }, [activityId, userId, userDetails, progress.progress, customOptions])

  // Executar análise completa
  const executeFullAnalysis = useCallback(async () => {
    if (!isInitialized || !userId) return null

    try {
      setIsAnalyzing(true)
      const sessionData = collectSessionData()
      const userProfile = userDetails?.profile || {}

      // Calcular adaptações para autismo
      const adaptations = autismCognitiveAnalyzer.calculateAutismAdaptations(
        userId,
        sessionData,
        userProfile
      )

      if (adaptations) {
        setCurrentAdaptations(adaptations)
        setCognitiveLevel(adaptations.autismCharacteristics)
        setCommunicationLevel(adaptations.communicationLevel)
        setSensoryProfile(adaptations.sensoryProfile)
        setExecutiveFunction(adaptations.executiveFunction)
        setSupportLevel(adaptations.supportLevel)
      }

      // Gerar otimizações terapêuticas
      const therapyGoals = userProfile.therapyGoals || {}
      const optimizations = autismCognitiveAnalyzer.generateTherapyOptimizations(
        userId,
        sessionData,
        therapyGoals
      )

      if (optimizations) {
        setTherapyOptimizations(optimizations)
      }

      // Avaliar níveis específicos
      const cogLevel = autismCognitiveAnalyzer.assessCognitiveLevel(sessionData, userProfile)
      const commLevel = autismCognitiveAnalyzer.assessCommunicationLevel(sessionData, userProfile)
      const sensProfile = autismCognitiveAnalyzer.assessSensoryProcessing(sessionData, userProfile)
      const execFunction = autismCognitiveAnalyzer.assessExecutiveFunction(sessionData, userProfile)

      setCognitiveLevel(cogLevel)
      setCommunicationLevel(commLevel)
      setSensoryProfile(sensProfile)
      setExecutiveFunction(execFunction)

      // Criar perfis especializados
      const behavProfile = autismCognitiveAnalyzer.createBehavioralProfile(sessionData, userProfile)
      setBehavioralProfile(behavProfile)

      // Calcular nível de suporte
      const supportLvl = autismCognitiveAnalyzer.calculateSupportLevel(
        adaptations?.autismCharacteristics,
        sensProfile,
        commLevel
      )
      setSupportLevel(supportLvl)

      // Adicionar ao histórico
      const analysisResult = {
        timestamp: new Date().toISOString(),
        adaptations,
        optimizations,
        cognitiveLevel: cogLevel,
        communicationLevel: commLevel,
        sensoryProfile: sensProfile,
        executiveFunction: execFunction,
        behavioralProfile: behavProfile,
        supportLevel: supportLvl,
      }

      setAnalysisHistory((prev) => [...prev.slice(-19), analysisResult]) // Manter últimas 20
      lastAnalysisRef.current = analysisResult

      console.log('🧩 Análise cognitiva para autismo executada:', analysisResult)
      return analysisResult
    } catch (error) {
      console.error('Erro na análise cognitiva para autismo:', error)
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }, [isInitialized, userId, userDetails, collectSessionData])

  // Análise em tempo real
  const startRealTimeAnalysis = useCallback(() => {
    if (!enableRealTimeAnalysis || analysisIntervalRef.current) return

    analysisIntervalRef.current = setInterval(async () => {
      await executeFullAnalysis()
    }, 30000) // A cada 30 segundos

    console.log('🧩 Análise em tempo real iniciada para autismo')
  }, [enableRealTimeAnalysis, executeFullAnalysis])

  const stopRealTimeAnalysis = useCallback(() => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current)
      analysisIntervalRef.current = null
      console.log('🧩 Análise em tempo real parada para autismo')
    }
  }, [])

  // Obter recomendações específicas
  const getAdaptationRecommendations = useCallback(
    (domain = 'all') => {
      if (!currentAdaptations) return []

      const recommendations = []

      if (domain === 'all' || domain === 'sensory') {
        recommendations.push(...(currentAdaptations.sensoryAdaptations || []))
      }

      if (domain === 'all' || domain === 'communication') {
        recommendations.push(...(currentAdaptations.communicationAdaptations || []))
      }

      if (domain === 'all' || domain === 'cognitive') {
        recommendations.push(...(currentAdaptations.cognitiveAdaptations || []))
      }

      if (domain === 'all' || domain === 'environmental') {
        recommendations.push(...(currentAdaptations.environmentalAdaptations || []))
      }

      return recommendations
    },
    [currentAdaptations]
  )

  const getTherapyRecommendations = useCallback(() => {
    if (!therapyOptimizations) return []

    return [
      ...(therapyOptimizations.behavioralInterventions || []),
      ...(therapyOptimizations.activityOptimizations || []),
      ...(therapyOptimizations.interventionPlan?.strategies || []),
    ]
  }, [therapyOptimizations])

  // Obter insights consolidados
  const getInsights = useCallback(() => {
    return {
      currentAdaptations,
      therapyOptimizations,
      cognitiveLevel,
      communicationLevel,
      sensoryProfile,
      executiveFunction,
      behavioralProfile,
      supportLevel,
      lastAnalysis: lastAnalysisRef.current,
      analysisHistory: analysisHistory.slice(-5), // Últimas 5
      recommendations: {
        adaptations: getAdaptationRecommendations(),
        therapy: getTherapyRecommendations(),
      },
    }
  }, [
    currentAdaptations,
    therapyOptimizations,
    cognitiveLevel,
    communicationLevel,
    sensoryProfile,
    executiveFunction,
    behavioralProfile,
    supportLevel,
    analysisHistory,
    getAdaptationRecommendations,
    getTherapyRecommendations,
  ])

  // Efeitos de inicialização
  useEffect(() => {
    if (autoInitialize && userId && !isInitialized) {
      initializeAnalyzer()
    }
  }, [autoInitialize, userId, isInitialized, initializeAnalyzer])

  useEffect(() => {
    if (isInitialized && enableRealTimeAnalysis) {
      startRealTimeAnalysis()
      return stopRealTimeAnalysis
    }
  }, [isInitialized, enableRealTimeAnalysis, startRealTimeAnalysis, stopRealTimeAnalysis])

  // Limpeza na desmontagem
  useEffect(() => {
    return () => {
      stopRealTimeAnalysis()
    }
  }, [stopRealTimeAnalysis])

  // Interface do hook
  return {
    // Estados
    isInitialized,
    isAnalyzing,
    currentAdaptations,
    therapyOptimizations,
    cognitiveLevel,
    communicationLevel,
    sensoryProfile,
    executiveFunction,
    behavioralProfile,
    supportLevel,
    analysisHistory,

    // Métodos principais
    initializeAnalyzer,
    executeFullAnalysis,
    startRealTimeAnalysis,
    stopRealTimeAnalysis,

    // Métodos de consulta
    getAdaptationRecommendations,
    getTherapyRecommendations,
    getInsights,
    collectSessionData,

    // Dados calculados
    hasAnalysis: currentAdaptations !== null,
    hasTherapyOptimizations: therapyOptimizations !== null,
    analysisCount: analysisHistory.length,
    lastAnalysisTime: lastAnalysisRef.current?.timestamp,

    // Acesso direto ao analisador
    analyzer: autismCognitiveAnalyzer,
  }
}

export default useAutismCognitiveAnalysis
