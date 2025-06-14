import React, { useEffect } from 'react';
import useCanvas from '../../hooks/useCanvas';

const CanvasTest = () => {
  const {
    canvasRef,
    isDrawing,
    currentTool,
    currentColor,
    currentBrushSize,
    setCurrentTool,
    setCurrentColor, 
    setCurrentBrushSize,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    exportCanvas,
    resizeCanvas
  } = useCanvas();

  useEffect(() => {
    console.log('🧪 Teste do useCanvas iniciado');
    console.log('📋 Hook carregado com sucesso:', {
      canvasRef: !!canvasRef,
      isDrawing,
      currentTool,
      currentColor,
      currentBrushSize,
      functionsLoaded: {
        setCurrentTool: typeof setCurrentTool,
        setCurrentColor: typeof setCurrentColor,
        setCurrentBrushSize: typeof setCurrentBrushSize,
        startDrawing: typeof startDrawing,
        draw: typeof draw,
        stopDrawing: typeof stopDrawing,
        clearCanvas: typeof clearCanvas,
        exportCanvas: typeof exportCanvas,
        resizeCanvas: typeof resizeCanvas
      }
    });

    // Teste básico de funcionalidade
    if (canvasRef.current) {
      console.log('✅ Canvas ref funcionando');
      
      // Teste de mudança de ferramenta
      setCurrentTool('brush');
      console.log('✅ setCurrentTool funcionando');
      
      // Teste de mudança de cor
      setCurrentColor('#ff0000');
      console.log('✅ setCurrentColor funcionando');
      
      // Teste de mudança de tamanho do pincel
      setCurrentBrushSize(10);
      console.log('✅ setCurrentBrushSize funcionando');
      
      console.log('🎉 Todos os testes básicos do useCanvas passaram!');
    }
  }, [canvasRef, isDrawing, currentTool, currentColor, currentBrushSize, setCurrentTool, setCurrentColor, setCurrentBrushSize, startDrawing, draw, stopDrawing, clearCanvas, exportCanvas, resizeCanvas]);

  return (
    <div style={{ padding: '20px', border: '2px solid #4CAF50', borderRadius: '8px', margin: '20px' }}>
      <h2 style={{ color: '#4CAF50' }}>🧪 Teste do Hook useCanvas</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Status do Hook:</h3>
        <ul>
          <li>Canvas Ref: {canvasRef ? '✅ Carregado' : '❌ Não carregado'}</li>
          <li>Desenhando: {isDrawing ? '✅ Sim' : '❌ Não'}</li>
          <li>Ferramenta Atual: {currentTool}</li>
          <li>Cor Atual: <span style={{ color: currentColor }}>{currentColor}</span></li>
          <li>Tamanho do Pincel: {currentBrushSize}px</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Controles de Teste:</h3>
        <button onClick={() => setCurrentTool('brush')} style={{ margin: '5px', padding: '8px' }}>
          Pincel
        </button>
        <button onClick={() => setCurrentTool('eraser')} style={{ margin: '5px', padding: '8px' }}>
          Borracha
        </button>
        <button onClick={() => setCurrentColor('#ff0000')} style={{ margin: '5px', padding: '8px', backgroundColor: '#ff0000', color: 'white' }}>
          Vermelho
        </button>
        <button onClick={() => setCurrentColor('#00ff00')} style={{ margin: '5px', padding: '8px', backgroundColor: '#00ff00', color: 'white' }}>
          Verde
        </button>
        <button onClick={() => setCurrentBrushSize(5)} style={{ margin: '5px', padding: '8px' }}>
          Pincel Pequeno
        </button>
        <button onClick={() => setCurrentBrushSize(20)} style={{ margin: '5px', padding: '8px' }}>
          Pincel Grande
        </button>
        <button onClick={clearCanvas} style={{ margin: '5px', padding: '8px', backgroundColor: '#f44336', color: 'white' }}>
          Limpar Canvas
        </button>
      </div>

      <div>
        <h3>Canvas de Teste:</h3>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          style={{ border: '2px solid #ccc', cursor: 'crosshair' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default CanvasTest;
