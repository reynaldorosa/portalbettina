import React from 'react'
import styled from 'styled-components'

const DebugPanel = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(255, 0, 0, 0.9);
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
  font-family: monospace;
  font-size: 12px;
  max-width: 300px;
`

const DebugItem = styled.div`
  margin: 2px 0;
  padding: 2px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
`

function VisibilityDebug({ currentActivity, isDbConnected, loading, user }) {
  return (
    <DebugPanel>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🐛 DEBUG INFO</div>
      <DebugItem>Activity: {currentActivity || 'undefined'}</DebugItem>
      <DebugItem>DB Connected: {isDbConnected ? '✅' : '❌'}</DebugItem>
      <DebugItem>Loading: {loading ? '⏳' : '✅'}</DebugItem>
      <DebugItem>User ID: {user?.id ? `✅ ${user.id.slice(0, 8)}...` : '❌'}</DebugItem>
      <DebugItem>Timestamp: {new Date().toLocaleTimeString()}</DebugItem>
    </DebugPanel>
  )
}

export default VisibilityDebug
