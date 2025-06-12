# Sistema de Análise Cognitiva para Autismo - Portal Betina

## 📋 Visão Geral

O Portal Betina agora inclui um sistema especializado de análise cognitiva para autismo, implementando algoritmos específicos para adaptações personalizadas e otimizações terapêuticas. Este sistema complementa os 70+ algoritmos existentes com análises especializadas para características do autismo.

## 🧩 Componentes Implementados

### 1. AutismCognitiveAnalyzer (Módulo Principal)

**Arquivo:** `src/utils/autismCognitiveAnalyzer.js`

Classe principal que implementa todos os algoritmos de análise cognitiva específicos para autismo:

#### Métodos Principais:

- `calculateAutismAdaptations(userId, sessionData, userProfile)` - Calcula adaptações específicas
- `generateTherapyOptimizations(userId, sessionData, therapyGoals)` - Gera otimizações terapêuticas
- `assessCognitiveLevel(sessionData, userProfile)` - Avalia nível cognitivo geral
- `assessCommunicationLevel(sessionData, userProfile)` - Avalia nível de comunicação
- `assessSensoryProcessing(sessionData, userProfile)` - Avalia processamento sensorial
- `assessExecutiveFunction(sessionData, userProfile)` - Avalia função executiva
- `createSensoryProfile(sessionData, userProfile)` - Cria perfil sensorial especializado
- `createBehavioralProfile(sessionData, userProfile)` - Cria perfil comportamental
- `calculateSupportLevel(characteristics, sensoryProfile, communicationLevel)` - Calcula níveis de suporte

### 2. AutismAssessmentHelpers (Helpers Especializados)

**Arquivo:** `src/utils/autismAssessmentHelpers.js`

Classe com métodos auxiliares para avaliações detalhadas:

#### Categorias de Avaliação:

- **Características do Autismo:** Comunicação social, interesses restritos, comportamentos repetitivos
- **Processamento Sensorial:** Visual, auditivo, tátil (7 domínios sensoriais)
- **Comunicação:** Linguagem expressiva, receptiva, comunicação social
- **Função Executiva:** Flexibilidade cognitiva, controle inibitório, planejamento
- **Cálculos de Suporte:** Necessidades de comunicação, social e sensorial

### 3. useAutismCognitiveAnalysis (Hook de Integração)

**Arquivo:** `src/hooks/useAutismCognitiveAnalysis.js`

Hook React que integra o sistema de análise com os hooks existentes:

#### Funcionalidades:

- Análise em tempo real configurável
- Coleta automática de dados da sessão
- Integração com `useProgress` e `useUser`
- Interface padronizada para componentes
- Histórico de análises
- Recomendações consolidadas

## 🚀 Como Usar

### 1. Integração Básica em uma Atividade

```javascript
import { useAutismCognitiveAnalysis } from '../hooks/useAutismCognitiveAnalysis.js'

function MinhaAtividade({ onBack }) {
  // Hook de análise cognitiva para autismo
  const autismAnalysis = useAutismCognitiveAnalysis('minha-atividade', {
    enableRealTimeAnalysis: true,
    enableAdaptations: true,
    enableTherapyOptimizations: true,
  })

  // Aplicar adaptações quando disponíveis
  useEffect(() => {
    if (autismAnalysis.hasAnalysis) {
      const insights = autismAnalysis.getInsights()
      aplicarAdaptacoes(insights)
    }
  }, [autismAnalysis.hasAnalysis])

  // Resto do componente...
}
```

### 2. Integração Avançada com Múltiplos Hooks

```javascript
function AtividadeAvancada({ onBack }) {
  const activity = useActivity('atividade-id')
  const advanced = useAdvancedActivity('atividade-id')
  const autism = useAutismCognitiveAnalysis('atividade-id')

  // Combinar insights de todos os sistemas
  const insightsCompletos = useMemo(
    () => ({
      gerais: advanced.neuropedagogicalInsights,
      autismo: autism.getInsights(),
      recomendacoes: [
        ...advanced.adaptiveRecommendations,
        ...autism.getAdaptationRecommendations(),
      ],
    }),
    [advanced, autism]
  )
}
```

