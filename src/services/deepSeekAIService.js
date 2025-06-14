import { logger, API_CONFIG } from '../config/api-config.js'
import performanceMonitor from '../utils/metrics/performanceMonitor.js'
import { TherapeuticAnalyzer } from '../utils/therapy/therapeuticAnalyzer.js'

// Função helper para obter variáveis de ambiente (compatível com Node.js e browser)
const getEnvVar = (key, fallback = undefined) => {
  // Para Node.js
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  // Usar fallback se não estiver disponível
  return fallback;
};

/**
 * @class DeepSeekAIService
 * @description Serviço avançado de IA para análises neuroeducacionais especializadas em autismo
 * Integra machine learning, análises terapêuticas e insights neuroeducacionais
 */
class DeepSeekAIService {
  constructor() {
    this.apiKey = getEnvVar('VITE_DEEPSEEK_API_KEY')
    this.baseUrl = getEnvVar('VITE_DEEPSEEK_API_URL', 'https://api.deepseek.com')
    this.model = getEnvVar('VITE_DEEPSEEK_MODEL', 'deepseek-chat')
    this.maxRetries = parseInt(getEnvVar('VITE_DEEPSEEK_MAX_RETRIES', '3'))
    this.retryDelay = parseInt(getEnvVar('VITE_DEEPSEEK_RETRY_DELAY_MS', '1000'))
    this.timeout = parseInt(getEnvVar('VITE_DEEPSEEK_TIMEOUT_MS', '30000'))
    this.temperature = parseFloat(getEnvVar('VITE_DEEPSEEK_TEMPERATURE', '0.7'))
    this.maxTokens = parseInt(getEnvVar('VITE_DEEPSEEK_MAX_TOKENS', '4096'))

    // Sistemas especializados
    this.therapeuticAnalyzer = new TherapeuticAnalyzer()
    this.cache = new Map()
    this.analysisHistory = new Map()

    // Configurações avançadas
    this.autismSpecializationPrompts = {
      sensoryProcessing: 'Como especialista em processamento sensorial em autismo',
      socialCognition: 'Como especialista em cognição social e TEA',
      executiveFunction: 'Como especialista em função executiva e autismo',
      communication: 'Como especialista em comunicação e TEA',
      behavioralAnalysis: 'Como analista comportamental especializado em autismo',
    }

    // Métricas de qualidade da IA
    this.aiMetrics = {
      totalRequests: 0,
      successfulAnalyses: 0,
      averageResponseTime: 0,
      accuracyRatings: [],
      specializedInsights: 0,
    }

    this.initializeSpecializedKnowledge()
  }

