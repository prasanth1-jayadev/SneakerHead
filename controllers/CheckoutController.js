const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Address = require('../models/Address');
const Order = require('../models/Order');

class CheckoutController {
    // Display checkout page
    index(req, res) {
        try {
            const userId = req.session.user?.id;
            if (!userId) {
                return res.redirect('/login');
            }
            
            const cartItems = Cart.getByUserId(userId);
            if (cartItems.length === 0) {
                return res.redirect('/cart?error=empty-cart');
            }
            
            const products = Product.getAll();
            const addresses = Address.getByUserId(userId);
            const defaultAddress = Address.getDefaultByUserId(userId);
            
            // Get detailed cart items with product info
            const detailedCartItems = cartItems.map(item => {
                const product = products.find(p => p.id === item.productId);
                return {
                    ...item,
                    product,
                    subtotal: product ? product.price * item.quantity : 0,
                    isAvailable: product && product.isActive && product.inStock && product.stock >= item.quantity
                };
            }).filter(item => item.product && item.isAvailable);
            
            // Check if all items are available
            if (detailedCartItems.length !== cartItems.length) {
                return res.redirect('/cart?error=unavailable-items');
            }
            
            const subtotal = detailedCartItems.reduce((sum, item) => sum + item.subtotal, 0);
            const tax = subtotal * 0.1; // 10% tax
            const shipping = subtotal > 500 ? 0 : 10; // Free shipping over $500
            const total = subtotal + tax + shipping;
            
            res.render('checkout', {
                title: 'Checkout - Sneaker Head',
                user: req.session.user,
                cartItems: detailedCartItems,
                addresses,
                defaultAddress,
                subtotal,
                tax,
                shipping,
                total
            });
        } catch (error) {
            console.error('Error in CheckoutController.index:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Process order
    placeOrder(req, res) {
        try {
            const userId = req.session.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            
            const { addressId, paymentMethod = 'COD' } = req.body;
            
            // Get cart items
            const cartItems = Cart.getByUserId(userId);
            if (cartItems.length === 0) {
                return res.status(400).json({ success: false, error: 'Cart is empty' });
            }
            
            // Get address
            const address = Address.getById(addressId);
            if (!address || address.userId !== userId) {
                return res.status(400).json({ success: false, error: 'Invalid address' });
            }
            
            const products = Product.getAll();
            
            // Validate cart items and calculate totals
            const orderItems = [];
            let subtotal = 0;
            
            for (const cartItem of cartItems) {
                const product = products.find(p => p.id === cartItem.productId);
                
                if (!product || !product.isActive || !product.inStock) {
                    return res.status(400).json({ 
                        success: false, 
                        error: `Product ${product?.name || 'Unknown'} is not available` 
                    });
                }
                
                if (product.stock < cartItem.quantity) {
                    return res.status(400).json({ 
                        success: false, 
                        error: `Insufficient stock for ${product.name}` 
                    });
                }
                
                const itemTotal = product.price * cartItem.quantity;
                orderItems.push({
                    productId: product.id,
                    quantity: cartItem.quantity,
                    price: product.price,
                    total: itemTotal
                });
                
                subtotal += itemTotal;
            }
            
            const tax = subtotal * 0.1;
            const shipping = subtotal > 500 ? 0 : 10;
            const total = subtotal + tax + shipping;
            
            // Create order
            const orderData = {
                userId,
                items: orderItems,
                shippingAddress: {
                    name: address.name,
                    phone: address.phone,
                    addressLine1: address.addressLine1,
                    addressLine2: address.addressLine2,
                    city: address.city,
                    state: address.state,
                    zipCode: address.zipCode,
                    country: address.country
                },
                subtotal,
                tax,
                shipping,
                discount: 0,
                total,
                paymentMethod
            };
            
            const order = Order.create(orderData);
            
            if (order) {
                // Update product stock
                orderItems.forEach(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (product) {
                        product.stock -= item.quantity;
                    }
                });
                
                // Clear cart
                Cart.clearCart(userId);
                
                res.json({ 
                    success: true, 
                    message: 'Order placed successfully',
                    orderId: order.id,
                    orderNumber: order.orderId
                });
            } else {
                res.status(500).json({ success: false, error: 'Failed to place order' });
            }
        } catch (error) {
            console.error('Error in CheckoutController.placeOrder:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    // Display order success page
    orderSuccess(req, res) {
        try {
            const orderId = req.params.orderId;
            const order = Order.getById(orderId);
            
            if (!order || order.userId !== req.session.user?.id) {
                return res.status(404).render('error', {
                    title: 'Order Not Found',
                    message: 'The order you are looking for does not exist.',
                    user: req.session.user || null
                });
            }
            
            res.render('order-success', {
                title: 'Order Placed Successfully - Sneaker Head',
                user: req.session.user,
                order
            });
        } catch (error) {
            console.error('Error in CheckoutController.orderSuccess:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }
}

module.exports = new CheckoutController();