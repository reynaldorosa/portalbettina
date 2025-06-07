
@echo off
title Portal Betina - Inicio Rapido
color 0b

cls
echo.
echo    ██████╗  ██████╗ ██████╗ ████████╗ █████╗ ██╗          
echo    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██║          
echo    ██████╔╝██║   ██║██████╔╝   ██║   ███████║██║          
echo    ██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══██║██║          
echo    ██║     ╚██████╔╝██║  ██║   ██║   ██║  ██║███████╗     
echo    ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝     
echo.
echo    ██████╗ ███████╗████████╗██╗███╗   ██╗ █████╗           
echo    ██╔══██╗██╔════╝╚══██╔══╝██║████╗  ██║██╔══██╗          
echo    ██████╔╝█████╗     ██║   ██║██╔██╗ ██║███████║          
echo    ██╔══██╗██╔══╝     ██║   ██║██║╚██╗██║██╔══██║          
echo    ██████╔╝███████╗   ██║   ██║██║ ╚████║██║  ██║          
echo    ╚═════╝ ╚══════╝   ╚═╝   ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝          
echo.
echo  ══════════════════════════════════════════════════════════
echo   💝 Portal de Atividades Terapeuticas para Criancas Especiais
echo  ══════════════════════════════════════════════════════════
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  ❌ ERRO: Node.js nao encontrado!
    echo.
    echo  📥 Para usar o Portal Betina, voce precisa instalar o Node.js:
    echo     1. Acesse: https://nodejs.org
    echo     2. Baixe a versao LTS (recomendada)
    echo     3. Instale e reinicie o computador
    echo     4. Execute este arquivo novamente
    echo.
    echo  💡 Alternativa: Abra o arquivo 'teste-portal.html' para uma previa
    echo.
    pause
    exit /b 1
)

REM Navegar para a pasta do projeto
cd /d "%~dp0"

REM Verificar se o package.json existe
if not exist "package.json" (
    echo  ❌ ERRO: Arquivo package.json nao encontrado!
    echo  📁 Verifique se voce esta na pasta correta do projeto.
    echo.
    pause
    exit /b 1
)

echo  ✅ Node.js encontrado! Versao:
node --version
echo.

REM Instalar dependências se necessário
if not exist "node_modules" (
    echo  📦 Primeira execucao detectada!
    echo  🔄 Instalando dependencias... (pode levar alguns minutos)
    echo.
    npm install
    
    if %errorlevel% neq 0 (
        echo.
        echo  ❌ Erro ao instalar dependencias!
        echo  🔄 Tentando com cache limpo...
        echo.
        npm cache clean --force
        npm install
    )
    
    echo.
    echo  ✅ Dependencias instaladas com sucesso!
    echo.
) else (
    echo  ✅ Dependencias ja instaladas!
    echo.
)

echo  🚀 Iniciando Portal Betina...
echo.
echo  ⏳ Aguarde alguns segundos para o servidor inicializar...
echo  🌐 O navegador abrira automaticamente em: http://localhost:5173
echo.
echo  🎮 Atividades disponiveis:
echo     • 🧠 Jogo da Memoria
echo     • 🌈 Combinar Cores
echo     • 🔗 Associacao de Imagens
echo.
echo  ♿ Recursos de acessibilidade inclusos!
echo  💝 Projeto 100%% gratuito e open source
echo.
echo  ══════════════════════════════════════════════════════════
echo   Pressione Ctrl+C para parar o servidor quando terminar
echo  ══════════════════════════════════════════════════════════
echo.

REM Iniciar o servidor
npm run dev

echo.
echo  👋 Portal Betina foi encerrado.
echo  💝 Obrigado por usar nosso projeto!
echo.
pause
