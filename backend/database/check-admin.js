const db = require('./database-connection');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const checkAndCreateAdmin = async () => {
  try {
    console.log('🔍 Verificando usuário admin...\n');
    
    const adminEmail = 'admin@pizzaria.com';
    const adminPassword = 'Pizzaria@2024';
    
    // Buscar admin
    const admin = await db.getAsync('SELECT * FROM usuarios WHERE email = ?', [adminEmail]);
    
    if (admin) {
      console.log('✅ Admin encontrado:');
      console.log('   ID:', admin.id);
      console.log('   Nome:', admin.nome);
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
      console.log('   Ativo:', admin.ativo ? 'Sim' : 'Não');
      
      // Atualizar senha
      const senhaHash = bcrypt.hashSync(adminPassword, 10);
      await db.runAsync(
        'UPDATE usuarios SET senha_hash = ?, ativo = 1 WHERE email = ?',
        [senhaHash, adminEmail]
      );
      console.log('\n✅ Senha atualizada para: Pizzaria@2024');
      
    } else {
      console.log('⚠️  Admin não encontrado. Criando...');
      
      const senhaHash = bcrypt.hashSync(adminPassword, 10);
      await db.runAsync(
        `INSERT INTO usuarios (nome, email, senha_hash, role, ativo) 
         VALUES (?, ?, ?, ?, ?)`,
        ['Administrador', adminEmail, senhaHash, 'admin', 1]
      );
      
      console.log('\n✅ Admin criado com sucesso!');
      console.log('   Email: admin@pizzaria.com');
      console.log('   Senha: Pizzaria@2024');
    }
    
    // Testar login
    console.log('\n🔐 Testando credenciais...');
    const testAdmin = await db.getAsync('SELECT * FROM usuarios WHERE email = ?', [adminEmail]);
    const senhaValida = bcrypt.compareSync(adminPassword, testAdmin.senha_hash);
    
    if (senhaValida) {
      console.log('✅ LOGIN FUNCIONANDO!\n');
      console.log('═══════════════════════════════════');
      console.log('   Email: admin@pizzaria.com');
      console.log('   Senha: Pizzaria@2024');
      console.log('═══════════════════════════════════\n');
    } else {
      console.log('❌ ERRO: Senha não confere!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
};

checkAndCreateAdmin();
