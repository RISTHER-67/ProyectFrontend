// products.js
let allProducts = [];

function loadProducts() {
    fetch('../data/products.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    if (products.length === 0) {
        document.getElementById('no-results').style.display = 'block';
        return;
    }

    document.getElementById('no-results').style.display = 'none';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'col-md-3';
        productDiv.innerHTML = `
            <div class="product">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" onclick="viewProductDetail('${product.name}')">
                    <div class="card-body">
                        <h5 class="card-title" onclick="viewProductDetail('${product.name}')" style="cursor:pointer">${product.name}</h5>
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

function viewProductDetail(productName) {
    const product = allProducts.find(p => p.name === productName);
    if (product) {
        localStorage.setItem('currentProduct', JSON.stringify(product));
        window.location.href = 'product-detail.html';
    }
}

function loadProductDetail() {
    const product = JSON.parse(localStorage.getItem('currentProduct'));
    if (!product) return;

    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-specs').textContent = `Marca: ${product.brand}\nAlmacenamiento: ${product.storage}`;
    document.getElementById('product-price').textContent = `Precio: $${product.price}`;
    document.getElementById('product-availability').textContent = 'Disponible';
    document.getElementById('product-description').textContent = product.description || '';

    const featuresList = document.getElementById('product-features');
    featuresList.innerHTML = '';
    if (product.features) {
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    }

    const imagesContainer = document.getElementById('product-images');
    imagesContainer.innerHTML = '';
    if (product.images) {
        product.images.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = product.name + ' imagen adicional';
            img.className = 'img-thumbnail m-1';
            img.style.width = '100px';
            img.style.cursor = 'pointer';
            img.onclick = () => window.open(imgSrc, '_blank');
            imagesContainer.appendChild(img);
        });
    }
}
