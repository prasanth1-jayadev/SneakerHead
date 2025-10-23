# Sneaker Head E-commerce - MVC Architecture

A modern, luxury sneaker e-commerce platform built with Node.js, Express.js, and EJS following the MVC (Model-View-Controller) architectural pattern.

## 🏗️ MVC Architecture Overview

### Models (`/models/`)
- **User.js** - User data management and operations
- **Product.js** - Product data management and operations  
- **Category.js** - Category data management and operations

### Views (`/views/`)
- **User Views** - Homepage, products, authentication, cart, etc.
- **Admin Views** - Dashboard, user management, product management, etc.
- **Partials** - Reusable components (navbar, footer)

### Controllers (`/controllers/`)
- **HomeController.js** - Homepage and static pages
- **AuthController.js** - User authentication
- **ProductController.js** - Product listing and details
- **Admin Controllers** - Admin panel functionality

### Routes (`/routes/`)
- **web.js** - User-facing routes
- **admin.js** - Admin panel routes

### Middleware (`/middleware/`)
- **auth.js** - Authentication middleware

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd sneaker-head-store

# Install dependencies
npm install

# Start the development server
npm run dev

# Or start production server
npm start
```

### Access Points
- **Website**: http://localhost:3002
- **Admin Panel**: http://localhost:3002/admin/login

### Demo Credentials
- **Admin**: admin@sneakerhead.com / admin123
- **User**: Any email / user123

## 📁 Project Structure

```
sneaker-head-store/
├── app.js                 # Main application entry point
├── server.js             # Legacy server file (backup)
├── package.json          # Dependencies and scripts
├── README.md            # Project documentation
│
├── controllers/         # Business logic
│   ├── HomeController.js
│   ├── AuthController.js
│   ├── ProductController.js
│   └── admin/
│       ├── AdminAuthController.js
│       ├── AdminDashboardController.js
│       ├── AdminUserController.js
│       ├── AdminCategoryController.js
│       └── AdminProductController.js
│
├── models/             # Data layer
│   ├── User.js
│   ├── Product.js
│   └── Category.js
│
├── routes/             # Route definitions
│   ├── web.js
│   └── admin.js
│
├── middleware/         # Custom middleware
│   └── auth.js
│
├── views/             # EJS templates
│   ├── index.ejs
│   ├── products.ejs
│   ├── product-detail.ejs
│   ├── cart.ejs
│   ├── wishlist.ejs
│   ├── error.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   ├── admin/
│   │   ├── login.ejs
│   │   ├── dashboard.ejs
│   │   ├── users.ejs
│   │   ├── categories.ejs
│   │   └── products.ejs
│   └── partials/
│       ├── navbar.ejs
│       └── footer.ejs
│
└── public/            # Static assets
    ├── css/
    ├── js/
    └── images/
```

## 🎯 Features

### User Features
- ✅ User registration and authentication
- ✅ Product browsing with advanced filtering
- ✅ Search functionality with autocomplete
- ✅ Product details with image gallery
- ✅ Shopping cart and wishlist
- ✅ Responsive design
- ✅ Modern UI with dark theme

### Admin Features
- ✅ Admin authentication
- ✅ Dashboard with statistics
- ✅ User management (block/unblock)
- ✅ Category management (CRUD)
- ✅ Product management (CRUD)
- ✅ Search and pagination
- ✅ Confirmation dialogs

### Technical Features
- ✅ MVC Architecture
- ✅ Session-based authentication
- ✅ Input validation
- ✅ Error handling
- ✅ Responsive design
- ✅ Clean code structure
- ✅ Modular components

## 🛠️ API Endpoints

### User Routes
```
GET  /                    # Homepage
GET  /products           # Product listing
GET  /product/:id        # Product details
GET  /login             # Login page
POST /login             # Login handler
GET  /signup            # Signup page
POST /signup            # Signup handler
GET  /logout            # Logout
GET  /api/search        # Search API
GET  /api/product/:id   # Product API
```

### Admin Routes
```
GET  /admin/login                    # Admin login
POST /admin/login                    # Admin login handler
GET  /admin/dashboard               # Admin dashboard
GET  /admin/users                   # User management
POST /admin/users/:id/toggle-status # Toggle user status
GET  /admin/categories              # Category management
POST /admin/categories              # Create category
POST /admin/categories/:id/edit     # Update category
POST /admin/categories/:id/delete   # Delete category
GET  /admin/products                # Product management
POST /admin/products/:id/toggle-status # Toggle product status
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
PORT=3002
SESSION_SECRET=your-secret-key
NODE_ENV=development
```

### Session Configuration
Sessions are configured in `app.js` with:
- Secret key for signing
- 24-hour expiration
- Secure cookies in production

## 🚀 Deployment

### Production Setup
1. Set environment variables
2. Use process manager (PM2)
3. Configure reverse proxy (Nginx)
4. Enable HTTPS
5. Set secure session cookies

### PM2 Example
```bash
npm install -g pm2
pm2 start app.js --name "sneaker-head"
pm2 startup
pm2 save
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎨 Design Philosophy

- **Clean Architecture** - Separation of concerns with MVC pattern
- **Scalability** - Modular structure for easy expansion
- **Maintainability** - Clear code organization and documentation
- **User Experience** - Modern, responsive, and intuitive design
- **Performance** - Optimized for speed and efficiency

## 🔮 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Payment gateway integration
- [ ] Order management system
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Mobile app API
- [ ] Real-time notifications
- [ ] Advanced search with Elasticsearch

---

**Built with ❤️ by the Sneaker Head Team**