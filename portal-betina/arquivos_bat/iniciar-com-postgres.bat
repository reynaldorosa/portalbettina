@echo off
echo ======================================
echo Iniciando Portal Betina com PostgreSQL
echo ======================================
echo.
echo Verificando se o PostgreSQL está em execução...
echo.

REM Verificar se o PostgreSQL está instalado
pg_isready >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo PostgreSQL não está instalado ou não está em execução!
    echo.
    echo Iniciando em modo Docker...
    echo.
    call iniciar-docker.bat
    goto :EOF
)

echo PostgreSQL detectado! Iniciando o Portal Betina...
echo.

REM Instalar dependências se necessário
if not exist node_modules (
    echo Instalando dependências...
    npm install
)

REM Iniciar a aplicação
npm run dev
echo.
pause
