const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
if (bar) {
    bar.addEventListener('click', () =>{
nav.classList.add('active');
    })
}
if (close) {
    close.addEventListener('click', () =>{
nav.classList.remove('active');
    })
}

//Add to cart functionality
const CART_STORAGE_KEY = 'cartItems';

function addToCart() {
    const productName = document.querySelector('.single-pro-details h4').textContent;
    const productPrice = document.querySelector('.single-pro-details h2').textContent;
    const quantity = document.querySelector('input[type="number"]').value;
    const productImage = document.getElementById('MainImg').src;
    const selectedSize = document.querySelector('select').value;

    if (selectedSize === 'Select Size') {
        alert('Please select a size before adding to cart');
        return;
    }

    const cartItem = {
        name: productName,
        price: productPrice,
        quantity: quantity,
        image: productImage,
        size: selectedSize
    };

    let cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

    const existingItemIndex = cartItems.findIndex(item => 
        item.name === cartItem.name && item.size === cartItem.size
    );

    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity = parseInt(cartItems[existingItemIndex].quantity) + parseInt(quantity);
    } else {
        cartItems.push(cartItem);
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));

    alert('Item added to cart!');
}

function loadCartItems() {
    const cartTableBody = document.querySelector('#cart tbody');
    if (!cartTableBody) return;

    cartTableBody.innerHTML = '';

    const cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

    let total = 0;

    cartItems.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const cartRow = document.createElement('tr');
        cartRow.innerHTML = `
            <td>
                <a href="#" onclick="removeFromCart(${index})">
                    <i class="far fa-times-circle"></i>
                </a>
            </td>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name} (${item.size})</td>
            <td>${item.price}</td>
            <td>
                <input type="number" value="${item.quantity}" 
                       onchange="updateQuantity(${index}, this.value)">
            </td>
            <td>${subtotal}</td>
        `;
        cartTableBody.appendChild(cartRow);
    });

    const subtotalElement = document.querySelector('#Subtotal table tr:nth-child(1) td:nth-child(2)');
    const totalElement = document.querySelector('#Subtotal table tr:nth-child(3) td:nth-child(2)');
    
    if (subtotalElement && totalElement) {
        subtotalElement.textContent = total;
        totalElement.textContent = total;
    }
}

function removeFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    cartItems.splice(index, 1);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    loadCartItems();
}

function updateQuantity(index, newQuantity) {
    let cartItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    cartItems[index].quantity = newQuantity;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    loadCartItems();
}

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButton = document.querySelector('.single-pro-details .normal');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', addToCart);
    }

    loadCartItems();
});
