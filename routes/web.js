const express = require('express');
const router = express.Router();

// Import controllers
const HomeController = require('../controllers/HomeController');
const AuthController = require('../controllers/AuthController');
const ProductController = require('../controllers/ProductController');

// Import middleware
const { requireAuth, redirectIfAuthenticated } = require('../middleware/auth');

// Home routes
router.get('/', HomeController.index);
router.get('/about', HomeController.about);
router.get('/contact', HomeController.contact);
router.get('/cart', HomeController.cart);
router.get('/wishlist', HomeController.wishlist);

// Authentication routes
router.get('/login', redirectIfAuthenticated, AuthController.showLogin);
router.post('/login', AuthController.login);
router.get('/signup', redirectIfAuthenticated, AuthController.showSignup);
router.post('/signup', AuthController.signup);
router.get('/logout', AuthController.logout);

// Product routes
router.get('/products', ProductController.index);
router.get('/product/:id', ProductController.show);
router.get('/search', ProductController.searchResults);

// API routes
router.get('/api/search', ProductController.search);
router.get('/api/product/:id', ProductController.getProduct);

// Track order (mock)
router.get('/track/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    res.render('track-order', { 
        orderId,
        user: req.session.user || null,
        title: `Track Order ${orderId} - Sneaker Head`
    });
});

module.exports = router;