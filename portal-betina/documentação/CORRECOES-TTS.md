# Correções na Funcionalidade de Acessibilidade (TTS)

## Visão Geral

Este documento detalha as correções implementadas no sistema de Text-to-Speech (TTS) do Portal Betina para resolver os problemas de usabilidade e funcionamento reportados.

## Problemas Identificados

1. **Desativação do TTS não funcionando**: Os usuários não conseguiam desativar a funcionalidade de TTS através do painel de acessibilidade.
2. **Inconsistência de estado**: O estado do TTS ficava dessincronizado entre diferentes componentes.
3. **Falta de cancelamento de fala**: Ao desativar o TTS, falas em andamento continuavam sendo reproduzidas.
4. **Persistência incorreta de configurações**: As configurações não eram armazenadas corretamente no localStorage.

## Correções Implementadas

### 1. Gerenciamento de Estado TTS (`ttsManager.js`)

- Implementado sistema de armazenamento duplo para as configurações de TTS:
  - Chave específica para TTS (`betina_tts_enabled`)
  - Integração com configurações gerais de acessibilidade
- Melhorado o cancelamento de fala ao desativar o TTS
- Adicionado pequeno atraso antes de disparar eventos para garantir ordem correta de processamento

### 2. Hook do TTS (`useTTS.js`)

- Adicionada verificação dupla do estado do TTS (localStorage e estado local)
- Implementada sincronização periódica de estado para evitar inconsistências
- Melhorado o tratamento de eventos de configuração
- Adicionado registro de eventos para facilitar depuração
- Garantido cancelamento imediato da fala quando o TTS é desativado

### 3. Painel de Acessibilidade (`AccessibilityPanel.jsx`)

- Corrigido o gerenciamento de estado para alterações específicas do TTS
- Garantido persistência das configurações em múltiplos locais de armazenamento
- Melhorada a propagação de eventos para notificar outros componentes sobre mudanças

### 4. Painel de Debug (`TTSDebugPanel.jsx`)

- Adicionada verificação após alteração do estado para confirmar aplicação
- Melhorado registro de eventos de depuração
- Implementada verificação dupla para garantir que as alterações sejam aplicadas

### 5. Adições Gerais

- Adicionado modo de debug condicional no `App.jsx`
- Implementado sistema de log mais detalhado para facilitar depuração
- Adicionada verificação periódica do estado do TTS para evitar dessincronização

## Como Testar

1. **Verificação básica**: Abra o painel de acessibilidade e ative/desative o TTS. As alterações devem ser aplicadas imediatamente.
2. **Teste de interrupção**: Com o TTS ativado, inicie uma fala e depois desative o TTS. A fala deve ser interrompida imediatamente.
3. **Teste de persistência**: Faça alterações, feche o navegador e reabra. As configurações devem ser mantidas.
4. **Teste de compatibilidade**: Verifique se o TTS funciona corretamente em todas as atividades do portal.

## Próximos Passos

1. Considerar implementar um sistema de fallback para navegadores sem suporte a SpeechSynthesis
2. Adicionar opções para personalização da voz (velocidade, tom)
3. Implementar um sistema de filas para textos longos
4. Adicionar notificação visual quando o TTS estiver falando

## Informações para Depuração

Se surgirem novos problemas, ative o painel de debug adicionando `?debug=true` à URL do portal ou use o modo de desenvolvimento onde o painel de debug é exibido automaticamente.
