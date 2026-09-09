const currentUser = FoodLoop.requireAuth();

if (currentUser) {
    const items = FoodLoop.getCartDetails();
    if (items.length === 0) {
        window.location.replace('carrinhoCompra.html');
    } else {
        document.getElementById('address').value = `${currentUser.city} - ${currentUser.state}`;
        renderOrderSummary(items);
        document.getElementById('checkoutForm').addEventListener('submit', finishOrder);
    }
}

function renderOrderSummary(items) {
    const container = document.getElementById('checkoutItems');
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    container.innerHTML = items.map((item) => `
        <div class="checkout-item">
            <span>${item.quantity} × ${FoodLoop.escapeHtml(item.product.nome)}</span>
            <strong>${FoodLoop.formatCurrency(item.subtotal)}</strong>
        </div>
    `).join('');
    document.getElementById('checkoutTotal').textContent = FoodLoop.formatCurrency(total);
}

function finishOrder(event) {
    event.preventDefault();
    const button = document.getElementById('confirmOrderButton');
    const message = document.getElementById('checkoutMessage');
    message.textContent = '';
    button.disabled = true;
    button.textContent = 'Confirmando...';

    try {
        const order = FoodLoop.createOrder({
            address: document.getElementById('address').value,
            paymentMethod: document.getElementById('paymentMethod').value
        });
        document.getElementById('checkoutForm').hidden = true;
        document.getElementById('orderSummary').hidden = true;
        document.getElementById('orderId').textContent = order.id;
        document.getElementById('orderSuccess').hidden = false;
    } catch (error) {
        message.textContent = error.message;
        button.disabled = false;
        button.textContent = 'Confirmar pedido';
    }
}
