import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from '../../hooks/useSound';
import useProgress from '../../hooks/useProgress';
import useTTS from '../../hooks/useTTS';
import useUser from '../../hooks/useUser';
import useCanvas from '../../hooks/useCanvas';
import {
  announceToScreenReader,
  prefersHighContrast,
  prefersReducedMotion,
} from '../../utils/accessibility';
import { createAdaptiveModel } from '../../utils/adaptiveML';
import { drawTemplate } from '../../utils/drawTemplate';
import {
  DIFFICULTY_SETTINGS,
  COLOR_PALETTE,
} from './constants';
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

// Definição de cores temáticas para Pintura Criativa
const THEME_COLOR = 'var(--primary-pink)';
const THEME_GRADIENT = 'linear-gradient(135deg, var(--primary-pink), var(--primary-orange))';
const SPACING = 'var(--space-md)';

import ModeSelector from './ModeSelector';
import ToolsPanel from './ToolsPanel';
import CanvasArea from './CanvasArea';
import ColorPalette from './ColorPalette';
import FeedbackMessage from './FeedbackMessage';

const MainContainer = styled.div`
  min-height: 100vh;
  background: ${({ $highContrast }) =>
    $highContrast ? '#000' : THEME_GRADIENT};
  color: ${({ $highContrast }) => ($highContrast ? '#fff' : THEME_COLOR)};
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  gap: var(--space-md);

  @media (max-width: 768px) {
    padding: var(--space-md);
    gap: var(--space-sm);
  }
`;

const PaintWorkspace = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto 1fr auto;
  gap: var(--space-lg);
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 250px;
    gap: var(--space-md);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
    gap: var(--space-sm);
  }
`;

const CanvasSection = styled.div`
  grid-column: 1;
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 3;
    padding: var(--space-lg);
  }
`;

const SidePanel = styled.div`
  grid-column: 2;
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 2;
  }
`;

const ColorSection = styled.div`
  grid-column: 1 / -1;
  grid-row: 3;

  @media (max-width: 768px) {
    grid-row: 4;
  }
