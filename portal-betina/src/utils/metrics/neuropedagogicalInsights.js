// Módulo para Insights Neuropedagógicos Avançados
// Sistema de análise de padrões de aprendizado e recomendações terapêuticas

export class NeuropedagogicalAnalyzer {
  constructor() {
    this.cognitivePatterns = {
      VISUAL_PROCESSING: 'visual',
      AUDITORY_PROCESSING: 'auditory', 
      KINESTHETIC_PROCESSING: 'kinesthetic',
      EXECUTIVE_FUNCTION: 'executive',
      MEMORY_CONSOLIDATION: 'memory',
      ATTENTION_SPAN: 'attention',
      PROCESSING_SPEED: 'speed'
    };
    
    this.learningStyles = {
      VISUAL: 'visual_learner',
      AUDITORY: 'auditory_learner',
      KINESTHETIC: 'kinesthetic_learner',
      MIXED: 'mixed_learner'
    };
    
    this.difficultyProgression = {
      REGRESSION: 'needs_support',
      STABLE: 'maintaining',
      PROGRESSION: 'advancing',
      MASTERY: 'mastered'
    };
  }

  // Analisar padrões cognitivos baseado em métricas de sessão
  analyzeCognitivePatterns(sessionMetrics) {
    const patterns = {};
    
    // Análise de processamento visual (baseado em tempo de resposta visual)
    patterns[this.cognitivePatterns.VISUAL_PROCESSING] = this.analyzeVisualProcessing(sessionMetrics);
    
    // Análise de processamento auditivo (baseado em uso de TTS e resposta)
    patterns[this.cognitivePatterns.AUDITORY_PROCESSING] = this.analyzeAuditoryProcessing(sessionMetrics);
    
    // Análise de função executiva (baseado em planejamento e estratégia)
    patterns[this.cognitivePatterns.EXECUTIVE_FUNCTION] = this.analyzeExecutiveFunction(sessionMetrics);
    
    // Análise de consolidação de memória (baseado em retenção entre sessões)
    patterns[this.cognitivePatterns.MEMORY_CONSOLIDATION] = this.analyzeMemoryConsolidation(sessionMetrics);
    
    // Análise de span de atenção (baseado em consistência ao longo da sessão)
    patterns[this.cognitivePatterns.ATTENTION_SPAN] = this.analyzeAttentionSpan(sessionMetrics);
    
    // Análise de velocidade de processamento
    patterns[this.cognitivePatterns.PROCESSING_SPEED] = this.analyzeProcessingSpeed(sessionMetrics);
    
    return patterns;
  }

  // Análise específica de processamento visual
  analyzeVisualProcessing(metrics) {
    const avgResponseTime = metrics.averageResponseTime || 0;
    const visualErrors = metrics.visualDiscriminationErrors || 0;
    const visualSuccessRate = metrics.visualTaskSuccessRate || 0;
    
    let score = 0;
    
    // Tempo de resposta ideal: 2-8 segundos para atividades visuais
    if (avgResponseTime >= 2000 && avgResponseTime <= 8000) {
      score += 30;
    } else if (avgResponseTime > 8000) {
      score += 10; // Processamento mais lento
    } else if (avgResponseTime < 2000) {
      score += 20; // Muito rápido, pode indicar impulsividade
    }
    
    // Taxa de sucesso em tarefas visuais
    score += Math.floor(visualSuccessRate * 50);
    
    // Penalizar por erros de discriminação visual
    score = Math.max(0, score - (visualErrors * 5));
    
    return {
      score,
      level: this.getProcessingLevel(score),
      recommendations: this.getVisualProcessingRecommendations(score, metrics)
    };
  }

  // Análise de processamento auditivo
  analyzeAuditoryProcessing(metrics) {
    const ttsUsage = metrics.ttsUsageFrequency || 0;
    const auditoryResponseAccuracy = metrics.auditoryTaskAccuracy || 0;
    const soundPreference = metrics.soundEnabled ? 20 : 0;
    
    let score = soundPreference;
    
    // Frequência de uso do TTS indica dependência auditiva
    if (ttsUsage > 0.7) {
      score += 40; // Alta dependência auditiva
    } else if (ttsUsage > 0.3) {
      score += 25; // Dependência moderada
    } else {
      score += 10; // Baixa dependência auditiva
    }
    
    score += Math.floor(auditoryResponseAccuracy * 30);
    
    return {
      score,
      level: this.getProcessingLevel(score),
      recommendations: this.getAuditoryProcessingRecommendations(score, metrics)
    };
  }

