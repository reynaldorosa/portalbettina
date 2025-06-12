/**
 * @file CognitiveAssessmentModel.js
 * @description Modelo de avaliação cognitiva para análise de habilidades
 */

export class CognitiveAssessmentModel {
  constructor() {
    this.cognitiveProfile = {
      attention: {
        sustained: 0.5,
        selective: 0.5,
        divided: 0.5,
        executive: 0.5,
      },
      memory: {
        working: 0.5,
        shortTerm: 0.5,
        longTerm: 0.5,
        episodic: 0.5,
      },
      processing: {
        speed: 0.5,
        accuracy: 0.5,
        flexibility: 0.5,
        inhibition: 0.5,
      },
      language: {
        comprehension: 0.5,
        expression: 0.5,
        vocabulary: 0.5,
        pragmatics: 0.5,
      },
      executive: {
        planning: 0.5,
        organization: 0.5,
        reasoning: 0.5,
        problemSolving: 0.5,
      },
    }

    this.assessmentHistory = []
    this.developmentTrends = {}
    this.isInitialized = false
    this.confidence = 0.0
  }

  /**
   * Inicializa o modelo
   */
  async initialize() {
    try {
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Erro ao inicializar CognitiveAssessmentModel:', error)
      return false
    }
  }

  /**
   * Avalia habilidades cognitivas baseado em dados de performance
   * @param {Object} performanceData - Dados de performance
   */
  assess(performanceData) {
    if (!this.isInitialized) {
      this.initialize()
    }

    try {
      const assessment = {
        timestamp: Date.now(),
        cognitive: this.assessCognitiveDomains(performanceData),
        strengths: [],
        challenges: [],
        recommendations: [],
        confidence: this.calculateConfidence(performanceData),
      }

      // Identifica pontos fortes e desafios
      assessment.strengths = this.identifyStrengths(assessment.cognitive)
      assessment.challenges = this.identifyChallenges(assessment.cognitive)

      // Gera recomendações
      assessment.recommendations = this.generateCognitiveRecommendations(assessment)

      // Registra avaliação
      this.assessmentHistory.push(assessment)

      // Mantém apenas os últimos 50 registros
      if (this.assessmentHistory.length > 50) {
        this.assessmentHistory.shift()
      }

      // Atualiza perfil cognitivo
      this.updateCognitiveProfile(assessment.cognitive)

      // Calcula tendências de desenvolvimento
      this.updateDevelopmentTrends()

      return assessment
    } catch (error) {
      console.error('Erro na avaliação cognitiva:', error)
      return null
    }
  }

  /**
   * Avalia domínios cognitivos específicos
   * @param {Object} data - Dados de performance
   */
  assessCognitiveDomains(data) {
    return {
      attention: this.assessAttention(data),
      memory: this.assessMemory(data),
      processing: this.assessProcessing(data),
      language: this.assessLanguage(data),
      executive: this.assessExecutive(data),
    }
  }

  /**
   * Avalia funções atencionais
   * @param {Object} data - Dados de performance
   */
  assessAttention(data) {
    const attention = {}

    // Atenção sustentada - capacidade de manter foco
    if (data.sessionDuration && data.engagementRate) {
      attention.sustained = Math.min(
        (data.sessionDuration / 1800000) * data.engagementRate, // 30 min ideal
        1.0
      )
    }

    // Atenção seletiva - capacidade de filtrar distrações
    if (data.distractorResistance) {
      attention.selective = data.distractorResistance
    }

    // Atenção dividida - multitasking
    if (data.multitaskingPerformance) {
      attention.divided = data.multitaskingPerformance
    }

    // Controle executivo da atenção
    if (data.attentionControl) {
      attention.executive = data.attentionControl
    }

    return attention
  }

  /**
   * Avalia funções de memória
   * @param {Object} data - Dados de performance
   */
  assessMemory(data) {
    const memory = {}

    // Memória de trabalho
    if (data.workingMemoryTasks) {
      memory.working = data.workingMemoryTasks.averageScore || 0.5
    }

    // Memória de curto prazo
    if (data.shortTermRecall) {
      memory.shortTerm = data.shortTermRecall
    }

    // Memória de longo prazo
    if (data.longTermRetention) {
      memory.longTerm = data.longTermRetention
    }

    // Memória episódica
    if (data.episodicMemory) {
      memory.episodic = data.episodicMemory
    }

    return memory
  }

  /**
   * Avalia velocidade e qualidade de processamento
   * @param {Object} data - Dados de performance
   */
  assessProcessing(data) {
    const processing = {}

    // Velocidade de processamento
    if (data.responseTime) {
      // Tempo menor = melhor velocidade
      processing.speed = Math.max(0, 1 - data.responseTime.average / 5000)
    }

    // Precisão de processamento
    if (data.accuracy) {
      processing.accuracy = data.accuracy
    }

    // Flexibilidade cognitiva
    if (data.taskSwitching) {
      processing.flexibility = data.taskSwitching.efficiency || 0.5
    }

    // Controle inibitório
    if (data.inhibitionControl) {
      processing.inhibition = data.inhibitionControl
    }

    return processing
  }

