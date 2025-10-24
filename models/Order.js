class Order {
    constructor() {
        this.orders = [
            {
                id: 1,
                orderId: "SH2024001",
                userId: 1,
                items: [
                    {
                        productId: 1,
                        quantity: 2,
                        price: 299,
                        total: 598
                    }
                ],
                shippingAddress: {
                    name: "John Doe",
                    phone: "+1234567890",
                    addressLine1: "123 Main Street",
                    addressLine2: "Apt 4B",
                    city: "New York",
                    state: "NY",
                    zipCode: "10001",
                    country: "USA"
                },
                subtotal: 598,
                tax: 59.8,
                shipping: 10,
                discount: 0,
                total: 667.8,
                paymentMethod: "COD",
                status: "pending", // pending, confirmed, shipped, out_for_delivery, delivered, cancelled, returned
                cancelReason: null,
                returnReason: null,
                createdAt: new Date('2024-01-20'),
                updatedAt: new Date('2024-01-20'),
                deliveredAt: null,
                cancelledAt: null,
                returnedAt: null
            }
        ];
        this.orderCounter = 1;
    }

    // Generate unique order ID
    generateOrderId() {
        this.orderCounter++;
        const year = new Date().getFullYear();
        const orderNumber = String(this.orderCounter).padStart(3, '0');
        return `SH${year}${orderNumber}`;
    }

    // Get all orders
    getAll() {
        return this.orders;
    }

    // Get order by ID
    getById(id) {
        return this.orders.find(order => order.id === parseInt(id));
    }

    // Get order by order ID
    getByOrderId(orderId) {
        return this.orders.find(order => order.orderId === orderId);
    }

    // Get orders by user ID
    getByUserId(userId) {
        return this.orders.filter(order => order.userId === parseInt(userId))
                         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Create new order
    create(orderData) {
        const newOrder = {
            id: Math.max(...this.orders.map(o => o.id), 0) + 1,
            orderId: this.generateOrderId(),
            ...orderData,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.orders.push(newOrder);
        return newOrder;
    }

    // Update order status
    updateStatus(id, status, reason = null) {
        const order = this.getById(id);
        if (order) {
            order.status = status;
            order.updatedAt = new Date();
            
            if (status === 'cancelled') {
                order.cancelledAt = new Date();
                if (reason) order.cancelReason = reason;
            } else if (status === 'delivered') {
                order.deliveredAt = new Date();
            } else if (status === 'returned') {
                order.returnedAt = new Date();
                if (reason) order.returnReason = reason;
            }
            
            return order;
        }
        return null;
    }

    // Cancel order
    cancelOrder(id, reason = null) {
        return this.updateStatus(id, 'cancelled', reason);
    }

    // Return order
    returnOrder(id, reason) {
        const order = this.getById(id);
        if (order && order.status === 'delivered') {
            return this.updateStatus(id, 'returned', reason);
        }
        return null;
    }

    // Search orders
    search(query) {
        const searchTerm = query.toLowerCase();
        return this.orders.filter(order => 
            order.orderId.toLowerCase().includes(searchTerm) ||
            order.shippingAddress.name.toLowerCase().includes(searchTerm) ||
            order.status.toLowerCase().includes(searchTerm)
        );
    }

    // Get paginated orders for admin
    getAdminPaginated(page = 1, limit = 10, search = '', status = '', sortBy = 'date') {
        let filteredOrders = search ? this.search(search) : [...this.orders];
        
        // Filter by status
        if (status && status !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === status);
        }
        
        // Sort orders
        if (sortBy === 'date') {
            filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'total') {
            filteredOrders.sort((a, b) => b.total - a.total);
        } else if (sortBy === 'status') {
            filteredOrders.sort((a, b) => a.status.localeCompare(b.status));
        }
        
        const offset = (page - 1) * limit;
        const totalOrders = filteredOrders.length;
        const totalPages = Math.ceil(totalOrders / limit);
        const paginatedOrders = filteredOrders.slice(offset, offset + limit);
        
        return {
            orders: paginatedOrders,
            totalOrders,
            totalPages,
            currentPage: page
        };
    }

    // Get user paginated orders
    getUserPaginated(userId, page = 1, limit = 10, search = '') {
        let userOrders = this.getByUserId(userId);
        
        if (search) {
            const searchTerm = search.toLowerCase();
            userOrders = userOrders.filter(order => 
                order.orderId.toLowerCase().includes(searchTerm) ||
                order.status.toLowerCase().includes(searchTerm)
            );
        }
        
        const offset = (page - 1) * limit;
        const totalOrders = userOrders.length;
        const totalPages = Math.ceil(totalOrders / limit);
        const paginatedOrders = userOrders.slice(offset, offset + limit);
        
        return {
            orders: paginatedOrders,
            totalOrders,
            totalPages,
            currentPage: page
        };
    }
}

module.exports = new Order();