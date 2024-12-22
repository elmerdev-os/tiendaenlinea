
const products = [
    {
        id: 1,
        name: "MacBook Pro 2024",
        price: 1299.99,
        category: "laptops",
        description: "Potente laptop para profesionales",
        emoji: "💻"
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        price: 999.99,
        category: "smartphones",
        description: "El último iPhone con características premium",
        emoji: "📱"
    },
    {
        id: 3,
        name: "iPad Pro",
        price: 799.99,
        category: "tablets",
        description: "Tablet perfecta para creativos",
        emoji: "📱"
    },
    {
        id: 4,
        name: "Dell XPS 13",
        price: 1099.99,
        category: "laptops",
        description: "Laptop ultradelgada y potente",
        emoji: "💻"
    },
    {
        id: 5,
        name: "Samsung Galaxy S24",
        price: 899.99,
        category: "smartphones",
        description: "Smartphone Android de alta gama",
        emoji: "📱"
    }
];

let cart = [];
let favorites = [];

// Cargar datos del localStorage
function loadStorageData() {
    const savedCart = localStorage.getItem('cart');
    const savedFavorites = localStorage.getItem('favorites');
    
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedFavorites) favorites = JSON.parse(savedFavorites);
    
    updateCartBadge();
    updateFavoritesBadge();
}

// Guardar datos en localStorage
function saveStorageData() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Mostrar productos
function displayProducts(productsToShow = products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <h3 class="product-title">${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Agregar al carrito
                </button>
                <button class="add-to-favorites" onclick="toggleFavorite(${product.id})">
                    ${favorites.find(f => f.id === product.id) ? '❤️' : '🤍'}
                </button>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// Filtrar productos
function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const priceRange = document.getElementById('price-filter').value;
    const searchTerm = document.getElementById('search-filter').value.toLowerCase();

    let filtered = products;

    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }

    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        filtered = filtered.filter(p => {
            if (max) {
                return p.price >= min && p.price <= max;
            } else {
                return p.price >= min;
            }
        });
    }

    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }

    displayProducts(filtered);
}

// Funciones del carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartBadge();
    updateCartModal();
    saveStorageData();
    showNotification('Producto agregado al carrito');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartBadge();
    updateCartModal();
    saveStorageData();
}

function updateCartBadge() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = total;
}

function updateCartModal() {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-image">${item.emoji}</div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                <button onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
        `;
        container.appendChild(cartItem);
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Funciones de favoritos
function toggleFavorite(productId) {
    const product = products.find(p => p.id === productId);
    const index = favorites.findIndex(f => f.id === productId);

    if (index === -1) {
        favorites.push(product);
        showNotification('Agregado a favoritos');
    } else {
        favorites.splice(index, 1);
        showNotification('Eliminado de favoritos');
    }

    updateFavoritesBadge();
    updateFavoritesModal();
    saveStorageData();
    displayProducts();
}

function updateFavoritesBadge() {
    document.getElementById('favorites-count').textContent = favorites.length;
}

function updateFavoritesModal() {
    const container = document.getElementById('favorites-items');
    container.innerHTML = '';

    favorites.forEach(item => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        favoriteItem.innerHTML = `
            <div class="item-image">${item.emoji}</div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <button onclick="toggleFavorite(${item.id})">Eliminar</button>
            </div>
        `;
        container.appendChild(favoriteItem);
    });
}

// Funciones de modal
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    updateCartModal();
}

function toggleFavorites() {
    const modal = document.getElementById('favorites-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    updateFavoritesModal();
}

// Función de checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío');
        return;
    }
    
    showNotification('¡Compra realizada con éxito!');
    cart = [];
    updateCartBadge();
    updateCartModal();
    saveStorageData();
    toggleCart();
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 1rem;
        border-radius: 4px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Inicializar la aplicación
window.onload = () => {
    loadStorageData();
    displayProducts();
};
