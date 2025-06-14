/**
 * HOOK CANVAS - PLATAFORMA BETINA
 * Gerencia operações de desenho e canvas para atividades criativas
 * 
 * @version 1.0.0
 * @created 2025-06-06
 * @purpose Centralizar lógica de canvas para reutilização
 */

import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * Hook para gerenciar canvas de desenho
 * @param {object} options - Opções de configuração
 */
export const useCanvas = (options = {}) => {
  const {
    gameStarted = false,
  } = options;

  // Estados do canvas
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState('brush');
  const [currentColor, setCurrentColor] = useState('#FF6B6B');
  const [currentBrushSize, setCurrentBrushSize] = useState(10);
  const [colorsUsed, setColorsUsed] = useState(new Set());
  const [drawingData, setDrawingData] = useState([]);
  const [strokeCount, setStrokeCount] = useState(0);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  // Inicializar contexto do canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Configurações do contexto
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.globalCompositeOperation = 'source-over';
    
    // Preencher fundo branco
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    contextRef.current = context;
  }, [gameStarted]);
  // Atualizar propriedades do contexto quando mudarem
  useEffect(() => {
    if (!contextRef.current) return;
    
    contextRef.current.strokeStyle = currentColor;
    contextRef.current.lineWidth = currentBrushSize;
  }, [currentColor, currentBrushSize]);

  const startDrawing = useCallback((x, y) => {
    if (!contextRef.current || !canvasRef.current) return;

    isDrawingRef.current = true;
    lastPositionRef.current = { x, y };
    
    setIsDrawing(true);
    
    // Começar novo path
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
      // Adicionar cor usada
    setColorsUsed(prev => new Set([...prev, currentColor]));
    
    // Incrementar contador de traços
    setStrokeCount(prev => prev + 1);
  }, [currentColor, setIsDrawing, setColorsUsed, setStrokeCount]);

  const draw = useCallback((x, y) => {
    if (!isDrawingRef.current || !contextRef.current) return;

    const context = contextRef.current;
    
    // Desenhar linha suave
    context.lineTo(x, y);
    context.stroke();
    
    // Salvar dados do desenho para análise
    setDrawingData(prev => [
      ...prev,
      {
        x,
        y,        color: currentColor,
        brushSize: currentBrushSize,
        timestamp: Date.now(),
        type: 'draw'
      }
    ]);
    
    lastPositionRef.current = { x, y };
  }, [currentColor, currentBrushSize, setDrawingData]);

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current) return;
    
    isDrawingRef.current = false;
    setIsDrawing(false);
    
    if (contextRef.current) {
      contextRef.current.closePath();
    }
  }, [setIsDrawing]);

  const clearCanvas = useCallback(() => {
    if (!contextRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = contextRef.current;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Reset drawing state
    isDrawingRef.current = false;
    setIsDrawing(false);
  }, [setIsDrawing]);

  const exportCanvas = useCallback(() => {
    if (!canvasRef.current) return null;
    
    return canvasRef.current.toDataURL('image/png');
  }, []);

  const getCanvasData = useCallback(() => {
    if (!canvasRef.current) return null;
    
    return {
      dataURL: canvasRef.current.toDataURL('image/png'),
      width: canvasRef.current.width,
      height: canvasRef.current.height,
    };
  }, []);

  const loadImageToCanvas = useCallback((imageDataURL) => {
    if (!contextRef.current || !canvasRef.current || !imageDataURL) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      
      // Limpar canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Preencher fundo branco
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Desenhar imagem
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imageDataURL;
  }, []);

  const resizeCanvas = useCallback((width, height) => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
    
    canvas.width = width;
    canvas.height = height;
    
    // Reconfigurar contexto após resize
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';    context.strokeStyle = currentColor;
    context.lineWidth = currentBrushSize;
    
    // Preencher fundo branco
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    
    // Restaurar desenho anterior (escalado)
    context.putImageData(imageData, 0, 0);
    
    contextRef.current = context;
  }, [currentColor, currentBrushSize]);
  return {
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
    clearCanvas,
    exportCanvas,
    getCanvasData,
    loadImageToCanvas,
    resizeCanvas,
  };
};

export default useCanvas;
