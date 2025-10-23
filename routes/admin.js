const express = require('express');
const router = express.Router();

// Import controllers
const AdminAuthController = require('../controllers/admin/AdminAuthController');
const AdminDashboardController = require('../controllers/admin/AdminDashboardController');
const AdminUserController = require('../controllers/admin/AdminUserController');
const AdminCategoryController = require('../controllers/admin/AdminCategoryController');
const AdminProductController = require('../controllers/admin/AdminProductController');

// Import middleware
const { requireAdmin, redirectIfAuthenticated } = require('../middleware/auth');

// Admin authentication routes
router.get('/login', AdminAuthController.showLogin);
router.post('/login', AdminAuthController.login);
router.get('/logout', AdminAuthController.logout);

// Admin dashboard
router.get('/dashboard', requireAdmin, AdminDashboardController.index);

// User management routes
router.get('/users', requireAdmin, AdminUserController.index);
router.post('/users/:id/toggle-status', requireAdmin, AdminUserController.toggleStatus);

// Category management routes
router.get('/categories', requireAdmin, AdminCategoryController.index);
router.post('/categories', requireAdmin, AdminCategoryController.create);
router.post('/categories/:id/edit', requireAdmin, AdminCategoryController.update);
router.post('/categories/:id/delete', requireAdmin, AdminCategoryController.delete);

// Product management routes
router.get('/products', requireAdmin, AdminProductController.index);
router.post('/products', requireAdmin, AdminProductController.create);
router.post('/products/:id/edit', requireAdmin, AdminProductController.update);
router.post('/products/:id/toggle-status', requireAdmin, AdminProductController.toggleStatus);
router.post('/products/:id/delete', requireAdmin, AdminProductController.delete);

module.exports = router;