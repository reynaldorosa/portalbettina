# 🌐 Configuração para Acesso Público do Jogo da Betina

## Seu IP Público: 177.93.155.178

### 🚀 Passos para Disponibilizar o Jogo:

#### 1. Configuração do Roteador (Port Forwarding):
Acesse o painel administrativo do seu roteador (geralmente em 192.168.1.1 ou 192.168.0.1) e configure:

- **Porta Externa**: 8080
- **IP Interno**: [SEU IP LOCAL] (exemplo: 192.168.1.100)
- **Porta Interna**: 8080
- **Protocolo**: TCP
- **Nome**: Jogo Betina

#### 2. Configuração do Windows Firewall:
Execute no Prompt de Comando como Administrador:
```cmd
netsh advfirewall firewall add rule name="Jogo Betina" dir=in action=allow protocol=TCP localport=8080
```

#### 3. Iniciar o Servidor:
Execute o arquivo `start-public-server.bat` ou rode:
```cmd
npm run start-public
```

### 🌍 URLs de Acesso:

#### Para Pessoas na Sua Rede Local:
- http://192.168.1.XXX:8080 (substitua XXX pelo seu IP local)

#### Para Pessoas na Internet:
- **http://177.93.155.178:8080**

### ⚠️ Considerações de Segurança:

1. **Temporário**: Mantenha o servidor ativo apenas durante o evento/festa
2. **Firewall**: Configure regras específicas para a porta 8080
3. **Monitoramento**: Monitore o acesso ao servidor
4. **Backup**: Faça backup do jogo antes de disponibilizar

### 🎂 Compartilhando o Jogo:

Envie este link para amigos e familiares:
**http://177.93.155.178:8080**

### 📱 Testando o Acesso:

1. **Local**: Teste primeiro em http://localhost:8080
2. **Rede Local**: Teste com outros dispositivos na sua casa
3. **Internet**: Peça para alguém de fora testar o link público

### 🛠️ Solução de Problemas:

Se não funcionar:
1. Verifique se o roteador está configurado corretamente
2. Confirme se o firewall permite a porta 8080
3. Verifique se seu provedor não bloqueia a porta
4. Teste com outra porta (ex: 8081, 3000)

### 📞 Suporte:
- Verifique o IP público atual em: https://whatismyipaddress.com/
- Se o IP mudou, atualize as configurações
