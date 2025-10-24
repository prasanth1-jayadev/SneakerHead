const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema Definition
const userSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    
    // Contact Information
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    
    // Profile Information
    profileImage: {
        type: String,
        default: '/images/default-avatar.svg'
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', null],
        default: null
    },
    
    // Address Information
    address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        country: { type: String, default: '' },
        zipCode: { type: String, default: '' }
    },
    
    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    
    // User Preferences
    preferences: {
        newsletter: { type: Boolean, default: false },
        notifications: { type: Boolean, default: true },
        theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
        language: { type: String, default: 'en' }
    },
    
    // Metadata
    metadata: {
        signupSource: { type: String, default: 'web' },
        ipAddress: { type: String, default: null },
        userAgent: { type: String, default: null },
        referrer: { type: String, default: null }
    },
    
    // Login Statistics
    lastLogin: {
        type: Date,
        default: null
    },
    loginCount: {
        type: Number,
        default: 0
    },
    
    // Verification Tokens
    emailVerificationToken: {
        type: String,
        default: null
    },
    emailVerificationExpires: {
        type: Date,
        default: null
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { 
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.emailVerificationToken;
            delete ret.passwordResetToken;
            return ret;
        }
    }
});

// Indexes for better performance (email index is already defined in schema)
userSchema.index({ isActive: 1 });
userSchema.index({ isAdmin: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        // Hash password with cost of 12
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.emailVerificationToken;
    delete userObject.passwordResetToken;
    return userObject;
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase().trim() });
};

// Static method to get user statistics
userSchema.statics.getStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                activeUsers: { $sum: { $cond: [{ $and: ['$isActive', { $eq: ['$isAdmin', false] }] }, 1, 0] } },
                adminUsers: { $sum: { $cond: ['$isAdmin', 1, 0] } },
                verifiedUsers: { $sum: { $cond: [{ $and: ['$emailVerified', { $eq: ['$isAdmin', false] }] }, 1, 0] } }
            }
        }
    ]);
    
    const recentUsers = await this.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        isAdmin: false
    });
    
    return {
        total: stats[0]?.totalUsers || 0,
        active: stats[0]?.activeUsers || 0,
        admins: stats[0]?.adminUsers || 0,
        verified: stats[0]?.verifiedUsers || 0,
        recent: recentUsers
    };
};

// Virtual for full name (if you want to split first/last name later)
userSchema.virtual('fullName').get(function() {
    return this.name;
});

module.exports = mongoose.model('User', userSchema);