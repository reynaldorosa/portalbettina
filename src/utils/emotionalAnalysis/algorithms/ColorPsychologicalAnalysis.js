/**
 * @file ColorPsychologicalAnalysis.js
 * @description Algoritmo de análise psicológica baseada em cores
 * Analisa escolhas de cores para inferir estados emocionais e preferências
 * @version 1.0.0
 */

export class ColorPsychologicalAnalysis {
  constructor(config = {}) {
    this.config = {
      personalityType: config.personalityType || 'balanced',
      cognitiveProfile: config.cognitiveProfile || {},
      colorSensitivity: config.colorSensitivity || 'medium',
      ...config,
    }

    // Mapeamento psicológico de cores
    this.colorPsychology = {
      red: {
        emotion: 'energy',
        intensity: 0.9,
        associations: ['passion', 'anger', 'excitement', 'alertness'],
        cognitiveEffect: 'stimulating',
      },
      blue: {
        emotion: 'calm',
        intensity: 0.3,
        associations: ['peace', 'trust', 'stability', 'focus'],
        cognitiveEffect: 'calming',
      },
      green: {
        emotion: 'balance',
        intensity: 0.4,
        associations: ['nature', 'growth', 'harmony', 'healing'],
        cognitiveEffect: 'balancing',
      },
      yellow: {
        emotion: 'happiness',
        intensity: 0.7,
        associations: ['joy', 'optimism', 'creativity', 'attention'],
        cognitiveEffect: 'energizing',
      },
      orange: {
        emotion: 'enthusiasm',
        intensity: 0.8,
        associations: ['warmth', 'sociability', 'confidence', 'motivation'],
        cognitiveEffect: 'motivating',
      },
      purple: {
        emotion: 'mystery',
        intensity: 0.6,
        associations: ['creativity', 'spirituality', 'imagination', 'luxury'],
        cognitiveEffect: 'inspiring',
      },
      pink: {
        emotion: 'nurturing',
        intensity: 0.4,
        associations: ['compassion', 'love', 'playfulness', 'calm'],
        cognitiveEffect: 'soothing',
      },
      brown: {
        emotion: 'stability',
        intensity: 0.3,
        associations: ['earthiness', 'reliability', 'comfort', 'security'],
        cognitiveEffect: 'grounding',
      },
      black: {
        emotion: 'power',
        intensity: 0.2,
        associations: ['elegance', 'mystery', 'formality', 'depth'],
        cognitiveEffect: 'focusing',
      },
      white: {
        emotion: 'purity',
        intensity: 0.1,
        associations: ['cleanliness', 'simplicity', 'peace', 'new beginnings'],
        cognitiveEffect: 'clarifying',
      },
      gray: {
        emotion: 'neutral',
        intensity: 0.2,
        associations: ['balance', 'sophistication', 'timelessness', 'compromise'],
        cognitiveEffect: 'neutral',
      },
    }

    this.isInitialized = false
    this.analysisHistory = []
  }

  async initialize() {
    this.isInitialized = true
    console.log('🎨 ColorPsychologicalAnalysis inicializado')
  }

  /**
   * Executa análise psicológica de cores
   * @param {Object} userProfile - Perfil do usuário
   * @param {Object} sessionData - Dados da sessão
   */
  async execute(userProfile, sessionData) {
    try {
      const colorChoices = this.extractColorChoices(sessionData)
      const emotionalProfile = this.analyzeEmotionalProfile(colorChoices)
      const cognitiveState = this.analyzeCognitiveState(colorChoices)
      const preferences = this.analyzePreferences(colorChoices, userProfile)

      const result = {
        algorithm: 'ColorPsychologicalAnalysis',
        timestamp: new Date(),
        score: this.calculateOverallScore(emotionalProfile, cognitiveState),
        confidence: this.calculateConfidence(colorChoices),
        emotionalProfile,
        cognitiveState,
        preferences,
        insights: this.generateInsights(emotionalProfile, cognitiveState, preferences),
        recommendations: this.generateRecommendations(emotionalProfile, cognitiveState),
      }

      this.analysisHistory.push(result)
      return result
    } catch (error) {
      console.error('❌ Erro na análise de cores:', error)
      return this.getDefaultResult()
    }
  }

  /**
   * Extrai escolhas de cores dos dados da sessão
   */
  extractColorChoices(sessionData) {
    const colorChoices = []

    // Analisar diferentes fontes de dados de cor
    if (sessionData.paintingActivity) {
      colorChoices.push(...this.extractPaintingColors(sessionData.paintingActivity))
    }

    if (sessionData.gameChoices) {
      colorChoices.push(...this.extractGameColors(sessionData.gameChoices))
    }

    if (sessionData.interfaceInteractions) {
      colorChoices.push(...this.extractInterfaceColors(sessionData.interfaceInteractions))
    }

    if (sessionData.customizations) {
      colorChoices.push(...this.extractCustomizationColors(sessionData.customizations))
    }

    return colorChoices
  }

