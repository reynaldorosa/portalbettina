import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { getTopGamesFromActivities } from '../../utils/game/gameUsage'

const MenuContainer = styled.section`
  margin: var(--space-xl) 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 var(--space-md);

  @media (max-width: 768px) {
    padding: 0 var(--space-sm);
  }
`

const MenuTitle = styled.h2`
  text-align: center;
  font-size: var(--font-size-xxl);
  color: white;
  margin-bottom: var(--space-xl);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
  position: relative;
  display: inline-block;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-large);

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple));
    border-radius: 2px;
  }
`

const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xxl);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-lg);
  text-align: center;
  box-shadow: var(--shadow-medium);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-strong);
  }
`

const StatNumber = styled.div`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--primary-blue);
  margin-bottom: var(--space-xs);
`

const StatLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
  font-weight: 500;
`

const ActivitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-md);
    max-width: 600px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
    max-width: 400px;
  }
`

const ActivityCard = styled(motion.button)`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
  border: none;
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  cursor: pointer;
  box-shadow: var(--shadow-medium);
  transition: all var(--transition-normal);
  text-align: center;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    background: linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.95));
    border: 2px solid var(--primary-blue);

    &::before {
      left: 100%;
    }
  }

  &:focus {
    outline: 3px solid var(--primary-blue);
    outline-offset: 3px;
  }

  &:active {
    transform: translateY(-4px) scale(0.98);
  }

  @media (max-width: 768px) {
    padding: var(--space-lg);
    min-height: 200px;
  }

  @media (max-width: 480px) {
    padding: var(--space-md);
    min-height: 180px;
  }
`

const ActivityIcon = styled.div`
  font-size: 3.5rem;
  line-height: 1;
  filter: drop-shadow(3px 3px 8px rgba(0, 0, 0, 0.15));
  margin-bottom: var(--space-sm);
  transition: all var(--transition-normal);

  ${ActivityCard}:hover & {
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(4px 4px 12px rgba(0, 0, 0, 0.2));
  }
`

const ActivityTitle = styled.h3`
  font-size: var(--font-size-lg);
  color: var(--dark-blue, #0a2463);
  margin: 0;
  font-weight: 700;
  margin-bottom: var(--space-xs);
  transition: color var(--transition-normal);
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);

  ${ActivityCard}:hover & {
    color: var(--primary-blue);
  }
`

const ActivityDescription = styled.p`
  font-size: var(--font-size-md);
  color: var(--dark-gray);
  margin: 0;
  line-height: 1.5;
  text-align: center;
  margin-bottom: var(--space-sm);
  transition: color var(--transition-normal);
  font-weight: 500;

  ${ActivityCard}:hover & {
    color: var(--dark-gray);
  }
`

const ActivityBadge = styled.span`
  background: linear-gradient(
    135deg,
    ${(props) => props.color || 'var(--primary-blue)'},
    ${(props) => (props.color ? `${props.color}dd` : 'var(--primary-blue)dd')}
  );
  color: white;
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-large);
  font-size: var(--font-size-sm);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all var(--transition-normal);
  margin-top: auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

  ${ActivityCard}:hover & {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    filter: brightness(1.1);
  }
