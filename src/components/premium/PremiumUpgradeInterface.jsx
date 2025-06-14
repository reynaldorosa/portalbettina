// Interface de Upgrade Premium
// Permite que usuários vejam planos e façam upgrade para recursos avançados

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { usePremiumAuth } from '../../contexts/PremiumAuthContext';

const UpgradeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 40px 0;
`;

const PlanCard = styled(motion.div)`
  background: ${props => props.featured 
    ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
    : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(10px);
  border: ${props => props.featured ? '3px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.2)'};
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
  color: ${props => props.featured ? '#333' : 'white'};
  box-shadow: ${props => props.featured 
    ? '0 20px 60px rgba(255, 215, 0, 0.3)' 
    : '0 10px 40px rgba(0, 0, 0, 0.2)'};
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  transform: rotate(15deg);
  box-shadow: 0 4px 15px rgba(238, 90, 36, 0.4);
`;

const PlanPrice = styled.div`
  font-size: 48px;
  font-weight: bold;
  margin: 20px 0;
  
  span {
    font-size: 16px;
    opacity: 0.7;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 30px 0;
  text-align: left;
  
  li {
    padding: 8px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    
    &::before {
      content: '✅';
      font-size: 14px;
    }
  }
`;

const UpgradeButton = styled(motion.button)`
  width: 100%;
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  background: ${props => props.featured 
    ? 'linear-gradient(45deg, #667eea, #764ba2)' 
    : 'linear-gradient(45deg, #4CAF50, #45a049)'};
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const UsageIndicator = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
`;

const UsageBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
`;

const UsageProgress = styled.div`
  height: 100%;
  background: ${props => props.percentage > 80 ? '#f44336' : props.percentage > 60 ? '#ff9800' : '#4CAF50'};
  width: ${props => Math.min(props.percentage, 100)}%;
  transition: width 0.3s ease;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 40px 0;
`;

const BenefitCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const TestimonialCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 15px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
  border-left: 4px solid #FFD700;
`;

const PremiumUpgradeInterface = ({ onClose, defaultPlan = 'premium' }) => {
  const { 
    user, 
    subscription, 
    getCurrentPlan, 
    getUpgradeOptions, 
    getUsageStatus,
    upgradeToPremium,
    canAccessFeature
  } = usePremiumAuth();

  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState(null);

  const currentPlan = getCurrentPlan();
  const upgradeOptions = getUpgradeOptions();
  const aiUsage = getUsageStatus('ai_reports');

  const handleUpgrade = async (planId) => {
    try {
      setUpgrading(true);
      setSelectedPlan(planId);
      
      // Simular processo de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await upgradeToPremium(planId);
      setUpgradeResult(result);
      
      if (result.success) {
        setTimeout(() => {
          onClose && onClose();
        }, 3000);
      }
    } catch (error) {
      setUpgradeResult({ 
        success: false, 
        message: 'Erro ao processar upgrade' 
      });
    } finally {
      setUpgrading(false);
    }
  };

  const benefits = [
    {
      icon: '🧠',
      title: 'Análise com IA',
      description: 'Insights profundos sobre padrões cognitivos e comportamentais'
    },
    {
      icon: '📊',
      title: 'Relatórios Avançados',
      description: 'Visualizações interativas e análises preditivas'
    },
    {
      icon: '🎯',
      title: 'Recomendações Personalizadas',
      description: 'Sugestões de atividades baseadas no perfil único da criança'
    },
    {
      icon: '📈',
      title: 'Acompanhamento de Progresso',
      description: 'Monitoramento detalhado da evolução ao longo do tempo'
    },
    {
      icon: '👩‍⚕️',
      title: 'Insights Profissionais',
      description: 'Relatórios específicos para terapeutas e educadores'
    },
    {
      icon: '🔒',
      title: 'Dados Seguros',
      description: 'Armazenamento seguro e privacidade garantida'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Ana Silva',
      role: 'Neuropedagoga',
      text: 'Os relatórios com IA revolucionaram minha prática. Consigo identificar padrões que antes levavam meses para perceber.'
    },
    {
      name: 'Maria Santos',
      role: 'Mãe do João (8 anos)',
      text: 'O relatório premium me ajudou a entender melhor as necessidades do meu filho. As recomendações foram muito úteis.'
    },
    {
      name: 'Carlos Oliveira',
      role: 'Psicólogo Educacional',
      text: 'A análise preditiva é impressionante. Consigo planejar intervenções mais eficazes para meus pacientes.'
    }
  ];

  return (
    <UpgradeContainer>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🚀 Desbloqueie o Poder da IA</h1>
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          Obtenha insights profundos sobre o desenvolvimento cognitivo com análises avançadas
        </p>
      </div>

      {/* Status Atual */}
      {subscription && (
        <UsageIndicator>
          <h3>📊 Seu Plano Atual: {currentPlan.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <p><strong>Relatórios IA este mês:</strong></p>
              <UsageBar>
                <UsageProgress percentage={aiUsage.percentage} />
              </UsageBar>
              <p style={{ fontSize: '14px' }}>
                {aiUsage.used} / {aiUsage.limit} utilizados
              </p>
            </div>
            
            <div>
              <p><strong>Recursos disponíveis:</strong></p>
              <div style={{ fontSize: '14px' }}>
                {canAccessFeature('ai_reports') ? '✅' : '❌'} Relatórios com IA
                <br />
                {canAccessFeature('export_pdf') ? '✅' : '❌'} Exportar PDF
                <br />
                {canAccessFeature('detailed_analytics') ? '✅' : '❌'} Analytics Detalhado
              </div>
            </div>
          </div>
        </UsageIndicator>
      )}

      {/* Benefícios Premium */}
      <div style={{ margin: '40px 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          ✨ Por que escolher o Premium?
        </h2>
        <BenefitsGrid>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                {benefit.icon}
              </div>
              <h4>{benefit.title}</h4>
              <p style={{ fontSize: '14px', opacity: 0.9 }}>
                {benefit.description}
              </p>
            </BenefitCard>
          ))}
        </BenefitsGrid>
      </div>

      {/* Planos */}
      <PlansGrid>
        {upgradeOptions.map((plan, index) => (
          <PlanCard
            key={plan.id}
            featured={plan.id === 'premium'}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
          >
            {plan.id === 'premium' && (
              <FeaturedBadge>MAIS POPULAR</FeaturedBadge>
            )}
            
            <h3>{plan.name}</h3>
            <PlanPrice>
              R$ {plan.price.toFixed(2)}
              <span>/mês</span>
            </PlanPrice>
            
            <FeatureList>
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </FeatureList>
            
            <UpgradeButton
              featured={plan.id === 'premium'}
              disabled={upgrading}
              onClick={() => handleUpgrade(plan.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {upgrading && selectedPlan === plan.id ? (
                <>
                  <span>🔄</span> Processando...
                </>
              ) : (
                <>
                  <span>🚀</span> Escolher {plan.name}
                </>
              )}
            </UpgradeButton>
          </PlanCard>
        ))}
      </PlansGrid>

      {/* Resultado do Upgrade */}
      <AnimatePresence>
        {upgradeResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              background: upgradeResult.success 
                ? 'linear-gradient(45deg, #4CAF50, #45a049)' 
                : 'linear-gradient(45deg, #f44336, #d32f2f)',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              margin: '20px 0',
              color: 'white'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>
              {upgradeResult.success ? '🎉' : '❌'}
            </div>
            <h3>{upgradeResult.message}</h3>
            {upgradeResult.success && (
              <p>Você agora tem acesso a todos os recursos premium!</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Depoimentos */}
      <div style={{ margin: '40px 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
          💬 O que nossos usuários dizem
        </h2>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index}>
            <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>
              "{testimonial.text}"
            </p>
            <div style={{ textAlign: 'right' }}>
              <strong>{testimonial.name}</strong>
              <br />
              <small style={{ opacity: 0.8 }}>{testimonial.role}</small>
            </div>
          </TestimonialCard>
        ))}
      </div>

      {/* Garantia */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '25px',
        borderRadius: '15px',
        textAlign: 'center',
        margin: '30px 0'
      }}>
        <h3>🛡️ Garantia de 30 dias</h3>
        <p>
          Não ficou satisfeito? Oferecemos reembolso completo em até 30 dias, 
          sem perguntas. Sua satisfação é nossa prioridade.
        </p>
      </div>

      {/* Segurança */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.1)',
        padding: '20px',
        borderRadius: '10px',
        fontSize: '12px',
        opacity: 0.8,
        textAlign: 'center'
      }}>
        <p>
          🔒 Seus dados estão seguros. Utilizamos criptografia de nível bancário 
          e seguimos rigorosamente a LGPD. Nunca compartilhamos informações pessoais.
        </p>
      </div>

      {/* Botão Fechar */}
      {onClose && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '10px 30px',
              borderRadius: '25px',
              cursor: 'pointer'
            }}
          >
            Talvez mais tarde
          </button>
        </div>
      )}
    </UpgradeContainer>
  );
};

export default PremiumUpgradeInterface;
