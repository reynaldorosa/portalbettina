// 🎂 Jogo Especial da Betina - Sistema Principal 🎂

class BetinaGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.level = 1;
        this.crystals = [];
        this.particles = [];
        this.birthdayEffects = [];
        this.gameRunning = false;
        this.musicEnabled = true;
        this.achievements = [];
        this.betinaCharacter = document.getElementById('betina-character');
        
        // Dimensões do canvas
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        // Configuração do áudio
        this.audioContext = null;
        this.initAudio();
        
        // Inicialização dos elementos
        this.initElements();
        this.setupEventListeners();
        this.createInitialCrystals();
        
        // Mensagens motivacionais para autistas
        this.motivationalMessages = [
            "Você é incrível, Betina! ✨",
            "Cada cristal que você pega brilha mais! 💎",
            "Suas habilidades especiais são um superpoder! 🌟",
            "Continue sendo maravilhosa! 🦄",
            "Você faz o mundo mais colorido! 🌈",
            "Sua forma única de ver as coisas é um presente! 🎁",
            "Betina, você é uma estrela brilhante! ⭐",
            "Cada conquista sua é uma celebração! 🎉"
        ];
        
        // Conquistas especiais
        this.achievementTargets = [
            { score: 10, message: "Primeira Conquista! 🥇", achieved: false },
            { score: 25, message: "Coletora de Cristais! 💎", achieved: false },
            { score: 50, message: "Aniversariante Especial! 🎂", achieved: false },
            { score: 75, message: "Guardiã dos Cristais! 👑", achieved: false },
            { score: 100, message: "Lenda da Betina! 🏆", achieved: false }
        ];
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Áudio não disponível');
        }
    }
    
    playSound(frequency, duration, type = 'sine') {
        if (!this.musicEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playCrystalSound(type) {
        if (!this.musicEnabled || !this.audioContext) return;
        
        switch(type) {
            case 'birthday':
                // Sequência especial de aniversário
                setTimeout(() => this.playSound(523, 0.2), 0);    // Dó
                setTimeout(() => this.playSound(659, 0.2), 150);  // Mi
                setTimeout(() => this.playSound(784, 0.3), 300);  // Sol
                break;
            case 'special':
                // Som dourado especial
                this.playSound(880, 0.4, 'sawtooth');
                break;
            case 'bonus':
                // Som de bonus
                this.playSound(698, 0.3, 'triangle');
                break;
            default:
                // Som normal
                this.playSound(523, 0.2, 'sine');
        }
    }
    
    initElements() {
        // Atualiza elementos da interface
        this.updateUI();
        this.updateBetinaModel();
    }
    
    setupEventListeners() {
        // Botão de início
        document.getElementById('start-button').addEventListener('click', () => {
            this.startGame();
        });
        
        // Botão de pausa
        document.getElementById('pause-button').addEventListener('click', () => {
            this.togglePause();
        });
        
        // Botão de música
        document.getElementById('music-toggle').addEventListener('click', () => {
            this.toggleMusic();
        });
        
        // Cliques no canvas
        this.canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });
        
        // Touch para dispositivos móveis
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.checkCrystalClick(x, y);
        });
    }
    
    createInitialCrystals() {
        // Cria cristais iniciais na tela
        for (let i = 0; i < 3; i++) {
            this.createCrystal();
        }
    }
    
    createCrystal() {
        const types = ['normal', 'normal', 'normal', 'bonus', 'birthday', 'special'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const crystal = new MagicCrystal(
            Math.random() * (this.canvas.width - 100) + 50,
            Math.random() * (this.canvas.height - 100) + 50,
            type
        );
        
        this.crystals.push(crystal);
    }
    
    startGame() {
        this.gameRunning = true;
        document.getElementById('start-button').style.display = 'none';
        document.getElementById('pause-button').style.display = 'inline-block';
        
        // Som de início
        this.playSound(523, 0.2); // Dó
        this.playSound(659, 0.2); // Mi
        this.playSound(784, 0.3); // Sol
        
        // Inicia o loop do jogo
        this.gameLoop();
        
        // Criar novos cristais regularmente
        this.crystalInterval = setInterval(() => {
            if (this.gameRunning && this.crystals.length < 5) {
                this.createCrystal();
            }
        }, 3000 - (this.level * 200)); // Fica mais rápido com o nível
    }
    
    togglePause() {
        this.gameRunning = !this.gameRunning;
        const pauseBtn = document.getElementById('pause-button');
        
        if (this.gameRunning) {
            pauseBtn.textContent = '⏸️ Pausar';
            this.gameLoop();
        } else {
            pauseBtn.textContent = '▶️ Continuar';
        }
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const musicBtn = document.getElementById('music-toggle');
        musicBtn.textContent = this.musicEnabled ? '🎵 Música' : '🔇 Som Off';
    }
    
    handleCanvasClick(e) {
        if (!this.gameRunning) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.checkCrystalClick(x, y);
    }
    
    checkCrystalClick(x, y) {
        for (let i = this.crystals.length - 1; i >= 0; i--) {
            const crystal = this.crystals[i];
            
            if (crystal.isClicked(x, y)) {
                this.collectCrystal(crystal, i, x, y);
                break;
            }
        }
    }
    
    collectCrystal(crystal, index, x, y) {
        // Coleta o cristal e obtém informações
        const result = crystal.collect();
        
        // Remove o cristal
        this.crystals.splice(index, 1);
        
        // Aumenta pontuação baseada no tipo
        this.score += result.points;
        this.updateUI();
        
        // Efeito sonoro baseado no tipo
        this.playCrystalSound(crystal.type);
        
        // Cria efeito especial baseado no tipo
        if (crystal.type === 'birthday') {
            this.birthdayEffects.push(new BirthdayEffect(x, y));
            // Animação especial de aniversário para a Betina
            this.updateBetinaModel('birthday');
        } else {
            this.createParticles(x, y, crystal.color);
            // Atualiza humor da Betina
            this.updateBetinaModel('happy');
        }
        
        // Verifica conquistas
        this.checkAchievements();
        
        // Verifica mudança de nível
        this.checkLevelUp();
        
        // Mostra mensagem motivacional ocasionalmente
        if (Math.random() < 0.3) {
            this.showMotivationalMessage();
        }
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 12; i++) {
            const particle = {
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                decay: 0.02,
                color: color,
                size: 3 + Math.random() * 4
            };
            this.particles.push(particle);
        }
    }
    
    showMotivationalMessage() {
        const message = this.motivationalMessages[Math.floor(Math.random() * this.motivationalMessages.length)];
        this.showCelebration(message);
    }
    
    checkAchievements() {
        this.achievementTargets.forEach(achievement => {
            if (!achievement.achieved && this.score >= achievement.score) {
                achievement.achieved = true;
                this.addAchievement(achievement.message);
                this.playAchievementSound();
            }
        });
    }
    
    addAchievement(message) {
        const achievementList = document.getElementById('achievement-list');
        const achievementDiv = document.createElement('div');
        achievementDiv.className = 'achievement-item';
        achievementDiv.textContent = message;
        achievementList.appendChild(achievementDiv);
        
        this.showCelebration(message);
    }
    
    playAchievementSound() {
        // Sequência musical para conquista
        setTimeout(() => this.playSound(523, 0.2), 0);    // Dó
        setTimeout(() => this.playSound(659, 0.2), 200);  // Mi  
        setTimeout(() => this.playSound(784, 0.2), 400);  // Sol
        setTimeout(() => this.playSound(1047, 0.4), 600); // Dó oitava
    }
    
    checkLevelUp() {
        const newLevel = Math.floor(this.score / 30) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.updateUI();
            this.showCelebration(`Nível ${this.level} alcançado! 🌟`);
            this.playAchievementSound();
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        
        // Atualiza humor baseado na pontuação
        const moodElement = document.getElementById('mood');
        if (this.score < 20) moodElement.textContent = 'Curiosa';
        else if (this.score < 50) moodElement.textContent = 'Feliz';
        else if (this.score < 100) moodElement.textContent = 'Radiante';
        else moodElement.textContent = 'Eufórica';
    }
    
    updateBetinaModel(mood = 'normal') {
        // Adiciona efeitos visuais à Betina baseado no humor
        if (mood === 'happy') {
            this.betinaCharacter.style.animation = 'betinaHappy 0.5s ease-in-out 3';
            setTimeout(() => {
                this.betinaCharacter.style.animation = 'betinaHappy 2s ease-in-out infinite';
            }, 1500);
        } else if (mood === 'birthday') {
            // Animação especial para cristais de aniversário
            this.betinaCharacter.classList.add('betina-birthday-celebration');
            setTimeout(() => {
                this.betinaCharacter.classList.remove('betina-birthday-celebration');
                this.betinaCharacter.style.animation = 'betinaHappy 2s ease-in-out infinite';
            }, 3000);
        }
    }
    
    showCelebration(message) {
        const overlay = document.getElementById('celebration-overlay');
        const messageElement = overlay.querySelector('.celebration-message');
        messageElement.textContent = message;
        overlay.style.display = 'flex';
        
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 2500);
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Atualiza e desenha cristais
        this.updateAndDrawCrystals();
        
        // Atualiza e desenha partículas
        this.updateParticles();
        
        // Atualiza e desenha efeitos de aniversário
        this.updateBirthdayEffects();
        
        // Continua o loop
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateAndDrawCrystals() {
        this.crystals.forEach(crystal => {
            crystal.update();
            crystal.draw(this.ctx);
        });
    }
    
    updateBirthdayEffects() {
        for (let i = this.birthdayEffects.length - 1; i >= 0; i--) {
            const effect = this.birthdayEffects[i];
            effect.update();
            effect.draw(this.ctx);
            
            if (effect.isFinished()) {
                this.birthdayEffects.splice(i, 1);
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }
}

// Função global para esconder celebração
function hideCelebration() {
    document.getElementById('celebration-overlay').style.display = 'none';
}

// Inicializa o jogo quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    window.betinaGame = new BetinaGame();
    
    // Mensagem de boas-vindas especial
    setTimeout(() => {
        window.betinaGame.showCelebration('Bem-vinda ao seu jogo especial, Betina! 🎂✨');
    }, 1000);
});