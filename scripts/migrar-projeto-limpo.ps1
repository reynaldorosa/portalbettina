# 🚀 SCRIPT DE MIGRAÇÃO PORTAL BETINA (PowerShell)
# Migra apenas arquivos essenciais para nova cópia limpa

Write-Host "🚀 Iniciando migração Portal Betina..." -ForegroundColor Green

# Definir diretórios
$origem = "."
$destino = "../portal-betina-limpo"

# Criar estrutura do destino
Write-Host "📁 Criando estrutura de diretórios..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $destino -Force | Out-Null
New-Item -ItemType Directory -Path "$destino/src/utils/autismCognitiveAnalysis" -Force | Out-Null
New-Item -ItemType Directory -Path "$destino/src/utils/shared" -Force | Out-Null
New-Item -ItemType Directory -Path "$destino/src/utils/core" -Force | Out-Null
New-Item -ItemType Directory -Path "$destino/src/hooks" -Force | Out-Null
New-Item -ItemType Directory -Path "$destino/src/components" -Force | Out-Null
New-Item -ItemType Directory -Path "$destino/public/icons" -Force | Out-Null
New-Item -ItemType Directory -Path "$destino/public/images" -Force | Out-Null
New-Item -ItemType Directory -Path "$destino/public/sounds" -Force | Out-Null
New-Item -ItemType Directory -Path "$destino/documentacao" -Force | Out-Null
New-Item -ItemType Directory -Path "$destino/tests" -Force | Out-Null

# FASE 1: Arquivos de configuração
Write-Host "⚙️ Migrando arquivos de configuração..." -ForegroundColor Cyan
try { Copy-Item "$origem/package.json" "$destino/" -ErrorAction Stop } catch { Write-Host "❌ package.json não encontrado" }
try { Copy-Item "$origem/vite.config.js" "$destino/" -ErrorAction Stop } catch { Write-Host "❌ vite.config.js não encontrado" }
try { Copy-Item "$origem/README.md" "$destino/" -ErrorAction Stop } catch { Write-Host "❌ README.md não encontrado" }

# FASE 2: Código core funcional
Write-Host "🧠 Migrando código core..." -ForegroundColor Cyan

# Autism Cognitive Analysis (FUNCIONAL)
try { Copy-Item "$origem/src/utils/autismCognitiveAnalysis/autismCognitiveAnalyzer.js" "$destino/src/utils/autismCognitiveAnalysis/" -ErrorAction Stop; Write-Host "✅ autismCognitiveAnalyzer.js migrado" } catch { Write-Host "❌ autismCognitiveAnalyzer.js não encontrado" }
try { Copy-Item "$origem/src/utils/autismCognitiveAnalysis/autismAssessmentHelpers.js" "$destino/src/utils/autismCognitiveAnalysis/" -ErrorAction Stop; Write-Host "✅ autismAssessmentHelpers.js migrado" } catch { Write-Host "❌ autismAssessmentHelpers.js não encontrado" }
try { Copy-Item "$origem/src/utils/autismCognitiveAnalysis/index.js" "$destino/src/utils/autismCognitiveAnalysis/" -ErrorAction Stop; Write-Host "✅ index.js migrado" } catch { Write-Host "❌ index.js não encontrado" }

# Database Services (CORRIGIDO)
try { Copy-Item "$origem/src/utils/shared/databaseService_UserProfiles.js" "$destino/src/utils/shared/" -ErrorAction Stop; Write-Host "✅ databaseService_UserProfiles.js migrado" } catch { Write-Host "❌ databaseService_UserProfiles.js não encontrado" }
try { Copy-Item "$origem/src/utils/shared/Logger.js" "$destino/src/utils/shared/" -ErrorAction Stop; Write-Host "✅ Logger.js migrado" } catch { Write-Host "❌ Logger.js não encontrado" }

# Core System
try { Copy-Item "$origem/src/utils/core/SystemOrchestrator.js" "$destino/src/utils/core/" -ErrorAction Stop; Write-Host "✅ SystemOrchestrator.js migrado" } catch { Write-Host "❌ SystemOrchestrator.js não encontrado" }