  /**
   * Inicializa conhecimento especializado em autismo
   */
  initializeSpecializedKnowledge() {
    this.autismKnowledgeBase = {
      diagnosticCriteria: {
        socialCommunication: [
          'reciprocidade socioemocional',
          'comunicação não verbal',
          'relacionamentos',
        ],
        restrictiveRepetitive: [
          'comportamentos motores',
          'insistência rotinas',
          'interesses restritos',
          'sensibilidade sensorial',
        ],
      },
      developmentalStages: {
        earlyChildhood: ['2-5 anos', 'desenvolvimento comunicação', 'brincadeira simbólica'],
        schoolAge: ['6-12 anos', 'habilidades acadêmicas', 'interação social'],
        adolescence: ['13-18 anos', 'independência', 'autorregulação'],
      },
      evidenceBasedInterventions: {
        ABA: 'Análise Aplicada do Comportamento',
        TEACCH: 'Tratamento e Educação de Crianças com Autismo',
        PECS: 'Sistema de Comunicação por Troca de Figuras',
        SocialStories: 'Histórias Sociais',
        SensoryIntegration: 'Integração Sensorial',
      },
    }
  } /**
   * Gera cabeçalhos para requisições da API
   */
  getHeaders() {
    return {
      ...API_CONFIG.DEFAULT_HEADERS,
      Authorization: `Bearer ${this.apiKey}`,
      'X-Client': 'Portal-Betina-Autism-Support',
      'X-Analysis-Context': 'neuroeducational-autism',
    }
  }
  /**
   * Método principal aprimorado para geração de relatórios de IA
   * @param {Object} sessionData - Dados da sessão do usuário
   * @param {string} reportType - Tipo de relatório (comprehensive, cognitive, behavioral, etc.)
   * @param {Object} options - Opções adicionais para análise
   * @param {Array} therapeuticRecommendations - Recomendações terapêuticas geradas pelo hook useAdvancedActivity
   */
  async generateAIReport(sessionData, reportType, options = {}, therapeuticRecommendations = []) {
    const startTime = Date.now()
    this.aiMetrics.totalRequests++

    try {
      // Incluir recomendações terapêuticas nos dados da sessão
      if (therapeuticRecommendations && therapeuticRecommendations.length > 0) {
        sessionData = {
          ...sessionData,
          therapeuticRecommendations,
        }
        logger.info('Recomendações terapêuticas incluídas no relatório de IA', {
          count: therapeuticRecommendations.length,
          reportType,
        })
      }

      // Enriquecer dados da sessão com análises especializadas
      const enrichedData = await this.enrichSessionData(sessionData, options)

      // Verificar cache se habilitado
      const cacheKey = this.generateCacheKey(enrichedData, reportType, options)
      if (options.useCache !== false) {
        const cached = this.getCachedAnalysis(cacheKey)
        if (cached) {
          logger.info('Análise recuperada do cache', { reportType, cacheKey })
          return cached
        }
      }

      let attempts = 0
      while (attempts <= this.maxRetries) {
        try {
          attempts++
          logger.info(`Gerando relatório ${reportType} com DeepSeek AI`, {
            attempt: attempts,
            specialized: true,
            autismFocused: true,
          })

          const specializedPrompt = await this.buildSpecializedPrompt(
            enrichedData,
            reportType,
            options
          )
          const systemPrompt = this.getSpecializedSystemPrompt(reportType)

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), this.timeout)

          const requestBody = {
            model: this.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: specializedPrompt },
            ],
            temperature: this.adjustTemperatureForReportType(reportType),
            max_tokens: this.maxTokens,
            top_p: 0.9,
            frequency_penalty: 0.1,
            presence_penalty: 0.1,
          }

          const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            const errorMessage = errorData.error?.message || response.statusText

