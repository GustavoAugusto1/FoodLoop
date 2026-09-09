const currentUser = FoodLoop.requireAuth();
const productForm = document.getElementById('cadastrarProdutoForm');
const formMessage = document.getElementById('formMessage');
const submitButton = productForm.querySelector('button[type="submit"]');

if (currentUser) {
    document.getElementById('validade').min = new Date().toISOString().split('T')[0];

    document.getElementById('foto').addEventListener('change', function () {
        const fileName = this.files[0] ? this.files[0].name : 'Nenhum arquivo selecionado';
        document.getElementById('file-name').textContent = fileName;
    });

    productForm.addEventListener('submit', registerProduct);
}

async function registerProduct(event) {
    event.preventDefault();
    formMessage.textContent = '';
    formMessage.className = 'form-message';
    submitButton.disabled = true;
    submitButton.textContent = 'Cadastrando...';

    try {
        const price = Number(document.getElementById('preco').value);
        if (!Number.isFinite(price) || price <= 0) {
            throw new Error('Informe um preço maior que zero.');
        }

        const image = await FoodLoop.readImageFile(document.getElementById('foto').files[0]);
        const product = FoodLoop.addProduct({
            nome: document.getElementById('nome').value,
            marca: document.getElementById('marca').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value,
            validade: document.getElementById('validade').value,
            delivery: document.getElementById('delivery').value,
            preco: price,
            imagem: image
        });

        formMessage.textContent = 'Produto cadastrado com sucesso!';
        formMessage.className = 'form-message success';
        window.setTimeout(() => {
            window.location.href = `../comprarProduto/comprarProduto.html?id=${encodeURIComponent(product.id)}`;
        }, 500);
    } catch (error) {
        formMessage.textContent = error.message;
        formMessage.className = 'form-message error';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Cadastrar';
    }
}
