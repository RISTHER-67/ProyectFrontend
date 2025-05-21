function toggleForms() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    if (loginForm) loginForm.classList.toggle("show");
    if (registerForm) registerForm.classList.toggle("show");
}

function updateUI() {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const loginContainer = document.getElementById('login-container');
    const profileContainer = document.getElementById('profile-container');
    const profileDropdown = document.getElementById('profileDropdown');

    if (loggedIn) {
        if (loginContainer) loginContainer.classList.add('d-none');
        if (profileContainer) profileContainer.classList.remove('d-none');
        if (profileDropdown) {
            const userEmail = localStorage.getItem('userEmail');
            profileDropdown.textContent = userEmail;
        }
    } else {
        if (loginContainer) loginContainer.classList.remove('d-none');
        if (profileContainer) profileContainer.classList.add('d-none');
    }
}

function setupLogout() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userEmail');
            updateUI();
            alert('Sesión cerrada');
        });
    }
}

function setupLogin() {
    // Aquí puedes agregar la lógica para inicializar el login, por ejemplo:
    // - Mostrar formularios
    // - Manejar eventos de login
    // Por ahora, solo un log para evitar el error
    console.log('setupLogin ejecutado');
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setupLogin();
    setupLogout();
    updateUI();
});
