let cart = [];

// Simula obtener el usuario_id desde sessionStorage o como lo manejes tú
function obtenerUsuarioId() {
  return sessionStorage.getItem('usuario_id') || null;
}

// ---------------------- FUNCIONES DEL CARRITO ----------------------

// Función para añadir producto localmente y llamar API si hay usuario
function addProduct(product) {
  const usuario_id = obtenerUsuarioId();

  if (usuario_id) {
    // Usuario logueado: llamar a la API para agregar al carrito en base de datos
    addToCartAPI(product.productos_id, product.quantity || 1);
  } else {
    // Usuario no logueado: guardar localmente
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
}

// Función para agregar producto a carrito via API
async function addToCartAPI(productos_id, cantidad = 1) {
  const usuario_id = obtenerUsuarioId();
  console.log('addToCartAPI called with:', { usuario_id, productos_id, cantidad });
  if (!usuario_id) {
    console.warn('Usuario no autenticado. No se puede agregar por API.');
    alert('No estás autenticado. Por favor inicia sesión para agregar productos al carrito.');
    return;
  }

  try {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id, productos_id, cantidad })
    });
    const data = await response.json();

    if (response.ok) {
      alert('Producto añadido al carrito');
      cargarCarritoAPI();
    } else {
      alert(data.message || 'Error al añadir al carrito');
      console.error('Error response from API:', data);
    }
  } catch (error) {
    console.error('Error al añadir al carrito:', error);
    alert('Error al añadir al carrito. Revisa la consola para más detalles.');
  }
}

// Añadir producto a carrito (por nombre desde lista allProducts)
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

function changeQuantity(id, quantity) {
  console.log('changeQuantity called with:', { id, quantity });
  const usuario_id = obtenerUsuarioId();

  if (usuario_id) {
    // Actualizar cantidad en API para usuario logueado
    updateCartAPI(usuario_id, id, quantity);
  } else {
    // LocalStorage
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
}

function removeProduct(id) {
  const usuario_id = obtenerUsuarioId();

  if (usuario_id) {
    // Eliminar producto en API para usuario logueado
    removeProductAPI(usuario_id, id);
  } else {
    // LocalStorage
    console.log('Intentando eliminar producto con id:', id);
    const initialLength = cart.length;
    cart = cart.filter(item => String(item.id) !== String(id));
    if (cart.length === initialLength) {
      console.error(`Producto con id ${id} no encontrado para eliminar.`);
    }
    updateCart();
    saveCart();
  }
}

// Función para actualizar cantidad en API
async function updateCartAPI(usuario_id, productos_id, nuevaCantidad) {
  try {
    const response = await fetch('/api/cart/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id, productos_id, nuevaCantidad })
    });
    const data = await response.json();

    if (response.ok) {
      alert('Cantidad actualizada');
      cargarCarritoAPI();
    } else {
      alert(data.message || 'Error al actualizar cantidad');
      console.error('Error response from API:', data);
    }
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    alert('Error al actualizar cantidad. Revisa la consola para más detalles.');
  }
}

// Función para eliminar producto en API
async function removeProductAPI(usuario_id, productos_id) {
  try {
    const response = await fetch('/api/cart/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id, productos_id })
    });
    const data = await response.json();

    if (response.ok) {
      alert('Producto eliminado del carrito');
      cargarCarritoAPI();
    } else {
      alert(data.message || 'Error al eliminar producto');
      console.error('Error response from API:', data);
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    alert('Error al eliminar producto. Revisa la consola para más detalles.');
  }
}

// Actualizar visualmente el carrito LOCAL
function updateCart() {
  const container = document.getElementById('cart-items');
  if (!container) {
    console.error('Elemento con id "card" no encontrado');
    return;
  }
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
      <div class="col-md-4">
        <h5>${product.name}</h5>
      </div>
      <div class="col-md-2 text-end">
        <p>$${price.toFixed(2)}</p>
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

  const badge = document.getElementById('cart-count-badge');
  if (badge) {
    badge.textContent = totalQuantity > 0 ? totalQuantity : 0;
  }
}

// Guardar carrito en localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Cargar carrito desde localStorage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// ------------------ FUNCIONES PARA CARRITO API -------------------

// Cargar carrito desde API para usuario logueado
async function cargarCarritoAPI() {
  const usuario_id = obtenerUsuarioId();
  if (!usuario_id) return;

  try {
    const response = await fetch(`/api/cart?usuario_id=${usuario_id}`);
    const data = await response.json();

    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) {
      console.error('Elemento con id "cart-items" no encontrado');
      return;
    }
    cartItemsContainer.innerHTML = '';

    let subtotal = 0;

    data.productos.forEach(producto => {
      const item = document.createElement('div');
      item.className = 'd-flex justify-content-between align-items-center border-bottom py-2';
      item.innerHTML = `
          <div>
              <img src="${producto.imagen}" width="50" class="me-2" />
              ${producto.nombre} (x${producto.cantidad})
          </div>
          <div>$${(producto.precio * producto.cantidad).toFixed(2)}</div>
      `;
      cartItemsContainer.appendChild(item);
      subtotal += producto.precio * producto.cantidad;
    });

    // Actualiza resumen
    document.getElementById('cart-subtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-discount').innerText = '$0.00';
    document.getElementById('cart-total').innerText = `$${subtotal.toFixed(2)}`;
  } catch (error) {
    console.error('Error al cargar el carrito:', error);
  }
}

// ------------------ EVENTOS --------------------

document.addEventListener('DOMContentLoaded', () => {
  const usuario_id = obtenerUsuarioId();

  if (usuario_id) {
    cargarCarritoAPI();
  } else {
    loadCart();
  }

  const payButton = document.querySelector('.btn-checkout');
  if (payButton) {
    payButton.addEventListener('click', () => {
      window.location.href = 'pago.html';
    });
  }
});

// Cuando se abre el modal del carrito, carga el carrito de la fuente correcta
const cartModal = document.getElementById('cartModal');
if (cartModal) {
  cartModal.addEventListener('show.bs.modal', () => {
    const usuario_id = obtenerUsuarioId();
    if (usuario_id) {
      cargarCarritoAPI();
    } else {
      updateCart();
    }
  });
}
