class Product {
    constructor() {
        this.products = [
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
                new: false,
                isActive: true,
                stock: 45,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15')
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
                new: true,
                isActive: true,
                stock: 32,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15')
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
                new: true,
                isActive: true,
                stock: 28,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15')
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
                new: false,
                isActive: true,
                stock: 52,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15')
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
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
                images: [
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80"
                ],
                description: "Experience endless energy return with revolutionary Boost technology. Perfect for long runs and daily training.",
                features: ["Boost Midsole", "Primeknit Upper", "Continental Rubber", "Torsion System"],
                story: "Engineered for runners who demand the best. Every stride powered by innovation and comfort.",
                material: "Primeknit & TPU",
                weight: "310g",
                inStock: true,
                trending: false,
                new: true,
                isActive: true,
                stock: 38,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15')
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
                new: false,
                isActive: true,
                stock: 41,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15')
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
                new: false,
                isActive: true,
                stock: 29,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15')
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
                new: false,
                isActive: true,
                stock: 47,
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-01-15')
            }
        ];
    }

    // Get all products
    getAll() {
        return this.products;
    }

    // Get active products
    getActive() {
        return this.products.filter(product => product.isActive);
    }

    // Get product by ID
    getById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    // Get trending products
    getTrending() {
        return this.products.filter(product => product.trending && product.isActive);
    }

    // Get new products
    getNew() {
        return this.products.filter(product => product.new && product.isActive);
    }

    // Get unique brands
    getBrands() {
        return [...new Set(this.products.filter(p => p.isActive).map(p => p.brand))];
    }

    // Get related products
    getRelated(productId, category, limit = 4) {
        return this.products
            .filter(p => p.id !== parseInt(productId) && p.category === category && p.isActive)
            .slice(0, limit);
    }

    // Search products
    search(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.isActive && (
                product.name.toLowerCase().includes(searchTerm) ||
                product.brand.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            )
        );
    }

    // Filter and sort products
    getFiltered(filters = {}) {
        let filteredProducts = this.getActive();

        // Apply search filter
        if (filters.search) {
            filteredProducts = this.search(filters.search);
        }

        // Apply category filter
        if (filters.category && filters.category !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category.toLowerCase() === filters.category.toLowerCase()
            );
        }

        // Apply price range filter
        if (filters.minPrice) {
            filteredProducts = filteredProducts.filter(product => 
                product.price >= parseInt(filters.minPrice)
            );
        }
        if (filters.maxPrice) {
            filteredProducts = filteredProducts.filter(product => 
                product.price <= parseInt(filters.maxPrice)
            );
        }

        // Apply brand filter
        if (filters.brand) {
            filteredProducts = filteredProducts.filter(product => 
                product.brand.toLowerCase() === filters.brand.toLowerCase()
            );
        }

        // Apply sorting
        if (filters.sort) {
            switch (filters.sort) {
                case 'price-low':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    filteredProducts.sort((a, b) => b.rating - a.rating);
                    break;
                case 'name-asc':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'new-arrivals':
                    filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
            }
        }

        return filteredProducts;
    }

    // Get paginated products
    getPaginated(page = 1, limit = 12, filters = {}) {
        const filteredProducts = this.getFiltered(filters);
        
        const offset = (page - 1) * limit;
        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / limit);
        const paginatedProducts = filteredProducts.slice(offset, offset + limit);
        
        return {
            products: paginatedProducts,
            totalProducts,
            totalPages,
            currentPage: page
        };
    }

    // Create new product
    create(productData) {
        const newProduct = {
            id: Math.max(...this.products.map(p => p.id)) + 1,
            ...productData,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.products.push(newProduct);
        return newProduct;
    }

    // Update product
    update(id, updateData) {
        const productIndex = this.products.findIndex(product => product.id === parseInt(id));
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updateData,
                updatedAt: new Date()
            };
            return this.products[productIndex];
        }
        return null;
    }

    // Toggle product status
    toggleStatus(id) {
        const product = this.getById(id);
        if (product) {
            product.isActive = !product.isActive;
            product.updatedAt = new Date();
            return product;
        }
        return null;
    }

    // Soft delete product
    delete(id) {
        const product = this.getById(id);
        if (product) {
            product.isActive = false;
            product.updatedAt = new Date();
            return product;
        }
        return null;
    }

    // Get admin paginated products
    getAdminPaginated(page = 1, limit = 10, search = '') {
        let filteredProducts = search ? this.search(search) : [...this.products];
        
        // Sort by latest first
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const offset = (page - 1) * limit;
        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / limit);
        const paginatedProducts = filteredProducts.slice(offset, offset + limit);
        
        return {
            products: paginatedProducts,
            totalProducts,
            totalPages,
            currentPage: page
        };
    }
}

module.exports = new Product();