# FASE 3: Arquivos public essenciais
Write-Host "🎨 Migrando assets públicos..." -ForegroundColor Cyan
try { Copy-Item "$origem/public/index.html" "$destino/public/" -ErrorAction Stop; Write-Host "✅ index.html migrado" } catch { Write-Host "❌ index.html não encontrado" }
try { Copy-Item "$origem/public/manifest.json" "$destino/public/" -ErrorAction Stop; Write-Host "✅ manifest.json migrado" } catch { Write-Host "❌ manifest.json não encontrado" }

# Copiar ícones (se existirem)
if (Test-Path "$origem/public/icons") {
    try { Copy-Item "$origem/public/icons/*" "$destino/public/icons/" -Recurse -ErrorAction Stop; Write-Host "✅ Ícones migrados" } catch { Write-Host "❌ Erro ao migrar ícones" }
}

# FASE 4: Documentação principal
Write-Host "📝 Migrando documentação..." -ForegroundColor Cyan
try { Copy-Item "$origem/RESUMO-EXECUTIVO-METRICAS.md" "$destino/documentacao/" -ErrorAction Stop; Write-Host "✅ RESUMO-EXECUTIVO-METRICAS.md migrado" } catch { Write-Host "❌ RESUMO-EXECUTIVO-METRICAS.md não encontrado" }
try { Copy-Item "$origem/RELATORIO-METRICAS-COMPLETO-COM-SENSORES.md" "$destino/documentacao/" -ErrorAction Stop; Write-Host "✅ RELATORIO-METRICAS-COMPLETO-COM-SENSORES.md migrado" } catch { Write-Host "❌ RELATORIO-METRICAS-COMPLETO-COM-SENSORES.md não encontrado" }
try { Copy-Item "$origem/ANALISE-METRICAS-JOGOS-COMPLETA.md" "$destino/documentacao/" -ErrorAction Stop; Write-Host "✅ ANALISE-METRICAS-JOGOS-COMPLETA.md migrado" } catch { Write-Host "❌ ANALISE-METRICAS-JOGOS-COMPLETA.md não encontrado" }

# FASE 5: Testes funcionais
Write-Host "🧪 Migrando testes que passaram..." -ForegroundColor Cyan
try { Copy-Item "$origem/test-autism-cognitive-integration.js" "$destino/tests/" -ErrorAction Stop; Write-Host "✅ test-autism-cognitive-integration.js migrado" } catch { Write-Host "❌ test-autism-cognitive-integration.js não encontrado" }
try { Copy-Item "$origem/test-system-orchestrator-autism-integration.js" "$destino/tests/" -ErrorAction Stop; Write-Host "✅ test-system-orchestrator-autism-integration.js migrado" } catch { Write-Host "❌ test-system-orchestrator-autism-integration.js não encontrado" }

# FASE 6: Criar package.json mínimo se não existir
if (-not (Test-Path "$destino/package.json")) {
    Write-Host "📦 Criando package.json mínimo..." -ForegroundColor Yellow
    $packageJson = @'
{
  "name": "portal-betina-limpo",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "node tests/test-autism-cognitive-integration.js"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.155.0",
    "@react-three/fiber": "^8.13.0",
    "date-fns": "^2.30.0",
    "uuid": "^9.0.0",
    "loglevel": "^1.8.1"
  },
  "devDependencies": {
    "vite": "^4.4.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
'@
    $packageJson | Out-File "$destino/package.json" -Encoding UTF8
}

Write-Host ""
Write-Host "✅ Migração concluída!" -ForegroundColor Green
Write-Host "📊 Estatísticas:" -ForegroundColor Blue
Write-Host "   - Diretório origem: $origem"
Write-Host "   - Diretório destino: $destino"
Write-Host ""
Write-Host "🚀 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. cd $destino"
Write-Host "   2. npm install"
Write-Host "   3. npm run test"
Write-Host "   4. npm run dev"
Write-Host ""
Write-Host "🎯 Arquivos migrados apenas os essenciais e funcionais!" -ForegroundColor Green
