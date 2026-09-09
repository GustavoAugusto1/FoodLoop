const currentUser = FoodLoop.requireAuth();

if (currentUser) {
    document.getElementById('checkoutButton').addEventListener('click', function () {
        if (FoodLoop.getCartDetails().length === 0) {
            alert('Adicione pelo menos um produto antes de finalizar a compra.');
            return;
        }
        window.location.href = 'checkout.html';
    });
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('carrinhoItems');
    const items = FoodLoop.getCartDetails();
    cartItems.innerHTML = '';

    if (items.length === 0) {
        cartItems.innerHTML = '<tr><td colspan="5" class="empty-cart">Seu carrinho está vazio.</td></tr>';
        document.getElementById('total').textContent = '0,00';
        document.getElementById('checkoutButton').disabled = true;
        return;
    }

    document.getElementById('checkoutButton').disabled = false;
    let total = 0;

    items.forEach((item) => {
        total += item.subtotal;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Produto">${FoodLoop.escapeHtml(item.product.nome)}</td>
            <td data-label="Preço">${FoodLoop.formatCurrency(item.product.preco)}</td>
            <td data-label="Quantidade">
                <input type="number" value="${item.quantity}" min="1" max="10" data-id="${FoodLoop.escapeHtml(item.product.id)}" class="quantidade-input" aria-label="Quantidade de ${FoodLoop.escapeHtml(item.product.nome)}">
            </td>
            <td data-label="Subtotal">${FoodLoop.formatCurrency(item.subtotal)}</td>
            <td data-label="Ações"><button type="button" class="remove-button" data-id="${FoodLoop.escapeHtml(item.product.id)}">Remover</button></td>
        `;

        row.querySelector('.quantidade-input').addEventListener('change', function () {
            const quantity = Math.max(1, Math.min(10, Number(this.value) || 1));
            FoodLoop.updateCartItem(this.dataset.id, quantity);
            renderCart();
        });
        row.querySelector('.remove-button').addEventListener('click', function () {
            FoodLoop.removeFromCart(this.dataset.id);
            renderCart();
        });
        cartItems.appendChild(row);
    });

    document.getElementById('total').textContent = total.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
