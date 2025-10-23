// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    initializeContactForm();
    initializeFAQ();
    initializeMap();
    initializeAnimations();
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    fetch('/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showSuccessMessage();
            e.target.reset();
            
            // Add success animation
            gsap.fromTo(e.target,
                { scale: 1 },
                { 
                    scale: 1.02, 
                    duration: 0.2, 
                    yoyo: true, 
                    repeat: 1,
                    ease: 'power2.inOut'
                }
            );
        } else {
            showErrorMessage(result.message || 'Something went wrong. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('Network error. Please check your connection and try again.');
    })
    .finally(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function validateForm(data) {
    let isValid = true;
    
    // Required field validation
    const requiredFields = ['name', 'email', 'subject', 'message'];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Email validation
    if (data.email && !validateEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Message length validation
    if (data.message && data.message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous errors
    clearFieldError(e);
    
    // Validate based on field type
    switch (fieldName) {
        case 'name':
            if (!value) {
                showFieldError(fieldName, 'Name is required');
            } else if (value.length < 2) {
                showFieldError(fieldName, 'Name must be at least 2 characters');
            }
            break;
            
        case 'email':
            if (!value) {
                showFieldError(fieldName, 'Email is required');
            } else if (!validateEmail(value)) {
                showFieldError(fieldName, 'Please enter a valid email address');
            }
            break;
            
        case 'phone':
            if (value && !validatePhone(value)) {
                showFieldError(fieldName, 'Please enter a valid phone number');
            }
            break;
            
        case 'message':
            if (!value) {
                showFieldError(fieldName, 'Message is required');
            } else if (value.length < 10) {
                showFieldError(fieldName, 'Message must be at least 10 characters');
            }
            break;
    }
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    // Remove existing error
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error styling
    field.style.borderColor = 'var(--error)';
    
    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--error);
        font-size: 0.875rem;
        margin-top: var(--spacing-xs);
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    `;
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    formGroup.appendChild(errorElement);
    
    // Animate error
    gsap.fromTo(errorElement,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
}

function clearFieldError(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.field-error');
    
    if (errorElement) {
        gsap.to(errorElement, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => errorElement.remove()
        });
    }
    
    // Reset field styling
    field.style.borderColor = '';
}

function showSuccessMessage() {
    const message = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
        </div>
    `;
    
    showModal(message, 'success');
}

function showErrorMessage(message) {
    const errorHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Oops! Something went wrong</h3>
            <p>${message}</p>
        </div>
    `;
    
    showModal(errorHTML, 'error');
}

function showModal(content, type) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content ${type}">
            ${content}
            <button class="modal-close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Style modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    gsap.fromTo(modal.querySelector('.modal-content'),
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
    
    // Close functionality
    const closeBtn = modal.querySelector('.modal-close-btn');
    const overlay = modal.querySelector('.modal-overlay');
    
    [closeBtn, overlay].forEach(element => {
        element.addEventListener('click', () => {
            gsap.to(modal.querySelector('.modal-content'), {
                scale: 0.8,
                opacity: 0,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => document.body.removeChild(modal)
            });
        });
    });
    
    // Auto close after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            if (document.body.contains(modal)) {
                closeBtn.click();
            }
        }, 5000);
    }
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
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        
                        if (otherAnswer && otherIcon) {
                            gsap.to(otherAnswer, {
                                height: 0,
                                opacity: 0,
                                duration: 0.3,
                                ease: 'power2.inOut',
                                onComplete: () => {
                                    otherAnswer.style.display = 'none';
                                    otherAnswer.style.height = 'auto';
                                }
                            });
                            
                            gsap.to(otherIcon, {
                                rotation: 0,
                                duration: 0.3,
                                ease: 'power2.inOut'
                            });
                        }
                    }
                });
                
                // Toggle current item
                if (!isOpen) {
                    answer.style.display = 'block';
                    const height = answer.scrollHeight;
                    
                    gsap.fromTo(answer,
                        { height: 0, opacity: 0 },
                        { 
                            height: height,
                            opacity: 1,
                            duration: 0.4,
                            ease: 'power2.out',
                            onComplete: () => {
                                answer.style.height = 'auto';
                            }
                        }
                    );
                    
                    gsap.to(icon, {
                        rotation: 180,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    });
                } else {
                    gsap.to(answer, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            answer.style.display = 'none';
                            answer.style.height = 'auto';
                        }
                    });
                    
                    gsap.to(icon, {
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    });
                }
            });
        }
    });
}

// Map Initialization
function initializeMap() {
    const mapContainer = document.getElementById('store-map');
    
    if (mapContainer) {
        // Simulate map loading
        setTimeout(() => {
            const placeholder = mapContainer.querySelector('.map-placeholder');
            
            if (placeholder) {
                // Add interactive elements to placeholder
                placeholder.innerHTML = `
                    <div class="map-interactive">
                        <i class="fas fa-map-marked-alt"></i>
                        <h3>Urban Luxury Store</h3>
                        <p>123 Urban Street<br>Fashion District, NY 10001</p>
                        <div class="map-actions">
                            <button class="btn btn-primary btn-small" onclick="openDirections()">
                                <i class="fas fa-directions"></i>
                                Get Directions
                            </button>
                            <button class="btn btn-outline btn-small" onclick="callStore()">
                                <i class="fas fa-phone"></i>
                                Call Store
                            </button>
                        </div>
                    </div>
                `;
                
                // Add some animation
                gsap.fromTo(placeholder.children,
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.5,
                        stagger: 0.1,
                        ease: 'power2.out'
                    }
                );
            }
        }, 1000);
    }
}

// Map Actions
function openDirections() {
    const address = "123 Urban Street, Fashion District, NY 10001";
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
}

function callStore() {
    window.location.href = 'tel:+15551234567';
}

// Page Animations
function initializeAnimations() {
    // Animate contact items on scroll
    gsap.from('.contact-item', {
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-items',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Animate form elements
    gsap.from('.form-group', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Animate social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                scale: 1.1,
                y: -5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Animate store hours
    gsap.from('.hours-item', {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.hours-grid',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
}

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Add custom CSS for modal and form validation
const contactCSS = `
.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
}

.modal-content {
    position: relative;
    background: var(--bg-primary);
    padding: var(--spacing-2xl);
    border-radius: var(--radius-lg);
    max-width: 500px;
    margin: 0 var(--spacing-lg);
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-content.success {
    border-left: 4px solid var(--success);
}

.modal-content.error {
    border-left: 4px solid var(--error);
}

.success-message i {
    font-size: 3rem;
    color: var(--success);
    margin-bottom: var(--spacing-lg);
}

.error-message i {
    font-size: 3rem;
    color: var(--error);
    margin-bottom: var(--spacing-lg);
}

.success-message h3,
.error-message h3 {
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
}

.success-message p,
.error-message p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
}

.modal-close-btn {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.25rem;
    cursor: pointer;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-normal);
}

.modal-close-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.field-error {
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.map-interactive {
    text-align: center;
    padding: var(--spacing-xl);
    color: var(--text-primary);
}

.map-interactive i {
    font-size: 3rem;
    color: var(--accent-primary);
    margin-bottom: var(--spacing-lg);
}

.map-interactive h3 {
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
}

.map-interactive p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xl);
    line-height: 1.5;
}

.map-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
}

@media (max-width: 480px) {
    .map-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .modal-content {
        margin: 0 var(--spacing-md);
        padding: var(--spacing-lg);
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = contactCSS;
document.head.appendChild(style);