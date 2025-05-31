document.addEventListener("DOMContentLoaded", () => {
  const profileContainer = document.getElementById("profile-container");
  const loginButton = document.querySelector('a[href="login.html"]');
  const profileDropdown = document.getElementById("profileDropdown");

  // Obtener datos del usuario desde sessionStorage
  const nombreUsuario = sessionStorage.getItem("nombre_usuario");
  const usuarioId = sessionStorage.getItem("usuario_id");

  if (nombreUsuario) {
    // Mostrar contenedor de perfil y ocultar botón de login
    profileContainer.classList.remove("d-none");
    if (loginButton) {
      loginButton.style.display = "none";
    }

    // Actualizar texto del botón con nombre y foto placeholder
    profileDropdown.innerHTML = `
      <img src="../imagenes/imagen perfil.jpg" alt="Foto de perfil" class="profile-photo me-2" />
      ${nombreUsuario}
    `;

    // Cargar historial de compras
    if (usuarioId) {
      fetch(`http://localhost:3000/api/pedidos/${usuarioId}`)
        .then(response => response.json())
        .then(data => {
          const purchaseHistoryContainer = document.getElementById("purchase-history");
          if (purchaseHistoryContainer && data.pedidos) {
            let html = "<strong>Historial de Compras:</strong><ul class='list-unstyled mb-0'>";
            data.pedidos.forEach(pedido => {
              pedido.productos.forEach(producto => {
                html += `<li>${producto.nombre_producto} - Cantidad: ${producto.cantidad} - Precio: $${Number(producto.precio_unitario).toFixed(2)}</li>`;
              });
            });
            html += "</ul>";
            purchaseHistoryContainer.innerHTML = html;
          }
        })
        .catch(error => {
          console.error("Error al cargar historial de compras:", error);
        });
    }

    // Manejar logout con delegación de evento
    profileContainer.addEventListener("click", (event) => {
      if (event.target && event.target.id === "logout-button") {
        sessionStorage.clear();
        window.location.href = "login.html";
      }
    });
  } else {
    // No hay usuario, mostrar login y ocultar perfil
    profileContainer.classList.add("d-none");
    if (loginButton) {
      loginButton.style.display = "inline-block";
    }
  }
});
