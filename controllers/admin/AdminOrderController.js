const Order = require('../../models/Order');
const User = require('../../models/User');
const Product = require('../../models/Product');

class AdminOrderController {
    // Display orders management page
    async index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const search = req.query.search || '';
            const status = req.query.status || '';
            const sortBy = req.query.sort || 'date';

            const result = Order.getAdminPaginated(page, limit, search, status, sortBy);

            // Get user details for each order
            const ordersWithUsers = await Promise.all(
                result.orders.map(async (order) => {
                    const user = await User.getById(order.userId);
                    return {
                        ...order,
                        user
                    };
                })
            );

            const statusOptions = [
                { value: '', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'shipped', label: 'Shipped' },
                { value: 'out_for_delivery', label: 'Out for Delivery' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'returned', label: 'Returned' }
            ];

            res.render('admin/orders', {
                title: 'Order Management - Sneaker Head',
                user: req.session.user,
                orders: ordersWithUsers,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                search,
                status,
                sortBy,
                statusOptions,
                totalOrders: result.totalOrders
            });
        } catch (error) {
            console.error('Error in AdminOrderController.index:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Display single order details
    async show(req, res) {
        try {
            const orderId = req.params.id;
            const order = Order.getById(orderId);

            if (!order) {
                return res.status(404).render('error', {
                    title: 'Order Not Found',
                    message: 'The order you are looking for does not exist.',
                    user: req.session.user || null
                });
            }

            const user = await User.getById(order.userId);
            const products = Product.getAll();

            // Get product details for each order item
            const orderItemsWithProducts = order.items.map(item => {
                const product = products.find(p => p.id === item.productId);
                return {
                    ...item,
                    product
                };
            });

            res.render('admin/order-detail', {
                title: `Order ${order.orderId} - Sneaker Head`,
                user: req.session.user,
                order: {
                    ...order,
                    items: orderItemsWithProducts
                },
                customer: user
            });
        } catch (error) {
            console.error('Error in AdminOrderController.show:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Update order status
    updateStatus(req, res) {
        try {
            const orderId = req.params.id;
            const { status, reason } = req.body;

            const validStatuses = [
                'pending', 'confirmed', 'shipped', 'out_for_delivery',
                'delivered', 'cancelled', 'returned'
            ];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid status'
                });
            }

            const order = Order.getById(orderId);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Order not found'
                });
            }

            // If cancelling order, restore stock
            if (status === 'cancelled' && order.status !== 'cancelled') {
                const products = Product.getAll();
                order.items.forEach(item => {
                    const product = products.find(p => p.id === item.productId);
                    if (product) {
                        product.stock += item.quantity;
                    }
                });
            }

            const updatedOrder = Order.updateStatus(orderId, status, reason);

            if (updatedOrder) {
                res.json({
                    success: true,
                    message: 'Order status updated successfully',
                    newStatus: status
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to update order status'
                });
            }
        } catch (error) {
            console.error('Error in AdminOrderController.updateStatus:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    // Get order statistics
    getStats(req, res) {
        try {
            const orders = Order.getAll();

            const stats = {
                total: orders.length,
                pending: orders.filter(o => o.status === 'pending').length,
                confirmed: orders.filter(o => o.status === 'confirmed').length,
                shipped: orders.filter(o => o.status === 'shipped').length,
                delivered: orders.filter(o => o.status === 'delivered').length,
                cancelled: orders.filter(o => o.status === 'cancelled').length,
                returned: orders.filter(o => o.status === 'returned').length,
                totalRevenue: orders
                    .filter(o => o.status === 'delivered')
                    .reduce((sum, o) => sum + o.total, 0)
            };

            res.json(stats);
        } catch (error) {
            console.error('Error in AdminOrderController.getStats:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}

module.exports = new AdminOrderController();