  extractPaintingColors(paintingData) {
    const colors = []

    if (paintingData.brushStrokes) {
      for (const stroke of paintingData.brushStrokes) {
        colors.push({
          color: stroke.color,
          usage: stroke.duration || 1,
          pressure: stroke.pressure || 0.5,
          frequency: stroke.frequency || 1,
          context: 'painting',
          timestamp: stroke.timestamp,
        })
      }
    }

    return colors
  }

  extractGameColors(gameData) {
    const colors = []

    if (gameData.selections) {
      for (const selection of gameData.selections) {
        if (selection.color) {
          colors.push({
            color: selection.color,
            usage: 1,
            context: 'game_selection',
            timestamp: selection.timestamp,
            success: selection.correct || false,
          })
        }
      }
    }

    return colors
  }

  extractInterfaceColors(interfaceData) {
    const colors = []

    if (interfaceData.themeChoices) {
      colors.push({
        color: interfaceData.themeChoices.primaryColor,
        usage: 1,
        context: 'interface_theme',
        timestamp: interfaceData.timestamp,
      })
    }

    return colors
  }

  extractCustomizationColors(customizationData) {
    const colors = []

    for (const [element, color] of Object.entries(customizationData)) {
      colors.push({
        color,
        usage: 1,
        context: `customization_${element}`,
        timestamp: customizationData.timestamp,
      })
    }

    return colors
  }

  /**
   * Analisa perfil emocional baseado nas cores
   */
  analyzeEmotionalProfile(colorChoices) {
    const emotionalScores = {}
    let totalUsage = 0

    // Calcular scores emocionais
    for (const choice of colorChoices) {
      const colorInfo = this.colorPsychology[choice.color.toLowerCase()]
      if (colorInfo) {
        const weight = choice.usage || 1
        totalUsage += weight

        if (!emotionalScores[colorInfo.emotion]) {
          emotionalScores[colorInfo.emotion] = 0
        }
        emotionalScores[colorInfo.emotion] += colorInfo.intensity * weight
      }
    }

    // Normalizar scores
    for (const emotion in emotionalScores) {
      emotionalScores[emotion] = emotionalScores[emotion] / totalUsage
    }

    return {
      dominantEmotion: this.findDominantEmotion(emotionalScores),
      emotionalScores,
      emotionalVariability: this.calculateVariability(emotionalScores),
      emotionalIntensity: this.calculateAverageIntensity(colorChoices),
    }
  }

  /**
   * Analisa estado cognitivo baseado nas cores
   */
  analyzeCognitiveState(colorChoices) {
    const cognitiveEffects = {}

    for (const choice of colorChoices) {
      const colorInfo = this.colorPsychology[choice.color.toLowerCase()]
      if (colorInfo) {
        const effect = colorInfo.cognitiveEffect
        if (!cognitiveEffects[effect]) {
          cognitiveEffects[effect] = 0
        }
        cognitiveEffects[effect] += choice.usage || 1
      }
    }

    return {
      dominantCognitiveState: this.findDominantCognitiveState(cognitiveEffects),
      cognitiveBalance: this.calculateCognitiveBalance(cognitiveEffects),
      stimulationLevel: this.calculateStimulationLevel(colorChoices),
    }
  }

  /**
   * Analisa preferências de cores
   */
  analyzePreferences(colorChoices, userProfile) {
    const colorFrequency = {}
    const contextPreferences = {}

    // Contar frequência de cores
    for (const choice of colorChoices) {
      const color = choice.color.toLowerCase()
      colorFrequency[color] = (colorFrequency[color] || 0) + (choice.usage || 1)

      if (!contextPreferences[choice.context]) {
        contextPreferences[choice.context] = {}
      }
      contextPreferences[choice.context][color] =
        (contextPreferences[choice.context][color] || 0) + 1
    }

    return {
      favoriteColors: this.getFavoriteColors(colorFrequency),
      leastUsedColors: this.getLeastUsedColors(colorFrequency),
      contextualPreferences: contextPreferences,
      consistencyScore: this.calculateConsistency(colorChoices, userProfile),
    }
  }

  /**
   * Gera insights baseados na análise
   */
  generateInsights(emotionalProfile, cognitiveState, preferences) {
    const insights = []

    // Insights emocionais
    if (
      emotionalProfile.dominantEmotion === 'energy' &&
      emotionalProfile.emotionalIntensity > 0.7
    ) {
      insights.push({
        type: 'emotional',
        message: 'Alta preferência por cores energéticas indica estado ativo e motivado',
        confidence: 0.8,
      })
    }

    if (emotionalProfile.dominantEmotion === 'calm' && cognitiveState.stimulationLevel < 0.3) {
      insights.push({
        type: 'emotional',
        message: 'Preferência por cores calmas sugere necessidade de tranquilidade',
        confidence: 0.85,
      })
    }

    // Insights cognitivos
    if (cognitiveState.dominantCognitiveState === 'stimulating') {
      insights.push({
        type: 'cognitive',
        message: 'Escolhas de cores estimulantes indicam busca por ativação mental',
        confidence: 0.7,
      })
    }

    // Insights de consistência
    if (preferences.consistencyScore > 0.8) {
      insights.push({
        type: 'behavioral',
        message: 'Alta consistência nas escolhas de cores indica preferências estáveis',
        confidence: 0.9,
      })
    }

    return insights
  }

