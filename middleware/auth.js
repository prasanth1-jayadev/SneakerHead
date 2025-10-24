const User = require('../models/User');

// Middleware for admin authentication with session validation
const requireAdmin = async (req, res, next) => {
    try {
        // Check if session exists and has user data
        if (!req.session || !req.session.user || !req.session.user.id) {
            console.log('Admin auth failed: No valid session');
            return res.redirect('/admin/login');
        }

        // Verify user still exists in database and is admin
        const user = await User.getById(req.session.user.id);
        if (!user || !user.isAdmin || !user.isActive) {
            console.log('Admin auth failed: User not found, not admin, or inactive');
            req.session.destroy();
            return res.redirect('/admin/login');
        }

        // Update session with fresh user data
        req.session.user = {
            ...req.session.user,
            isActive: user.isActive,
            isAdmin: user.isAdmin
        };

        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        return res.redirect('/admin/login');
    }
};

// Middleware for user authentication with session validation
const requireAuth = async (req, res, next) => {
    try {
        // Check if session exists and has user data
        if (!req.session || !req.session.user || !req.session.user.id) {
            console.log('User auth failed: No valid session');
            // Store the intended URL for redirect after login
            req.session.returnTo = req.originalUrl;
            return res.redirect('/login');
        }

        // Verify user still exists in database and is active
        const user = await User.getById(req.session.user.id);
        if (!user || !user.isActive) {
            console.log('User auth failed: User not found or inactive');
            req.session.destroy();
            return res.redirect('/login');
        }

        // Update session with fresh user data
        req.session.user = {
            ...req.session.user,
            isActive: user.isActive,
            name: user.name,
            email: user.email
        };

        next();
    } catch (error) {
        console.error('User auth middleware error:', error);
        return res.redirect('/login');
    }
};

// Middleware to check if user is already logged in
const redirectIfAuthenticated = async (req, res, next) => {
    try {
        // Check if session exists and has valid user data
        if (req.session && req.session.user && req.session.user.id) {
            // Verify user still exists in database
            const user = await User.getById(req.session.user.id);
            if (user && user.isActive) {
                console.log('User already authenticated, redirecting');
                if (user.isAdmin) {
                    return res.redirect('/admin/dashboard');
                } else {
                    return res.redirect('/');
                }
            } else {
                // User no longer exists or is inactive, destroy session
                req.session.destroy();
            }
        }
        next();
    } catch (error) {
        console.error('Redirect auth middleware error:', error);
        next();
    }
};

// Middleware to ensure session data is available in views
const loadUser = async (req, res, next) => {
    try {
        if (req.session && req.session.user && req.session.user.id) {
            // Verify user still exists and is active
            const user = await User.getById(req.session.user.id);
            if (user && user.isActive) {
                res.locals.user = req.session.user;
            } else {
                // User no longer exists or is inactive
                req.session.destroy();
                res.locals.user = null;
            }
        } else {
            res.locals.user = null;
        }
        next();
    } catch (error) {
        console.error('Load user middleware error:', error);
        res.locals.user = null;
        next();
    }
};

module.exports = {
    requireAdmin,
    requireAuth,
    redirectIfAuthenticated,
    loadUser
};