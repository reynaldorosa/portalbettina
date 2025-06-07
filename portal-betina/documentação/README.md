# 🌈 Portal Betina

Um portal gratuito e aberto de atividades neuropedagógicas para crianças com autismo, TDAH e outras necessidades cognitivas. Agora com suporte a Machine Learning adaptativo e banco de dados PostgreSQL para melhor acompanhamento do progresso.

## 🎯 Objetivo

O Portal Betina foi criado com amor para oferecer atividades terapêuticas e educacionais que podem ser realizadas em casa, com supervisão dos pais, usando celular ou tablet. O objetivo é complementar tratamentos profissionais e promover o desenvolvimento cognitivo de forma lúdica e acessível.

## 🚀 Modos de Execução

- **Modo Padrão**: Execução simples com armazenamento local - [Ver GUIA-WINDOWS.md](./GUIA-WINDOWS.md)
- **Modo Docker**: Execução com banco de dados PostgreSQL - [Ver GUIA-DOCKER.md](./GUIA-DOCKER.md)

### 📊 Recursos do Modo Docker

- **Banco de Dados PostgreSQL**: Armazenamento persistente de todos os dados de progresso
- **Machine Learning Adaptativo**: Sistema de aprendizado personalizado avançado
- **Relatórios de Progresso**: Acompanhamento detalhado do desenvolvimento da criança
- **Multi-Usuário**: Suporte a múltiplos perfis de crianças (em desenvolvimento)

### 🔧 Scripts de Inicialização

- **iniciar-portal.bat**: Inicia no modo padrão (armazenamento local)
- **iniciar-docker.bat**: Inicia no modo Docker com banco de dados
- **testar-docker.bat**: Verifica se o Docker está configurado corretamente
- **iniciar-com-postgres.bat**: Para usuários com PostgreSQL local instalado

## 👥 Público-Alvo

- **Crianças (2-12 anos)** com:
  - Autismo (TEA)
  - TDAH 
  - Deficiências intelectuais
  - Dificuldades de aprendizagem
  - Atrasos no desenvolvimento

- **Pais e cuidadores** buscando ferramentas para apoiar o desenvolvimento

- **Terapeutas e educadores** como ferramenta complementar

## ✨ Funcionalidades Atuais

### 🧠 Jogo da Memória
- Encontre pares iguais de emojis
- Diferentes níveis de dificuldade
- Exercita memória e concentração

### 🌈 Combinar Cores
- Associe objetos com suas cores
- Reconhecimento de cores básicas
- Classificação e organização visual

### 🧩 Associação de Imagens
- Combine itens relacionados logicamente
- Desenvolve raciocínio associativo
- Múltiplas rodadas progressivas

## 🚀 Funcionalidades em Desenvolvimento

- 🎵 Sons e Música
- 🔢 Números Divertidos
- 😊 Reconhecer Emoções

## 🛠️ Tecnologias

- **React 18** - Interface reativa e componentizada
- **Vite** - Build tool rápido e moderno
- **Styled Components** - CSS-in-JS para estilos isolados
- **Framer Motion** - Animações suaves e interativas
- **PWA** - Funciona offline e pode ser "instalada"

## 📱 Características

- ✅ **100% Gratuito** - Sem login, sem pagamento
- ✅ **Responsivo** - Otimizado para celular e tablet
- ✅ **Acessível** - Seguindo diretrizes WCAG 2.1
- ✅ **Offline** - Funciona sem internet (PWA)
- ✅ **Leve** - Carregamento rápido mesmo com conexão ruim

## 🎨 Design Inclusivo

### Acessibilidade Visual
- Alto contraste (mínimo 4.5:1)
- Fontes grandes e legíveis (Fredoka)
- Cores não como única informação
- Ícones grandes para facilitar toque

### Acessibilidade Cognitiva
- Interface previsível e simples
- Poucos elementos por tela
- Feedback imediato e positivo
- Instruções claras e visuais

### Acessibilidade Motora
- Alvos de toque grandes (mínimo 44px)
- Gestos simples
- Sem necessidade de precisão extrema
- Tempo de resposta flexível

## 🏗️ Estrutura do Projeto

```
portal-betina/
├── public/                 # Arquivos públicos
│   ├── icons/             # Ícones do app
│   ├── images/            # Imagens das atividades
│   ├── sounds/            # Arquivos de áudio
│   └── manifest.json      # Configuração PWA
├── src/
│   ├── components/        # Componentes React
│   │   ├── common/        # Componentes reutilizáveis
│   │   ├── activities/    # Atividades específicas
│   │   └── navigation/    # Navegação e layout
│   ├── data/             # Dados em JSON
│   ├── hooks/            # Hooks customizados
│   ├── utils/            # Funções utilitárias
│   └── styles/           # Estilos globais
└── docs/                 # Documentação
```

