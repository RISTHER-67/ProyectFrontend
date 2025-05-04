const options = document.querySelectorAll('.payment-option');
const selectedMethod = document.getElementById('selected-method');
const cardFields = document.getElementById('card-fields');
const paypalInstructions = document.getElementById('paypal-instructions');
const yapeQR = document.getElementById('yape-qr');
let currentMethod = "Card";

options.forEach(option => {
  option.addEventListener('click', () => {
    options.forEach(opt => opt.classList.remove('active'));
    option.classList.add('active');
    currentMethod = option.dataset.method;
    selectedMethod.textContent = currentMethod;

    // Mostrar secciones según método
    cardFields.style.display = (currentMethod === 'Card') ? 'block' : 'none';
    paypalInstructions.style.display = (currentMethod === 'PayPal') ? 'block' : 'none';
    yapeQR.style.display = (currentMethod === 'Yape') ? 'block' : 'none';
  });
});

document.getElementById("paymentForm").addEventListener("submit", function(e) {
  e.preventDefault();

  if (currentMethod === "Card") {
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const cardName = document.getElementById("cardName").value.trim();
    const expiry = document.getElementById("expiry").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!cardNumber || !cardName || !expiry || !cvv) {
      alert("Por favor completa todos los campos de la tarjeta.");
      return;
    }
  }

  if (currentMethod === "Yape") {
    const yapeCode = document.getElementById("yapeCode").value.trim();
    if (!yapeCode) {
      alert("Por favor ingresa tu número de operación de Yape.");
      return;
    }
  }

  alert("¡Pago procesado con éxito usando " + currentMethod + "!");
  // Aquí podrías redirigir a otra página o enviar datos a tu backend.
});

// Método por defecto: Card
options[0].classList.add('active');
cardFields.style.display = 'block';

// Función para renderizar el resumen del pedido con datos del carrito en localStorage
function renderizarResumen() {
  const contenedorProductos = document.getElementById('order-summary-products');
  const totalElemento = document.getElementById('order-summary-total');
  contenedorProductos.innerHTML = ''; // Limpiar contenido previo

  let total = 0;

  // Obtener carrito desde localStorage
  const carritoGuardado = localStorage.getItem('cart');
  if (!carritoGuardado) {
    contenedorProductos.innerHTML = '<p>No hay productos en el carrito.</p>';
    totalElemento.textContent = '$0.00';
    return;
  }

  const productos = JSON.parse(carritoGuardado);
  if (productos.length === 0) {
    contenedorProductos.innerHTML = '<p>No hay productos en el carrito.</p>';
    totalElemento.textContent = '$0.00';
    return;
  }

  productos.forEach(producto => {
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('d-flex', 'justify-content-between', 'mt-3');
    productoDiv.innerHTML = `
      <span>${producto.name}</span>
      <strong>$${(producto.price * producto.quantity).toFixed(2)}</strong>
    `;
    contenedorProductos.appendChild(productoDiv);
    total += producto.price * producto.quantity;
  });

  totalElemento.textContent = `$${total.toFixed(2)}`;
}

// Llamar a la función para mostrar el resumen al cargar la página
renderizarResumen();
