#!/bin/bash

# 🚀 SCRIPT DE MIGRAÇÃO PORTAL BETINA
# Migra apenas arquivos essenciais para nova cópia limpa

echo "🚀 Iniciando migração Portal Betina..."

# Definir diretórios
ORIGEM="."
DESTINO="../portal-betina-limpo"

# Criar estrutura do destino
echo "📁 Criando estrutura de diretórios..."
mkdir -p "$DESTINO"
mkdir -p "$DESTINO/src/utils/autismCognitiveAnalysis"
mkdir -p "$DESTINO/src/utils/shared" 
mkdir -p "$DESTINO/src/utils/core"
mkdir -p "$DESTINO/src/hooks"
mkdir -p "$DESTINO/src/components"
mkdir -p "$DESTINO/public/icons"
mkdir -p "$DESTINO/public/images"
mkdir -p "$DESTINO/public/sounds"
mkdir -p "$DESTINO/documentacao"
mkdir -p "$DESTINO/tests"

# FASE 1: Arquivos de configuração
echo "⚙️ Migrando arquivos de configuração..."
cp "$ORIGEM/package.json" "$DESTINO/" 2>/dev/null || echo "❌ package.json não encontrado"
cp "$ORIGEM/vite.config.js" "$DESTINO/" 2>/dev/null || echo "❌ vite.config.js não encontrado"
cp "$ORIGEM/README.md" "$DESTINO/" 2>/dev/null || echo "❌ README.md não encontrado"

# FASE 2: Código core funcional
echo "🧠 Migrando código core..."

# Autism Cognitive Analysis (FUNCIONAL)
cp "$ORIGEM/src/utils/autismCognitiveAnalysis/autismCognitiveAnalyzer.js" "$DESTINO/src/utils/autismCognitiveAnalysis/" 2>/dev/null || echo "❌ autismCognitiveAnalyzer.js não encontrado"
cp "$ORIGEM/src/utils/autismCognitiveAnalysis/autismAssessmentHelpers.js" "$DESTINO/src/utils/autismCognitiveAnalysis/" 2>/dev/null || echo "❌ autismAssessmentHelpers.js não encontrado"
cp "$ORIGEM/src/utils/autismCognitiveAnalysis/index.js" "$DESTINO/src/utils/autismCognitiveAnalysis/" 2>/dev/null || echo "❌ index.js não encontrado"

# Database Services (CORRIGIDO)
cp "$ORIGEM/src/utils/shared/databaseService_UserProfiles.js" "$DESTINO/src/utils/shared/" 2>/dev/null || echo "❌ databaseService_UserProfiles.js não encontrado"
cp "$ORIGEM/src/utils/shared/Logger.js" "$DESTINO/src/utils/shared/" 2>/dev/null || echo "❌ Logger.js não encontrado"

# Core System
cp "$ORIGEM/src/utils/core/SystemOrchestrator.js" "$DESTINO/src/utils/core/" 2>/dev/null || echo "❌ SystemOrchestrator.js não encontrado"

# FASE 3: Arquivos public essenciais
echo "🎨 Migrando assets públicos..."
cp "$ORIGEM/public/index.html" "$DESTINO/public/" 2>/dev/null || echo "❌ index.html não encontrado"
cp "$ORIGEM/public/manifest.json" "$DESTINO/public/" 2>/dev/null || echo "❌ manifest.json não encontrado"

# Copiar ícones (se existirem)
if [ -d "$ORIGEM/public/icons" ]; then
    cp -r "$ORIGEM/public/icons"/* "$DESTINO/public/icons/" 2>/dev/null || echo "❌ Ícones não encontrados"
fi

# FASE 4: Documentação principal
echo "📝 Migrando documentação..."
cp "$ORIGEM/RESUMO-EXECUTIVO-METRICAS.md" "$DESTINO/documentacao/" 2>/dev/null || echo "❌ RESUMO-EXECUTIVO-METRICAS.md não encontrado"
cp "$ORIGEM/RELATORIO-METRICAS-COMPLETO-COM-SENSORES.md" "$DESTINO/documentacao/" 2>/dev/null || echo "❌ RELATORIO-METRICAS-COMPLETO-COM-SENSORES.md não encontrado"
cp "$ORIGEM/ANALISE-METRICAS-JOGOS-COMPLETA.md" "$DESTINO/documentacao/" 2>/dev/null || echo "❌ ANALISE-METRICAS-JOGOS-COMPLETA.md não encontrado"

# FASE 5: Testes funcionais
echo "🧪 Migrando testes que passaram..."
cp "$ORIGEM/test-autism-cognitive-integration.js" "$DESTINO/tests/" 2>/dev/null || echo "❌ test-autism-cognitive-integration.js não encontrado"
cp "$ORIGEM/test-system-orchestrator-autism-integration.js" "$DESTINO/tests/" 2>/dev/null || echo "❌ test-system-orchestrator-autism-integration.js não encontrado"

# FASE 6: Criar package.json mínimo se não existir
if [ ! -f "$DESTINO/package.json" ]; then
    echo "📦 Criando package.json mínimo..."
    cat > "$DESTINO/package.json" << 'EOF'
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
EOF
fi

echo ""
echo "✅ Migração concluída!"
echo "📊 Estatísticas:"
echo "   - Diretório origem: $ORIGEM"
echo "   - Diretório destino: $DESTINO"
echo ""
echo "🚀 Próximos passos:"
echo "   1. cd $DESTINO"
echo "   2. npm install"
echo "   3. npm run test"
echo "   4. npm run dev"
echo ""
echo "🎯 Arquivos migrados apenas os essenciais e funcionais!"
