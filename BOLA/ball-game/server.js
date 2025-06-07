// 🎂 Servidor Público para o Jogo da Betina 🎂
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const HOST = '0.0.0.0'; // Aceita conexões de qualquer IP

// MIME types para diferentes arquivos
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Remove query parameters da URL
    let urlPath = req.url.split('?')[0];
    
    // Se for a raiz, serve o index.html
    if (urlPath === '/') {
        urlPath = '/index.html';
    }
    
    // Caminho completo do arquivo
    const filePath = path.join(__dirname, 'src', urlPath);
    
    // Verifica se o arquivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Arquivo não encontrado
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <h1>404 - Arquivo não encontrado</h1>
                <p>Ops! O arquivo ${urlPath} não foi encontrado.</p>
                <a href="/">Voltar ao jogo da Betina</a>
            `);
            return;
        }
        
        // Determina o tipo MIME
        const ext = path.extname(filePath);
        const mimeType = mimeTypes[ext] || 'text/plain';
        
        // Lê e serve o arquivo
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Erro interno do servidor</h1>');
                return;
            }
            
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(data);
        });
    });
});

server.listen(PORT, HOST, () => {
    console.log('🎂 ========================================');
    console.log('🎉  JOGO DA BETINA ESTÁ NO AR!  🎉');
    console.log('🎂 ========================================');
    console.log('');
    console.log(`📍 Servidor rodando em:`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   Público: http://177.93.155.178:${PORT}`);
    console.log('');
    console.log('🎁 Compartilhe o link público com amigos e família!');
    console.log('🎂 Feliz Aniversário, Betina! 🎂');
    console.log('');
    console.log('⏹️  Para parar o servidor: Ctrl + C');
    console.log('========================================');
});

// Tratamento de erros
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Porta ${PORT} já está em uso!`);
        console.log('💡 Tente fechar outros servidores ou usar outra porta.');
    } else {
        console.log('❌ Erro no servidor:', err.message);
    }
});
