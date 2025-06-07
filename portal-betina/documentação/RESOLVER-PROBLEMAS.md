# Solução de Problemas - Portal Betina Docker

## Problemas Comuns e Soluções

### 1. O Docker não inicia

**Sintoma**: Mensagem de erro ao tentar iniciar o Docker

**Soluções**:
- Verifique se o Docker Desktop está instalado
- Certifique-se de que o Docker Desktop está em execução
- Reinicie o computador e tente novamente
- Verifique se o WSL2 está ativado (Windows)

### 2. Erro ao iniciar os containers

**Sintoma**: Mensagem de erro sobre portas ou recursos já em uso

**Soluções**:
- Verifique se não há outros serviços usando as portas 5173 ou 5432
- Pare outros containers que possam estar usando essas portas: `docker stop $(docker ps -q)`
- Reinicie o Docker Desktop

### 3. Erro de conexão com o banco de dados

**Sintoma**: O Portal mostra "Modo Local" ao invés de "BD Conectado"

**Soluções**:
- Execute o script `testar-docker.bat` para verificar o status do container
- Se o container estiver parado, reinicie-o com: `docker-compose restart db`
- Verifique os logs do container: `docker logs portal-betina-db`

### 4. Lentidão na aplicação

**Sintoma**: A aplicação está muito lenta dentro do Docker

**Soluções**:
- Aumente os recursos alocados ao Docker nas configurações do Docker Desktop
- Reinicie os containers: `docker-compose down && docker-compose up -d`
- Limpe volumes não utilizados: `docker volume prune`

### 5. As alterações no código não estão sendo refletidas

**Sintoma**: Você edita arquivos mas não vê as alterações no navegador

**Soluções**:
- Pressione Ctrl+F5 para forçar a recarga do navegador
- Reinicie o container da aplicação: `docker-compose restart app`
- Verifique os logs: `docker-compose logs app`

### 6. Erros de permissão de volume

**Sintoma**: Erros relacionados a permissões ou acesso negado

**Soluções**:
- No Windows, verifique se o Docker tem permissão para acessar a pasta do projeto
- Reinicie o Docker com direitos de administrador

### 7. Redefinir completamente o ambiente

Se você quiser começar do zero:

```
docker-compose down
docker volume rm portal-betina_postgres_data
docker-compose up -d --build
```

## Comandos Docker Úteis

- Ver logs em tempo real: `docker-compose logs -f`
- Reiniciar serviços: `docker-compose restart`
- Parar todos os serviços: `docker-compose down`
- Verificar containers em execução: `docker ps`
- Acessar shell do banco de dados: `docker exec -it portal-betina-db psql -U betina_user -d betina_db`
