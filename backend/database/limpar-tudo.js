const db = require('./database-connection');

const limparTudo = async () => {
  try {
    console.log('🗑️  Limpando TODA a área admin...\n');
    
    // Limpar itens de pedidos primeiro (foreign keys)
    await db.runAsync('DELETE FROM itens_pedido');
    console.log('✅ Itens de pedidos removidos');
    
    // Limpar pedidos
    await db.runAsync('DELETE FROM pedidos');
    console.log('✅ Pedidos removidos');
    
    // Limpar clientes
    await db.runAsync('DELETE FROM clientes');
    console.log('✅ Clientes removidos');
    
    // Limpar produtos
    await db.runAsync('DELETE FROM produtos');
    console.log('✅ Produtos removidos');
    
    // Resetar os IDs (auto-increment)
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name='clientes'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name='pedidos'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name='itens_pedido'");
    await db.runAsync("DELETE FROM sqlite_sequence WHERE name='produtos'");
    console.log('✅ IDs resetados');
    
    // Verificar contagem
    const clientesCount = await db.getAsync('SELECT COUNT(*) as count FROM clientes');
    const pedidosCount = await db.getAsync('SELECT COUNT(*) as count FROM pedidos');
    const produtosCount = await db.getAsync('SELECT COUNT(*) as count FROM produtos');
    
    console.log('\n📊 Resultado:');
    console.log(`   Clientes: ${clientesCount.count}`);
    console.log(`   Pedidos: ${pedidosCount.count}`);
    console.log(`   Produtos: ${produtosCount.count}`);
    
    console.log('\n🎉 Área admin completamente limpa!');
    console.log('⚠️  AVISO: Você precisará adicionar produtos novamente');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error.message);
    process.exit(1);
  }
};

limparTudo();
