@echo off
cls
title Jogo da Betina - Servidor
color 0E

echo.
echo    🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
echo    🎉                                                    🎉
echo    🎂        FELIZ ANIVERSARIO, BETINA!                 🎂
echo    🎉                                                    🎉
echo    🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂🎂
echo.
echo    Iniciando seu jogo especial...
echo.

cd /d "%~dp0"

echo    Verificando Node.js...
node --version
if errorlevel 1 (
    echo    ❌ Node.js nao encontrado!
    echo    💡 Instale o Node.js de: https://nodejs.org
    pause
    exit
)

echo.
echo    ✅ Node.js encontrado!
echo    🎮 Iniciando servidor do jogo...
echo.

node betina-servidor.js

echo.
echo    🛑 Servidor parado.
echo    Pressione qualquer tecla para sair...
pause >nul
