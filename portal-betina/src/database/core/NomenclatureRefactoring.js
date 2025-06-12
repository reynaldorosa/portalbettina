/**
 * NOMENCLATURE REFACTORING SYSTEM - SISTEMA DE PADRONIZAÇÃO DE NOMENCLATURA
 * Sistema automatizado para padronizar nomenclatura em todo o projeto
 *
 * @version 1.0.0
 * @created 2025-01-08
 * @purpose Refatoração e padronização de nomenclatura
 */

import logger from '../../utils/logger.js'

// Padrões de nomenclatura
export const NAMING_CONVENTIONS = {
  // JavaScript/TypeScript
  CAMEL_CASE: /^[a-z][a-zA-Z0-9]*$/, // variáveis, funções
  PASCAL_CASE: /^[A-Z][a-zA-Z0-9]*$/, // classes, componentes
  SNAKE_CASE: /^[a-z][a-z0-9_]*$/, // constantes de banco
  SCREAMING_SNAKE_CASE: /^[A-Z][A-Z0-9_]*$/, // constantes globais
  KEBAB_CASE: /^[a-z][a-z0-9-]*$/, // arquivos, CSS

  // React específico
  COMPONENT_NAME: /^[A-Z][a-zA-Z0-9]*$/, // componentes React
  HOOK_NAME: /^use[A-Z][a-zA-Z0-9]*$/, // hooks React

  // Database
  TABLE_NAME: /^[a-z][a-z0-9_]*$/, // tabelas
  COLUMN_NAME: /^[a-z][a-z0-9_]*$/, // colunas

  // Constants
  ENUM_VALUE: /^[A-Z][A-Z0-9_]*$/, // valores de enum
  CONFIG_KEY: /^[A-Z][A-Z0-9_]*$/, // chaves de configuração
}

// Regras de refatoração por tipo
export const REFACTORING_RULES = {
  variables: {
    pattern: NAMING_CONVENTIONS.CAMEL_CASE,
    examples: ['userName', 'profileData', 'isAuthenticated'],
    corrections: {
      user_name: 'userName',
      'profile-data': 'profileData',
      is_authenticated: 'isAuthenticated',
      UserName: 'userName',
      PROFILE_DATA: 'profileData',
    },
  },

  functions: {
    pattern: NAMING_CONVENTIONS.CAMEL_CASE,
    examples: ['calculateScore', 'validateInput', 'handleSubmit'],
    corrections: {
      Calculate_Score: 'calculateScore',
      'validate-input': 'validateInput',
      HandleSubmit: 'handleSubmit',
      VALIDATE_INPUT: 'validateInput',
    },
  },

  classes: {
    pattern: NAMING_CONVENTIONS.PASCAL_CASE,
    examples: ['UserProfile', 'DatabaseService', 'MachineLearningModel'],
    corrections: {
      userProfile: 'UserProfile',
      database_service: 'DatabaseService',
      'machine-learning-model': 'MachineLearningModel',
      MACHINE_LEARNING_MODEL: 'MachineLearningModel',
    },
  },

  components: {
    pattern: NAMING_CONVENTIONS.COMPONENT_NAME,
    examples: ['ActivityMenu', 'PerformanceDashboard', 'MLOrchestrator'],
    corrections: {
      activityMenu: 'ActivityMenu',
      'performance-dashboard': 'PerformanceDashboard',
      ml_orchestrator: 'MLOrchestrator',
    },
  },

  hooks: {
    pattern: NAMING_CONVENTIONS.HOOK_NAME,
    examples: ['useAdvancedActivity', 'usePerformanceMonitoring', 'useMetrics'],
    corrections: {
      advancedActivity: 'useAdvancedActivity',
      performanceMonitoring: 'usePerformanceMonitoring',
      metrics: 'useMetrics',
    },
  },

  constants: {
    pattern: NAMING_CONVENTIONS.SCREAMING_SNAKE_CASE,
    examples: ['MAX_RETRY_ATTEMPTS', 'DEFAULT_TIMEOUT', 'API_BASE_URL'],
    corrections: {
      maxRetryAttempts: 'MAX_RETRY_ATTEMPTS',
      defaultTimeout: 'DEFAULT_TIMEOUT',
      apiBaseUrl: 'API_BASE_URL',
    },
  },

  files: {
    pattern: NAMING_CONVENTIONS.KEBAB_CASE,
    examples: ['user-profile.js', 'database-service.js', 'ml-orchestrator.js'],
    corrections: {
      'UserProfile.js': 'user-profile.js',
      'database_service.js': 'database-service.js',
      'MLOrchestrator.js': 'ml-orchestrator.js',
    },
  },
}

