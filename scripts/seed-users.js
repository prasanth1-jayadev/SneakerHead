const database = require('../config/database');
const User = require('../models/User');

async function seedUsers() {
    try {
        console.log('🌱 Starting user seeding...');
        
        // Connect to database
        await database.connect();
        
        // Sample users to create
        const sampleUsers = [
            {
                name: 'John Smith',
                email: 'john.smith@example.com',
                password: 'password123',
                phone: '+1234567890'
            },
            {
                name: 'Sarah Johnson',
                email: 'sarah.johnson@example.com',
                password: 'password123',
                phone: '+1234567891'
            },
            {
                name: 'Mike Davis',
                email: 'mike.davis@example.com',
                password: 'password123',
                phone: '+1234567892'
            },
            {
                name: 'Emily Wilson',
                email: 'emily.wilson@example.com',
                password: 'password123',
                phone: '+1234567893'
            },
            {
                name: 'David Brown',
                email: 'david.brown@example.com',
                password: 'password123',
                phone: '+1234567894'
            }
        ];

        // Create users
        for (const userData of sampleUsers) {
            try {
                const result = await User.register(userData, {
                    source: 'seed',
                    ip: '127.0.0.1'
                });
                
                if (result.success) {
                    console.log(`✅ Created user: ${userData.email}`);
                } else {
                    console.log(`⚠️  User already exists: ${userData.email}`);
                }
            } catch (error) {
                console.log(`❌ Failed to create user ${userData.email}:`, error.message);
            }
        }

        console.log('🎉 User seeding completed!');
        
        // Get user count
        const stats = await User.getUserStats();
        console.log(`📊 Total users in database: ${stats.total}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

// Run the seeding
seedUsers();