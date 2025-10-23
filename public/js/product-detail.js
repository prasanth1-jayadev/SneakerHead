// Product Detail Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeProductDetail();
});

function initializeProductDetail() {
    initializeImageGallery();
    initializeColorSelection();
    initializeSizeSelection();
    initializeQuantitySelector();
    initializeAddToCart();
    initializeWishlist();
    initialize360View();
    initializeZoomEffect();
    initializeReviews();
}

// Image Gallery
function initializeImageGallery() {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const newImageSrc = thumbnail.getAttribute('data-image');
            
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumbnail.classList.add('active');
            
            // Fade out main image
            gsap.to(mainImage, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    mainImage.src = newImageSrc;
                    // Fade in new image
                    gsap.to(mainImage, {
                        opacity: 1,
                        duration: 0.2
                    });
                }
            });
        });
    });
}

// Color Selection
function initializeColorSelection() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Add selection animation
            gsap.fromTo(option, 
                { scale: 1 },
                { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 }
            );
            
            // Update main image based on color (if different images available)
            const color = option.getAttribute('data-color');
            updateImageForColor(color);
        });
    });
}

function updateImageForColor(color) {
    // This would typically update the main image based on selected color
    console.log('Selected color:', color);
    
    // For demo purposes, we'll just show a notification
    showColorChangeEffect();
}

function showColorChangeEffect() {
    const mainImage = document.getElementById('main-image');
    
    // Add a subtle color change effect
    gsap.to(mainImage, {
        filter: 'brightness(1.2) saturate(1.3)',
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
    });
}

// Size Selection
function initializeSizeSelection() {
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selected class from all options
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Add selection animation
            gsap.fromTo(option,
                { scale: 1, backgroundColor: 'var(--bg-secondary)' },
                { 
                    scale: 1.05, 
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                }
            );
            
            const size = option.getAttribute('data-size');
            console.log('Selected size:', size);
        });
    });
}

// Quantity Selector
function initializeQuantitySelector() {
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.getElementById('qty-minus');
    const plusBtn = document.getElementById('qty-plus');
    
    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                animateQuantityChange();
            }
        });
    }
    
    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            const maxValue = parseInt(quantityInput.getAttribute('max')) || 10;
            if (currentValue < maxValue) {
                quantityInput.value = currentValue + 1;
                animateQuantityChange();
            }
        });
    }
    
    // Validate input
    if (quantityInput) {
        quantityInput.addEventListener('change', () => {
            const value = parseInt(quantityInput.value);
            const min = parseInt(quantityInput.getAttribute('min')) || 1;
            const max = parseInt(quantityInput.getAttribute('max')) || 10;
            
            if (value < min) quantityInput.value = min;
            if (value > max) quantityInput.value = max;
        });
    }
}

function animateQuantityChange() {
    const quantityInput = document.getElementById('quantity');
    
    gsap.fromTo(quantityInput,
        { scale: 1 },
        { scale: 1.1, duration: 0.1, yoyo: true, repeat: 1 }
    );
}

// Add to Cart
function initializeAddToCart() {
    const addToCartBtn = document.querySelector('.add-to-cart-detail');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const selectedColor = document.querySelector('.color-option.selected');
            const selectedSize = document.querySelector('.size-option.selected');
            const quantity = document.getElementById('quantity').value;
            
            // Validate selections
            if (!selectedColor) {
                showNotification('Please select a color', 'warning');
                highlightMissingSelection('.color-options');
                return;
            }
            
            if (!selectedSize) {
                showNotification('Please select a size', 'warning');
                highlightMissingSelection('.size-options');
                return;
            }
            
            // Add to cart with animation
            addToCartWithAnimation({
                productId: addToCartBtn.getAttribute('data-product-id'),
                color: selectedColor.getAttribute('data-color'),
                size: selectedSize.getAttribute('data-size'),
                quantity: quantity
            });
        });
    }
}

function addToCartWithAnimation(productData) {
    const addToCartBtn = document.querySelector('.add-to-cart-detail');
    const cartBtn = document.getElementById('cart-btn');
    
    // Button animation
    gsap.to(addToCartBtn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
    });
    
    // Create flying shoe animation
    const mainImage = document.getElementById('main-image');
    const flyingShoe = mainImage.cloneNode();
    flyingShoe.style.cssText = `
        position: fixed;
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 50%;
        z-index: 10000;
        pointer-events: none;
    `;
    
    // Position at main image
    const imageRect = mainImage.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();
    
    flyingShoe.style.left = imageRect.left + 'px';
    flyingShoe.style.top = imageRect.top + 'px';
    
    document.body.appendChild(flyingShoe);
    
    // Animate to cart
    gsap.to(flyingShoe, {
        x: cartRect.left - imageRect.left,
        y: cartRect.top - imageRect.top,
        scale: 0.3,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
            document.body.removeChild(flyingShoe);
            
            // Animate cart button
            gsap.to(cartBtn, {
                scale: 1.2,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
            
            // Update cart count
            updateCartCount();
            
            showNotification('Added to cart successfully!', 'success');
        }
    });
    
    // Save to localStorage (in a real app, this would be an API call)
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productData);
    localStorage.setItem('cart', JSON.stringify(cart));
}

