const User = require('../models/User');
const Address = require('../models/Address');
const Order = require('../models/Order');

class UserController {
    // Display user profile
    profile(req, res) {
        try {
            const user = req.session.user;
            const addresses = Address.getByUserId(user.id);
            const recentOrders = Order.getByUserId(user.id).slice(0, 5);
            
            res.render('user/profile', {
                title: 'My Profile - Sneaker Head',
                user,
                addresses,
                recentOrders
            });
        } catch (error) {
            console.error('Error in UserController.profile:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Display edit profile page
    showEditProfile(req, res) {
        try {
            const user = req.session.user;
            
            res.render('user/edit-profile', {
                title: 'Edit Profile - Sneaker Head',
                user,
                error: null,
                success: null
            });
        } catch (error) {
            console.error('Error in UserController.showEditProfile:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Handle profile update
    updateProfile(req, res) {
        try {
            const userId = req.session.user.id;
            const { name, phone, dateOfBirth, gender } = req.body;
            
            const updatedUser = User.updateProfile(userId, {
                name,
                phone,
                dateOfBirth,
                gender
            });
            
            if (updatedUser) {
                req.session.user = updatedUser;
                res.render('user/edit-profile', {
                    title: 'Edit Profile - Sneaker Head',
                    user: updatedUser,
                    error: null,
                    success: 'Profile updated successfully!'
                });
            } else {
                res.render('user/edit-profile', {
                    title: 'Edit Profile - Sneaker Head',
                    user: req.session.user,
                    error: 'Failed to update profile',
                    success: null
                });
            }
        } catch (error) {
            console.error('Error in UserController.updateProfile:', error);
            res.render('user/edit-profile', {
                title: 'Edit Profile - Sneaker Head',
                user: req.session.user,
                error: 'An error occurred while updating profile',
                success: null
            });
        }
    }

    // Display change password page
    showChangePassword(req, res) {
        res.render('user/change-password', {
            title: 'Change Password - Sneaker Head',
            user: req.session.user,
            error: null,
            success: null
        });
    }

    // Handle password change
    changePassword(req, res) {
        try {
            const userId = req.session.user.id;
            const { currentPassword, newPassword, confirmPassword } = req.body;
            
            // Verify current password
            if (!User.verifyPassword(userId, currentPassword)) {
                return res.render('user/change-password', {
                    title: 'Change Password - Sneaker Head',
                    user: req.session.user,
                    error: 'Current password is incorrect',
                    success: null
                });
            }
            
            // Check if new passwords match
            if (newPassword !== confirmPassword) {
                return res.render('user/change-password', {
                    title: 'Change Password - Sneaker Head',
                    user: req.session.user,
                    error: 'New passwords do not match',
                    success: null
                });
            }
            
            // Update password
            const updatedUser = User.updatePassword(userId, newPassword);
            
            if (updatedUser) {
                res.render('user/change-password', {
                    title: 'Change Password - Sneaker Head',
                    user: req.session.user,
                    error: null,
                    success: 'Password changed successfully!'
                });
            } else {
                res.render('user/change-password', {
                    title: 'Change Password - Sneaker Head',
                    user: req.session.user,
                    error: 'Failed to change password',
                    success: null
                });
            }
        } catch (error) {
            console.error('Error in UserController.changePassword:', error);
            res.render('user/change-password', {
                title: 'Change Password - Sneaker Head',
                user: req.session.user,
                error: 'An error occurred while changing password',
                success: null
            });
        }
    }

    // Display user orders
    orders(req, res) {
        try {
            const userId = req.session.user.id;
            const page = parseInt(req.query.page) || 1;
            const search = req.query.search || '';
            
            const result = Order.getUserPaginated(userId, page, 10, search);
            
            res.render('user/orders', {
                title: 'My Orders - Sneaker Head',
                user: req.session.user,
                orders: result.orders,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                search,
                totalOrders: result.totalOrders
            });
        } catch (error) {
            console.error('Error in UserController.orders:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Display single order
    orderDetail(req, res) {
        try {
            const orderId = req.params.id;
            const order = Order.getById(orderId);
            
            if (!order || order.userId !== req.session.user.id) {
                return res.status(404).render('error', {
                    title: 'Order Not Found',
                    message: 'The order you are looking for does not exist.',
                    user: req.session.user || null
                });
            }
            
            res.render('user/order-detail', {
                title: `Order ${order.orderId} - Sneaker Head`,
                user: req.session.user,
                order
            });
        } catch (error) {
            console.error('Error in UserController.orderDetail:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Cancel order
    cancelOrder(req, res) {
        try {
            const orderId = req.params.id;
            const { reason } = req.body;
            const order = Order.getById(orderId);
            
            if (!order || order.userId !== req.session.user.id) {
                return res.status(404).json({ success: false, error: 'Order not found' });
            }
            
            if (order.status !== 'pending' && order.status !== 'confirmed') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Order cannot be cancelled at this stage' 
                });
            }
            
            const cancelledOrder = Order.cancelOrder(orderId, reason);
            
            if (cancelledOrder) {
                res.json({ success: true, message: 'Order cancelled successfully' });
            } else {
                res.status(500).json({ success: false, error: 'Failed to cancel order' });
            }
        } catch (error) {
            console.error('Error in UserController.cancelOrder:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    // Return order
    returnOrder(req, res) {
        try {
            const orderId = req.params.id;
            const { reason } = req.body;
            const order = Order.getById(orderId);
            
            if (!order || order.userId !== req.session.user.id) {
                return res.status(404).json({ success: false, error: 'Order not found' });
            }
            
            if (order.status !== 'delivered') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Only delivered orders can be returned' 
                });
            }
            
            if (!reason || reason.trim() === '') {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Return reason is required' 
                });
            }
            
            const returnedOrder = Order.returnOrder(orderId, reason);
            
            if (returnedOrder) {
                res.json({ success: true, message: 'Return request submitted successfully' });
            } else {
                res.status(500).json({ success: false, error: 'Failed to submit return request' });
            }
        } catch (error) {
            console.error('Error in UserController.returnOrder:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}

module.exports = new UserController();