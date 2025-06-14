import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { generateProgressReport, generateSuggestions } from '../../utils/analytics/progressReports'

const ProgressContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin: var(--space-lg) 0;
  box-shadow: var(--shadow-medium);
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-blue);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
`

const ProgressCard = styled.div`
  background: white;
  border-radius: var(--radius-medium);
  padding: var(--space-lg);
  box-shadow: var(--shadow-light);
  border-left: 4px solid ${(props) => props.color || 'var(--primary-blue)'};
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`

const CardTitle = styled.h3`
  font-size: var(--font-size-lg);
  color: ${(props) => props.color || 'var(--primary-blue)'};
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
`

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed var(--light-gray);
  padding-bottom: var(--space-xs);
  margin-bottom: var(--space-xs);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`

const StatLabel = styled.span`
  color: var(--dark-gray);
  font-weight: 500;
`

const StatValue = styled.span`
  color: var(--primary-blue);
  font-weight: 600;
`

const SuggestionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 0 var(--space-xl);
`

const SuggestionItem = styled.li`
  background: ${(props) => {
    switch (props.type) {
      case 'new-game':
        return 'var(--primary-blue-light)'
      case 'practice-needed':
        return 'var(--primary-orange-light)'
      case 'improving':
        return 'var(--success-light)'
      case 'focus-area':
        return 'var(--primary-purple-light)'
      default:
        return 'var(--light-gray)'
    }
  }};
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  border-radius: var(--radius-medium);
  border-left: 4px solid
    ${(props) => {
      switch (props.type) {
        case 'new-game':
          return 'var(--primary-blue)'
        case 'practice-needed':
          return 'var(--primary-orange)'
        case 'improving':
          return 'var(--primary-green)'
        case 'focus-area':
          return 'var(--primary-purple)'
        default:
          return 'var(--medium-gray)'
      }
    }};
  display: flex;
  align-items: center;
  gap: var(--space-md);
  box-shadow: var(--shadow-light);
`

const SuggestionIcon = styled.div`
  font-size: 1.5rem;
`

const SuggestionText = styled.p`
  margin: 0;
  color: var(--dark-gray);
  font-weight: 500;
  flex: 1;
`

const NoDataMessage = styled.div`
  text-align: center;
  padding: var(--space-xl);
  background: var(--light-gray);
  border-radius: var(--radius-large);
  color: var(--medium-gray);
  font-size: var(--font-size-lg);
  margin: var(--space-xl) 0;
`

const BackButton = styled(motion.button)`
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  align-self: flex-start;
  margin-bottom: var(--space-lg);

  &:hover {
    background: var(--primary-purple);
  }
`

const ExportButton = styled(motion.button)`
  background: var(--primary-green);
  color: white;
  border: none;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);

  &:hover {
    background: var(--success);
  }
