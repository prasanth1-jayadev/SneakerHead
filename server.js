const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'urban-luxury-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Sample shoe data with high-quality descriptions and real images
const shoes = [
    {
        id: 1,
        name: "Air Max Street Pro",
        price: 299,
        originalPrice: 399,
        category: "Running",
        brand: "SneakerHead",
        rating: 4.8,
        reviews: 234,
        colors: ["Black/White", "Red/Black", "Blue/White"],
        colorCodes: ["#000000", "#FF0000", "#0066FF"],
        sizes: [7, 8, 9, 10, 11, 12],
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80"
        ],
        description: "Born in the streets, built for legends. The Air Max Street Pro combines cutting-edge technology with street-smart style.",
        features: ["Air-Max Cushioning", "Breathable Mesh Upper", "Rubber Outsole", "Lightweight Design"],
        story: "Designed for the urban explorer who never stops moving. Every step tells a story of ambition and style.",
        material: "Synthetic Leather & Mesh",
        weight: "320g",
        inStock: true,
        trending: true,
        new: false
    },
    {
        id: 2,
        name: "Neon Boost Runner",
        price: 249,
        originalPrice: 329,
        category: "Casual",
        brand: "SneakerHead",
        rating: 4.6,
        reviews: 189,
        colors: ["Neon Green", "Electric Pink", "Cyber Yellow"],
        colorCodes: ["#00FF41", "#FF1493", "#FFD700"],
        sizes: [6, 7, 8, 9, 10, 11],
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80"
        ],
        description: "Light up the night with every step. These kicks turned heads at every corner with their vibrant colors and comfort.",
        features: ["Boost Technology", "Memory Foam Insole", "Reflective Details", "Premium Knit Upper"],
        story: "When the city sleeps, you shine. Built for night owls and street legends who dare to stand out.",
        material: "Primeknit & Synthetic",
        weight: "280g",
        inStock: true,
        trending: true,
        new: true
    },
    {
        id: 3,
        name: "Jordan Retro Elite",
        price: 399,
        originalPrice: 499,
        category: "Sports",
        brand: "SneakerHead",
        rating: 4.9,
        reviews: 312,
        colors: ["Black/Red", "White/Blue", "Grey/Orange"],
        colorCodes: ["#000000", "#FFFFFF", "#808080"],
        sizes: [7, 8, 9, 10, 11, 12, 13],
        image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80"
        ],
        description: "Step into the future. Designed to move, built to impress. The ultimate fusion of performance and basketball heritage.",
        features: ["Air Jordan Technology", "Premium Leather Upper", "Carbon Fiber Plate", "High-Top Design"],
        story: "The future of basketball footwear is here. Every athlete deserves to feel like a champion on and off the court.",
        material: "Premium Leather & Nubuck",
        weight: "450g",
        inStock: true,
        trending: false,
        new: true
    },
    {
        id: 4,
        name: "Vans Skate Pro",
        price: 179,
        originalPrice: 229,
        category: "Sports",
        brand: "SneakerHead",
        rating: 4.6,
        reviews: 145,
        colors: ["Black/White", "Navy/Gum", "Olive/Black"],
        colorCodes: ["#000000", "#000080", "#808000"],
        sizes: [7, 8, 9, 10, 11, 12],
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80"
        ],
        description: "Built for skateboarding and street culture. Durable construction meets classic style for the ultimate skate shoe.",
        features: ["Waffle Outsole", "Padded Collar", "Reinforced Toe", "Suede & Canvas Upper"],
        story: "From the California skateparks to global street culture. These shoes represent freedom and creativity.",
        material: "Suede & Canvas",
        weight: "380g",
        inStock: true,
        trending: true,
        new: false
    },
    {
        id: 5,
        name: "Adidas Ultra Boost",
        price: 329,
        originalPrice: 399,
        category: "Running",
        brand: "SneakerHead",
        rating: 4.7,
        reviews: 267,
        colors: ["Core Black", "Cloud White", "Solar Red"],
        colorCodes: ["#000000", "#FFFFFF", "#FF4500"],
        sizes: [7, 8, 9, 10, 11, 12],
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80"
        ],
        description: "Experience endless energy return with revolutionary Boost technology. Perfect for long runs and daily training.",
        features: ["Boost Midsole", "Primeknit Upper", "Continental Rubber", "Torsion System"],
        story: "Engineered for runners who demand the best. Every stride powered by innovation and comfort.",
        material: "Primeknit & TPU",
        weight: "310g",
        inStock: true,
        trending: false,
        new: true
    },
    {
        id: 6,
        name: "Puma RS-X Futuristic",
        price: 219,
        originalPrice: 279,
        category: "Casual",
        brand: "SneakerHead",
        rating: 4.4,
        reviews: 134,
        colors: ["Multi-Color", "Black/White", "Pink/Blue"],
        colorCodes: ["#FF69B4", "#000000", "#00BFFF"],
        sizes: [6, 7, 8, 9, 10, 11],
        image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?auto=format&fit=crop&w=600&q=80"
        ],
        description: "Bold, chunky design meets futuristic aesthetics. Make a statement with every step you take.",
        features: ["RS Technology", "Chunky Sole", "Mixed Materials", "Bold Colorways"],
        story: "For those who dare to be different. Express your unique style with confidence.",
        material: "Mesh & Synthetic Leather",
        weight: "420g",
        inStock: true,
        trending: true,
        new: false
    },
    {
        id: 7,
        name: "New Balance 990v5",
        price: 289,
        originalPrice: 349,
        category: "Running",
        brand: "SneakerHead",
        rating: 4.8,
        reviews: 198,
        colors: ["Grey/White", "Navy/Silver", "Black/Red"],
        colorCodes: ["#808080", "#000080", "#000000"],
        sizes: [7, 8, 9, 10, 11, 12, 13],
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80"
        ],
        description: "American-made excellence with premium materials and superior comfort. A true classic reimagined.",
        features: ["ENCAP Midsole", "Pigskin & Mesh Upper", "Blown Rubber Outsole", "Made in USA"],
        story: "Decades of craftsmanship and innovation. The gold standard of running shoes.",
        material: "Pigskin Suede & Mesh",
        weight: "340g",
        inStock: true,
        trending: false,
        new: false
    },
    {
        id: 8,
        name: "Reebok Classic Leather",
        price: 139,
        originalPrice: 179,
        category: "Casual",
        brand: "SneakerHead",
        rating: 4.3,
        reviews: 87,
        colors: ["White", "Black", "Navy"],
        colorCodes: ["#FFFFFF", "#000000", "#000080"],
        sizes: [6, 7, 8, 9, 10, 11, 12],
        image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=600&q=80",
        images: [
            "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=600&q=80"
        ],
        description: "Timeless style that never goes out of fashion. Clean, simple, and effortlessly cool.",
        features: ["Soft Leather Upper", "Die-Cut EVA Midsole", "High Abrasion Rubber", "Classic Design"],
        story: "A heritage icon that's been defining casual style for decades. Simplicity at its finest.",
        material: "Full Grain Leather",
        weight: "360g",
        inStock: true,
        trending: false,
        new: false
    }
];

