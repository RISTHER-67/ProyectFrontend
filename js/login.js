document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".container");
  const loginBtn = document.querySelector(".login-btn");
  //Api de regsitro
  const loginForm = document.querySelector("#loginForm");
  const API_URL = "http://localhost:3000/api";

  //Manejar el formulario de registro
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    //Obtener datos de los formularios
    const nombre_usuario = loginForm.querySelector('input[type="text"]').value;
    const contraseña = loginForm.querySelector('input[type="password"]').value;

    try {
      //Enviar la solicitud al servidor
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario,
          contraseña,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Guardar datos del usuario en sessionStorage
        sessionStorage.setItem("usuario_id", data.usuario.usuario_id);
        sessionStorage.setItem("nombre_usuario", data.usuario.nombre_usuario);
        sessionStorage.setItem("correo", data.usuario.correo);

        alert("Login exitoso");
        window.location.href = "../html/indice.html";
      } else {
        alert("Error al registrar el usuario");
      }
    } catch (error) {
      console.log("Error al registrar el usuario", error);
    }
  });
});
