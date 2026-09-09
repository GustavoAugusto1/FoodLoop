const registerForm = document.getElementById('registerForm');
const formMessage = document.getElementById('formMessage');
const registerButton = registerForm.querySelector('button[type="submit"]');

document.getElementById('birthdate').max = new Date().toISOString().split('T')[0];

registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    formMessage.textContent = '';
    formMessage.className = 'form-message';

    const data = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        phone: document.getElementById('phone').value,
        cpfCnpj: document.getElementById('cpfCnpj').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        birthdate: document.getElementById('birthdate').value
    };

    const validationError = validateForm(data);
    if (validationError) {
        showMessage(validationError, 'error');
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = 'Cadastrando...';

    try {
        await FoodLoop.registerUser(data);
        showMessage('Cadastro realizado com sucesso!', 'success');
        window.setTimeout(() => {
            window.location.href = '../paginaInicial/paginaInicial.html';
        }, 500);
    } catch (error) {
        showMessage(error.message, 'error');
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = 'Cadastrar';
    }
});

function validateForm(data) {
    const nameParts = data.fullName.trim().split(/\s+/);
    if (nameParts.length < 2 || nameParts.some((part) => part.length < 2)) {
        return 'Informe seu nome completo.';
    }
    if (data.password.length < 6) {
        return 'A senha deve possuir pelo menos 6 caracteres.';
    }
    if (data.password !== data.confirmPassword) {
        return 'As senhas não correspondem.';
    }
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        return 'Informe um telefone válido com DDD.';
    }
    const documentDigits = data.cpfCnpj.replace(/\D/g, '');
    if (![11, 14].includes(documentDigits.length)) {
        return 'Informe um CPF com 11 dígitos ou CNPJ com 14 dígitos.';
    }
    if (!/^[A-Za-z]{2}$/.test(data.state.trim())) {
        return 'Informe o estado utilizando uma UF com duas letras.';
    }
    if (!data.birthdate || data.birthdate > new Date().toISOString().split('T')[0]) {
        return 'Informe uma data de nascimento válida.';
    }
    return '';
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}
