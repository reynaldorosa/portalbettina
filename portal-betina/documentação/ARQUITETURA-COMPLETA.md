# 🏗️ Arquitetura Completa do Portal Betina

## 📋 Visão Geral

O Portal Betina agora implementa uma **arquitetura completa de produção** com separação adequada de responsabilidades e comunicação otimizada entre os serviços.

## 🧩 Componentes da Arquitetura

### 1. **Nginx (Reverse Proxy)**
- **Responsabilidade**: Roteamento, balanceamento, cache, segurança
- **Porta**: 80 (HTTP)
- **Funcionalidades**:
  - Proxy reverso para Frontend e API
  - Cache de arquivos estáticos
  - Rate limiting
  - Headers de segurança
  - Compressão gzip
  - Health checks

### 2. **Frontend (Vite + React)**
- **Responsabilidade**: Interface do usuário
- **Porta**: 5173 (desenvolvimento)
- **Tecnologias**: React, Vite, Styled Components
- **Comunicação**: API REST via `/api/*`

### 3. **API Backend (Node.js + Express)**
- **Responsabilidade**: Lógica de negócio, comunicação com BD
- **Porta**: 3000
- **Funcionalidades**:
  - Endpoints REST
  - Validação de dados
  - Comunicação com PostgreSQL
  - Health checks

### 4. **Database (PostgreSQL)**
- **Responsabilidade**: Persistência de dados
- **Porta**: 5432 (interna), 5433 (externa)
- **Funcionalidades**:
  - Armazenamento de usuários
  - Sessões de jogos
  - Configurações de acessibilidade
  - Relatórios de progresso

## 🔗 Fluxo de Comunicação

```
[Cliente] → [Nginx:80] → [Frontend:5173] (Assets estáticos)
                      → [API:3000] → [PostgreSQL:5432] (Dados dinâmicos)
```

### Rotas principais:
- `http://localhost/` → Frontend React
- `http://localhost/api/*` → API Node.js
- `http://localhost/health` → Health check do Nginx

## 🚀 Como Executar

### Desenvolvimento com Arquitetura Completa:
```bash
# Iniciar todos os serviços
iniciar-arquitetura-completa.bat

# Ou manualmente:
docker-compose -f docker-compose.full.yml up -d --build
```

### Desenvolvimento Simples (apenas Frontend + DB):
```bash
# Usar a configuração original
iniciar-docker.bat
```

### Produção:
```bash
# Usar configuração de produção
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📊 Monitoramento

### Health Checks:
- **Nginx**: `http://localhost/health`
- **API**: `http://localhost/api/health`
- **Frontend**: `http://localhost/` (deve carregar a aplicação)
- **Database**: Verificação automática via `pg_isready`

### Logs:
```bash
# Todos os serviços
docker-compose -f docker-compose.full.yml logs -f

# Serviço específico
docker-compose -f docker-compose.full.yml logs -f nginx
docker-compose -f docker-compose.full.yml logs -f api
```

## 🔧 Configurações Importantes

### Nginx (nginx.prod.conf):
- **Rate Limiting**: 10 req/s para API, 30 req/s para estáticos
- **Caching**: 1 ano para assets, 30 dias para mídia
- **Security Headers**: XSS Protection, CSRF, Content Security Policy
- **Compression**: Gzip habilitado para todos os tipos de arquivo

### API (api-server.js):
- **CORS**: Habilitado para desenvolvimento
- **Logging**: Todas as requisições são logadas
- **Error Handling**: Middleware de erro centralizado
- **Health Check**: Endpoint `/api/health` disponível

### Database:
- **Encoding**: UTF-8
- **Health Check**: Verificação a cada 30s
- **Backup**: Volume persistente `postgres_data`

## 🎯 Benefícios da Nova Arquitetura

### ✅ **Separação de Responsabilidades**
- Frontend: Apenas UI/UX
- API: Apenas lógica de negócio
- Nginx: Apenas proxy/cache/segurança
- Database: Apenas persistência

### ✅ **Escalabilidade**
- Cada serviço pode ser escalado independentemente
- Load balancing via Nginx
- Caching otimizado

### ✅ **Segurança**
- Headers de segurança via Nginx
- Rate limiting
- Isolamento de serviços via Docker networks

### ✅ **Performance**
- Cache de arquivos estáticos
- Compressão gzip
- Otimização de conexões

### ✅ **Monitoramento**
- Health checks automáticos
- Logs centralizados
- Métricas de performance

## 📁 Novos Arquivos Criados

```
portal-betina/
├── docker-compose.full.yml          # Configuração completa
├── Dockerfile.api                   # Container da API
├── nginx.prod.conf                  # Configuração do Nginx
├── src/services/api-server.js       # Servidor de API
├── start-prod.sh                    # Script de produção
└── iniciar-arquitetura-completa.bat # Script de inicialização
```

## 🔄 Migração de Localhost para Docker

A arquitetura agora está **100% dockerizada** e não depende mais de localhost:
- ❌ ~~npm run dev (localhost)~~
- ✅ Docker containers com comunicação interna
- ✅ Nginx como ponto de entrada único
- ✅ Network isolada para segurança

## 🎯 Próximos Passos

1. **SSL/HTTPS**: Implementar certificados SSL para produção
2. **CI/CD**: Pipeline de deployment automatizado
3. **Monitoring**: Prometheus + Grafana para métricas
4. **Backup**: Estratégia de backup automatizado do PostgreSQL
5. **CDN**: Integração com CDN para assets globais

---

**Esta arquitetura resolve todos os pontos levantados sobre comunicação entre containers, proxy reverso e escalabilidade!** 🚀
