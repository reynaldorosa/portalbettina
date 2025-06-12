// Gerador de áudio usando Web Audio API para criar sons básicos
export const generateAudioBuffer = (audioContext, frequency, duration, type = 'sine') => {
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * duration;
  const buffer = audioContext.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    let value = 0;
    
    switch (type) {
      case 'sine':
        value = Math.sin(2 * Math.PI * frequency * t);
        break;
      case 'square':
        value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
        break;
      case 'triangle':
        value = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
        break;
      case 'sawtooth':
        value = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
        break;
    }
    
    // Aplicar envelope para evitar cliques
    const envelope = Math.exp(-t * 3);
    data[i] = value * envelope * 0.3; // Volume reduzido
  }

  return buffer;
};

export const playGeneratedSound = async (audioContext, frequency, duration = 0.2, type = 'sine') => {
  if (!audioContext || audioContext.state !== 'running') {
    console.warn('AudioContext não está disponível');
    return;
  }

  try {
    const buffer = generateAudioBuffer(audioContext, frequency, duration, type);
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configurar volume
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    source.start();
    source.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn('Erro ao reproduzir som gerado:', error);
  }
};

// Sons predefinidos
export const SOUNDS = {
  SUCCESS: { frequency: 523.25, duration: 0.3, type: 'sine' }, // C5
  ERROR: { frequency: 196.00, duration: 0.5, type: 'square' }, // G3
  CLICK: { frequency: 800, duration: 0.1, type: 'sine' },
  NOTE_C: { frequency: 261.63, duration: 0.5, type: 'sine' }, // C4
  NOTE_D: { frequency: 293.66, duration: 0.5, type: 'sine' }, // D4
  NOTE_E: { frequency: 329.63, duration: 0.5, type: 'sine' }, // E4
  NOTE_F: { frequency: 349.23, duration: 0.5, type: 'sine' }, // F4
  NOTE_G: { frequency: 392.00, duration: 0.5, type: 'sine' }, // G4
  NOTE_A: { frequency: 440.00, duration: 0.5, type: 'sine' }, // A4
  NOTE_B: { frequency: 493.88, duration: 0.5, type: 'sine' }, // B4
  NOTE_C_HIGH: { frequency: 523.25, duration: 0.5, type: 'sine' } // C5
};
