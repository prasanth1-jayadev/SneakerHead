// Middleware for admin authentication
const requireAdmin = (req, res, next) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/admin/login');
    }
    next();
};

// Middleware for user authentication
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Middleware to check if user is already logged in
const redirectIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.isAdmin) {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect('/');
        }
    }
    next();
};

module.exports = {
    requireAdmin,
    requireAuth,
    redirectIfAuthenticated
};