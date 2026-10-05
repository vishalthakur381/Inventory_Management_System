import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import Sidebar from './components/Sidebar.js';
import Navbar from './components/Navbar.js';
import Landing from './pages/Landing.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Dashboard from './pages/Dashboard.js';
import Products from './pages/Products.js';
import Categories from './pages/Categories.js';
import Suppliers from './pages/Suppliers.js';
import StockRecords from './pages/StockRecords.js';
import Staff from './pages/Staff.js';

import { useAuth } from './context/AuthContext.js';

// Layout wrapper for authenticated dashboard / workspace pages
const AppWorkspaceLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // If not logged in, redirect to login page with return url and message
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Please sign in to access your warehouse dashboard.',
        }}
        replace
      />
    );
  }

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Warehouse Operations Dashboard';
      case '/products':
        return 'Products & Inventory Catalog';
      case '/categories':
        return 'Categories Catalog';
      case '/suppliers':
        return 'Suppliers & Logistics Directory';
      case '/records':
        return 'Stock Movement Audit Log';
      case '/staff':
        return 'Warehouse Staff Directory & Permissions';
      default:
        return 'BharatStock Control';
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-layout">
        <Navbar
          title={getPageTitle()}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Marketing */}
          <Route path="/" element={<Landing />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated Workspace Hub with nested Outlet */}
          <Route element={<AppWorkspaceLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/records" element={<StockRecords />} />
            <Route path="/staff" element={<Staff />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
