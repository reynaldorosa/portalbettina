import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ActionButton } from '../../styles/activityCommon';

const CanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  flex: 1;
`;

const CanvasWrapper = styled.div`
  position: relative;
  background: var(--white, #ffffff);
  border-radius: var(--radius-medium);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  aspect-ratio: 4/3;
  min-height: 400px;
  
  @media (max-width: 768px) {
    min-height: 300px;
    aspect-ratio: 3/2;
  }
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  cursor: crosshair;
  display: block;
  touch-action: none;
  background-color: var(--white, #ffffff);
  
  &:hover {
    cursor: crosshair;
  }
`;

const CanvasControls = styled.div`
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MetricsDisplay = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(240, 240, 250, 0.9));
  border-radius: var(--radius-medium);
  padding: var(--space-md);
  box-shadow: var(--shadow-light);
  display: flex;
  gap: var(--space-lg);
  justify-content: center;
  flex-wrap: wrap;
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  
  @media (max-width: 768px) {
    gap: var(--space-md);
  }
`;

const MetricItem = styled.div`
  text-align: center;
  
  .metric-value {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--primary-purple);
    display: block;
  }
  
  .metric-label {
    font-size: var(--font-size-sm);
    color: var(--medium-gray);
    margin-top: var(--space-xs);
  }
`;

const ChallengeInfo = styled(motion.div)`
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple));
  color: white;
  padding: var(--space-md);
  border-radius: var(--radius-medium);
  text-align: center;
  margin-bottom: var(--space-md);
  
  .challenge-title {
    font-size: var(--font-size-lg);
    font-weight: 700;
    margin-bottom: var(--space-xs);
  }
  
  .challenge-description {
    font-size: var(--font-size-sm);
    opacity: 0.9;
  }
`;

const TemplateOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.3;
  background-image: ${props => props.templateImage ? `url(${props.templateImage})` : 'none'};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const CanvasArea = ({
  canvasRef,
  currentChallenge,
  selectedTemplate,
  strokeCount,
  colorsUsed,
  startDrawing,
  draw,
  stopDrawing,
  clearCanvas,
  exportCanvas,
  showMetrics,
  setShowMetrics,
  difficulty,
  playClick
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Redraw template if exists
      if (selectedTemplate) {
        // Template drawing logic would go here
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [canvasRef, selectedTemplate]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    draw(x, y);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    startDrawing(x, y);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    draw(x, y);
  };

  return (
    <CanvasContainer>
      {currentChallenge && (
        <ChallengeInfo
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="challenge-title">{currentChallenge.title}</div>
          <div className="challenge-description">{currentChallenge.description}</div>
        </ChallengeInfo>
      )}

      <CanvasWrapper ref={containerRef}>
        {selectedTemplate && (
          <TemplateOverlay templateImage={selectedTemplate.image} />
        )}
        <Canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={stopDrawing}
        />
      </CanvasWrapper>

      <CanvasControls>
        <ActionButton
          onClick={clearCanvas}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🗑️ Limpar
        </ActionButton>
        
        <ActionButton
          onClick={exportCanvas}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          💾 Salvar
        </ActionButton>
        
        <ActionButton
          onClick={() => {
            setShowMetrics(!showMetrics);
            playClick();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📊 {showMetrics ? 'Ocultar' : 'Mostrar'} Métricas
        </ActionButton>
      </CanvasControls>

      {showMetrics && (
        <MetricsDisplay
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MetricItem>
            <span className="metric-value">{strokeCount}</span>
            <div className="metric-label">Traços</div>
          </MetricItem>
          
          <MetricItem>
            <span className="metric-value">{colorsUsed.size}</span>
            <div className="metric-label">Cores Usadas</div>
          </MetricItem>
          
          <MetricItem>
            <span className="metric-value">{difficulty}</span>
            <div className="metric-label">Nível</div>
          </MetricItem>
        </MetricsDisplay>
      )}
    </CanvasContainer>
  );
};

export default CanvasArea;
