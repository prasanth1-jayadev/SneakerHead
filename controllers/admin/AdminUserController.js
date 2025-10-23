const User = require('../../models/User');

class AdminUserController {
    // Display users management page
    index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const search = req.query.search || '';
            
            const result = User.getPaginated(page, limit, search);
            
            res.render('admin/users', {
                title: 'User Management - Sneaker Head',
                user: req.session.user,
                users: result.users,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                search,
                totalUsers: result.totalUsers
            });
        } catch (error) {
            console.error('Error in AdminUserController.index:', error);
            res.status(500).render('error', { 
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Toggle user status (block/unblock)
    toggleStatus(req, res) {
        try {
            const userId = parseInt(req.params.id);
            const user = User.toggleStatus(userId);
            
            if (user) {
                res.json({ success: true, isActive: user.isActive });
            } else {
                res.status(404).json({ success: false, error: 'User not found' });
            }
        } catch (error) {
            console.error('Error in AdminUserController.toggleStatus:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}

module.exports = new AdminUserController();