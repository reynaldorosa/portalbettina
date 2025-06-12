/**
 * @file LearningProgressModel.js
 * @description Modelo de progresso de aprendizagem
 */

export class LearningProgressModel {
  constructor() {
    this.learningProfile = {
      overallProgress: 0.0,
      learningRate: 0.5,
      retentionRate: 0.5,
      masteryLevel: 0.0,
      adaptabilityScore: 0.5,
      consistencyScore: 0.5,
      improvementTrend: 0.0,
    }

    this.skillAreas = {
      attention: { level: 0.0, progress: 0.0, sessions: 0 },
      memory: { level: 0.0, progress: 0.0, sessions: 0 },
      processing: { level: 0.0, progress: 0.0, sessions: 0 },
      language: { level: 0.0, progress: 0.0, sessions: 0 },
      executive: { level: 0.0, progress: 0.0, sessions: 0 },
      social: { level: 0.0, progress: 0.0, sessions: 0 },
      motor: { level: 0.0, progress: 0.0, sessions: 0 },
    }

    this.progressHistory = []
    this.milestones = new Map()
    this.learningCurve = []
    this.isInitialized = false
  }

  async initialize() {
    this.isInitialized = true
    this.initializeMilestones()
    return true
  }

  initializeMilestones() {
    // Marcos de progresso para cada área
    const milestones = [
      { area: 'attention', level: 0.25, description: 'Atenção básica estabelecida' },
      { area: 'attention', level: 0.5, description: 'Atenção sustentada por períodos médios' },
      { area: 'attention', level: 0.75, description: 'Atenção focada e seletiva' },
      { area: 'attention', level: 1.0, description: 'Controle atencional avançado' },

      { area: 'memory', level: 0.25, description: 'Memória de trabalho básica' },
      { area: 'memory', level: 0.5, description: 'Retenção de informações a curto prazo' },
      { area: 'memory', level: 0.75, description: 'Consolidação de memória eficiente' },
      { area: 'memory', level: 1.0, description: 'Estratégias de memória avançadas' },

      { area: 'processing', level: 0.25, description: 'Processamento básico de informações' },
      { area: 'processing', level: 0.5, description: 'Velocidade de processamento adequada' },
      { area: 'processing', level: 0.75, description: 'Processamento eficiente e preciso' },
      { area: 'processing', level: 1.0, description: 'Processamento complexo dominado' },

      { area: 'language', level: 0.25, description: 'Compreensão linguística básica' },
      { area: 'language', level: 0.5, description: 'Expressão linguística funcional' },
      { area: 'language', level: 0.75, description: 'Comunicação complexa' },
      { area: 'language', level: 1.0, description: 'Domínio linguístico avançado' },

      { area: 'executive', level: 0.25, description: 'Funções executivas básicas' },
      { area: 'executive', level: 0.5, description: 'Planejamento e organização simples' },
      { area: 'executive', level: 0.75, description: 'Resolução de problemas complexos' },
      { area: 'executive', level: 1.0, description: 'Autorregulação avançada' },

      { area: 'social', level: 0.25, description: 'Consciência social básica' },
      { area: 'social', level: 0.5, description: 'Interação social funcional' },
      { area: 'social', level: 0.75, description: 'Competência social avançada' },
      { area: 'social', level: 1.0, description: 'Liderança e colaboração' },

      { area: 'motor', level: 0.25, description: 'Coordenação motora básica' },
      { area: 'motor', level: 0.5, description: 'Habilidades motoras funcionais' },
      { area: 'motor', level: 0.75, description: 'Precisão motora refinada' },
      { area: 'motor', level: 1.0, description: 'Controle motor expert' },
    ]

    milestones.forEach((milestone) => {
      const key = `${milestone.area}_${milestone.level}`
      this.milestones.set(key, {
        ...milestone,
        achieved: false,
        achievedDate: null,
      })
    })
  }

