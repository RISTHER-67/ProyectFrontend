/* forgot.js
   Lógica para la página de recuperación de contraseña (forgot password)
*/

const forgotForm = document.getElementById('forgot-form');
const emailInput = document.getElementById('email');
const message = document.getElementById('message');

forgotForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  if (emailInput.value.trim() !== "") {
    message.textContent = "¡Correo enviado! Revisa tu bandeja de entrada.";
    message.style.color = "green";
    emailInput.value = "";
  } else {
    message.textContent = "Por favor, ingresa un correo válido.";
    message.style.color = "red";
  }
});
