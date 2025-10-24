const User = require('../../models/User');
const Product = require('../../models/Product');
const Category = require('../../models/Category');

class AdminDashboardController {
    // Display admin dashboard
    async index(req, res) {
        try {
            // Get data from MongoDB
            const [nonAdminUsers, allProducts, allCategories] = await Promise.all([
                User.getNonAdminUsers(),
                Promise.resolve(Product.getAll()),
                Promise.resolve(Category.getAll())
            ]);
            
            const stats = {
                totalUsers: nonAdminUsers.length,
                activeUsers: nonAdminUsers.filter(u => u.isActive).length,
                totalProducts: allProducts.length,
                activeProducts: allProducts.filter(p => p.isActive).length,
                totalCategories: allCategories.length,
                activeCategories: allCategories.filter(c => c.isActive).length
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