  /**
   * Avalia habilidades linguísticas
   * @param {Object} data - Dados de performance
   */
  assessLanguage(data) {
    const language = {}

    // Compreensão
    if (data.comprehensionTasks) {
      language.comprehension = data.comprehensionTasks.averageScore || 0.5
    }

    // Expressão
    if (data.expressionTasks) {
      language.expression = data.expressionTasks.averageScore || 0.5
    }

    // Vocabulário
    if (data.vocabularyTasks) {
      language.vocabulary = data.vocabularyTasks.averageScore || 0.5
    }

    // Pragmática (uso social da linguagem)
    if (data.pragmaticUse) {
      language.pragmatics = data.pragmaticUse
    }

    return language
  }

  /**
   * Avalia funções executivas
   * @param {Object} data - Dados de performance
   */
  assessExecutive(data) {
    const executive = {}

    // Planejamento
    if (data.planningTasks) {
      executive.planning = data.planningTasks.averageScore || 0.5
    }

    // Organização
    if (data.organizationSkills) {
      executive.organization = data.organizationSkills
    }

    // Raciocínio
    if (data.reasoningTasks) {
      executive.reasoning = data.reasoningTasks.averageScore || 0.5
    }

    // Resolução de problemas
    if (data.problemSolving) {
      executive.problemSolving = data.problemSolving.efficiency || 0.5
    }

    return executive
  }

  /**
   * Calcula confiança da avaliação
   * @param {Object} data - Dados de performance
   */
  calculateConfidence(data) {
    const factors = []

    // Quantidade de dados
    if (data.sampleSize) {
      factors.push(Math.min(data.sampleSize / 100, 1.0))
    }

    // Consistência dos dados
    if (data.consistency) {
      factors.push(data.consistency)
    }

    // Duração da observação
    if (data.observationDuration) {
      factors.push(Math.min(data.observationDuration / 3600000, 1.0)) // 1 hora
    }

    return factors.length > 0 ? factors.reduce((a, b) => a + b) / factors.length : 0.5
  }

  /**
   * Identifica pontos fortes cognitivos
   * @param {Object} cognitive - Perfil cognitivo
   */
  identifyStrengths(cognitive) {
    const strengths = []
    const threshold = 0.75

    Object.entries(cognitive).forEach(([domain, skills]) => {
      Object.entries(skills).forEach(([skill, score]) => {
        if (score > threshold) {
          strengths.push({
            domain,
            skill,
            score,
            description: this.getSkillDescription(domain, skill, 'strength'),
          })
        }
      })
    })

    return strengths.sort((a, b) => b.score - a.score)
  }

  /**
   * Identifica desafios cognitivos
   * @param {Object} cognitive - Perfil cognitivo
   */
  identifyChallenges(cognitive) {
    const challenges = []
    const threshold = 0.4

    Object.entries(cognitive).forEach(([domain, skills]) => {
      Object.entries(skills).forEach(([skill, score]) => {
        if (score < threshold) {
          challenges.push({
            domain,
            skill,
            score,
            severity: score < 0.25 ? 'high' : 'medium',
            description: this.getSkillDescription(domain, skill, 'challenge'),
          })
        }
      })
    })

    return challenges.sort((a, b) => a.score - b.score)
  }

  /**
   * Obtém descrição de habilidade
   * @param {string} domain - Domínio cognitivo
   * @param {string} skill - Habilidade específica
   * @param {string} type - Tipo (strength/challenge)
   */
  getSkillDescription(domain, skill, type) {
    const descriptions = {
      attention: {
        sustained: {
          strength: 'Excelente capacidade de manter foco por períodos prolongados',
          challenge: 'Dificuldade em manter atenção sustentada',
        },
        selective: {
          strength: 'Boa habilidade para filtrar distrações',
          challenge: 'Suscetível a distrações do ambiente',
        },
      },
      memory: {
        working: {
          strength: 'Forte memória de trabalho para manipular informações',
          challenge: 'Limitações na memória de trabalho',
        },
      },
      // Adicionar mais descrições conforme necessário
    }

    return (
      descriptions[domain]?.[skill]?.[type] ||
      `${type === 'strength' ? 'Ponto forte' : 'Área de desenvolvimento'} em ${skill}`
    )
  }

  /**
   * Gera recomendações cognitivas
   * @param {Object} assessment - Avaliação atual
   */
  generateCognitiveRecommendations(assessment) {
    const recommendations = []

    // Recomendações baseadas em desafios
    assessment.challenges.forEach((challenge) => {
      const rec = this.getChallengeRecommendation(challenge)
      if (rec) recommendations.push(rec)
    })

    // Recomendações para fortalecer pontos fortes
    assessment.strengths.slice(0, 2).forEach((strength) => {
      const rec = this.getStrengthRecommendation(strength)
      if (rec) recommendations.push(rec)
    })

    return recommendations
  }

