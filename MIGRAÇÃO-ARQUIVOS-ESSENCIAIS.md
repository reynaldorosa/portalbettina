# 🚀 MIGRAÇÃO PORTAL BETINA - ARQUIVOS ESSENCIAIS

## 📋 LISTA DE ARQUIVOS CORE (FUNCIONANDO)

### 🎯 **ARQUIVOS CRÍTICOS - MIGRAR PRIMEIRO**
```
📁 src/
├── 🧠 utils/
│   ├── autismCognitiveAnalysis/
│   │   ├── ✅ autismCognitiveAnalyzer.js (FUNCIONAL)
│   │   ├── ✅ autismAssessmentHelpers.js
│   │   └── ✅ index.js
│   ├── shared/
│   │   ├── ✅ databaseService_UserProfiles.js (CORRIGIDO)
│   │   └── ✅ Logger.js
│   └── core/
│       ├── ✅ SystemOrchestrator.js (PRINCIPAL)
│       └── ✅ TherapeuticDataProcessor.js

📁 public/
├── ✅ index.html (BASE)
├── ✅ manifest.json
└── 📁 icons/ (pasta completa)

📁 Config/
├── ✅ package.json (DEPENDÊNCIAS)
├── ✅ vite.config.js
└── ✅ docker-compose.yml (se usando Docker)
```

### 🗂️ **ARQUIVOS DE DOCUMENTAÇÃO - MIGRAR SEGUNDO**
```
✅ RESUMO-EXECUTIVO-METRICAS.md
✅ RELATORIO-METRICAS-COMPLETO-COM-SENSORES.md
✅ ANALISE-METRICAS-JOGOS-COMPLETA.md
✅ README.md
```

### 🧪 **TESTES FUNCIONAIS - MIGRAR TERCEIRO**
```
✅ test-autism-cognitive-integration.js (PASSOU)
✅ test-system-orchestrator-autism-integration.js (PASSOU)
```

### ❌ **ARQUIVOS NÃO ESSENCIAIS - NÃO MIGRAR**
```
❌ node_modules/ (recriar com npm install)
❌ .git/ (muito pesado)
❌ logs/
❌ temp/
❌ cache/
❌ dist/
❌ build/
❌ Arquivos de teste duplicados
❌ Backups antigos (.bak, .old)
```

---

## 🔄 **PROCESSO DE MIGRAÇÃO PASSO A PASSO**

### **PASSO 1: Criar nova estrutura limpa**
```bash
# No novo diretório:
mkdir portal-betina-limpo
cd portal-betina-limpo
mkdir -p src/{utils/{autismCognitiveAnalysis,shared,core},hooks,components}
mkdir -p public/{icons,images,sounds}
mkdir documentacao
```

### **PASSO 2: Migrar arquivos por ordem de prioridade**
1. `package.json` → recriar dependências
2. Arquivos core do sistema
3. Documentação principal
4. Testes que passaram
5. Assets essenciais

### **PASSO 3: Validação após cada migração**
- Testar cada arquivo migrado
- Verificar dependências
- Executar testes básicos

---

## 📦 **COMANDO PARA NOVA INSTALAÇÃO LIMPA**

```bash
# Criar package.json mínimo
npm init -y

# Instalar apenas dependências essenciais
npm install react react-dom
npm install -D vite @vitejs/plugin-react
npm install three @react-three/fiber
npm install date-fns

# Dependências específicas do Portal Betina
npm install uuid
npm install loglevel
```

---

## 🎯 **TAMANHO ESTIMADO DA MIGRAÇÃO**

```
📊 COMPARAÇÃO DE TAMANHO:
├── 📁 Projeto atual: ~500MB-1GB
├── 📁 Projeto limpo: ~50-100MB
└── 📉 Redução: 80-90%

🚀 ARQUIVOS ESSENCIAIS:
├── Código funcional: ~2-5MB
├── Documentação: ~1-2MB
├── Assets mínimos: ~5-10MB
└── node_modules: ~30-50MB (após npm install)
```