// Add admin and user management data structures
let users = [
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

let categories = [
    {
        id: 1,
        name: "Running",
        description: "High-performance running shoes for athletes",
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: 2,
        name: "Casual",
        description: "Comfortable everyday footwear",
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: 3,
        name: "Sports",
        description: "Athletic shoes for various sports",
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    }
];

// Update shoes array to include admin fields
shoes.forEach((shoe, index) => {
    shoe.isActive = true;
    shoe.createdAt = new Date('2024-01-15');
    shoe.updatedAt = new Date('2024-01-15');
    shoe.stock = Math.floor(Math.random() * 50) + 10; // Random stock between 10-60
});

// Middleware for admin authentication
const requireAdmin = (req, res, next) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/admin/login');
    }
    next();
};

// Middleware for user authentication
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Admin Routes
app.get('/admin/login', (req, res) => {
    res.render('admin/login', { title: 'Admin Login - Sneaker Head', error: null });
});

app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.isAdmin);
    
    if (user && password === 'admin123') { // Simple password check for demo
        req.session.user = user;
        user.lastLogin = new Date();
        return res.redirect('/admin/dashboard');
    }
    
    res.render('admin/login', { 
        title: 'Admin Login - Sneaker Head', 
        error: 'Invalid credentials' 
    });
});

