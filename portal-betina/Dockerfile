# Multi-stage build para otimização
FROM node:18-alpine AS builder

# Criar diretório de build
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar e limpar cache para otimização
RUN npm ci --no-optional && \
    npm cache clean --force

# Copiar código-fonte
COPY . .

# Construir aplicação com configuração explícita de produção
RUN npm run build -- --mode production

# Estágio de produção
FROM nginx:alpine AS production

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

# Estágio de desenvolvimento (para docker-compose)
FROM node:18-alpine AS development

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código-fonte
COPY . .

# Expor porta de desenvolvimento
EXPOSE 5173

# Comando para desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
