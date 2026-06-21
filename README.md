# 🛒 React E-Commerce — Full Stack

A production-ready full-stack e-commerce application built with **React + MUI** on the frontend and **Node.js + Express + MongoDB Atlas** on the backend.

---

## 🖥️ Live Preview

> Run locally following the setup guide below.

---

## ✨ Features

### 🛍️ Shopping
- Browse products with filtering by gender, category, price range
- Sort by newest, popular, price, and rating
- Pagination and search with autocomplete
- Product detail page with image gallery, sizes, colors, and reviews
- Shopping cart with quantity controls, free shipping progress bar, and coupon codes

### 🔐 Authentication
- Register and login with JWT
- Protected routes for checkout, orders, and profile
- Persistent sessions via localStorage
- Admin role with dashboard access

### 📦 Orders
- Full checkout flow with shipping address form
- Order history with status tracking
- Order detail page with cancel option
- Cart auto-clears after successful order

### 👤 User Account
- Update profile info (name, phone)
- Change password
- Wishlist (toggle favorites)

### 🛠️ Admin Dashboard
- Revenue, orders, products, and users stats
- Manage and update order statuses
- Add and delete products
- Real-time category management

### 🎨 UI/UX
- Dark / Light mode (persisted)
- Skeleton loading cards
- Toast notifications
- Error Boundary for crash handling
- Custom 404 page
- SEO page titles
- Confirm dialogs before destructive actions
- Responsive — mobile drawer navigation

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)

---

### 1. Clone the repo

```bash
git clone https://github.com/Latreche-khalil14/React-E-commerce.git
cd React-E-commerce
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ecommerce
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

```bash
npm install
npm run seed      # Seed database with sample data
npm run dev       # Start API on http://localhost:5000
```

### 3. Setup Frontend

```bash
# Back in the root directory
npm install
npm run dev       # Start app on http://localhost:5173
```

---

## 🔐 Demo Credentials

| Role  | Email                   | Password     |
|-------|-------------------------|--------------|
| Admin | admin@ecommerce.com     | admin123456  |
| User  | user@ecommerce.com      | user123456   |

---

## 📁 Project Structure

```
React-E-commerce/
│
├── src/                          ← React Frontend (Vite)
│   ├── api/                      ← Axios service functions
│   │   ├── axios.js              ← Instance + interceptors
│   │   ├── auth.api.js
│   │   ├── products.api.js
│   │   ├── cart.api.js
│   │   ├── orders.api.js
│   │   └── categories.api.js
│   │
│   ├── context/                  ← Global state
│   │   ├── AuthContext.jsx       ← User auth (login, logout, token)
│   │   └── CartContext.jsx       ← Cart state + actions
│   │
│   ├── hooks/
│   │   └── usePageTitle.js       ← Dynamic browser tab titles
│   │
│   ├── pages/                    ← Route-level pages
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProductPage.jsx       ← Product detail + reviews
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── OrderDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── AdminPage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   └── components/
│       ├── common/               ← Shared UI components
│       │   ├── ErrorBoundary.jsx
│       │   ├── ProductSkeleton.jsx
│       │   ├── ConfirmDialog.jsx
│       │   └── EmptyState.jsx
│       ├── header/               ← Header1, Header2, Header3, Links
│       ├── hero/                 ← Hero slider + IconSection
│       ├── main/                 ← Products grid + ProductDetails
│       ├── footer/               ← Footer with links
│       └── scroll/               ← ScrollToTop button
│
└── backend/                      ← Node.js REST API
    ├── server.js                 ← Express entry point
    ├── .env.example              ← Environment variables template
    │
    ├── models/                   ← Mongoose schemas
    │   ├── User.model.js
    │   ├── Product.model.js
    │   ├── Category.model.js
    │   ├── Cart.model.js
    │   └── Order.model.js
    │
    ├── controllers/              ← Route logic
    │   ├── auth.controller.js
    │   ├── product.controller.js
    │   ├── cart.controller.js
    │   ├── order.controller.js
    │   ├── user.controller.js
    │   └── category.controller.js
    │
    ├── routes/                   ← Express routers
    ├── middleware/               ← Auth, validation
    └── utils/
        └── seeder.js             ← Database seeder (34 products)
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint           | Access  | Description      |
|--------|--------------------|---------|------------------|
| POST   | /api/auth/register | Public  | Create account   |
| POST   | /api/auth/login    | Public  | Login            |
| GET    | /api/auth/me       | Private | Current user     |
| PUT    | /api/auth/password | Private | Change password  |

### Products
| Method | Endpoint                  | Access  | Description        |
|--------|---------------------------|---------|--------------------|
| GET    | /api/products             | Public  | List with filters  |
| GET    | /api/products/featured    | Public  | Featured products  |
| GET    | /api/products/:id         | Public  | Single product     |
| POST   | /api/products             | Admin   | Create product     |
| PUT    | /api/products/:id         | Admin   | Update product     |
| DELETE | /api/products/:id         | Admin   | Delete product     |
| POST   | /api/products/:id/reviews | Private | Add review         |

### Query Parameters for `/api/products`
```
?search=shirt
?gender=men|women|unisex
?category=<id>
?categorySlug=electronics
?minPrice=10&maxPrice=100
?sort=newest|popular|price-asc|price-desc|rating
?page=1&limit=12
?featured=true
```

### Cart
| Method | Endpoint          | Access  | Description     |
|--------|-------------------|---------|-----------------|
| GET    | /api/cart         | Private | Get cart        |
| POST   | /api/cart         | Private | Add item        |
| PUT    | /api/cart/:itemId | Private | Update quantity |
| DELETE | /api/cart/:itemId | Private | Remove item     |
| DELETE | /api/cart/clear   | Private | Clear cart      |

### Orders
| Method | Endpoint                | Access  | Description         |
|--------|-------------------------|---------|---------------------|
| POST   | /api/orders             | Private | Place order         |
| GET    | /api/orders/my          | Private | My orders           |
| GET    | /api/orders/:id         | Private | Order detail        |
| PUT    | /api/orders/:id/cancel  | Private | Cancel order        |
| GET    | /api/orders             | Admin   | All orders          |
| PUT    | /api/orders/:id/status  | Admin   | Update status       |

---

## 🛠️ Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite 7, MUI v7, React Router v6       |
| Backend   | Node.js v22, Express 4, MongoDB Atlas, Mongoose |
| Auth      | JWT (jsonwebtoken), bcryptjs                    |
| State     | React Context + useReducer                      |
| HTTP      | Axios with request/response interceptors        |
| Security  | Helmet, CORS, express-rate-limit                |
| Dev Tools | Nodemon, ESLint                                 |

---

## 🗂️ Categories & Products

The seeder creates **34 products** across **8 categories**:

| Category    | Products |
|-------------|----------|
| Men         | 7        |
| Women       | 7        |
| Electronics | 7        |
| Sports      | 3        |
| Books       | 3        |
| Bikes       | 3        |
| Games       | 2        |
| Kids        | 2        |

---

## 📦 Production Deployment

### Backend (Render / Railway)
1. Set all environment variables from `.env.example`
2. Set `NODE_ENV=production`
3. Deploy and run `npm start`

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL=https://your-backend-url.com/api`
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## 📄 License

MIT — free to use and modify.

---

*Designed and developed by **Khalil Latreche** © 2026*
