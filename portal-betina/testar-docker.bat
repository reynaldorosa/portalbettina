@echo off
echo ======================================
echo Teste de Conexão do Portal Betina
echo ======================================
echo.
echo Verificando se o Docker está instalado...

docker --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Docker não está instalado! Por favor, instale o Docker Desktop para Windows.
    echo Você pode baixá-lo em: https://www.docker.com/products/docker-desktop/
    echo.
    goto :EOF
)

echo Docker está instalado! Verificando se está em execução...
echo.

docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Docker não está em execução! Por favor, inicie o Docker Desktop.
    echo.
    goto :EOF
)

echo Docker está em execução!
echo.
echo Verificando se o container do PostgreSQL está ativo...

docker ps | findstr portal-betina-db >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo O container do PostgreSQL não está ativo.
    echo.
    echo Deseja iniciar os containers do Portal Betina? (S/N)
    set /p RESPOSTA=
    if /i "%RESPOSTA%"=="S" (
        call iniciar-docker.bat
    )
    goto :EOF
)

echo PostgreSQL está ativo! Conexão estabelecida.
echo.
echo Resumo do sistema:
echo ------------------
echo.
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | findstr portal-betina
echo.
echo Banco de dados disponível em:
echo - Host: localhost
echo - Porta: 5432
echo - Usuário: betina_user
echo - Senha: betina_password
echo - Banco: betina_db
echo.
echo O Portal Betina está pronto para uso!
echo.
pause
