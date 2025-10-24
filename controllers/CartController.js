const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Category = require('../models/Category');

class CartController {
    // Display cart page
    index(req, res) {
        try {
            const userId = req.session.user?.id;
            
            // Default values for empty cart
            let cartItems = [];
            let cartTotal = 0;
            let cartCount = 0;
            
            if (userId) {
                try {
                    const rawCartItems = Cart.getByUserId(userId);
                    const products = Product.getAll();
                    
                    // Get detailed cart items with product info
                    cartItems = rawCartItems.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        if (!product) return null;
                        
                        return {
                            ...item,
                            product,
                            subtotal: product.price * item.quantity,
                            isAvailable: product && product.isActive && product.inStock
                        };
                    }).filter(item => item !== null); // Remove items with deleted products
                    
                    cartTotal = Cart.getCartTotal(userId, products);
                    cartCount = Cart.getCartCount(userId);
                } catch (cartError) {
                    console.error('Error getting cart data:', cartError);
                    // Use default empty values
                }
            }
            
            res.render('cart', {
                title: 'Shopping Cart - Sneaker Head',
                user: req.session.user || null,
                cartItems: cartItems || [],
                cartTotal: cartTotal || 0,
                cartCount: cartCount || 0
            });
        } catch (error) {
            console.error('Error in CartController.index:', error);
            res.render('cart', {
                title: 'Shopping Cart - Sneaker Head',
                user: req.session.user || null,
                cartItems: [],
                cartTotal: 0,
                cartCount: 0
            });
        }
    }

    // Add item to cart
    addItem(req, res) {
        try {
            const userId = req.session.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, error: 'Please login to add items to cart' });
            }
            
            const { productId, quantity = 1 } = req.body;
            const product = Product.getById(productId);
            
            // Check if product exists and is active
            if (!product || !product.isActive) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Product is not available' 
                });
            }
            
            // Check if category is active
            const category = Category.getAll().find(c => c.name === product.category);
            if (!category || !category.isActive) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Product category is not available' 
                });
            }
            
            // Check stock availability
            const existingCartItem = Cart.getByUserAndProduct(userId, productId);
            const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;
            const totalQuantity = currentQuantityInCart + parseInt(quantity);
            
            if (totalQuantity > product.stock) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Only ${product.stock} items available in stock` 
                });
            }
            
            // Maximum quantity per product (e.g., 10)
            const maxQuantityPerProduct = 10;
            if (totalQuantity > maxQuantityPerProduct) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Maximum ${maxQuantityPerProduct} items allowed per product` 
                });
            }
            
            // Add to cart
            const cartItem = Cart.addItem(userId, productId, parseInt(quantity));
            
            if (cartItem) {
                // Remove from wishlist if exists (you'll need to implement wishlist model)
                // Wishlist.removeItem(userId, productId);
                
                const cartCount = Cart.getCartCount(userId);
                res.json({ 
                    success: true, 
                    message: 'Item added to cart successfully',
                    cartCount
                });
            } else {
                res.status(500).json({ success: false, error: 'Failed to add item to cart' });
            }
        } catch (error) {
            console.error('Error in CartController.addItem:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    // Update item quantity
    updateQuantity(req, res) {
        try {
            const userId = req.session.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            
            const { productId, quantity } = req.body;
            const product = Product.getById(productId);
            
            if (!product) {
                return res.status(404).json({ success: false, error: 'Product not found' });
            }
            
            // Validate quantity
            if (quantity < 0) {
                return res.status(400).json({ success: false, error: 'Invalid quantity' });
            }
            
            if (quantity === 0) {
                // Remove item from cart
                const removedItem = Cart.removeItem(userId, productId);
                if (removedItem) {
                    const cartCount = Cart.getCartCount(userId);
                    const cartTotal = Cart.getCartTotal(userId, Product.getAll());
                    return res.json({ 
                        success: true, 
                        message: 'Item removed from cart',
                        cartCount,
                        cartTotal
                    });
                }
            }
            
            // Check stock availability
            if (quantity > product.stock) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Only ${product.stock} items available in stock` 
                });
            }
            
            // Maximum quantity per product
            const maxQuantityPerProduct = 10;
            if (quantity > maxQuantityPerProduct) {
                return res.status(400).json({ 
                    success: false, 
                    error: `Maximum ${maxQuantityPerProduct} items allowed per product` 
                });
            }
            
            const updatedItem = Cart.updateQuantity(userId, productId, quantity);
            
            if (updatedItem) {
                const cartCount = Cart.getCartCount(userId);
                const cartTotal = Cart.getCartTotal(userId, Product.getAll());
                const itemSubtotal = product.price * quantity;
                
                res.json({ 
                    success: true, 
                    message: 'Cart updated successfully',
                    cartCount,
                    cartTotal,
                    itemSubtotal
                });
            } else {
                res.status(500).json({ success: false, error: 'Failed to update cart' });
            }
        } catch (error) {
            console.error('Error in CartController.updateQuantity:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    // Remove item from cart
    removeItem(req, res) {
        try {
            const userId = req.session.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            
            const productId = req.params.productId;
            const removedItem = Cart.removeItem(userId, productId);
            
            if (removedItem) {
                const cartCount = Cart.getCartCount(userId);
                const cartTotal = Cart.getCartTotal(userId, Product.getAll());
                
                res.json({ 
                    success: true, 
                    message: 'Item removed from cart',
                    cartCount,
                    cartTotal
                });
            } else {
                res.status(404).json({ success: false, error: 'Item not found in cart' });
            }
        } catch (error) {
            console.error('Error in CartController.removeItem:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    // Clear cart
    clearCart(req, res) {
        try {
            const userId = req.session.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            
            const clearedItems = Cart.clearCart(userId);
            
            res.json({ 
                success: true, 
                message: 'Cart cleared successfully',
                cartCount: 0,
                cartTotal: 0
            });
        } catch (error) {
            console.error('Error in CartController.clearCart:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    // Get cart count (API endpoint)
    getCartCount(req, res) {
        try {
            const userId = req.session.user?.id;
            if (!userId) {
                return res.json({ cartCount: 0 });
            }
            
            const cartCount = Cart.getCartCount(userId);
            res.json({ cartCount });
        } catch (error) {
            console.error('Error in CartController.getCartCount:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}

module.exports = new CartController();