  /**
   * Obtém recomendação para desafio
   * @param {Object} challenge - Desafio identificado
   */
  getChallengeRecommendation(challenge) {
    const recommendations = {
      attention: {
        sustained: {
          intervention: 'Exercícios de atenção gradual',
          strategy: 'Aumentar duração das atividades progressivamente',
        },
      },
      memory: {
        working: {
          intervention: 'Jogos de memória de trabalho',
          strategy: 'Usar estratégias de chunking e repetição',
        },
      },
    }

    const rec = recommendations[challenge.domain]?.[challenge.skill]

    return rec
      ? {
          type: 'intervention',
          priority: challenge.severity === 'high' ? 'high' : 'medium',
          target: `${challenge.domain}.${challenge.skill}`,
          intervention: rec.intervention,
          strategy: rec.strategy,
        }
      : null
  }

  /**
   * Obtém recomendação para ponto forte
   * @param {Object} strength - Ponto forte identificado
   */
  getStrengthRecommendation(strength) {
    return {
      type: 'enhancement',
      priority: 'low',
      target: `${strength.domain}.${strength.skill}`,
      strategy: `Usar ${strength.skill} como ponte para desenvolver outras habilidades`,
      approach: 'strength_based',
    }
  }

  /**
   * Atualiza perfil cognitivo com dados da avaliação
   * @param {Object} newCognitive - Novos dados cognitivos
   */
  updateCognitiveProfile(newCognitive) {
    const alpha = 0.15 // Taxa de aprendizado

    Object.entries(newCognitive).forEach(([domain, skills]) => {
      Object.entries(skills).forEach(([skill, score]) => {
        if (score !== undefined) {
          this.cognitiveProfile[domain][skill] =
            this.cognitiveProfile[domain][skill] * (1 - alpha) + score * alpha
        }
      })
    })

    // Atualiza confiança geral
    this.confidence = Math.min(this.confidence + 0.02, 1.0)
  }

  /**
   * Atualiza tendências de desenvolvimento
   */
  updateDevelopmentTrends() {
    if (this.assessmentHistory.length < 5) return

    const recent = this.assessmentHistory.slice(-5)

    Object.keys(this.cognitiveProfile).forEach((domain) => {
      Object.keys(this.cognitiveProfile[domain]).forEach((skill) => {
        const scores = recent.map((assessment) => assessment.cognitive[domain]?.[skill] || 0)

        this.developmentTrends[`${domain}.${skill}`] = this.calculateTrendSlope(scores)
      })
    })
  }

  /**
   * Calcula inclinação da tendência
   * @param {Array} values - Valores para análise
   */
  calculateTrendSlope(values) {
    if (values.length < 2) return 0

    const n = values.length
    const x = Array.from({ length: n }, (_, i) => i)
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = values.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  }

  /**
   * Obtém relatório detalhado
   */
  getDetailedReport() {
    return {
      cognitiveProfile: this.cognitiveProfile,
      confidence: this.confidence,
      assessmentCount: this.assessmentHistory.length,
      developmentTrends: this.developmentTrends,
      lastAssessment: this.assessmentHistory[this.assessmentHistory.length - 1],
      progressSummary: this.generateProgressSummary(),
    }
  }

  /**
   * Gera resumo de progresso
   */
  generateProgressSummary() {
    const trends = Object.entries(this.developmentTrends)
    const improving = trends.filter(([_, slope]) => slope > 0.01)
    const declining = trends.filter(([_, slope]) => slope < -0.01)
    const stable = trends.filter(([_, slope]) => Math.abs(slope) <= 0.01)

    return {
      improving: improving.length,
      declining: declining.length,
      stable: stable.length,
      strongestImprovement: improving.sort((a, b) => b[1] - a[1])[0]?.[0],
      biggestConcern: declining.sort((a, b) => a[1] - b[1])[0]?.[0],
    }
  }

  /**
   * Exporta dados do modelo
   */
  export() {
    return {
      cognitiveProfile: this.cognitiveProfile,
      assessmentHistory: this.assessmentHistory.slice(-20), // Últimas 20
      developmentTrends: this.developmentTrends,
      confidence: this.confidence,
      timestamp: Date.now(),
    }
  }

  /**
   * Importa dados do modelo
   * @param {Object} modelData - Dados do modelo
   */
  import(modelData) {
    try {
      this.cognitiveProfile = modelData.cognitiveProfile || this.cognitiveProfile
      this.assessmentHistory = modelData.assessmentHistory || []
      this.developmentTrends = modelData.developmentTrends || {}
      this.confidence = modelData.confidence || 0.0
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Erro ao importar CognitiveAssessmentModel:', error)
      return false
    }
  }
}

export default CognitiveAssessmentModel
