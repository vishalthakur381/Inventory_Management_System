import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Plus, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const Navbar = ({ title, onToggleSidebar }) => {
  const { dbStatus, isAdmin } = useAuth();
  const isConnected = dbStatus.database === 'Connected';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div className="page-title-wrap">
          <h1>{title}</h1>
          <div className="page-breadcrumb">
            <span>BharatStock</span>
            <span>/</span>
            <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{title}</span>
          </div>
        </div>
      </div>

      <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Real-time DB Health */}
        <div
          className="db-status-pill"
          title={
            isConnected
              ? 'Connected directly to MongoDB Cluster'
              : 'Standalone Storage Active (Local Persistent Cache)'
          }
        >
          <span className="status-dot"></span>
          <span>{isConnected ? 'MongoDB Active' : 'Offline Cache Sync'}</span>
        </div>

        {/* Quick Add Product Button or Staff Read-Only Pill */}
        {isAdmin ? (
          <Link to="/products" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={15} />
            <span>Add SKU</span>
          </Link>
        ) : (
          <span
            className="badge badge-warning"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.76rem',
              padding: '0.35rem 0.75rem',
            }}
          >
            <Lock size={12} />
            <span>Staff (Read-Only)</span>
          </span>
        )}
      </div>
    </header>
  );
};

export default Navbar;
