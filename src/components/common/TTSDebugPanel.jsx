import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getTTSStatus, enableDebug, logTTSEvent } from '../../utils/tts/ttsDebug'
import { isTTSEnabled, setTTSEnabled } from '../../utils/tts/ttsManager'

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: monospace;
  line-height: 1.5;
`

const Title = styled.h2`
  color: var(--primary-blue);
  margin-bottom: 20px;
`

const StatusPanel = styled.div`
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
  overflow: auto;
  max-height: 300px;
`

const Button = styled.button`
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    background: var(--primary-purple);
  }

  &.secondary {
    background: var(--medium-gray);

    &:hover {
      background: var(--dark-gray);
    }
  }
`

const TTSDebugPanel = () => {
  const [status, setStatus] = useState({})
  const [isDebugging, setIsDebugging] = useState(false)
  const [refreshCounter, setRefreshCounter] = useState(0)

  useEffect(() => {
    const checkStatus = () => {
      setStatus(getTTSStatus())
    }

    checkStatus()

    // Atualizar status periodicamente se o modo debug estiver ativado
    if (isDebugging) {
      const interval = setInterval(checkStatus, 2000)
      return () => clearInterval(interval)
    }
  }, [isDebugging, refreshCounter])

  const toggleDebug = () => {
    const newState = !isDebugging
    setIsDebugging(newState)
    enableDebug(newState)
    setRefreshCounter((prev) => prev + 1)
  }
  const toggleTTS = () => {
    const currentState = isTTSEnabled()
    const newState = !currentState
    console.log(`TTSDebugPanel - Alterando TTS para: ${newState}`)

    // Atualizar a configuração no TTS Manager
    setTTSEnabled(newState)

    // Verificar após um momento para garantir que a configuração foi atualizada
    setTimeout(() => {
      const updatedState = isTTSEnabled()
      console.log(`TTSDebugPanel - Estado do TTS após toggle: ${updatedState}`)

      // Se o estado não mudou conforme esperado, forçar novamente
      if (updatedState !== newState) {
        console.log(`TTSDebugPanel - Estado não foi atualizado corretamente, tentando novamente`)
        setTTSEnabled(newState)
      }

      // Atualizar a UI
      setRefreshCounter((prev) => prev + 1)
    }, 100)

    // Registrar evento para fins de debug
    logTTSEvent({
      type: 'manual_toggle',
      source: 'debug_panel',
      from: currentState,
      to: newState,
      timestamp: new Date().toISOString(),
    })
  }

  const triggerSettingsEvent = () => {
    window.dispatchEvent(new Event('tts-settings-changed'))
    setRefreshCounter((prev) => prev + 1)
  }

  const refresh = () => {
    setRefreshCounter((prev) => prev + 1)
  }

  return (
    <Container>
      <Title>TTS Debug Panel</Title>

      <div>
        <Button onClick={toggleDebug}>{isDebugging ? 'Desativar Debug' : 'Ativar Debug'}</Button>

        <Button onClick={toggleTTS}>{status.ttsSetting ? 'Desativar TTS' : 'Ativar TTS'}</Button>

        <Button onClick={triggerSettingsEvent} className="secondary">
          Simular Evento de Configuração
        </Button>

        <Button onClick={refresh} className="secondary">
          Atualizar Status
        </Button>
      </div>

      <StatusPanel>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </StatusPanel>
    </Container>
  )
}

export default TTSDebugPanel
