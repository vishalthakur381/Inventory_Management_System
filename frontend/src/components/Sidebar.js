import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  LayoutDashboard,
  Boxes,
  FolderTree,
  Truck,
  FileSpreadsheet,
  Globe,
  ShieldCheck,
  User,
  Users,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={19} />,
    },
    {
      to: '/products',
      label: 'Products & Inventory',
      icon: <Boxes size={19} />,
    },
    {
      to: '/categories',
      label: 'Categories',
      icon: <FolderTree size={19} />,
    },
    {
      to: '/suppliers',
      label: 'Suppliers Directory',
      icon: <Truck size={19} />,
    },
    {
      to: '/records',
      label: 'Stock Audit Log',
      icon: <FileSpreadsheet size={19} />,
    },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="brand-icon">
              <Package size={22} color="#FFFFFF" strokeWidth={2.2} />
            </div>
            <div className="brand-text">
              <h2>BharatStock</h2>
              <span>Supply Chain OS</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Operations Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="sidebar-section-title" style={{ marginTop: '1.25rem' }}>Owner Control</div>
              <NavLink
                to="/staff"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon"><Users size={19} /></span>
                <span>Staff Management</span>
                <span className="badge badge-neutral" style={{ marginLeft: 'auto', fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                  Owner
                </span>
              </NavLink>
            </>
          )}

          <div className="sidebar-section-title" style={{ marginTop: '1.25rem' }}>External</div>
          <Link to="/" className="nav-link" onClick={onClose}>
            <span className="nav-icon"><Globe size={18} /></span>
            <span>Public Home</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'Rajesh Sharma'}</div>
              <div className="user-role" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {isAdmin ? (
                  <>
                    <ShieldCheck size={14} style={{ color: 'var(--primary)' }} />
                    <span>Owner (Full Admin)</span>
                  </>
                ) : (
                  <>
                    <User size={14} style={{ color: 'var(--text-muted)' }} />
                    <span>Staff (Read-Only)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{
                width: '100%',
                fontSize: '0.82rem',
                padding: '0.55rem 0.65rem',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'rgba(239, 68, 68, 0.06)',
                borderColor: 'rgba(239, 68, 68, 0.25)',
              }}
            >
              <LogOut size={15} />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