  // Análise de função executiva
  analyzeExecutiveFunction(metrics) {
    const planningTime = metrics.taskPlanningTime || 0;
    const errorPattern = metrics.errorPatternConsistency || 0;
    const strategyAdaptation = metrics.strategyChangeFrequency || 0;
    const impulsivityScore = metrics.impulsiveResponses || 0;
    
    let score = 0;
    
    // Tempo de planejamento adequado indica boa função executiva
    if (planningTime >= 1000 && planningTime <= 5000) {
      score += 25;
    } else if (planningTime < 1000) {
      score += 10; // Muito impulsivo
    }
    
    // Padrões de erro consistentes indicam problemas específicos
    score += (100 - errorPattern) * 0.2;
    
    // Adaptação de estratégia
    score += strategyAdaptation * 15;
    
    // Penalizar impulsividade
    score = Math.max(0, score - (impulsivityScore * 10));
    
    return {
      score,
      level: this.getProcessingLevel(score),
      recommendations: this.getExecutiveFunctionRecommendations(score, metrics)
    };
  }

  // Análise de consolidação de memória
  analyzeMemoryConsolidation(metrics) {
    const retentionRate = metrics.intersessionRetention || 0;
    const forgettingCurve = metrics.forgettingCurveSlope || 0;
    const repeatedItemsAccuracy = metrics.repeatedItemsAccuracy || 0;
    
    let score = 0;
    
    score += retentionRate * 40;
    score += (100 - Math.abs(forgettingCurve)) * 0.3;
    score += repeatedItemsAccuracy * 30;
    
    return {
      score,
      level: this.getProcessingLevel(score),
      recommendations: this.getMemoryConsolidationRecommendations(score, metrics)
    };
  }

  // Análise de span de atenção
  analyzeAttentionSpan(metrics) {
    const consistencyScore = metrics.performanceConsistency || 0;
    const fatiguePattern = metrics.fatigueDecline || 0;
    const distractibilityScore = metrics.distractibilityEvents || 0;
    const sustainedAttentionTime = metrics.sustainedAttentionDuration || 0;
    
    let score = 0;
    
    score += consistencyScore * 30;
    score += Math.max(0, 30 - fatiguePattern * 5);
    score += Math.max(0, 20 - distractibilityScore * 3);
    score += Math.min(20, sustainedAttentionTime / 60000 * 10); // Minutos para score
    
    return {
      score,
      level: this.getProcessingLevel(score),
      recommendations: this.getAttentionSpanRecommendations(score, metrics)
    };
  }

  // Análise de velocidade de processamento
  analyzeProcessingSpeed(metrics) {
    const avgResponseTime = metrics.averageResponseTime || 0;
    const processingEfficiency = metrics.accuracyPerSecond || 0;
    const speedConsistency = metrics.responseTimeVariability || 0;
    
    let score = 0;
    
    // Velocidade ideal varia por idade
    const idealResponseTime = this.getIdealResponseTime(metrics.userAge || 8);
    const timeDeviation = Math.abs(avgResponseTime - idealResponseTime);
    
    score += Math.max(0, 40 - (timeDeviation / 1000 * 5));
    score += processingEfficiency * 30;
    score += Math.max(0, 30 - speedConsistency * 2);
    
    return {
      score,
      level: this.getProcessingLevel(score),
      recommendations: this.getProcessingSpeedRecommendations(score, metrics)
    };
  }

  // Determinar nível de processamento baseado no score
  getProcessingLevel(score) {
    if (score >= 80) return 'excelente';
    if (score >= 65) return 'bom';
    if (score >= 50) return 'adequado';
    if (score >= 35) return 'em_desenvolvimento';
    return 'necessita_suporte';
  }

  // Obter tempo de resposta ideal baseado na idade
  getIdealResponseTime(age) {
    if (age <= 5) return 8000;
    if (age <= 7) return 6000;
    if (age <= 9) return 4000;
    if (age <= 12) return 3000;
    return 2500;
  }

  // Recomendações específicas para processamento visual
  getVisualProcessingRecommendations(score, metrics) {
    const recommendations = [];
    
    if (score < 50) {
      recommendations.push({
        type: 'intervention',
        priority: 'alta',
        description: 'Atividades de discriminação visual com apoio multimodal',
        activities: ['contrast_exercises', 'visual_tracking', 'pattern_recognition']
      });
    }
    
    if (metrics.averageResponseTime > 10000) {
      recommendations.push({
        type: 'accommodation',
        priority: 'média',
        description: 'Permitir tempo adicional para processamento visual',
        activities: ['extended_time', 'visual_cues']
      });
    }
    
    return recommendations;
  }

