const socket = io();

socket.on('updateProducts', (products) => {
    let productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        productList.innerHTML += 
        `<li>${product.name} - $ ${product.price}
        <button onclick="deleteProduct(${product.id})">Eliminar</button></li>`
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const price = parseFloat(document.getElementById('price').value);

        if (!name || isNaN(price) || price <= 0) {
            alert('Por favor, completa los campos correctamente.');
            return;
        }

        console.log("Enviando producto:", { name, price }); 
        socket.emit('addProduct', { name, price });
        form.reset();
    });
});

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}
