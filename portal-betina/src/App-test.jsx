import React from 'react';
import CanvasTest from './components/test/CanvasTest';

const App = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      padding: '20px'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: 'white', 
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        marginBottom: '30px'
      }}>
        🧪 Teste do Hook useCanvas - Portal Betina
      </h1>
      <CanvasTest />
    </div>
  );
};

export default App;
