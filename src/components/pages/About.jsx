import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const AboutContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-md);
  
  @media (max-width: 768px) {
    padding: var(--space-sm);
  }
`

const HeroBanner = styled(motion.div)`
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple));
  border-radius: var(--radius-large);
  padding: var(--space-xxl) var(--space-xl);
  margin-bottom: var(--space-xl);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-strong);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/pattern-dots.svg') repeat;
    opacity: 0.1;
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    padding: var(--space-xl) var(--space-lg);
    margin-bottom: var(--space-lg);
  }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`

const HeroTitle = styled.h1`
  font-size: var(--font-size-xxxl);
  font-weight: 800;
  margin-bottom: var(--space-md);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-xxl);
  }
`

const HeroSubtitle = styled.p`
  font-size: var(--font-size-lg);
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto var(--space-lg) auto;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-md);
  }
`

const Section = styled(motion.section)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-large);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-medium);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  
  &:hover {
    box-shadow: var(--shadow-large);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-lg);
    margin-bottom: var(--space-md);
  }
`

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  color: var(--primary-blue);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-md);
  }
`

const SectionContent = styled.div`
  line-height: 1.7;
  color: var(--dark-gray);
  font-size: var(--font-size-md);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
  }
`

const HighlightBox = styled.div`
  background: linear-gradient(135deg, var(--primary-green), var(--primary-blue));
  color: white;
  padding: var(--space-lg);
  border-radius: var(--radius-medium);
  margin: var(--space-lg) 0;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: var(--space-md);
    margin: var(--space-md) 0;
  }
`

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: var(--space-lg) 0;
`

const BenefitItem = styled(motion.li)`
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding: var(--space-sm);
  background: var(--light-gray);
  border-radius: var(--radius-medium);
  border-left: 4px solid var(--primary-green);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    background: var(--light-blue);
    box-shadow: var(--shadow-small);
  }
`

const BenefitEmoji = styled.span`
  font-size: var(--font-size-lg);
  min-width: 24px;
`

const BenefitText = styled.span`
  font-size: var(--font-size-md);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
  }
`

const AIFeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-md);
  margin: var(--space-lg) 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`

const AIFeatureCard = styled(motion.div)`
  background: white;
  padding: var(--space-lg);
  border-radius: var(--radius-medium);
  border: 2px solid var(--primary-purple);
  text-align: center;
  box-shadow: var(--shadow-light);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
    border-color: var(--primary-blue);
  }
  
  @media (max-width: 768px) {
    padding: var(--space-md);
  }
`

const AIFeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: var(--space-sm);
`

const AIFeatureTitle = styled.h4`
  font-size: var(--font-size-md);
  color: var(--primary-purple);
  margin-bottom: var(--space-sm);
  font-weight: 600;
`

const AIFeatureDescription = styled.p`
  font-size: var(--font-size-sm);
  color: var(--medium-gray);
  line-height: 1.5;
`

const TechBadge = styled.span`
  display: inline-block;
  background: var(--primary-orange);
  color: white;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-large);
  font-size: var(--font-size-xs);
  font-weight: 600;
  margin: var(--space-xs) var(--space-xs) var(--space-xs) 0;
`

