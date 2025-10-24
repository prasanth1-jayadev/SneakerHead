# MongoDB Setup Guide for Sneaker Head Store

## 🗄️ MongoDB Integration Complete!

Your Sneaker Head e-commerce application is now connected to MongoDB with a professional user schema.

## 📋 Prerequisites

### 1. Install MongoDB
**Option A: MongoDB Community Server (Recommended)**
- Download from: https://www.mongodb.com/try/download/community
- Install MongoDB Community Server
- Start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Create account at: https://www.mongodb.com/atlas
- Create a free cluster
- Get connection string

### 2. Install MongoDB Compass (Optional but Recommended)
- Download from: https://www.mongodb.com/try/download/compass
- Visual interface for MongoDB

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sneakerhead_store

# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sneakerhead_store

# Session Configuration
SESSION_SECRET=urban-luxury-secret-key-2024

# Server Configuration
PORT=3001
NODE_ENV=development
```

### Local MongoDB Setup
1. **Start MongoDB Service:**
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Verify MongoDB is Running:**
   ```bash
   # Connect to MongoDB shell
   mongosh
   
   # Or check if port 27017 is listening
   netstat -an | findstr 27017
   ```

## 🚀 Application Features

### Database Schema
- **User Management:** Complete user profiles with authentication
- **Password Security:** Bcrypt hashing with 12 rounds
- **Session Storage:** MongoDB-based session persistence
- **Data Validation:** Mongoose schema validation
- **Indexing:** Optimized queries with proper indexes

### Default Admin Account
- **Email:** admin@sneakerhead.com
- **Password:** admin123
- **Auto-created** on first startup

### User Schema Features
```javascript
{
  name: String (required, 2-50 chars),
  email: String (unique, validated),
  password: String (bcrypt hashed),
  phone: String,
  profileImage: String,
  dateOfBirth: Date,
  gender: Enum,
  address: {
    street, city, state, country, zipCode
  },
  preferences: {
    newsletter, notifications, theme, language
  },
  metadata: {
    signupSource, ipAddress, userAgent, referrer
  },
  loginCount: Number,
  lastLogin: Date,
  timestamps: true
}
```

## 🔍 Monitoring

### MongoDB Compass
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Navigate to `sneakerhead_store` database
4. View collections: `users`, `sessions`

### Application Logs
- User registration and login events
- Database connection status
- Error handling and debugging info

## 🛠️ Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```
❌ MongoDB connection failed: connect ECONNREFUSED
```
**Solution:** Ensure MongoDB service is running

**2. Port Already in Use**
```
❌ Port 3001 is busy, trying port 3002...
```
**Solution:** App automatically finds available port

**3. Schema Validation Errors**
```
❌ User creation failed: ValidationError
```
**Solution:** Check required fields (name, email, password)

### Reset Database
```javascript
// In MongoDB shell (mongosh)
use sneakerhead_store
db.users.drop()
db.sessions.drop()
```

## 📊 Database Collections

### Users Collection
- Stores all user accounts
- Indexed on email, isActive, isAdmin
- Automatic password hashing
- Session-based authentication

### Sessions Collection
- Managed by connect-mongo
- Automatic cleanup of expired sessions
- Secure session storage

## 🔐 Security Features

- **Password Hashing:** Bcrypt with 12 rounds
- **Session Security:** HTTP-only cookies, secure in production
- **Input Validation:** Mongoose schema validation
- **XSS Protection:** Sanitized user inputs
- **CSRF Protection:** Session-based authentication

## 🎯 Next Steps

1. **Start Application:** `npm start` or `node app.js`
2. **Access Site:** http://localhost:3003
3. **Admin Panel:** http://localhost:3003/admin/login
4. **Register Users:** Create accounts through signup
5. **Monitor Database:** Use MongoDB Compass

Your application now has enterprise-grade database integration! 🎉