  analyzeProgress(sessionData) {
    if (!this.isInitialized) {
      this.initialize()
    }

    const analysis = {
      timestamp: Date.now(),
      sessionProgress: this.calculateSessionProgress(sessionData),
      skillProgress: this.updateSkillProgress(sessionData),
      milestonesAchieved: this.checkMilestones(),
      learningInsights: this.generateLearningInsights(sessionData),
      recommendations: [],
    }

    // Atualizar perfil de aprendizagem
    this.updateLearningProfile(analysis)

    // Registrar progresso
    this.progressHistory.push(analysis)

    // Manter apenas últimos 100 registros
    if (this.progressHistory.length > 100) {
      this.progressHistory.shift()
    }

    // Atualizar curva de aprendizagem
    this.updateLearningCurve(analysis)

    // Gerar recomendações
    analysis.recommendations = this.generateProgressRecommendations(analysis)

    return analysis
  }

  calculateSessionProgress(data) {
    const progress = {
      accuracy: data.accuracy || 0,
      speed: this.normalizeSpeed(data.responseTime),
      completion: data.completionRate || 0,
      engagement: data.engagementLevel || 0,
      improvement: this.calculateImprovement(data),
      overall: 0,
    }

    // Calcular progresso geral da sessão
    progress.overall =
      progress.accuracy * 0.3 +
      progress.speed * 0.2 +
      progress.completion * 0.2 +
      progress.engagement * 0.2 +
      progress.improvement * 0.1

    return progress
  }

  normalizeSpeed(responseTime) {
    if (!responseTime) return 0.5

    // Converter tempo de resposta em score (tempo menor = score maior)
    const maxTime = 10000 // 10 segundos
    return Math.max(0, 1 - responseTime / maxTime)
  }

  calculateImprovement(data) {
    if (this.progressHistory.length < 2) return 0.5

    const previous = this.progressHistory[this.progressHistory.length - 1]
    const previousAccuracy = previous.sessionProgress.accuracy
    const currentAccuracy = data.accuracy || 0

    return Math.max(0, Math.min(1, 0.5 + (currentAccuracy - previousAccuracy)))
  }

  updateSkillProgress(data) {
    const skillUpdates = {}

    // Determinar área de habilidade baseada no tipo de atividade
    const skillArea = this.mapActivityToSkillArea(data.activityType)

    if (skillArea && this.skillAreas[skillArea]) {
      const currentLevel = this.skillAreas[skillArea].level
      const sessionScore = this.calculateSessionProgress(data).overall

      // Atualizar progresso da área de habilidade
      const progressIncrement = sessionScore * 0.01 // Progresso gradual
      this.skillAreas[skillArea].progress += progressIncrement
      this.skillAreas[skillArea].sessions++

      // Atualizar nível se progresso suficiente
      if (this.skillAreas[skillArea].progress >= 1.0) {
        this.skillAreas[skillArea].level = Math.min(1.0, currentLevel + 0.1)
        this.skillAreas[skillArea].progress = 0
      }

      skillUpdates[skillArea] = {
        level: this.skillAreas[skillArea].level,
        progress: this.skillAreas[skillArea].progress,
        improvement: progressIncrement,
      }
    }

    return skillUpdates
  }

  mapActivityToSkillArea(activityType) {
    const mapping = {
      'memory-game': 'memory',
      'color-match': 'attention',
      'image-association': 'language',
      'musical-sequence': 'processing',
      'paint-activity': 'motor',
      'social-story': 'social',
      puzzle: 'executive',
    }

    return mapping[activityType] || 'processing'
  }

  checkMilestones() {
    const achieved = []

    this.milestones.forEach((milestone, key) => {
      if (!milestone.achieved) {
        const area = milestone.area
        const currentLevel = this.skillAreas[area]?.level || 0

        if (currentLevel >= milestone.level) {
          milestone.achieved = true
          milestone.achievedDate = Date.now()
          achieved.push({
            ...milestone,
            key,
          })
        }
      }
    })

    return achieved
  }

