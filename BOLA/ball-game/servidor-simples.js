// Servidor simples para o jogo da Betina
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

console.log('🎂 Iniciando servidor do jogo da Betina...');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './src/index.html';
    } else if (!filePath.startsWith('./src/')) {
        filePath = './src' + req.url;
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('404 - Arquivo não encontrado', 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Erro do servidor: '+error.code+' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('🎉 SERVIDOR INICIADO COM SUCESSO! 🎉');
    console.log('📍 Acesse o jogo em:');
    console.log('   Local:   http://localhost:' + PORT);
    console.log('   Público: http://177.93.155.178:' + PORT);
    console.log('🎂 Feliz Aniversário, Betina! 🎂');
});

server.on('error', (err) => {
    console.log('❌ Erro:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.log('💡 A porta 8080 já está em uso. Tente fechar outros programas.');
    }
});
