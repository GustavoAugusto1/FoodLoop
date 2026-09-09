const currentUser = FoodLoop.requireAuth();

if (currentUser) {
    const productId = new URLSearchParams(window.location.search).get('id');
    const product = FoodLoop.getProductById(productId);
    const container = document.querySelector('.container');

    if (!productId) {
        container.innerHTML = '<p>ID do produto não fornecido.</p>';
    } else if (!product) {
        container.innerHTML = '<p>Produto não encontrado.</p>';
    } else {
        document.getElementById('produtoNome').textContent = product.nome;
        document.getElementById('produtoMarca').textContent = product.marca;
        document.getElementById('produtoPreco').textContent = FoodLoop.formatCurrency(product.preco);
        document.getElementById('produtoCidade').textContent = product.cidade;
        document.getElementById('produtoEstado').textContent = product.estado;
        document.getElementById('produtoDelivery').textContent = product.delivery === 'sim' ? 'Sim' : 'Não';
        document.getElementById('produtoValidade').textContent = FoodLoop.formatDate(product.validade);
        document.getElementById('vendedorLink').textContent = product.vendedor.nome;
        document.getElementById('vendedorLink').href = `../perfilCliente/perfilCliente.html?vendedor=${encodeURIComponent(product.vendedor.nome)}`;
        document.getElementById('produtoImagem').src = product.imagem;
        document.getElementById('produtoImagem').alt = product.nome;

        document.getElementById('comprarButton').addEventListener('click', function () {
            FoodLoop.addToCart(product.id);
            window.location.href = '../carrinhoCompra/carrinhoCompra.html';
        });
    }
}
