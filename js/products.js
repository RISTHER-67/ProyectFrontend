
let allProducts = [];
let productsLoaded = 0;
const batchSize = 8;

function loadProducts(callback) {
    fetch("http://localhost:3000/api/products")
        .then((response) => response.json())
        .then((data) => {
            allProducts = data;
            window.allProducts = allProducts; // Exponer globalmente para filtros
            loadNextBatch();
            if (callback) callback();
        })
        .catch((error) =>
            console.error("Error al cargar los productos desde la API:", error)
        );
}

function loadNextBatch() {
    const productList = document.getElementById("product-list");
    const end = Math.min(productsLoaded + batchSize, allProducts.length);
    for (let i = productsLoaded; i < end; i++) {
        const product = allProducts[i];
        const productDiv = document.createElement("div");
        productDiv.className = "col fade-in";
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
        fadeInObserver.observe(productDiv);
    }

    productsLoaded = end;

    if (productsLoaded >= allProducts.length) {
        observer.unobserve(document.getElementById("sentinel"));
        document.getElementById("sentinel").style.display = "none";
    }
}

const fadeInObserver = new IntersectionObserver((entries, observerFade) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observerFade.unobserve(entry.target);
        }
    });
});

const observer = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting) {
            loadNextBatch();
        }
    },
    {
        rootMargin: "100px",
    }
);

observer.observe(document.getElementById("sentinel"));

loadProducts();

function viewProductDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}


function loadProductDetail() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
        document.getElementById("product-name").textContent =
            "Producto no encontrado";
        return;
    }

    fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((data) => {
            const product = data.find((p) => String(p.id) === id);
            if (!product) {
                document.getElementById("product-name").textContent =
                    "Producto no encontrado";
                return;
            }

            document.getElementById("product-name").textContent = product.name;
            document.getElementById("product-image").src = product.image;
            document.getElementById(
                "product-specs"
            ).textContent = `Marca: ${product.brand}\nAlmacenamiento: ${product.storage}`;
            document.getElementById(
                "product-price"
            ).textContent = `Precio: $${product.price}`;
            document.getElementById("product-availability").textContent =
                "Disponible";
            document.getElementById("product-description").textContent =
                product.description || "";

            const featuresList = document.getElementById("product-features");
            featuresList.innerHTML = "";
            if (product.features) {
                product.features.forEach((feature) => {
                    const li = document.createElement("li");
                    li.textContent = feature;
                    featuresList.appendChild(li);
                });
            }

            const videoContainer = document.getElementById("product-video");
            videoContainer.innerHTML = "";
            if (product.video && product.video.length > 0) {
                const video = document.createElement("video");
                video.src = product.video[0];
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;
                video.style.width = "100%";
                video.style.maxWidth = "350px";
                video.style.height = "auto";
                video.controls = true;
                videoContainer.appendChild(video);
            }
        })
        .catch((err) => {
            console.error("Error al cargar el producto:", err);
            document.getElementById("product-name").textContent =
                "Error al cargar el producto.";
        });
}
document.querySelectorAll('.button').forEach(button => button.addEventListener('click', e => {
    if (!button.classList.contains('loading')) {

        button.classList.add('loading');

        setTimeout(() => button.classList.remove('loading'), 3700);

    }
    e.preventDefault();
}));
