/**
 * ============================================================================
 * SCHEDULER - RESET AUTOMÁTICO DE PEDIDOS
 * ============================================================================
 * 
 * Agenda e executa tarefas automáticas:
 * 1. Gera comprovantes TXT de todos os pedidos
 * 2. Deleta todos os pedidos e itens do banco
 * 3. Reseta IDs autoincrementais
 * 
 * Agendamento: Todo dia à meia-noite (00:00) horário de Brasília
 * 
 * Organização dos arquivos:
 * Desktop/Comprovantes/[DATA]/Pedido_[ID]_[Cliente].txt
 * 
 * Exemplo de uso manual:
 * const { limparPedidos } = require('./scheduler/resetPedidos');
 * await limparPedidos(); // Executa imediatamente
 */

const cron = require('node-cron');
const db = require('../database/connection');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Gera comprovantes TXT para todos os pedidos antes de deletá-los
 * @returns {Promise<number>} Quantidade de comprovantes gerados
 */
const gerarComprovantesMeiaNoite = async () => {
  try {
    console.log('📄 Gerando comprovantes antes de limpar...');
    
    // Buscar TODOS os pedidos
    const pedidos = await db.allAsync(`
      SELECT p.*, c.nome as cliente_nome, c.telefone, c.email, c.endereco
      FROM pedidos p
      LEFT JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.created_at DESC
    `);
    
    if (!pedidos || pedidos.length === 0) {
      console.log('ℹ️  Nenhum pedido para gerar comprovante');
      return 0;
    }
    
    // Criar pasta com data do dia
    const hoje = new Date();
    const dataFormatada = hoje.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const desktopPath = path.join(os.homedir(), 'Desktop', 'Comprovantes', dataFormatada);
    
    if (!fs.existsSync(desktopPath)) {
      fs.mkdirSync(desktopPath, { recursive: true });
    }
    
    let contador = 0;
    
    // Gerar um TXT para cada pedido
    for (const pedido of pedidos) {
      // Buscar itens do pedido
      const itens = await db.allAsync(`
        SELECT ip.*, p.nome as produto_nome
        FROM itens_pedido ip
        JOIN produtos p ON ip.produto_id = p.id
        WHERE ip.pedido_id = ?
      `, [pedido.id]);
      
      // Nome do arquivo
      const nomeArquivo = `Pedido_${pedido.id}_${pedido.cliente_nome || 'Cliente'}.txt`
        .replace(/[^a-zA-Z0-9._-]/g, '_');
      const txtPath = path.join(desktopPath, nomeArquivo);
      
      // Conteúdo do comprovante
      let conteudo = '';
      conteudo += '═══════════════════════════════════════════════════\n';
      conteudo += '           🍕 PIZZARIA - COMPROVANTE              \n';
      conteudo += '═══════════════════════════════════════════════════\n\n';
      
      conteudo += `PEDIDO #${pedido.id}\n`;
      conteudo += `Data: ${new Date(pedido.created_at).toLocaleString('pt-BR')}\n`;
      conteudo += `Status: ${pedido.status.toUpperCase()}\n`;
      conteudo += `Forma de Pagamento: ${pedido.forma_pagamento || 'Não informado'}\n\n`;
      
      conteudo += '───────────────────────────────────────────────────\n';
      conteudo += '                DADOS DO CLIENTE                   \n';
      conteudo += '───────────────────────────────────────────────────\n';
      conteudo += `Nome: ${pedido.cliente_nome || 'Não informado'}\n`;
      conteudo += `Telefone: ${pedido.telefone || 'Não informado'}\n`;
      conteudo += `Email: ${pedido.email || 'Não informado'}\n`;
      conteudo += `Endereço: ${pedido.endereco || 'Não informado'}\n\n`;
      
      conteudo += '───────────────────────────────────────────────────\n';
      conteudo += '                ITENS DO PEDIDO                    \n';
      conteudo += '───────────────────────────────────────────────────\n\n';
      
      if (itens && itens.length > 0) {
        itens.forEach(item => {
          conteudo += `• ${item.produto_nome}\n`;
          conteudo += `  Quantidade: ${item.quantidade}\n`;
          conteudo += `  Preço Unitário: R$ ${parseFloat(item.preco_unitario).toFixed(2)}\n`;
          conteudo += `  Subtotal: R$ ${parseFloat(item.subtotal).toFixed(2)}\n\n`;
        });
      } else {
        conteudo += 'Nenhum item encontrado\n\n';
      }
      
      conteudo += '═══════════════════════════════════════════════════\n';
      conteudo += `VALOR TOTAL: R$ ${parseFloat(pedido.valor_total).toFixed(2)}\n`;
      conteudo += '═══════════════════════════════════════════════════\n\n';
      
      if (pedido.observacoes) {
        conteudo += `Observações: ${pedido.observacoes}\n\n`;
      }
      
      conteudo += '\n            Obrigado pela preferência!\n';
      conteudo += '     Este documento não tem valor fiscal\n';
      
      // Salvar arquivo
      fs.writeFileSync(txtPath, conteudo, 'utf8');
      contador++;
    }
    
    console.log(`✅ ${contador} comprovantes salvos em: ${desktopPath}`);
    return contador;
    
  } catch (error) {
    console.error('❌ Erro ao gerar comprovantes:', error);
    return 0;
  }
};

// Função para limpar todos os pedidos
const limparPedidos = async () => {
  try {
    console.log('\n🗑️  ========== LIMPEZA AUTOMÁTICA DE PEDIDOS ==========');
    console.log(`⏰ Horário: ${new Date().toLocaleString('pt-BR')}`);
    
    // PRIMEIRO: Gerar comprovantes antes de deletar
    const comprovantesGerados = await gerarComprovantesMeiaNoite();
    
    // DEPOIS: Deletar os pedidos
    // Deletar itens de pedidos primeiro (por causa da foreign key)
    const resultItens = await db.runAsync('DELETE FROM itens_pedido');
    console.log(`✅ ${resultItens.changes} itens de pedidos deletados`);
    
    // Deletar pedidos
    const resultPedidos = await db.runAsync('DELETE FROM pedidos');
    console.log(`✅ ${resultPedidos.changes} pedidos deletados`);
    
    // Resetar os IDs autoincrementais
    await db.runAsync('DELETE FROM sqlite_sequence WHERE name IN ("pedidos", "itens_pedido")');
    console.log('✅ IDs resetados (próximo pedido será #1)');
    
    console.log(`📋 Total de comprovantes gerados: ${comprovantesGerados}`);
    console.log('🎉 Limpeza automática concluída com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro na limpeza automática de pedidos:', error);
  }
};

// Agendar limpeza para todo dia à meia-noite (00:00)
const iniciarAgendamento = () => {
  // Expressão cron: "segundo minuto hora dia mês dia-semana"
  // '0 0 0 * * *' = todo dia às 00:00:00
  cron.schedule('0 0 0 * * *', limparPedidos, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
  });
  
  console.log('📅 Agendamento configurado: Pedidos serão resetados todo dia à meia-noite (00:00)');
  console.log('📄 Comprovantes serão salvos automaticamente antes da limpeza');
};

module.exports = { iniciarAgendamento, limparPedidos };
