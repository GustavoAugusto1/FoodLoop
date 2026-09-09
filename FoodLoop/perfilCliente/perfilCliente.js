const currentUser = FoodLoop.requireAuth();

if (currentUser) {
    const sellerName = new URLSearchParams(window.location.search).get('vendedor');
    const seller = sellerName ? FoodLoop.findSellerByName(sellerName) : null;

    if (sellerName && !seller) {
        document.querySelector('.perfil-container').innerHTML = '<p>Vendedor não encontrado.</p>';
    } else if (seller) {
        renderSellerProfile(seller);
    } else {
        renderCurrentUserProfile(currentUser);
    }
}

function renderSellerProfile(seller) {
    const container = document.querySelector('.perfil-container');
    container.innerHTML = `
        <section class="perfil-info">
            <img src="${FoodLoop.escapeHtml(seller.foto)}" alt="${FoodLoop.escapeHtml(seller.nome)}" class="perfil-foto">
            <h1>${FoodLoop.escapeHtml(seller.nome)}</h1>
            <p>Cidade: ${FoodLoop.escapeHtml(seller.cidade)}</p>
            <p>Estado: ${FoodLoop.escapeHtml(seller.estado)}</p>
            <p>Telefone: ${FoodLoop.escapeHtml(seller.telefone)}</p>
            <button id="enviarMensagem" type="button">Enviar Mensagem</button>
            <form id="mensagemForm" class="mensagem-form" hidden>
                <label for="mensagemTexto">Mensagem</label>
                <textarea id="mensagemTexto" rows="4" maxlength="500" required></textarea>
                <button type="submit">Enviar</button>
                <p id="mensagemStatus" role="status"></p>
            </form>
        </section>
    `;

    document.getElementById('enviarMensagem').addEventListener('click', function () {
        document.getElementById('mensagemForm').hidden = false;
        document.getElementById('mensagemTexto').focus();
    });
    document.getElementById('mensagemForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const text = document.getElementById('mensagemTexto').value;
        try {
            FoodLoop.sendMessage(seller, text);
            document.getElementById('mensagemStatus').textContent = 'Mensagem enviada com sucesso!';
            document.getElementById('mensagemTexto').value = '';
        } catch (error) {
            document.getElementById('mensagemStatus').textContent = error.message;
        }
    });
}

function renderCurrentUserProfile(user) {
    const orders = FoodLoop.getOrdersForCurrentUser();
    const orderHtml = orders.length === 0
        ? '<p>Você ainda não realizou pedidos.</p>'
        : orders.slice().reverse().map((order) => `
            <article class="order-card">
                <strong>${FoodLoop.escapeHtml(order.id)}</strong>
                <span>${new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                <span>${FoodLoop.formatCurrency(order.total)} · ${FoodLoop.escapeHtml(order.status)}</span>
            </article>
        `).join('');

    document.querySelector('.perfil-container').innerHTML = `
        <section class="perfil-info own-profile">
            <img src="../fotos/usuarioImage.png" alt="Foto padrão de ${FoodLoop.escapeHtml(user.fullName)}" class="perfil-foto">
            <h1>${FoodLoop.escapeHtml(user.fullName)}</h1>
            <p>${FoodLoop.escapeHtml(user.email)}</p>
            <p>${FoodLoop.escapeHtml(user.city)} - ${FoodLoop.escapeHtml(user.state)}</p>
            <p>${FoodLoop.escapeHtml(user.phone)}</p>
            <h2>Meus pedidos</h2>
            <div class="orders-list">${orderHtml}</div>
        </section>
    `;
}