  // Recomendações para processamento auditivo
  getAuditoryProcessingRecommendations(score, metrics) {
    const recommendations = [];
    
    if (metrics.ttsUsageFrequency > 0.8) {
      recommendations.push({
        type: 'strength',
        priority: 'baixa',
        description: 'Forte preferência auditiva - maximizar recursos sonoros',
        activities: ['audio_stories', 'sound_games', 'verbal_instructions']
      });
    }
    
    if (score < 40) {
      recommendations.push({
        type: 'intervention',
        priority: 'alta',
        description: 'Desenvolver habilidades de processamento auditivo',
        activities: ['sound_discrimination', 'auditory_memory', 'listening_skills']
      });
    }
    
    return recommendations;
  }

  // Recomendações para função executiva
  getExecutiveFunctionRecommendations(score, metrics) {
    const recommendations = [];
    
    if (metrics.impulsiveResponses > 5) {
      recommendations.push({
        type: 'intervention',
        priority: 'alta',
        description: 'Estratégias para controle de impulsividade',
        activities: ['pause_reflect', 'self_monitoring', 'planning_practice']
      });
    }
    
    if (score < 45) {
      recommendations.push({
        type: 'intervention',
        priority: 'média',
        description: 'Desenvolvimento de habilidades executivas',
        activities: ['task_planning', 'problem_solving', 'cognitive_flexibility']
      });
    }
    
    return recommendations;
  }

  // Recomendações para consolidação de memória
  getMemoryConsolidationRecommendations(score, metrics) {
    const recommendations = [];
    
    if (metrics.intersessionRetention < 0.5) {
      recommendations.push({
        type: 'intervention',
        priority: 'alta',
        description: 'Estratégias de consolidação de memória',
        activities: ['spaced_repetition', 'memory_strategies', 'review_sessions']
      });
    }
    
    return recommendations;
  }

  // Recomendações para span de atenção
  getAttentionSpanRecommendations(score, metrics) {
    const recommendations = [];
    
    if (metrics.sustainedAttentionDuration < 300000) { // Menos de 5 minutos
      recommendations.push({
        type: 'accommodation',
        priority: 'média',
        description: 'Sessões mais curtas com pausas frequentes',
        activities: ['break_reminders', 'shorter_sessions', 'attention_cues']
      });
    }
    
    if (metrics.distractibilityEvents > 3) {
      recommendations.push({
        type: 'intervention',
        priority: 'média',
        description: 'Estratégias para reduzir distrações',
        activities: ['focus_exercises', 'environmental_modifications']
      });
    }
    
    return recommendations;
  }

  // Recomendações para velocidade de processamento
  getProcessingSpeedRecommendations(score, metrics) {
    const recommendations = [];
    
    if (metrics.averageResponseTime > this.getIdealResponseTime(metrics.userAge || 8) * 1.5) {
      recommendations.push({
        type: 'accommodation',
        priority: 'média',
        description: 'Tempo adicional para processamento',
        activities: ['extended_time', 'processing_support']
      });
    }
    
    return recommendations;
  }

  // Gerar relatório completo de insights neuropedagógicos
  generateComprehensiveReport(sessionMetrics, historicalData = []) {
    const cognitivePatterns = this.analyzeCognitivePatterns(sessionMetrics);
    const learningStyle = this.identifyLearningStyle(cognitivePatterns);
    const progressionTrend = this.analyzeProgressionTrend(historicalData);
    
    const report = {
      timestamp: new Date().toISOString(),
      userId: sessionMetrics.userId,
      sessionId: sessionMetrics.sessionId,
      cognitivePatterns,
      learningStyle,
      progressionTrend,
      recommendations: this.generatePrioritizedRecommendations(cognitivePatterns),
      nextSessionSuggestions: this.generateNextSessionSuggestions(cognitivePatterns, progressionTrend),
      therapistNotes: this.generateTherapistNotes(cognitivePatterns, progressionTrend)
    };
    
    return report;
  }

  // Identificar estilo de aprendizagem predominante
  identifyLearningStyle(cognitivePatterns) {
    const visualScore = cognitivePatterns.visual?.score || 0;
    const auditoryScore = cognitivePatterns.auditory?.score || 0;
    const executiveScore = cognitivePatterns.executive?.score || 0;
    
    const maxScore = Math.max(visualScore, auditoryScore, executiveScore);
    const difference = maxScore - Math.min(visualScore, auditoryScore, executiveScore);
    
    if (difference < 15) {
      return this.learningStyles.MIXED;
    } else if (maxScore === visualScore) {
      return this.learningStyles.VISUAL;
    } else if (maxScore === auditoryScore) {
      return this.learningStyles.AUDITORY;
    } else {
      return this.learningStyles.KINESTHETIC;
    }
  }

