// Sistema de Autenticação Premium para Relatórios IA
// Gerencia acesso aos recursos avançados e planos de assinatura

import React, { createContext, useContext, useState, useEffect } from 'react';

const PremiumAuthContext = createContext();

export const usePremiumAuth = () => {
  const context = useContext(PremiumAuthContext);
  if (!context) {
    throw new Error('usePremiumAuth deve ser usado dentro de PremiumAuthProvider');
  }
  return context;
};

export const PremiumAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tipos de planos disponíveis
  const plans = {
    FREE: {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      features: [
        'Relatórios básicos',
        'Coleta de dados limitada',
        'Suporte por email',
        'Máximo 3 perfis de crianças'
      ],
      limits: {
        aiReports: 0,
        historicalData: 7, // dias
        exportPDF: false,
        detailedAnalytics: false,
        professionalInsights: false
      }
    },
    PREMIUM: {
      id: 'premium',
      name: 'Premium',
      price: 29.90,
      features: [
        'Relatórios avançados com IA',
        'Análise neuropedagógica completa',
        'Predições de desenvolvimento',
        'Suporte prioritário',
        'Até 10 perfis de crianças',
        'Exportação em PDF',
        'Insights para profissionais'
      ],
      limits: {
        aiReports: 10, // por mês
        historicalData: 90, // dias
        exportPDF: true,
        detailedAnalytics: true,
        professionalInsights: true
      }
    },
    PROFESSIONAL: {
      id: 'professional',
      name: 'Profissional',
      price: 89.90,
      features: [
        'Todos os recursos Premium',
        'Relatórios ilimitados com IA',
        'API para integração',
        'Dashboard multi-pacientes',
        'Suporte 24/7',
        'Perfis ilimitados',
        'Análise comparativa',
        'Certificações profissionais'
      ],
      limits: {
        aiReports: -1, // ilimitado
        historicalData: 365, // 1 ano
        exportPDF: true,
        detailedAnalytics: true,
        professionalInsights: true,
        apiAccess: true,
        multiPatient: true
      }
    }
  };

  useEffect(() => {
    loadUserSubscription();
  }, []);

  const loadUserSubscription = async () => {
    try {
      setLoading(true);
      
      // Verificar se há dados salvos localmente
      const savedAuth = localStorage.getItem('betina_premium_auth');
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        setUser(authData.user);
        setSubscription(authData.subscription);
      } else {
        // Por padrão, usuário começa com plano gratuito
        const defaultUser = {
          id: 'user_' + Date.now(),
          email: localStorage.getItem('betina_user_email') || 'user@example.com',
          name: localStorage.getItem('betina_user_name') || 'Usuário',
          createdAt: new Date().toISOString()
        };
        
        const defaultSubscription = {
          plan: 'FREE',
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: null,
          usageThisMonth: {
            aiReports: 0,
            dataExports: 0,
            lastReset: new Date().toISOString()
          }
        };
        
        setUser(defaultUser);
        setSubscription(defaultSubscription);
        
        saveAuthData(defaultUser, defaultSubscription);
      }
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAuthData = (userData, subscriptionData) => {
    localStorage.setItem('betina_premium_auth', JSON.stringify({
      user: userData,
      subscription: subscriptionData
    }));
  };

  const isPremiumUser = () => {
    return subscription && ['PREMIUM', 'PROFESSIONAL'].includes(subscription.plan);
  };

  const canAccessFeature = (feature) => {
    if (!subscription) return false;
    
    const currentPlan = plans[subscription.plan];
    if (!currentPlan) return false;

    switch (feature) {
      case 'ai_reports':
        if (currentPlan.limits.aiReports === -1) return true; // ilimitado
        return subscription.usageThisMonth.aiReports < currentPlan.limits.aiReports;
      
      case 'export_pdf':
        return currentPlan.limits.exportPDF;
      
      case 'detailed_analytics':
        return currentPlan.limits.detailedAnalytics;
      
      case 'professional_insights':
        return currentPlan.limits.professionalInsights;
      
      case 'api_access':
        return currentPlan.limits.apiAccess || false;
      
      case 'multi_patient':
        return currentPlan.limits.multiPatient || false;
      
      default:
        return false;
    }
  };

  const getUsageStatus = (feature) => {
    if (!subscription) return { used: 0, limit: 0, percentage: 0 };
    
    const currentPlan = plans[subscription.plan];
      switch (feature) {
      case 'ai_reports': {
        const limit = currentPlan.limits.aiReports;
        const used = subscription.usageThisMonth.aiReports;
        return {
          used,
          limit: limit === -1 ? 'Ilimitado' : limit,
          percentage: limit === -1 ? 0 : (used / limit) * 100,
          remaining: limit === -1 ? 'Ilimitado' : Math.max(0, limit - used)
        };
      }
      
      default:
        return { used: 0, limit: 0, percentage: 0 };
    }
  };

  const incrementUsage = async (feature) => {
    if (!subscription) return false;
    
    try {
      const newSubscription = { ...subscription };
      
      switch (feature) {
        case 'ai_reports':
          newSubscription.usageThisMonth.aiReports += 1;
          break;
        
        case 'data_exports':
          newSubscription.usageThisMonth.dataExports += 1;
          break;
      }
      
      setSubscription(newSubscription);
      saveAuthData(user, newSubscription);
      return true;
    } catch (error) {
      console.error('Erro ao incrementar uso:', error);
      return false;
    }
  };

  const upgradeToPremium = async (planId) => {
    try {
      // Simular processo de upgrade
      // Em produção, isso integraria com gateway de pagamento
      
      const newSubscription = {
        ...subscription,
        plan: planId.toUpperCase(),
        status: 'active',
        upgradeDate: new Date().toISOString(),
        usageThisMonth: {
          aiReports: 0,
          dataExports: 0,
          lastReset: new Date().toISOString()
        }
      };
      
      setSubscription(newSubscription);
      saveAuthData(user, newSubscription);
      
      return { success: true, message: 'Upgrade realizado com sucesso!' };
    } catch (error) {
      console.error('Erro no upgrade:', error);
      return { success: false, message: 'Erro ao processar upgrade' };
    }
  };

  const resetMonthlyUsage = () => {
    const now = new Date();
    const lastReset = new Date(subscription.usageThisMonth.lastReset);
    
    // Resetar se mudou o mês
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      const newSubscription = {
        ...subscription,
        usageThisMonth: {
          aiReports: 0,
          dataExports: 0,
          lastReset: now.toISOString()
        }
      };
      
      setSubscription(newSubscription);
      saveAuthData(user, newSubscription);
    }
  };

  const getCurrentPlan = () => {
    return subscription ? plans[subscription.plan] : plans.FREE;
  };

  const getUpgradeOptions = () => {
    const currentPlan = subscription?.plan || 'FREE';
    
    return Object.values(plans).filter(plan => {
      if (currentPlan === 'FREE') return plan.id !== 'free';
      if (currentPlan === 'PREMIUM') return plan.id === 'professional';
      return false;
    });
  };

  // Verificar e resetar uso mensal periodicamente
  useEffect(() => {
    if (subscription) {
      resetMonthlyUsage();
    }
  }, [subscription]);

  const contextValue = {
    user,
    subscription,
    loading,
    plans,
    isPremiumUser,
    canAccessFeature,
    getUsageStatus,
    incrementUsage,
    upgradeToPremium,
    getCurrentPlan,
    getUpgradeOptions,
    
    // Métodos de autenticação
    login: async (email, password) => {
      // Implementar lógica de login
      console.log('Login:', email);
    },
    
    logout: () => {
      setUser(null);
      setSubscription(null);
      localStorage.removeItem('betina_premium_auth');
    },
    
    register: async (userData) => {
      // Implementar lógica de registro
      console.log('Register:', userData);
    }
  };

  return (
    <PremiumAuthContext.Provider value={contextValue}>
      {children}
    </PremiumAuthContext.Provider>
  );
};

export default PremiumAuthProvider;
