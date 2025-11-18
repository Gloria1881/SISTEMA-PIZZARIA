const db = require('./connection');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const resetDatabase = async () => {
  try {
    console.log('🔄 Resetando banco de dados...');
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pizzaria.com';
    const adminPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(8).toString('hex');
    
    // Deletar todos os dados (exceto usuário admin)
    await db.runAsync('DELETE FROM itens_pedido');
    await db.runAsync('DELETE FROM pedidos');
    await db.runAsync('DELETE FROM clientes');
    await db.runAsync('DELETE FROM produtos');
    await db.runAsync('DELETE FROM promocoes');
    await db.runAsync(`DELETE FROM usuarios WHERE email != ?`, [adminEmail]);
    
    console.log('✅ Dados deletados');
    
    // Resetar autoincrement para todas as tabelas
    await db.runAsync(`DELETE FROM sqlite_sequence WHERE name='clientes'`);
    await db.runAsync(`DELETE FROM sqlite_sequence WHERE name='produtos'`);
    await db.runAsync(`DELETE FROM sqlite_sequence WHERE name='pedidos'`);
    await db.runAsync(`DELETE FROM sqlite_sequence WHERE name='itens_pedido'`);
    await db.runAsync(`DELETE FROM sqlite_sequence WHERE name='promocoes'`);
    
    console.log('✅ Contadores de ID resetados para zero');
    
    // Resetar senha do admin para a senha configurada no .env
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await db.runAsync(
      'UPDATE usuarios SET senha_hash = ? WHERE email = ?',
      [hashedPassword, adminEmail]
    );
    
    console.log('✅ Banco de dados resetado com sucesso!');
    console.log('📊 Próximos cadastros começarão com ID #1');
    console.log('🔑 Senha do admin resetada conforme arquivo .env');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar banco:', error);
    process.exit(1);
  }
};

resetDatabase();
