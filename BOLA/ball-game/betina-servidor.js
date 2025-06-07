// 🎂 Servidor SUPER SIMPLES para Betina 🎂
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🎂 Iniciando servidor da Betina...');

const server = http.createServer((req, res) => {
    console.log('📥 Pedido:', req.url);
    
    // Página principal
    if (req.url === '/' || req.url === '/index.html') {
        console.log('📄 Servindo index.html');
        fs.readFile('./src/index.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Erro: index.html não encontrado');
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
        return;
    }
    
    // CSS
    if (req.url === '/css/styles.css') {
        console.log('🎨 Servindo CSS');
        fs.readFile('./src/css/styles.css', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('CSS não encontrado');
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/css'});
            res.end(data);
        });
        return;
    }
    
    // JavaScript - game.js
    if (req.url === '/js/game.js') {
        console.log('🎮 Servindo game.js');
        fs.readFile('./src/js/game.js', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('game.js não encontrado');
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/javascript'});
            res.end(data);
        });
        return;
    }
    
    // JavaScript - ball.js
    if (req.url === '/js/ball.js') {
        console.log('⚽ Servindo ball.js');
        fs.readFile('./src/js/ball.js', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('ball.js não encontrado');
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/javascript'});
            res.end(data);
        });
        return;
    }
    
    // Página não encontrada
    console.log('❌ Arquivo não encontrado:', req.url);
    res.writeHead(404);
    res.end('404 - Página não encontrada: ' + req.url);
});

server.listen(8080, '0.0.0.0', () => {
    console.log('');
    console.log('🎉 ========================================');
    console.log('🎂   JOGO DA BETINA ESTÁ FUNCIONANDO!   🎂');
    console.log('🎉 ========================================');
    console.log('');
    console.log('📍 Acesse agora:');
    console.log('   🏠 Local:   http://localhost:8080');
    console.log('   🌐 Público: http://177.93.155.178:8080');
    console.log('');
    console.log('🎁 Compartilhe o link público com todos!');
    console.log('🎂 Feliz Aniversário, Betina! 🎂');
    console.log('');
    console.log('⏹️  Para parar: Ctrl + C');
    console.log('========================================');
    console.log('');
});

server.on('error', (err) => {
    console.log('❌ ERRO:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.log('🔄 A porta 8080 já está sendo usada.');
        console.log('💡 Feche outros programas e tente novamente.');
    }
    console.log('');
    process.exit(1);
});
