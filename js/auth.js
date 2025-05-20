

function toggleForms() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    loginForm.classList.toggle("show");
    registerForm.classList.toggle("show");
}

function updateUI() {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const loginContainer = document.getElementById('login-container');
    const profileContainer = document.getElementById('profile-container');
    const profileDropdown = document.getElementById('profileDropdown');

    if (loggedIn) {
        loginContainer.classList.add('d-none');
        profileContainer.classList.remove('d-none');
        const userEmail = localStorage.getItem('userEmail');
        profileDropdown.textContent = userEmail;
    } else {
        loginContainer.classList.remove('d-none');
        profileContainer.classList.add('d-none');
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

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setupLogin();
    setupLogout();
    updateUI();
});
