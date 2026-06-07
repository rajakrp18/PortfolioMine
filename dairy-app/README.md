# 🥛 Dairy Management System v2.0

A full-stack dairy management system built with **Node.js + Express + PostgreSQL** (backend) and **React** (frontend).

## Architecture

```
dairy-app/
├── backend/                  ← Node.js + Express REST API
│   ├── server.js             ← Entry point
│   ├── schema.sql            ← Full PostgreSQL schema
│   ├── config/db.js          ← PostgreSQL connection pool
│   ├── middleware/auth.js    ← JWT auth + role guard
│   └── routes/
│       ├── auth.js           ← Login / register
│       ├── collections.js    ← Milk sourcing from farmers
│       ├── products.js       ← Catalog + inventory
│       ├── orders.js         ← All buyer orders (FIFO stock deduction)
│       ├── deliveries.js     ← Delivery agent tasks
│       ├── analytics.js      ← Admin KPIs + charts
│       └── users.js          ← User management + notifications
│
└── frontend/                 ← React app
    └── src/
        ├── context/
        │   ├── AuthContext.js    ← Global user state + JWT
        │   └── CartContext.js    ← Shopping cart (localStorage)
        ├── components/
        │   ├── Layout.js         ← Sidebar + topbar
        │   ├── ProtectedRoute.js ← Auth + role guard
        │   └── UI.js             ← All reusable components
        └── pages/
            ├── admin/            ← Admin dashboard, collections, orders, etc.
            ├── farmer/           ← Farmer portal
            ├── buyer/            ← Wholesaler/retailer/consumer shop
            └── agent/            ← Delivery agent app
```

## User Roles

| Role             | What they do                                           |
|------------------|--------------------------------------------------------|
| `admin`          | Full system control — sourcing, inventory, orders      |
| `farmer`         | View own milk collections and payment status           |
| `wholesaler`     | Buy products in bulk (bulk pricing)                    |
| `retailer`       | Buy at retailer price for shop resale                  |
| `consumer`       | Buy at MRP for home delivery                           |
| `delivery_agent` | Accept and update delivery assignments                 |

## Quick Start

### 1. Database
```bash
createdb dairy_db
psql dairy_db -f backend/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env      # fill in your DB credentials + JWT secret
npm install
npm run dev               # starts on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start                 # starts on http://localhost:3000
```

## API Endpoints

### Auth
| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| POST   | /api/auth/register| Create account        |
| POST   | /api/auth/login   | Get JWT token         |
| GET    | /api/auth/me      | Current user profile  |

### Collections (Milk Sourcing)
| Method | Endpoint                    | Role   |
|--------|-----------------------------|--------|
| GET    | /api/collections            | admin  |
| GET    | /api/collections/my         | farmer |
| GET    | /api/collections/summary    | admin  |
| POST   | /api/collections            | admin  |
| POST   | /api/collections/payment    | admin  |

### Products + Inventory
| Method | Endpoint                         | Role   |
|--------|----------------------------------|--------|
| GET    | /api/products                    | public |
| POST   | /api/products                    | admin  |
| PUT    | /api/products/:id                | admin  |
| POST   | /api/products/:id/inventory      | admin  |
| GET    | /api/products/inventory/low-stock| admin  |

### Orders
| Method | Endpoint                   | Role            |
|--------|----------------------------|-----------------|
| GET    | /api/orders                | admin/own buyer |
| GET    | /api/orders/:id            | admin/own buyer |
| POST   | /api/orders                | buyer           |
| PUT    | /api/orders/:id/status     | admin           |
| DELETE | /api/orders/:id            | buyer/admin     |

### Deliveries
| Method | Endpoint                         | Role           |
|--------|----------------------------------|----------------|
| GET    | /api/deliveries                  | admin/agent    |
| PUT    | /api/deliveries/:id/status       | agent/admin    |
| GET    | /api/deliveries/agents/list      | admin          |

### Analytics (admin only)
- `GET /api/analytics/dashboard` — KPI cards
- `GET /api/analytics/revenue?period=daily|monthly`
- `GET /api/analytics/top-products`
- `GET /api/analytics/buyers`
- `GET /api/analytics/milk-trend`

## Key Features vs Old PHP Project

| Feature                    | Old (PHP)        | New (v2.0)                          |
|----------------------------|------------------|-------------------------------------|
| Auth                       | Session-based    | JWT, role-based                     |
| Farmer sourcing            | ❌               | ✅ AM/PM collections, quality grading|
| Role-based pricing         | ❌               | ✅ Wholesale / retail / consumer MRP |
| Inventory                  | Basic            | ✅ FIFO batch tracking               |
| Order flow                 | Partial          | ✅ Full lifecycle + delivery assign  |
| Farmer payments            | ❌               | ✅ Bulk payout processing            |
| Analytics                  | ❌               | ✅ Revenue charts, milk trends       |
| Delivery agents            | ❌               | ✅ Full agent portal + status flow   |
| Payment gateway            | COD only         | COD / UPI / Netbanking / Credit line|
| Stack                      | PHP + MySQL      | Node.js + PostgreSQL + React        |

## Default Admin Login
```
Email: admin@dairyfresh.com
Password: Admin@1234
```
**Change this immediately in production!**
