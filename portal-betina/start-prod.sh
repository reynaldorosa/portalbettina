#!/bin/sh

# Script de inicialização para produção
echo "🚀 Iniciando Portal Betina - Produção"

# Verificar se os arquivos estão no lugar correto
echo "📁 Verificando arquivos..."
ls -la /usr/share/nginx/html/

# Iniciar nginx em background
echo "🌐 Iniciando Nginx..."
nginx &

# Verificar se há APIs Node.js para iniciar
if [ -f "/app/package.json" ]; then
    echo "⚡ Iniciando APIs Node.js..."
    cd /app
    node src/services/api-server.js &
fi

# Aguardar os serviços
echo "✅ Portal Betina pronto!"
echo "📊 Frontend: http://localhost/"
echo "🔌 API: http://localhost/api/"
echo "💚 Health: http://localhost/health"

# Manter o container ativo
wait