`

const activities = [
  {
    id: 'letter-recognition',
    title: 'Reconhecimento de Letras',
    description: 'Aprenda o alfabeto de forma divertida e interativa',
    icon: '🔤',
    color: 'var(--primary-blue)',
    badge: 'Letras',
  },
  {
    id: 'musical-sequence',
    title: 'Sequência de Sons',
    description: 'Repita sequências sonoras e desenvolva a memória auditiva',
    icon: '🎧',
    color: 'var(--primary-purple)',
    badge: 'Sons',
  },
  {
    id: 'creative-painting',
    title: 'Pintura com Referência',
    description: 'Pinte seguindo números e cores para criar belas obras de arte',
    icon: '🎨',
    color: 'var(--primary-pink)',
    badge: 'Arte',
  },
  {
    id: 'visual-patterns',
    title: 'Padrões Visuais',
    description: 'Complete sequências de formas e cores para treinar a lógica',
    icon: '🔷',
    color: 'var(--primary-blue)',
    badge: 'Padrões',
  },
  {
    id: 'emotional-puzzle',
    title: 'Quebra-Cabeça Emocional',
    description: 'Monte quebra-cabeças temáticos sobre emoções e sentimentos',
    icon: '😊',
    color: 'var(--primary-purple)',
    badge: 'Emoções',
  },
  {
    id: 'memory-game',
    title: 'Jogo da Memória',
    description: 'Encontre os pares iguais e exercite a memória de forma divertida',
    icon: '🃏',
    color: 'var(--primary-green)',
    badge: 'Memória',
  },
  {
    id: 'image-association',
    title: 'Associação de Imagens',
    description: 'Combine imagens relacionadas e desenvolva conexões lógicas',
    icon: '🧩',
    color: 'var(--primary-orange)',
    badge: 'Lógica',
  },
  {
    id: 'number-counting',
    title: 'Números e Contagem',
    description: 'Aprenda números de 1 a 10 com atividades interativas',
    icon: '🔢',
    color: 'var(--primary-cyan)',
    badge: 'Números',
  },
]

const tools = [
  {
    id: 'integrated-system-dashboard',
    title: 'Dashboard Inteligente',
    description: 'Monitor central com IA, métricas avançadas e análise terapêutica',
    icon: '🤖',
    color: 'var(--primary-blue)',
    badge: 'IA',
  },
  {
    id: 'user-profiles',
    title: 'Perfis de Usuário',
    description: 'Gerencie diferentes perfis para toda a família',
    icon: '👤',
    color: 'var(--primary-purple)',
    badge: 'Perfis',
  },
  {
    id: 'performance-dashboard',
    title: 'Dashboard de Desempenho',
    description: 'Visualize estatísticas detalhadas e gráficos de progresso',
    icon: '📊',
    color: 'var(--primary-green)',
    badge: 'Análise',
  },
  {
    id: 'backup-export',
    title: 'Backup e Exportação',
    description: 'Salve seus dados ou transfira para outro dispositivo',
    icon: '💾',
    color: 'var(--primary-orange)',
    badge: 'Dados',
  },
]

function ActivityMenu({ onActivitySelect }) {
  const [topActivities, setTopActivities] = useState(activities)
  const [stats, setStats] = useState({
    totalGames: activities.length,
    totalTools: tools.length,
    totalActivities: activities.length + tools.length,
  })

  useEffect(() => {
    // Calcula os jogos mais utilizados baseado no array de atividades atual
    const topGames = getTopGamesFromActivities(activities)
    setTopActivities(topGames)

    // Atualiza estatísticas
    setStats({
      totalGames: activities.length,
      totalTools: tools.length,
      totalActivities: activities.length + tools.length,
    })
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <MenuContainer>
      <MenuTitle>🎯 Atividades Mais Populares</MenuTitle>

      <ActivitiesGrid
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {topActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              y: -8,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onActivitySelect(activity.id)}
            aria-label={`${activity.title}: ${activity.description}`}
          >
            <ActivityIcon>{activity.icon}</ActivityIcon>
            <ActivityTitle>{activity.title}</ActivityTitle>
            <ActivityDescription>{activity.description}</ActivityDescription>
            <ActivityBadge color={activity.color}>
              {activity.badge}
              {activity.usageCount > 0 && (
                <span style={{ marginLeft: '4px', fontSize: '0.8em', opacity: 0.8 }}>
                  ({activity.usageCount}x)
                </span>
              )}
            </ActivityBadge>
          </ActivityCard>
        ))}
      </ActivitiesGrid>

      <MenuTitle style={{ marginTop: 'var(--space-xxl)' }}>
        ⚙️ Ferramentas e Configurações
      </MenuTitle>

      <ActivitiesGrid
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tools.map((tool) => (
          <ActivityCard
            key={tool.id}
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              y: -8,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onActivitySelect(tool.id)}
            aria-label={`${tool.title}: ${tool.description}`}
          >
            <ActivityIcon>{tool.icon}</ActivityIcon>
            <ActivityTitle>{tool.title}</ActivityTitle>
            <ActivityDescription>{tool.description}</ActivityDescription>
            <ActivityBadge color={tool.color}>{tool.badge}</ActivityBadge>
          </ActivityCard>
        ))}
      </ActivitiesGrid>
    </MenuContainer>
  )
}

export default ActivityMenu
