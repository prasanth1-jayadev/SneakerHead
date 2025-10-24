const UserSchema = require('./schemas/UserSchema');

class User {
    constructor() {
        this.model = UserSchema;
        this.initialized = false;
        // Don't call async method in constructor
        this.initializeDefaultAdmin().catch(console.error);
    }

    // Initialize default admin user (only if no users exist)
    async initializeDefaultAdmin() {
        try {
            // Wait a bit for MongoDB connection to be ready
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const adminExists = await this.model.findOne({ isAdmin: true });

            if (!adminExists) {
                const adminUser = new this.model({
                    name: "System Administrator",
                    email: "admin@sneakerhead.com",
                    password: "admin123", // Will be hashed by pre-save middleware
                    phone: "",
                    profileImage: "/images/default-avatar.svg",
                    isActive: true,
                    isAdmin: true,
                    emailVerified: true,
                    preferences: {
                        newsletter: false,
                        notifications: true,
                        theme: 'dark',
                        language: 'en'
                    }
                });

                await adminUser.save();
                console.log('✅ Default admin user created:', adminUser.email);
            }
            this.initialized = true;
        } catch (error) {
            console.error('❌ Error creating default admin:', error.message);
            this.initialized = true; // Mark as initialized even if failed
        }
    }

    // Ensure initialization is complete before operations
    async ensureInitialized() {
        let attempts = 0;
        while (!this.initialized && attempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
    }

    // Save user to MongoDB
    async save(userData) {
        try {
            if (userData._id) {
                // Update existing user
                const updatedUser = await this.model.findByIdAndUpdate(
                    userData._id,
                    userData,
                    { new: true, runValidators: true }
                );
                return updatedUser;
            } else {
                // Create new user
                const newUser = new this.model(userData);
                const savedUser = await newUser.save();
                return savedUser;
            }
        } catch (error) {
            throw new Error(`Failed to save user: ${error.message}`);
        }
    }

    // Delete user from MongoDB
    async delete(id) {
        try {
            const deletedUser = await this.model.findByIdAndDelete(id);
            return deletedUser;
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    // Get all users from MongoDB
    async getAll() {
        try {
            return await this.model.find({}).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Failed to get users: ${error.message}`);
        }
    }

    // Get user by ID from MongoDB
    async getById(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            return null;
        }
    }

    // Get user by email from MongoDB
    async getByEmail(email) {
        try {
            return await this.model.findByEmail(email);
        } catch (error) {
            return null;
        }
    }

    // Get non-admin users from MongoDB
    async getNonAdminUsers() {
        try {
            return await this.model.find({ isAdmin: false }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Failed to get non-admin users: ${error.message}`);
        }
    }

    // Create new user in MongoDB
    async create(userData) {
        try {
            console.log('🔄 Creating user with data:', { 
                name: userData.name, 
                email: userData.email,
                hasPassword: !!userData.password 
            });

            // Check if email already exists
            const existingUser = await this.getByEmail(userData.email);
            if (existingUser) {
                throw new Error('Email already exists');
            }

            // Validate required fields
            if (!userData.name || !userData.email || !userData.password) {
                throw new Error('Name, email, and password are required');
            }

            // Create new user object
            const newUserData = {
                name: userData.name.trim(),
                email: userData.email.toLowerCase().trim(),
                password: userData.password, // Will be hashed by pre-save middleware
                phone: userData.phone ? userData.phone.trim() : '',
                profileImage: userData.profileImage || '/images/default-avatar.svg',
                dateOfBirth: userData.dateOfBirth || null,
                gender: userData.gender || null,
                address: {
                    street: userData.address || '',
                    city: userData.city || '',
                    state: userData.state || '',
                    country: userData.country || '',
                    zipCode: userData.zipCode || ''
                },
                isActive: true,
                isAdmin: userData.isAdmin || false,
                emailVerified: userData.emailVerified || false,
                phoneVerified: false,
                twoFactorEnabled: false,
                preferences: {
                    newsletter: userData.newsletter || false,
                    notifications: userData.notifications !== false,
                    theme: userData.theme || 'dark',
                    language: userData.language || 'en'
                },
                metadata: {
                    signupSource: userData.signupSource || 'web',
                    ipAddress: userData.ipAddress || null,
                    userAgent: userData.userAgent || null,
                    referrer: userData.referrer || null
                },
                loginCount: 0
            };

            console.log('🔄 Attempting to save user to MongoDB...');

            // Create and save user
            const newUser = new this.model(newUserData);
            const savedUser = await newUser.save();

            console.log('✅ User created in MongoDB:', {
                id: savedUser._id,
                email: savedUser.email,
                name: savedUser.name,
                createdAt: savedUser.createdAt
            });

            return savedUser;
        } catch (error) {
            console.error('❌ User creation failed:', error.message);
            console.error('❌ Full error:', error);
            
            // Handle specific MongoDB errors
            if (error.code === 11000) {
                throw new Error('Email already exists');
            }
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(err => err.message);
                throw new Error(`Validation failed: ${messages.join(', ')}`);
            }
            
            throw error;
        }
    }

    // Update user in MongoDB
    async update(id, updateData) {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            return updatedUser;
        } catch (error) {
            console.error('❌ User update failed:', error.message);
            return null;
        }
    }

    // Toggle user status in MongoDB
    async toggleStatus(id) {
        try {
            const user = await this.getById(id);
            if (user) {
                user.isActive = !user.isActive;
                const updatedUser = await user.save();
                console.log(`✅ User status toggled: ${updatedUser.email} - Active: ${updatedUser.isActive}`);
                return updatedUser;
            }
            return null;
        } catch (error) {
            console.error('❌ Failed to toggle user status:', error.message);
            return null;
        }
    }

