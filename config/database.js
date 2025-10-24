const mongoose = require('mongoose');

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            // MongoDB connection string - update with your MongoDB Compass connection
            const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sneakerhead_store';

            const options = {
                maxPoolSize: 10, // Maintain up to 10 socket connections
                serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            };

            this.connection = await mongoose.connect(mongoURI, options);

            console.log('🗄️  MongoDB Connected Successfully!');
            console.log('📊 Database:', this.connection.connection.name);
            console.log('🌐 Host:', this.connection.connection.host);
            console.log('🔌 Port:', this.connection.connection.port);

            // Handle connection events
            mongoose.connection.on('error', (err) => {
                console.error('❌ MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('⚠️  MongoDB disconnected');
            });

            mongoose.connection.on('reconnected', () => {
                console.log('🔄 MongoDB reconnected');
            });

            return this.connection;
        } catch (error) {
            console.error('❌ MongoDB connection failed:', error.message);
            process.exit(1);
        }
    }

    async disconnect() {
        try {
            await mongoose.connection.close();
            console.log('🔌 MongoDB connection closed');
        } catch (error) {
            console.error('❌ Error closing MongoDB connection:', error);
        }
    }

    getConnection() {
        return this.connection;
    }

    isConnected() {
        return mongoose.connection.readyState === 1;
    }
}

module.exports = new Database();