const db = require('./database-connection');

const initDatabase = async () => {
  console.log('📦 Inicializando banco de dados...');

  // Criar tabelas
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      senha_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'funcionario',
      ativo BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(100) NOT NULL,
      data_nascimento DATE,
      email VARCHAR(100),
      telefone VARCHAR(20) NOT NULL,
      endereco TEXT,
      cep VARCHAR(10),
      ativo BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo VARCHAR(50) NOT NULL,
      nome VARCHAR(100) NOT NULL,
      descricao TEXT,
      preco DECIMAL(10, 2) NOT NULL,
      tamanho VARCHAR(10),
      disponivel BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      status VARCHAR(20) DEFAULT 'pendente',
      valor_total DECIMAL(10, 2) NOT NULL,
      forma_pagamento VARCHAR(50) NOT NULL,
      observacoes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
    )
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS itens_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      produto_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL,
      preco_unitario DECIMAL(10, 2) NOT NULL,
      subtotal DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
      FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
    )
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS promocoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo VARCHAR(100) NOT NULL,
      descricao TEXT,
      desconto_percentual DECIMAL(5, 2),
      data_inicio DATE NOT NULL,
      data_fim DATE NOT NULL,
      ativo BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Criar índices
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes(telefone)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_produtos_tipo ON produtos(tipo)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status)');
  await db.runAsync('CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos(created_at)');

  console.log('✅ Tabelas criadas com sucesso!');

  // Criar usuário admin usando variáveis de ambiente
  const bcrypt = require('bcryptjs');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pizzaria.com';
  const adminPassword = process.env.ADMIN_PASSWORD || require('crypto').randomBytes(8).toString('hex');
  
  const adminExists = await db.getAsync('SELECT id FROM usuarios WHERE email = ?', [adminEmail]);
  
  if (!adminExists) {
    const senhaHash = bcrypt.hashSync(adminPassword, 10);
    
    await db.runAsync(`
      INSERT INTO usuarios (nome, email, senha_hash, role)
      VALUES (?, ?, ?, ?)
    `, ['Administrador', adminEmail, senhaHash, 'admin']);
    
    console.log('✅ Administrador criado com credenciais do arquivo .env');
  }

  await insertSampleData();
};

const insertSampleData = async () => {
  const clienteCount = await db.getAsync('SELECT COUNT(*) as count FROM clientes');
  
  if (clienteCount.count > 0) {
    console.log('ℹ️  Dados de exemplo já existem');
    return;
  }

  console.log('📝 Inserindo dados de exemplo...');

  // Clientes
  await db.runAsync('INSERT INTO clientes (nome, data_nascimento, email, telefone, endereco, cep) VALUES (?, ?, ?, ?, ?, ?)',
    ['João Silva', '1990-05-15', 'joao@email.com', '(11) 98765-4321', 'Rua das Flores, 123', '01234-567']);
  await db.runAsync('INSERT INTO clientes (nome, data_nascimento, email, telefone, endereco, cep) VALUES (?, ?, ?, ?, ?, ?)',
    ['Maria Santos', '1985-08-22', 'maria@email.com', '(11) 91234-5678', 'Av. Principal, 456', '02345-678']);
  await db.runAsync('INSERT INTO clientes (nome, data_nascimento, email, telefone, endereco, cep) VALUES (?, ?, ?, ?, ?, ?)',
    ['Pedro Costa', '1995-12-10', 'pedro@email.com', '(11) 99876-5432', 'Rua do Centro, 789', '03456-789']);

  // Produtos
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Pizza Tradicional', 'Calabresa', 'Calabresa, cebola e azeitonas', 45.00, 'G', 1]);
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Pizza Tradicional', 'Mussarela', 'Mussarela e tomate', 40.00, 'G', 1]);
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Pizza Especial', 'Portuguesa', 'Presunto, ovo, cebola, ervilha e azeitonas', 52.00, 'G', 1]);
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Pizza Especial', 'Margherita', 'Mussarela, tomate e manjericão', 48.00, 'G', 1]);
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Pizza Especial', '4 Queijos', 'Mussarela, provolone, parmesão e gorgonzola', 55.00, 'G', 1]);
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Bebida', 'Refrigerante 2L', 'Coca-Cola, Guaraná ou Fanta', 10.00, '2L', 1]);
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Bebida', 'Suco Natural 1L', 'Laranja, limão ou morango', 12.00, '1L', 1]);
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Bebida', 'Água Mineral', 'Com ou sem gás', 4.00, '500ml', 1]);
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Porções', 'Batata Frita', 'Porção grande de batatas fritas', 20.00, 'Grande', 1]);
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Porções', 'Calabresa Acebolada', 'Calabresa com cebola grelhada', 28.00, 'Grande', 1]);
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Sobremesa', 'Brownie', 'Brownie de chocolate com sorvete', 15.00, 'Único', 1]);
  await db.runAsync('INSERT INTO produtos (tipo, nome, descricao, preco, tamanho, disponivel) VALUES (?, ?, ?, ?, ?, ?)',
    ['Sobremesa', 'Pudim', 'Pudim de leite condensado', 12.00, 'Único', 1]);

  console.log('✅ Dados de exemplo inseridos!');
};

// Executar se chamado diretamente
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('\n🎉 Banco de dados inicializado com sucesso!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Erro ao inicializar banco:', err);
      process.exit(1);
    });
}

module.exports = initDatabase;
