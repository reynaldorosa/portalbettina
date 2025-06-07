@echo off
echo 🎂 Iniciando Servidor Público do Jogo da Betina 🎂
echo.
echo Configurando servidor para aceitar conexões externas...
echo IP Público: 177.93.155.178
echo Porta: 8080
echo.
echo IMPORTANTE: 
echo 1. Verifique se a porta 8080 está liberada no firewall do Windows
echo 2. Configure o roteador para fazer port forwarding da porta 8080 para este computador
echo 3. O jogo estará disponível em: http://177.93.155.178:8080
echo.
echo Iniciando servidor...
echo.

REM Iniciar o servidor Node.js personalizado
node server.js
