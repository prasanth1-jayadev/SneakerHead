// Products Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeProductsPage();
});

function initializeProductsPage() {
    initializeFilters();
    initializeSorting();
    initializeViewToggle();
    initializeLoadMore();
    initializeProductAnimations();
}

// Filter Functionality
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products with animation
            filterProducts(category, productCards);
            
            // Update URL without page reload
            const url = new URL(window.location);
            if (category === 'all') {
                url.searchParams.delete('category');
            } else {
                url.searchParams.set('category', category);
            }
            window.history.pushState({}, '', url);
        });
    });
}

function filterProducts(category, productCards) {
    productCards.forEach((card, index) => {
        const productCategory = card.getAttribute('data-category');
        const shouldShow = category === 'all' || productCategory === category;
        
        if (shouldShow) {
            // Animate in
            gsap.fromTo(card, 
                { 
                    opacity: 0, 
                    y: 30,
                    scale: 0.9
                },
                { 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: 'power2.out'
                }
            );
            card.style.display = 'block';
        } else {
            // Animate out
            gsap.to(card, {
                opacity: 0,
                y: -20,
                scale: 0.9,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    card.style.display = 'none';
                }
            });
        }
    });
}

// Sorting Functionality
function initializeSorting() {
    const sortSelect = document.getElementById('sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortValue = e.target.value;
            sortProducts(sortValue);
            
            // Update URL
            const url = new URL(window.location);
            if (sortValue === 'default') {
                url.searchParams.delete('sort');
            } else {
                url.searchParams.set('sort', sortValue);
            }
            window.history.pushState({}, '', url);
        });
    }
}

function sortProducts(sortValue) {
    const productsGrid = document.getElementById('products-grid');
    const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));
    
    // Sort the cards
    productCards.sort((a, b) => {
        switch (sortValue) {
            case 'price-low':
                return getPrice(a) - getPrice(b);
            case 'price-high':
                return getPrice(b) - getPrice(a);
            case 'rating':
                return getRating(b) - getRating(a);
            default:
                return 0;
        }
    });
    
    // Animate the reordering
    gsap.to(productCards, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.02,
        ease: 'power2.in',
        onComplete: () => {
            // Reorder DOM elements
            productCards.forEach(card => {
                productsGrid.appendChild(card);
            });
            
            // Animate back in
            gsap.fromTo(productCards,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.out'
                }
            );
        }
    });
}

function getPrice(card) {
    const priceElement = card.querySelector('.current-price');
    return parseFloat(priceElement.textContent.replace('$', ''));
}

function getRating(card) {
    const filledStars = card.querySelectorAll('.stars i.filled');
    return filledStars.length;
}

// View Toggle (Grid/List)
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('products-grid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            
            // Update active button
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle view
            if (view === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
            
            // Animate transition
            gsap.fromTo(productsGrid.children,
                { opacity: 0, scale: 0.9 },
                { 
                    opacity: 1, 
                    scale: 1, 
                    duration: 0.4,
                    stagger: 0.03,
                    ease: 'power2.out'
                }
            );
        });
    });
}

// Load More Functionality
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    let currentPage = 1;
    const itemsPerPage = 8;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreProducts();
        });
    }
    
    function loadMoreProducts() {
        // Show loading state
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            const newProducts = generateMockProducts(itemsPerPage);
            appendProducts(newProducts);
            
            // Reset button
            loadMoreBtn.innerHTML = 'Load More Products';
            loadMoreBtn.disabled = false;
            
            currentPage++;
            
            // Hide button after certain number of pages
            if (currentPage >= 5) {
                loadMoreBtn.style.display = 'none';
                showNotification('All products loaded!', 'info');
            }
        }, 1500);
    }
    
    function generateMockProducts(count) {
        const mockProducts = [];
        const brands = ['TechStep', 'GlowStep', 'FutureKick', 'CleanStep', 'UrbanWalk'];
        const categories = ['running', 'casual', 'sports'];
        
        for (let i = 0; i < count; i++) {
            mockProducts.push({
                id: Date.now() + i,
                name: `Shoe Model ${currentPage}-${i + 1}`,
                brand: brands[Math.floor(Math.random() * brands.length)],
                price: Math.floor(Math.random() * 300) + 100,
                rating: (Math.random() * 2 + 3).toFixed(1),
                reviews: Math.floor(Math.random() * 500) + 50,
                category: categories[Math.floor(Math.random() * categories.length)],
                image: `https://picsum.photos/400/400?random=${Date.now() + i}`
            });
        }
        
        return mockProducts;
    }
    
    function appendProducts(products) {
        const productsGrid = document.getElementById('products-grid');
        
        products.forEach((product, index) => {
            const productCard = createProductCard(product);
            productCard.style.opacity = '0';
            productCard.style.transform = 'translateY(30px)';
            
            productsGrid.appendChild(productCard);
            
            // Animate in
            gsap.to(productCard, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.1,
                ease: 'power2.out'
            });
        });
    }
    
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', product.category);
        
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-overlay">
                    <div class="overlay-buttons">
                        <button class="overlay-btn quick-view-btn" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i>
                            <span>Quick View</span>
                        </button>
                        <button class="overlay-btn wishlist-btn" data-product-id="${product.id}">
                            <i class="far fa-heart"></i>
                            <span>Wishlist</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-name">
                    <a href="/product/${product.id}">${product.name}</a>
                </h3>
                
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">(${product.reviews})</span>
                </div>
                
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                </div>
                
                <div class="product-colors">
                    <div class="color-dot" style="background-color: #000"></div>
                    <div class="color-dot" style="background-color: #fff"></div>
                    <div class="color-dot" style="background-color: #00FFD1"></div>
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-bag"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        let starsHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHTML += '<i class="fas fa-star filled"></i>';
            } else {
                starsHTML += '<i class="fas fa-star"></i>';
            }
        }
        
        return starsHTML;
    }
}

