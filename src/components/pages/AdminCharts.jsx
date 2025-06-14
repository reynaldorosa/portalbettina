import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-lg);
  margin: var(--space-xl) 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`

const ChartCard = styled(motion.div)`
  background: white;
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-medium);
  border: 2px solid var(--light-gray);
`

const ChartTitle = styled.h3`
  font-size: var(--font-size-lg);
  color: var(--primary-blue);
  margin: 0 0 var(--space-lg) 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`

const ProgressBar = styled.div`
  background: var(--light-gray);
  border-radius: var(--radius-medium);
  height: 30px;
  margin: var(--space-sm) 0;
  overflow: hidden;
  position: relative;
`

const ProgressFill = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.color || 'var(--primary-blue)'}, ${props => props.colorSecondary || 'var(--primary-cyan)'});
  height: 100%;
  border-radius: var(--radius-medium);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 var(--space-sm);
  color: white;
  font-weight: 600;
  font-size: var(--font-size-sm);
`

const GameRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`

const GameEmoji = styled.div`
  font-size: 1.2rem;
  width: 30px;
  text-align: center;
`

const GameName = styled.div`
  flex: 1;
  font-weight: 500;
  color: var(--dark-gray);
`

const TimeChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`

const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm);
  background: var(--light-gray);
  border-radius: var(--radius-medium);
`

const TimeLabel = styled.div`
  font-weight: 500;
  color: var(--dark-gray);
`

const TimeValue = styled.div`
  font-weight: 600;
  color: var(--primary-blue);
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-top: var(--space-lg);
`

const StatItem = styled.div`
  text-align: center;
  padding: var(--space-md);
  background: var(--light-gray);
  border-radius: var(--radius-medium);
