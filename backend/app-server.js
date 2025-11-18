/**
 * ============================================================================
 * SISTEMA PIZZARIA - SERVIDOR BACKEND
 * ============================================================================
 * 
 * Servidor principal da API REST do sistema de gestão de pizzaria.
 * 
 * Funcionalidades:
 * - Autenticação JWT com bcrypt
 * - CRUD de clientes, produtos e pedidos
 * - Relatórios e dashboard
 * - Geração automática de comprovantes
 * - Reset automático de pedidos à meia-noite
 * 
 * Segurança:
 * - Helmet para proteção de headers
 * - CORS configurado
 * - Rate limiting (100 req/15min geral, 5 req/15min login)
 * - Validação de dados com express-validator
 * 
 * Tecnologias:
 * - Node.js + Express
 * - SQLite3 (banco de dados)
 * - JWT (autenticação)
 * - node-cron (agendamento)
 */

require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// ===== IMPORTAR ROTAS =====
const authRoutes = require('./routes/route-auth');           // Rotas de autenticação (login/register)
const clientesRoutes = require('./routes/route-clientes');   // CRUD de clientes
const produtosRoutes = require('./routes/route-produtos');   // CRUD de produtos
const pedidosRoutes = require('./routes/route-pedidos');     // CRUD de pedidos + comprovantes
const relatoriosRoutes = require('./routes/route-relatorios'); // Dashboard e relatórios

// ===== IMPORTAR SCHEDULER =====
// Agendador que reseta pedidos e gera comprovantes automaticamente à meia-noite
// DESATIVADO: Descomente as linhas abaixo se quiser reset automático diário
// const { iniciarAgendamento } = require('./scheduler/scheduler-reset-pedidos');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARES DE SEGURANÇA =====

// Helmet - Adiciona headers HTTP de segurança (proteção contra XSS, clickjacking, etc)
app.use(helmet());

// CORS - Permite requisições cross-origin do frontend
// IMPORTANTE: Em produção, defina FRONTEND_URL no .env
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true // Permite envio de cookies
}));

// Rate Limiting - Previne ataques DDoS limitando requisições por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: 500, // Máximo 500 requisições por IP nesta janela (aumentado para desenvolvimento)
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use('/api/', limiter);

// Rate limiting MAIS RESTRITIVO para rotas de autenticação
// Previne ataques de força bruta em tentativas de login
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 tentativas de login em 15 minutos (aumentado para desenvolvimento)
  message: 'Muitas tentativas de login, tente novamente em 15 minutos.'
});
app.use('/api/auth/login', authLimiter);

// Rate limiting RESTRITIVO para pedidos públicos
// Previne spam de pedidos falsos e ataques de DoS
const publicOrderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // Janela de 1 hora
  max: 5, // Máximo 5 pedidos por IP por hora
  message: 'Limite de pedidos atingido. Tente novamente em 1 hora.'
});
app.use('/api/pedidos/publico', publicOrderLimiter);

// Parsear requisições JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger de requisições HTTP no console (apenas em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // Formato: GET /api/produtos 200 15.234 ms
}

// ===== ROTAS DA API =====

// Rota de health check - verifica se a API está online
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API Pizzaria está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Registrar rotas da API
app.use('/api/auth', authRoutes);           // POST /api/auth/login, /api/auth/register
app.use('/api/clientes', clientesRoutes);   // CRUD /api/clientes (protegido)
app.use('/api/produtos', produtosRoutes);   // CRUD /api/produtos (GET /publico é público)
app.use('/api/pedidos', pedidosRoutes);     // CRUD /api/pedidos (POST /publico é público)
app.use('/api/relatorios', relatoriosRoutes); // GET /api/relatorios/dashboard, /vendas

// Rota 404 - captura qualquer rota não definida
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.path
  });
});

// ===== MIDDLEWARE DE ERRO GLOBAL =====
// Captura todos os erros não tratados e retorna resposta JSON padronizada
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    // Mostra stack trace apenas em desenvolvimento (nunca em produção)
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ===== INICIAR SERVIDOR =====

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   🍕 Sistema Pizzaria - API REST Server       ║
║                                                ║
║   🚀 Servidor rodando na porta ${PORT}           ║
║   🌍 http://localhost:${PORT}                    ║
║   📊 Health Check: /api/health                 ║
║   🔒 Ambiente: ${process.env.NODE_ENV || 'development'}            ║
╚════════════════════════════════════════════════╝
  `);
  
  // Iniciar agendamento de limpeza automática de pedidos à meia-noite
  // Gera comprovantes TXT antes de deletar e reseta IDs
  // DESATIVADO: Descomente a linha abaixo se quiser reset automático diário
  // iniciarAgendamento();
});

// Exporta app para testes unitários
module.exports = app;
