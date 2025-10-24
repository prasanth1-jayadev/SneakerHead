const User = require('../../models/User');

class AdminAuthController {
    // Display admin login page
    showLogin(req, res) {
        res.render('admin/login', { 
            title: 'Admin Login - Sneaker Head', 
            error: null 
        });
    }

    // Handle admin login with MongoDB authentication
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            console.log('🔐 Admin login attempt for:', email);

            // Validate input
            if (!email || !password) {
                return res.render('admin/login', {
                    title: 'Admin Login - Sneaker Head',
                    error: 'Please enter both email and password'
                });
            }

            // Authenticate user against MongoDB
            const authResult = await User.authenticate(email, password);
            
            if (!authResult.success) {
                console.log('❌ Admin auth failed:', authResult.message);
                return res.render('admin/login', {
                    title: 'Admin Login - Sneaker Head',
                    error: 'Invalid email or password'
                });
            }

            const user = authResult.user;

            // Check if user is admin
            if (!user.isAdmin) {
                console.log('❌ Admin login failed: User is not admin');
                return res.render('admin/login', {
                    title: 'Admin Login - Sneaker Head',
                    error: 'Access denied. Admin privileges required.'
                });
            }

            // Check if admin account is active
            if (!user.isActive) {
                console.log('❌ Admin login failed: Admin account inactive');
                return res.render('admin/login', {
                    title: 'Admin Login - Sneaker Head',
                    error: 'Admin account has been deactivated.'
                });
            }

            console.log('✅ Admin login successful for:', user.email);

            // Create admin session data
            const sessionData = {
                id: user._id || user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                profileImage: user.profileImage || '/images/default-avatar.svg',
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                address: user.address || {},
                isActive: user.isActive,
                isAdmin: user.isAdmin,
                emailVerified: user.emailVerified,
                phoneVerified: user.phoneVerified || false,
                preferences: user.preferences || {},
                loginTime: new Date().toISOString(),
                loginCount: user.loginCount || 0
            };

            // Store admin in session
            req.session.user = sessionData;

            // Save session explicitly
            req.session.save((err) => {
                if (err) {
                    console.error('❌ Admin session save error:', err);
                    return res.render('admin/login', {
                        title: 'Admin Login - Sneaker Head',
                        error: 'Login failed. Please try again.'
                    });
                }

                console.log('✅ Admin session created for:', user.email);
                return res.redirect('/admin/dashboard');
            });

        } catch (error) {
            console.error('❌ Error in AdminAuthController.login:', error);
            res.render('admin/login', {
                title: 'Admin Login - Sneaker Head',
                error: 'An error occurred. Please try again.'
            });
        }
    }

    // Handle admin logout with proper cleanup
    logout(req, res) {
        const adminId = req.session.user?.id;
        const adminEmail = req.session.user?.email;
        
        req.session.destroy((err) => {
            if (err) {
                console.error('❌ Error destroying admin session:', err);
                return res.redirect('/admin/login');
            }
            
            // Clear session cookie
            res.clearCookie('connect.sid');
            console.log('✅ Admin logged out:', { id: adminId, email: adminEmail });
            res.redirect('/admin/login');
        });
    }
}

module.exports = new AdminAuthController();