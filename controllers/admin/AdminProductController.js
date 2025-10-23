const Product = require('../../models/Product');
const Category = require('../../models/Category');

class AdminProductController {
    // Display products management page
    index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const search = req.query.search || '';
            
            const result = Product.getAdminPaginated(page, limit, search);
            const categories = Category.getActive();
            
            res.render('admin/products', {
                title: 'Product Management - Sneaker Head',
                user: req.session.user,
                products: result.products,
                categories,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                search,
                totalProducts: result.totalProducts
            });
        } catch (error) {
            console.error('Error in AdminProductController.index:', error);
            res.status(500).render('error', { 
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Toggle product status (active/inactive)
    toggleStatus(req, res) {
        try {
            const productId = parseInt(req.params.id);
            const product = Product.toggleStatus(productId);
            
            if (product) {
                res.json({ success: true, isActive: product.isActive });
            } else {
                res.status(404).json({ success: false, error: 'Product not found' });
            }
        } catch (error) {
            console.error('Error in AdminProductController.toggleStatus:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

    // Create new product
    create(req, res) {
        try {
            const productData = req.body;
            
            // Basic validation
            if (!productData.name || !productData.price || !productData.category) {
                return res.redirect('/admin/products?error=missing-fields');
            }
            
            Product.create(productData);
            res.redirect('/admin/products?success=product-created');
        } catch (error) {
            console.error('Error in AdminProductController.create:', error);
            res.redirect('/admin/products?error=creation-failed');
        }
    }

    // Update product
    update(req, res) {
        try {
            const productId = parseInt(req.params.id);
            const updateData = req.body;
            
            const product = Product.update(productId, updateData);
            
            if (product) {
                res.redirect('/admin/products?success=product-updated');
            } else {
                res.redirect('/admin/products?error=product-not-found');
            }
        } catch (error) {
            console.error('Error in AdminProductController.update:', error);
            res.redirect('/admin/products?error=update-failed');
        }
    }

    // Delete product (soft delete)
    delete(req, res) {
        try {
            const productId = parseInt(req.params.id);
            const product = Product.delete(productId);
            
            if (product) {
                res.json({ success: true });
            } else {
                res.status(404).json({ success: false, error: 'Product not found' });
            }
        } catch (error) {
            console.error('Error in AdminProductController.delete:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}

module.exports = new AdminProductController();