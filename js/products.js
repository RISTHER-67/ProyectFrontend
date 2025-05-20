// products.js

// products.js

let allProducts = [];
let productsLoaded = 0;
const batchSize = 8;

function loadProducts() {
    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
            loadNextBatch();
        })
        .catch(error => console.error('Error al cargar los productos desde la API:', error));
}

function loadNextBatch() {
    const productList = document.getElementById('product-list');
    const end = Math.min(productsLoaded + batchSize, allProducts.length);
    for (let i = productsLoaded; i < end; i++) {
        const product = allProducts[i];
        const productDiv = document.createElement('div');
        productDiv.className = 'col fade-in';
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
        fadeInObserver.observe(productDiv);
    }

    productsLoaded = end;

    if (productsLoaded >= allProducts.length) {
        observer.unobserve(document.getElementById('sentinel'));
        document.getElementById('sentinel').style.display = 'none';
    }
}

const fadeInObserver = new IntersectionObserver((entries, observerFade) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observerFade.unobserve(entry.target);
        }
    });
});

const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        loadNextBatch();
    }
}, {
    rootMargin: '100px'
});

observer.observe(document.getElementById('sentinel'));

loadProducts();

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

    const videoContainer = document.getElementById('product-video');
    videoContainer.innerHTML = '';

    if (product.video && product.video.length > 0) {
        const video = document.createElement('video');
        video.src = product.video[0];
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.width = '100%';
        video.style.maxWidth = '350px';
        video.style.height = 'auto';
        video.controls = true;
        videoContainer.appendChild(video);
    }
}


// Cargar productos del JSON
//function loadProducts() {
//    fetch('../data/products.json')
//        .then(response => response.json())
//        .then(data => {
//            allProducts = data;
//            loadNextBatch(); // Carga inicial
//        })
//        .catch(error => console.error('Error al cargar los productos:', error));
//}


    //const imagesContainer = document.getElementById('product-images');
    //imagesContainer.innerHTML = '';
    //if (product.images) {
    //    product.images.forEach(imgSrc => {
    //        const img = document.createElement('img');
    //        img.src = imgSrc;
    //        img.alt = product.name + ' imagen adicional';
    //        img.className = 'img-thumbnail m-1';
    //        img.style.width = '100px';
    //        img.style.cursor = 'pointer';
    //        img.onclick = () => window.open(imgSrc, '_blank');
    //        imagesContainer.appendChild(img);
    //    });
    //}