/**
 * ÍNDICE DOS DASHBOARDS - PORTAL BETINA
 * Organização centralizada de todos os dashboards
 *
 * ESTRUTURA:
 * - 1 Dashboard PÚBLICO (Performance)
 * - 4 Dashboards PREMIUM (IA, Neuropedagógico, Multissensorial, Integrado)
 */

// 📊 DASHBOARD PÚBLICO (Gratuito - Aberto para todos)
export { default as PerformanceDashboard } from './PerformanceDashboard.jsx'

// 💎 DASHBOARDS PREMIUM (Requerem assinatura)
export { default as AdvancedAIReport } from './AdvancedAIReport.jsx' // RELATÓRIO A
export { default as NeuropedagogicalDashboard } from './NeuropedagogicalDashboard.jsx'
export { default as MultisensoryMetricsDashboard } from './MultisensoryMetricsDashboard.jsx'
export { default as IntegratedSystemDashboard } from './IntegratedSystemDashboard.jsx'

/**
 * CONFIGURAÇÃO DE ACESSO DOS DASHBOARDS
 */
export const DASHBOARD_CONFIG = {
  // Dashboard público
  performance: {
    component: 'PerformanceDashboard',
    title: 'Performance Dashboard',
    description: 'Métricas básicas de performance e uso',
    access: 'public',
    icon: '📊',
    features: ['Accuracy básica', 'Tempo de sessão', 'Pontuação geral', 'Progresso simples'],
  },

  // Dashboards premium
  relatorioA: {
    component: 'AdvancedAIReport',
    title: 'Relatório A - Análise IA',
    description: 'Análise avançada com Inteligência Artificial',
    access: 'premium',
    icon: '🤖',
    features: [
      'Análise cognitiva IA',
      'Padrões comportamentais',
      'Previsões desenvolvimento',
      'Mapeamento neural',
    ],
  },

  neuropedagogical: {
    component: 'NeuropedagogicalDashboard',
    title: 'Dashboard Neuropedagógico',
    description: 'Métricas especializadas para terapeutas',
    access: 'premium',
    icon: '🧠',
    features: [
      'Função executiva',
      'Atenção sustentada',
      'Processamento sensorial',
      'Relatórios profissionais',
    ],
  },

  multisensory: {
    component: 'MultisensoryMetricsDashboard',
    title: 'Métricas Multissensoriais',
    description: 'Análise detalhada de interações sensoriais',
    access: 'premium',
    icon: '🎨',
    features: ['Métricas visuais', 'Processamento auditivo', 'Dados táteis', 'Sensores móveis'],
  },

  integrated: {
    component: 'IntegratedSystemDashboard',
    title: 'Sistema Integrado',
    description: 'Visão completa do sistema integrado',
    access: 'premium',
    icon: '🔗',
    features: [
      'Métricas unificadas',
      'Sincronização tempo real',
      'Análise longitudinal',
      'Insights consolidados',
    ],
  },
}

/**
 * UTILITÁRIOS PARA CONTROLE DE ACESSO
 */
export const getDashboardsByAccess = (accessLevel) => {
  return Object.entries(DASHBOARD_CONFIG).filter(([key, config]) => {
    if (accessLevel === 'premium') {
      return true // Premium tem acesso a todos
    }
    return config.access === 'public' // Público só aos gratuitos
  })
}

export const isPremiumDashboard = (dashboardKey) => {
  return DASHBOARD_CONFIG[dashboardKey]?.access === 'premium'
}

export const getDashboardConfig = (dashboardKey) => {
  return DASHBOARD_CONFIG[dashboardKey]
}

/**
 * LISTA ORDENADA DOS DASHBOARDS
 */
export const DASHBOARD_ORDER = [
  'performance', // Sempre primeiro (público)
  'relatorioA', // Relatório A - IA
  'neuropedagogical', // Neuropedagógico
  'multisensory', // Multissensorial
  'integrated', // Sistema integrado
]
