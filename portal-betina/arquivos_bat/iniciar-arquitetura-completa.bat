@echo off
echo ======================================
echo   Portal Betina - Arquitetura Completa
echo ======================================
echo.
echo 🏗️  Iniciando todos os serviços:
echo    • Nginx (Reverse Proxy)
echo    • Frontend Vite (React)
echo    • API Backend (Node.js)
echo    • PostgreSQL Database
echo.
echo 🚀 Construindo e iniciando containers...
echo.

docker-compose -f docker-compose.full.yml up -d --build

echo.
echo ✅ Serviços iniciados com sucesso!
echo.
echo 📊 Acesse o Portal Betina em:
echo    http://localhost
echo.
echo 🔍 Monitoramento:
echo    • Frontend: http://localhost:5173 (direto)
echo    • API: http://localhost/api/health
echo    • Database: localhost:5433
echo.
echo 📋 Para verificar logs:
echo    docker-compose -f docker-compose.full.yml logs -f
echo.
echo 🛑 Para parar todos os serviços:
echo    docker-compose -f docker-compose.full.yml down
echo.
pause
