@echo off
REM Script para auditoria de segurança do Portal Betina
echo ========================================
echo    AUDITORIA DE SEGURANÇA - PORTAL BETINA
echo    Data: %date% %time%
echo ========================================
echo.
echo 1. Verificando vulnerabilidades de dependências...
cd c:\Projetos\portalbettina\portal-betina
npm audit

echo.
echo 2. Verificando código com ESLint...
npm run lint

echo.
echo 3. Verificando conectividade com serviços...
echo Testando API...
powershell -Command "try { $response = Invoke-WebRequest -Uri http://localhost:3000/api/health -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host 'API: OK' -ForegroundColor Green } else { Write-Host 'API: Erro' -ForegroundColor Red } } catch { Write-Host 'API: Não disponível' -ForegroundColor Red }"

echo.
echo 4. Verificando configuração Docker...
docker-compose -f c:\Projetos\portalbettina\portal-betina\docker-compose.yml config

echo.
echo ========================================
echo    AUDITORIA CONCLUÍDA
echo    Verifique o relatório acima para detalhes
echo ========================================
pause