// Padrões específicos para autismo
export const AUTISM_SPECIFIC_PATTERNS = {
  // Prefixos para funcionalidades específicas
  sensory: ['sensory', 'multisensory', 'haptic', 'tactile', 'visual', 'auditory'],
  cognitive: ['cognitive', 'executive', 'attention', 'memory', 'processing'],
  behavioral: ['behavioral', 'repetitive', 'stimming', 'routine', 'transition'],
  therapeutic: ['therapeutic', 'intervention', 'support', 'adaptive', 'accommodation'],

  // Sufixos comuns
  suffixes: ['Profile', 'Tracker', 'Analyzer', 'Detector', 'Predictor', 'Classifier'],

  // Nomenclatura padronizada para conceitos de autismo
  concepts: {
    sensoryOverload: 'sensoryOverload',
    executiveFunction: 'executiveFunction',
    socialCommunication: 'socialCommunication',
    repetitiveBehavior: 'repetitiveBehavior',
    sensoryProcessing: 'sensoryProcessing',
    cognitiveFlexibility: 'cognitiveFlexibility',
    workingMemory: 'workingMemory',
    attentionSpan: 'attentionSpan',
  },
}

/**
 * Classe principal do sistema de refatoração
 */
class NomenclatureRefactoring {
  constructor() {
    this.violations = new Map()
    this.corrections = new Map()
    this.statistics = {
      totalFiles: 0,
      totalViolations: 0,
      totalCorrections: 0,
      violationsByType: {},
      correctionsByType: {},
    }

    this.init()
  }

  /**
   * Inicializa o sistema
   */
  init() {
    // Inicializar estatísticas por tipo
    Object.keys(REFACTORING_RULES).forEach((type) => {
      this.statistics.violationsByType[type] = 0
      this.statistics.correctionsByType[type] = 0
    })

    logger.info('🔧 NomenclatureRefactoring inicializado')
  }

  /**
   * Analisa um arquivo para violações de nomenclatura
   */
  analyzeFile(filePath, content) {
    const violations = []

    try {
      // Analisar diferentes tipos de nomenclatura
      violations.push(...this.analyzeVariables(content, filePath))
      violations.push(...this.analyzeFunctions(content, filePath))
      violations.push(...this.analyzeClasses(content, filePath))
      violations.push(...this.analyzeComponents(content, filePath))
      violations.push(...this.analyzeHooks(content, filePath))
      violations.push(...this.analyzeConstants(content, filePath))

      // Analisar padrões específicos para autismo
      violations.push(...this.analyzeAutismSpecificPatterns(content, filePath))

      // Armazenar violações
      if (violations.length > 0) {
        this.violations.set(filePath, violations)
        this.statistics.totalViolations += violations.length
      }

      this.statistics.totalFiles++
    } catch (error) {
      logger.error('Erro ao analisar arquivo', { filePath, error: error.message })
    }

    return violations
  }