`

// Mapeamento de ícones para jogos
const gameIcons = {
  'memory-game': '🧠',
  'color-match': '🌈',
  'image-association': '🖼️',
  'letter-recognition': '📚',
  'number-counting': '🔢',
  'musical-sequence': '🎵',
}

// Mapeamento de cores para jogos
const gameColors = {
  'memory-game': 'var(--primary-blue)',
  'color-match': 'var(--primary-green)',
  'image-association': 'var(--primary-orange)',
  'letter-recognition': 'var(--primary-pink)',
  'number-counting': 'var(--primary-cyan)',
  'musical-sequence': 'var(--primary-purple)',
}

// Ícones para sugestões
const suggestionIcons = {
  'new-game': '🆕',
  'practice-needed': '🔍',
  improving: '📈',
  'focus-area': '🎯',
  general: '💡',
}

function ProgressReport({ onBack }) {
  const [report, setReport] = useState(null)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    // Gerar relatório de progresso
    const progressReport = generateProgressReport()
    setReport(progressReport)

    // Gerar sugestões
    const progressSuggestions = generateSuggestions(progressReport)
    setSuggestions(progressSuggestions)
  }, [])
  // Manipular exportação de dados
  const handleExport = () => {
    try {
      // Importando do local correto em shared/
      const { exportProgressData } = require('../../utils/analytics/progressReports')
      const jsonData = exportProgressData()

      if (!jsonData) {
        alert('Não foi possível exportar os dados')
        return
      }

      // Criar blob e link para download
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `progresso-betina-${new Date().toISOString().slice(0, 10)}.json`
      a.click()

      // Limpar URL
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      alert('Ocorreu um erro ao exportar os dados')
    }
  }

  // Verificar se há dados suficientes
  const hasData = report && report.overallProgress.totalSessions > 0

  // Formatar tendência
  const formatTrend = (trend) => {
    if (trend === null || trend === undefined) return '—'
    if (trend > 0.05) return '📈 Melhorando'
    if (trend < -0.05) return '📉 Precisa de atenção'
    return '📊 Estável'
  }

  return (
    <ProgressContainer>
      <BackButton onClick={onBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        ⬅️ Voltar
      </BackButton>

      <SectionTitle>
        <span>📊</span>
        Relatório de Progresso
      </SectionTitle>

      {!hasData ? (
        <NoDataMessage>
          Ainda não há dados de progresso suficientes.
          <br />
          Continue jogando para gerar um relatório completo!
        </NoDataMessage>
      ) : (
        <>
          <ProgressCard color="var(--primary-purple)">
            <CardTitle color="var(--primary-purple)">📈 Progresso Geral</CardTitle>
            <StatRow>
              <StatLabel>Total de Sessões</StatLabel>
              <StatValue>{report.overallProgress.totalSessions}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Acurácia Média</StatLabel>
              <StatValue>{Math.round(report.overallProgress.averageAccuracy)}%</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Tendência de Aprendizado</StatLabel>
              <StatValue>{formatTrend(report.overallProgress.learningTrend)}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Jogo Mais Jogado</StatLabel>
              <StatValue>
                {report.overallProgress.mostPlayed
                  ? `${gameIcons[report.overallProgress.mostPlayed]} ${getGameName(report.overallProgress.mostPlayed)}`
                  : '—'}
              </StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Último Jogo</StatLabel>
              <StatValue>{report.overallProgress.lastPlayed || '—'}</StatValue>
            </StatRow>
          </ProgressCard>

          <SectionTitle>
            <span>💡</span>
            Sugestões Personalizadas
          </SectionTitle>

          {suggestions.length > 0 ? (
            <SuggestionsList>
              {suggestions.map((suggestion, index) => (
                <SuggestionItem key={index} type={suggestion.type}>
                  <SuggestionIcon>{suggestionIcons[suggestion.type]}</SuggestionIcon>
                  <SuggestionText>{suggestion.message}</SuggestionText>
                </SuggestionItem>
              ))}
            </SuggestionsList>
          ) : (
            <NoDataMessage>Continue jogando para receber sugestões personalizadas.</NoDataMessage>
          )}

          <SectionTitle>
            <span>🎮</span>
            Progresso por Jogo
          </SectionTitle>

          <ProgressGrid>
            {Object.entries(report.gameReports).map(([gameId, gameReport]) => (
              <ProgressCard key={gameId} color={gameColors[gameId]}>
                <CardTitle color={gameColors[gameId]}>
                  <span>{gameIcons[gameId]}</span>
                  {getGameName(gameId)}
                </CardTitle>

                <StatRow>
                  <StatLabel>Sessões</StatLabel>
                  <StatValue>{gameReport.sessions}</StatValue>
                </StatRow>

                <StatRow>
                  <StatLabel>Acurácia</StatLabel>
                  <StatValue>
                    {gameReport.accuracy ? `${Math.round(gameReport.accuracy)}%` : '—'}
                  </StatValue>
                </StatRow>

                <StatRow>
                  <StatLabel>Tendência</StatLabel>
                  <StatValue>{formatTrend(gameReport.trend)}</StatValue>
                </StatRow>

                <StatRow>
                  <StatLabel>Dificuldade Atual</StatLabel>
                  <StatValue>{formatDifficulty(gameReport.currentDifficulty)}</StatValue>
                </StatRow>
              </ProgressCard>
            ))}
          </ProgressGrid>

          <ExportButton
            onClick={handleExport}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💾 Exportar Relatório de Progresso
          </ExportButton>
        </>
      )}
    </ProgressContainer>
  )
}

// Utilitário para obter o nome amigável do jogo
function getGameName(gameId) {
  const names = {
    'memory-game': 'Jogo da Memória',
    'color-match': 'Combinar Cores',
    'image-association': 'Associação de Imagens',
    'letter-recognition': 'Reconhecimento de Letras',
    'number-counting': 'Números e Contagem',
    'musical-sequence': 'Sequência Musical',
  }
  return names[gameId] || gameId
}

// Formatar nome da dificuldade
function formatDifficulty(difficulty) {
  const names = {
    EASY: 'Fácil',
    MEDIUM: 'Médio',
    HARD: 'Difícil',
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
  }
  return names[difficulty] || difficulty
}

export default ProgressReport
