#!/bin/bash

# Script para gerar nginx.conf a partir do template usando variáveis de ambiente
# Portal Betina - Configuração Dinâmica do Nginx

set -e

echo "🔧 Gerando configuração do nginx a partir das variáveis de ambiente..."

# Carregar variáveis de ambiente do arquivo .env se existir
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Definir valores padrão se as variáveis não estiverem definidas
export NGINX_WORKER_CONNECTIONS=${NGINX_WORKER_CONNECTIONS:-1024}
export NGINX_KEEPALIVE_TIMEOUT=${NGINX_KEEPALIVE_TIMEOUT:-65}
export NGINX_CLIENT_MAX_BODY_SIZE=${NGINX_CLIENT_MAX_BODY_SIZE:-10M}
export NGINX_PORT=${NGINX_PORT:-80}
export API_PORT=${API_PORT:-3000}
export DOMAIN_NAME=${DOMAIN_NAME:-localhost}
export NGINX_PROXY_READ_TIMEOUT=${NGINX_PROXY_READ_TIMEOUT:-300s}
export NGINX_PROXY_CONNECT_TIMEOUT=${NGINX_PROXY_CONNECT_TIMEOUT:-75s}
export NGINX_CACHE_EXPIRES_STATIC=${NGINX_CACHE_EXPIRES_STATIC:-1y}
export NGINX_CACHE_EXPIRES_MEDIA=${NGINX_CACHE_EXPIRES_MEDIA:-30d}

# Verificar se o template existe
if [ ! -f "nginx.conf.template" ]; then
    echo "❌ Erro: nginx.conf.template não encontrado!"
    exit 1
fi

# Substituir variáveis no template e gerar nginx.conf
envsubst '${NGINX_WORKER_CONNECTIONS} ${NGINX_KEEPALIVE_TIMEOUT} ${NGINX_CLIENT_MAX_BODY_SIZE} ${NGINX_PORT} ${API_PORT} ${DOMAIN_NAME} ${NGINX_PROXY_READ_TIMEOUT} ${NGINX_PROXY_CONNECT_TIMEOUT} ${NGINX_CACHE_EXPIRES_STATIC} ${NGINX_CACHE_EXPIRES_MEDIA}' < nginx.conf.template > nginx.conf

echo "✅ nginx.conf gerado com sucesso!"
echo "📋 Configurações aplicadas:"
echo "   - Porta Nginx: ${NGINX_PORT}"
echo "   - Porta API: ${API_PORT}"
echo "   - Domínio: ${DOMAIN_NAME}"
echo "   - Worker Connections: ${NGINX_WORKER_CONNECTIONS}"
echo "   - Client Max Body Size: ${NGINX_CLIENT_MAX_BODY_SIZE}"
echo ""
echo "🚀 Para aplicar as mudanças, reinicie o container nginx:"
echo "   docker-compose restart nginx"
