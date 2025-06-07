import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useUser } from '../../contexts/UserContext';
import databaseService from '../../services/databaseService.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import { getProgressSummary } from '../../utils/progressReports';
import { getUsageStats, getGameUsageCounts, resetGameUsage } from '../../utils/gameUsage';

// Registrar componentes Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
  RadialLinearScale
);

// Estilos modernizados
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: var(--space-lg);

  @media (max-width: 768px) {
    padding: var(--space-md);
  }
`;

const DashboardContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-strong);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  padding: var(--space-xl);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple), var(--primary-pink), var(--primary-orange));
    border-radius: var(--radius-large) var(--radius-large) 0 0;
  }

  @media (max-width: 768px) {
    padding: var(--space-lg);
    margin: var(--space-sm);
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xxl);
  flex-wrap: wrap;
  gap: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: var(--space-md);
  }
`;

const DashboardTitle = styled.h2`
  font-size: var(--font-size-xxl);
  color: var(--primary-purple);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: var(--font-size-xl);
    justify-content: center;
  }
`;

const DashboardSubtitle = styled.p`
  font-size: var(--font-size-md);
  color: var(--medium-gray);
  margin: var(--space-xs) 0 0;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
    text-align: center;
  }
`;

const ChartSection = styled.div`
  margin-bottom: var(--space-xxl);
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-xl);
  color: var(--primary-purple);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);

  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-purple), transparent);
    margin-left: var(--space-md);
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-xxl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
`;

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  box-shadow: var(--shadow-medium);
  height: 350px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple));
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: var(--space-lg);
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-xxl);
  padding: var(--space-lg);
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-md);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);

  label {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--dark-gray);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const Select = styled.select`
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-medium);
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: white;
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  min-width: 180px;

  &:focus {
    outline: none;
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }

  &:hover {
    border-color: var(--primary-purple);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
`;

const StatCard = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.$bgColor || 'var(--primary-blue)'}, ${props => props.$bgColor ? `${props.$bgColor}dd` : 'var(--primary-blue)dd'});
  color: white;
  padding: var(--space-lg);
  border-radius: var(--radius-large);
  text-align: center;
  box-shadow: var(--shadow-medium);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    transform: rotate(45deg);
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--shadow-strong);
  }
`;

const StatValue = styled.div`
  font-size: var(--font-size-xxl);
  font-weight: 800;
  margin-bottom: var(--space-xs);
  position: relative;
  z-index: 1;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  opacity: 0.95;
  font-weight: 600;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: var(--space-xl);
  color: var(--medium-gray);
  font-style: italic;
`;

const Button = styled.button`
  padding: var(--space-sm) var(--space-md);
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-medium);
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: var(--primary-purple);
  }
