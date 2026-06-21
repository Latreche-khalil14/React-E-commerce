# 🛒 E-Commerce App — Full Stack

A full-stack e-commerce application built with **React + MUI** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

---

### 1. Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
npm install
npm run seed      # Seed database with sample data
npm run dev       # Start backend on http://localhost:5000
```

### 2. Setup Frontend

```bash
# In the root directory
npm install
npm run dev       # Start frontend on http://localhost:5173
```

---

## 🔐 Demo Credentials (after seeding)

| Role  | Email                   | Password     |
|-------|-------------------------|--------------|
| Admin | admin@ecommerce.com     | admin123456  |
| User  | user@ecommerce.com      | user123456   |

---

## 📁 Project Structure

```
React-ecomerce/
├── src/                        ← React Frontend
│   ├── api/                    ← API service functions
│   │   ├── axios.js            ← Axios instance + interceptors
│   │   ├── auth.api.js
│   │   ├── products.api.js
│   │   ├── cart.api.js
│   │   ├── orders.api.js
│   │   └── categories.api.js
│   ├── context/                ← Global state (React Context)
│   │   ├── AuthContext.jsx     ← User auth state
│   │   └── CartContext.jsx     ← Cart state
│   ├── pages/                  ← Route pages
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── OrderDetailPage.jsx
│   │   └── ProfilePage.jsx
│   └── components/             ← Reusable UI components
│
└── backend/                    ← Node.js API
    ├── server.js               ← Express app entry point
    ├── models/                 ← Mongoose models
    │   ├── User.model.js
    │   ├── Product.model.js
    │   ├── Category.model.js
    │   ├── Cart.model.js
    │   └── Order.model.js
    ├── controllers/            ← Route handlers
    ├── routes/                 ← Express routes
    ├── middleware/             ← Auth, validation
    └── utils/seeder.js         ← Database seeder
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint             | Access  | Description       |
|--------|----------------------|---------|-------------------|
| POST   | /api/auth/register   | Public  | Register user     |
| POST   | /api/auth/login      | Public  | Login user        |
| GET    | /api/auth/me         | Private | Get current user  |
| PUT    | /api/auth/password   | Private | Update password   |

### Products
| Method | Endpoint                      | Access       | Description          |
|--------|-------------------------------|--------------|----------------------|
| GET    | /api/products                 | Public       | Get all products     |
| GET    | /api/products/featured        | Public       | Get featured         |
| GET    | /api/products/:id             | Public       | Get single product   |
| POST   | /api/products                 | Admin        | Create product       |
| PUT    | /api/products/:id             | Admin        | Update product       |
| DELETE | /api/products/:id             | Admin        | Delete product       |
| POST   | /api/products/:id/reviews     | Private      | Add review           |

### Cart
| Method | Endpoint            | Access  | Description       |
|--------|---------------------|---------|-------------------|
| GET    | /api/cart           | Private | Get user cart     |
| POST   | /api/cart           | Private | Add to cart       |
| PUT    | /api/cart/:itemId   | Private | Update quantity   |
| DELETE | /api/cart/:itemId   | Private | Remove item       |
| DELETE | /api/cart/clear     | Private | Clear cart        |

### Orders
| Method | Endpoint                | Access  | Description         |
|--------|-------------------------|---------|---------------------|
| POST   | /api/orders             | Private | Create order        |
| GET    | /api/orders/my          | Private | Get my orders       |
| GET    | /api/orders/:id         | Private | Get order detail    |
| PUT    | /api/orders/:id/cancel  | Private | Cancel order        |
| GET    | /api/orders             | Admin   | Get all orders      |
| PUT    | /api/orders/:id/status  | Admin   | Update order status |

### Product Query Params
```
GET /api/products?search=shirt&category=<id>&gender=men&minPrice=10&maxPrice=100&sort=newest&page=1&limit=12
```

---

## ✨ Features

- **Authentication** — Register, Login, JWT tokens, persistent sessions
- **Products** — Filtering by category/gender/price, sorting, pagination, reviews
- **Shopping Cart** — Add/remove/update items, stock validation, real-time badge
- **Checkout** — Shipping address, payment method selection, order summary
- **Orders** — Full order history, order detail, cancel orders
- **User Profile** — View info, change password
- **Dark/Light Mode** — Persisted to localStorage
- **Security** — Helmet, CORS, rate limiting, bcrypt passwords, JWT

---

## 🛠 Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite, MUI v7, React Router v6 |
| Backend  | Node.js, Express 4, MongoDB, Mongoose |
| Auth     | JWT, bcryptjs                       |
| State    | React Context + useReducer          |
| HTTP     | Axios with interceptors             |

---

## 📦 Production Deployment

### Backend (e.g., Railway / Render)
1. Set environment variables from `.env.example`
2. Set `NODE_ENV=production`
3. Run `npm start`

### Frontend (e.g., Vercel / Netlify)
1. Set `VITE_API_URL=https://your-backend-url.com/api`
2. Run `npm run build`
3. Deploy the `dist/` folder

---

*Designed and developed by Khalil Latreche © 2025*
