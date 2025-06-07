@echo off
echo ======================================
echo Iniciando Portal Betina em Docker
echo ======================================
echo.
echo Construindo e iniciando os containers...
echo.
docker-compose up -d --build
echo.
echo Containers iniciados! O Portal Betina estará disponível em:
echo http://localhost:5173
echo.
echo Para encerrar, pressione qualquer tecla e depois execute:
echo docker-compose down
echo.
pause