function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }
  return (
    <AboutContainer>
      <HeroBanner
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroContent>
          <HeroTitle>Portal Betina</HeroTitle>
          <HeroSubtitle>
            Transformando vidas através de atividades neuropedagógicas potencializadas por inteligência artificial
          </HeroSubtitle>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <TechBadge style={{ fontSize: 'var(--font-size-md)', padding: 'var(--space-sm) var(--space-md)' }}>
              🧠 Desenvolvimento Cognitivo
            </TechBadge>{' '}
            <TechBadge style={{ fontSize: 'var(--font-size-md)', padding: 'var(--space-sm) var(--space-md)', background: 'var(--primary-green)' }}>
              🤖 Potencializado por IA
            </TechBadge>{' '}
            <TechBadge style={{ fontSize: 'var(--font-size-md)', padding: 'var(--space-sm) var(--space-md)', background: 'var(--primary-purple)' }}>
              ♿ 100% Acessível
            </TechBadge>
          </motion.div>
        </HeroContent>
      </HeroBanner>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Section variants={itemVariants}>
          <SectionTitle>
            <span>🧠</span>
            O que são Atividades Neuropedagógicas?
          </SectionTitle>
          <SectionContent>
            <p>
              <strong>Atividades neuropedagógicas</strong> são intervenções estruturadas que estimulam o 
              desenvolvimento cognitivo, emocional e social, especialmente para crianças com autismo, 
              TDAH ou outras necessidades específicas.
            </p>
            <p>
              Elas combinam princípios da <strong>neurociência</strong>, <strong>psicologia</strong> e 
              <strong>pedagogia</strong> para promover habilidades essenciais como:
            </p>
            
            <BenefitsList>
              <BenefitItem>
                <BenefitEmoji>🎯</BenefitEmoji>
                <BenefitText><strong>Atenção e Concentração:</strong> Melhorar o foco e a capacidade de manter a atenção</BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitEmoji>🧠</BenefitEmoji>
                <BenefitText><strong>Memória:</strong> Fortalecer a memória de trabalho e de longo prazo</BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitEmoji>🤔</BenefitEmoji>
                <BenefitText><strong>Raciocínio Lógico:</strong> Desenvolver habilidades de resolução de problemas</BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitEmoji>✋</BenefitEmoji>
                <BenefitText><strong>Coordenação Motora:</strong> Aprimorar habilidades motoras finas e grossas</BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitEmoji>😊</BenefitEmoji>
                <BenefitText><strong>Regulação Emocional:</strong> Aprender a identificar e gerenciar emoções</BenefitText>
              </BenefitItem>
            </BenefitsList>
          </SectionContent>
        </Section>

        <Section variants={itemVariants}>
          <SectionTitle>
            <span>🤖</span>
            Como a Inteligência Artificial Potencializa o Aprendizado
          </SectionTitle>
          <SectionContent>
            <HighlightBox>
              <h3 style={{ margin: '0 0 var(--space-md) 0', fontSize: 'var(--font-size-lg)' }}>
                🚀 Todas as atividades do Portal Betina são desenvolvidas com IA
              </h3>
              <p style={{ margin: 0, fontSize: 'var(--font-size-md)' }}>
                Utilizamos inteligência artificial para criar experiências personalizadas, 
                adaptativas e mais eficazes para cada criança.
              </p>
            </HighlightBox>            <AIFeatureGrid>
              <AIFeatureCard 
                whileHover={{ scale: 1.03 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AIFeatureIcon>🎯</AIFeatureIcon>
                <AIFeatureTitle>Personalização Inteligente</AIFeatureTitle>
                <AIFeatureDescription>
                  A IA adapta a dificuldade e o ritmo das atividades baseado no desempenho individual da criança
                </AIFeatureDescription>
              </AIFeatureCard>

              <AIFeatureCard 
                whileHover={{ scale: 1.03 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AIFeatureIcon>📊</AIFeatureIcon>
                <AIFeatureTitle>Análise de Progresso</AIFeatureTitle>
                <AIFeatureDescription>
                  Algoritmos analisam padrões de aprendizado e fornecem insights sobre o desenvolvimento cognitivo
                </AIFeatureDescription>
              </AIFeatureCard>

              <AIFeatureCard 
                whileHover={{ scale: 1.03 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AIFeatureIcon>🎮</AIFeatureIcon>
                <AIFeatureTitle>Engajamento Otimizado</AIFeatureTitle>
                <AIFeatureDescription>
                  IA determina os melhores momentos e tipos de feedback para manter a motivação e interesse
                </AIFeatureDescription>
              </AIFeatureCard>

              <AIFeatureCard 
                whileHover={{ scale: 1.03 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AIFeatureIcon>🔄</AIFeatureIcon>
                <AIFeatureTitle>Adaptação Contínua</AIFeatureTitle>
                <AIFeatureDescription>
                  O sistema aprende continuamente com as interações, melhorando constantemente a experiência
                </AIFeatureDescription>
              </AIFeatureCard>
            </AIFeatureGrid>
          </SectionContent>
        </Section>

        <Section variants={itemVariants}>
          <SectionTitle>
            <span>⚙️</span>
            Tecnologias e Metodologias Aplicadas
          </SectionTitle>
          <SectionContent>
            <p>
              O Portal Betina utiliza tecnologias modernas e metodologias baseadas em evidências científicas:
            </p>
            
            <div style={{ margin: 'var(--space-lg) 0' }}>
              <h4 style={{ color: 'var(--primary-blue)', marginBottom: 'var(--space-md)' }}>
                🧬 Base Científica
              </h4>
              <TechBadge>Neurociência Cognitiva</TechBadge>
              <TechBadge>Psicologia do Desenvolvimento</TechBadge>
              <TechBadge>Pedagogia Inclusiva</TechBadge>
              <TechBadge>Terapia ABA</TechBadge>
              <TechBadge>Neuroplasticidade</TechBadge>
            </div>

            <div style={{ margin: 'var(--space-lg) 0' }}>
              <h4 style={{ color: 'var(--primary-green)', marginBottom: 'var(--space-md)' }}>
                💻 Tecnologia
              </h4>
              <TechBadge>React + IA</TechBadge>
              <TechBadge>Machine Learning</TechBadge>
              <TechBadge>Design Responsivo</TechBadge>
              <TechBadge>Acessibilidade Web</TechBadge>
              <TechBadge>Progressive Web App</TechBadge>
            </div>

            <div style={{ margin: 'var(--space-lg) 0' }}>
              <h4 style={{ color: 'var(--primary-purple)', marginBottom: 'var(--space-md)' }}>
                🌈 Acessibilidade
              </h4>
              <TechBadge>Screen Reader</TechBadge>
              <TechBadge>Alto Contraste</TechBadge>
              <TechBadge>Navegação por Teclado</TechBadge>
              <TechBadge>Feedback Háptico</TechBadge>
              <TechBadge>WCAG 2.1 AA</TechBadge>
            </div>
          </SectionContent>
        </Section>

        <Section variants={itemVariants}>
          <SectionTitle>
            <span>👨‍👩‍👧‍👦</span>
            Para Pais, Terapeutas e Educadores
          </SectionTitle>
          <SectionContent>
            <p>
              O Portal Betina foi desenvolvido para ser uma ferramenta colaborativa entre famílias e profissionais:
            </p>
            
            <BenefitsList>
              <BenefitItem>
                <BenefitEmoji>👩‍⚕️</BenefitEmoji>
                <BenefitText>
                  <strong>Para Terapeutas:</strong> Ferramentas complementares para sessões presenciais e atividades para casa
                </BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitEmoji>👨‍🏫</BenefitEmoji>
                <BenefitText>
                  <strong>Para Educadores:</strong> Recursos para inclusão escolar e desenvolvimento de habilidades específicas
                </BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitEmoji>👨‍👩‍👧</BenefitEmoji>
                <BenefitText>
                  <strong>Para Famílias:</strong> Atividades estruturadas para momentos de qualidade e desenvolvimento em casa
                </BenefitText>
              </BenefitItem>
              <BenefitItem>
                <BenefitEmoji>🤝</BenefitEmoji>
                <BenefitText>
                  <strong>Colaboração:</strong> Dados e progresso compartilhados entre todos os envolvidos no cuidado da criança
                </BenefitText>
              </BenefitItem>
            </BenefitsList>

            <HighlightBox>
              <p style={{ margin: 0, fontSize: 'var(--font-size-md)' }}>
                💝 <strong>100% Gratuito e Sempre Será</strong><br/>
                Acreditamos que toda criança merece acesso a ferramentas de qualidade para seu desenvolvimento, 
                independentemente da condição socioeconômica da família.
              </p>
            </HighlightBox>
          </SectionContent>
        </Section>
      </motion.div>
    </AboutContainer>
  )
}

export default About
