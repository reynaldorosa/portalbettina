import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Recursos de tradução
const resources = {
  pt: {
    translation: {
      // Navegação
      "nav.home": "Início",
      "nav.games": "Jogos",
      "nav.profile": "Perfil",
      "nav.reports": "Relatórios",
      "nav.settings": "Configurações",
      
      // Jogos
      "games.memory": "Jogo da Memória",
      "games.sequence": "Sequência Lógica",
      "games.colors": "Cores e Formas",
      "games.music": "Música Interativa",
      "games.paint": "Pintura Digital",
      
      // Interface
      "common.loading": "Carregando...",
      "common.error": "Erro",
      "common.retry": "Tentar novamente",
      "common.save": "Salvar",
      "common.cancel": "Cancelar",
      "common.confirm": "Confirmar",
      
      // Mensagens
      "messages.welcome": "Bem-vindo ao Portal Betina!",
      "messages.gameCompleted": "Jogo concluído com sucesso!",
      "messages.profileSaved": "Perfil salvo com sucesso!",
    }
  },
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.games": "Games",
      "nav.profile": "Profile",
      "nav.reports": "Reports",
      "nav.settings": "Settings",
      
      // Games
      "games.memory": "Memory Game",
      "games.sequence": "Logic Sequence",
      "games.colors": "Colors and Shapes",
      "games.music": "Interactive Music",
      "games.paint": "Digital Paint",
      
      // Interface
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.retry": "Try again",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.confirm": "Confirm",
      
      // Messages
      "messages.welcome": "Welcome to Portal Betina!",
      "messages.gameCompleted": "Game completed successfully!",
      "messages.profileSaved": "Profile saved successfully!",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // idioma padrão
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
