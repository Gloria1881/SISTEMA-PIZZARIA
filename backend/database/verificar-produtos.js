const db = require('./database-connection');

const verificarProdutos = async () => {
  try {
    console.log('🔍 Verificando produtos no banco...\n');
    
    // Contar total de produtos
    const total = await db.getAsync('SELECT COUNT(*) as count FROM produtos');
    console.log('📊 Total de produtos:', total.count);
    
    // Contar produtos disponíveis
    const disponiveis = await db.getAsync('SELECT COUNT(*) as count FROM produtos WHERE disponivel = 1');
    console.log('✅ Produtos disponíveis:', disponiveis.count);
    
    // Contar produtos indisponíveis
    const indisponiveis = await db.getAsync('SELECT COUNT(*) as count FROM produtos WHERE disponivel = 0');
    console.log('❌ Produtos indisponíveis:', indisponiveis.count);
    
    // Listar todos os produtos
    const produtos = await db.allAsync('SELECT id, nome, tipo, tamanho, preco, disponivel FROM produtos ORDER BY id');
    
    if (produtos.length > 0) {
      console.log('\n📋 Lista de produtos:\n');
      produtos.forEach(p => {
        const status = p.disponivel ? '✅' : '❌';
        console.log(`${status} ID: ${p.id} | ${p.tipo} | ${p.nome} (${p.tamanho}) - R$ ${p.preco.toFixed(2)}`);
      });
    } else {
      console.log('\n⚠️  Nenhum produto cadastrado no banco!');
      console.log('💡 Adicione produtos pela área admin ou execute: npm run init-db');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao verificar produtos:', error.message);
    process.exit(1);
  }
};

verificarProdutos();