// Product Animations
function initializeProductAnimations() {
    // Hover effects for product cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const image = card.querySelector('.product-image');
        const overlay = card.querySelector('.product-overlay');
        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                boxShadow: 'var(--shadow-large)',
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(image, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(overlay, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: 'var(--shadow-small)',
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(image, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Scroll animations
    gsap.from('.product-card', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.products-grid',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Quick View Modal
function openQuickView(productId) {
    const modal = document.getElementById('quick-view-modal');
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

// Close modal functionality
document.addEventListener('click', (e) => {
    const modal = document.getElementById('quick-view-modal');
    
    if (e.target.id === 'modal-overlay' || e.target.id === 'modal-close') {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Quick view button clicks
    if (e.target.classList.contains('quick-view-btn') || 
        e.target.closest('.quick-view-btn')) {
        
        const btn = e.target.classList.contains('quick-view-btn') ? 
                    e.target : e.target.closest('.quick-view-btn');
        
        const productId = btn.getAttribute('data-product-id');
        openQuickView(productId);
    }
});

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('quick-view-modal');
    
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Add CSS for list view
const listViewCSS = `
.products-grid.list-view {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.products-grid.list-view .product-card {
    display: flex;
    align-items: center;
    padding: var(--spacing-lg);
    background: var(--bg-secondary);
}

.products-grid.list-view .product-image-container {
    width: 150px;
    height: 150px;
    flex-shrink: 0;
    margin-right: var(--spacing-lg);
}

.products-grid.list-view .product-info {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.products-grid.list-view .product-actions {
    margin-left: var(--spacing-lg);
}

.quick-view-loading {
    text-align: center;
    padding: var(--spacing-3xl);
    color: var(--text-secondary);
}

.quick-view-loading i {
    font-size: 2rem;
    color: var(--accent-primary);
    margin-bottom: var(--spacing-lg);
}

.quick-view-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-2xl);
    padding: var(--spacing-2xl);
    max-width: 800px;
}

.quick-view-image img {
    width: 100%;
    height: auto;
    border-radius: var(--radius-md);
}

.quick-view-info h2 {
    margin-bottom: var(--spacing-md);
}

.quick-view-rating {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
}

.quick-view-price {
    margin-bottom: var(--spacing-lg);
}

.quick-view-price .current-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-primary);
    margin-right: var(--spacing-sm);
}

.quick-view-price .original-price {
    text-decoration: line-through;
    color: var(--text-muted);
}

.quick-view-description {
    margin-bottom: var(--spacing-xl);
    line-height: 1.6;
}

.quick-view-actions {
    display: flex;
    gap: var(--spacing-md);
}

@media (max-width: 768px) {
    .quick-view-grid {
        grid-template-columns: 1fr;
        padding: var(--spacing-lg);
    }
    
    .products-grid.list-view .product-card {
        flex-direction: column;
        text-align: center;
    }
    
    .products-grid.list-view .product-image-container {
        margin-right: 0;
        margin-bottom: var(--spacing-lg);
    }
    
    .products-grid.list-view .product-info {
        flex-direction: column;
        align-items: center;
    }
    
    .products-grid.list-view .product-actions {
        margin-left: 0;
        margin-top: var(--spacing-lg);
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = listViewCSS;
document.head.appendChild(style);

// Utility function for notifications
function showNotification(message, type) {
    if (window.UrbanLuxury && window.UrbanLuxury.showNotification) {
        window.UrbanLuxury.showNotification(message, type);
    }
}