`;

const CreativePainting = ({ onBack }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('EASY');
  const [mode, setMode] = useState('free');
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState('nature');
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const { playClick, playSuccess } = useSound();
  const { recordSuccess } = useProgress('creative-painting');
  const { userId } = useUser();

  // TTS Hook para conversão de texto em áudio
  const {
    speak,
    speakInstruction,
    speakFeedback,
    speakQuestion,
    autoSpeak,
    stop
  } = useTTS();
  const highContrast = prefersHighContrast();
  const reducedMotion = prefersReducedMotion();

  const { 
    canvasRef, 
    contextRef, 
    isDrawing,
    currentTool,
    currentColor,
    currentBrushSize,
    colorsUsed,
    drawingData,
    strokeCount,
    setCurrentTool,
    setCurrentColor,
    setCurrentBrushSize,
    startDrawing, 
    draw, 
    stopDrawing, 
    clearCanvas: clearCanvasHook, 
    exportCanvas 
  } = useCanvas({
    gameStarted,
  });

  const adaptiveModel = useRef(null);

  useEffect(() => {
    if (userId) {
      adaptiveModel.current = createAdaptiveModel('creative-painting', userId);
    }
  }, [userId]);
  const clearCanvas = useCallback(() => {
    // Usar a função do hook
    clearCanvasHook();

    // Adicionar lógica específica do componente
    if (selectedTemplate && mode === 'guided') {
      setTimeout(() => {
        if (contextRef.current && canvasRef.current) {
          drawTemplate(contextRef.current, selectedTemplate, canvasRef.current);
        }
      }, 50);
    }

    playClick();
    announceToScreenReader('Canvas limpo');
  }, [clearCanvasHook, playClick, selectedTemplate, mode, contextRef, canvasRef]);
  const exportCanvasFile = useCallback(() => {
    const dataURL = exportCanvas();
    if (!dataURL) return;

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `arte-criativa-${Date.now()}.png`;
    link.click();
    playClick();
    announceToScreenReader('Arte exportada como imagem');
  }, [exportCanvas, playClick]);

  const handleModeChange = useCallback(
    (newMode) => {
      setMode(newMode);
      setCurrentChallenge(null);
      setSelectedTemplate(null);
      clearCanvas();
      playClick();
    },
    [clearCanvas, playClick]
  );
  const selectChallenge = useCallback(
    (challenge) => {
      if (!challenge || !challenge.title) {
        setFeedback({ type: 'error', message: 'Desafio inválido selecionado' });
        return;
      }
      setCurrentChallenge(challenge);
      setMode('challenge');
      clearCanvas();
      playClick();
      announceToScreenReader(`Desafio selecionado: ${challenge.title}`);
    },
    [clearCanvas, playClick]
  );

  const selectTemplate = useCallback(
    (template) => {
      if (!template || !template.name || !template.type) {
        setFeedback({ type: 'error', message: 'Template inválido selecionado' });
        return;
      }
      setSelectedTemplate(template);
      setMode('guided');
      playClick();
      announceToScreenReader(`Template selecionado: ${template.name}`);
    },
    [playClick]
  );

  const palette = useMemo(
    () =>
      difficulty === 'EASY'
        ? { primary: COLOR_PALETTE.primary }
        : difficulty === 'MEDIUM'
        ? { primary: COLOR_PALETTE.primary, secondary: COLOR_PALETTE.secondary }
        : COLOR_PALETTE,
    [difficulty]
  );

  if (!gameStarted) {
    return (
      <MainContainer $highContrast={highContrast}>
        <GameHeader>
          <BackButton onClick={onBack} aria-label="Voltar ao menu">
            ← Voltar
          </BackButton>
        </GameHeader>
        <ActivityTitleSection>
          <ActivityMainTitle>
            <span>🎨</span>
            <span>Pintura Criativa</span>
          </ActivityMainTitle>
          <ActivitySubtitle>Estúdio de Arte Digital</ActivitySubtitle>
        </ActivityTitleSection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.5 }}
        >
          <InstructionText
            onClick={() => speakInstruction("Crie arte digital com pincéis, cores e ferramentas! Escolha a dificuldade para começar.")}
          >
            🎨 Crie arte digital com pincéis, cores e ferramentas! Escolha a dificuldade para começar.
          </InstructionText>
          <DifficultySelector>
            {[
              {
                id: 'EASY',
                name: '🟢 Fácil',
                description: '2 cores básicas',
                icon: '😊'
              },
              {
                id: 'MEDIUM',
                name: '🟡 Médio',
                description: '3 paletas de cores',
                icon: '😐'
              },
              {
                id: 'HARD',
                name: '🔴 Difícil',
                description: '4 ferramentas avançadas',
                icon: '🧠'
              }
            ].map((diff) => (
              <DifficultyButton
                key={diff.id}
                isActive={difficulty === diff.id}
                onClick={() => {
                  setDifficulty(diff.id);
                  playClick();
                  // TTS: Anunciar dificuldade selecionada
                  speak(`Dificuldade ${diff.name} selecionada. ${diff.description}`);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                themeColor={THEME_COLOR}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{diff.icon}</div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{diff.name}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{diff.description}</div>
              </DifficultyButton>
            ))}
          </DifficultySelector>
          <ActionButton
            onClick={() => {
              setGameStarted(true);
              setSessionStartTime(Date.now());
              playClick();
              // TTS: Anunciar início da pintura
              autoSpeak("Começando estúdio de pintura criativa! Use as ferramentas para criar sua arte.", 1000);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            themeColor={THEME_COLOR}
          >
            🎨 Começar a Pintar
          </ActionButton>
        </motion.div>
      </MainContainer>
    );
  }

  return (
    <MainContainer $highContrast={highContrast}>
      <GameHeader>
        <BackButton onClick={onBack} aria-label="Voltar ao menu">
          ← Voltar
        </BackButton>
      </GameHeader>

      <ActivityTitleSection>
        <ActivityMainTitle>
          <span>🎨</span>
          <span>Pintura Criativa</span>
        </ActivityMainTitle>
        <ActivitySubtitle>
          Modo: {DIFFICULTY_SETTINGS.find((d) => d.id === difficulty)?.name} •{' '}
          {selectedTemplate?.name || currentChallenge?.title || 'Livre'}
        </ActivitySubtitle>
      </ActivityTitleSection>

      <AnimatePresence>
        {feedback && (
          <FeedbackMessage
            feedback={feedback}
            reducedMotion={reducedMotion}
            onClose={() => setFeedback(null)}
          />
        )}
      </AnimatePresence>

      <ModeSelector
        mode={mode}
        difficulty={difficulty}
        onModeChange={handleModeChange}
        playClick={playClick}
      />

      <PaintWorkspace>
        <CanvasSection>          <CanvasArea
            canvasRef={canvasRef}
            currentChallenge={currentChallenge}
            selectedTemplate={selectedTemplate}
            strokeCount={strokeCount}
            colorsUsed={colorsUsed}
            startDrawing={startDrawing}
            draw={draw}
            stopDrawing={stopDrawing}
            clearCanvas={clearCanvas}
            exportCanvas={exportCanvasFile}
            showMetrics={showMetrics}
            setShowMetrics={setShowMetrics}
            difficulty={difficulty}
            playClick={playClick}
          />
        </CanvasSection>        <SidePanel>
          <ToolsPanel
            mode={mode}
            difficulty={difficulty}
            brushSize={currentBrushSize}
            setBrushSize={setCurrentBrushSize}
            selectedColor={currentColor}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectTemplate={selectTemplate}
            selectChallenge={selectChallenge}
            playClick={playClick}
          />
        </SidePanel>        <ColorSection>
          <ColorPalette
            palette={palette}
            selectedColor={currentColor}
            setSelectedColor={setCurrentColor}
            difficulty={difficulty}
            showMetrics={showMetrics}
            sessionStartTime={sessionStartTime}
            colorsUsed={colorsUsed}
            strokeCount={strokeCount}
            brushSize={currentBrushSize}
            playClick={playClick}
          />
        </ColorSection>
      </PaintWorkspace>
    </MainContainer>
  );
};

export default CreativePainting;