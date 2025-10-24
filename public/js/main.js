// Urban Luxury - Main JavaScript File

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initializeScrollAnimations();
    }

    // Initialize all components
    initializeNavigation();
    initializeThemeToggle();
    initializeCart();
    initializeSearch();
    initializeProductCards();
    initializeNewsletterForms();
    initializeFAQ();
    initializeLoadingScreen();
    initializeScrollEffects();
    initializeMobileMenu();
    
    // Initialize page-specific features
    if (window.location.pathname === '/') {
        initializeHeroAnimations();
    }
    
    // Initialize wishlist icons based on current wishlist
    initializeWishlistIcons();
    
    // Update cart count on page load
    updateCartCount();
}

// Loading Screen
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1000);
    });
}

// Navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    // Navbar scroll effects
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Active link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.classList.toggle('mobile-menu-open');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-toggle')) {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
            });
        });
    }
}

// Theme Toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        // Update icon based on current theme
        updateThemeIcon(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Add transition effect
            body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                body.style.transition = '';
            }, 300);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Cart Functionality
function initializeCart() {
    // Update cart count on page load
    updateCartCount();
    updateWishlistCount();
    
    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn') || 
            e.target.closest('.add-to-cart-btn')) {
            
            const btn = e.target.classList.contains('add-to-cart-btn') ? 
                        e.target : e.target.closest('.add-to-cart-btn');
            
            const productId = parseInt(btn.getAttribute('data-product-id'));
            addToCartFromPage(productId, btn);
        }
        
        // Wishlist buttons
        if (e.target.classList.contains('wishlist-btn') || 
            e.target.closest('.wishlist-btn')) {
            
            const btn = e.target.classList.contains('wishlist-btn') ? 
                        e.target : e.target.closest('.wishlist-btn');
            
            // Skip if it's the navbar wishlist link
            if (btn.href) return;
            
            const productId = parseInt(btn.getAttribute('data-product-id'));
            toggleWishlistFromPage(productId, btn);
        }
    });
    
    function addToCartFromPage(productId, btn) {
        // Get product data (you might want to fetch this from server)
        const productData = getProductDataById(productId);
        
        if (!productData) {
            showNotification('Product not found!', 'error');
            return;
        }
        
        let cart = getCart();
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showNotification('Quantity updated in cart!', 'success');
        } else {
            cart.push({
                id: productData.id,
                name: productData.name,
                brand: productData.brand,
                price: productData.price,
                image: productData.image,
                selectedColor: 'Default',
                selectedSize: 'M',
                quantity: 1
            });
            showNotification('Added to cart! 🛒', 'success');
        }
        
        saveCart(cart);
        updateCartCount();
        
        // Animate button
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
    }
    
    function toggleWishlistFromPage(productId, btn) {
        const productData = getProductDataById(productId);
        
        if (!productData) {
            showNotification('Product not found!', 'error');
            return;
        }
        
        let wishlist = getWishlist();
        const existingItem = wishlist.find(item => item.id === productId);
        
        if (existingItem) {
            // Remove from wishlist
            wishlist = wishlist.filter(item => item.id !== productId);
            saveWishlist(wishlist);
            updateWishlistIcon(btn, false);
            showNotification('Removed from wishlist', 'info');
        } else {
            // Add to wishlist
            wishlist.push({
                id: productData.id,
                name: productData.name,
                brand: productData.brand,
                price: productData.price,
                image: productData.image,
                dateAdded: new Date().toISOString()
            });
            saveWishlist(wishlist);
            updateWishlistIcon(btn, true);
            showNotification('Added to wishlist! ❤️', 'success');
        }
        
        updateWishlistCount();
    }
    
    function updateWishlistIcon(btn, isInWishlist) {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
            btn.style.color = isInWishlist ? '#FF4757' : '';
        }
    }
    
    function getProductDataById(productId) {
        // This is a simplified version - in a real app, you'd fetch from server
        const products = [
            {id: 1, name: "Air Max Street Pro", brand: "SneakerHead", price: 299, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&crop=center"},
            {id: 2, name: "Neon Boost Runner", brand: "SneakerHead", price: 249, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop&crop=center"},
            {id: 3, name: "Jordan Retro Elite", brand: "SneakerHead", price: 399, image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=500&h=500&fit=crop&crop=center"},
            {id: 4, name: "Classic White Minimalist", brand: "SneakerHead", price: 199, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&crop=center"},

            {id: 5, name: "Vans Skate Pro", brand: "SneakerHead", price: 179, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop&crop=center"},
            {id: 6, name: "Adidas Ultra Boost", brand: "SneakerHead", price: 329, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&crop=center"},
            {id: 7, name: "Puma RS-X Futuristic", brand: "SneakerHead", price: 219, image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&h=500&fit=crop&crop=center"},
            {id: 8, name: "New Balance 990v5", brand: "SneakerHead", price: 289, image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&h=500&fit=crop&crop=center"},
            {id: 9, name: "Yeezy Boost 350 V2", brand: "SneakerHead", price: 449, image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=500&fit=crop&crop=center"},
            {id: 10, name: "Reebok Classic Leather", brand: "SneakerHead", price: 139, image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500&h=500&fit=crop&crop=center"},

        ];
        
        return products.find(p => p.id === productId);
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
    
    function updateWishlistCount() {
        const wishlist = getWishlist();
        const count = wishlist.length;
        const wishlistCountElement = document.getElementById('wishlist-count');
        
        if (wishlistCountElement) {
            wishlistCountElement.textContent = count;
            wishlistCountElement.style.display = count > 0 ? 'block' : 'none';
        }
    }
    
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }
    
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function getWishlist() {
        return JSON.parse(localStorage.getItem('wishlist')) || [];
    }
    
    function saveWishlist(wishlist) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

// Helper functions that need to be available globally
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    const mobileSearchInput = document.querySelector('.mobile-search input');
    const mobileSearchBtn = document.querySelector('.mobile-search button');
    
    // Desktop search
    if (searchInput) {
        // Live search as user types
        searchInput.addEventListener('input', debounce(handleLiveSearch, 300));
        
        // Show suggestions as user types
        searchInput.addEventListener('input', debounce(showSearchSuggestions, 200));
        
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value);
                hideSearchSuggestions();
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-search')) {
                hideSearchSuggestions();
            }
        });
        
        // Handle keyboard navigation in suggestions
        searchInput.addEventListener('keydown', handleSuggestionNavigation);
    }
    
    // Desktop search button
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
    }
    
    // Mobile search
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(mobileSearchInput.value);
            }
        });
    }
    
    if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', () => {
            performSearch(mobileSearchInput.value);
        });
    }
    
    function handleLiveSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        
        // Only perform live search on homepage and products page
        if (window.location.pathname !== '/' && window.location.pathname !== '/products') {
            return;
        }
        
        if (query.length >= 2) {
            // Perform live search on current page
            const productCards = document.querySelectorAll('.product-card');
            let visibleCount = 0;
            
            productCards.forEach(card => {
                const productName = card.querySelector('.product-name');
                const productBrand = card.querySelector('.product-brand');
                
                if (productName && productBrand) {
                    const name = productName.textContent.toLowerCase();
                    const brand = productBrand.textContent.toLowerCase();
                    
                    if (name.includes(query) || brand.includes(query)) {
                        card.style.display = 'block';
                        card.style.border = '2px solid var(--accent-primary)';
                        card.style.transform = 'scale(1.02)';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
            
            // Show search results count
            showSearchResultsCount(visibleCount, query);
            
        } else if (query.length === 0) {
            // Reset all products
            resetProductDisplay();
        }
    }
    
    function performSearch(query) {
        if (!query || query.trim().length < 2) {
            showNotification('Please enter at least 2 characters to search', 'warning');
            return;
        }
        
        // Redirect to search results page
        window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
    
    function resetProductDisplay() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.display = 'block';
            card.style.border = '';
            card.style.transform = '';
        });
        
        // Hide search results count
        hideSearchResultsCount();
    }
    
    function showSearchResultsCount(count, query) {
        // Remove existing count if any
        hideSearchResultsCount();
        
        // Create and show new count
        const countElement = document.createElement('div');
        countElement.id = 'search-results-count';
        countElement.innerHTML = `
            <div style="
                position: fixed;
                top: 80px;
                right: 20px;
                background: var(--bg-secondary);
                color: var(--text-primary);
                padding: 0.75rem 1rem;
                border-radius: 0.5rem;
                border-left: 4px solid var(--accent-primary);
                box-shadow: var(--shadow-medium);
                z-index: 1000;
                font-size: 0.875rem;
            ">
                <i class="fas fa-search"></i>
                ${count} result${count !== 1 ? 's' : ''} for "${query}"
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    margin-left: 0.5rem;
                    cursor: pointer;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(countElement);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideSearchResultsCount();
        }, 5000);
    }
    
    function hideSearchResultsCount() {
        const existingCount = document.getElementById('search-results-count');
        if (existingCount) {
            existingCount.remove();
        }
    }
    
    function showSearchSuggestions(e) {
        const query = e.target.value.toLowerCase().trim();
        const suggestionsContainer = document.getElementById('search-suggestions');
        
        if (!suggestionsContainer) return;
        
        if (query.length < 2) {
            hideSearchSuggestions();
            return;
        }
        
        // Get suggestions from product data
        const suggestions = getSuggestions(query);
        
        if (suggestions.length === 0) {
            suggestionsContainer.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    No suggestions found
                </div>
            `;
        } else {
            suggestionsContainer.innerHTML = suggestions.map(suggestion => `
                <div class="search-suggestion-item" onclick="selectSuggestion('${suggestion.text}')">
                    <i class="fas fa-${suggestion.icon} suggestion-icon"></i>
                    <span class="suggestion-text">${suggestion.text}</span>
                    <span class="suggestion-category">${suggestion.category}</span>
                </div>
            `).join('');
        }
        
        suggestionsContainer.style.display = 'block';
    }
    
    function hideSearchSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }
    
    function getSuggestions(query) {
        const suggestions = [];
        const products = [
            {id: 1, name: "Air Max Street Pro", brand: "SneakerHead", category: "Running"},
            {id: 2, name: "Neon Boost Runner", brand: "SneakerHead", category: "Casual"},
            {id: 3, name: "Jordan Retro Elite", brand: "SneakerHead", category: "Sports"},
            {id: 4, name: "Classic White Minimalist", brand: "SneakerHead", category: "Casual"},
            {id: 5, name: "Vans Skate Pro", brand: "SneakerHead", category: "Sports"},
            {id: 6, name: "Adidas Ultra Boost", brand: "SneakerHead", category: "Running"},
            {id: 7, name: "Puma RS-X Futuristic", brand: "SneakerHead", category: "Casual"},
            {id: 8, name: "New Balance 990v5", brand: "SneakerHead", category: "Running"},
            {id: 9, name: "Yeezy Boost 350 V2", brand: "SneakerHead", category: "Casual"},
            {id: 10, name: "Reebok Classic Leather", brand: "SneakerHead", category: "Casual"},

        ];
        
        // Product name suggestions
        products.forEach(product => {
            if (product.name.toLowerCase().includes(query)) {
                suggestions.push({
                    text: product.name,
                    category: product.category,
                    icon: 'shoe-prints',
                    type: 'product'
                });
            }
        });
        
        // Brand suggestions
        const brands = ['Nike', 'Adidas', 'Jordan', 'Vans', 'Puma', 'New Balance', 'Yeezy', 'Reebok', 'ASICS'];
        brands.forEach(brand => {
            if (brand.toLowerCase().includes(query)) {
                suggestions.push({
                    text: brand,
                    category: 'Brand',
                    icon: 'tag',
                    type: 'brand'
                });
            }
        });
        
        // Category suggestions
        const categories = ['Running', 'Casual', 'Sports', 'Basketball', 'Lifestyle'];
        categories.forEach(category => {
            if (category.toLowerCase().includes(query)) {
                suggestions.push({
                    text: category,
                    category: 'Category',
                    icon: 'list',
                    type: 'category'
                });
            }
        });
        
        // Color suggestions
        const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Yellow', 'Grey'];
        colors.forEach(color => {
            if (color.toLowerCase().includes(query)) {
                suggestions.push({
                    text: color,
                    category: 'Color',
                    icon: 'palette',
                    type: 'color'
                });
            }
        });
        
        // Remove duplicates and limit to 8 suggestions
        const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
            index === self.findIndex(s => s.text === suggestion.text)
        );
        
        return uniqueSuggestions.slice(0, 8);
    }
    
    function handleSuggestionNavigation(e) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer || suggestionsContainer.style.display === 'none') return;
        
        const suggestions = suggestionsContainer.querySelectorAll('.search-suggestion-item');
        let currentIndex = Array.from(suggestions).findIndex(s => s.classList.contains('highlighted'));
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = currentIndex < suggestions.length - 1 ? currentIndex + 1 : 0;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = currentIndex > 0 ? currentIndex - 1 : suggestions.length - 1;
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            suggestions[currentIndex].click();
            return;
        } else if (e.key === 'Escape') {
            hideSearchSuggestions();
            return;
        }
        
        // Update highlighting
        suggestions.forEach((s, i) => {
            s.classList.toggle('highlighted', i === currentIndex);
            if (i === currentIndex) {
                s.style.background = 'var(--accent-primary)';
                s.style.color = 'var(--bg-primary)';
            } else {
                s.style.background = '';
                s.style.color = '';
            }
        });
    }
    
    // Global function for suggestion selection
    window.selectSuggestion = function(text) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = text;
            performSearch(text);
        }
        hideSearchSuggestions();
    };
}

