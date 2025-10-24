const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

// Import database connection
const database = require('./config/database');

// Import routes
const webRoutes = require('./routes/web');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
// Session configuration with MongoDB store
app.use(session({
    secret: process.env.SESSION_SECRET || 'urban-luxury-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/sneakerhead_store',
        touchAfter: 24 * 3600 // lazy session update
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true // Prevent XSS attacks
    }
}));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import auth middleware
const { loadUser } = require('./middleware/auth');

// Global middleware to load user data and make it available in all views
app.use(loadUser);

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

// Connect to MongoDB and start server
async function startApplication() {
    try {
        // Connect to MongoDB
        console.log('🔄 Connecting to MongoDB...');
        await database.connect();

        // Start server with port fallback
        function startServer(port) {
            if (isNaN(port) || port < 1 || port > 65535) {
                console.error('❌ Invalid port number:', port);
                port = 3001;
            }

            const server = app.listen(port, () => {
                console.log(`🚀 Sneaker Head Store running on http://localhost:${port}`);
                console.log(`💫 Step into the future of footwear!`);
                console.log(`📊 Admin Panel: http://localhost:${port}/admin/login`);
                console.log(`🗄️  Database: Connected to MongoDB`);
            }).on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`❌ Port ${port} is busy, trying port ${port + 1}...`);
                    startServer(port + 1);
                } else {
                    console.error('❌ Server error:', err);
                    console.error('Trying to start on port 3001...');
                    startServer(3001);
                }
            });
        }

        startServer(PORT);

    } catch (error) {
        console.error('❌ Failed to start application:', error.message);
        console.log('🔄 Starting without MongoDB connection...');

        // Start server without MongoDB as fallback
        function startServer(port) {
            const server = app.listen(port, () => {
                console.log(`🚀 Sneaker Head Store running on http://localhost:${port}`);
                console.log(`💫 Step into the future of footwear!`);
                console.log(`📊 Admin Panel: http://localhost:${port}/admin/login`);
                console.log(`⚠️  Warning: Running without MongoDB connection`);
            }).on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`❌ Port ${port} is busy, trying port ${port + 1}...`);
                    startServer(port + 1);
                } else {
                    console.error('Server error:', err);
                }
            });
        }

        startServer(3001);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await database.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await database.disconnect();
    process.exit(0);
});

// Start the application
startApplication();

module.exports = app;