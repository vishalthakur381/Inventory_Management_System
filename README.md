# BharatStock — Warehouse & Inventory Management Platform

> A production-ready, full-stack MERN application built to streamline warehouse operations, inventory tracking in Indian Rupees (₹), supplier directories, and immutable stock audit logs.

![BharatStock Banner](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20React%20%7C%20MongoDB-06b6d4?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-10b981?style=for-the-badge)

---

## 📌 Project Overview & Motivation

In many Indian manufacturing, warehousing, and wholesale hubs (such as Bhiwandi, Peenya, Okhla, and Chakan), day-to-day stock keeping often relies on disconnected Excel spreadsheets or physical paper bahi-khatas. This leads to common bottlenecks:
- Miscounted inventory and stockout surprises during peak dispatch hours.
- Lack of accountability regarding who modified stock quantities and when.
- Fragmented supplier contacts and missing GSTIN records.
- Floor workers accidentally overwriting crucial product pricing or vendor data.

**BharatStock** was engineered to solve these challenges with an intuitive, secure, and responsive web application. It combines real-time inventory tracking with strict role-based access control, allowing warehouse owners to oversee operations while giving warehouse floor personnel read-only access to verify stock levels and review dispatch logs.

---

## 🛠️ Architecture & Tech Stack

```
                       ┌─────────────────────────────────────────┐
                       │           React 19 Frontend             │
                       │   (Vite, React Router 7, Lucide Icons)   │
                       │     Liquid Glass Design System (CSS)    │
                       └────────────────────┬────────────────────┘
                                            │  HTTP / REST (JWT Auth)
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │          Express.js 5 Backend           │
                       │   (RESTful Endpoints, Auth Guards,      │
                       │    Validators, JWT & BCrypt Security)   │
                       └────────────────────┬────────────────────┘
                                            │  Mongoose ODM
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │            MongoDB Database             │
                       │   (Users, Products, Categories,         │
                       │    Suppliers, Audit Logs)               │
                       └─────────────────────────────────────────┘
```

### Core Technologies:
- **Frontend:** React 19, React Router 7, Vite, Lucide Icons, Axios.
- **Styling:** Handcrafted Vanilla CSS with CSS variables, Apple-inspired liquid glassmorphism (`backdrop-filter: blur`, specular highlights, cyan-blue gradients), and full mobile responsiveness.
- **Backend:** Node.js, Express.js 5, Express Validator.
- **Database:** MongoDB with Mongoose ODM schemas.
- **Security:** JSON Web Tokens (JWT) for stateless authentication, BCrypt password hashing, and role-based route middleware (`protect`, `authorize`).
- **Resilience:** Built-in client-side data synchronization engine that guarantees zero operational downtime if the MongoDB server experiences temporary connectivity drops.

---

## ✨ Core Features

### 1. Operations Dashboard
- Real-time inventory valuation summary in Indian Rupees (₹).
- High-level KPIs: Total SKUs, in-stock count, low-stock warnings, and out-of-stock indicators.
- Quick-stock adjustment (+/-) shortcuts directly from the dashboard view.

### 2. Products & SKU Control
- Complete CRUD operations (Add, Edit, Adjust Quantity, Delete).
- Automatic status badge calculation:
  - `In Stock` (Quantity > 10)
  - `Low Stock` (Quantity 1–10)
  - `Out of Stock` (Quantity = 0)
- Real-time search by product name, SKU identifier, or category.
- One-click CSV export of active inventory for spreadsheet reconciliation and audit reports.

### 3. Categories & Supplier Directory
- Categorized product grouping with live count of associated SKUs.
- Supplier directory tracking authorized vendor names, phone numbers, contact emails, physical warehouse locations, and verified Indian GSTINs.

### 4. Immutable Stock Movement Audit Trail
- Automated logging for every inventory event:
  - Restock intake
  - Outbound dispatch
  - Manual cycle count adjustment
- Records exact timestamp, delta quantity, previous balance, updated balance, operator name, and operational notes.

### 5. Role-Based Access Control (RBAC) & Route Protection
- **Owner / Administrator:** Full privileges to create/modify SKUs, manage categories, edit suppliers, and onboard new warehouse staff.
- **Warehouse Floor Staff:** Operational view with read-only permissions across inventory and catalogs to prevent unauthorized edits.
- Direct dashboard route protection (`AppWorkspaceLayout`) that verifies active sessions before opening workspace pages.

---

## 📂 Repository Structure

