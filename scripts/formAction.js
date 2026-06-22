/**
 * Obtém parâmetros da URL (query string)
 * @returns {Object} - Objeto com os parâmetros
 */
function getQueryParameters() {
  const params = new URLSearchParams(window.location.search);
  const data = {};

  for (let [key, value] of params.entries()) {
    if (data[key]) {
      // Se a chave já existe, converter para array
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(value);
    } else {
      data[key] = value;
    }
  }

  return data;
}

/**
 * Formata um valor para exibição
 * @param {*} value - Valor a formatar
 * @returns {string} - Valor formatado
 */
function formatValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  // Decodificar se estiver codificado
  try {
    return decodeURIComponent(value);
  } catch (e) {
    return value;
  }
}

/**
 * Formata um label de chave
 * @param {string} key - Chave
 * @returns {string} - Label formatado
 */
function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Exibe os dados recebidos
 */
function displayData() {
  const data = getQueryParameters();
  const dadosResumo = document.getElementById('dadosResumo');
  const tabelaDados = document.getElementById('tabelaDados');
  const urlAtual = document.getElementById('urlAtual');

  // Exibir URL
  urlAtual.textContent = window.location.href;

  if (Object.keys(data).length === 0) {
    dadosResumo.innerHTML = '<p style="color: #dc3545;">Nenhum dado foi recebido! Verifique se o formulário foi enviado corretamente.</p>';
    tabelaDados.innerHTML = '';
    return;
  }

  // Criar resumo dos dados
  let resumoHtml = '';
  for (let [key, value] of Object.entries(data)) {
    const label = formatLabel(key);
    const displayValue = formatValue(value);

    resumoHtml += `
      <div class="summary-item">
        <span class="summary-label">${label}:</span>
        <span class="summary-value">${displayValue}</span>
      </div>
    `;
  }
  dadosResumo.innerHTML = resumoHtml;

  // Criar tabela detalhada
  let tabelaHtml = '<h3>Tabela Detalhada de Dados</h3>';
  tabelaHtml += '<table style="width: 100%; border-collapse: collapse;">';
  tabelaHtml += '<thead style="background-color: #FF6600; color: white;">';
  tabelaHtml += '<tr><th style="padding: 0.75rem; text-align: left; border: 1px solid #e0e0e0;">Campo</th>';
  tabelaHtml += '<th style="padding: 0.75rem; text-align: left; border: 1px solid #e0e0e0;">Valor</th></tr>';
  tabelaHtml += '</thead>';
  tabelaHtml += '<tbody>';

  let rowColor = '#FFE6CC';
  for (let [key, value] of Object.entries(data)) {
    const label = formatLabel(key);
    const displayValue = formatValue(value);

    tabelaHtml += `
      <tr style="background-color: ${rowColor}; border: 1px solid #e0e0e0;">
        <td style="padding: 0.75rem; border: 1px solid #e0e0e0;"><strong>${label}</strong></td>
        <td style="padding: 0.75rem; border: 1px solid #e0e0e0;">${displayValue}</td>
      </tr>
    `;

    rowColor = rowColor === '#FFE6CC' ? 'white' : '#FFE6CC';
  }

  tabelaHtml += '</tbody>';
  tabelaHtml += '</table>';
  tabelaDados.innerHTML = tabelaHtml;

  // Exibir alerta de sucesso
  console.log('Dados recebidos:', data);
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', displayData);
