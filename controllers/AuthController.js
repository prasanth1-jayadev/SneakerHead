const User = require('../models/User');

class AuthController {
    // Display login page
    showLogin(req, res) {
        res.render('auth/login', {
            title: 'Login - Sneaker Head',
            error: null
        });
    }

    // Handle login with proper database authentication
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.render('auth/login', {
                    title: 'Login - Sneaker Head',
                    error: 'Please enter both email and password'
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.render('auth/login', {
                    title: 'Login - Sneaker Head',
                    error: 'Please enter a valid email address'
                });
            }

            // Validate password length
            if (password.length < 3) {
                return res.render('auth/login', {
                    title: 'Login - Sneaker Head',
                    error: 'Password must be at least 3 characters long'
                });
            }

            // Authenticate user against MongoDB
            const authResult = await User.authenticate(email, password);

            if (!authResult.success) {
                return res.render('auth/login', {
                    title: 'Login - Sneaker Head',
                    error: authResult.message
                });
            }

            const user = authResult.user;

            // Check if user is admin (admins should use admin login)
            if (user.isAdmin) {
                console.log('Login failed: Admin user trying to login via regular login');
                return res.render('auth/login', {
                    title: 'Login - Sneaker Head',
                    error: 'Admin users should use the admin login page'
                });
            }

            // Create secure session data directly
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

            // Store user in session
            req.session.user = sessionData;

            // Save session explicitly
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.render('auth/login', {
                        title: 'Login - Sneaker Head',
                        error: 'Login failed. Please try again.'
                    });
                }

                console.log('User session created:', { id: user.id, email: user.email });

                // Redirect to intended page or home
                const redirectTo = req.session.returnTo || '/';
                delete req.session.returnTo;
                return res.redirect(redirectTo);
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

    // Handle signup with proper database storage
    async signup(req, res) {
        try {
            console.log('📝 Signup attempt with data:', req.body);
            const { name, email, password, confirmPassword, phone } = req.body;

            // Validate input
            if (!name || !email || !password) {
                console.log('❌ Missing required fields:', { name: !!name, email: !!email, password: !!password });
                return res.render('auth/signup', {
                    title: 'Sign Up - Sneaker Head',
                    error: 'Please fill in all required fields'
                });
            }

            // Validate name
            if (name.trim().length < 2) {
                return res.render('auth/signup', {
                    title: 'Sign Up - Sneaker Head',
                    error: 'Name must be at least 2 characters long'
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.render('auth/signup', {
                    title: 'Sign Up - Sneaker Head',
                    error: 'Please enter a valid email address'
                });
            }

            // Validate password
            if (password.length < 6) {
                return res.render('auth/signup', {
                    title: 'Sign Up - Sneaker Head',
                    error: 'Password must be at least 6 characters long'
                });
            }

            // Validate password confirmation (only if confirmPassword field exists)
            if (confirmPassword && password !== confirmPassword) {
                return res.render('auth/signup', {
                    title: 'Sign Up - Sneaker Head',
                    error: 'Passwords do not match'
                });
            }

            // Validate phone number if provided
            if (phone && phone.trim()) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
                    return res.render('auth/signup', {
                        title: 'Sign Up - Sneaker Head',
                        error: 'Please enter a valid phone number'
                    });
                }
            }

            // Prepare user data
            const userData = {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: password, // In production, hash this with bcrypt
                phone: phone ? phone.trim() : '',
                profileImage: '/images/default-avatar.svg',
                emailVerified: true,
                newsletter: req.body.newsletter === 'on',
                notifications: req.body.notifications !== 'off'
            };

            // Prepare request metadata
            const requestData = {
                source: 'web_signup',
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
                referrer: req.get('Referer')
            };

            // Register user in MongoDB
            const registrationResult = await User.register(userData, requestData);

            if (!registrationResult.success) {
                return res.render('auth/signup', {
                    title: 'Sign Up - Sneaker Head',
                    error: registrationResult.message
                });
            }

            const newUser = registrationResult.user;

            // Create secure session data directly
            const sessionData = {
                id: newUser._id || newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone || '',
                profileImage: newUser.profileImage || '/images/default-avatar.svg',
                dateOfBirth: newUser.dateOfBirth,
                gender: newUser.gender,
                address: newUser.address || {},
                isActive: newUser.isActive,
                isAdmin: newUser.isAdmin,
                emailVerified: newUser.emailVerified,
                phoneVerified: newUser.phoneVerified || false,
                preferences: newUser.preferences || {},
                loginTime: new Date().toISOString(),
                loginCount: newUser.loginCount || 0
            };

            // Store user in session
            req.session.user = sessionData;

            // Save session explicitly
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.render('auth/signup', {
                        title: 'Sign Up - Sneaker Head',
                        error: 'Registration completed but login failed. Please try logging in.'
                    });
                }

                console.log('User registered and session created:', { id: newUser.id, email: newUser.email });
                return res.redirect('/');
            });

        } catch (error) {
            console.error('❌ Error in AuthController.signup:', error.message);
            console.error('❌ Full signup error:', error);
            
            // Provide more specific error messages
            let errorMessage = 'An error occurred. Please try again.';
            
            if (error.message.includes('Email already exists')) {
                errorMessage = 'This email is already registered. Please use a different email or try logging in.';
            } else if (error.message.includes('Validation failed')) {
                errorMessage = error.message.replace('Validation failed: ', '');
            } else if (error.message.includes('required')) {
                errorMessage = 'Please fill in all required fields.';
            }
            
            res.render('auth/signup', {
                title: 'Sign Up - Sneaker Head',
                error: errorMessage
            });
        }
    }

    // Handle logout with proper session cleanup
    logout(req, res) {
        const userId = req.session.user?.id;
        const userEmail = req.session.user?.email;

        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.redirect('/');
            }

            // Clear session cookie
            res.clearCookie('connect.sid');
            console.log('User logged out:', { id: userId, email: userEmail });
            res.redirect('/');
        });
    }

    // Create secure session data (helper method)
    createUserSession(user) {
        return {
            id: user._id || user.id, // Handle both MongoDB (_id) and regular (id) objects
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
    }

    // Check if user is authenticated (helper method)
    isAuthenticated(req) {
        return req.session && req.session.user && req.session.user.id;
    }

    // Get current user from session (helper method)
    getCurrentUser(req) {
        if (this.isAuthenticated(req)) {
            return req.session.user;
        }
        return null;
    }
}

module.exports = new AuthController();