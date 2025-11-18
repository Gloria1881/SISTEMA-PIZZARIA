# 🍕 Sistema de Gestão de Pizzaria

Sistema completo de gestão para pizzarias com painel administrativo e interface de pedidos online para clientes.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Índice

- [Sobre o Sistema](#-sobre-o-sistema)
- [Funcionalidades](#-funcionalidades)
- [Requisitos](#-requisitos)
- [Instalação Rápida](#-instalação-rápida)
- [Configuração](#-configuração)
- [Executando o Sistema](#-executando-o-sistema)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Segurança](#-segurança)
- [API Endpoints](#-api-endpoints)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Sobre o Sistema

Sistema web moderno e completo para gestão de pizzarias que oferece:

- **Painel Administrativo**: Gerenciamento completo de pedidos, clientes, produtos e relatórios
- **Interface Pública de Pedidos**: Página otimizada para clientes fazerem pedidos online com validação visual
- **Sistema Offline**: Pedidos são salvos localmente e sincronizados automaticamente quando a conexão voltar
- **Autenticação JWT**: Sistema seguro de login com tokens
- **Banco de Dados SQLite**: Leve e sem necessidade de servidor externo
- **Validação Inteligente**: Campos obrigatórios são destacados visualmente em vermelho
- **Integração ViaCEP**: Preenchimento automático de endereço pelo CEP
- **Proteção contra Abuso**: Rate limiting configurado (500 requisições/15min)

---

## ✨ Funcionalidades

### Painel Administrativo
- ✅ Dashboard com estatísticas em tempo real
- ✅ Gestão completa de clientes (CRUD)
- ✅ Gestão de produtos e cardápio (Pizza, Bebida, Porção, Sobremesa)
- ✅ Controle de pedidos com status e ordenação crescente
- ✅ Relatórios de vendas e produtos mais vendidos
- ✅ Sistema de autenticação e autorização JWT
- ✅ Interface responsiva e moderna

### Interface Pública de Pedidos
- ✅ Catálogo de produtos por categoria (Pizza, Bebida, Porção, Sobremesa)
- ✅ Filtros dinâmicos por tipo de produto
- ✅ Carrinho de compras interativo
- ✅ **Validação visual de campos obrigatórios** (borda vermelha em campos vazios)
- ✅ **Sistema offline** - pedidos salvos localmente e enviados automaticamente
- ✅ Validação de email e telefone com formatação automática
- ✅ Integração com ViaCEP para preenchimento automático de endereço
- ✅ Estimativa de tempo de preparo e entrega
- ✅ Múltiplas formas de pagamento (Dinheiro, Cartão, Pix)
- ✅ **Sem alertas intrusivos** - feedback visual em tempo real

### Recursos Técnicos Avançados
- ✅ **Sincronização offline** com localStorage e auto-sync
- ✅ **Rate limiting otimizado** (500 req/15min geral, 20 tentativas de login/15min)
- ✅ Validação de dados em backend e frontend
- ✅ Soft delete (dados preservados para auditoria)
- ✅ Logger personalizado seguro para produção
- ✅ Headers de segurança (Helmet)
- ✅ CORS configurado
- ✅ SQLite com modo WAL para melhor performance

---

## 📦 Requisitos

### Software Necessário

| Software | Versão Mínima | Versão Recomendada |
|----------|---------------|-------------------|
| Node.js  | 18.x          | 20.x ou superior  |
| npm      | 9.x           | 10.x ou superior  |
| Navegador| -             | Chrome, Firefox, Edge (última versão) |

### Sistema Operacional
- ✅ Windows 10/11
- ✅ macOS 11+
- ✅ Linux (Ubuntu 20.04+, Debian 11+)

### Hardware Mínimo
- **RAM**: 4 GB (8 GB recomendado)
- **Disco**: 2 GB livre
- **CPU**: Dual-core 2.0 GHz

---

## 🚀 Instalação Rápida

### Passo 1: Preparar o Ambiente

```bash
# Certifique-se de estar na pasta do projeto
cd C:\Users\Admin\Desktop\SISTEMA-PIZZARIA
```

### Passo 2: Instalar Dependências

```bash
# Instala todas as dependências (backend + frontend)
npm run setup
```

### Passo 3: Inicializar Banco de Dados

```bash
# Cria o banco de dados SQLite e usuário admin
npm run init-db
```

⚠️ **IMPORTANTE**: Anote a senha de administrador gerada!

### Passo 4: Executar o Sistema

```bash
# Inicia backend (porta 5000) e frontend (porta 3000)
npm run dev
```

**Pronto!** Acesse:
- **Admin**: http://localhost:3000/login
- **Pedidos Públicos**: http://localhost:3000/pedidos

---

## ⚙️ Configuração

### Arquivo .env (Backend)

O arquivo `.env` já vem pré-configurado com valores seguros:

```env
# Servidor
PORT=5000
NODE_ENV=development

# JWT (128 caracteres aleatórios)
JWT_SECRET=<valor_aleatorio_seguro>
JWT_EXPIRES_IN=8h

# Banco de Dados
DB_PATH=./backend/database/pizzaria.db

# Segurança
BCRYPT_ROUNDS=10

# CORS
FRONTEND_URL=http://localhost:3000
```

### Arquivo .env (Frontend)

Criado automaticamente em `frontend/.env`:

```env
SKIP_PREFLIGHT_CHECK=true
HOST=0.0.0.0
DANGEROUSLY_DISABLE_HOST_CHECK=true
ALLOWED_HOSTS=localhost
WDS_SOCKET_PORT=0
```

### Configuração de Produção

Para ambiente de produção:

```env
NODE_ENV=production
FRONTEND_URL=https://seu-dominio.com
```

---

## 🎮 Executando o Sistema

### Desenvolvimento (Frontend + Backend)

```bash
npm run dev
```

Isso irá iniciar:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Apenas Backend

```bash
# Com auto-reload (desenvolvimento)
npm run server

# Sem auto-reload (produção)
npm start
```

### Apenas Frontend

```bash
npm run client
```

### Build para Produção

```bash
# Gera build otimizado do frontend
npm run build

# A saída estará em: frontend/build/
```

---

## 🏗️ Estrutura do Projeto

```
SISTEMA-PIZZARIA/
├── backend/
│   ├── database/
│   │   ├── connection.js      # Conexão SQLite + wrappers async
│   │   ├── init.js            # Inicialização do banco
│   │   ├── limpar-dados.js    # Script de limpeza (pedidos/clientes)
│   │   ├── limpar-tudo.js     # Script de limpeza total
│   │   ├── verificar-produtos.js # Verificar produtos disponíveis
│   │   └── pizzaria.db        # Banco de dados SQLite
│   ├── middlewares/
│   │   └── auth-middleware.js # Autenticação JWT
│   ├── routes/
│   │   ├── route-auth.js      # Login e registro
│   │   ├── route-clientes.js  # CRUD de clientes
│   │   ├── route-produtos.js  # CRUD de produtos (público + admin)
│   │   ├── route-pedidos.js   # CRUD de pedidos (ordenação ASC)
│   │   └── route-relatorios.js # Dashboard e relatórios
│   ├── utils/
│   │   └── logger.js          # Logger personalizado
│   ├── app-server.js          # Servidor Express (rate limit otimizado)
│   └── server.js              # Entry point
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── service-worker.js  # Service Worker para PWA
│   │   └── sync-manager.js    # Gerenciador de sincronização offline
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js      # Layout com menu
│   │   │   └── PrivateRoute.js # Rotas protegidas
│   │   ├── contexts/
│   │   │   └── AuthContext.js # Contexto de autenticação
│   │   ├── pages/
│   │   │   ├── Page-Login.js       # Página de login
│   │   │   ├── Page-Dashboard.js   # Dashboard admin
│   │   │   ├── Page-Clientes.js    # Gestão de clientes
│   │   │   ├── Page-Produtos.js    # Gestão de produtos
│   │   │   ├── Page-Pedidos.js     # Gestão de pedidos (admin)
│   │   │   ├── Page-Relatorios.js  # Relatórios
│   │   │   ├── Page-PedidosCliente.js # Interface pública (validação visual)
│   │   │   └── styles.css          # Estilos globais (com .campo-erro)
│   │   ├── services/
│   │   │   └── api.js         # Cliente Axios
│   │   ├── App.js
│   │   └── index.js
│   ├── .env                   # Variáveis de ambiente do frontend
│   └── package.json
│
├── .env                       # Variáveis de ambiente do backend
├── .gitignore
├── package.json               # Scripts principais
├── README.md
├── INICIO_RAPIDO.md          # Guia de início rápido
├── ANALISE_CRITICA_COMPLETA.md # Análise técnica
└── RESUMO_CORRECOES.md       # Histórico de correções
```

---

## 🛠️ Tecnologias Utilizadas

### Backend

| Biblioteca | Versão | Propósito |
|-----------|--------|-----------|
| Express | 4.18.2 | Framework web |
| SQLite3 | 5.1.7 | Banco de dados |
| JWT | 9.0.2 | Autenticação |
| Bcrypt | 2.4.3 | Hash de senhas |
| Helmet | 7.1.0 | Segurança HTTP |
| CORS | 2.8.5 | Cross-origin |
| Express Validator | 7.0.1 | Validação de dados |
| Express Rate Limit | 7.1.5 | Limitação de taxa |
| Node-cron | 4.2.1 | Agendamento de tarefas |
| Dotenv | 16.3.1 | Variáveis de ambiente |
| Morgan | 1.10.0 | Logger HTTP |

### Frontend

| Biblioteca | Versão | Propósito |
|-----------|--------|-----------|
| React | 18.2.0 | Interface do usuário |
| React Router DOM | 6.21.0 | Roteamento SPA |
| Axios | 1.6.5 | Cliente HTTP |
| React Icons | 5.0.1 | Ícones |

### Ferramentas de Desenvolvimento

| Ferramenta | Versão | Propósito |
|-----------|--------|-----------|
| Nodemon | 3.0.2 | Auto-reload backend |
| Concurrently | 8.2.2 | Executar múltiplos comandos |
| React Scripts | 5.0.1 | Build e dev do React |

---

## 🔒 Segurança

### Medidas Implementadas

✅ **Autenticação JWT** com tokens de 8 horas de validade  
✅ **Senhas hasheadas** com bcrypt (10 rounds)  
✅ **JWT_SECRET aleatório** de 128 caracteres  
✅ **Rate Limiting Otimizado**:
- 500 requisições/15min (geral) - aumentado para suportar mais usuários
- 20 tentativas de login/15min - aumentado para melhor UX
- 5 pedidos públicos/hora

✅ **Headers de Segurança** (Helmet):
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- X-XSS-Protection

✅ **Validação de Entrada**:
- Backend: express-validator com regras personalizadas
- Frontend: Validação visual em tempo real com destaque vermelho
- Formatação automática de telefone e CEP

✅ **Proteção SQL Injection**:
- Prepared statements em todas as queries
- Sanitização de wildcards em buscas

✅ **Soft Delete**: Dados preservados para auditoria  
✅ **Logger Seguro**: Sem stack traces em produção  
✅ **CORS Configurado**: Apenas origem autorizada  
✅ **Sistema Offline Seguro**: Dados criptografados no localStorage

---

## 🌐 API Endpoints

### Autenticação
```
POST   /api/auth/login       # Login (público)
POST   /api/auth/register    # Criar usuário (admin apenas)
GET    /api/auth/verify      # Verificar token
```

### Clientes
```
GET    /api/clientes         # Listar clientes
GET    /api/clientes/:id     # Buscar cliente
POST   /api/clientes         # Criar cliente
PUT    /api/clientes/:id     # Atualizar cliente
DELETE /api/clientes/:id     # Desativar cliente (soft delete)
```

### Produtos
```
GET    /api/produtos/publico # Listar produtos (público)
GET    /api/produtos         # Listar produtos (admin)
GET    /api/produtos/:id     # Buscar produto
POST   /api/produtos         # Criar produto
PUT    /api/produtos/:id     # Atualizar produto
DELETE /api/produtos/:id     # Deletar produto
```

### Pedidos
```
POST   /api/pedidos/publico  # Criar pedido (público)
GET    /api/pedidos          # Listar pedidos
GET    /api/pedidos/:id      # Buscar pedido
POST   /api/pedidos          # Criar pedido (admin)
PATCH  /api/pedidos/:id/status # Atualizar status
DELETE /api/pedidos/:id      # Cancelar pedido
POST   /api/pedidos/gerar-comprovantes # Gerar comprovantes TXT
DELETE /api/pedidos/resetar-todos # Reset manual
```

### Relatórios
```
GET    /api/relatorios/dashboard # Dashboard estatísticas
GET    /api/relatorios/vendas    # Relatório de vendas
```

### Health Check
```
GET    /api/health           # Verificar status da API
```

---

## 📱 Acessando o Sistema

### Painel Administrativo

1. Acesse: http://localhost:3000/login
2. Use as credenciais geradas em `npm run init-db`
3. **Troque a senha** no primeiro login

### Interface Pública (Pedidos)

Acesse: http://localhost:3000/pedidos

---

## 🔧 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Inicia backend + frontend simultaneamente
npm run server       # Apenas backend (com auto-reload via nodemon)
npm run client       # Apenas frontend (React dev server)
```

### Produção
```bash
npm start            # Inicia backend (sem reload)
npm run build        # Build otimizado do frontend
```

### Instalação e Setup
```bash
npm run setup        # Instala dependências (backend + frontend)
npm run init-db      # Inicializa/recria banco de dados
```

### Scripts de Manutenção (Executar com Node)
```bash
# Limpeza de dados
node backend/database/limpar-dados.js      # Limpa pedidos e clientes
node backend/database/limpar-tudo.js       # Limpa tudo (pedidos, clientes, produtos)

# Verificação
node backend/database/verificar-produtos.js # Verifica produtos disponíveis
```

---

## � Acessando o Sistema

### Painel Administrativo

1. Acesse: **http://localhost:3000/login**
2. Use as credenciais geradas em `npm run init-db`
3. **Importante**: Troque a senha no primeiro login

**Funcionalidades Admin:**
- Dashboard com estatísticas
- Gestão de clientes
- Gestão de produtos (adicionar, editar, remover)
- Visualização de pedidos (ordem crescente por ID)
- Relatórios de vendas

### Interface Pública de Pedidos

Acesse: **http://localhost:3000/pedidos**

**Funcionalidades do Cliente:**
- Navegar pelo cardápio (Pizza, Bebida, Porção, Sobremesa)
- Filtrar produtos por categoria
- Adicionar produtos ao carrinho
- Preencher dados de entrega (com validação visual)
- CEP com preenchimento automático
- Estimativa de tempo de preparo e entrega
- **Sistema offline** - pedidos salvos e enviados automaticamente

**Validação Visual:**
- Campos obrigatórios vazios ficam com **borda vermelha**
- Ao preencher, a borda vermelha desaparece automaticamente
- Sem pop-ups ou alertas intrusivos

---

## 🐛 Troubleshooting

### Problema: "Cannot find module"

```bash
# Reinstale as dependências
npm run setup

# Ou manualmente:
npm install
cd frontend && npm install && cd ..
```

### Problema: "Port already in use" (Porta em uso)

**Windows (PowerShell):**
```powershell
# Encontrar processo na porta 5000 (backend)
netstat -ano | findstr :5000

# Matar processo (substitua <PID> pelo número encontrado)
taskkill /PID <PID> /F

# Para a porta 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Encontrar e matar processo
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Problema: "JWT_SECRET not defined"

O `.env` já vem configurado. Se necessário, gere um novo:

```bash
# Gerar novo JWT_SECRET (128 caracteres)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie o resultado e substitua no arquivo `.env`.

### Problema: "Database locked" (Banco bloqueado)

```bash
# Pare o servidor e remova arquivos de lock
rm backend/database/*.db-shm
rm backend/database/*.db-wal

# Ou no Windows PowerShell:
del backend\database\*.db-shm
del backend\database\*.db-wal
```

### Problema: Esqueci a senha do admin

```bash
# Reinicialize o banco (⚠️ ATENÇÃO: apaga todos os dados!)
npm run init-db

# Anote a nova senha temporária mostrada no terminal
```

### Problema: Frontend não conecta no backend

1. Verifique se o proxy está configurado em `frontend/package.json`:
```json
"proxy": "http://localhost:5000"
```

2. Verifique se o backend está rodando:
```bash
# Teste direto na API
curl http://localhost:5000/api/health
```

3. Verifique o `.env` do frontend em `frontend/.env`

### Problema: Produtos não aparecem na página pública

```bash
# Verifique se há produtos disponíveis
node backend/database/verificar-produtos.js

# Se necessário, adicione produtos pelo painel admin
# Acesse: http://localhost:3000/produtos
```

### Problema: Erro 429 (Too Many Requests)

O rate limit foi aumentado para 500 requisições/15min. Se ainda assim estiver limitando:

1. Edite `backend/app-server.js`
2. Localize a seção `rateLimiter`
3. Aumente o valor de `max`:
```javascript
max: 1000, // era 500
```

### Problema: Pedidos não sincronizam offline

1. Verifique o console do navegador (F12)
2. Verifique se o `sync-manager.js` está carregado
3. Teste a conexão:
```javascript
// No console do navegador
syncManager.getPendingCount()
```

---

## 💡 Dicas de Uso

### Para Administradores

1. **Adicione produtos antes de abrir para clientes**
   - Acesse: `/produtos`
   - Tipos: Pizza, Bebida, Porção, Sobremesa
   - Marque como "Disponível"

2. **Acompanhe pedidos em tempo real**
   - Acesse: `/pedidos`
   - Pedidos aparecem em ordem crescente (mais antigos primeiro)

3. **Verifique relatórios periodicamente**
   - Acesse: `/relatorios`
   - Veja produtos mais vendidos
   - Analise período de vendas

### Para Clientes

1. **Navegue pelo cardápio**
   - Use os filtros por categoria
   - Veja descrição e preços

2. **Preencha todos os campos obrigatórios**
   - Campos vazios ficam vermelhos
   - Preencha para a borda voltar ao normal

3. **Use o CEP para preenchimento rápido**
   - Digite o CEP
   - Endereço é preenchido automaticamente

4. **Sistema funciona offline**
   - Pedido é salvo localmente
   - Enviado automaticamente quando conexão voltar

---

## 🚀 Deploy em Produção

### Checklist Pré-Deploy

- [ ] Alterar `NODE_ENV=production` no `.env`
- [ ] Configurar `FRONTEND_URL` para domínio real
- [ ] Trocar senha admin padrão
- [ ] Executar `npm audit fix` 
- [ ] Configurar HTTPS (certificado SSL)
- [ ] Configurar backup automático do banco SQLite
- [ ] Configurar monitoramento (PM2, Sentry)
- [ ] Testar rate limiting em produção
- [ ] Configurar logs de produção
- [ ] Testar sistema offline

### Deploy com PM2 (Recomendado)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Build do frontend
cd frontend
npm run build
cd ..

# Iniciar backend com PM2
pm2 start backend/server.js --name pizzaria-api

# Servir frontend com serve
npm install -g serve
pm2 start "serve -s frontend/build -l 3000" --name pizzaria-frontend

# Salvar configuração do PM2
pm2 save
pm2 startup

# Comandos úteis PM2
pm2 status           # Ver status
pm2 logs pizzaria-api # Ver logs
pm2 restart all      # Reiniciar tudo
pm2 stop all         # Parar tudo
```

### Backup do Banco de Dados

```bash
# Backup manual
cp backend/database/pizzaria.db backend/database/backup-$(date +%Y%m%d).db

# Backup automático (adicionar no cron/agendador)
# Diário às 3h da manhã
0 3 * * * cp /caminho/backend/database/pizzaria.db /backup/pizzaria-$(date +\%Y\%m\%d).db
```

---

## 📞 Suporte

Para dúvidas, sugestões ou problemas:

1. Verifique a seção [Troubleshooting](#-troubleshooting)
2. Consulte os arquivos de documentação:
   - `INICIO_RAPIDO.md` - Guia rápido
   - `ANALISE_CRITICA_COMPLETA.md` - Análise técnica
   - `RESUMO_CORRECOES.md` - Histórico de mudanças

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🎉 Recursos Destacados

### ✨ Sistema Offline Inteligente
- Pedidos salvos automaticamente no navegador
- Sincronização automática quando conexão voltar
- Indicador visual de pedidos pendentes

### 🎨 Validação Visual Moderna
- Campos obrigatórios destacados em vermelho
- Feedback em tempo real
- Sem alertas intrusivos ou pop-ups

### 🚀 Performance Otimizada
- SQLite com modo WAL
- Rate limiting configurável
- Build otimizado do React

### 🔒 Segurança em Primeiro Lugar
- JWT com tokens de 8 horas
- Senhas hasheadas com bcrypt
- Rate limiting contra ataques
- Headers de segurança configurados

---

**Desenvolvido com ❤️ para facilitar a gestão de pizzarias**