    // Update last login in MongoDB
    async updateLastLogin(id) {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(
                id,
                { lastLogin: new Date() },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            console.error('❌ Failed to update last login:', error.message);
            return null;
        }
    }

    // Search users in MongoDB
    async search(query) {
        try {
            const searchTerm = query.toLowerCase();
            return await this.model.find({
                isAdmin: false,
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } }
                ]
            }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('❌ User search failed:', error.message);
            return [];
        }
    }

    // Get paginated users from MongoDB
    async getPaginated(page = 1, limit = 10, search = '') {
        try {
            const skip = (page - 1) * limit;

            // Build search query
            let query = { isAdmin: false };
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            // Get users and total count
            const [users, totalUsers] = await Promise.all([
                this.model.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                this.model.countDocuments(query)
            ]);

            const totalPages = Math.ceil(totalUsers / limit);

            return {
                users,
                totalUsers,
                totalPages,
                currentPage: page
            };
        } catch (error) {
            console.error('❌ Failed to get paginated users:', error.message);
            throw error;
        }
    }

    // Update user profile in MongoDB
    async updateProfile(id, profileData) {
        try {
            const user = await this.getById(id);
            if (!user) {
                throw new Error('User not found');
            }

            // Validate and prepare update data
            const allowedFields = [
                'name', 'phone', 'dateOfBirth', 'gender', 'profileImage'
            ];

            const updateData = {};
            for (const field of allowedFields) {
                if (profileData[field] !== undefined) {
                    updateData[field] = profileData[field];
                }
            }

            // Handle address separately
            if (profileData.address) {
                updateData.address = {
                    ...user.address,
                    ...profileData.address
                };
            }

            // Update user in MongoDB
            const updatedUser = await this.model.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            return updatedUser;
        } catch (error) {
            console.error('❌ Profile update failed:', error.message);
            throw error;
        }
    }

    // Update password in MongoDB
    async updatePassword(id, newPassword) {
        try {
            const user = await this.getById(id);
            if (user) {
                user.password = newPassword; // Will be hashed by pre-save middleware
                const updatedUser = await user.save();
                console.log('✅ Password updated for user:', updatedUser.email);
                return updatedUser;
            }
            return null;
        } catch (error) {
            console.error('❌ Password update failed:', error.message);
            return null;
        }
    }

    // Update email in MongoDB
    async updateEmail(id, newEmail) {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(
                id,
                {
                    email: newEmail.toLowerCase().trim(),
                    emailVerified: true
                },
                { new: true, runValidators: true }
            );
            return updatedUser;
        } catch (error) {
            console.error('❌ Email update failed:', error.message);
            return null;
        }
    }

    // Verify password by ID
    async verifyPassword(id, password) {
        try {
            const user = await this.getById(id);
            if (user) {
                return await user.comparePassword(password);
            }
            return false;
        } catch (error) {
            console.error('❌ Password verification failed:', error.message);
            return false;
        }
    }

    // Authenticate user with MongoDB
    async authenticate(email, password) {
        try {
            console.log('🔐 Authenticating user:', email);

            // Validate input
            if (!email || !password) {
                return { success: false, message: 'Email and password are required', user: null };
            }

            // Find user by email
            const user = await this.getByEmail(email.toLowerCase().trim());
            if (!user) {
                console.log('❌ Authentication failed: User not found');
                return { success: false, message: 'Invalid email or password', user: null };
            }

            // Check if account is active
            if (!user.isActive) {
                console.log('❌ Authentication failed: Account inactive');
                return { success: false, message: 'Your account has been deactivated. Please contact support.', user: null };
            }

            // Verify password using bcrypt
            const isPasswordValid = await user.comparePassword(password);
            console.log('🔑 Password verification:', isPasswordValid);

            if (isPasswordValid) {
                // Update login statistics
                await this.updateLoginStats(user._id);
                console.log('✅ Authentication successful for:', user.email);

                // Return user public profile
                return { success: true, message: 'Login successful', user: user.getPublicProfile() };
            } else {
                console.log('❌ Authentication failed: Invalid password');
                return { success: false, message: 'Invalid email or password', user: null };
            }
        } catch (error) {
            console.error('❌ Authentication error:', error.message);
            return { success: false, message: 'Authentication failed', user: null };
        }
    }

    // Update login statistics in MongoDB
    async updateLoginStats(id) {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(
                id,
                {
                    $set: { lastLogin: new Date() },
                    $inc: { loginCount: 1 }
                },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            console.error('❌ Failed to update login stats:', error.message);
            return null;
        }
    }

    // Register new user in MongoDB
    async register(userData, requestData = {}) {
        try {
            console.log('📝 Registering new user:', userData.email);
            
            // Ensure initialization is complete
            await this.ensureInitialized();

            // Enhance user data with request metadata
            const enhancedUserData = {
                ...userData,
                signupSource: requestData.source || 'web',
                ipAddress: requestData.ip || null,
                userAgent: requestData.userAgent || null,
                referrer: requestData.referrer || null
            };

            // Create user in MongoDB
            const newUser = await this.create(enhancedUserData);

            // Return user public profile
            return { success: true, message: 'Registration successful', user: newUser.getPublicProfile() };

        } catch (error) {
            console.log('❌ Registration failed:', error.message);
            console.error('Full error:', error);
            return { success: false, message: error.message, user: null };
        }
    }

    // Get user statistics from MongoDB
    async getUserStats() {
        try {
            return await this.model.getStats();
        } catch (error) {
            console.error('❌ Failed to get user stats:', error.message);
            return {
                total: 0,
                active: 0,
                admins: 0,
                verified: 0,
                recent: 0
            };
        }
    }
}

module.exports = new User();