app.get('/admin/dashboard', requireAdmin, (req, res) => {
    const stats = {
        totalUsers: users.filter(u => !u.isAdmin).length,
        activeUsers: users.filter(u => !u.isAdmin && u.isActive).length,
        totalProducts: shoes.length,
        activeProducts: shoes.filter(s => s.isActive).length,
        totalCategories: categories.length,
        activeCategories: categories.filter(c => c.isActive).length
    };
    
    res.render('admin/dashboard', { 
        title: 'Admin Dashboard - Sneaker Head',
        user: req.session.user,
        stats
    });
});

// User Management Routes
app.get('/admin/users', requireAdmin, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;
    
    let filteredUsers = users.filter(u => !u.isAdmin);
    
    if (search) {
        filteredUsers = filteredUsers.filter(u => 
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Sort by latest first
    filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);
    
    res.render('admin/users', {
        title: 'User Management - Sneaker Head',
        user: req.session.user,
        users: paginatedUsers,
        currentPage: page,
        totalPages,
        search,
        totalUsers
    });
});

app.post('/admin/users/:id/toggle-status', requireAdmin, (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (user) {
        user.isActive = !user.isActive;
        user.updatedAt = new Date();
    }
    
    res.json({ success: true, isActive: user.isActive });
});

// Category Management Routes
app.get('/admin/categories', requireAdmin, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;
    
    let filteredCategories = [...categories];
    
    if (search) {
        filteredCategories = filteredCategories.filter(c => 
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Sort by latest first
    filteredCategories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const totalCategories = filteredCategories.length;
    const totalPages = Math.ceil(totalCategories / limit);
    const paginatedCategories = filteredCategories.slice(offset, offset + limit);
    
    res.render('admin/categories', {
        title: 'Category Management - Sneaker Head',
        user: req.session.user,
        categories: paginatedCategories,
        currentPage: page,
        totalPages,
        search,
        totalCategories
    });
});

app.post('/admin/categories', requireAdmin, (req, res) => {
    const { name, description } = req.body;
    const newCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name,
        description,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    categories.push(newCategory);
    res.redirect('/admin/categories');
});

app.post('/admin/categories/:id/edit', requireAdmin, (req, res) => {
    const categoryId = parseInt(req.params.id);
    const { name, description } = req.body;
    const category = categories.find(c => c.id === categoryId);
    
    if (category) {
        category.name = name;
        category.description = description;
        category.updatedAt = new Date();
    }
    
    res.redirect('/admin/categories');
});

app.post('/admin/categories/:id/delete', requireAdmin, (req, res) => {
    const categoryId = parseInt(req.params.id);
    const category = categories.find(c => c.id === categoryId);
    
    if (category) {
        category.isActive = false;
        category.updatedAt = new Date();
    }
    
    res.json({ success: true });
});

// Product Management Routes
app.get('/admin/products', requireAdmin, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;
    
    let filteredProducts = [...shoes];
    
    if (search) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.brand.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Sort by latest first
    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);
    
    res.render('admin/products', {
        title: 'Product Management - Sneaker Head',
        user: req.session.user,
        products: paginatedProducts,
        categories: categories.filter(c => c.isActive),
        currentPage: page,
        totalPages,
        search,
        totalProducts
    });
});

