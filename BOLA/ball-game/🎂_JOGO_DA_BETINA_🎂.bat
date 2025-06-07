@echo off
cls
title 🎂 Jogo da Betina - Aniversario Especial 🎂
color 0E

echo.
echo    🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
echo    🎉                                                              🎉
echo    🎂              FELIZ ANIVERSARIO, BETINA!                     🎂
echo    🎉                   Seu jogo especial!                        🎉
echo    🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
echo.

cd /d "%~dp0"

echo    🔍 Verificando sistema...
echo.

REM Tenta Node.js primeiro
echo    Testando Node.js...
node --version >nul 2>&1
if not errorlevel 1 (
    echo    ✅ Node.js encontrado!
    echo    🎮 Iniciando servidor com Node.js...
    echo.
    echo    📍 O jogo estara disponivel em:
    echo       🏠 Local:   http://localhost:8080
    echo       🌐 Publico: http://177.93.155.178:8080
    echo.
    echo    🎁 Compartilhe o link publico com todos!
    echo    🎂 Feliz Aniversario, Betina! 🎂
    echo.
    echo    ⏹️  Para parar: Ctrl + C
    echo    ======================================================
    echo.
    
    node betina-servidor.js
    goto :end
)

REM Se Node.js não funcionar, tenta Python
echo    ⚠️  Node.js nao encontrado. Tentando Python...
python --version >nul 2>&1
if not errorlevel 1 (
    echo    ✅ Python encontrado!
    echo    🎮 Iniciando servidor com Python...
    echo.
    
    python betina-servidor.py
    goto :end
)

REM Se nada funcionar
echo    ❌ Nem Node.js nem Python foram encontrados!
echo.
echo    💡 SOLUCOES:
echo    1. Instale Node.js de: https://nodejs.org
echo    2. OU instale Python de: https://python.org  
echo    3. OU abra manualmente: src\index.html
echo.

:end
echo.
echo    🛑 Pressione qualquer tecla para sair...
pause >nul
