const Address = require('../models/Address');

class AddressController {
    // Display addresses
    index(req, res) {
        try {
            const userId = req.session.user.id;
            const addresses = Address.getByUserId(userId);
            
            res.render('user/addresses', {
                title: 'My Addresses - Sneaker Head',
                user: req.session.user,
                addresses
            });
        } catch (error) {
            console.error('Error in AddressController.index:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Display add address form
    showAdd(req, res) {
        res.render('user/add-address', {
            title: 'Add Address - Sneaker Head',
            user: req.session.user,
            error: null
        });
    }

    // Handle add address
    create(req, res) {
        try {
            const userId = req.session.user.id;
            const addressData = {
                userId,
                ...req.body,
                isDefault: req.body.isDefault === 'on'
            };
            
            const newAddress = Address.create(addressData);
            
            if (newAddress) {
                res.redirect('/user/addresses?success=Address added successfully');
            } else {
                res.render('user/add-address', {
                    title: 'Add Address - Sneaker Head',
                    user: req.session.user,
                    error: 'Failed to add address'
                });
            }
        } catch (error) {
            console.error('Error in AddressController.create:', error);
            res.render('user/add-address', {
                title: 'Add Address - Sneaker Head',
                user: req.session.user,
                error: 'An error occurred while adding address'
            });
        }
    }

    // Display edit address form
    showEdit(req, res) {
        try {
            const addressId = req.params.id;
            const address = Address.getById(addressId);
            
            if (!address || address.userId !== req.session.user.id) {
                return res.status(404).render('error', {
                    title: 'Address Not Found',
                    message: 'The address you are looking for does not exist.',
                    user: req.session.user || null
                });
            }
            
            res.render('user/edit-address', {
                title: 'Edit Address - Sneaker Head',
                user: req.session.user,
                address,
                error: null
            });
        } catch (error) {
            console.error('Error in AddressController.showEdit:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Handle edit address
    update(req, res) {
        try {
            const addressId = req.params.id;
            const address = Address.getById(addressId);
            
            if (!address || address.userId !== req.session.user.id) {
                return res.status(404).render('error', {
                    title: 'Address Not Found',
                    message: 'The address you are looking for does not exist.',
                    user: req.session.user || null
                });
            }
            
            const updateData = {
                ...req.body,
                isDefault: req.body.isDefault === 'on'
            };
            
            const updatedAddress = Address.update(addressId, updateData);
            
            if (updatedAddress) {
                res.redirect('/user/addresses?success=Address updated successfully');
            } else {
                res.render('user/edit-address', {
                    title: 'Edit Address - Sneaker Head',
                    user: req.session.user,
                    address,
                    error: 'Failed to update address'
                });
            }
        } catch (error) {
            console.error('Error in AddressController.update:', error);
            res.render('user/edit-address', {
                title: 'Edit Address - Sneaker Head',
                user: req.session.user,
                address: Address.getById(req.params.id),
                error: 'An error occurred while updating address'
            });
        }
    }

    // Delete address
    delete(req, res) {
        try {
            const addressId = req.params.id;
            const address = Address.getById(addressId);
            
            if (!address || address.userId !== req.session.user.id) {
                return res.status(404).json({ success: false, error: 'Address not found' });
            }
            
            const deletedAddress = Address.delete(addressId);
            
            if (deletedAddress) {
                res.json({ success: true, message: 'Address deleted successfully' });
            } else {
                res.status(500).json({ success: false, error: 'Failed to delete address' });
            }
        } catch (error) {
            console.error('Error in AddressController.delete:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    // Set default address
    setDefault(req, res) {
        try {
            const addressId = req.params.id;
            const userId = req.session.user.id;
            
            const address = Address.setDefault(addressId, userId);
            
            if (address) {
                res.json({ success: true, message: 'Default address updated' });
            } else {
                res.status(404).json({ success: false, error: 'Address not found' });
            }
        } catch (error) {
            console.error('Error in AddressController.setDefault:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}

module.exports = new AddressController();