`;

// Componente principal
const PerformanceDashboard = () => {
  const { userId, isDbConnected, userDetails } = useUser();
  const [timeframe, setTimeframe] = useState('30d'); // 7d, 30d, 90d, all
  const [gameFilter, setGameFilter] = useState('all');
  const [sessionData, setSessionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usageStats, setUsageStats] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    avgAccuracy: 0,
    avgScore: 0,
    totalTimeSpent: 0,
  });
  // Obter dados para o dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId || !isDbConnected) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Obter dados de uso dos jogos
        const gameUsage = getUsageStats();
        setUsageStats(gameUsage);

        // Obter sessões do usuário atual
        let sessions = [];
        try {
          if (gameFilter === 'all') {
            sessions = await databaseService.getGameSessions(userId, null, 100);
          } else {
            sessions = await databaseService.getGameSessions(userId, gameFilter, 100);
          }
        } catch (error) {
          console.error('Erro ao buscar sessões de jogo:', error);
          sessions = [];
        }

        // Filtrar por período
        const filteredSessions = filterSessionsByTimeframe(sessions, timeframe);
        setSessionData(filteredSessions);

        // Calcular estatísticas
        if (filteredSessions.length > 0) {
          const stats = calculateStats(filteredSessions);
          setStats(stats);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId, isDbConnected, timeframe, gameFilter]);

  // Filtrar sessões por período
  const filterSessionsByTimeframe = (sessions, timeframe) => {
    if (timeframe === 'all') return sessions;

    const now = new Date();
    let daysDiff;
    
    switch (timeframe) {
      case '7d': daysDiff = 7; break;
      case '30d': daysDiff = 30; break;
      case '90d': daysDiff = 90; break;
      default: daysDiff = 30;
    }
    
    const cutoffDate = new Date(now.setDate(now.getDate() - daysDiff));
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.created_at);
      return sessionDate >= cutoffDate;
    });
  };

  // Calcular estatísticas
  const calculateStats = (sessions) => {
    const totalSessions = sessions.length;
    const avgAccuracy = sessions.reduce((sum, session) => sum + session.accuracy, 0) / totalSessions;
    const avgScore = sessions.reduce((sum, session) => sum + session.score, 0) / totalSessions;
    const totalTimeSpent = sessions.reduce((sum, session) => sum + session.time_spent, 0);
    
    return {
      totalSessions,
      avgAccuracy,
      avgScore,
      totalTimeSpent,
    };
  };

  // Preparar dados para os gráficos
  const prepareChartData = () => {
    if (!sessionData || sessionData.length === 0) return null;
    
    // Agrupar dados por jogo
    const gameData = {};
    sessionData.forEach(session => {
      if (!gameData[session.game_id]) {
        gameData[session.game_id] = [];
      }
      gameData[session.game_id].push(session);
    });
    
    // Agrupar dados por dia para o gráfico de linha
    const dateMap = new Map();
    sessionData.forEach(session => {
      const date = new Date(session.created_at).toLocaleDateString();
      if (!dateMap.has(date)) {
        dateMap.set(date, {
          count: 0,
          totalScore: 0,
          avgScore: 0,
        });
      }
      const entry = dateMap.get(date);
      entry.count++;
      entry.totalScore += session.score;
      entry.avgScore = entry.totalScore / entry.count;
    });
    
    // Converter Map para arrays para Chart.js
    const dates = Array.from(dateMap.keys());
    const avgScores = dates.map(date => dateMap.get(date).avgScore);
    
    // Dados para o gráfico de barras (por jogo)
    const gameScores = Object.entries(gameData).map(([gameId, sessions]) => {
      return {
        gameId,
        avgScore: sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length,
        totalSessions: sessions.length
      };
    });
    
    // Formatação de cores
    const backgroundColors = [
      'rgba(75, 192, 192, 0.6)',
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
    ];
    
    return {
      // Dados para gráfico de linha (progresso ao longo do tempo)
      lineData: {
        labels: dates,
        datasets: [{
          label: 'Pontuação Média',
          data: avgScores,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
          fill: true,
        }]
      },
      
      // Dados para gráfico de barras (desempenho por jogo)
      barData: {
        labels: gameScores.map(item => getGameName(item.gameId)),
        datasets: [{
          label: 'Pontuação Média',
          data: gameScores.map(item => item.avgScore),
          backgroundColor: backgroundColors,
        }]
      },
      
      // Dados para gráfico de pizza (distribuição de tempo)
      pieData: {
        labels: gameScores.map(item => getGameName(item.gameId)),
        datasets: [{
          label: 'Total de Sessões',
          data: gameScores.map(item => item.totalSessions),
          backgroundColor: backgroundColors,
        }]
      },
      
      // Dados para gráfico radar (habilidades desenvolvidas)
      radarData: prepareSkillsRadarData(),
    };
  };

  // Preparar dados de habilidades para o gráfico de radar
  const prepareSkillsRadarData = () => {
    // Mapear jogos para habilidades desenvolvidas
    const skillsMap = {
      'memory': { memória: 90, concentração: 80, atenção: 70, reconhecimento: 40 },
      'colorMatch': { cores: 90, categorização: 70, visual: 80, rapidez: 60 },
      'imageAssociation': { lógica: 80, associação: 90, classificação: 70, visual: 60 },
      'letterRecognition': { letras: 90, fonética: 80, linguagem: 85, memória: 50 },
      'numberCounting': { números: 90, contagem: 85, matemática: 70, sequências: 60 },
      'musicalSequence': { audição: 85, sequências: 80, ritmo: 90, memória: 70 },
    };
    
    // Determinar as habilidades do usuário com base nas sessões
    const userSkills = { 
      memória: 0, 
      concentração: 0, 
      atenção: 0, 
      lógica: 0, 
      associação: 0, 
      visual: 0, 
      reconhecimento: 0,
      categorização: 0,
      rapidez: 0,
      letras: 0,
      fonética: 0,
      linguagem: 0,
      números: 0,
      contagem: 0,
      matemática: 0,
      sequências: 0,
      audição: 0,
      ritmo: 0
    };
    
    let gamesCounted = {};
    
    // Calcular pontuação de habilidades com base nas sessões
    sessionData.forEach(session => {
      const gameId = session.game_id;
      if (skillsMap[gameId]) {
        if (!gamesCounted[gameId]) {
          gamesCounted[gameId] = true;
          
          // Considerar a acurácia do jogador na média das habilidades
          const factor = session.accuracy / 100; 
          
          // Atualizar valores de habilidade
          Object.entries(skillsMap[gameId]).forEach(([skill, value]) => {
            if (userSkills[skill] !== undefined) {
              userSkills[skill] += value * factor;
            }
          });
        }
      }
    });
    
    // Normalizar valores (max 100)
    Object.keys(userSkills).forEach(skill => {
      userSkills[skill] = Math.min(Math.round(userSkills[skill]), 100);
    });
    
    // Filtrar apenas habilidades com valores > 0
    const filteredSkills = Object.fromEntries(
      Object.entries(userSkills).filter(([_, value]) => value > 0)
    );
    
    return {
      labels: Object.keys(filteredSkills),
      datasets: [{
        label: 'Nível de Habilidade',
        data: Object.values(filteredSkills),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      }]
    };
  };

  // Mapear IDs de jogos para nomes
  const getGameName = (gameId) => {
    const gameNames = {
      'memory': 'Jogo da Memória',
      'colorMatch': 'Combinar Cores',
      'imageAssociation': 'Associação de Imagens',
      'letterRecognition': 'Reconhecimento de Letras',
      'numberCounting': 'Contagem de Números',
      'musicalSequence': 'Sequência Musical',
    };
    
    return gameNames[gameId] || gameId;
  };

  // Formatar tempo total (segundos -> minutos e horas)
  const formatTotalTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} minutos`;
  };

  // Opções de filtro para os jogos
  const gameOptions = [
    { value: 'all', label: 'Todos os Jogos' },
    { value: 'memory', label: 'Jogo da Memória' },
    { value: 'colorMatch', label: 'Combinar Cores' },
    { value: 'imageAssociation', label: 'Associação de Imagens' },
    { value: 'letterRecognition', label: 'Reconhecimento de Letras' },
    { value: 'numberCounting', label: 'Contagem de Números' },
    { value: 'musicalSequence', label: 'Sequência Musical' },
  ];

  // Opções para o período de tempo
  const timeframeOptions = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: 'all', label: 'Todo o período' },
  ];

  // Obter dados do gráfico
  const chartData = prepareChartData();
  
  // Configuração dos gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1);
            }
            return label;
          }
        }
      }
    },
  };

  // Opções específicas para o gráfico de linha
  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Animações para os cards de estatísticas
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1 }
    })
  };

  // Gerar relatório de progresso
  const handleGenerateReport = async () => {
    if (!userId) return;
    
    try {
      const summary = await getProgressSummary(userId);
      setProgressData(summary);
      console.log("Resumo de progresso gerado:", summary);
      // Aqui você pode adicionar lógica para exportar como PDF, enviar por email, etc.
      alert("Relatório de progresso gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      alert("Houve um erro ao gerar o relatório de progresso.");
    }
  };

  // Componente para listar jogos por uso
  const UsageGamesList = () => {
    const usage = getGameUsageCounts();
    const gameNames = {
      'memory-game': '🧠 Jogo da Memória',
      'color-match': '🌈 Combinar Cores',
      'image-association': '🧩 Associação de Imagens',
      'musical-sequence': '🎵 Sequência Musical',
      'letter-recognition': '📚 Reconhecimento de Letras',
      'number-counting': '🔢 Números e Contagem'
    };

    const gameUsageArray = Object.entries(usage)
      .filter(([key, value]) => typeof value === 'number' && !key.includes('_lastPlayed'))
      .map(([gameId, count]) => ({
        gameId,
        name: gameNames[gameId] || gameId,
        count,
        lastPlayed: usage[`${gameId}_lastPlayed`]
      }))
      .sort((a, b) => b.count - a.count);

    if (gameUsageArray.length === 0) {
      return <p style={{ textAlign: 'center', color: 'var(--medium-gray)' }}>Nenhum jogo foi jogado ainda.</p>;
    }

    return (
      <div style={{ display: 'grid', gap: 'var(--space-xs)' }}>
        {gameUsageArray.map((game, index) => (
          <div key={game.gameId} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-xs) var(--space-sm)',
            background: index < 3 ? 'var(--primary-blue)' : 'var(--light-gray)',
            color: index < 3 ? 'white' : 'var(--dark-gray)',
            borderRadius: 'var(--radius-small)',
            fontSize: 'var(--font-size-sm)'
          }}>
            <span>
              {index === 0 && '🥇'} 
              {index === 1 && '🥈'} 
              {index === 2 && '🥉'} 
              {index > 2 && `${index + 1}º`} {game.name}
            </span>
            <span style={{ fontWeight: 'bold' }}>
              {game.count}x
              {game.lastPlayed && (
                <span style={{ fontSize: '0.8em', opacity: 0.8, marginLeft: '4px' }}>
                  ({new Date(game.lastPlayed).toLocaleDateString()})
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <DashboardContainer>
      <DashboardContent>
        <DashboardHeader>
          <div>
            <DashboardTitle>
              <span role="img" aria-label="gráfico">📊</span> Dashboard de Desempenho
            </DashboardTitle>
            <DashboardSubtitle>
              Visualize o progresso e análise de desempenho de {userDetails?.display_name || "Usuário"}
            </DashboardSubtitle>
          </div>

          <Button onClick={handleGenerateReport}>
            📄 Gerar Relatório Completo
          </Button>
        </DashboardHeader>

      {isDbConnected ? (
        <>
          {progressData?.overallProgress?.offlineData && (
            <div 
              style={{
                background: 'rgba(255, 193, 7, 0.15)',
                borderLeft: '4px solid var(--warning-color)',
                padding: 'var(--space-md)',
                marginBottom: 'var(--space-lg)',
                borderRadius: 'var(--radius-small)'
              }}
            >
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                <strong>⚠️ Modo Offline:</strong> Alguns dados estão sendo exibidos a partir do armazenamento local. 
                Eles serão sincronizados automaticamente quando a conexão com o servidor for restabelecida.
              </p>
            </div>
          )}

          <FilterBar>
            <FilterGroup>
              <label htmlFor="timeframe">📅 Período</label>
              <Select
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                {timeframeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <label htmlFor="gameFilter">🎮 Jogo</label>
              <Select
                id="gameFilter"
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
              >
                {gameOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FilterGroup>
          </FilterBar>

          {isLoading ? (
            <div>Carregando dados...</div>
          ) : sessionData.length === 0 ? (
            <NoDataMessage>
              <p>Nenhum dado de jogo encontrado para o período selecionado.</p>
              <p>Complete algumas atividades para visualizar seu progresso!</p>
            </NoDataMessage>
          ) : (
            <>
              <StatsGrid>
                <StatCard
                  $bgColor="var(--primary-blue)"
                  $bgColorSecondary="var(--primary-cyan)"
                  variants={cardVariants}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                >
                  <StatValue>🎮 {stats.totalSessions}</StatValue>
                  <StatLabel>Sessões de Jogo</StatLabel>
                </StatCard>

                <StatCard
                  $bgColor="var(--primary-green)"
                  $bgColorSecondary="var(--success)"
                  variants={cardVariants}
                  custom={1}
                  initial="hidden"
                  animate="visible"
                >
                  <StatValue>🎯 {stats.avgAccuracy.toFixed(1)}%</StatValue>
                  <StatLabel>Precisão Média</StatLabel>
                </StatCard>

                <StatCard
                  $bgColor="var(--primary-purple)"
                  $bgColorSecondary="var(--primary-pink)"
                  variants={cardVariants}
                  custom={2}
                  initial="hidden"
                  animate="visible"
                >
                  <StatValue>⭐ {stats.avgScore.toFixed(0)}</StatValue>
                  <StatLabel>Pontuação Média</StatLabel>
                </StatCard>

                <StatCard
                  $bgColor="var(--primary-orange)"
                  $bgColorSecondary="var(--warning)"
                  variants={cardVariants}
                  custom={3}
                  initial="hidden"
                  animate="visible"
                >                  <StatValue>⏱️ {formatTotalTime(stats.totalTimeSpent)}</StatValue>
                  <StatLabel>Tempo Total de Jogo</StatLabel>
                </StatCard>
              </StatsGrid>

              {/* Seção de Estatísticas de Uso dos Jogos */}
              <ChartSection style={{ marginBottom: 'var(--space-xl)' }}>
                <SectionTitle>🎯 Ranking de Jogos Mais Utilizados</SectionTitle>
                {usageStats && usageStats.totalUsage > 0 ? (
                  <div>
                    <StatsGrid style={{ marginBottom: 'var(--space-md)' }}>
                      <StatCard
                        $bgColor="var(--primary-cyan)"
                        variants={cardVariants}
                        custom={4}
                        initial="hidden"
                        animate="visible"
                      >
                        <StatValue>{usageStats.totalUsage}</StatValue>
                        <StatLabel>Total de Jogadas</StatLabel>
                      </StatCard>

                      <StatCard
                        $bgColor="var(--primary-pink)"
                        variants={cardVariants}
                        custom={5}
                        initial="hidden"
                        animate="visible"
                      >
                        <StatValue>{usageStats.totalGames}</StatValue>
                        <StatLabel>Jogos Utilizados</StatLabel>
                      </StatCard>
                    </StatsGrid>
                    
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.9)', 
                      padding: 'var(--space-md)', 
                      borderRadius: 'var(--radius-medium)',
                      border: '1px solid var(--light-gray)'
                    }}>
                      <h4 style={{ color: 'var(--primary-blue)', marginBottom: 'var(--space-sm)' }}>
                        📊 Detalhes de Uso por Jogo:
                      </h4>
                      <UsageGamesList />
                      <div style={{ marginTop: 'var(--space-md)', textAlign: 'center' }}>
                        <Button 
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja resetar todas as estatísticas de uso?')) {
                              resetGameUsage();
                              setUsageStats(getUsageStats());
                            }
                          }}
                          style={{ background: 'var(--primary-orange)', fontSize: 'var(--font-size-sm)' }}
                        >
                          🔄 Resetar Estatísticas de Uso
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    color: 'var(--medium-gray)', 
                    padding: 'var(--space-lg)',
                    background: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: 'var(--radius-medium)',
                    border: '1px solid var(--light-gray)'
                  }}>
                    <p>🎮 Nenhum jogo foi utilizado ainda.</p>
                    <p>Comece jogando para ver as estatísticas de uso aparecerem aqui!</p>
                  </div>
                )}
              </ChartSection>
              
              <ChartSection>
                <SectionTitle>Progresso ao Longo do Tempo</SectionTitle>
                <ChartContainer>
                  {chartData && <Line data={chartData.lineData} options={lineOptions} />}
                </ChartContainer>
              </ChartSection>
              
              <ChartsGrid>
                <ChartSection>
                  <SectionTitle>Desempenho por Jogo</SectionTitle>
                  <ChartContainer>
                    {chartData && <Bar data={chartData.barData} options={chartOptions} />}
                  </ChartContainer>
                </ChartSection>
                
                <ChartSection>
                  <SectionTitle>Distribuição de Atividades</SectionTitle>
                  <ChartContainer>
                    {chartData && <Pie data={chartData.pieData} options={chartOptions} />}
                  </ChartContainer>
                </ChartSection>
              </ChartsGrid>
              
              <ChartSection>
                <SectionTitle>Mapa de Habilidades</SectionTitle>
                <ChartContainer style={{ height: '400px' }}>
                  {chartData && <Radar data={chartData.radarData} options={chartOptions} />}
                </ChartContainer>
                <p style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-sm)', color: 'var(--medium-gray)' }}>
                  * Este mapa mostra o nível relativo de habilidades desenvolvidas com base nas atividades realizadas
                </p>
              </ChartSection>
            </>
          )}
        </>
      ) : (
        <NoDataMessage>
          <p>O dashboard de desempenho requer conexão com banco de dados.</p>
          <p>Conecte-se ao banco de dados para ver estatísticas detalhadas e gráficos de progresso.</p>
        </NoDataMessage>
      )}
      </DashboardContent>
    </DashboardContainer>
  );
};

export default PerformanceDashboard;