  // Analisar tendência de progressão
  analyzeProgressionTrend(historicalData) {
    if (historicalData.length < 3) {
      return this.difficultyProgression.STABLE;
    }
    
    const recentSessions = historicalData.slice(-5);
    const progressionScores = recentSessions.map(session => session.overallScore || 0);
    
    const trend = this.calculateTrend(progressionScores);
    
    if (trend > 5) return this.difficultyProgression.PROGRESSION;
    if (trend < -5) return this.difficultyProgression.REGRESSION;
    if (progressionScores[progressionScores.length - 1] > 85) return this.difficultyProgression.MASTERY;
    
    return this.difficultyProgression.STABLE;
  }

  // Calcular tendência estatística
  calculateTrend(values) {
    const n = values.length;
    const sumX = n * (n + 1) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, i) => sum + (i + 1) * y, 0);
    const sumX2 = n * (n + 1) * (2 * n + 1) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  // Gerar recomendações priorizadas
  generatePrioritizedRecommendations(cognitivePatterns) {
    const allRecommendations = [];
    
    Object.values(cognitivePatterns).forEach(pattern => {
      if (pattern.recommendations) {
        allRecommendations.push(...pattern.recommendations);
      }
    });
    
    // Ordenar por prioridade
    return allRecommendations.sort((a, b) => {
      const priorityOrder = { 'alta': 3, 'média': 2, 'baixa': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Sugerir configurações para próxima sessão
  generateNextSessionSuggestions(cognitivePatterns, progressionTrend) {
    const suggestions = {
      duration: 15, // minutos padrão
      difficulty: 'medium',
      modalities: ['visual', 'auditory'],
      accommodations: [],
      focusAreas: []
    };
    
    // Ajustar baseado em span de atenção
    const attentionLevel = cognitivePatterns.attention?.level;
    if (attentionLevel === 'necessita_suporte') {
      suggestions.duration = 10;
      suggestions.accommodations.push('frequent_breaks');
    } else if (attentionLevel === 'excelente') {
      suggestions.duration = 20;
    }
    
    // Ajustar dificuldade baseado na progressão
    if (progressionTrend === this.difficultyProgression.PROGRESSION) {
      suggestions.difficulty = 'hard';
    } else if (progressionTrend === this.difficultyProgression.REGRESSION) {
      suggestions.difficulty = 'easy';
    }
    
    // Focar em modalidades fortes
    const visualScore = cognitivePatterns.visual?.score || 0;
    const auditoryScore = cognitivePatterns.auditory?.score || 0;
    
    if (visualScore > auditoryScore + 20) {
      suggestions.modalities = ['visual'];
    } else if (auditoryScore > visualScore + 20) {
      suggestions.modalities = ['auditory'];
    }
    
    return suggestions;
  }

  // Gerar notas para terapeuta
  generateTherapistNotes(cognitivePatterns, progressionTrend) {
    const notes = [];
    
    // Identificar áreas de força
    const strengths = Object.entries(cognitivePatterns)
      .filter(([_, pattern]) => pattern.level === 'excelente' || pattern.level === 'bom')
      .map(([area, _]) => area);
    
    if (strengths.length > 0) {
      notes.push(`Pontos fortes identificados: ${strengths.join(', ')}`);
    }
    
    // Identificar áreas de atenção
    const concerns = Object.entries(cognitivePatterns)
      .filter(([_, pattern]) => pattern.level === 'necessita_suporte' || pattern.level === 'em_desenvolvimento')
      .map(([area, _]) => area);
    
    if (concerns.length > 0) {
      notes.push(`Áreas que necessitam atenção: ${concerns.join(', ')}`);
    }
    
    // Comentário sobre progressão
    switch (progressionTrend) {
      case this.difficultyProgression.PROGRESSION:
        notes.push('Criança demonstra progressão consistente - considerar aumentar complexidade.');
        break;
      case this.difficultyProgression.REGRESSION:
        notes.push('Declínio no desempenho observado - revisar estratégias e possíveis fatores interferentes.');
        break;
      case this.difficultyProgression.MASTERY:
        notes.push('Domínio da atividade atual atingido - pronta para próximo nível de desafio.');
        break;
    }
    
    return notes;
  }
}

export default new NeuropedagogicalAnalyzer();
