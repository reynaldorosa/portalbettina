import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import useSound from '../../hooks/useSound';
import useProgress from '../../hooks/useProgress';
import useTTS from '../../hooks/useTTS';
import useAdvancedActivity from '../../hooks/useAdvancedActivity';
import { announceToScreenReader, prefersHighContrast, prefersReducedMotion } from '../../utils/accessibility';
import {
  GameContainer,
  GameHeader,
  BackButton,
  ActivityTitleSection,
  ActivityMainTitle,
  ActivitySubtitle,
  DifficultySelector,
  DifficultyButton,
  ActionButton,
  InstructionText,
} from '../../styles/activityCommon';

// Definição de cores temáticas
const THEME_COLOR = 'var(--primary-pink)';
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-pink), var(--primary-orange))';

// Templates simplificados para crianças
const templates = [
  {
    id: 'sun',
    name: '☀️ Sol',
    emoji: '☀️',
    svg: `<svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="40" fill="#FFF5B7" stroke="#FFD700" stroke-width="3" class="colorable" data-area="center"/>
      <path d="M100 20 L100 40 M100 160 L100 180 M20 100 L40 100 M160 100 L180 100 M35 35 L50 50 M150 50 L165 35 M35 165 L50 150 M150 150 L165 165" stroke="#FFD700" stroke-width="4" stroke-linecap="round" class="colorable" data-area="rays"/>
    </svg>`
  },
  {
    id: 'flower',
    name: '🌸 Flor',
    emoji: '🌸',
    svg: `<svg viewBox="0 0 200 200">
      <circle cx="100" cy="80" r="15" fill="#FFB6C1" stroke="#FF69B4" stroke-width="2" class="colorable" data-area="petal1"/>
      <circle cx="85" cy="95" r="15" fill="#FFB6C1" stroke="#FF69B4" stroke-width="2" class="colorable" data-area="petal2"/>
      <circle cx="115" cy="95" r="15" fill="#FFB6C1" stroke="#FF69B4" stroke-width="2" class="colorable" data-area="petal3"/>
      <circle cx="90" cy="110" r="15" fill="#FFB6C1" stroke="#FF69B4" stroke-width="2" class="colorable" data-area="petal4"/>
      <circle cx="110" cy="110" r="15" fill="#FFB6C1" stroke="#FF69B4" stroke-width="2" class="colorable" data-area="petal5"/>
      <circle cx="100" cy="100" r="8" fill="#FFFF00" stroke="#FFD700" stroke-width="2" class="colorable" data-area="center"/>
      <line x1="100" y1="130" x2="100" y2="170" stroke="#32CD32" stroke-width="6" stroke-linecap="round" class="colorable" data-area="stem"/>
    </svg>`
  },
  {
    id: 'heart',
    name: '❤️ Coração',
    emoji: '❤️',
    svg: `<svg viewBox="0 0 200 200">
      <path d="M100 150 C100 150 70 120 70 90 C70 75 85 60 100 60 C115 60 130 75 130 90 C130 120 100 150 100 150 Z" fill="#FFB6C1" stroke="#FF1493" stroke-width="3" class="colorable" data-area="heart"/>
    </svg>`
  }
];

// Cores simples para crianças (apenas 6 cores básicas)
const simpleColors = [
  { name: 'Vermelho', hex: '#FF4444', emoji: '🔴' },
  { name: 'Azul', hex: '#4444FF', emoji: '🔵' },
  { name: 'Verde', hex: '#44FF44', emoji: '🟢' },
  { name: 'Amarelo', hex: '#FFFF44', emoji: '🟡' },
  { name: 'Rosa', hex: '#FF44FF', emoji: '🩷' },
  { name: 'Laranja', hex: '#FF8844', emoji: '🟠' }
];

// Configurações de dificuldade simplificadas
const difficulties = [
  { id: 'easy', name: 'Fácil', icon: '😊', description: 'Poucas partes para pintar' },
  { id: 'medium', name: 'Médio', icon: '🤔', description: 'Mais partes para pintar' },
  { id: 'hard', name: 'Difícil', icon: '🧠', description: 'Muitas partes para pintar' }
];

// Estilos simplificados
const MainContainer = styled.div`
  min-height: 100vh;
  background: ${({ $highContrast }) => ($highContrast ? '#000' : THEME_GRADIENT)};
  color: ${({ $highContrast }) => ($highContrast ? '#fff' : '#333')};
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
`;

