class Category {
    constructor() {
        this.categories = [
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
    }

    // Get all categories
    getAll() {
        return this.categories;
    }

    // Get active categories
    getActive() {
        return this.categories.filter(category => category.isActive);
    }

    // Get category by ID
    getById(id) {
        return this.categories.find(category => category.id === parseInt(id));
    }

    // Create new category
    create(categoryData) {
        const newCategory = {
            id: Math.max(...this.categories.map(c => c.id)) + 1,
            ...categoryData,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.categories.push(newCategory);
        return newCategory;
    }

    // Update category
    update(id, updateData) {
        const categoryIndex = this.categories.findIndex(category => category.id === parseInt(id));
        if (categoryIndex !== -1) {
            this.categories[categoryIndex] = {
                ...this.categories[categoryIndex],
                ...updateData,
                updatedAt: new Date()
            };
            return this.categories[categoryIndex];
        }
        return null;
    }

    // Soft delete category
    delete(id) {
        const category = this.getById(id);
        if (category) {
            category.isActive = false;
            category.updatedAt = new Date();
            return category;
        }
        return null;
    }

    // Search categories
    search(query) {
        const searchTerm = query.toLowerCase();
        return this.categories.filter(category => 
            category.name.toLowerCase().includes(searchTerm) ||
            category.description.toLowerCase().includes(searchTerm)
        );
    }

    // Get paginated categories
    getPaginated(page = 1, limit = 10, search = '') {
        let filteredCategories = search ? this.search(search) : [...this.categories];
        
        // Sort by latest first
        filteredCategories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const offset = (page - 1) * limit;
        const totalCategories = filteredCategories.length;
        const totalPages = Math.ceil(totalCategories / limit);
        const paginatedCategories = filteredCategories.slice(offset, offset + limit);
        
        return {
            categories: paginatedCategories,
            totalCategories,
            totalPages,
            currentPage: page
        };
    }
}

module.exports = new Category();