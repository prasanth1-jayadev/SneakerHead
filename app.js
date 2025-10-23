const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

// Import routes
const webRoutes = require('./routes/web');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'urban-luxury-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global middleware to make user available in all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/', webRoutes);
app.use('/admin', adminRoutes);

// 404 Error handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found - Sneaker Head',
        message: 'The page you are looking for does not exist.',
        user: req.session.user || null
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).render('error', {
        title: 'Server Error - Sneaker Head',
        message: 'Something went wrong on our end. Please try again later.',
        user: req.session.user || null
    });
});

// Start server with port fallback
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`🚀 Sneaker Head Store running on http://localhost:${port}`);
        console.log(`💫 Step into the future of footwear!`);
        console.log(`📊 Admin Panel: http://localhost:${port}/admin/login`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`❌ Port ${port} is busy, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
}

startServer(PORT);

module.exports = app;