  generateLearningInsights(data) {
    const insights = []

    // Insight sobre velocidade de aprendizagem
    const learningRate = this.calculateLearningRate()
    if (learningRate > 0.7) {
      insights.push({
        type: 'positive',
        message: 'Velocidade de aprendizagem acima da média',
        confidence: 0.8,
      })
    } else if (learningRate < 0.3) {
      insights.push({
        type: 'concern',
        message: 'Aprendizagem mais lenta - considere ajustes metodológicos',
        confidence: 0.7,
      })
    }

    // Insight sobre consistência
    const consistency = this.calculateConsistency()
    if (consistency > 0.8) {
      insights.push({
        type: 'positive',
        message: 'Desempenho muito consistente',
        confidence: 0.9,
      })
    } else if (consistency < 0.4) {
      insights.push({
        type: 'concern',
        message: 'Variabilidade alta no desempenho',
        confidence: 0.6,
      })
    }

    // Insight sobre áreas fortes
    const strongestArea = this.getStrongestSkillArea()
    if (strongestArea) {
      insights.push({
        type: 'strength',
        message: `Área de destaque: ${strongestArea.area}`,
        confidence: 0.8,
        area: strongestArea.area,
        level: strongestArea.level,
      })
    }

    // Insight sobre áreas que precisam de atenção
    const weakestArea = this.getWeakestSkillArea()
    if (weakestArea) {
      insights.push({
        type: 'development',
        message: `Área para desenvolvimento: ${weakestArea.area}`,
        confidence: 0.7,
        area: weakestArea.area,
        level: weakestArea.level,
      })
    }

    return insights
  }

  calculateLearningRate() {
    if (this.progressHistory.length < 5) return 0.5

    const recent = this.progressHistory.slice(-5)
    const improvements = recent.map((session) => session.sessionProgress.improvement)

    return improvements.reduce((a, b) => a + b, 0) / improvements.length
  }

  calculateConsistency() {
    if (this.progressHistory.length < 5) return 0.5

    const recent = this.progressHistory.slice(-5)
    const scores = recent.map((session) => session.sessionProgress.overall)

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length

    return Math.max(0, 1 - Math.sqrt(variance))
  }

  getStrongestSkillArea() {
    const areas = Object.entries(this.skillAreas)
    areas.sort((a, b) => b[1].level - a[1].level)

    return areas[0] ? { area: areas[0][0], level: areas[0][1].level } : null
  }

  getWeakestSkillArea() {
    const areas = Object.entries(this.skillAreas).filter(([_, data]) => data.sessions > 0) // Apenas áreas com sessões

    areas.sort((a, b) => a[1].level - b[1].level)

    return areas[0] ? { area: areas[0][0], level: areas[0][1].level } : null
  }

  updateLearningProfile(analysis) {
    const alpha = 0.1 // Taxa de aprendizado

    // Atualizar progresso geral
    this.learningProfile.overallProgress = this.calculateOverallProgress()

    // Atualizar taxa de aprendizagem
    this.learningProfile.learningRate =
      this.learningProfile.learningRate * (1 - alpha) + this.calculateLearningRate() * alpha

    // Atualizar taxa de retenção
    this.learningProfile.retentionRate =
      this.learningProfile.retentionRate * (1 - alpha) + this.calculateRetentionRate() * alpha

    // Atualizar nível de maestria
    this.learningProfile.masteryLevel = this.calculateMasteryLevel()

    // Atualizar adaptabilidade
    this.learningProfile.adaptabilityScore =
      this.learningProfile.adaptabilityScore * (1 - alpha) +
      (analysis.sessionProgress.engagement || 0.5) * alpha

    // Atualizar consistência
    this.learningProfile.consistencyScore = this.calculateConsistency()

    // Atualizar tendência de melhoria
    this.learningProfile.improvementTrend = this.calculateImprovementTrend()
  }

  calculateOverallProgress() {
    const areas = Object.values(this.skillAreas)
    const totalProgress = areas.reduce((sum, area) => sum + area.level, 0)
    return totalProgress / areas.length
  }

  calculateRetentionRate() {
    // Simplificado - baseado na consistência do desempenho
    return this.calculateConsistency()
  }

  calculateMasteryLevel() {
    const areas = Object.values(this.skillAreas)
    const masteredAreas = areas.filter((area) => area.level >= 0.8).length
    return masteredAreas / areas.length
  }

  calculateImprovementTrend() {
    if (this.progressHistory.length < 10) return 0

    const recent = this.progressHistory.slice(-10)
    const older = this.progressHistory.slice(-20, -10)

    if (older.length === 0) return 0

    const recentAvg =
      recent.reduce((sum, session) => sum + session.sessionProgress.overall, 0) / recent.length

    const olderAvg =
      older.reduce((sum, session) => sum + session.sessionProgress.overall, 0) / older.length

    return Math.max(-1, Math.min(1, recentAvg - olderAvg))
  }