```text
InventoryManagement/
├── backend/
│   ├── config/
│   │   ├── db.js                 # Database connection logic
│   │   └── seed.js               # Auto-seeder with Indian warehouse records
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, and staff management
│   │   ├── productController.js  # Product CRUD & stock adjustment operations
│   │   ├── categoryController.js # Category operations & SKU aggregations
│   │   ├── supplierController.js # Supplier directory management
│   │   └── dashboardController.js# Statistical aggregation endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token verification & role authorization
│   │   └── errorMiddleware.js    # Global error handling middleware
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt hashing
│   │   ├── Product.js            # Product & SKU schema
│   │   ├── Category.js           # Category schema
│   │   ├── Supplier.js           # Supplier & GSTIN schema
│   │   └── StockTransaction.js   # Audit log transaction schema
│   ├── routes/                   # Express route definitions
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Main server entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, Modal, StatCard, StockBadge
│   │   ├── context/              # AuthContext for session management
│   │   ├── pages/
│   │   │   ├── Landing.js        # Public landing & feature showcase
│   │   │   ├── Login.js          # Secure authentication portal
│   │   │   ├── Register.js       # Facility registration
│   │   │   ├── Dashboard.js      # Main operations control panel
│   │   │   ├── Products.js       # Product list & SKU creation
│   │   │   ├── Categories.js     # Category management
│   │   │   ├── Suppliers.js      # Supplier logistics directory
│   │   │   ├── StockRecords.js   # Immutable stock movement audit log
│   │   │   └── Staff.js          # Owner-only staff management
│   │   ├── services/
│   │   │   └── api.js            # Axios client & local sync engine
│   │   ├── App.js                # Routing, layouts, and auth guards
│   │   ├── index.css             # Glassmorphism design system & variables
│   │   └── main.js               # React root renderer
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore                    # Root gitignore (ignores node_modules, .env, dist)
├── package.json                  # Root monorepo script runner
├── requirements.txt              # Complete dependency specification
└── README.md                     # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017, or a MongoDB Atlas connection string)
- [Git](https://git-scm.com/)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/InventoryManagement.git
cd InventoryManagement
```

---

### Step 2: Backend Configuration & Launch

1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file inside `backend/` (or copy from `.env.example`):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/inventory
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. Start the backend:
   ```bash
   # Development mode with auto-reload:
   npm run dev

   # Or standard production mode:
   npm start
   ```

*The backend runs on `http://localhost:5000`. On first run, it automatically seeds initial categories, suppliers, inventory items, and default accounts.*

---

### Step 3: Frontend Setup & Launch

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Default Accounts for Testing

| Account Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Owner (Admin)** | `admin@bharatstock.in` | `password123` | Full access (Add/Edit/Delete SKUs, Suppliers, Categories, and Staff) |
| **Floor Staff** | `staff@bharatstock.in` | `password123` | Read-only inventory catalog & audit trail tracking |

> **Note:** You can also register a brand-new facility account using the **Register Facility** button on the landing page or `/register`.

---

## 📡 REST API Reference

### Authentication Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new warehouse facility |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT token |
| `GET` | `/api/auth/me` | Private | Fetch profile of current logged-in user |
| `GET` | `/api/auth/users` | Admin | List registered staff members |
| `POST` | `/api/auth/staff` | Admin | Add new staff member with read-only permissions |
| `DELETE` | `/api/auth/users/:id`| Admin | Delete staff user record |

### Inventory & Products Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Private | Get products with search, pagination, and filters |
| `GET` | `/api/products/:id` | Private | Get details of a single product |
| `POST` | `/api/products` | Admin | Create new inventory SKU |
| `PUT` | `/api/products/:id` | Admin | Update product details |
| `PATCH`| `/api/products/:id/stock`| Private | Adjust product quantity (+/- stock intake/dispatch) |
| `DELETE`| `/api/products/:id` | Admin | Remove product from inventory |

### Categories & Suppliers Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Private | Retrieve all product categories with item counts |
| `POST` | `/api/categories` | Admin | Create a new product category |
| `PUT` | `/api/categories/:id` | Admin | Update category details |
| `DELETE`| `/api/categories/:id` | Admin | Delete category |
| `GET` | `/api/suppliers` | Private | Retrieve all registered suppliers with GSTIN |
| `POST` | `/api/suppliers` | Admin | Register new supplier |
| `PUT` | `/api/suppliers/:id` | Admin | Update supplier profile |
| `DELETE`| `/api/suppliers/:id` | Admin | Delete supplier |

### Analytics Endpoint
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Private | Aggregate warehouse inventory value and status metrics |

---

## 🔮 Roadmap & Upcoming Features

- [ ] Barcode & QR Code label generator for bin and pallet tracking.
- [ ] Automated low-stock WhatsApp/SMS notifications to purchase managers.
- [ ] Tally Prime XML export integration for accounting synchronization.
- [ ] Multi-warehouse inter-depot stock transfer manifests.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

*Built with passion by Vishal Thakur. Designed for modern Indian warehouse logistics.*
