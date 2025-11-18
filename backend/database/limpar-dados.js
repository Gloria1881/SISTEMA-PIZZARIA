const db = require('./database-connection');

const limparDados = async () => {
  try {
    console.log('🗑️  Limpando dados do sistema...\n');
    
    // Limpar itens de pedidos primeiro (por causa das foreign keys)
    await db.runAsync('DELETE FROM itens_pedido');
    console.log('✅ Itens de pedidos removidos');
    
    // Limpar pedidos
    await db.runAsync('DELETE FROM pedidos');
    console.log('✅ Pedidos removidos');
    
    // Limpar clientes
    await db.runAsync('DELETE FROM clientes');
    console.log('✅ Clientes removidos');
    
    // Resetar os IDs (auto-increment)
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name='clientes'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name='pedidos'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name='itens_pedido'");
    console.log('✅ IDs resetados');
    
    // Verificar contagem
    const clientesCount = await db.getAsync('SELECT COUNT(*) as count FROM clientes');
    const pedidosCount = await db.getAsync('SELECT COUNT(*) as count FROM pedidos');
    
    console.log('\n📊 Resultado:');
    console.log(`   Clientes: ${clientesCount.count}`);
    console.log(`   Pedidos: ${pedidosCount.count}`);
    
    console.log('\n🎉 Sistema limpo com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error.message);
    process.exit(1);
  }
};

limparDados();
