import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

export const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const redirectMessage = location.state?.message;
  const fromPath = location.state?.from?.pathname || '/dashboard';

  // If already logged in, navigate directly to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your email/mobile and password.');
      return;
    }

    try {
      setLoading(true);
      const result = await login(identifier.trim(), password);
      if (result && result.success) {
        navigate(fromPath, { replace: true });
      } else {
        setError(result?.message || 'Invalid login details. Please verify your email/mobile and password.');
      }
    } catch {
      setError('Server communication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '440px' }}>
        <div className="auth-header">
          <Link to="/" style={{ display: 'inline-block' }}>
            <div className="auth-brand-badge">
              <Package size={28} color="#FFFFFF" strokeWidth={2.2} />
            </div>
          </Link>
          <h2 className="auth-title" style={{ fontFamily: 'Outfit, sans-serif' }}>
            BharatStock
          </h2>
          <p className="auth-subtitle">
            Sign in to access your inventory & warehouse operations
          </p>
        </div>

        {redirectMessage && !error && (
          <div
            style={{
              background: 'rgba(240, 249, 255, 0.9)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              color: 'var(--cyan-700)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <ShieldCheck size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>{redirectMessage}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-warning" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
            <AlertCircle size={18} color="var(--warning)" style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Work Email / Mobile Number</label>
            <div className="input-group">
              <span className="input-icon-left">
                <User size={16} />
              </span>
              <input
                type="text"
                className="form-control input-with-icon"
                placeholder="e.g. rajesh@bharatstock.in or 9811245678"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {showPassword ? (
                  <>
                    <EyeOff size={13} />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye size={13} />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            <div className="input-group">
              <span className="input-icon-left">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control input-with-icon"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              Remember this workstation
            </label>
            <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.96rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          New business facility?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Register New Warehouse
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link to="/" style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={13} />
            <span>Back to Home</span>
          </Link>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          <span>Secure Enterprise Access &bull; 256-bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
