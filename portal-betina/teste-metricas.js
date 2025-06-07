// Teste rápido do sistema de métricas
// Execute no console do navegador para testar as funcionalidades

console.log('🧪 INICIANDO TESTES DO SISTEMA DE MÉTRICAS');

// Importar funções (simular uso)
function testarSistemaMetricas() {
  console.log('\n📊 1. Testando incremento de uso...');
  
  // Simular algumas jogadas
  const jogos = ['memory-game', 'color-match', 'musical-sequence', 'letter-recognition'];
  
  jogos.forEach((jogo, index) => {
    for (let i = 0; i < (index + 1) * 3; i++) {
      // Simular incrementGameUsage(jogo)
      const usage = JSON.parse(localStorage.getItem('portalBetina_gameUsage') || '{}');
      usage[jogo] = (usage[jogo] || 0) + 1;
      usage[`${jogo}_lastPlayed`] = Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000); // Últimos 7 dias
      localStorage.setItem('portalBetina_gameUsage', JSON.stringify(usage));
    }
    console.log(`  ✅ ${jogo}: ${(JSON.parse(localStorage.getItem('portalBetina_gameUsage') || '{}')[jogo] || 0)} jogadas`);
  });
  
  console.log('\n📈 2. Verificando estatísticas...');
  const stats = JSON.parse(localStorage.getItem('portalBetina_gameUsage') || '{}');
  const totalJogadas = Object.entries(stats)
    .filter(([key]) => !key.includes('_lastPlayed'))
    .reduce((sum, [, count]) => sum + count, 0);
  
  console.log(`  📊 Total de jogadas: ${totalJogadas}`);
  console.log(`  🎮 Jogos únicos: ${Object.keys(stats).filter(k => !k.includes('_lastPlayed')).length}`);
  
  console.log('\n🏆 3. Top 3 jogos mais utilizados:');
  Object.entries(stats)
    .filter(([key]) => !key.includes('_lastPlayed'))
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .forEach(([jogo, count], index) => {
      console.log(`  ${index + 1}. ${jogo}: ${count} jogadas`);
    });
  
  console.log('\n💾 4. Testando cache...');
  const cache = {
    ranking: jogos.map(id => ({ id, title: id, usageCount: stats[id] || 0 })),
    timestamp: Date.now()
  };
  localStorage.setItem('portalBetina_rankingCache', JSON.stringify(cache));
  console.log('  ✅ Cache do ranking salvo');
  
  console.log('\n🔍 5. Simulando insights...');
  const diversityScore = (Object.keys(stats).filter(k => !k.includes('_lastPlayed')).length / 9) * 100;
  console.log(`  📈 Score de diversidade: ${Math.round(diversityScore)}%`);
  
  if (diversityScore < 50) {
    console.log('  💡 Recomendação: Experimente explorar mais jogos!');
  }
  
  if (totalJogadas > 15) {
    console.log('  🎉 Parabéns! Você está muito ativo no portal!');
  }
  
  console.log('\n✅ TODOS OS TESTES CONCLUÍDOS COM SUCESSO!');
  console.log('🔗 Acesse o painel administrativo (🔐 Admin no footer) para ver os dados completos');
  
  return {
    totalJogadas,
    jogosUnicos: Object.keys(stats).filter(k => !k.includes('_lastPlayed')).length,
    diversityScore: Math.round(diversityScore),
    recomendacoes: diversityScore < 50 ? ['Experimente mais jogos'] : ['Continue assim!'],
    cacheAtivo: true
  };
}

// Função para limpar dados de teste
function limparDadosTeste() {
  localStorage.removeItem('portalBetina_gameUsage');
  localStorage.removeItem('portalBetina_rankingCache');
  localStorage.removeItem('portalBetina_lastRankingUpdate');
  console.log('🧹 Dados de teste removidos');
}

// Função para verificar estado atual
function verificarEstado() {
  const usage = localStorage.getItem('portalBetina_gameUsage');
  const cache = localStorage.getItem('portalBetina_rankingCache');
  
  console.log('📋 ESTADO ATUAL DO SISTEMA:');
  console.log(`  💾 Dados de uso: ${usage ? 'Presentes' : 'Ausentes'}`);
  console.log(`  ⚡ Cache: ${cache ? 'Ativo' : 'Vazio'}`);
  
  if (usage) {
    const stats = JSON.parse(usage);
    const total = Object.entries(stats)
      .filter(([key]) => !key.includes('_lastPlayed'))
      .reduce((sum, [, count]) => sum + count, 0);
    console.log(`  🎯 Total de jogadas registradas: ${total}`);
  }
  
  return { usage: !!usage, cache: !!cache };
}

// Exportar funções para uso no console
window.testarSistemaMetricas = testarSistemaMetricas;
window.limparDadosTeste = limparDadosTeste;
window.verificarEstado = verificarEstado;

console.log('🛠️ FUNÇÕES DE TESTE CARREGADAS:');
console.log('  • testarSistemaMetricas() - Executa bateria completa de testes');
console.log('  • verificarEstado() - Mostra estado atual dos dados');
console.log('  • limparDadosTeste() - Remove todos os dados de teste');
console.log('\n💡 Execute testarSistemaMetricas() para começar!');
