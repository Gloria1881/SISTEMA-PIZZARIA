const db = require('./database-connection');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const updateAdminPassword = async () => {
  try {
    console.log('🔄 Atualizando senha do administrador...');
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pizzaria.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Verificar se o admin existe
    const adminExists = await db.getAsync('SELECT id FROM usuarios WHERE email = ?', [adminEmail]);
    
    if (adminExists) {
      // Atualizar senha
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.runAsync(
        'UPDATE usuarios SET senha_hash = ? WHERE email = ?',
        [hashedPassword, adminEmail]
      );
      console.log('\n✅ Senha do administrador atualizada com sucesso!');
    } else {
      // Criar admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.runAsync(`
        INSERT INTO usuarios (nome, email, senha_hash, role)
        VALUES (?, ?, ?, ?)
      `, ['Administrador', adminEmail, hashedPassword, 'admin']);
      console.log('\n✅ Administrador criado com sucesso!');
    }
    
    console.log('⚠️  Credenciais configuradas via arquivo .env\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error);
    process.exit(1);
  }
};

updateAdminPassword();