  updateLearningCurve(analysis) {
    this.learningCurve.push({
      timestamp: analysis.timestamp,
      overallProgress: this.learningProfile.overallProgress,
      sessionScore: analysis.sessionProgress.overall,
      learningRate: this.learningProfile.learningRate,
    })

    // Manter apenas últimos 50 pontos
    if (this.learningCurve.length > 50) {
      this.learningCurve.shift()
    }
  }

  generateProgressRecommendations(analysis) {
    const recommendations = []

    // Recomendações baseadas em progresso lento
    if (this.learningProfile.learningRate < 0.3) {
      recommendations.push({
        type: 'methodology',
        priority: 'high',
        message: 'Considere abordagens alternativas de ensino',
        action: 'adjust_teaching_method',
      })
    }

    // Recomendações baseadas em inconsistência
    if (this.learningProfile.consistencyScore < 0.5) {
      recommendations.push({
        type: 'support',
        priority: 'medium',
        message: 'Fornecer mais estrutura e previsibilidade',
        action: 'increase_structure',
      })
    }

    // Recomendações para progresso positivo
    if (this.learningProfile.improvementTrend > 0.1) {
      recommendations.push({
        type: 'advancement',
        priority: 'low',
        message: 'Momento favorável para aumentar complexidade',
        action: 'increase_complexity',
      })
    }

    // Recomendações baseadas em marcos
    if (analysis.milestonesAchieved.length > 0) {
      recommendations.push({
        type: 'celebration',
        priority: 'low',
        message: `Celebrar marcos alcançados: ${analysis.milestonesAchieved.length} novos`,
        action: 'celebrate_achievement',
      })
    }

    return recommendations
  }

  getProgressReport() {
    return {
      learningProfile: this.learningProfile,
      skillAreas: this.skillAreas,
      achievedMilestones: Array.from(this.milestones.values()).filter((m) => m.achieved),
      learningCurve: this.learningCurve,
      recentProgress: this.progressHistory.slice(-10),
      progressSummary: this.generateProgressSummary(),
    }
  }

  generateProgressSummary() {
    const totalMilestones = this.milestones.size
    const achievedMilestones = Array.from(this.milestones.values()).filter((m) => m.achieved).length

    return {
      overallProgress: this.learningProfile.overallProgress,
      milestonesCompleted: `${achievedMilestones}/${totalMilestones}`,
      learningPhase: this.determineLearningPhase(),
      nextFocus: this.getNextFocusArea(),
      estimatedCompletion: this.estimateCompletion(),
    }
  }

  determineLearningPhase() {
    const progress = this.learningProfile.overallProgress

    if (progress < 0.25) return 'Iniciante'
    if (progress < 0.5) return 'Desenvolvimento'
    if (progress < 0.75) return 'Intermediário'
    if (progress < 0.9) return 'Avançado'
    return 'Proficiente'
  }

  getNextFocusArea() {
    const weakestArea = this.getWeakestSkillArea()
    return weakestArea ? weakestArea.area : 'manutenção'
  }

  estimateCompletion() {
    const currentRate = this.learningProfile.learningRate
    const remainingProgress = 1.0 - this.learningProfile.overallProgress

    if (currentRate <= 0) return 'indeterminado'

    const estimatedSessions = Math.ceil(remainingProgress / (currentRate * 0.01))
    return `${estimatedSessions} sessões`
  }

  export() {
    return {
      learningProfile: this.learningProfile,
      skillAreas: this.skillAreas,
      progressHistory: this.progressHistory.slice(-50),
      milestones: Object.fromEntries(this.milestones),
      learningCurve: this.learningCurve,
      timestamp: Date.now(),
    }
  }

  import(modelData) {
    try {
      this.learningProfile = modelData.learningProfile || this.learningProfile
      this.skillAreas = modelData.skillAreas || this.skillAreas
      this.progressHistory = modelData.progressHistory || []
      this.milestones = new Map(Object.entries(modelData.milestones || {}))
      this.learningCurve = modelData.learningCurve || []
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Erro ao importar LearningProgressModel:', error)
      return false
    }
  }
}

export default LearningProgressModel
