// 🎂 Cristais Mágicos da Betina - Sistema de Objetos Especiais 🎂

class MagicCrystal {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = this.getTypeSize();
        this.color = this.getTypeColor();
        this.rotation = 0;
        this.rotationSpeed = 1 + Math.random() * 2;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.sparkles = [];
        this.collected = false;
        this.createdAt = Date.now();
        
        // Propriedades especiais para autismo (movimentos previsíveis)
        this.floatAmplitude = 5;
        this.floatSpeed = 0.02;
        this.originalY = y;
        
        // Cria sparkles iniciais
        this.createSparkles();
    }
    
    getTypeSize() {
        switch(this.type) {
            case 'birthday': return 35;
            case 'special': return 40;
            case 'bonus': return 30;
            default: return 25;
        }
    }
    
    getTypeColor() {
        switch(this.type) {
            case 'birthday': return '#ff6b6b'; // Rosa do aniversário
            case 'special': return '#ffd700';  // Dourado especial
            case 'bonus': return '#4ecdc4';    // Azul bonus
            default: return this.getRandomColor();
        }
    }
    
    getRandomColor() {
        const autismFriendlyColors = [
            '#ff9a9e', '#fecfef', '#a8edea', '#fed6e3',
            '#96ceb4', '#ffeaa7', '#fab1a0', '#fd79a8'
        ];
        return autismFriendlyColors[Math.floor(Math.random() * autismFriendlyColors.length)];
    }
    
    createSparkles() {
        for (let i = 0; i < 8; i++) {
            this.sparkles.push({
                angle: (i / 8) * Math.PI * 2,
                distance: this.size + 10,
                size: 2 + Math.random() * 3,
                speed: 0.05 + Math.random() * 0.05
            });
        }
    }
    
    update() {
        // Rotação suave e previsível
        this.rotation += this.rotationSpeed;
        this.pulsePhase += 0.05;
        
        // Movimento de flutuação suave (bom para autismo)
        this.y = this.originalY + Math.sin(Date.now() * this.floatSpeed) * this.floatAmplitude;
        
        // Atualiza sparkles
        this.sparkles.forEach(sparkle => {
            sparkle.angle += sparkle.speed;
        });
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Desenha sparkles ao redor
        this.drawSparkles(ctx);
        
        // Efeito de pulso suave
        const pulseSize = this.size + Math.sin(this.pulsePhase) * 3;
        
        ctx.rotate(this.rotation * Math.PI / 180);
        
        // Sombra suave
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Gradiente do cristal
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, pulseSize);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(0.7, this.color + 'CC');
        gradient.addColorStop(1, this.color + '66');
        
        ctx.fillStyle = gradient;
        
        // Forma de cristal (losango)
        ctx.beginPath();
        ctx.moveTo(0, -pulseSize);
        ctx.lineTo(pulseSize * 0.7, -pulseSize * 0.3);
        ctx.lineTo(pulseSize, 0);
        ctx.lineTo(pulseSize * 0.7, pulseSize * 0.3);
        ctx.lineTo(0, pulseSize);
        ctx.lineTo(-pulseSize * 0.7, pulseSize * 0.3);
        ctx.lineTo(-pulseSize, 0);
        ctx.lineTo(-pulseSize * 0.7, -pulseSize * 0.3);
        ctx.closePath();
        ctx.fill();
        
        // Brilho interno
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(0, -pulseSize * 0.5);
        ctx.lineTo(pulseSize * 0.4, 0);
        ctx.lineTo(0, pulseSize * 0.5);
        ctx.lineTo(-pulseSize * 0.4, 0);
        ctx.closePath();
        ctx.fill();
        
        // Linha de brilho central
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -pulseSize * 0.3);
        ctx.lineTo(0, pulseSize * 0.3);
        ctx.stroke();
        
        ctx.restore();
    }
    
    drawSparkles(ctx) {
        this.sparkles.forEach(sparkle => {
            const x = Math.cos(sparkle.angle) * sparkle.distance;
            const y = Math.sin(sparkle.angle) * sparkle.distance;
            
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(x, y, sparkle.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    isClicked(clickX, clickY) {
        const distance = Math.sqrt((clickX - this.x) ** 2 + (clickY - this.y) ** 2);
        return distance < this.size;
    }
    
    getPoints() {
        switch(this.type) {
            case 'birthday': return 25;  // Pontos extras no aniversário
            case 'special': return 30;   // Cristal dourado especial
            case 'bonus': return 20;     // Bonus azul
            default: return 10;          // Cristal normal
        }
    }
    
    collect() {
        this.collected = true;
        return {
            points: this.getPoints(),
            type: this.type,
            message: this.getCollectionMessage()
        };
    }
    
    getCollectionMessage() {
        switch(this.type) {
            case 'birthday': return 'Cristal do Aniversário! 🎂';
            case 'special': return 'Cristal Dourado Especial! ⭐';
            case 'bonus': return 'Cristal Bonus! 💫';
            default: return 'Cristal Coletado! ✨';
        }
    }
}

// Sistema de Partículas para Efeitos Visuais Suaves
class SoftParticle {
    constructor(x, y, color, size = 3) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4; // Movimento mais suave
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1;
        this.decay = 0.015; // Decaimento mais lento
        this.color = color;
        this.size = size;
        this.gravity = 0.02; // Gravidade suave
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= this.decay;
        this.vx *= 0.99; // Resistência do ar
        this.vy *= 0.99;
    }
    
    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life;
        
        // Gradiente suave para a partícula
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, this.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Classe para Efeitos Especiais de Aniversário
class BirthdayEffect {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.hearts = [];
        this.duration = 2000; // 2 segundos
        this.startTime = Date.now();
        
        this.createBirthdayParticles();
    }
    
    createBirthdayParticles() {
        // Confetes coloridos
        const birthdayColors = ['#ff6b6b', '#4ecdc4', '#ffd700', '#ff9a9e', '#96ceb4'];
        
        for (let i = 0; i < 20; i++) {
            const color = birthdayColors[Math.floor(Math.random() * birthdayColors.length)];
            this.particles.push(new SoftParticle(this.x, this.y, color, 4 + Math.random() * 3));
        }
        
        // Corações especiais
        for (let i = 0; i < 5; i++) {
            this.hearts.push({
                x: this.x + (Math.random() - 0.5) * 50,
                y: this.y + (Math.random() - 0.5) * 50,
                size: 8 + Math.random() * 6,
                life: 1,
                decay: 0.01,
                vy: -1 - Math.random()
            });
        }
    }
    
    update() {
        // Atualiza partículas
        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(particle => !particle.isDead());
        
        // Atualiza corações
        this.hearts.forEach(heart => {
            heart.y += heart.vy;
            heart.life -= heart.decay;
        });
        this.hearts = this.hearts.filter(heart => heart.life > 0);
    }
    
    draw(ctx) {
        // Desenha partículas
        this.particles.forEach(particle => particle.draw(ctx));
        
        // Desenha corações
        this.hearts.forEach(heart => {
            ctx.save();
            ctx.globalAlpha = heart.life;
            ctx.fillStyle = '#ff6b6b';
            
            // Desenha coração simples
            ctx.font = `${heart.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('💖', heart.x, heart.y);
            
            ctx.restore();
        });
    }
    
    isFinished() {
        return Date.now() - this.startTime > this.duration && 
               this.particles.length === 0 && 
               this.hearts.length === 0;
    }
}