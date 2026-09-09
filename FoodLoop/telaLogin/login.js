const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');
const submitButton = loginForm.querySelector('button[type="submit"]');

if (FoodLoop.getCurrentUser()) {
    window.location.replace('../paginaInicial/paginaInicial.html');
}

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    errorMessage.style.display = 'none';
    submitButton.disabled = true;
    submitButton.textContent = 'Entrando...';

    try {
        const user = await FoodLoop.login(
            document.getElementById('email').value,
            document.getElementById('password').value
        );

        if (!user) {
            errorMessage.textContent = 'E-mail ou senha incorretos!';
            errorMessage.style.display = 'block';
            return;
        }

        window.location.href = '../paginaInicial/paginaInicial.html';
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Entrar';
    }
});
