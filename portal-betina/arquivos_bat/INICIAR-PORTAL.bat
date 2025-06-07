@echo off
title Portal Betina - Iniciador Rapido
color 0a
echo.
echo  ==========================================
echo   🌟 PORTAL BETINA - ATIVIDADES TERAPEUTICAS 🌟
echo  ==========================================
echo.
echo  💝 Portal gratuito para criancas com:
echo     • Autismo (TEA)
echo     • TDAH  
echo     • Outras necessidades cognitivas
echo.
echo  📱 Funciona em celular, tablet e computador
echo  ♿ Totalmente acessivel e inclusivo
echo  🎮 3 atividades principais ja funcionais
echo.
echo  ==========================================
echo   🚀 INICIANDO O SERVIDOR...
echo  ==========================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo  📦 Instalando dependencias pela primeira vez...
    echo  ⏳ Isso pode levar alguns minutos...
    echo.
    npm install
    echo.
    echo  ✅ Dependencias instaladas com sucesso!
    echo.
)

echo  🔧 Iniciando servidor de desenvolvimento...
echo.
echo  📍 O portal abrira automaticamente no navegador
echo  🌐 Geralmente em: http://localhost:5173
echo.
echo  ⭐ Aproveite as atividades terapeuticas!
echo.
echo  ==========================================

npm run dev

pause
