# Reorganização das Classes Utilitárias do CircuitBreaker

## 📋 Resumo da Reorganização

As classes auxiliares do `CircuitBreakerAdvanced` foram reorganizadas e movidas para os diretórios apropriados dentro de `src/utils/`, seguindo as melhores práticas de organização de código e separação de responsabilidades.

## 🗂️ Nova Estrutura de Diretórios

### `src/utils/metrics/`

Classes relacionadas à análise de performance e métricas:

#### `errorPatternAnalyzer.js`

- **Classe**: `ErrorPatternAnalyzer`
- **Responsabilidade**: Análise de padrões de erro para decisões inteligentes
- **Funcionalidades**:
  - Detecção de padrões de erro
  - Análise temporal e sazonal
  - Predição de riscos baseada em padrões
  - Machine learning para categorização de erros
  - Análise de contexto terapêutico

#### `performanceAnalyzer.js`

- **Classe**: `PerformanceAnalyzer`
- **Responsabilidade**: Análise de performance e tendências
- **Funcionalidades**:
  - Monitoramento de operações em tempo real
  - Análise de tendências de performance
  - Predição de tempo de resposta
  - Análise de carga do sistema
  - Cálculo de percentis e métricas estatísticas

### `src/utils/therapy/`

Classes relacionadas ao suporte terapêutico:

#### `therapeuticAnalyzer.js`

- **Classe**: `TherapeuticAnalyzer`
- **Responsabilidade**: Análise de contexto terapêutico para suporte ao autismo
- **Funcionalidades**:
  - Análise de contexto terapêutico
  - Verificação de segurança para execução
  - Adaptação de fallbacks para necessidades terapêuticas
  - Monitoramento de intervenções
  - Suporte específico para autismo

### `src/utils/shared/`

Classes utilitárias compartilhadas:

#### `circuitBreakerUtils.js`

- **Classes**: `AccessibilityManager`, `HealthChecker`, `QualityAssessor`
- **Responsabilidades**:
  - **AccessibilityManager**: Gerenciamento de recursos de acessibilidade
  - **HealthChecker**: Monitoramento de saúde do sistema
  - **QualityAssessor**: Avaliação de qualidade de serviço

## 🔄 Integração com CircuitBreakerAdvanced

### Imports Atualizados

```javascript
import { ErrorPatternAnalyzer } from '../../utils/metrics/errorPatternAnalyzer.js'
import { PerformanceAnalyzer } from '../../utils/metrics/performanceAnalyzer.js'
import { TherapeuticAnalyzer } from '../../utils/therapy/therapeuticAnalyzer.js'
import {
  AccessibilityManager,
  HealthChecker,
  QualityAssessor,
} from '../../utils/shared/circuitBreakerUtils.js'
```

### Instanciação das Classes

```javascript
// Advanced monitoring and analysis
this.patternAnalyzer = new ErrorPatternAnalyzer({
  maxPatternHistory: 1000,
  patternWindow: this.config.patternWindow || 100,
  enableLearning: this.config.learningEnabled,
})

this.performanceAnalyzer = new PerformanceAnalyzer({
  maxHistorySize: 1000,
  performanceThreshold: this.config.performanceThreshold,
  enablePredictiveAnalysis: true,
  therapeuticAdjustments: this.config.therapeuticMode,
})

// Therapeutic and accessibility features
this.therapeuticAnalyzer = new TherapeuticAnalyzer({
  enableTherapeuticMode: this.config.therapeuticMode,
  autismSpecificAdaptations: this.config.autismFriendly,
  sensoryConsiderations: this.config.sensoryAdaptation,
})

this.accessibilityManager = new AccessibilityManager({
  enableAccessibilityMode: this.config.autismFriendly,
  autismFriendlyDefaults: this.config.autismFriendly,
  sensoryAdaptations: this.config.sensoryAdaptation,
})

// Quality and health assessment
this.healthChecker = new HealthChecker({
  criticalThreshold: 0.3,
  warningThreshold: this.config.degradationThreshold || 0.7,
})

this.qualityAssessor = new QualityAssessor({
  qualityThreshold: this.config.degradationThreshold || 0.7,
  degradationSensitivity: 0.1,
})
```

