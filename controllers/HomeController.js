const Product = require('../models/Product');

class HomeController {
    // Display homepage
    index(req, res) {
        try {
            const activeProducts = Product.getActive();
            const trendingProducts = Product.getTrending();
            const newProducts = Product.getNew();
            
            res.render('index', { 
                shoes: activeProducts.slice(0, 4), 
                trendingShoes: trendingProducts, 
                newShoes: newProducts,
                user: req.session.user || null,
                title: 'Sneaker Head - Step Into the Future'
            });
        } catch (error) {
            console.error('Error in HomeController.index:', error);
            res.status(500).render('error', { 
                title: 'Error',
                message: 'Something went wrong',
                user: req.session.user || null
            });
        }
    }

    // Display about page
    about(req, res) {
        res.render('about', { 
            title: 'About Us - Sneaker Head',
            user: req.session.user || null
        });
    }

    // Display contact page
    contact(req, res) {
        res.render('contact', { 
            title: 'Contact Us - Sneaker Head',
            user: req.session.user || null
        });
    }

    // This method is now handled by CartController

    // Display wishlist page
    wishlist(req, res) {
        res.render('wishlist', { 
            title: 'My Wishlist - Sneaker Head',
            user: req.session.user || null
        });
    }
}

module.exports = new HomeController();