const currentUser = FoodLoop.requireAuth();

if (currentUser) {
    document.getElementById('userGreeting').textContent = `Olá, ${currentUser.fullName}!`;
    document.getElementById('cartCount').textContent = FoodLoop.getCart()
        .reduce((total, item) => total + item.quantity, 0);

    document.getElementById('logoutButton').addEventListener('click', function () {
        FoodLoop.logout();
        window.location.href = '../telaLogin/index.html';
    });

    document.getElementById('filtrarButton').addEventListener('click', applyFilters);
    document.getElementById('filtroForm').addEventListener('submit', function (event) {
        event.preventDefault();
        applyFilters();
    });

    showProducts(FoodLoop.getProducts());
}

function applyFilters() {
    const name = document.getElementById('nome').value.trim().toLowerCase();
    const priceValue = document.getElementById('preco').value;
    const maximumPrice = priceValue === '' ? Infinity : Number(priceValue);
    const city = document.getElementById('cidade').value.trim().toLowerCase();
    const state = document.getElementById('estado').value.trim().toLowerCase();
    const delivery = document.getElementById('delivery').value;
    const expirationDate = document.getElementById('validade').value;
    const seller = document.getElementById('vendedor').value.trim().toLowerCase();

    const filteredProducts = FoodLoop.getProducts().filter((product) => (
        (!name || product.nome.toLowerCase().includes(name)) &&
        product.preco <= maximumPrice &&
        (!city || product.cidade.toLowerCase().includes(city)) &&
        (!state || product.estado.toLowerCase().includes(state)) &&
        (!delivery || product.delivery === delivery) &&
        (!expirationDate || product.validade >= expirationDate) &&
        (!seller || product.vendedor.nome.toLowerCase().includes(seller))
    ));

    showProducts(filteredProducts);
}

function showProducts(products) {
    const container = document.querySelector('.produtos-container');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }

    products.forEach((product) => {
        const card = document.createElement('article');
        card.className = 'produto-card';
        const productUrl = `../comprarProduto/comprarProduto.html?id=${encodeURIComponent(product.id)}`;
        const sellerUrl = `../perfilCliente/perfilCliente.html?vendedor=${encodeURIComponent(product.vendedor.nome)}`;

        card.innerHTML = `
            <img src="${FoodLoop.escapeHtml(product.imagem)}" alt="${FoodLoop.escapeHtml(product.nome)}" class="produto-imagem">
            <h3><a href="${productUrl}">${FoodLoop.escapeHtml(product.nome)}</a></h3>
            <p>Preço: ${FoodLoop.formatCurrency(product.preco)}</p>
            <p>Cidade: ${FoodLoop.escapeHtml(product.cidade)}</p>
            <p>Estado: ${FoodLoop.escapeHtml(product.estado)}</p>
            <p>Delivery: ${product.delivery === 'sim' ? 'Sim' : 'Não'}</p>
            <p>Validade: ${FoodLoop.formatDate(product.validade)}</p>
            <p>Vendedor: <a href="${sellerUrl}">${FoodLoop.escapeHtml(product.vendedor.nome)}</a></p>
            <button type="button" data-product-url="${productUrl}">Ver produto</button>
        `;

        card.querySelector('button').addEventListener('click', function () {
            window.location.href = this.dataset.productUrl;
        });
        container.appendChild(card);
    });
}
