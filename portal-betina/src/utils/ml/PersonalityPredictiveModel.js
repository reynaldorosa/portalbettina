/**
 * @file PersonalityPredictiveModel.js
 * @description Modelo preditivo de personalidade para análise comportamental
 */

export class PersonalityPredictiveModel {
  constructor() {
    this.traits = {
      openness: 0.5,
      conscientiousness: 0.5,
      extraversion: 0.5,
      agreeableness: 0.5,
      neuroticism: 0.5,
    }

    this.confidence = 0.0
    this.samples = 0
    this.isInitialized = false
  }

  /**
   * Inicializa o modelo com dados base
   */
  async initialize() {
    try {
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Erro ao inicializar PersonalityPredictiveModel:', error)
      return false
    }
  }

  /**
   * Treina o modelo com dados comportamentais
   * @param {Object} behaviorData - Dados comportamentais
   */
  async train(behaviorData) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const { interactionPatterns, responseTime, errorRate, preferenceData, emotionalResponse } =
        behaviorData

      // Análise de abertura (openness)
      if (interactionPatterns?.explorationRate > 0.7) {
        this.traits.openness = Math.min(this.traits.openness + 0.1, 1.0)
      }

      // Análise de conscienciosidade (conscientiousness)
      if (errorRate < 0.2 && responseTime?.average < 3000) {
        this.traits.conscientiousness = Math.min(this.traits.conscientiousness + 0.1, 1.0)
      }

      // Análise de extroversão (extraversion)
      if (interactionPatterns?.socialEngagement > 0.6) {
        this.traits.extraversion = Math.min(this.traits.extraversion + 0.1, 1.0)
      }

      // Análise de amabilidade (agreeableness)
      if (emotionalResponse?.positivity > 0.7) {
        this.traits.agreeableness = Math.min(this.traits.agreeableness + 0.1, 1.0)
      }

      // Análise de neuroticismo (neuroticism)
      if (emotionalResponse?.anxiety > 0.6) {
        this.traits.neuroticism = Math.min(this.traits.neuroticism + 0.1, 1.0)
      }

      this.samples++
      this.confidence = Math.min(this.samples / 100, 1.0)

      return this.traits
    } catch (error) {
      console.error('Erro ao treinar PersonalityPredictiveModel:', error)
      return null
    }
  }

  /**
   * Prediz traços de personalidade baseado em comportamento atual
   * @param {Object} currentBehavior - Comportamento atual
   */
  predict(currentBehavior) {
    if (!this.isInitialized) {
      return null
    }

    try {
      const prediction = { ...this.traits }

      // Ajustes baseados no comportamento atual
      if (currentBehavior.hasExploratoryBehavior) {
        prediction.openness += 0.05
      }

      if (currentBehavior.hasStructuredApproach) {
        prediction.conscientiousness += 0.05
      }

      if (currentBehavior.seeksSocialInteraction) {
        prediction.extraversion += 0.05
      }

      if (currentBehavior.showsEmpathy) {
        prediction.agreeableness += 0.05
      }

      if (currentBehavior.showsAnxiety) {
        prediction.neuroticism += 0.05
      }

      return {
        traits: prediction,
        confidence: this.confidence,
        samples: this.samples,
      }
    } catch (error) {
      console.error('Erro na predição de personalidade:', error)
      return null
    }
  }

  /**
   * Obtém recomendações baseadas no perfil de personalidade
   */
  getRecommendations() {
    const recommendations = []

    if (this.traits.openness > 0.7) {
      recommendations.push({
        type: 'activity',
        message: 'Atividades exploratórias e criativas são recomendadas',
        priority: 'high',
      })
    }

    if (this.traits.conscientiousness > 0.7) {
      recommendations.push({
        type: 'structure',
        message: 'Atividades estruturadas com objetivos claros',
        priority: 'medium',
      })
    }

    if (this.traits.extraversion > 0.7) {
      recommendations.push({
        type: 'social',
        message: 'Atividades sociais e colaborativas',
        priority: 'high',
      })
    }

    if (this.traits.neuroticism > 0.6) {
      recommendations.push({
        type: 'support',
        message: 'Suporte adicional e redução de pressão',
        priority: 'high',
      })
    }

    return recommendations
  }

  /**
   * Exporta o modelo treinado
   */
  export() {
    return {
      traits: this.traits,
      confidence: this.confidence,
      samples: this.samples,
      timestamp: Date.now(),
    }
  }

  /**
   * Importa um modelo previamente treinado
   * @param {Object} modelData - Dados do modelo
   */
  import(modelData) {
    try {
      this.traits = modelData.traits || this.traits
      this.confidence = modelData.confidence || 0
      this.samples = modelData.samples || 0
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Erro ao importar modelo:', error)
      return false
    }
  }
}

export default PersonalityPredictiveModel
