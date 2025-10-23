class User {
    constructor() {
        this.users = [
            {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                password: "$2b$10$example", // hashed password
                phone: "+1234567890",
                isActive: true,
                isAdmin: false,
                createdAt: new Date('2024-01-10'),
                updatedAt: new Date('2024-01-10'),
                lastLogin: new Date('2024-01-20')
            },
            {
                id: 2,
                name: "Admin User",
                email: "admin@sneakerhead.com",
                password: "$2b$10$example", // hashed password: "admin123"
                phone: "+1234567891",
                isActive: true,
                isAdmin: true,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
                lastLogin: new Date('2024-01-22')
            }
        ];
    }

    // Get all users
    getAll() {
        return this.users;
    }

    // Get user by ID
    getById(id) {
        return this.users.find(user => user.id === parseInt(id));
    }

    // Get user by email
    getByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    // Get non-admin users
    getNonAdminUsers() {
        return this.users.filter(user => !user.isAdmin);
    }

    // Create new user
    create(userData) {
        const newUser = {
            id: Math.max(...this.users.map(u => u.id)) + 1,
            ...userData,
            isActive: true,
            isAdmin: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: new Date()
        };
        
        this.users.push(newUser);
        return newUser;
    }

    // Update user
    update(id, updateData) {
        const userIndex = this.users.findIndex(user => user.id === parseInt(id));
        if (userIndex !== -1) {
            this.users[userIndex] = {
                ...this.users[userIndex],
                ...updateData,
                updatedAt: new Date()
            };
            return this.users[userIndex];
        }
        return null;
    }

    // Toggle user status
    toggleStatus(id) {
        const user = this.getById(id);
        if (user) {
            user.isActive = !user.isActive;
            user.updatedAt = new Date();
            return user;
        }
        return null;
    }

    // Update last login
    updateLastLogin(id) {
        const user = this.getById(id);
        if (user) {
            user.lastLogin = new Date();
            return user;
        }
        return null;
    }

    // Search users
    search(query) {
        const searchTerm = query.toLowerCase();
        return this.users.filter(user => 
            !user.isAdmin && (
                user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm)
            )
        );
    }

    // Get paginated users
    getPaginated(page = 1, limit = 10, search = '') {
        let filteredUsers = search ? this.search(search) : this.getNonAdminUsers();
        
        // Sort by latest first
        filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const offset = (page - 1) * limit;
        const totalUsers = filteredUsers.length;
        const totalPages = Math.ceil(totalUsers / limit);
        const paginatedUsers = filteredUsers.slice(offset, offset + limit);
        
        return {
            users: paginatedUsers,
            totalUsers,
            totalPages,
            currentPage: page
        };
    }
}

module.exports = new User();