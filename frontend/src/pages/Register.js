import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  ShieldCheck,
  Boxes,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    role: 'admin',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    try {
      setLoading(true);
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );

      if (result && result.success) {
        navigate('/dashboard');
      } else {
        setError(result?.message || 'Registration could not be completed.');
      }
    } catch {
      setError('A system error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <Link to="/" style={{ display: 'inline-block' }}>
            <div className="auth-brand-badge">
              <Package size={28} color="#FFFFFF" strokeWidth={2.2} />
            </div>
          </Link>
          <h2 className="auth-title" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Register Facility
          </h2>
          <p className="auth-subtitle">
            Set up your Indian warehouse & inventory operations workspace
          </p>
        </div>

        {error && (
          <div className="alert alert-warning" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
            <AlertCircle size={18} color="var(--warning)" style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Vikram Malhotra"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company / Warehouse Name</label>
              <input
                type="text"
                name="businessName"
                className="form-control"
                placeholder="e.g. Om Logistics Hub"
                value={formData.businessName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">Work Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="vikram@omlogistics.in"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number (+91)</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="98123 45678"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Access Level</label>
            <div className="form-row-2col">
              <div
                onClick={() => setFormData({ ...formData, role: 'admin' })}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: formData.role === 'admin' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                  background: formData.role === 'admin' ? 'var(--primary-light)' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} color="var(--primary)" />
                  <span>Depot Manager (Admin)</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem', lineHeight: 1.4 }}>
                  Full SKU management, price changes, and supplier access
                </div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, role: 'staff' })}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: formData.role === 'staff' ? '2px solid var(--primary)' : '1px solid var(--border-medium)',
                  background: formData.role === 'staff' ? 'var(--primary-light)' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Boxes size={16} color="var(--primary)" />
                  <span>Floor Staff</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem', lineHeight: 1.4 }}>
                  Cycle counting, stock intake, and outbound order scanning
                </div>
              </div>
            </div>
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Re-type password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.96rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            disabled={loading}
          >
            <span>{loading ? 'Creating Facility...' : 'Complete Registration & Open Dashboard'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an operational account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link to="/" style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={13} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
