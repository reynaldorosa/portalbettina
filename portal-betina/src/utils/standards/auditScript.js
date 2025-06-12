/**
 * SCRIPT DE AUDITORIA - PLATAFORMA BETINA
 * Verifica conformidade dos componentes com os padrões estabelecidos
 * 
 * @version 1.0.0
 * @created 2025-06-05
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Padrões obrigatórios para auditoria
const REQUIRED_PATTERNS = {
  imports: [
    "import.*useSound.*from.*'../../hooks/useSound'",
    "import.*useProgress.*from.*'../../hooks/useProgress'", 
    "import.*useUser.*from.*'../../hooks/useUser'",
    "import.*createAdaptiveModel.*from.*'../../utils/adaptiveML'"
  ],
  
  hooks: [
    "const.*useSound\\(\\)",
    "const.*useProgress\\(",
    "const.*useUser\\(\\)"
  ],
  
  states: [
    "useState\\(false\\).*gameStarted",
    "useState\\('easy'\\).*difficulty",
    "useState\\(null\\).*feedback"
  ],
  
  effects: [
    "useEffect\\(.*\\[userId\\]",
    "useEffect\\(.*gameStarted"
  ],
  
  accessibility: [
    "announceToScreenReader",
    "prefersHighContrast",
    "prefersReducedMotion"
  ],
  
  metrics: [
    "sessionId",
    "recordSuccess",
    "recordError", 
    "saveProgress"
  ]
};

// Função de auditoria de um arquivo
function auditComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  const audit = {
    file: fileName,
    compliant: true,
    issues: [],
    score: 0,
    totalChecks: 0
  };
  
  // Verificar cada categoria de padrões
  Object.keys(REQUIRED_PATTERNS).forEach(category => {
    const patterns = REQUIRED_PATTERNS[category];
    
    patterns.forEach(pattern => {
      audit.totalChecks++;
      const regex = new RegExp(pattern, 'g');
      
      if (regex.test(content)) {
        audit.score++;
      } else {
        audit.compliant = false;
        audit.issues.push({
          category,
          pattern,
          severity: 'warning',
          message: `Padrão ausente: ${pattern}`
        });
      }
    });
  });
  
  // Verificações específicas
  
  // 1. Verificar se tem useUser mas não passa userId para createAdaptiveModel
  if (content.includes('useUser()') && content.includes('createAdaptiveModel(')) {
    const adaptiveModelCalls = content.match(/createAdaptiveModel\([^)]+\)/g) || [];
    
    adaptiveModelCalls.forEach(call => {
      if (!call.includes('userId')) {
        audit.issues.push({
          category: 'adaptiveML',
          pattern: 'createAdaptiveModel com userId',
          severity: 'error',
          message: 'createAdaptiveModel deve receber userId como parâmetro'
        });
        audit.compliant = false;
      }
    });
  }
  
  // 2. Verificar estrutura de exports
  if (!content.includes('export default')) {
    audit.issues.push({
      category: 'structure',
      pattern: 'export default',
      severity: 'error', 
      message: 'Componente deve ter export default'
    });
    audit.compliant = false;
  }
  
  // 3. Verificar se tem tratamento de erro
  if (!content.includes('try') && !content.includes('catch')) {
    audit.issues.push({
      category: 'errorHandling',
      pattern: 'try/catch blocks',
      severity: 'warning',
      message: 'Componente deve ter tratamento de erro'
    });
  }
  
  // Calcular score percentual
  audit.scorePercent = audit.totalChecks > 0 ? Math.round((audit.score / audit.totalChecks) * 100) : 0;
  
  return audit;
}

// Função principal de auditoria
function auditAllComponents() {
  const activitiesDir = path.join(__dirname, '../components/activities');
  
  if (!fs.existsSync(activitiesDir)) {
    console.error('❌ Diretório de atividades não encontrado:', activitiesDir);
    return;
  }
  
  const files = fs.readdirSync(activitiesDir)
    .filter(file => file.endsWith('.jsx') && !file.includes('backup'))
    .map(file => path.join(activitiesDir, file));
  
  console.log('🔍 AUDITORIA DE CONFORMIDADE - PLATAFORMA BETINA');
  console.log('================================================');
  console.log(`Analisando ${files.length} componentes de atividades...\n`);
  
  const results = files.map(auditComponent);
  
  // Relatório individual
  results.forEach(result => {
    const status = result.compliant ? '✅' : '⚠️';
    console.log(`${status} ${result.file} - Score: ${result.scorePercent}%`);
    
    if (result.issues.length > 0) {
      result.issues.forEach(issue => {
        const icon = issue.severity === 'error' ? '❌' : '⚠️';
        console.log(`   ${icon} [${issue.category}] ${issue.message}`);
      });
    }
    console.log('');
  });
  
  // Relatório geral
  const totalComponents = results.length;
  const compliantComponents = results.filter(r => r.compliant).length;
  const averageScore = Math.round(results.reduce((sum, r) => sum + r.scorePercent, 0) / totalComponents);
  
  console.log('📊 RESUMO DA AUDITORIA');
  console.log('=====================');
  console.log(`Total de componentes: ${totalComponents}`);
  console.log(`Componentes conformes: ${compliantComponents}/${totalComponents} (${Math.round(compliantComponents/totalComponents*100)}%)`);
  console.log(`Score médio: ${averageScore}%`);
  
  // Identificar problemas mais comuns
  const allIssues = results.flatMap(r => r.issues);
  const issuesByCategory = {};
  
  allIssues.forEach(issue => {
    if (!issuesByCategory[issue.category]) {
      issuesByCategory[issue.category] = 0;
    }
    issuesByCategory[issue.category]++;
  });
  
  if (Object.keys(issuesByCategory).length > 0) {
    console.log('\n🎯 PROBLEMAS MAIS FREQUENTES:');
    Object.entries(issuesByCategory)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`- ${category}: ${count} ocorrências`);
      });
  }
  
  // Recomendações
  console.log('\n💡 RECOMENDAÇÕES:');
  
  if (averageScore < 70) {
    console.log('- ⚠️ Score médio baixo - implementar padronização urgente');
  }
  
  if (compliantComponents < totalComponents) {
    console.log(`- 🔧 ${totalComponents - compliantComponents} componentes precisam de correções`);
  }
  
  console.log('- 📋 Usar template padrão para novos componentes');
  console.log('- 🔄 Implementar CI/CD com verificação de conformidade');
  console.log('- 📖 Treinar equipe nos padrões estabelecidos');
  
  return {
    totalComponents,
    compliantComponents,
    averageScore,
    results,
    issuesByCategory
  };
}

export {
  auditComponent,
  auditAllComponents,
  REQUIRED_PATTERNS
};

// Função principal para executar auditoria
async function main() {
  console.log('🔍 INICIANDO AUDITORIA DOS COMPONENTES...\n');
  await auditAllComponents();
}

// Executar auditoria se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