function highlightMissingSelection(selector) {
    const element = document.querySelector(selector);
    
    gsap.to(element, {
        x: 10,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        ease: 'power2.inOut'
    });
}

// Wishlist
function initializeWishlist() {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => {
            const icon = wishlistBtn.querySelector('i');
            const isWishlisted = icon.classList.contains('fas');
            
            if (isWishlisted) {
                // Remove from wishlist
                icon.classList.remove('fas');
                icon.classList.add('far');
                wishlistBtn.style.color = 'var(--text-secondary)';
                showNotification('Removed from wishlist', 'info');
            } else {
                // Add to wishlist
                icon.classList.remove('far');
                icon.classList.add('fas');
                wishlistBtn.style.color = 'var(--error)';
                showNotification('Added to wishlist!', 'success');
                
                // Heart animation
                gsap.fromTo(icon,
                    { scale: 1 },
                    { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 }
                );
            }
        });
    }
}

// 360° View
function initialize360View() {
    const view360Btn = document.getElementById('view-360');
    
    if (view360Btn) {
        view360Btn.addEventListener('click', () => {
            start360View();
        });
    }
}

function start360View() {
    const mainImage = document.getElementById('main-image');
    let isRotating = false;
    let rotationAngle = 0;
    
    if (isRotating) return;
    
    isRotating = true;
    showNotification('360° view activated! Drag to rotate', 'info');
    
    // Add rotation cursor
    mainImage.style.cursor = 'grab';
    
    let isDragging = false;
    let startX = 0;
    
    function handleMouseDown(e) {
        isDragging = true;
        startX = e.clientX;
        mainImage.style.cursor = 'grabbing';
    }
    
    function handleMouseMove(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        rotationAngle += deltaX * 0.5;
        
        mainImage.style.transform = `rotateY(${rotationAngle}deg)`;
        startX = e.clientX;
    }
    
    function handleMouseUp() {
        isDragging = false;
        mainImage.style.cursor = 'grab';
    }
    
    // Add event listeners
    mainImage.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Auto-rotate initially
    gsap.to(mainImage, {
        rotationY: 360,
        duration: 3,
        ease: 'none',
        onComplete: () => {
            mainImage.style.transform = 'rotateY(0deg)';
        }
    });
    
    // Stop 360 view after 10 seconds
    setTimeout(() => {
        isRotating = false;
        mainImage.style.cursor = 'default';
        mainImage.style.transform = 'rotateY(0deg)';
        
        // Remove event listeners
        mainImage.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        showNotification('360° view ended', 'info');
    }, 10000);
}

// Zoom Effect
function initializeZoomEffect() {
    const mainImage = document.getElementById('main-image');
    const zoomOverlay = document.getElementById('zoom-overlay');
    
    if (mainImage && zoomOverlay) {
        mainImage.addEventListener('mouseenter', () => {
            zoomOverlay.style.display = 'block';
        });
        
        mainImage.addEventListener('mouseleave', () => {
            zoomOverlay.style.display = 'none';
        });
        
        mainImage.addEventListener('mousemove', (e) => {
            const rect = mainImage.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            zoomOverlay.style.backgroundImage = `url(${mainImage.src})`;
            zoomOverlay.style.backgroundPosition = `${x}% ${y}%`;
            zoomOverlay.style.backgroundSize = '200%';
        });
    }
}

// Reviews
function initializeReviews() {
    // Add review interaction animations
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -5,
                boxShadow: 'var(--shadow-large)',
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
        });
    });
}

// Utility Functions
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'block' : 'none';
    }
}

function showNotification(message, type) {
    // Use the global notification function
    if (window.UrbanLuxury && window.UrbanLuxury.showNotification) {
        window.UrbanLuxury.showNotification(message, type);
    } else {
        // Fallback notification
        alert(message);
    }
}

// Initialize scroll animations for product detail elements
gsap.registerPlugin(ScrollTrigger);

// Animate related products
gsap.from('.related-products-grid .product-card', {
    y: 50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    scrollTrigger: {
        trigger: '.related-products-section',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    }
});

// Animate reviews
gsap.from('.review-card', {
    x: -50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
        trigger: '.reviews-section',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    }
});