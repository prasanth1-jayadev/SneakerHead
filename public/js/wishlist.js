// Wishlist functionality
document.addEventListener('DOMContentLoaded', function() {
    loadWishlistItems();
    updateWishlistCount();
});

function loadWishlistItems() {
    const wishlist = getWishlist();
    const container = document.getElementById('wishlist-container');
    
    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-heart"></i>
                <h2>Your wishlist is empty</h2>
                <p>Save your favorite sneakers for later!</p>
                <a href="/products" class="btn btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-shopping-bag"></i>
                    Discover Sneakers
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    wishlist.forEach(item => {
        const wishlistItemHTML = `
            <div class="wishlist-item" data-id="${item.id}">
                <button class="remove-wishlist" onclick="removeFromWishlist(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="wishlist-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="wishlist-info">
                    <div class="wishlist-brand">${item.brand}</div>
                    <div class="wishlist-name">${item.name}</div>
                    <div class="wishlist-price">$${item.price}</div>
                    <div class="wishlist-actions">
                        <button class="btn btn-primary btn-small" onclick="addToCartFromWishlist(${item.id})">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <a href="/product/${item.id}" class="btn btn-outline btn-small">
                            <i class="fas fa-eye"></i>
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += wishlistItemHTML;
    });
}

function addToWishlist(product) {
    let wishlist = getWishlist();
    
    // Check if item already exists
    const existingItem = wishlist.find(item => item.id === product.id);
    
    if (existingItem) {
        showNotification('Item already in wishlist!', 'info');
        return false;
    }
    
    // Add to wishlist
    wishlist.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        dateAdded: new Date().toISOString()
    });
    
    saveWishlist(wishlist);
    updateWishlistCount();
    showNotification('Added to wishlist! ❤️', 'success');
    return true;
}

function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist(wishlist);
    loadWishlistItems();
    updateWishlistCount();
    showNotification('Removed from wishlist', 'info');
}

function addToCartFromWishlist(productId) {
    const wishlist = getWishlist();
    const wishlistItem = wishlist.find(item => item.id === productId);
    
    if (wishlistItem) {
        // Add to cart
        addToCart({
            id: wishlistItem.id,
            name: wishlistItem.name,
            brand: wishlistItem.brand,
            price: wishlistItem.price,
            image: wishlistItem.image,
            selectedColor: 'Default',
            selectedSize: 'M',
            quantity: 1
        });
        
        // Optionally remove from wishlist
        removeFromWishlist(productId);
        
        showNotification('Added to cart! 🛒', 'success');
    }
}

function addToCart(product) {
    let cart = getCart();
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    saveCart(cart);
    updateCartCount();
}

function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.some(item => item.id === productId);
}

function toggleWishlist(product) {
    if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        return false;
    } else {
        return addToWishlist(product);
    }
}

function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateWishlistCount() {
    const wishlist = getWishlist();
    const count = wishlist.length;
    
    // Update wishlist icon in navbar if it exists
    const wishlistCountElement = document.getElementById('wishlist-count');
    if (wishlistCountElement) {
        wishlistCountElement.textContent = count;
        wishlistCountElement.style.display = count > 0 ? 'block' : 'none';
    }
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = count;
        cartCountElement.style.display = count > 0 ? 'block' : 'none';
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'});
        box-shadow: var(--shadow-large);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}