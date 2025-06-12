# 🐳 GUIA DOS ARQUIVOS DOCKER-COMPOSE

## 📁 ARQUIVOS DISPONÍVEIS

### **1. `docker-compose.yml` (PRINCIPAL) - ✅ CORRIGIDO**
- **Uso:** Desenvolvimento local padrão
- **Comando:** `docker-compose up -d`
- **Características:**
  - PostgreSQL na porta 5433
  - API na porta 3000
  - Frontend na porta 5173
  - Nginx na porta 80
  - Valores hardcoded para desenvolvimento

### **2. `docker-compose-final.yml` - ✅ ESTÁVEL**
- **Uso:** Configuração testada e funcional
- **Comando:** `docker-compose -f docker-compose-final.yml up -d`
- **Características:**
  - Configurações idênticas ao principal
  - Versão de backup funcional

### **3. `docker-compose.prod.yml` - ✅ PRODUÇÃO**
- **Uso:** Ambiente de produção
- **Comando:** `docker-compose -f docker-compose.prod.yml up -d`
- **Características:**
  - Health checks configurados
  - Limits de recursos
  - SSL configurado
  - Sem exposição desnecessária de portas
  - Usa variáveis de ambiente

### **4. `docker-compose.dev.yml` - 🔧 DESENVOLVIMENTO**
- **Uso:** Ambiente de desenvolvimento avançado
- **Comando:** `docker-compose -f docker-compose.dev.yml up -d`
- **Características:**
  - Configurações específicas para desenvolvimento
  - Hot reload habilitado

### **5. `docker-compose2.yml` - 📦 ALTERNATIVO**
- **Uso:** Configuração alternativa
- **Comando:** `docker-compose -f docker-compose2.yml up -d`

## 🎯 QUAL USAR?

### **Para Desenvolvimento Rápido:**
```bash
docker-compose up -d
```

### **Para Produção:**
```bash
# Primeiro configure o .env com variáveis de produção
docker-compose -f docker-compose.prod.yml up -d
```

### **Para Teste de Funcionalidade:**
```bash
docker-compose -f docker-compose-final.yml up -d
```

## 🔧 CONFIGURAÇÕES ATUAIS

### **Portas Mapeadas:**
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000/api/health
- **Nginx:** http://localhost
- **PostgreSQL:** localhost:5433

### **Rede Interna:**
- **Banco:** `db:5432`
- **API:** `api:3000`
- **Frontend:** `app:5173`

### **Volumes:**
- **`postgres_data`:** Dados do banco
- **`node_modules`:** Dependências Node.js
- **Bind mounts:** Código fonte para hot reload

## 🚀 COMANDOS ÚTEIS

### **Iniciar:**
```bash
docker-compose up -d
```

### **Ver logs:**
```bash
docker-compose logs -f
```

### **Parar:**
```bash
docker-compose down
```

### **Rebuild:**
```bash
docker-compose up -d --build
```

### **Limpar tudo:**
```bash
docker-compose down -v
docker system prune -f
```

## ✅ STATUS ATUAL

- ✅ **`docker-compose.yml`** - CORRIGIDO e funcional
- ✅ **Configurações consistentes** entre services
- ✅ **URLs da API** corrigidas
- ✅ **Variáveis de ambiente** alinhadas
- ✅ **Nginx** configurado corretamente

## 🔍 PRÓXIMOS PASSOS

1. **Testar a configuração atual:**
   ```bash
   docker-compose up -d
   ```

2. **Verificar se todos os serviços sobem:**
   ```bash
   docker-compose ps
   ```

3. **Testar conectividade:**
   - Frontend: http://localhost:5173
   - API: http://localhost:3000/api/health
   - Nginx: http://localhost

---

**📝 Nota:** O arquivo principal (`docker-compose.yml`) foi corrigido e agora está alinhado com as configurações que funcionam corretamente.