app.post('/admin/products/:id/toggle-status', requireAdmin, (req, res) => {
    const productId = parseInt(req.params.id);
    const product = shoes.find(p => p.id === productId);
    
    if (product) {
        product.isActive = !product.isActive;
        product.updatedAt = new Date();
    }
    
    res.json({ success: true, isActive: product.isActive });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

app.get('/', (req, res) => {
    const activeShoes = shoes.filter(shoe => shoe.isActive);
    const trendingShoes = activeShoes.filter(shoe => shoe.trending);
    const newShoes = activeShoes.filter(shoe => shoe.new);
    
    res.render('index', { 
        shoes: activeShoes.slice(0, 4), 
        trendingShoes, 
        newShoes,
        user: req.session.user || null,
        title: 'Sneaker Head - Step Into the Future'
    });
});

// User Authentication Routes
app.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login - Sneaker Head', error: null });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && !u.isAdmin);
    
    if (user && user.isActive && password === 'user123') { // Simple password check for demo
        req.session.user = user;
        user.lastLogin = new Date();
        return res.redirect('/');
    }
    
    res.render('auth/login', { 
        title: 'Login - Sneaker Head', 
        error: 'Invalid credentials or account blocked' 
    });
});

app.get('/signup', (req, res) => {
    res.render('auth/signup', { title: 'Sign Up - Sneaker Head', error: null });
});

app.post('/signup', async (req, res) => {
    const { name, email, password, phone } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return res.render('auth/signup', { 
            title: 'Sign Up - Sneaker Head', 
            error: 'Email already registered' 
        });
    }
    
    const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        name,
        email,
        password: password, // In production, hash this
        phone,
        isActive: true,
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date()
    };
    
    users.push(newUser);
    req.session.user = newUser;
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/', (req, res) => {
    const activeShoes = shoes.filter(shoe => shoe.isActive);
    const trendingShoes = activeShoes.filter(shoe => shoe.trending);
    const newShoes = activeShoes.filter(shoe => shoe.new);
    
    res.render('index', { 
        shoes: activeShoes.slice(0, 4), 
        trendingShoes, 
        newShoes,
        user: req.session.user || null,
        title: 'Sneaker Head - Step Into the Future'
    });
});

