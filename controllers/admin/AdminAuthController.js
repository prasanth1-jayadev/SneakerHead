const User = require('../../models/User');

class AdminAuthController {
    // Display admin login page
    showLogin(req, res) {
        res.render('admin/login', { 
            title: 'Admin Login - Sneaker Head', 
            error: null 
        });
    }

    // Handle admin login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = User.getByEmail(email);
            
            if (user && user.isAdmin && password === 'admin123') {
                req.session.user = user;
                User.updateLastLogin(user.id);
                return res.redirect('/admin/dashboard');
            }
            
            res.render('admin/login', { 
                title: 'Admin Login - Sneaker Head', 
                error: 'Invalid credentials' 
            });
        } catch (error) {
            console.error('Error in AdminAuthController.login:', error);
            res.render('admin/login', { 
                title: 'Admin Login - Sneaker Head', 
                error: 'An error occurred. Please try again.' 
            });
        }
    }

    // Handle admin logout
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/admin/login');
        });
    }
}

module.exports = new AdminAuthController();