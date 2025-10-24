class Cart {
    constructor() {
        this.cartItems = [
            // Sample cart items
            {
                id: 1,
                userId: 1,
                productId: 1,
                quantity: 2,
                createdAt: new Date('2024-01-20'),
                updatedAt: new Date('2024-01-20')
            }
        ];
    }

    // Get cart items for a user
    getByUserId(userId) {
        if (!userId) return [];
        return this.cartItems.filter(item => item.userId === parseInt(userId));
    }

    // Get cart item by user and product
    getByUserAndProduct(userId, productId) {
        return this.cartItems.find(item => 
            item.userId === parseInt(userId) && item.productId === parseInt(productId)
        );
    }

    // Add item to cart
    addItem(userId, productId, quantity = 1) {
        const existingItem = this.getByUserAndProduct(userId, productId);
        
        if (existingItem) {
            // Update quantity if item already exists
            existingItem.quantity += quantity;
            existingItem.updatedAt = new Date();
            return existingItem;
        } else {
            // Create new cart item
            const newItem = {
                id: Math.max(...this.cartItems.map(item => item.id), 0) + 1,
                userId: parseInt(userId),
                productId: parseInt(productId),
                quantity: quantity,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            this.cartItems.push(newItem);
            return newItem;
        }
    }

    // Update item quantity
    updateQuantity(userId, productId, quantity) {
        const item = this.getByUserAndProduct(userId, productId);
        if (item) {
            if (quantity <= 0) {
                return this.removeItem(userId, productId);
            }
            item.quantity = quantity;
            item.updatedAt = new Date();
            return item;
        }
        return null;
    }

    // Remove item from cart
    removeItem(userId, productId) {
        const itemIndex = this.cartItems.findIndex(item => 
            item.userId === parseInt(userId) && item.productId === parseInt(productId)
        );
        
        if (itemIndex !== -1) {
            return this.cartItems.splice(itemIndex, 1)[0];
        }
        return null;
    }

    // Clear cart for user
    clearCart(userId) {
        const userItems = this.getByUserId(userId);
        this.cartItems = this.cartItems.filter(item => item.userId !== parseInt(userId));
        return userItems;
    }

    // Get cart count for user
    getCartCount(userId) {
        if (!userId) return 0;
        return this.getByUserId(userId).reduce((total, item) => total + item.quantity, 0);
    }

    // Get cart total for user (requires product data)
    getCartTotal(userId, products) {
        if (!userId || !products) return 0;
        
        const cartItems = this.getByUserId(userId);
        let total = 0;
        
        cartItems.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product && product.isActive) {
                total += product.price * item.quantity;
            }
        });
        
        return total;
    }
}

module.exports = new Cart();