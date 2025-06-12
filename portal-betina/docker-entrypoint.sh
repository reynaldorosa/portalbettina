#!/bin/sh
set -e

# Aguardar o banco de dados estar disponível
echo "Aguardando banco de dados..."
while ! nc -z ${DB_HOST:-db} ${DB_PORT:-5432}; do
  echo "Banco de dados não está pronto - aguardando..."
  sleep 2
done

echo "Banco de dados está pronto!"

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
  echo "Instalando dependências..."
  npm install
fi

# Verificar se os diretórios necessários existem
mkdir -p /app/logs

# Executar o comando passado como argumento
echo "Iniciando aplicação..."
exec "$@"
