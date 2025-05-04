// filters.js
function setupFilters() {
    const brandFilter = document.getElementById('filter-brand');
    const priceFilter = document.getElementById('filter-price');
    const modelFilter = document.getElementById('filter-model');

    [brandFilter, priceFilter, modelFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    modelFilter.addEventListener('keyup', applyFilters);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const brand = e.target.textContent;
            document.getElementById('filter-brand').value = brand;
            applyFilters();
        });
    });
}

function applyFilters() {
    const brand = document.getElementById('filter-brand').value;
    const maxPrice = document.getElementById('filter-price').value;
    const modelQuery = document.getElementById('filter-model').value.toLowerCase();

    const filtered = allProducts.filter(product => {
        const matchesBrand = !brand || product.brand === brand;
        const matchesPrice = !maxPrice || product.price <= maxPrice;
        const matchesModel = !modelQuery || product.name.toLowerCase().includes(modelQuery);
        return matchesBrand && matchesPrice && matchesModel;
    });

    renderProducts(filtered);
}