  /**
   * Analisa variáveis
   */
  analyzeVariables(content, filePath) {
    const violations = []
    const variableRegex = /(?:let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g

    let match
    while ((match = variableRegex.exec(content)) !== null) {
      const variableName = match[1]

      if (!this.isValidNaming(variableName, 'variables')) {
        const correction = this.suggestCorrection(variableName, 'variables')

        violations.push({
          type: 'variable',
          name: variableName,
          line: this.getLineNumber(content, match.index),
          current: variableName,
          suggested: correction,
          rule: 'camelCase for variables',
        })
      }
    }

    return violations
  }

  /**
   * Analisa funções
   */
  analyzeFunctions(content, filePath) {
    const violations = []
    const functionRegex =
      /(?:function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)|([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*(?:function|\([^)]*\)\s*=>))/g

    let match
    while ((match = functionRegex.exec(content)) !== null) {
      const functionName = match[1] || match[2]

      if (functionName && !this.isValidNaming(functionName, 'functions')) {
        const correction = this.suggestCorrection(functionName, 'functions')

        violations.push({
          type: 'function',
          name: functionName,
          line: this.getLineNumber(content, match.index),
          current: functionName,
          suggested: correction,
          rule: 'camelCase for functions',
        })
      }
    }

    return violations
  }

  /**
   * Analisa classes
   */
  analyzeClasses(content, filePath) {
    const violations = []
    const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g

    let match
    while ((match = classRegex.exec(content)) !== null) {
      const className = match[1]

      if (!this.isValidNaming(className, 'classes')) {
        const correction = this.suggestCorrection(className, 'classes')

        violations.push({
          type: 'class',
          name: className,
          line: this.getLineNumber(content, match.index),
          current: className,
          suggested: correction,
          rule: 'PascalCase for classes',
        })
      }
    }

    return violations
  }

  /**
   * Analisa componentes React
   */
  analyzeComponents(content, filePath) {
    const violations = []

    // Detectar se é arquivo React
    if (!content.includes('React') && !content.includes('jsx')) {
      return violations
    }

    const componentRegex =
      /(?:const|function)\s+([A-Z][a-zA-Z0-9]*)\s*=|function\s+([A-Z][a-zA-Z0-9]*)\s*\(/g

    let match
    while ((match = componentRegex.exec(content)) !== null) {
      const componentName = match[1] || match[2]

      if (componentName && !this.isValidNaming(componentName, 'components')) {
        const correction = this.suggestCorrection(componentName, 'components')

        violations.push({
          type: 'component',
          name: componentName,
          line: this.getLineNumber(content, match.index),
          current: componentName,
          suggested: correction,
          rule: 'PascalCase for React components',
        })
      }
    }

    return violations
  }

  /**
   * Analisa hooks React
   */
  analyzeHooks(content, filePath) {
    const violations = []

    const hookRegex = /(?:const|function)\s+(use[a-zA-Z0-9]*)/g

    let match
    while ((match = hookRegex.exec(content)) !== null) {
      const hookName = match[1]

      if (!this.isValidNaming(hookName, 'hooks')) {
        const correction = this.suggestCorrection(hookName, 'hooks')

        violations.push({
          type: 'hook',
          name: hookName,
          line: this.getLineNumber(content, match.index),
          current: hookName,
          suggested: correction,
          rule: 'camelCase starting with "use" for hooks',
        })
      }
    }

    return violations
  }

  /**
   * Analisa constantes
   */
  analyzeConstants(content, filePath) {
    const violations = []

    const constantRegex = /const\s+([A-Z][A-Z0-9_]*)\s*=/g

    let match
    while ((match = constantRegex.exec(content)) !== null) {
      const constantName = match[1]

      if (!this.isValidNaming(constantName, 'constants')) {
        const correction = this.suggestCorrection(constantName, 'constants')

        violations.push({
          type: 'constant',
          name: constantName,
          line: this.getLineNumber(content, match.index),
          current: constantName,
          suggested: correction,
          rule: 'SCREAMING_SNAKE_CASE for constants',
        })
      }
    }

    return violations
  }

  /**
   * Analisa padrões específicos para autismo
   */
  analyzeAutismSpecificPatterns(content, filePath) {
    const violations = []

    // Verificar conceitos de autismo com nomenclatura incorreta
    Object.entries(AUTISM_SPECIFIC_PATTERNS.concepts).forEach(([incorrect, correct]) => {
      const regex = new RegExp(`\\b${incorrect}\\b`, 'g')
      let match

      while ((match = regex.exec(content)) !== null) {
        if (match[0] !== correct) {
          violations.push({
            type: 'autism_concept',
            name: match[0],
            line: this.getLineNumber(content, match.index),
            current: match[0],
            suggested: correct,
            rule: 'Padronização de conceitos de autismo',
          })
        }
      }
    })

    return violations
  }

  /**
   * Verifica se um nome segue a convenção correta
   */
  isValidNaming(name, type) {
    const rule = REFACTORING_RULES[type]
    if (!rule) return true

    return rule.pattern.test(name)
  }

  /**
   * Sugere correção para um nome
   */
  suggestCorrection(name, type) {
    const rule = REFACTORING_RULES[type]
    if (!rule) return name

    // Verificar correções predefinidas
    if (rule.corrections[name]) {
      return rule.corrections[name]
    }

    // Aplicar conversão baseada no tipo
    switch (type) {
      case 'variables':
      case 'functions':
      case 'hooks':
        return this.toCamelCase(name)

      case 'classes':
      case 'components':
        return this.toPascalCase(name)

      case 'constants':
        return this.toScreamingSnakeCase(name)

      default:
        return name
    }
  }

  /**
   * Converte para camelCase
   */
  toCamelCase(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
      .replace(/^[A-Z]/, (char) => char.toLowerCase())
  }

  /**
   * Converte para PascalCase
   */
  toPascalCase(str) {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
      .replace(/^[a-z]/, (char) => char.toUpperCase())
  }

  /**
   * Converte para SCREAMING_SNAKE_CASE
   */
  toScreamingSnakeCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[-\s]+/g, '_')
      .toUpperCase()
  }

