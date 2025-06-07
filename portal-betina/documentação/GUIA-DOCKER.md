# 🐳 PORTAL BETINA - GUIA DE DOCKER

## ⚡ INÍCIO RÁPIDO

### Método 1 - Duplo Clique:
```
📁 Localize o arquivo: iniciar-docker.bat
🖱️ Dê duplo clique
✅ Pronto! O projeto iniciará automaticamente com Docker
```

### Método 2 - Prompt de Comando:
```cmd
1. Pressione: Windows + R
2. Digite: cmd
3. Pressione: Enter
4. Cole este comando:
   cd "c:\Users\uniqs\Desktop\PORTALBETINA\portal-betina" && docker-compose up -d
```

## 📋 PRÉ-REQUISITOS

✅ **Docker Desktop** - Se não tiver instalado:
- Acesse: https://www.docker.com/products/docker-desktop/
- Baixe e instale o Docker Desktop para Windows
- Inicie o Docker Desktop e aguarde até que esteja em execução

## 🌐 APÓS INICIAR

O projeto estará disponível em:
```
http://localhost:5173
```

## 📊 BANCO DE DADOS

O PostgreSQL estará disponível em:
- Host: localhost
- Porta: 5432
- Usuário: betina_user
- Senha: betina_password
- Banco: betina_db

## 🛠️ COMANDOS ÚTEIS

### Ver Status dos Containers:
```cmd
docker ps
```

### Ver Logs:
```cmd
docker-compose logs -f
```

### Parar os Containers:
```cmd
docker-compose down
```

### Reiniciar com Dados Limpos:
```cmd
docker-compose down
docker volume rm portal-betina_postgres_data
docker-compose up -d
```

## 🔧 SOLUÇÃO DE PROBLEMAS

### O Portal Não Inicia:
- Verifique se o Docker Desktop está em execução
- Veja os logs com: `docker-compose logs -f`
- Reinicie os containers: `docker-compose restart`

### Problemas de Conexão com o Banco:
- Verifique se o container do banco está rodando: `docker ps`
- Veja os logs do banco: `docker logs portal-betina-db`
