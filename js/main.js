// main.js
document.addEventListener("DOMContentLoaded", () => {
    loadProducts(() => {
        setupFilters();
    });
    setupChatbot();
    setupLogin();
    loadCart();
});
