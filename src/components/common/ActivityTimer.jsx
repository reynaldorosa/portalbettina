import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// ======== COMPONENTE DE TIMER EM TEMPO REAL ========

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
  font-family: 'Segoe UI', system-ui, sans-serif;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.1) 25%, 
      transparent 25%, 
      transparent 50%, 
      rgba(255, 255, 255, 0.1) 50%, 
      rgba(255, 255, 255, 0.1) 75%, 
      transparent 75%
    );
    background-size: 20px 20px;
    animation: ${props => props.$isActive ? 'moveStripes 1s linear infinite' : 'none'};
  }

  @keyframes moveStripes {
    0% { transform: translateX(0); }
    100% { transform: translateX(20px); }
  }
`;

const TimerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
  z-index: 1;
`;

const TimerLabel = styled.span`
  font-size: 0.7rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const TimerValue = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  z-index: 1;
`;

const StatusDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => {
    if (props.$isPaused) return '#ffd700';
    if (props.$isActive) return '#00ff88';
    return '#ff6b6b';
  }};
  animation: ${props => props.$isActive ? 'pulse 2s infinite' : 'none'};
  box-shadow: 0 0 10px ${props => {
    if (props.$isPaused) return 'rgba(255, 215, 0, 0.5)';
    if (props.$isActive) return 'rgba(0, 255, 136, 0.5)';
    return 'rgba(255, 107, 107, 0.5)';
  }};

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
  }
`;

const StatusText = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EfficiencyBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${props => {
    const eff = parseFloat(props.$efficiency);
    if (eff >= 90) return '#00ff88';
    if (eff >= 70) return '#ffd700';
    return '#ff6b6b';
  }};
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.6rem;
  font-weight: bold;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

// ======== COMPONENTE PRINCIPAL ========

const ActivityTimer = ({ 
  timeMetrics, 
  onStart, 
  onPause, 
  onResume, 
  onFinish,
  showControls = true,
  compact = false,
  invisible = false
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Atualizar o tempo a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  // Se for invisível, não renderiza nada visualmente, mas mantém as métricas
  if (invisible) {
    return null;
  }if (!timeMetrics) {
    return (
      <TimerContainer>
        <StatusIndicator>
          <StatusDot $isActive={false} $isPaused={false} />
          <StatusText>Cronômetro</StatusText>
        </StatusIndicator>
      </TimerContainer>
    );
  }

  const { isActive, isPaused, activeTime, totalTime, pausedTime, efficiency, sessionId } = timeMetrics;

  const getStatusText = () => {
    if (isPaused) return 'Pausado';
    if (isActive) return 'Ativo';
    return 'Finalizado';
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (compact) {
      if (hours > 0) return `${hours}h${minutes}m`;
      if (minutes > 0) return `${minutes}:${secs.toString().padStart(2, '0')}`;
      return `${secs}s`;
    }
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  return (
    <TimerContainer $isActive={isActive && !isPaused}>
      {efficiency && (
        <EfficiencyBadge $efficiency={efficiency}>
          {efficiency.toFixed(0)}%
        </EfficiencyBadge>
      )}
      
      <StatusIndicator>
        <StatusDot $isActive={isActive} $isPaused={isPaused} />
        <StatusText>{getStatusText()}</StatusText>
      </StatusIndicator>

      <TimerSection>
        <TimerLabel>Tempo Ativo</TimerLabel>
        <TimerValue>{formatTime(activeTime)}</TimerValue>
      </TimerSection>

      {!compact && (
        <>
          <TimerSection>
            <TimerLabel>Tempo Total</TimerLabel>
            <TimerValue>{formatTime(totalTime)}</TimerValue>
          </TimerSection>

          {pausedTime > 0 && (
            <TimerSection>
              <TimerLabel>Pausado</TimerLabel>
              <TimerValue>{formatTime(pausedTime)}</TimerValue>
            </TimerSection>
          )}
        </>
      )}      {showControls && (
        <ControlButtons>
          {/* Botão de iniciar removido */}
          
          {isActive && !isPaused && (
            <ControlButton onClick={onPause}>
              ⏸️ Pausar
            </ControlButton>
          )}
          
          {isActive && isPaused && (
            <ControlButton onClick={onResume}>
              ▶️ Continuar
            </ControlButton>
          )}
          
          {isActive && (
            <ControlButton onClick={onFinish}>
              ⏹️ Finalizar
            </ControlButton>
          )}
        </ControlButtons>
      )}
    </TimerContainer>
  );
};

export default ActivityTimer;