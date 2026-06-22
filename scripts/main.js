/* ====================================
   SCRIPT PRINCIPAL - MENU E DINAMICIDADE
   ==================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar menu toggle
  initMenuToggle();

  // Definir página ativa no menu
  setActiveMenuLink();
});

/**
 * Inicializa o toggle do menu para dispositivos móveis
 */
function initMenuToggle() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
      });
    });
  }
}

/**
 * Define a página ativa no menu baseado na URL atual
 */
function setActiveMenuLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Comparar apenas o nome do arquivo
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Função para exibir alertas personalizados
 * @param {string} message - Mensagem do alerta
 * @param {string} type - Tipo: 'success', 'error', 'info'
 * @param {number} duration - Duração em ms (0 = permanente)
 */
function showAlert(message, type = 'info', duration = 5000) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  // Inserir no topo da página
  const main = document.querySelector('main');
  if (main) {
    main.insertBefore(alert, main.firstChild);
  }

  // Auto-remover após duração
  if (duration > 0) {
    setTimeout(() => {
      alert.remove();
    }, duration);
  }

  return alert;
}

/**
 * Função para validar email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Função para validar telefone (formato brasileiro)
 * @param {string} phone - Telefone a validar
 * @returns {boolean}
 */
function validatePhone(phone) {
  const regex = /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
  return regex.test(phone.replace(/\s/g, ''));
}

/**
 * Função para limpar um campo de formulário
 * @param {HTMLElement} field - Campo a limpar
 */
function clearFieldValidation(field) {
  const formGroup = field.closest('.form-group');
  if (formGroup) {
    formGroup.classList.remove('error', 'success');
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.textContent = '';
    }
  }
}

/**
 * Função para marcar campo como erro
 * @param {HTMLElement} field - Campo
 * @param {string} message - Mensagem de erro
 */
function markFieldError(field, message) {
  const formGroup = field.closest('.form-group');
  if (formGroup) {
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.textContent = message;
    }
  }
}

/**
 * Função para marcar campo como válido
 * @param {HTMLElement} field - Campo
 */
function markFieldSuccess(field) {
  const formGroup = field.closest('.form-group');
  if (formGroup) {
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.textContent = '';
    }
  }
}

/**
 * Scroll suave para um elemento
 * @param {string} selector - Seletor CSS do elemento
 */
function smoothScroll(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Ocultar elemento
 * @param {string} selector - Seletor CSS
 */
function hideElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.style.display = 'none';
  }
}

/**
 * Mostrar elemento
 * @param {string} selector - Seletor CSS
 */
function showElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.style.display = 'block';
  }
}
