const User = require('../models/User');

class AuthController {
    // Display login page
    showLogin(req, res) {
        res.render('auth/login', { 
            title: 'Login - Sneaker Head', 
            error: null 
        });
    }

    // Handle login
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = User.getByEmail(email);
            
            if (user && !user.isAdmin && user.isActive && password === 'user123') {
                req.session.user = user;
                User.updateLastLogin(user.id);
                return res.redirect('/');
            }
            
            res.render('auth/login', { 
                title: 'Login - Sneaker Head', 
                error: 'Invalid credentials or account blocked' 
            });
        } catch (error) {
            console.error('Error in AuthController.login:', error);
            res.render('auth/login', { 
                title: 'Login - Sneaker Head', 
                error: 'An error occurred. Please try again.' 
            });
        }
    }

    // Display signup page
    showSignup(req, res) {
        res.render('auth/signup', { 
            title: 'Sign Up - Sneaker Head', 
            error: null 
        });
    }

    // Handle signup
    async signup(req, res) {
        try {
            const { name, email, password, phone } = req.body;
            
            // Check if user already exists
            if (User.getByEmail(email)) {
                return res.render('auth/signup', { 
                    title: 'Sign Up - Sneaker Head', 
                    error: 'Email already registered' 
                });
            }
            
            // Create new user
            const newUser = User.create({
                name,
                email,
                password, // In production, hash this
                phone
            });
            
            req.session.user = newUser;
            res.redirect('/');
        } catch (error) {
            console.error('Error in AuthController.signup:', error);
            res.render('auth/signup', { 
                title: 'Sign Up - Sneaker Head', 
                error: 'An error occurred. Please try again.' 
            });
        }
    }

    // Handle logout
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/');
        });
    }
}

module.exports = new AuthController();