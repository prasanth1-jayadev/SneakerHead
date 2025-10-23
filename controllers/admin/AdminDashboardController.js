const User = require('../../models/User');
const Product = require('../../models/Product');
const Category = require('../../models/Category');

class AdminDashboardController {
    // Display admin dashboard
    index(req, res) {
        try {
            const stats = {
                totalUsers: User.getNonAdminUsers().length,
                activeUsers: User.getNonAdminUsers().filter(u => u.isActive).length,
                totalProducts: Product.getAll().length,
                activeProducts: Product.getActive().length,
                totalCategories: Category.getAll().length,
                activeCategories: Category.getActive().length
            };
            
            res.render('admin/dashboard', { 
                title: 'Admin Dashboard - Sneaker Head',
                user: req.session.user,
                stats
            });
        } catch (error) {
            console.error('Error in AdminDashboardController.index:', error);
            res.status(500).render('error', { 
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }
}

module.exports = new AdminDashboardController();