// Initialize wishlist icons based on current wishlist
function initializeWishlistIcons() {
    const wishlist = getWishlist();
    const wishlistButtons = document.querySelectorAll('.wishlist-btn[data-product-id]');
    
    wishlistButtons.forEach(btn => {
        const productId = parseInt(btn.getAttribute('data-product-id'));
        const isInWishlist = wishlist.some(item => item.id === productId);
        updateWishlistIcon(btn, isInWishlist);
    });
}

function updateWishlistIcon(btn, isInWishlist) {
    const icon = btn.querySelector('i');
    if (icon) {
        icon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
        btn.style.color = isInWishlist ? '#FF4757' : '';
        
        // Update button title
        btn.title = isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist';
    }
}

// Product Cards
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Quick view functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-view-btn') || 
            e.target.closest('.quick-view-btn')) {
            
            const btn = e.target.classList.contains('quick-view-btn') ? 
                        e.target : e.target.closest('.quick-view-btn');
            
            const productId = btn.getAttribute('data-product-id');
            openQuickView(productId);
        }
    });
}

// Quick View Modal
function openQuickView(productId) {
    // Check if we're on a page with the quick view modal
    const modal = document.getElementById('quick-view-modal');
    
    if (!modal) {
        // If no modal exists, redirect to product page
        window.location.href = `/product/${productId}`;
        return;
    }
    
    const modalContent = document.getElementById('quick-view-content');
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Show loading state
    modalContent.innerHTML = `
        <div class="quick-view-loading">
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
            <p>Loading product details...</p>
        </div>
    `;
    
    // Fetch real product data
    fetch(`/api/product/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Product not found');
            }
            return response.json();
        })
        .then(product => {
            modalContent.innerHTML = generateQuickViewContent(product);
            initializeQuickViewInteractions();
        })
        .catch(error => {
            console.error('Error loading product:', error);
            modalContent.innerHTML = `
                <div class="quick-view-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Product</h3>
                    <p>Sorry, we couldn't load the product details. Please try again.</p>
                    <button class="btn btn-primary" onclick="closeQuickView()">Close</button>
                </div>
            `;
        });
}

function generateQuickViewContent(product) {
    const discountPercentage = product.originalPrice > product.price ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    const starsHTML = Array.from({length: 5}, (_, i) => 
        `<i class="fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}"></i>`
    ).join('');
    
    const colorsHTML = product.colorCodes.map((color, index) => 
        `<div class="color-option" style="background-color: ${color}" title="${product.colors[index]}"></div>`
    ).join('');
    
    const sizesHTML = product.sizes.map(size => 
        `<div class="size-option" data-size="${size}">${size}</div>`
    ).join('');
    
    return `
        <div class="quick-view-grid">
            <div class="quick-view-image">
                <img src="${product.image}" alt="${product.name}" class="main-quick-image">
                <div class="quick-view-thumbnails">
                    ${product.images.slice(0, 3).map(img => 
                        `<img src="${img}" alt="${product.name}" class="thumbnail-quick" onclick="changeQuickViewImage('${img}')">`
                    ).join('')}
                </div>
            </div>
            <div class="quick-view-info">
                <div class="quick-view-brand">${product.brand}</div>
                <h2 class="quick-view-title">${product.name}</h2>
                
                <div class="quick-view-badges">
                    ${product.new ? '<span class="badge new">New</span>' : ''}
                    ${product.trending ? '<span class="badge trending">🔥 Hot</span>' : ''}
                    ${discountPercentage > 0 ? `<span class="badge sale">-${discountPercentage}%</span>` : ''}
                </div>
                
                <div class="quick-view-rating">
                    <div class="stars">${starsHTML}</div>
                    <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                </div>
                
                <div class="quick-view-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                
                <p class="quick-view-description">${product.description}</p>
                
                <div class="quick-view-options">
                    <div class="option-group">
                        <label>Colors:</label>
                        <div class="color-options">${colorsHTML}</div>
                    </div>
                    
                    <div class="option-group">
                        <label>Sizes:</label>
                        <div class="size-options">${sizesHTML}</div>
                    </div>
                </div>
                
                <div class="quick-view-details">
                    <div class="detail-item">
                        <span class="label">Material:</span>
                        <span class="value">${product.material}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Weight:</span>
                        <span class="value">${product.weight}</span>
                    </div>
                </div>
                
                <div class="quick-view-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-bag"></i>
                        Add to Cart - $${product.price}
                    </button>
                    <button class="btn btn-outline wishlist-btn" data-product-id="${product.id}">
                        <i class="far fa-heart"></i>
                        Wishlist
                    </button>
                    <a href="/product/${product.id}" class="btn btn-secondary">
                        <i class="fas fa-info-circle"></i>
                        Full Details
                    </a>
                </div>
            </div>
        </div>
    `;
}

function initializeQuickViewInteractions() {
    // Color selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    // Size selection
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}

// Function to change quick view image
function changeQuickViewImage(imageSrc) {
    const mainImage = document.querySelector('.main-quick-image');
    if (mainImage) {
        mainImage.src = imageSrc;
        
        // Update thumbnail selection
        document.querySelectorAll('.thumbnail-quick').forEach(thumb => {
            thumb.classList.remove('active');
            if (thumb.src === imageSrc) {
                thumb.classList.add('active');
            }
        });
    }
}

// Function to close quick view
function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Make functions globally available
window.changeQuickViewImage = changeQuickViewImage;
window.closeQuickView = closeQuickView;

// Newsletter Forms
function initializeNewsletterForms() {
    const newsletterForms = document.querySelectorAll('#newsletter-form, #footer-newsletter');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                // Simulate API call
                setTimeout(() => {
                    showNotification('Thanks for subscribing!', 'success');
                    form.reset();
                }, 1000);
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    });
}

// FAQ Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = answer.style.display === 'block';
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    if (otherAnswer && otherIcon) {
                        otherAnswer.style.display = 'none';
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current item
                if (!isOpen) {
                    answer.style.display = 'block';
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    answer.style.display = 'none';
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        }
    });
}

// Hero Animations
function initializeHeroAnimations() {
    const heroShoe = document.querySelector('.floating-shoe');
    
    if (heroShoe) {
        // Add mouse movement parallax effect
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 20 - 10;
            const y = (e.clientY / window.innerHeight) * 20 - 10;
            
            gsap.to(heroShoe, {
                x: x,
                y: y,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }
}

// Scroll Animations with GSAP
function initializeScrollAnimations() {
    // Parallax effect for hero section
    gsap.to('.hero-background', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Stagger animation for product cards
    gsap.from('.product-card', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.product-grid',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseInt(finalValue.replace(/\D/g, ''));
        
        if (numericValue) {
            gsap.from(stat, {
                textContent: 0,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                onUpdate: function() {
                    const current = Math.ceil(this.targets()[0].textContent);
                    if (finalValue.includes('K')) {
                        stat.textContent = current + 'K+';
                    } else if (finalValue.includes('★')) {
                        stat.textContent = (current / 10).toFixed(1) + '★';
                    } else {
                        stat.textContent = current + (finalValue.includes('+') ? '+' : '');
                    }
                }
            });
        }
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Scroll to top button
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTop.className = 'scroll-to-top';
    scrollToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        background: var(--accent-primary);
        color: var(--bg-primary);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(scrollToTop);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTop.style.opacity = '1';
            scrollToTop.style.visibility = 'visible';
        } else {
            scrollToTop.style.opacity = '0';
            scrollToTop.style.visibility = 'hidden';
        }
    });
    
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
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
        border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'});
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
            document.body.removeChild(notification);
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.product-card, .story-section, .stat-item');
    animateElements.forEach(el => observer.observe(el));
});

// Performance optimization: Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Export functions for use in other files
window.UrbanLuxury = {
    showNotification,
    addToCart: (productId) => {
        // This would be called from product detail pages
        console.log('Adding to cart:', productId);
    },
    openQuickView
};

// Cart Management Functions
async function addToCart(productId, quantity = 1) {
    try {
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });

        const data = await response.json();
        
        if (data.success) {
            // Update cart count
            updateCartCount();
            
            // Show success message
            showNotification('Item added to cart successfully!', 'success');
            
            // Update button state
            const addButton = document.querySelector(`[data-product-id="${productId}"] .add-to-cart-btn`);
            if (addButton) {
                addButton.innerHTML = '<i class="fas fa-check"></i> Added';
                addButton.classList.add('added');
                setTimeout(() => {
                    addButton.innerHTML = '<i class="fas fa-shopping-bag"></i>';
                    addButton.classList.remove('added');
                }, 2000);
            }
        } else {
            showNotification(data.error || 'Failed to add item to cart', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('An error occurred while adding to cart', 'error');
    }
}

async function updateCartCount() {
    try {
        const response = await fetch('/api/cart/count');
        const data = await response.json();
        
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = data.cartCount || 0;
            
            // Add animation when count changes
            if (data.cartCount > 0) {
                cartCountElement.style.display = 'flex';
                cartCountElement.classList.add('bounce');
                setTimeout(() => {
                    cartCountElement.classList.remove('bounce');
                }, 300);
            } else {
                cartCountElement.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Add event listeners for add to cart buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.add-to-cart-btn')) {
        e.preventDefault();
        const button = e.target.closest('.add-to-cart-btn');
        const productId = button.dataset.productId;
        
        if (productId) {
            addToCart(productId);
        }
    }
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                background: var(--bg-secondary);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 1rem;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
            }
            
            .notification-success {
                border-left: 4px solid var(--accent-primary);
            }
            
            .notification-error {
                border-left: 4px solid var(--error);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--text-primary);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                margin-left: auto;
                padding: 0.25rem;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Profile dropdown functionality
document.addEventListener('click', function(e) {
    const profileBtn = e.target.closest('.profile-btn');
    const dropdown = document.querySelector('.nav-dropdown');
    
    if (profileBtn && dropdown) {
        e.preventDefault();
        dropdown.classList.toggle('active');
    } else if (!e.target.closest('.nav-dropdown')) {
        // Close dropdown when clicking outside
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }
});

// Add CSS for profile dropdown if not already added
if (!document.querySelector('#profile-dropdown-styles')) {
    const styles = document.createElement('style');
    styles.id = 'profile-dropdown-styles';
    styles.textContent = `
        .nav-dropdown {
            position: relative;
        }
        
        .profile-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 0.5rem;
        }
        
        .profile-name {
            display: none;
        }
        
        .dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--bg-secondary);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 0.5rem 0;
            min-width: 200px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .nav-dropdown.active .dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .dropdown-item:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
        }
        
        .dropdown-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
            margin: 0.5rem 0;
        }
        
        @media (min-width: 768px) {
            .profile-name {
                display: inline;
            }
        }
    `;
    document.head.appendChild(styles);
}