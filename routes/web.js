const express = require('express');
const router = express.Router();

// Import controllers
const HomeController = require('../controllers/HomeController');
const AuthController = require('../controllers/AuthController');
const ProductController = require('../controllers/ProductController');
const UserController = require('../controllers/UserController');
const AddressController = require('../controllers/AddressController');
const CartController = require('../controllers/CartController');
const CheckoutController = require('../controllers/CheckoutController');

// Import middleware
const { requireAuth, redirectIfAuthenticated } = require('../middleware/auth');

// Home routes
router.get('/', HomeController.index);
router.get('/about', HomeController.about);
router.get('/contact', HomeController.contact);
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

// User profile routes
router.get('/user/profile', requireAuth, UserController.profile);
router.get('/user/edit-profile', requireAuth, UserController.showEditProfile);
router.post('/user/edit-profile', requireAuth, UserController.updateProfile);
router.get('/user/change-password', requireAuth, UserController.showChangePassword);
router.post('/user/change-password', requireAuth, UserController.changePassword);

// User orders routes
router.get('/user/orders', requireAuth, UserController.orders);
router.get('/user/orders/:id', requireAuth, UserController.orderDetail);
router.post('/user/orders/:id/cancel', requireAuth, UserController.cancelOrder);
router.post('/user/orders/:id/return', requireAuth, UserController.returnOrder);

// Address management routes
router.get('/user/addresses', requireAuth, AddressController.index);
router.get('/user/addresses/add', requireAuth, AddressController.showAdd);
router.post('/user/addresses/add', requireAuth, AddressController.create);
router.get('/user/addresses/:id/edit', requireAuth, AddressController.showEdit);
router.post('/user/addresses/:id/edit', requireAuth, AddressController.update);
router.post('/user/addresses/:id/delete', requireAuth, AddressController.delete);
router.post('/user/addresses/:id/set-default', requireAuth, AddressController.setDefault);

// Cart routes
router.get('/cart', CartController.index);
router.post('/cart/add', CartController.addItem);
router.post('/cart/update', CartController.updateQuantity);
router.post('/cart/remove/:productId', CartController.removeItem);
router.post('/cart/clear', requireAuth, CartController.clearCart);
router.get('/api/cart/count', CartController.getCartCount);

// Checkout routes
router.get('/checkout', requireAuth, CheckoutController.index);
router.post('/checkout/place-order', requireAuth, CheckoutController.placeOrder);
router.get('/order-success/:orderId', requireAuth, CheckoutController.orderSuccess);

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