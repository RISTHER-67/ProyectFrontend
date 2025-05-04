let cart = [];

// Function to add a product to the cart
function addProduct(product) {
  const index = cart.findIndex(item => item.id === product.id);
  if (index !== -1) {
    cart[index].quantity += product.quantity;
  } else {
    cart.push(product);
  }
  updateCart();
  
  saveCart();
}

// New function to add product by name, called from addToCart in products.js
function addToCart(productName) {
  // Find product details from allProducts loaded in products.js
  if (typeof allProducts === 'undefined' || !Array.isArray(allProducts)) {
    alert('Error: No se pudo acceder a la lista de productos.');
    return;
  }
  const product = allProducts.find(p => p.name === productName);
  if (!product) {
    alert('Producto no encontrado.');
    return;
  }
  // Create product object with quantity 1
  const productToAdd = {
    id: product.id || productName, // fallback id
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.image || ''
  };
  addProduct(productToAdd);
}

// Function to change the quantity of a product
function changeQuantity(id, quantity) {
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    if (quantity <= 0) {
      removeProduct(id);
    } else {
      cart[index].quantity = quantity;
      updateCart();
      saveCart();
    }
  } else {
    console.error(`Producto con id ${id} no encontrado en el carrito.`);
  }
}

// Function to remove a product from the cart by id
function removeProduct(id) {
  const initialLength = cart.length;
  cart = cart.filter(item => item.id !== id);
  if (cart.length === initialLength) {
    console.error(`Producto con id ${id} no encontrado para eliminar.`);
  }
  updateCart();
  saveCart();
}

// Function to update the cart display
function updateCart() {
  const container = document.getElementById('cart-items');
  if (!container) {
    console.error('Element with id "cart-items" not found');
    return;
  }
  container.innerHTML = '';

  let subtotal = 0;
  let discount = 0; // You can add discount logic here

  let totalQuantity = 0;

  cart.forEach(product => {
    const productTotal = product.price * product.quantity;
    subtotal += productTotal;
    totalQuantity += product.quantity;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'row cart-item align-items-center mb-3';

    itemDiv.innerHTML = `
      <div class="col-md-2">
        <img src="${product.image}" class="img-fluid" alt="${product.name}">
      </div>
      <div class="col-md-4">
        <h5>${product.name}</h5>
        
      </div>
      <div class="col-md-2 text-end">
        <p>$${product.price.toFixed(2)}</p>
      </div>
      <div class="col-md-2 d-flex justify-content-center align-items-center">
        <button class="btn btn-sm btn-dark-outline" onclick="changeQuantity('${product.id}', ${product.quantity - 1})">−</button>
        <input type="text" class="form-control form-control-sm mx-2 text-center" style="width: 50px;" value="${product.quantity}" readonly>
        <button class="btn btn-sm btn-dark-outline" onclick="changeQuantity('${product.id}', ${product.quantity + 1})">+</button>
      </div>
      <div class="col-md-1 text-end text-danger fw-bold">
        $${productTotal.toFixed(2)}
      </div>
      <div class="col-md-1 text-end">
        <button class="btn btn-sm text-danger" onclick="removeProduct('${product.id}')">🗑️</button>
      </div>
    `;

    container.appendChild(itemDiv);
  });

  const total = subtotal - discount;

  document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('cart-discount').textContent = `$${discount.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;

  // Update cart count badge
  const badge = document.getElementById('cart-count-badge');
  if (badge) {
    badge.textContent = totalQuantity > 0 ? totalQuantity : 0;
  }
}

// Function to save the cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to load the cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// Load the cart when the page loads
document.addEventListener('DOMContentLoaded', loadCart);

// Add event listener to redirect to payment page on "Pagar" button click
document.addEventListener('DOMContentLoaded', () => {
  const payButton = document.querySelector('.btn-checkout');
  if (payButton) {
    payButton.addEventListener('click', () => {
      window.location.href = 'pago.html';
    });
  }
});
