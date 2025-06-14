# Multi-stage build otimizado para produção
FROM node:18-alpine AS base

# Instalar dependências do sistema necessárias
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers

# Definir diretório de trabalho
WORKDIR /app

# Estágio de dependências
FROM base AS dependencies

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências usando o node_modules local como cache
# Isso garante que todas as dependências sejam instaladas corretamente
RUN npm ci --include=dev && \
    npm cache clean --force

# Estágio de build
FROM dependencies AS builder

# Copiar código-fonte completo
COPY . .

# Construir aplicação com configurações de produção
ENV NODE_ENV=production
ENV VITE_BUILD_TARGET=production

# Build da aplicação
RUN npm run build

# Verificar se o build foi criado corretamente
RUN ls -la dist/ || (echo "Build failed - dist directory not found" && exit 1)

# Estágio de produção
FROM nginx:alpine AS production

# Instalar node.js para possíveis scripts de inicialização
RUN apk add --no-cache nodejs npm

# Copiar arquivos buildados do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração personalizada do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Criar diretórios necessários para logs e cache
RUN mkdir -p /var/log/nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx

# Expor porta 80
EXPOSE 80

# Health check para monitoramento
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

# Estágio de desenvolvimento (para docker-compose)
FROM dependencies AS development

# Copiar código-fonte
COPY . .

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Mudar para usuário não-root
USER nodejs

# Expor porta de desenvolvimento do Vite
EXPOSE 5173

# Comando para desenvolvimento com hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
