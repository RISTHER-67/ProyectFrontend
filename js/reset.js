/* reset.js
   Lógica para la página de restablecimiento de contraseña
*/

const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const resetForm = document.getElementById('reset-form');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const message = document.getElementById('message');

  // Obtener token de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    message.textContent = "Token inválido o no proporcionado.";
    message.style.color = "red";
    resetForm.style.display = "none";
    return;
  }

  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (password.length < 6) {
      message.textContent = "La contraseña debe tener al menos 6 caracteres.";
      message.style.color = "red";
      return;
    }

    if (password !== confirmPassword) {
      message.textContent = "Las contraseñas no coinciden.";
      message.style.color = "red";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      });

      const text = await response.text();

      if (response.ok) {
        message.textContent = text;
        message.style.color = "green";
        resetForm.reset();
      } else {
        message.textContent = text;
        message.style.color = "red";
      }
    } catch (error) {
      message.textContent = "Error al enviar la solicitud. Intenta nuevamente.";
      message.style.color = "red";
      console.error('Error:', error);
    }
  });
});
