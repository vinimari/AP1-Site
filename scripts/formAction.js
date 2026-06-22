/**
 * Escapa HTML para prevenir XSS
 * @param {string} str - String a escapar
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
    dadosResumo.innerHTML = '<p class="alert alert-error">Nenhum dado foi recebido! Verifique se o formulário foi enviado corretamente.</p>';
    tabelaDados.innerHTML = '';
    return;
  }

  // Criar resumo dos dados
  let resumoHtml = '';
  for (let [key, value] of Object.entries(data)) {
    const label = escapeHtml(formatLabel(key));
    const displayValue = escapeHtml(formatValue(value));

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
  tabelaHtml += '<table class="data-table">';
  tabelaHtml += '<thead>';
  tabelaHtml += '<tr><th>Campo</th><th>Valor</th></tr>';
  tabelaHtml += '</thead>';
  tabelaHtml += '<tbody>';

  for (let [key, value] of Object.entries(data)) {
    const label = escapeHtml(formatLabel(key));
    const displayValue = escapeHtml(formatValue(value));

    tabelaHtml += `
      <tr>
        <td><strong>${label}</strong></td>
        <td>${displayValue}</td>
      </tr>
    `;
  }

  tabelaHtml += '</tbody>';
  tabelaHtml += '</table>';
  tabelaDados.innerHTML = tabelaHtml;

  // Exibir alerta de sucesso
  console.log('Dados recebidos:', data);
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', displayData);