## 🎯 Benefícios da Reorganização

### 1. **Separação de Responsabilidades**

- Cada classe tem uma responsabilidade específica e bem definida
- Facilitita manutenção e testes independentes
- Melhora a legibilidade do código

### 2. **Reutilização**

- Classes podem ser reutilizadas em outros componentes
- Reduz duplicação de código
- Facilita evolução independente

### 3. **Organização Lógica**

- Métricas em `utils/metrics/`
- Terapia em `utils/therapy/`
- Utilitários compartilhados em `utils/shared/`

### 4. **Facilidade de Teste**

- Cada classe pode ser testada independentemente
- Mocks e stubs mais simples
- Testes unitários mais focados

### 5. **Documentação Clara**

- Cada arquivo tem responsabilidade clara
- JSDoc detalhado para cada classe
- Exemplos de uso incluídos

## 🔧 Funcionalidades Avançadas

### ErrorPatternAnalyzer

- **Machine Learning**: Detecção automática de padrões
- **Análise Temporal**: Identificação de sazonalidade
- **Predição de Riscos**: Cálculo de probabilidade de falhas
- **Contexto Terapêutico**: Considerações específicas para autismo

### PerformanceAnalyzer

- **Monitoramento em Tempo Real**: Tracking de operações ativas
- **Análise Preditiva**: Estimativa de tempo de resposta
- **Tendências**: Identificação de degradação/melhoria
- **Ajustes Terapêuticos**: Modificações para suporte ao autismo

### TherapeuticAnalyzer

- **Análise de Contexto**: Avaliação de fatores terapêuticos
- **Verificação de Segurança**: Proteção contra sobrecarga
- **Adaptação de Fallbacks**: Modificação para necessidades especiais
- **Intervenções**: Estratégias terapêuticas automáticas

### AccessibilityManager

- **Adaptações Automáticas**: Aplicação de preferências de acessibilidade
- **Validação de Compliance**: Verificação de conformidade
- **Suporte ao Autismo**: Adaptações específicas para TEA

### HealthChecker & QualityAssessor

- **Monitoramento Contínuo**: Verificação de saúde do sistema
- **Scores de Qualidade**: Métricas quantitativas de performance
- **Alertas Proativos**: Notificações de degradação

## 📊 Métricas e Monitoramento

### Estatísticas Disponíveis

- Taxa de sucesso/falha
- Tempo de resposta médio/percentis
- Padrões de erro identificados
- Intervenções terapêuticas
- Adaptações de acessibilidade
- Scores de saúde e qualidade

### Dashboards e Relatórios

- Estado em tempo real do CircuitBreaker
- Tendências de performance
- Análise de padrões de erro
- Efetividade de intervenções terapêuticas
- Compliance de acessibilidade

## 🚀 Próximos Passos

1. **Testes Unitários**: Implementar testes para cada classe
2. **Integração**: Conectar com outros componentes do Portal Betina
3. **Documentação**: Expandir documentação técnica
4. **Monitoramento**: Implementar dashboards de monitoramento
5. **Machine Learning**: Evoluir algoritmos de predição

## 🔗 Dependências

- `performanceMonitor` from `utils/metrics`
- Configurações do Portal Betina
- Sistema de logging integrado
- APIs de acessibilidade do browser

## 📝 Considerações Técnicas

- **Performance**: Classes otimizadas para baixo overhead
- **Memory Management**: Limpeza automática de histórico
- **Thread Safety**: Operações assíncronas seguras
- **Error Handling**: Tratamento robusto de erros
- **Backward Compatibility**: Compatibilidade com versões anteriores

---

Esta reorganização garante que o código seja mais maintível, testável e reutilizável, seguindo as melhores práticas de desenvolvimento e a arquitetura do Portal Betina.
