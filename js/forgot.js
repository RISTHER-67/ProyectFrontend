/* forgot.js
   Lógica para la página de recuperación de contraseña (forgot password)
*/

const API_URL = 'http://localhost:3000/api';

const forgotForm = document.getElementById('forgot-form');
const emailInput = document.getElementById('email');
const message = document.getElementById('message');

forgotForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const correo = emailInput.value.trim();

  if (correo === "") {
    message.textContent = "Por favor, ingresa un correo válido.";
    message.style.color = "red";
    return;
  }

  fetch(`${API_URL}/olvide-contrasena`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ correo })
  })
  .then(response => response.text())
  .then(text => {
    message.textContent = text;
    message.style.color = "green";
    emailInput.value = "";
  })
  .catch(error => {
    message.textContent = "Error al enviar la solicitud. Intenta nuevamente.";
    message.style.color = "red";
    console.error('Error:', error);
  });
});