  /**
   * Gera recomendações baseadas na análise
   */
  generateRecommendations(emotionalProfile, cognitiveState) {
    const recommendations = []

    // Recomendações baseadas no estado emocional
    if (emotionalProfile.dominantEmotion === 'energy') {
      recommendations.push({
        type: 'activity',
        suggestion: 'Atividades físicas ou criativas para canalizar energia',
        colors: ['red', 'orange', 'yellow'],
      })
    }

    if (emotionalProfile.dominantEmotion === 'calm') {
      recommendations.push({
        type: 'environment',
        suggestion: 'Ambiente tranquilo com cores suaves',
        colors: ['blue', 'green', 'white'],
      })
    }

    // Recomendações cognitivas
    if (cognitiveState.stimulationLevel < 0.3) {
      recommendations.push({
        type: 'stimulation',
        suggestion: 'Introduzir cores mais vibrantes para aumentar estímulo',
        colors: ['red', 'orange', 'yellow'],
      })
    }

    return recommendations
  }

  // Métodos auxiliares
  findDominantEmotion(emotionalScores) {
    return Object.keys(emotionalScores).reduce((a, b) =>
      emotionalScores[a] > emotionalScores[b] ? a : b
    )
  }

  findDominantCognitiveState(cognitiveEffects) {
    return Object.keys(cognitiveEffects).reduce((a, b) =>
      cognitiveEffects[a] > cognitiveEffects[b] ? a : b
    )
  }

  calculateVariability(scores) {
    const values = Object.values(scores)
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    return Math.sqrt(variance)
  }

  calculateAverageIntensity(colorChoices) {
    let totalIntensity = 0
    let totalWeight = 0

    for (const choice of colorChoices) {
      const colorInfo = this.colorPsychology[choice.color.toLowerCase()]
      if (colorInfo) {
        const weight = choice.usage || 1
        totalIntensity += colorInfo.intensity * weight
        totalWeight += weight
      }
    }

    return totalWeight > 0 ? totalIntensity / totalWeight : 0.5
  }

  calculateCognitiveBalance(cognitiveEffects) {
    const stimulating = cognitiveEffects.stimulating || 0
    const calming = cognitiveEffects.calming || 0
    const total = stimulating + calming

    return total > 0 ? Math.abs(stimulating - calming) / total : 0.5
  }

  calculateStimulationLevel(colorChoices) {
    let stimulationScore = 0
    let totalWeight = 0

    for (const choice of colorChoices) {
      const colorInfo = this.colorPsychology[choice.color.toLowerCase()]
      if (colorInfo) {
        const weight = choice.usage || 1
        const stimulation =
          colorInfo.cognitiveEffect === 'stimulating'
            ? 1
            : colorInfo.cognitiveEffect === 'calming'
              ? 0
              : 0.5
        stimulationScore += stimulation * weight
        totalWeight += weight
      }
    }

    return totalWeight > 0 ? stimulationScore / totalWeight : 0.5
  }

  getFavoriteColors(colorFrequency) {
    return Object.entries(colorFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([color]) => color)
  }

  getLeastUsedColors(colorFrequency) {
    const allColors = Object.keys(this.colorPsychology)
    return allColors.filter((color) => !colorFrequency[color])
  }

  calculateConsistency(colorChoices, userProfile) {
    // Implementar cálculo de consistência baseado no histórico
    return 0.5 // Placeholder
  }

  calculateOverallScore(emotionalProfile, cognitiveState) {
    // Combinar scores emocional e cognitivo
    const emotionalScore = emotionalProfile.emotionalIntensity
    const cognitiveScore = 1 - cognitiveState.cognitiveBalance // Menor variabilidade = melhor

    return (emotionalScore + cognitiveScore) / 2
  }

  calculateConfidence(colorChoices) {
    // Confiança baseada na quantidade de dados
    const dataPoints = colorChoices.length
    return Math.min(dataPoints / 10, 1) // Máximo de confiança com 10+ pontos
  }

  getDefaultResult() {
    return {
      algorithm: 'ColorPsychologicalAnalysis',
      timestamp: new Date(),
      score: 0.5,
      confidence: 0.1,
      emotionalProfile: { dominantEmotion: 'neutral' },
      cognitiveState: { dominantCognitiveState: 'neutral' },
      preferences: { favoriteColors: [] },
      insights: [],
      recommendations: [],
    }
  }

  updateProfile(newProfile) {
    this.config = { ...this.config, ...newProfile }
  }
}

export default ColorPsychologicalAnalysis
