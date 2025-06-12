/**
 * @file CognitiveBreakthroughDetector.js
 * @description Detector de avanços cognitivos
 */

export class CognitiveBreakthroughDetector {
  constructor(config = {}) {
    this.config = {
      breakthroughThreshold: config.breakthroughThreshold || 0.85,
      ...config,
    }
    this.isInitialized = false
  }

  async initialize() {
    this.isInitialized = true
    console.log('🚀 CognitiveBreakthroughDetector inicializado')
  }

  async execute(userProfile, sessionData) {
    const breakthroughAnalysis = this.analyzeBreakthroughs(sessionData)
    const cognitiveLeaps = this.detectCognitiveLeaps(sessionData)

    return {
      algorithm: 'CognitiveBreakthroughDetector',
      timestamp: new Date(),
      score: breakthroughAnalysis.breakthroughScore,
      confidence: 0.8,
      breakthroughsDetected: breakthroughAnalysis.breakthroughsDetected,
      cognitiveLeaps,
      insights: this.generateInsights(breakthroughAnalysis),
      recommendations: this.generateRecommendations(breakthroughAnalysis),
    }
  }

  analyzeBreakthroughs(sessionData) {
    const performanceJumps = this.detectPerformanceJumps(sessionData)
    const understandingLeaps = this.detectUnderstandingLeaps(sessionData)
    const skillMastery = this.detectSkillMastery(sessionData)

    const breakthroughScore = (performanceJumps + understandingLeaps + skillMastery) / 3
    const breakthroughsDetected = breakthroughScore > this.config.breakthroughThreshold ? 1 : 0

    return {
      breakthroughScore,
      breakthroughsDetected,
      performanceJumps,
      understandingLeaps,
      skillMastery,
    }
  }

  detectPerformanceJumps(sessionData) {
    const currentScore = sessionData.performanceScore || 0
    const previousScore = sessionData.previousPerformanceScore || 0
    const improvement = previousScore > 0 ? (currentScore - previousScore) / previousScore : 0

    return improvement > 0.3 ? 1 : Math.max(improvement / 0.3, 0)
  }

  detectUnderstandingLeaps(sessionData) {
    const newConceptsGrasped = sessionData.newConceptsGrasped || 0
    const conceptComplexity = sessionData.conceptComplexity || 0.5

    return Math.min((newConceptsGrasped * conceptComplexity) / 3, 1)
  }

  detectSkillMastery(sessionData) {
    const skillsAcquired = sessionData.skillsAcquired || 0
    const masteryLevel = sessionData.masteryLevel || 0.5

    return Math.min((skillsAcquired * masteryLevel) / 2, 1)
  }

  detectCognitiveLeaps(sessionData) {
    return {
      abstractThinking: sessionData.abstractThinkingImprovement || 0,
      problemSolving: sessionData.problemSolvingImprovement || 0,
      patternRecognition: sessionData.patternRecognitionImprovement || 0,
      creativeThinking: sessionData.creativeThinkingImprovement || 0,
    }
  }

  generateInsights(analysis) {
    const insights = []
    if (analysis.breakthroughsDetected > 0) {
      insights.push({
        type: 'breakthrough',
        message: 'Avanço cognitivo significativo detectado - momento ideal para expandir desafios',
        confidence: 0.9,
      })
    }
    return insights
  }

  generateRecommendations(analysis) {
    const recommendations = []
    if (analysis.breakthroughScore > 0.7) {
      recommendations.push({
        type: 'advancement',
        action: 'introduce_advanced_concepts',
        description: 'Introduzir conceitos mais avançados aproveitando o momento de avanço',
      })
    }
    return recommendations
  }

  updateProfile(newProfile) {
    this.config = { ...this.config, ...newProfile }
  }
}

export default CognitiveBreakthroughDetector