## 🚀 Como Executar

1. **Clone o repositório:**
   ```bash
   git clone [url-do-repo]
   cd portal-betina
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute em desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Build para produção:**
   ```bash
   npm run build
   ```

## 📈 Como Adicionar Novas Atividades

1. **Crie o componente** em `src/components/activities/`
2. **Adicione aos dados** em `src/data/activities.json`
3. **Importe no App.jsx** e adicione ao switch
4. **Teste a acessibilidade** e responsividade

### Exemplo de Nova Atividade:

```jsx
// NovaAtividade.jsx
function NovaAtividade({ onBack }) {
  return (
    <GameContainer>
      <GameHeader>
        <GameTitle>🎯 Nova Atividade</GameTitle>
        <BackButton onClick={onBack}>⬅️ Voltar</BackButton>
      </GameHeader>
      {/* Conteúdo da atividade */}
    </GameContainer>
  )
}
```

## 💖 Sistema de Doações

O portal inclui um sistema transparente de doações via PIX para ajudar na manutenção do projeto e no tratamento da Betina. As doações são:

- ✅ **Totalmente opcionais** - o acesso é sempre gratuito
- ✅ **100% transparentes** - todo valor vai para o tratamento
- ✅ **Simples** - QR Code PIX integrado na interface

## 🤝 Como Contribuir

1. **Reporte bugs** ou sugira melhorias
2. **Compartilhe** com famílias que possam se beneficiar
3. **Contribua** com novas atividades ou melhorias
4. **Doe** se puder e quiser ajudar o projeto

## 📋 Diretrizes Pedagógicas

### Princípios Fundamentais:
- **Reforço positivo** constante
- **Progressão gradual** de dificuldade
- **Feedback imediato** e claro
- **Repetição** sem ser repetitivo
- **Autonomia** respeitando limitações

### Habilidades Trabalhadas:
- 🧠 **Memória** e concentração
- 🎨 **Percepção** visual e auditiva
- 🤲 **Coordenação** motora fina
- 🧩 **Raciocínio** lógico
- ❤️ **Inteligência** emocional

## 📄 Licença

Este projeto é **open source** e gratuito. Sinta-se livre para usar, modificar e distribuir, sempre mantendo o espírito de ajuda às crianças com necessidades especiais.

## 📞 Contato

- **Email:** portal.betina@exemplo.com
- **PIX:** portal.betina@exemplo.com

## 📊 Status Atual do Projeto

### ✅ Implementado e Funcional:
- **3 Atividades Principais**: Jogo da Memória, Combinar Cores, Associação de Imagens
- **Sistema de Progresso**: Pontuação, estrelas, estatísticas salvas localmente
- **Feedback Multissensorial**: Sons, vibração, feedback visual
- **Acessibilidade Completa**: Leitores de tela, alto contraste, navegação por teclado
- **PWA Funcional**: Pode ser instalado como app nativo
- **Design Responsivo**: Otimizado para mobile e tablet
- **QR Code de Doações**: Sistema PIX integrado

### 🔧 Últimas Melhorias (Junho 2025):
- **Hooks Personalizados**: `useSound` e `useProgress` totalmente integrados
- **Feedback Terapêutico**: Mensagens de encorajamento baseadas no desempenho
- **Integração de Acessibilidade**: Anúncios para leitores de tela, vibração tátil
- **Estatísticas Avançadas**: Precisão, tempo médio, sistema de estrelas
- **Logo Personalizado**: Identidade visual própria

### 🎯 Como Executar:
```bash
# Na pasta do projeto:
npm run dev
```
Acesse: `http://localhost:5173`

### 📱 Teste Rápido:
Abra o arquivo `teste-portal.html` no navegador para ver um preview do projeto.

## 💝 Impacto Social

Este projeto representa mais que código - é uma ferramenta de **inclusão digital** e **democratização do acesso** a recursos terapêuticos de qualidade. Cada linha de código foi pensada para:

- **Reduzir custos** de famílias com tratamentos caros
- **Aumentar acessibilidade** geográfica a atividades especializadas  
- **Empoderar pais** com ferramentas práticas e eficazes
- **Complementar tratamentos** profissionais de forma lúdica
- **Promover autonomia** das crianças em seu desenvolvimento

---

**Feito com 💖 para a Betina e todas as crianças especiais**

*"Cada criança é única e especial. Nossa missão é criar ferramentas que respeitem essa individualidade e promovam o desenvolvimento de forma lúdica e amorosa."*