const SimplifiedHeader = styled(GameHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
`;

const TemplateSelector = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TemplateCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  border: 3px solid ${props => props.selected ? THEME_COLOR : '#ddd'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    border-color: ${THEME_COLOR};
  }
`;

const ColorPalette = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ColorButton = styled.button`
  background: ${props => props.color};
  border: 4px solid ${props => props.selected ? '#333' : '#fff'};
  border-radius: 1rem;
  padding: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  color: ${props => props.color === '#FFFF44' ? '#333' : '#fff'};
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

const DrawingCanvas = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  svg {
    max-width: 100%;
    max-height: 100%;
    width: 300px;
    height: 300px;
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const SimpleButton = styled.button`
  background: ${THEME_COLOR};
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover:not(:disabled) {
    background: var(--primary-orange);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CreativePaintingSimple = ({ onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedColor, setSelectedColor] = useState(simpleColors[0]);
  const [difficulty, setDifficulty] = useState('easy');
  const [gameStarted, setGameStarted] = useState(false);
  const [coloredAreas, setColoredAreas] = useState({});
  
  const { playClick, playSuccess } = useSound();
  const { recordSuccess } = useProgress('creative-painting');
  const { speak, speakInstruction, autoSpeak } = useTTS();
  const highContrast = prefersHighContrast();
  const reducedMotion = prefersReducedMotion();
  
  // Sistema Multissensorial - Hook para métricas avançadas
  const { recordAdvancedInteraction, startAdvancedSession, stopAdvancedSession } = 
    useAdvancedActivity('creative-painting', {
      enableMotorSkills: true,
      enableCreativity: true,
      enableVisualProcessing: true
    });
  // Iniciar jogo
  const startGame = async () => {
    // Inicializar sessão multissensorial
    await startAdvancedSession();
    
    // Registrar início da atividade criativa
    recordAdvancedInteraction({
      type: 'activity_start',
      subtype: 'creative_painting_initiation',
      context: { 
        difficulty,
        creativeFocus: 'visual_artistic_expression',
        motorSkills: 'fine_motor_coordination',
        cognitiveProcess: 'creative_visualization'
      }
    });
      setGameStarted(true);
    playClick();
    autoSpeak("Escolha o que você quer pintar!", 1000);
    
    // Registrar TTS quando usado
    if (autoSpeak) {
      recordAdvancedInteraction({
        type: 'audio_playback',
        subtype: 'tts_instruction',
        context: { 
          message: "Escolha o que você quer pintar!",
          cognitiveSupport: 'auditory_guidance'
        }
      });
    }
  };
  // Selecionar template
  const selectTemplate = (template) => {
    // Registrar seleção de template
    recordAdvancedInteraction({
      type: 'template_selection',
      subtype: 'creative_pattern_choice',
      context: { 
        templateId: template.id,
        templateName: template.name,
        difficulty,
        creativeDecision: 'subject_matter_selection',
        visualProcessing: 'pattern_recognition'
      }
    });
    
    setSelectedTemplate(template);
    setColoredAreas({});    playClick();
    announceToScreenReader(`${template.name} selecionado para pintar`);
    autoSpeak(`Você escolheu pintar ${template.name}. Agora escolha uma cor!`, 500);
    
    // Registrar TTS quando usado
    if (autoSpeak) {
      recordAdvancedInteraction({
        type: 'audio_playback',
        subtype: 'tts_template_confirmation',
        context: { 
          templateName: template.name,
          message: `Você escolheu pintar ${template.name}. Agora escolha uma cor!`,
          cognitiveSupport: 'auditory_confirmation'
        }
      });
    }
  };
  // Selecionar cor
  const selectColor = (color) => {
    // Registrar seleção de cor
    recordAdvancedInteraction({
      type: 'color_selection',
      subtype: 'creative_color_choice',
      context: { 
        colorName: color.name,
        colorHex: color.hex,
        creativeDecision: 'aesthetic_color_selection',
        visualProcessing: 'color_perception'
      }
    });
    
    setSelectedColor(color);    playClick();
    announceToScreenReader(`Cor ${color.name} selecionada`);
    speak(`Cor ${color.name} selecionada!`);
    
    // Registrar TTS quando usado
    if (speak) {
      recordAdvancedInteraction({
        type: 'audio_playback',
        subtype: 'tts_color_confirmation',
        context: { 
          colorName: color.name,
          message: `Cor ${color.name} selecionada!`,
          cognitiveSupport: 'auditory_feedback'
        }
      });
    }
  };
  // Limpar desenho
  const clearDrawing = () => {
    // Registrar ação de limpeza
    recordAdvancedInteraction({
      type: 'canvas_clear',
      subtype: 'creative_reset_action',
      context: { 
        areasColored: Object.keys(coloredAreas).length,
        creativeProcess: 'artistic_revision',
        motorSkills: 'intentional_reset'
      }
    });
    
    setColoredAreas({});
    playClick();
    announceToScreenReader("Desenho limpo");
    speak("Desenho limpo! Comece de novo!");
  };
  // Salvar arte
  const saveArt = () => {
    // Registrar conclusão da obra de arte
    recordAdvancedInteraction({
      type: 'artwork_completion',
      subtype: 'creative_achievement',
      context: { 
        templateUsed: selectedTemplate?.name,
        colorsUsed: Object.values(coloredAreas).length,
        areasColored: Object.keys(coloredAreas).length,
        difficulty,
        creativeProcess: 'artistic_completion',
        motorSkills: 'fine_motor_achievement'
      }
    });
    
    playSuccess();
    announceToScreenReader("Arte salva com sucesso");
    speak("Sua obra de arte foi salva! Muito bem!");
    recordSuccess({ 
      template: selectedTemplate?.name, 
      colorsUsed: Object.values(coloredAreas).length,
      difficulty 
    });
  };

  // Renderizar SVG com interatividade
  const renderInteractiveSVG = () => {
    if (!selectedTemplate) return null;

    const svgContent = selectedTemplate.svg;
    return (
      <div
        dangerouslySetInnerHTML={{ __html: svgContent }}        onClick={(e) => {
          const area = e.target.getAttribute('data-area');
          if (area && selectedColor) {
            // Registrar interação de pintura
            recordAdvancedInteraction({
              type: 'painting_interaction',
              subtype: 'area_coloring_action',
              context: { 
                areaId: area,
                colorUsed: selectedColor.name,
                colorHex: selectedColor.hex,
                templateArea: selectedTemplate.name,
                motorSkills: 'precise_clicking_coordination',
                creativeProcess: 'artistic_expression',
                visualProcessing: 'spatial_color_application'
              }
            });
            
            const newColoredAreas = { ...coloredAreas };
            newColoredAreas[area] = selectedColor.hex;
            setColoredAreas(newColoredAreas);
            
            // Aplicar cor imediatamente
            e.target.style.fill = selectedColor.hex;
            playClick();
            announceToScreenReader(`Área pintada com ${selectedColor.name}`);
          }
        }}
        style={{ cursor: 'pointer' }}
      />
    );
  };
  // Tela de seleção de dificuldade
  if (!gameStarted) {
    return (
      <MainContainer $highContrast={highContrast}>
        <SimplifiedHeader>
          <BackButton onClick={async () => {
            await stopAdvancedSession();
            onBack();
          }}>
            ← Voltar
          </BackButton>
          <ActivityMainTitle>🎨 Pintura Criativa</ActivityMainTitle>
        </SimplifiedHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        >
          <InstructionText
            onClick={() => speakInstruction("Vamos pintar! Escolha como você quer começar!")}
          >
            🎨 Vamos pintar! Escolha como você quer começar!
          </InstructionText>

          <DifficultySelector>
            {difficulties.map((diff) => (
              <DifficultyButton
                key={diff.id}
                isActive={difficulty === diff.id}
                onClick={() => {
                  setDifficulty(diff.id);
                  playClick();
                  speak(`Dificuldade ${diff.name} escolhida!`);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                themeColor={THEME_COLOR}
              >
                <div style={{ fontSize: '3rem' }}>{diff.icon}</div>
                <div><strong>{diff.name}</strong></div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{diff.description}</div>
              </DifficultyButton>
            ))}
          </DifficultySelector>

          <ActionButton
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            themeColor={THEME_COLOR}
            style={{ fontSize: '1.5rem', padding: '1.5rem' }}
          >
            🖌️ Começar a Pintar!
          </ActionButton>
        </motion.div>
      </MainContainer>
    );
  }
  return (
    <MainContainer $highContrast={highContrast}>
      <SimplifiedHeader>
        <BackButton onClick={async () => {
          await stopAdvancedSession();
          onBack();
        }}>
          ← Voltar
        </BackButton>
        <ActivityMainTitle>🎨 Pintura Criativa</ActivityMainTitle>
      </SimplifiedHeader>

      {/* Seleção de Template (se ainda não selecionou) */}
      {!selectedTemplate && (
        <TemplateSelector>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            🖼️ O que você quer pintar?
          </h2>
          <TemplateGrid>
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                onClick={() => selectTemplate(template)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
                  {template.emoji}
                </div>
                <h3 style={{ fontSize: '1.2rem' }}>{template.name}</h3>
              </TemplateCard>
            ))}
          </TemplateGrid>
        </TemplateSelector>
      )}

      {/* Interface de pintura */}
      {selectedTemplate && (
        <>
          {/* Paleta de cores */}
          <ColorPalette>
            <h3 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.5rem' }}>
              🎨 Escolha sua cor:
            </h3>
            <ColorGrid>
              {simpleColors.map((color) => (
                <ColorButton
                  key={color.hex}
                  color={color.hex}
                  selected={selectedColor?.hex === color.hex}
                  onClick={() => selectColor(color)}
                  title={color.name}
                >
                  <span>{color.emoji}</span>
                  <span style={{ fontSize: '0.8rem' }}>{color.name}</span>
                </ColorButton>
              ))}
            </ColorGrid>
          </ColorPalette>

          {/* Canvas de desenho */}
          <DrawingCanvas>
            {renderInteractiveSVG()}
          </DrawingCanvas>

          {/* Botões de ação */}
          <ActionBar>
            <SimpleButton onClick={clearDrawing}>
              🧽 Limpar
            </SimpleButton>
            <SimpleButton onClick={() => setSelectedTemplate(null)}>
              🔄 Trocar Desenho
            </SimpleButton>
            <SimpleButton onClick={saveArt}>
              💾 Salvar Arte
            </SimpleButton>
          </ActionBar>
        </>
      )}
    </MainContainer>
  );
};

export default CreativePaintingSimple;