`

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-blue);
  margin-bottom: var(--space-xs);
`

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
`

function AdminCharts({ gameUsage = {}, stats = {} }) {
  const gameMapping = {
    'memory-game': { name: 'Jogo da Memória', icon: '🧠', color: 'var(--primary-blue)', colorSecondary: 'var(--primary-cyan)' },
    'color-match': { name: 'Combinar Cores', icon: '🌈', color: 'var(--primary-green)', colorSecondary: '#7ED321' },
    'image-association': { name: 'Associação de Imagens', icon: '🧩', color: 'var(--primary-orange)', colorSecondary: '#F5A623' },
    'musical-sequence': { name: 'Sequência Musical', icon: '🎵', color: 'var(--primary-purple)', colorSecondary: '#9013FE' },
    'letter-recognition': { name: 'Reconhecimento de Letras', icon: '📚', color: 'var(--primary-pink)', colorSecondary: '#E91E63' },
    'number-counting': { name: 'Números e Contagem', icon: '🔢', color: 'var(--primary-cyan)', colorSecondary: '#00BCD4' }
  };

  const getGamesData = () => {
    const games = Object.entries(gameUsage)
      .filter(([key, value]) => typeof value === 'number' && !key.includes('_lastPlayed'))
      .map(([gameId, count]) => {
        const gameInfo = gameMapping[gameId] || { name: gameId, icon: '🎮', color: 'var(--primary-blue)' };
        return {
          id: gameId,
          ...gameInfo,
          count,
          lastPlayed: gameUsage[`${gameId}_lastPlayed`]
        };
      })
      .sort((a, b) => b.count - a.count);

    return games;
  };

  const getTotalUsage = () => {
    return getGamesData().reduce((total, game) => total + game.count, 0);
  };

  const getUsageByTime = () => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const oneWeekMs = 7 * oneDayMs;
    const oneMonthMs = 30 * oneDayMs;

    const timeRanges = {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      older: 0
    };

    Object.entries(gameUsage).forEach(([key, value]) => {
      if (key.includes('_lastPlayed') && typeof value === 'number') {
        const gameId = key.replace('_lastPlayed', '');
        const gameCount = gameUsage[gameId] || 0;
        const timeDiff = now - value;

        if (timeDiff <= oneDayMs) {
          timeRanges.today += gameCount;
        } else if (timeDiff <= oneWeekMs) {
          timeRanges.thisWeek += gameCount;
        } else if (timeDiff <= oneMonthMs) {
          timeRanges.thisMonth += gameCount;
        } else {
          timeRanges.older += gameCount;
        }
      }
    });

    return timeRanges;
  };

  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  const gamesData = getGamesData();
  const totalUsage = getTotalUsage();
  const timeUsage = getUsageByTime();

  return (
    <ChartsContainer>
      {/* Gráfico de Ranking dos Jogos */}
      <ChartCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ChartTitle>📊 Ranking de Popularidade</ChartTitle>
        
        {gamesData.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--medium-gray)', padding: 'var(--space-lg)' }}>
            Nenhum dado de uso disponível
          </div>
        ) : (
          gamesData.map((game, index) => (
            <GameRow key={game.id}>
              <GameEmoji>{game.icon}</GameEmoji>
              <GameName>{game.name}</GameName>
              <div style={{ width: '60%' }}>
                <ProgressBar>
                  <ProgressFill
                    color={game.color}
                    colorSecondary={game.colorSecondary}
                    initial={{ width: 0 }}
                    animate={{ width: `${(game.count / Math.max(...gamesData.map(g => g.count))) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                  >
                    {game.count}
                  </ProgressFill>
                </ProgressBar>
              </div>
            </GameRow>
          ))
        )}
      </ChartCard>

      {/* Gráfico de Uso por Tempo */}
      <ChartCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ChartTitle>📅 Atividade por Período</ChartTitle>
        
        <TimeChart>
          <TimeRow>
            <TimeLabel>🔥 Hoje</TimeLabel>
            <TimeValue>{timeUsage.today} jogadas</TimeValue>
          </TimeRow>
          <TimeRow>
            <TimeLabel>📈 Esta Semana</TimeLabel>
            <TimeValue>{timeUsage.thisWeek} jogadas</TimeValue>
          </TimeRow>
          <TimeRow>
            <TimeLabel>📊 Este Mês</TimeLabel>
            <TimeValue>{timeUsage.thisMonth} jogadas</TimeValue>
          </TimeRow>
          <TimeRow>
            <TimeLabel>📚 Anteriores</TimeLabel>
            <TimeValue>{timeUsage.older} jogadas</TimeValue>
          </TimeRow>
        </TimeChart>
      </ChartCard>

      {/* Estatísticas Detalhadas */}
      <ChartCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ChartTitle>🎯 Estatísticas Detalhadas</ChartTitle>
        
        <StatsGrid>
          <StatItem>
            <StatNumber>{gamesData.length}</StatNumber>
            <StatLabel>Jogos Ativos</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{totalUsage}</StatNumber>
            <StatLabel>Total Jogadas</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{totalUsage > 0 ? Math.round(totalUsage / gamesData.length) : 0}</StatNumber>
            <StatLabel>Média por Jogo</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{stats.mostPlayed ? gameMapping[stats.mostPlayed]?.name?.split(' ')[0] || 'N/A' : 'N/A'}</StatNumber>
            <StatLabel>Mais Popular</StatLabel>
          </StatItem>
        </StatsGrid>
      </ChartCard>

      {/* Distribuição Percentual */}
      <ChartCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ChartTitle>📈 Distribuição de Uso</ChartTitle>
        
        {gamesData.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--medium-gray)', padding: 'var(--space-lg)' }}>
            Aguardando dados de uso
          </div>
        ) : (
          gamesData.map((game, index) => (
            <GameRow key={game.id}>
              <GameEmoji>{game.icon}</GameEmoji>
              <GameName>{game.name}</GameName>
              <div style={{ width: '40%' }}>
                <ProgressBar>
                  <ProgressFill
                    color={game.color}
                    colorSecondary={game.colorSecondary}
                    initial={{ width: 0 }}
                    animate={{ width: `${(game.count / totalUsage) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  >
                    {formatPercentage(game.count, totalUsage)}
                  </ProgressFill>
                </ProgressBar>
              </div>
            </GameRow>
          ))
        )}
      </ChartCard>
    </ChartsContainer>
  );
}

export default AdminCharts;
