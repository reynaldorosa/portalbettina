/**
 * CONTAINER PRINCIPAL DOS DASHBOARDS
 * Controla acesso e exibe dashboards baseado na assinatura do usuário
 */

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PerformanceDashboard,
  AdvancedAIReport,
  NeuropedagogicalDashboard,
  MultisensoryMetricsDashboard,
  IntegratedSystemDashboard,
  DASHBOARD_CONFIG,
  DASHBOARD_ORDER,
  getDashboardsByAccess,
  isPremiumDashboard,
} from './index.js'

const DashboardWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`

const TabNavigation = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 2px;
  }
`

const TabButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  position: relative;
  transition: all 0.3s ease;

  ${(props) =>
    props.isActive
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  `
      : `
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    border: 1px solid rgba(102, 126, 234, 0.2);
  `}

  ${(props) =>
    props.isPremium && !props.hasAccess
      ? `
    opacity: 0.6;
    cursor: not-allowed;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #333;
  `
      : ''}
  
  &:hover {
    ${(props) =>
      !props.isPremium || props.hasAccess
        ? `
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    `
        : ''}
  }
`

const PremiumBadge = styled.span`
  background: linear-gradient(45deg, #ffd700, #ffa500);
  color: #333;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: bold;
  margin-left: 5px;
`

const PremiumBlocker = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const PremiumModal = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  color: white;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`

const DashboardContent = styled.div`
  min-height: 600px;
`

const DashboardContainer = ({
  userId,
  userSubscription = 'free', // 'free', 'premium'
  onSubscriptionNeeded,
}) => {
  const [activeTab, setActiveTab] = useState('performance')
  const [showPremiumModal, setShowPremiumModal] = useState(false)

  const hasAccess = userSubscription === 'premium'
  const availableDashboards = getDashboardsByAccess(userSubscription)

  // Verificar se o dashboard ativo é acessível
  useEffect(() => {
    if (isPremiumDashboard(activeTab) && !hasAccess) {
      setActiveTab('performance') // Voltar para o dashboard público
    }
  }, [activeTab, hasAccess])

  const handleTabClick = (dashboardKey) => {
    const config = DASHBOARD_CONFIG[dashboardKey]

    if (config.access === 'premium' && !hasAccess) {
      setShowPremiumModal(true)
      return
    }

    setActiveTab(dashboardKey)
  }

  const renderDashboard = () => {
    const props = { userId, sessionId: null, timeRange: '30d' }

    switch (activeTab) {
      case 'performance':
        return <PerformanceDashboard {...props} />
      case 'relatorioA':
        return <AdvancedAIReport {...props} />
      case 'neuropedagogical':
        return <NeuropedagogicalDashboard {...props} />
      case 'multisensory':
        return <MultisensoryMetricsDashboard {...props} />
      case 'integrated':
        return <IntegratedSystemDashboard {...props} />
      default:
        return <PerformanceDashboard {...props} />
    }
  }

  return (
    <DashboardWrapper>
      <TabNavigation>
        {DASHBOARD_ORDER.map((dashboardKey) => {
          const config = DASHBOARD_CONFIG[dashboardKey]
          const isPremium = config.access === 'premium'
          const isActive = activeTab === dashboardKey

          return (
            <TabButton
              key={dashboardKey}
              isActive={isActive}
              isPremium={isPremium}
              hasAccess={hasAccess}
              onClick={() => handleTabClick(dashboardKey)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{config.icon}</span>
              <span>{config.title}</span>
              {isPremium && <PremiumBadge>PREMIUM</PremiumBadge>}
            </TabButton>
          )
        })}
      </TabNavigation>

      <DashboardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderDashboard()}
          </motion.div>
        </AnimatePresence>
      </DashboardContent>

      <AnimatePresence>
        {showPremiumModal && (
          <PremiumBlocker
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PremiumModal>
                <h2>🌟 Recurso Premium</h2>
                <p style={{ margin: '20px 0', lineHeight: 1.6 }}>
                  Este dashboard faz parte dos recursos premium do Portal Betina. Tenha acesso a
                  análises avançadas com IA, relatórios terapêuticos detalhados e insights
                  personalizados para potencializar o desenvolvimento.
                </p>

                <div style={{ marginBottom: '30px' }}>
                  <h3>💎 Recursos Premium Incluem:</h3>
                  <ul style={{ textAlign: 'left', maxWidth: '300px', margin: '15px auto' }}>
                    <li>🤖 Análise com Inteligência Artificial</li>
                    <li>🧠 Relatórios neuropedagógicos detalhados</li>
                    <li>🎨 Métricas multissensoriais avançadas</li>
                    <li>📊 Sistema integrado completo</li>
                    <li>📱 Suporte prioritário</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      setShowPremiumModal(false)
                      onSubscriptionNeeded && onSubscriptionNeeded()
                    }}
                    style={{
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      color: '#333',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    🚀 Upgrade para Premium
                  </button>

                  <button
                    onClick={() => setShowPremiumModal(false)}
                    style={{
                      background: 'transparent',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '12px 24px',
                      borderRadius: '25px',
                      cursor: 'pointer',
                    }}
                  >
                    Fechar
                  </button>
                </div>
              </PremiumModal>
            </motion.div>
          </PremiumBlocker>
        )}
      </AnimatePresence>
    </DashboardWrapper>
  )
}

export default DashboardContainer