app.get('/products', (req, res) => {
    const { category, sort, search, page = 1, minPrice, maxPrice, brand } = req.query;
    const limit = 12;
    const offset = (page - 1) * limit;
    
    // Filter only active products
    let filteredShoes = shoes.filter(shoe => shoe.isActive);
    
    // Search filter
    if (search) {
        filteredShoes = filteredShoes.filter(shoe => 
            shoe.name.toLowerCase().includes(search.toLowerCase()) ||
            shoe.brand.toLowerCase().includes(search.toLowerCase()) ||
            shoe.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    // Category filter
    if (category && category !== 'all') {
        filteredShoes = filteredShoes.filter(shoe => 
            shoe.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Price range filter
    if (minPrice) {
        filteredShoes = filteredShoes.filter(shoe => shoe.price >= parseInt(minPrice));
    }
    if (maxPrice) {
        filteredShoes = filteredShoes.filter(shoe => shoe.price <= parseInt(maxPrice));
    }
    
    // Brand filter
    if (brand) {
        filteredShoes = filteredShoes.filter(shoe => 
            shoe.brand.toLowerCase() === brand.toLowerCase()
        );
    }
    
    // Sorting
    if (sort === 'price-low') {
        filteredShoes.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filteredShoes.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
        filteredShoes.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'name-asc') {
        filteredShoes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
        filteredShoes.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'new-arrivals') {
        filteredShoes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    const totalProducts = filteredShoes.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const paginatedShoes = filteredShoes.slice(offset, offset + limit);
    
    // Get unique brands for filter
    const brands = [...new Set(shoes.filter(s => s.isActive).map(s => s.brand))];
    
    res.render('products', { 
        shoes: paginatedShoes,
        brands,
        currentCategory: category || 'all',
        currentSort: sort || 'default',
        currentSearch: search || '',
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        currentBrand: brand || '',
        title: 'Products - Sneaker Head'
    });
});

app.get('/product/:id', (req, res) => {
    const shoe = shoes.find(s => s.id === parseInt(req.params.id));
    
    // Redirect if product is blocked/inactive
    if (!shoe || !shoe.isActive) {
        return res.redirect('/products?error=product-unavailable');
    }
    
    const relatedShoes = shoes
        .filter(s => s.id !== shoe.id && s.category === shoe.category && s.isActive)
        .slice(0, 4);
    
    res.render('product-detail', { 
        shoe, 
        relatedShoes,
        title: `${shoe.name} - Sneaker Head`
    });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us - Sneaker Head' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us - Sneaker Head' });
});

app.get('/cart', (req, res) => {
    res.render('cart', { title: 'Shopping Cart - Sneaker Head' });
});

app.get('/wishlist', (req, res) => {
    res.render('wishlist', { title: 'My Wishlist - Sneaker Head' });
});

// Search API endpoint
app.get('/api/search', (req, res) => {
    const query = req.query.q;
    
    if (!query || query.length < 2) {
        return res.json({ results: [], message: 'Query too short' });
    }
    
    const searchQuery = query.toLowerCase();
    const results = shoes.filter(shoe => {
        return shoe.name.toLowerCase().includes(searchQuery) ||
               shoe.brand.toLowerCase().includes(searchQuery) ||
               shoe.category.toLowerCase().includes(searchQuery) ||
               shoe.colors.some(color => color.toLowerCase().includes(searchQuery)) ||
               shoe.features.some(feature => feature.toLowerCase().includes(searchQuery)) ||
               shoe.description.toLowerCase().includes(searchQuery);
    });
    
    res.json({ 
        results: results,
        count: results.length,
        query: query
    });
});

// API endpoint to get product by ID
app.get('/api/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = shoes.find(shoe => shoe.id === productId);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
});

// Search page route
app.get('/search', (req, res) => {
    const query = req.query.q || '';
    let results = [];
    
    if (query && query.length >= 2) {
        const searchQuery = query.toLowerCase();
        results = shoes.filter(shoe => {
            return shoe.name.toLowerCase().includes(searchQuery) ||
                   shoe.brand.toLowerCase().includes(searchQuery) ||
                   shoe.category.toLowerCase().includes(searchQuery) ||
                   shoe.colors.some(color => color.toLowerCase().includes(searchQuery)) ||
                   shoe.features.some(feature => feature.toLowerCase().includes(searchQuery)) ||
                   shoe.description.toLowerCase().includes(searchQuery);
        });
    }
    
    res.render('search-results', { 
        results: results,
        query: query,
        title: query ? `Search: ${query} - Sneaker Head` : 'Search - Sneaker Head'
    });
});

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    // In a real app, you'd save this to a database or send an email
    console.log('Contact form submission:', { name, email, message });
    res.json({ success: true, message: 'Thank you for your message! We\'ll get back to you soon.' });
});

// Cart functionality
app.post('/api/cart/add', (req, res) => {
    const { productId, size, color } = req.body;
    const shoe = shoes.find(s => s.id === parseInt(productId));
    
    if (!shoe) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // In a real app, you'd save this to a database or session
    res.json({ 
        success: true, 
        message: `${shoe.name} added to cart!`,
        product: { ...shoe, selectedSize: size, selectedColor: color }
    });
});

// Track order (mock)
app.get('/track/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    res.render('track-order', { 
        orderId,
        title: `Track Order ${orderId} - Sneaker Head`
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found - Sneaker Head' });
});

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`🚀 Sneaker Head Store running on http://localhost:${port}`);
        console.log('💫 Step into the future of footwear!');
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`❌ Port ${port} is busy, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('❌ Server error:', err);
        }
    });
}

startServer(PORT);