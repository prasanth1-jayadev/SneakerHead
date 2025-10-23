const Category = require('../../models/Category');

class AdminCategoryController {
    // Display categories management page
    index(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const search = req.query.search || '';
            
            const result = Category.getPaginated(page, limit, search);
            
            res.render('admin/categories', {
                title: 'Category Management - Sneaker Head',
                user: req.session.user,
                categories: result.categories,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                search,
                totalCategories: result.totalCategories
            });
        } catch (error) {
            console.error('Error in AdminCategoryController.index:', error);
            res.status(500).render('error', { 
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Create new category
    create(req, res) {
        try {
            const { name, description } = req.body;
            
            if (!name || !description) {
                return res.redirect('/admin/categories?error=missing-fields');
            }
            
            Category.create({ name, description });
            res.redirect('/admin/categories?success=category-created');
        } catch (error) {
            console.error('Error in AdminCategoryController.create:', error);
            res.redirect('/admin/categories?error=creation-failed');
        }
    }

    // Update category
    update(req, res) {
        try {
            const categoryId = parseInt(req.params.id);
            const { name, description } = req.body;
            
            if (!name || !description) {
                return res.redirect('/admin/categories?error=missing-fields');
            }
            
            const category = Category.update(categoryId, { name, description });
            
            if (category) {
                res.redirect('/admin/categories?success=category-updated');
            } else {
                res.redirect('/admin/categories?error=category-not-found');
            }
        } catch (error) {
            console.error('Error in AdminCategoryController.update:', error);
            res.redirect('/admin/categories?error=update-failed');
        }
    }

    // Delete category (soft delete)
    delete(req, res) {
        try {
            const categoryId = parseInt(req.params.id);
            const category = Category.delete(categoryId);
            
            if (category) {
                res.json({ success: true });
            } else {
                res.status(404).json({ success: false, error: 'Category not found' });
            }
        } catch (error) {
            console.error('Error in AdminCategoryController.delete:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}

module.exports = new AdminCategoryController();