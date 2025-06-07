/**
 * SCRIPT DE VERIFICAÇÃO FINAL - PADRONIZAÇÃO BETINA
 * Testa todos os componentes padronizados
 * 
 * @version 2.0.0
 * @created 2025-06-06
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminhos dos componentes padronizados
const COMPONENT_PATHS = [
  'src/components/activities/MemoryGame.jsx',
  'src/components/activities/ColorMatch.jsx', 
  'src/components/activities/ImageAssociation.jsx',
  'src/components/activities/LetterRecognition.jsx',
  'src/components/activities/NumberCounting.jsx',
  'src/components/activities/MusicalSequence.jsx',
  'src/components/activities/CreativePainting.jsx'
];

// Padrões que devem estar presentes
const REQUIRED_PATTERNS = {
  imports: {
    'ActivityTitleSection': 'import.*ActivityTitleSection.*from.*activityCommon',
    'ActivityMainTitle': 'import.*ActivityMainTitle.*from.*activityCommon',
    'ActivitySubtitle': 'import.*ActivitySubtitle.*from.*activityCommon',
    'BackButton': 'import.*BackButton.*from.*activityCommon'
  },
  structure: {
    'GameHeader': '<GameHeader>',
    'ActivityTitleSection': '<ActivityTitleSection>',
    'ActivityMainTitle': '<ActivityMainTitle>',
    'ActivitySubtitle': '<ActivitySubtitle>',
    'BackButton': '<BackButton.*onClick={onBack}'
  },
  accessibility: {
    'aria-label': 'aria-label',
    'announceToScreenReader': 'announceToScreenReader',
    'vibrateSuccess': 'vibrateSuccess',
    'vibrateError': 'vibrateError'
  },
  theming: {
    'THEME_COLOR': 'const THEME_COLOR',
    'THEME_GRADIENT': 'const THEME_GRADIENT'
  }
};

/**
 * Verifica se um arquivo contém todos os padrões obrigatórios
 */
function checkComponentCompliance(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const results = {
      file: path.basename(filePath),
      passed: true,
      checks: {},
      issues: []
    };

    // Verificar cada categoria de padrões
    for (const [category, patterns] of Object.entries(REQUIRED_PATTERNS)) {
      results.checks[category] = {};
      
      for (const [name, pattern] of Object.entries(patterns)) {
        const regex = new RegExp(pattern, 'i');
        const found = regex.test(content);
        
        results.checks[category][name] = found;
        
        if (!found) {
          results.passed = false;
          results.issues.push(`${category}.${name}: Padrão '${pattern}' não encontrado`);
        }
      }
    }

    return results;
  } catch (error) {
    return {
      file: path.basename(filePath),
      passed: false,
      error: error.message,
      checks: {},
      issues: [`Erro ao ler arquivo: ${error.message}`]
    };
  }
}

/**
 * Executa auditoria completa
 */
function runFullAudit() {
  console.log('🔍 INICIANDO AUDITORIA FINAL DE PADRONIZAÇÃO');
  console.log('=' .repeat(60));
  
  const results = [];
  let totalPassed = 0;
  
  for (const componentPath of COMPONENT_PATHS) {
    const fullPath = path.join(__dirname, '..', componentPath);
    const result = checkComponentCompliance(fullPath);
    results.push(result);
    
    if (result.passed) {
      totalPassed++;
      console.log(`✅ ${result.file} - APROVADO`);
    } else {
      console.log(`❌ ${result.file} - REPROVADO`);
      result.issues.forEach(issue => {
        console.log(`   └─ ${issue}`);
      });
    }
  }
  
  console.log('=' .repeat(60));
  console.log(`📊 RESULTADOS FINAIS:`);
  console.log(`   Componentes aprovados: ${totalPassed}/${COMPONENT_PATHS.length}`);
  console.log(`   Taxa de conformidade: ${((totalPassed / COMPONENT_PATHS.length) * 100).toFixed(1)}%`);
  
  if (totalPassed === COMPONENT_PATHS.length) {
    console.log('🎉 AUDITORIA CONCLUÍDA COM SUCESSO!');
    console.log('   Todos os componentes estão em conformidade com os padrões.');
  } else {
    console.log('⚠️  ATENÇÃO: Alguns componentes precisam de correções.');
  }
  
  return {
    totalComponents: COMPONENT_PATHS.length,
    passed: totalPassed,
    rate: (totalPassed / COMPONENT_PATHS.length) * 100,
    results
  };
}

/**
 * Gera relatório detalhado
 */
function generateDetailedReport(auditResults) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: auditResults.totalComponents,
      passed: auditResults.passed,
      failed: auditResults.totalComponents - auditResults.passed,
      rate: auditResults.rate
    },
    details: auditResults.results
  };
  
  const reportPath = path.join(__dirname, '..', 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`📄 Relatório detalhado salvo em: ${reportPath}`);
  return report;
}

/**
 * Verifica se todos os arquivos necessários existem
 */
function checkRequiredFiles() {
  console.log('📁 Verificando arquivos obrigatórios...');
  
  const requiredFiles = [
    'src/standards/activityStandards.js',
    'src/services/metricsService.js',
    'src/config/environment.js',
    'src/hooks/useActivity.js',
    'src/styles/activityCommon.js'
  ];
  
  const missingFiles = [];
  
  for (const file of requiredFiles) {
    const fullPath = path.join(__dirname, '..', file);
    if (!fs.existsSync(fullPath)) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length === 0) {
    console.log('✅ Todos os arquivos obrigatórios estão presentes.');
    return true;
  } else {
    console.log('❌ Arquivos ausentes:');
    missingFiles.forEach(file => console.log(`   └─ ${file}`));
    return false;
  }
}

// Executar auditoria sempre
console.log('🚀 AUDITORIA FINAL - PLATAFORMA BETINA');
console.log('📅 Data:', new Date().toLocaleDateString('pt-BR'));
console.log('');

// Verificar arquivos obrigatórios
const filesOk = checkRequiredFiles();
console.log('');

if (filesOk) {
  // Executar auditoria principal
  const auditResults = runFullAudit();
  console.log('');
  
  // Gerar relatório
  generateDetailedReport(auditResults);
  
  // Status final
  process.exit(auditResults.passed === auditResults.totalComponents ? 0 : 1);
} else {
  console.log('❌ Não é possível executar auditoria: arquivos obrigatórios ausentes.');
  process.exit(1);
}

export {
  checkComponentCompliance,
  runFullAudit,
  generateDetailedReport,
  checkRequiredFiles
};