### 3. Configuração por Perfil de Usuário

```javascript
const configs = {
  'autismo-leve': {
    enableRealTimeAnalysis: true,
    adaptationSensitivity: 'medium',
  },
  'autismo-moderado': {
    enableRealTimeAnalysis: true,
    adaptationSensitivity: 'high',
  },
  'autismo-severo': {
    enableRealTimeAnalysis: false,
    adaptationSensitivity: 'very-high',
  },
}

const autism = useAutismCognitiveAnalysis('atividade-id', configs[userProfile.nivel])
```

## 📊 Tipos de Análise

### 1. Adaptações Específicas para Autismo

#### Adaptações Sensoriais:

- Redução de estímulos visuais/auditivos
- Ajuste de contraste e brilho
- Configurações de feedback tátil
- Ambientes sensoriais controlados

#### Adaptações de Comunicação:

- Níveis: 0 (não-verbal) a 4 (avançado)
- Suportes visuais e símbolos
- Instruções simplificadas
- Scripts sociais

#### Adaptações Cognitivas:

- Estratégias de função executiva
- Suporte para flexibilidade cognitiva
- Técnicas de planejamento
- Controle de impulsos

#### Adaptações Ambientais:

- Redução de distrações
- Estruturas previsíveis
- Pausas sensoriais
- Espaços de autorregulação

### 2. Otimizações Terapêuticas

#### Análise de Progresso:

- Tendências de desenvolvimento
- Áreas de força e necessidade
- Padrões de resposta
- Eficácia das intervenções

#### Intervenções Comportamentais:

- Estratégias de autorregulação
- Técnicas de enfrentamento
- Suporte comportamental positivo
- Prevenção de crises

#### Planos de Intervenção:

- Objetivos SMART personalizados
- Estratégias baseadas em evidências
- Cronogramas de implementação
- Métricas de sucesso

#### Estratégias de Generalização:

- Transferência de habilidades
- Aplicação em diferentes contextos
- Manutenção de ganhos
- Suporte de longo prazo

### 3. Níveis de Suporte (DSM-5)

#### Nível 1 - "Requiring Support":

- Suporte intermitente
- Dificuldades leves de comunicação social
- Inflexibilidade moderada

#### Nível 2 - "Requiring Substantial Support":

- Suporte frequente
- Déficits significativos de comunicação
- Inflexibilidade notável

#### Nível 3 - "Requiring Very Substantial Support":

- Suporte contínuo e intensivo
- Déficits severos de comunicação
- Inflexibilidade extrema

## 🔍 Métricas e Indicadores

### Características Avaliadas:

#### Comunicação Social:

- Contato visual
- Atenção compartilhada
- Reciprocidade social
- Comunicação não-verbal
- Reciprocidade socioemocional

#### Interesses e Comportamentos:

- Intensidade de interesses
- Nível de fixação
- Flexibilidade de tópicos
- Comportamentos repetitivos
- Estereotipias

#### Processamento Sensorial:

- Hipersensbilidade/hiposensibilidade
- Busca/evitação sensorial
- Discriminação sensorial
- Modulação sensorial
- Integração multissensorial

#### Função Executiva:

- Flexibilidade cognitiva
- Controle inibitório
- Planejamento
- Monitoramento
- Organização

## 📈 Dados de Saída

### Formato das Adaptações:

```javascript
{
  timestamp: "2025-06-10T...",
  userId: "user123",
  autismCharacteristics: { /* análise detalhada */ },
  sensoryProfile: { /* perfil sensorial */ },
  communicationLevel: { /* nível de comunicação */ },
  supportLevel: { level: 2, description: "requiring substantial support" },
  sensoryAdaptations: [/* adaptações sensoriais */],
  communicationAdaptations: [/* adaptações de comunicação */],
  cognitiveAdaptations: [/* adaptações cognitivas */],
  environmentalAdaptations: [/* adaptações ambientais */],
  teachingStrategies: [/* estratégias de ensino */],
  immediateRecommendations: [/* recomendações imediatas */],
  nextSteps: [/* próximos passos */]
}
```

