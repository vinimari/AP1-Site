/* ====================================
   VALIDAÇÃO DE FORMULÁRIOS
   ==================================== */

/**
 * Valida um formulário completo
 * @param {string} formId - ID do formulário
 * @returns {boolean} - true se válido, false caso contrário
 */
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  let isValid = true;
  const fields = form.querySelectorAll('[data-validate]');

  // Limpar validações anteriores
  fields.forEach(field => clearFieldValidation(field));

  // Validar cada campo
  fields.forEach(field => {
    const validateType = field.dataset.validate;
    const isFieldValid = validateField(field, validateType);
    if (!isFieldValid) isValid = false;
  });

  return isValid;
}

/**
 * Valida um campo individual
 * @param {HTMLElement} field - Campo a validar
 * @param {string} type - Tipo de validação
 * @returns {boolean}
 */
function validateField(field, type) {
  const value = field.value.trim();
  const fieldName = field.name || field.getAttribute('data-label') || 'Campo';
  let isValid = true;
  let errorMessage = '';

  // Validação obrigatória
  if (field.hasAttribute('required') && value === '') {
    isValid = false;
    errorMessage = `${fieldName} é obrigatório!`;
  } else if (value !== '') {
    switch (type) {
      case 'email':
        if (!validateEmail(value)) {
          isValid = false;
          errorMessage = `Insira um email válido!`;
        }
        break;

      case 'phone':
        if (!validatePhone(value)) {
          isValid = false;
          errorMessage = `Insira um telefone válido! (XX) XXXX-XXXX ou XX XXXXX-XXXX`;
        }
        break;

      case 'date':
        if (!validateDateField(value)) {
          isValid = false;
          errorMessage = `Insira uma data válida!`;
        }
        break;

      case 'age':
        const age = parseInt(value);
        if (isNaN(age) || age < 18 || age > 120) {
          isValid = false;
          errorMessage = `A idade deve ser entre 18 e 120 anos!`;
        }
        break;

      case 'cpf':
        if (!validateCPF(value)) {
          isValid = false;
          errorMessage = `Insira um CPF válido!`;
        }
        break;

      case 'password':
        if (value.length < 6) {
          isValid = false;
          errorMessage = `A senha deve ter pelo menos 6 caracteres!`;
        }
        break;

      case 'confirm-password':
        const passwordField = document.querySelector('[data-validate="password"]');
        if (passwordField && value !== passwordField.value) {
          isValid = false;
          errorMessage = `As senhas não coincidem!`;
        }
        break;

      case 'number':
        if (isNaN(value)) {
          isValid = false;
          errorMessage = `Insira um número válido!`;
        }
        break;

      case 'checkbox-required':
        const checkbox = field;
        if (!checkbox.checked) {
          isValid = false;
          errorMessage = `${fieldName} é obrigatório!`;
        }
        break;
    }
  }

  // Aplicar estilos de validação
  if (!isValid) {
    markFieldError(field, errorMessage);
  } else if (field.hasAttribute('required') || field.dataset.validate) {
    markFieldSuccess(field);
  }

  return isValid;
}

/**
 * Valida um email
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida um telefone (formato brasileiro)
 * @param {string} phone
 * @returns {boolean}
 */
function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Valida uma data
 * @param {string} dateString
 * @returns {boolean}
 */
function validateDateField(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Valida um CPF
 * @param {string} cpf
 * @returns {boolean}
 */
function validateCPF(cpf) {
  // Remove caracteres especiais
  const cleaned = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleaned.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Calcula primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;

  // Verifica se os dígitos estão corretos
  return parseInt(cleaned[9]) === digit1 && parseInt(cleaned[10]) === digit2;
}

/**
 * Adiciona validação em tempo real a um campo
 * @param {HTMLElement} field - Campo
 * @param {string} type - Tipo de validação
 */
function addRealTimeValidation(field, type) {
  field.addEventListener('blur', function() {
    validateField(this, type);
  });

  field.addEventListener('input', function() {
    if (this.closest('.form-group').classList.contains('error')) {
      validateField(this, type);
    }
  });
}

/**
 * Inicializa validação em tempo real para todos os campos marcados
 */
function initRealTimeValidation() {
  const fields = document.querySelectorAll('[data-validate]');
  fields.forEach(field => {
    const validateType = field.dataset.validate;
    addRealTimeValidation(field, validateType);
  });
}

/**
 * Limpa todo o formulário
 * @param {string} formId - ID do formulário
 */
function clearForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.reset();

  // Limpar estados de validação
  const fields = form.querySelectorAll('[data-validate]');
  fields.forEach(field => clearFieldValidation(field));
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
  initRealTimeValidation();

  const form = document.getElementById('cadastroForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validateForm('cadastroForm')) {
      showAlert('Formulário válido! Enviando dados...', 'success', 2000);
      setTimeout(() => { this.submit(); }, 1000);
    } else {
      showAlert('Por favor, corrija os erros no formulário!', 'error', 5000);
      smoothScroll('.form-group.error');
    }
  });

  form.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'Enter') {
      document.querySelector('input[type="submit"]').click();
    }
  });

  form.addEventListener('reset', function () {
    setTimeout(() => { clearForm('cadastroForm'); }, 0);
  });
});
