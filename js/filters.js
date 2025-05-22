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
    const maxPriceRaw = document.getElementById('filter-price').value;
    const maxPrice = maxPriceRaw ? parseFloat(maxPriceRaw) : null;
    const modelQuery = document.getElementById('filter-model').value.toLowerCase();

    console.log("window.allProducts:", window.allProducts);
    const filtered = window.allProducts.filter(product => {
        const matchesBrand = !brand || product.brand.toLowerCase().includes(brand.toLowerCase());
        const matchesPrice = !maxPrice || product.price <= maxPrice;
        const matchesModel = !modelQuery || product.name.toLowerCase().includes(modelQuery);
        return matchesBrand && matchesPrice && matchesModel;
    });
    console.log("filtered products:", filtered);

    const sentinel = document.getElementById("sentinel");
    const noResults = document.getElementById("no-results");

    if (brand || maxPrice || modelQuery) {
        // Hay filtro activo, deshabilitar paginación
        observer.unobserve(sentinel);
        sentinel.style.display = "none";

        if (filtered.length === 0) {
            noResults.style.display = "block";
        } else {
            noResults.style.display = "none";
        }
    } else {
        // No hay filtro, activar paginación
        observer.observe(sentinel);
        sentinel.style.display = "block";
        noResults.style.display = "none";
    }

    renderProducts(filtered);
}

function renderProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Limpiar productos previos

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "col fade-in show";
        productDiv.innerHTML = `
            <div class="product">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" onclick="viewProductDetail('${product.id}')">
                    <div class="card-body">
                        <h5 class="card-title" onclick="viewProductDetail('${product.id}')" style="cursor:pointer">${product.name}</h5>
                        <p class="card-text">${product.storage}</p>
                        <p class="card-text">$${product.price}</p>
                        <button class="btn btn-success" onclick="addToCart('${product.name}')">Añadir al Carrito</button>
                    </div>
                </div>
            </div>
        `;
        productList.appendChild(productDiv);
    });
}