### Formato das Otimizações Terapêuticas:

```javascript
{
  timestamp: "2025-06-10T...",
  userId: "user123",
  progressAnalysis: { /* análise de progresso */ },
  focusAreas: [/* áreas de foco */],
  activityOptimizations: { /* otimizações de atividade */ },
  behavioralInterventions: [/* intervenções comportamentais */],
  interventionPlan: { /* plano de intervenção */ },
  goalMetrics: { /* métricas de objetivos */ },
  generalizationStrategies: [/* estratégias de generalização */],
  monitoringPlan: { /* plano de monitoramento */ }
}
```

## 🔧 Configuração e Personalização

### Parâmetros Configuráveis:

```javascript
const options = {
  // Análise em tempo real
  enableRealTimeAnalysis: true,
  analysisInterval: 30000, // ms

  // Adaptações
  enableAdaptations: true,
  adaptationSensitivity: 'medium', // low, medium, high, very-high

  // Otimizações terapêuticas
  enableTherapyOptimizations: true,
  therapyGoals: {
    /* objetivos específicos */
  },

  // Inicialização
  autoInitialize: true,

  // Dados customizados
  customSessionData: {
    /* dados adicionais */
  },
}
```

### Thresholds e Parâmetros:

```javascript
// Configurações específicas para autismo
autismParameters: {
  sensoryProcessingThresholds: {
    hypersensitive: 0.3,
    hyposensitive: 0.7,
    normal: [0.3, 0.7]
  },
  communicationLevels: {
    nonVerbal: 0,
    singleWords: 1,
    phrases: 2,
    sentences: 3,
    advanced: 4
  },
  supportLevels: {
    level1: 'requiring support',
    level2: 'requiring substantial support',
    level3: 'requiring very substantial support'
  }
}
```

## 🧪 Teste e Validação

### Exemplo de Teste:

```javascript
// Testar análise básica
const sessionData = {
  accuracy: 75,
  attempts: 10,
  successes: 7,
  errors: 3,
  timeSpent: 300000,
  // ... outros dados
}

const adaptations = autismCognitiveAnalyzer.calculateAutismAdaptations(
  'user123',
  sessionData,
  userProfile
)

console.log('Adaptações calculadas:', adaptations)
```

## 📚 Integração com Sistema Existente

O sistema de análise cognitiva para autismo integra-se perfeitamente com:

- **70+ algoritmos existentes** do Portal Betina
- **useAdvancedActivity** para métricas multissensoriais
- **Sistema de progresso** para coleta de dados
- **Sistema de usuário** para perfis personalizados
- **Análise neuropedagógica** para insights complementares
- **Sistema de métricas** para monitoramento

## 🎯 Casos de Uso

1. **Avaliação Inicial:** Determinar perfil cognitivo e necessidades de suporte
2. **Adaptação em Tempo Real:** Ajustar atividades durante a execução
3. **Planejamento Terapêutico:** Criar planos de intervenção personalizados
4. **Monitoramento de Progresso:** Acompanhar desenvolvimento ao longo do tempo
5. **Suporte Familiar:** Fornecer recomendações para cuidadores
6. **Relatórios Profissionais:** Gerar insights para terapeutas e educadores

## 🔮 Expansões Futuras

- Integração com IA preditiva
- Análise de padrões comportamentais avançados
- Recomendações adaptativas baseadas em ML
- Integração com dispositivos sensoriais
- Análise de vídeo para comportamentos não-verbais
- Sistema de alertas proativos

---

**Desenvolvido para o Portal Betina - Sistema Completo de Análise Cognitiva para Autismo** 🧩✨
