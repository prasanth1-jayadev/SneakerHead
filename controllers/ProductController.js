const Product = require('../models/Product');

class ProductController {
    // Display products listing page
    index(req, res) {
        try {
            const { category, sort, search, page = 1, minPrice, maxPrice, brand } = req.query;
            const limit = 12;
            
            const filters = {
                category,
                sort,
                search,
                minPrice,
                maxPrice,
                brand
            };
            
            const result = Product.getPaginated(parseInt(page), limit, filters);
            const brands = Product.getBrands();
            
            res.render('products', { 
                shoes: result.products,
                brands,
                currentCategory: category || 'all',
                currentSort: sort || 'default',
                currentSearch: search || '',
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                totalProducts: result.totalProducts,
                minPrice: minPrice || '',
                maxPrice: maxPrice || '',
                currentBrand: brand || '',
                user: req.session.user || null,
                title: 'Products - Sneaker Head'
            });
        } catch (error) {
            console.error('Error in ProductController.index:', error);
            res.status(500).render('error', { 
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Display single product page
    show(req, res) {
        try {
            const productId = req.params.id;
            const product = Product.getById(productId);
            
            // Redirect if product is blocked/inactive
            if (!product || !product.isActive) {
                return res.redirect('/products?error=product-unavailable');
            }
            
            const relatedProducts = Product.getRelated(productId, product.category);
            
            res.render('product-detail', { 
                shoe: product, 
                relatedShoes: relatedProducts,
                user: req.session.user || null,
                title: `${product.name} - Sneaker Head`
            });
        } catch (error) {
            console.error('Error in ProductController.show:', error);
            res.status(500).render('error', { 
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Search products (API endpoint)
    search(req, res) {
        try {
            const query = req.query.q;
            
            if (!query || query.length < 2) {
                return res.json([]);
            }
            
            const results = Product.search(query);
            const suggestions = results.slice(0, 5).map(product => ({
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                image: product.image
            }));
            
            res.json(suggestions);
        } catch (error) {
            console.error('Error in ProductController.search:', error);
            res.status(500).json({ error: 'Search failed' });
        }
    }

    // Get product by ID (API endpoint)
    getProduct(req, res) {
        try {
            const productId = parseInt(req.params.id);
            const product = Product.getById(productId);
            
            if (!product || !product.isActive) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            res.json(product);
        } catch (error) {
            console.error('Error in ProductController.getProduct:', error);
            res.status(500).json({ error: 'Failed to get product' });
        }
    }

    // Display search results page
    searchResults(req, res) {
        try {
            const query = req.query.q || '';
            let results = [];
            
            if (query && query.length >= 2) {
                results = Product.search(query);
            }
            
            res.render('search-results', {
                query,
                results,
                user: req.session.user || null,
                title: `Search Results for "${query}" - Sneaker Head`
            });
        } catch (error) {
            console.error('Error in ProductController.searchResults:', error);
            res.status(500).render('error', { 
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }
}

module.exports = new ProductController();