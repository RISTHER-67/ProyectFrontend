let cart = [];

function obtenerUsuarioId() {
  return sessionStorage.getItem('usuario_id') || null;
}

// Agregar producto al carrito local
function addProduct(product) {
  const index = cart.findIndex(item => item.id === product.id);
  if (index !== -1) {
    cart[index].quantity += product.quantity || 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
      image: product.image || ''
    });
  }
  updateCart();
  saveCart();
}

// Agregar producto por nombre
function addToCart(productName) {
  if (typeof allProducts === 'undefined' || !Array.isArray(allProducts)) {
    alert('Error: No se pudo acceder a la lista de productos.');
    return;
  }
  const product = allProducts.find(p => p.name === productName);
  if (!product) {
    alert('Producto no encontrado.');
    return;
  }
  addProduct(product);
}

// Cambiar cantidad local
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
  }
}

// Eliminar producto local
function removeProduct(id) {
  cart = cart.filter(item => String(item.id) !== String(id));
  updateCart();
  saveCart();
}

// Actualizar visual
function updateCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  container.innerHTML = '';
  let subtotal = 0;
  let discount = 0;
  let totalQuantity = 0;

  cart.forEach(product => {
    const price = parseFloat(product.price) || 0;
    const productTotal = price * product.quantity;
    subtotal += productTotal;
    totalQuantity += product.quantity;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'row cart-item align-items-center mb-3';
    itemDiv.innerHTML = `
      <div class="col-md-2">
        <img src="${product.image}" class="img-fluid" alt="${product.name}">
      </div>
      <div class="col-md-4"><h5>${product.name}</h5></div>
      <div class="col-md-2 text-end"><p>$${price.toFixed(2)}</p></div>
      <div class="col-md-2 d-flex justify-content-center align-items-center">
        <button class="btn btn-sm btn-dark-outline" onclick="changeQuantity('${product.id}', ${product.quantity - 1})">−</button>
        <input type="text" class="form-control form-control-sm mx-2 text-center" style="width: 50px;" value="${product.quantity}" readonly>
        <button class="btn btn-sm btn-dark-outline" onclick="changeQuantity('${product.id}', ${product.quantity + 1})">+</button>
      </div>
      <div class="col-md-1 text-end text-danger fw-bold">$${productTotal.toFixed(2)}</div>
      <div class="col-md-1 text-end"><button class="btn btn-sm text-danger" onclick="removeProduct('${product.id}')">🗑️</button></div>
    `;
    container.appendChild(itemDiv);
  });

  const total = subtotal - discount;
  document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('cart-discount').textContent = `$${discount.toFixed(2)}`;
  document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;

  const badge = document.getElementById('cart-count-badge');
  if (badge) {
    badge.textContent = totalQuantity > 0 ? totalQuantity : 0;
  }
}

// Guardar y cargar
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// Cargar al abrir modal del carrito
const cartModal = document.getElementById('cartModal');
if (cartModal) {
  cartModal.addEventListener('show.bs.modal', () => updateCart());
}

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  const payButton = document.querySelector('.btn-checkout');
  if (payButton) {
    payButton.addEventListener('click', () => {
      window.location.href = 'pago.html';
    });
  }
});