  /**
   * Obtém número da linha de uma posição no texto
   */
  getLineNumber(content, position) {
    return content.substring(0, position).split('\n').length
  }

  /**
   * Gera relatório de violações
   */
  generateViolationsReport() {
    const report = {
      summary: {
        totalFiles: this.statistics.totalFiles,
        totalViolations: this.statistics.totalViolations,
        violationsByType: { ...this.statistics.violationsByType },
      },
      violationsByFile: {},
      topViolationTypes: this.getTopViolationTypes(),
      recommendations: this.generateRecommendations(),
    }

    // Organizar violações por arquivo
    for (const [filePath, violations] of this.violations.entries()) {
      report.violationsByFile[filePath] = {
        count: violations.length,
        violations: violations.map((v) => ({
          type: v.type,
          name: v.name,
          line: v.line,
          current: v.current,
          suggested: v.suggested,
          rule: v.rule,
        })),
      }

      // Atualizar estatísticas por tipo
      violations.forEach((violation) => {
        this.statistics.violationsByType[violation.type] =
          (this.statistics.violationsByType[violation.type] || 0) + 1
      })
    }

    logger.info('📊 Relatório de violações gerado', report.summary)
    return report
  }

  /**
   * Obtém tipos de violação mais comuns
   */
  getTopViolationTypes() {
    return Object.entries(this.statistics.violationsByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }))
  }

  /**
   * Gera recomendações
   */
  generateRecommendations() {
    const recommendations = []

    const topViolations = this.getTopViolationTypes()

    topViolations.forEach(({ type, count }) => {
      if (count > 10) {
        recommendations.push({
          priority: 'HIGH',
          type: 'NAMING_CONVENTION',
          message: `${count} violações de nomenclatura do tipo "${type}" encontradas`,
          action: `Revisar e corrigir nomenclatura de ${type}`,
          examples: REFACTORING_RULES[type]?.examples || [],
        })
      }
    })

    if (this.statistics.totalViolations > 50) {
      recommendations.push({
        priority: 'MEDIUM',
        type: 'CODE_QUALITY',
        message: 'Alto número de violações de nomenclatura detectadas',
        action: 'Implementar linting automático e educação da equipe',
        tools: ['ESLint', 'Prettier', 'Code reviews'],
      })
    }

    return recommendations
  }

  /**
   * Aplica correções automáticas
   */
  applyAutomaticCorrections(filePath, content) {
    let correctedContent = content
    const violations = this.violations.get(filePath) || []
    const appliedCorrections = []

    violations.forEach((violation) => {
      if (this.canAutoCorrect(violation)) {
        const regex = new RegExp(`\\b${violation.current}\\b`, 'g')
        const matches = correctedContent.match(regex)

        if (matches) {
          correctedContent = correctedContent.replace(regex, violation.suggested)
          appliedCorrections.push({
            type: violation.type,
            from: violation.current,
            to: violation.suggested,
            occurrences: matches.length,
          })
        }
      }
    })

    this.statistics.totalCorrections += appliedCorrections.length

    if (appliedCorrections.length > 0) {
      this.corrections.set(filePath, appliedCorrections)
      logger.info(`✅ Aplicadas ${appliedCorrections.length} correções em ${filePath}`)
    }

    return {
      correctedContent,
      appliedCorrections,
    }
  }

  /**
   * Verifica se uma violação pode ser corrigida automaticamente
   */
  canAutoCorrect(violation) {
    // Tipos seguros para correção automática
    const safeTypes = ['variable', 'function', 'constant', 'autism_concept']
    return safeTypes.includes(violation.type)
  }

  /**
   * Obtém estatísticas
   */
  getStatistics() {
    return {
      ...this.statistics,
      violationsCount: this.violations.size,
      correctionsCount: this.corrections.size,
      completionRate:
        this.statistics.totalViolations > 0
          ? (this.statistics.totalCorrections / this.statistics.totalViolations) * 100
          : 100,
    }
  }

  /**
   * Exporta relatório
   */
  exportReport(format = 'json') {
    const report = this.generateViolationsReport()

    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2)

      case 'csv':
        return this.exportToCSV(report)

      case 'md':
        return this.exportToMarkdown(report)

      default:
        return report
    }
  }

  /**
   * Exporta para CSV
   */
  exportToCSV(report) {
    const headers = ['File', 'Type', 'Line', 'Current', 'Suggested', 'Rule']
    const rows = []

    Object.entries(report.violationsByFile).forEach(([filePath, fileData]) => {
      fileData.violations.forEach((violation) => {
        rows.push([
          filePath,
          violation.type,
          violation.line,
          violation.current,
          violation.suggested,
          violation.rule,
        ])
      })
    })

    return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  }

  /**
   * Exporta para Markdown
   */
  exportToMarkdown(report) {
    let md = `# Relatório de Nomenclatura\n\n`

    md += `## Resumo\n`
    md += `- **Arquivos analisados:** ${report.summary.totalFiles}\n`
    md += `- **Total de violações:** ${report.summary.totalViolations}\n\n`

    md += `## Violações por Tipo\n`
    Object.entries(report.summary.violationsByType).forEach(([type, count]) => {
      md += `- **${type}:** ${count}\n`
    })

    md += `\n## Recomendações\n`
    report.recommendations.forEach((rec, index) => {
      md += `${index + 1}. **${rec.type}** (${rec.priority}): ${rec.message}\n`
      md += `   - Ação: ${rec.action}\n\n`
    })

    return md
  }

  /**
   * Limpa dados
   */
  clearData() {
    this.violations.clear()
    this.corrections.clear()

    // Reset statistics
    this.statistics = {
      totalFiles: 0,
      totalViolations: 0,
      totalCorrections: 0,
      violationsByType: {},
      correctionsByType: {},
    }

    Object.keys(REFACTORING_RULES).forEach((type) => {
      this.statistics.violationsByType[type] = 0
      this.statistics.correctionsByType[type] = 0
    })

    logger.info('🧹 Dados de nomenclatura limpos')
  }
}

// Instância singleton
let nomenclatureInstance = null

/**
 * Obtém instância do sistema (singleton)
 */
export const getNomenclatureRefactoring = () => {
  if (!nomenclatureInstance) {
    nomenclatureInstance = new NomenclatureRefactoring()
  }
  return nomenclatureInstance
}

// Funções utilitárias
export const analyzeFileNaming = (filePath, content) =>
  getNomenclatureRefactoring().analyzeFile(filePath, content)
export const generateNamingReport = () => getNomenclatureRefactoring().generateViolationsReport()
export const applyNamingCorrections = (filePath, content) =>
  getNomenclatureRefactoring().applyAutomaticCorrections(filePath, content)
export const getNamingStats = () => getNomenclatureRefactoring().getStatistics()

export default NomenclatureRefactoring