            if (
              (response.status === 429 || response.status >= 500) &&
              attempts <= this.maxRetries
            ) {
              logger.warn(`Erro na API DeepSeek: ${errorMessage}`, {
                status: response.status,
                attempt: attempts,
              })
              await this.waitWithBackoff(attempts)
              continue
            }
            throw new Error(`DeepSeek API Error: ${errorMessage}`)
          }

          const result = await response.json()
          const processedReport = await this.processAdvancedAIResponse(
            result,
            reportType,
            enrichedData,
            options
          )

          // Cachear resultado se habilitado
          if (options.useCache !== false) {
            this.cacheAnalysis(cacheKey, processedReport, options.cacheTTL)
          }

          // Registrar métricas de sucesso
          this.recordSuccessMetrics(startTime, reportType)

          return processedReport
        } catch (error) {
          if (error.name === 'AbortError') {
            logger.warn(`Timeout na solicitação à API após ${this.timeout}ms`, {
              attempt: attempts,
            })
            if (attempts <= this.maxRetries) {
              await this.waitWithBackoff(attempts)
              continue
            }
            throw new Error(`Timeout na comunicação com a API DeepSeek após ${attempts} tentativas`)
          }

          if (attempts <= this.maxRetries) {
            logger.warn(`Erro na chamada à API DeepSeek: ${error.message}`, { attempt: attempts })
            await this.waitWithBackoff(attempts)
            continue
          }

          logger.error('Todas as tentativas de chamada à API DeepSeek falharam', {
            error: error.message,
            reportType,
            attempts,
          })
          throw error
        }
      }
    } catch (error) {
      this.recordErrorMetrics(error, reportType)
      throw error
    }
  }
  /**
   * Enriquece dados da sessão com análises especializadas
   */
  async enrichSessionData(sessionData, options = {}) {
    const enriched = {
      ...sessionData,
      autismSpecificMetrics: await this.extractAutismMetrics(sessionData),
      therapeuticContext: await this.therapeuticAnalyzer.analyzeSession(sessionData),
      developmentalMarkers: this.identifyDevelopmentalMarkers(sessionData),
      sensoryProfile: this.analyzeSensoryPatterns(sessionData),
      communicationPatterns: this.analyzeCommunicationPatterns(sessionData),
      socialInteractionData: this.analyzeSocialInteraction(sessionData),
      executiveFunctionMetrics: this.analyzeExecutiveFunction(sessionData),
      behavioralRegulationData: this.analyzeBehavioralRegulation(sessionData),
      enrichmentTimestamp: Date.now(),
      enrichmentVersion: '2.0',
    }

    return enriched
  }

  /**
   * Extrai métricas específicas de autismo dos dados da sessão
   */
  async extractAutismMetrics(sessionData) {
    const metrics = {
      sensoryProcessing: {
        overresponsivity: this.calculateSensoryOverresponsivity(sessionData),
        underresponsivity: this.calculateSensoryUnderresponsivity(sessionData),
        seeking: this.calculateSensorySeeking(sessionData),
        modulation: this.calculateSensoryModulation(sessionData),
      },
      socialCommunication: {
        jointAttention: this.analyzeJointAttention(sessionData),
        socialReciprocity: this.analyzeSocialReciprocity(sessionData),
        nonverbalCommunication: this.analyzeNonverbalCommunication(sessionData),
        pragmaticLanguage: this.analyzePragmaticLanguage(sessionData),
      },
      restrictiveRepetitive: {
        repetitiveMotor: this.analyzeRepetitiveMotor(sessionData),
        insistenceSameness: this.analyzeInsistenceSameness(sessionData),
        restrictedInterests: this.analyzeRestrictedInterests(sessionData),
        sensoryInterests: this.analyzeSensoryInterests(sessionData),
      },
      cognitiveProfile: {
        executiveFunction: this.analyzeExecutiveFunctionAutism(sessionData),
        centralCoherence: this.analyzeCentralCoherence(sessionData),
        theoryOfMind: this.analyzeTheoryOfMind(sessionData),
        mentalFlexibility: this.analyzeMentalFlexibility(sessionData),
      },
    }

    return metrics
  }

  /**
   * Constrói prompt especializado em autismo
   */
  async buildSpecializedPrompt(enrichedData, reportType, options = {}) {
    const baseContext = this.getAutismContextPrompt()
    const specificContext = this.getReportTypeContext(reportType)
    const dataAnalysis = this.formatDataForAnalysis(enrichedData)
    const specializedInstructions = this.getSpecializedInstructions(reportType, options)

    return `${baseContext}

${specificContext}

DADOS DA SESSÃO PARA ANÁLISE:
${dataAnalysis}

INSTRUÇÕES ESPECIALIZADAS:
${specializedInstructions}

Por favor, forneça uma análise detalhada em formato JSON estruturado, focando nos aspectos específicos do autismo identificados nos dados.`
  }

  /**
   * Obtém prompt de contexto especializado em autismo
   */
  getAutismContextPrompt() {
    return `Como especialista em Transtorno do Espectro do Autismo (TEA) e neuroeducação, você possui conhecimento profundo sobre:

1. CRITÉRIOS DIAGNÓSTICOS DSM-5:
   - Déficits na comunicação e interação social
   - Padrões restritivos e repetitivos de comportamento
   - Sintomas presentes no desenvolvimento precoce
   - Prejuízo funcional significativo

2. PERFIS NEUROPSICOLÓGICOS:
   - Função executiva e flexibilidade cognitiva
   - Processamento sensorial e integração
   - Teoria da mente e cognição social
   - Coerência central e atenção aos detalhes

3. ABORDAGENS TERAPÊUTICAS BASEADAS EM EVIDÊNCIA:
   - Análise Aplicada do Comportamento (ABA)
   - TEACCH (Tratamento e Educação)
   - Integração Sensorial
   - Comunicação Aumentativa e Alternativa

4. DESENVOLVIMENTO ATÍPICO:
   - Marcos do desenvolvimento social
   - Padrões de aprendizagem únicos
   - Forças e desafios individuais
   - Estratégias de apoio personalizadas`
  }

  /**
   * Obtém contexto específico do tipo de relatório
   */
  getReportTypeContext(reportType) {
    const contexts = {
      comprehensive: `Realize uma análise ABRANGENTE considerando todos os domínios do autismo:
        - Perfil sensorial completo
        - Comunicação social e pragmática
        - Comportamentos restritivos/repetitivos
        - Função executiva e regulação
        - Recomendações terapêuticas integradas`,

      cognitive: `Foque na análise COGNITIVA especializada em autismo:
        - Perfil de função executiva (planejamento, flexibilidade, inibição)
        - Processamento de informações sociais
        - Atenção e memória de trabalho
        - Estilos de processamento (local vs global)
        - Pontos fortes cognitivos únicos`,

      behavioral: `Analise os padrões COMPORTAMENTAIS específicos do autismo:
        - Autorregulação emocional e comportamental
        - Padrões restritivos e repetitivos
        - Respostas a mudanças e transições
        - Comportamentos adaptativos e desafiadores
        - Estratégias de intervenção comportamental`,

      sensory: `Concentre-se no perfil SENSORIAL detalhado:
        - Padrões de responsividade sensorial
        - Preferências e aversões sensoriais
        - Impacto no funcionamento diário
        - Estratégias de regulação sensorial
        - Recomendações de modificação ambiental`,

      social: `Analise as habilidades de COMUNICAÇÃO SOCIAL:
        - Reciprocidade socioemocional
        - Comunicação não verbal
        - Desenvolvimento de relacionamentos
        - Pragmática da linguagem
        - Intervenções sociais recomendadas`,
    }

    return contexts[reportType] || contexts.comprehensive
  }

  /**
   * Obtém prompt de sistema especializado
   */
  getSpecializedSystemPrompt(reportType) {
    return `Você é um neuropsicólogo especialista em Transtorno do Espectro do Autismo (TEA) com ampla experiência em:

- Avaliação neuropsicológica especializada em autismo
- Análise de padrões comportamentais e cognitivos únicos
- Desenvolvimento de planos de intervenção personalizados
- Conhecimento profundo dos critérios diagnósticos DSM-5
- Abordagens terapêuticas baseadas em evidência
- Compreensão da neurodiversidade e pontos fortes do autismo

Sua análise deve ser precisa, compassiva e focada nos pontos fortes, fornecendo insights acionáveis para apoiar o desenvolvimento da pessoa autista.

IMPORTANTE: 
- Use linguagem respeitosa e centrada na pessoa
- Identifique tanto desafios quanto pontos fortes
- Forneça recomendações práticas e específicas
- Considere a perspectiva da neurodiversidade
- Base suas conclusões em evidências dos dados fornecidos`
  }
  processAIResponse(apiResponse, reportType) {
    try {
      const content = apiResponse.choices[0].message.content
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/)
      let parsedData
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        parsedData = this.structureTextResponse(content, reportType)
      }
      return {
        id: `ai_report_${Date.now()}`,
        generatedAt: Date.now(),
        analysisType: reportType,
        ...parsedData,
      }
    } catch (error) {
      logger.error('Erro ao processar resposta da API', { error: error.message })
      return {
        id: `ai_report_${Date.now()}`,
        generatedAt: Date.now(),
        analysisType: reportType,
        errorProcessing: true,
        rawContent: apiResponse.choices[0]?.message.content || 'Sem conteúdo disponível',
        cognitiveProfile: {
          executiveFunction: { score: 50, strengths: [], challenges: [], recommendations: [] },
          attentionProfile: {
            type: 'Não determinado',
            sustainedAttention: 50,
            selectiveAttention: 50,
            dividedAttention: 50,
          },
          processingSpeed: { overall: 50, visual: 50, auditory: 50, motor: 50, insights: [] },
        },
      }
    }
  }

  structureTextResponse(textContent, reportType) {
    return {
      cognitiveProfile: {
        executiveFunction: {
          score: this.extractNumericValue(textContent, 'função executiva', 'score', 70),
          strengths: this.extractListItems(textContent, 'pontos fortes'),
          challenges: this.extractListItems(textContent, 'desafios'),
          recommendations: this.extractListItems(textContent, 'recomendações'),
        },
        attentionProfile: {
          type: this.extractTextValue(textContent, 'tipo de atenção', 'Atenção variável'),
          sustainedAttention: this.extractNumericValue(textContent, 'atenção sustentada', '', 50),
          selectiveAttention: this.extractNumericValue(textContent, 'atenção seletiva', '', 50),
          dividedAttention: this.extractNumericValue(textContent, 'atenção dividida', '', 50),
        },
        processingSpeed: {
          overall: this.extractNumericValue(
            textContent,
            'velocidade de processamento',
            'geral',
            50
          ),
          visual: this.extractNumericValue(textContent, 'velocidade visual', '', 50),
          auditory: this.extractNumericValue(textContent, 'velocidade auditiva', '', 50),
          motor: this.extractNumericValue(textContent, 'velocidade motora', '', 50),
          insights: this.extractListItems(textContent, 'insights'),
        },
      },
      behavioralInsights: {
        گل_engagement: {
          optimalTimes: this.extractListItems(textContent, 'horários ideais'),
          engagementTriggers: this.extractListItems(textContent, 'gatilhos de engajamento'),
          disengagementSigns: this.extractListItems(textContent, 'sinais de desengajamento'),
        },
      },
      personalizedRecommendations: {
        immediate: [
          {
            category: 'Interface',
            action: 'Ajuste de interface baseado na análise',
            impact: 'Médio',
            reasoning: 'Baseado nos padrões',
          },
        ],
        longTerm: [
          {
            category: 'Desenvolvimento',
            goal: 'Melhorar áreas identificadas',
            strategy: 'Exercícios personalizados',
            timeline: '2-4 meses',
          },
        ],
      },
    }
  }

  extractNumericValue(text, context, subContext, defaultValue = 50) {
    try {
      const regex = new RegExp(`${context}[^0-9]*${subContext}[^0-9]*(\\d+)`, 'i')
      const match = text.match(regex)
      return match ? parseInt(match[1], 10) : defaultValue
    } catch {
      return defaultValue
    }
  }

  extractTextValue(textContent, context, defaultValue = '') {
    try {
      const regex = new RegExp(`${context}[^:\\n]*:([^\\n]*)`, 'i')
      const match = textContent.match(regex)
      return match ? match[1].trim() : defaultValue
    } catch {
      return defaultValue
    }
  }
  extractListItems(text, context) {
    try {
      const contextRegex = new RegExp(`${context}[^:]*:([\\s\\S]*?)(?=\\n\\n|$)`, 'i')
      const contextMatch = text.match(contextRegex)
      if (contextMatch) {
        const itemsText = contextMatch[1]
        const items = itemsText.split(/\n\s*[-.*+]\s*/).filter(Boolean)
        return items.map((item) => item.trim()).filter((item) => item.length > 0)
      }
      return []
    } catch {
      return []
    }
  }

  /**
   * Processa resposta avançada da IA integrando recomendações terapêuticas
   * @param {Object} aiResult - Resultado bruto da API DeepSeek
   * @param {string} reportType - Tipo de relatório solicitado
   * @param {Object} enrichedData - Dados enriquecidos da sessão
   * @param {Object} options - Opções de processamento
   */
  async processAdvancedAIResponse(aiResult, reportType, enrichedData, options = {}) {
    try {
      logger.info('Processando resposta avançada da IA', {
        reportType,
        hasTherapeuticRecommendations: !!enrichedData.therapeuticRecommendations,
      })

      // Extrair conteúdo da resposta da IA
      const aiContent = aiResult?.choices?.[0]?.message?.content || ''

      if (!aiContent) {
        throw new Error('Resposta da IA vazia ou inválida')
      }

      // Estrutura base do relatório processado
      const processedReport = {
        id: `ai_report_${Date.now()}`,
        generatedAt: Date.now(),
        analysisType: reportType,
        isRealAI: true,
        model: this.model,
        rawContent: aiContent,

        // Integrar recomendações terapêuticas se disponíveis
        therapeuticRecommendations: enrichedData.therapeuticRecommendations || [],

        // Análise cognitiva extraída da IA
        cognitiveProfile: this.extractCognitiveProfile(aiContent),

        // Insights comportamentais
        behavioralInsights: this.extractBehavioralInsights(aiContent),

        // Recomendações personalizadas da IA
        personalizedRecommendations: this.extractPersonalizedRecommendations(aiContent),

        // Comparação populacional
        populationComparison: this.extractPopulationComparison(aiContent),

        // Métricas de processamento
        processingMetrics: {
          processingTime: Date.now() - enrichedData.enrichmentTimestamp,
          dataQuality: this.assessDataQuality(enrichedData),
          aiConfidence: this.extractConfidenceScore(aiContent),
          therapeuticIntegration: enrichedData.therapeuticRecommendations?.length > 0,
        },
      }

      // Enriquecer com análises terapêuticas específicas se disponíveis
      if (
        enrichedData.therapeuticRecommendations &&
        enrichedData.therapeuticRecommendations.length > 0
      ) {
        processedReport.therapeuticAnalysis = {
          integratedRecommendations: this.integrateTherapeuticWithAI(
            enrichedData.therapeuticRecommendations,
            aiContent
          ),
          prioritizedInterventions: this.prioritizeInterventions(
            enrichedData.therapeuticRecommendations
          ),
          autismSpecificInsights: this.extractAutismSpecificInsights(
            enrichedData.therapeuticRecommendations,
            aiContent
          ),
        }

        logger.info('Recomendações terapêuticas integradas ao relatório de IA', {
          count: enrichedData.therapeuticRecommendations.length,
          reportType,
        })
      }

      // Registrar métricas de qualidade
      this.aiMetrics.successfulAnalyses++
      this.aiMetrics.specializedInsights += processedReport.therapeuticRecommendations.length

      return processedReport
    } catch (error) {
      logger.error('Erro ao processar resposta avançada da IA', {
        error: error.message,
        reportType,
        hasEnrichedData: !!enrichedData,
      })
      throw error
    }
  }

  /**
   * Integra recomendações terapêuticas com insights da IA
   */
  integrateTherapeuticWithAI(therapeuticRecommendations, aiContent) {
    return therapeuticRecommendations.map((recommendation) => ({
      ...recommendation,
      aiCorrelation: this.findAICorrelation(recommendation, aiContent),
      priorityScore: this.calculatePriorityScore(recommendation),
      implementationGuidance: this.generateImplementationGuidance(recommendation),
    }))
  }

  /**
   * Prioriza intervenções baseadas em dados comportamentais e terapêuticos
   */
  prioritizeInterventions(therapeuticRecommendations) {
    return therapeuticRecommendations
      .map((rec) => ({
        ...rec,
        priorityScore: this.calculatePriorityScore(rec),
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 5) // Top 5 prioridades
  }

  /**
   * Extrai insights específicos para autismo
   */
  extractAutismSpecificInsights(therapeuticRecommendations, aiContent) {
    const autismKeywords = [
      'sensory',
      'executive function',
      'communication',
      'social',
      'behavioral',
    ]

    return therapeuticRecommendations
      .filter((rec) =>
        autismKeywords.some(
          (keyword) =>
            rec.area?.toLowerCase().includes(keyword) || rec.type?.toLowerCase().includes(keyword)
        )
      )
      .map((rec) => ({
        area: rec.area,
        type: rec.type,
        recommendation: rec.recommendation,
        autismSpecificOptimizations: rec.autismOptimizations || rec.autismSpecific || [],
        aiAlignment: this.assessAIAlignment(rec, aiContent),
      }))
  }

  /**
   * Calcula score de prioridade para intervenções
   */
  calculatePriorityScore(recommendation) {
    let score = 50 // Base score

    // Aumentar prioridade para áreas críticas
    const criticalAreas = ['persistence', 'working_memory', 'sensory']
    if (criticalAreas.includes(recommendation.area)) {
      score += 20
    }

    // Aumentar prioridade para tipos de suporte específicos
    const priorityTypes = ['behavioral_strategy', 'cognitive_support', 'environmental_modification']
    if (priorityTypes.includes(recommendation.type)) {
      score += 15
    }

    // Ajustar baseado em disponibilidade de otimizações específicas para autismo
    if (recommendation.autismOptimizations || recommendation.autismSpecific) {
      score += 10
    }

    return Math.min(score, 100) // Cap at 100
  }

  /**
   * Encontra correlação entre recomendação terapêutica e conteúdo da IA
   */
  findAICorrelation(recommendation, aiContent) {
    const keywords = [recommendation.area, recommendation.type].filter(Boolean)
    const correlations = keywords.filter((keyword) =>
      aiContent.toLowerCase().includes(keyword.toLowerCase())
    )

    return {
      hasCorrelation: correlations.length > 0,
      matchedKeywords: correlations,
      correlationStrength: correlations.length / keywords.length,
    }
  }

  /**
   * Gera orientações de implementação
   */
  generateImplementationGuidance(recommendation) {
    const baseGuidance = {
      immediateSteps: [],
      timeline: 'Implementar gradualmente ao longo de 2-4 semanas',
      monitoringPoints: ['Observe mudanças comportamentais', 'Documente progressos'],
    }

    // Personalizar baseado no tipo de recomendação
    switch (recommendation.type) {
      case 'behavioral_strategy':
        baseGuidance.immediateSteps = [
          'Estabelecer rotina consistente',
          'Definir expectativas claras',
          'Implementar sistema de recompensas',
        ]
        break
      case 'cognitive_support':
        baseGuidance.immediateSteps = [
          'Criar apoios visuais',
          'Dividir tarefas em etapas menores',
          'Estabelecer checkpoints regulares',
        ]
        break
      case 'environmental_modification':
        baseGuidance.immediateSteps = [
          'Avaliar ambiente atual',
          'Identificar modificações necessárias',
          'Implementar mudanças gradualmente',
        ]
        break
    }

    return baseGuidance
  }

  /**
   * Avalia alinhamento entre recomendação e análise da IA
   */
  assessAIAlignment(recommendation, aiContent) {
    const alignmentScore = this.findAICorrelation(recommendation, aiContent).correlationStrength

    if (alignmentScore > 0.7) return 'high'
    if (alignmentScore > 0.4) return 'medium'
    return 'low'
  }

  /**
   * Avalia qualidade dos dados para processamento
   */
  assessDataQuality(enrichedData) {
    let qualityScore = 0
    const totalPossible = 7

    if (enrichedData.autismSpecificMetrics) qualityScore++
    if (enrichedData.therapeuticContext) qualityScore++
    if (enrichedData.developmentalMarkers) qualityScore++
    if (enrichedData.sensoryProfile) qualityScore++
    if (enrichedData.communicationPatterns) qualityScore++
    if (enrichedData.executiveFunctionMetrics) qualityScore++
    if (enrichedData.therapeuticRecommendations?.length > 0) qualityScore++

    return Math.round((qualityScore / totalPossible) * 100)
  }

  /**
   * Extrai score de confiança da resposta da IA
   */
  extractConfidenceScore(aiContent) {
    // Buscar indicadores de confiança no conteúdo
    const confidenceIndicators = [
      /confidence[:\s]*(\d+)%/i,
      /certainty[:\s]*(\d+)%/i,
      /accuracy[:\s]*(\d+)%/i,
    ]

    for (const indicator of confidenceIndicators) {
      const match = aiContent.match(indicator)
      if (match) {
        return parseInt(match[1], 10)
      }
    }

    // Score baseado na qualidade e detalhamento da resposta
    const wordCount = aiContent.split(/\s+/).length
    if (wordCount > 1000) return 85
    if (wordCount > 500) return 75
    if (wordCount > 200) return 65
    return 50
  }
}

const deepSeekAIService = new DeepSeekAIService()
export default deepSeekAIService
