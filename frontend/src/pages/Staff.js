import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Trash2,
  Search,
  Lock,
  CheckCircle2,
  Calendar,
  Warehouse,
  AlertTriangle,
  BadgeAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import api from '../services/api.js';
import Modal from '../components/Modal.js';

export const Staff = () => {
  const { user, isAdmin } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [hubFilter, setHubFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    warehouseLocation: 'Okhla Central Hub, Delhi NCR',
    designation: 'Floor Inventory Associate',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const warehouseHubs = [
    'Okhla Central Hub, Delhi NCR',
    'Bhiwandi Warehousing Hub, Mumbai',
    'Peenya Logistics Complex, Bengaluru',
    'Sri City Industrial Depot, Chennai',
    'Sanand Logistics Facility, Ahmedabad',
  ];

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await api.getStaffUsers();
      setStaffList(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: 'password123',
      warehouseLocation: 'Okhla Central Hub, Delhi NCR',
      designation: 'Floor Inventory Associate',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setFormError('Please fill in Staff Name, Work Email, and Password.');
      return;
    }

    try {
      setSaving(true);
      await api.createStaffUser(formData);
      setIsModalOpen(false);
      await loadStaff();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create staff member.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async (id, staffName) => {
    if (window.confirm(`Are you sure you want to revoke access and remove staff member "${staffName}"?`)) {
      setDeletingId(id);
      try {
        await api.deleteStaffUser(id);
        await loadStaff();
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredStaff = staffList.filter((s) => {
    const query = search.toLowerCase();
    const matchesSearch =
      s.name?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query) ||
      s.phone?.toLowerCase().includes(query) ||
      s.warehouseLocation?.toLowerCase().includes(query);
    const matchesHub = !hubFilter || s.warehouseLocation === hubFilter;
    return matchesSearch && matchesHub;
  });

  // If non-admin accesses this page
  if (!isAdmin) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center', padding: '3.5rem 2rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-full)', background: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--danger-border)' }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Owner Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.75rem' }}>
          Staff management is an Owner/Administrator exclusive capability. Your current role is <strong>Floor Staff (Read-Only)</strong>. Please contact the warehouse owner to adjust permissions.
        </p>
        <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}>
          <ShieldCheck size={14} /> Strict Read-Only Mode Active
        </span>
      </div>
    );
  }

  return (
    <div>
      {/* Top Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <ShieldCheck size={12} /> Owner Administration
            </span>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Warehouse Staff & Team Access</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Add and manage floor warehouse operators. All staff accounts have strictly <strong>Read-Only</strong> permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <UserPlus size={16} />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Overview Stat Badges */}
      <div className="stats-grid" style={{ marginBottom: '1.75rem' }}>
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-title">Active Staff Accounts</span>
            <div className="stat-icon">
              <Users size={19} color="var(--primary)" />
            </div>
          </div>
          <div className="stat-value">{staffList.length}</div>
          <div className="stat-sub" style={{ color: 'var(--success)' }}>
            <CheckCircle2 size={13} />
            <span>Assigned across regional hubs</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-title">Security Permission</span>
            <div className="stat-icon">
              <Lock size={19} color="var(--primary)" />
            </div>
          </div>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>Read-Only</div>
          <div className="stat-sub">
            <span>Cannot edit or delete catalog items</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-title">Active Depots Covered</span>
            <div className="stat-icon">
              <Warehouse size={19} color="var(--primary)" />
            </div>
          </div>
          <div className="stat-value">
            {new Set(staffList.map((s) => s.warehouseLocation)).size || 1}
          </div>
          <div className="stat-sub">
            <span>Logistics & sorting depots</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', minWidth: '240px' }} className="input-group">
            <span className="input-icon-left">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control input-with-icon"
              placeholder="Search staff by name, email, or depot..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ minWidth: '220px' }}>
            <select
              className="form-control"
              value={hubFilter}
              onChange={(e) => setHubFilter(e.target.value)}
            >
              <option value="">All Warehousing Hubs</option>
              {warehouseHubs.map((hub) => (
                <option key={hub} value={hub}>
                  {hub}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading staff directory...
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Users size={44} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Staff Members Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Add warehouse staff members who need view-only access to verify stock counts, scan barcodes, and check inventory.
          </p>
          <button type="button" onClick={handleOpenAddModal} className="btn btn-primary btn-sm">
            <UserPlus size={15} />
            <span>Add First Staff Member</span>
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Staff Operator</th>
                <th>Assigned Depot / Hub</th>
                <th>Contact Details</th>
                <th>Role & Access</th>
                <th>Account Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-full)',
                          background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: 'var(--shadow-xs)',
                        }}
                      >
                        {staff.name ? staff.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>
                          {staff.name}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {staff.designation || 'Floor Inventory Associate'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Building2 size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span>{staff.warehouseLocation || 'Okhla Central Hub, Delhi NCR'}</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={12} color="var(--text-dim)" />
                        {staff.email}
                      </span>
                      {staff.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                          <Phone size={12} color="var(--text-dim)" />
                          {staff.phone}
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <span
                      className="badge badge-neutral"
                      style={{
                        background: 'rgba(240, 249, 255, 0.95)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        color: 'var(--cyan-700)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Lock size={11} />
                      <span>Staff (Read-Only)</span>
                    </span>
                  </td>

                  <td>
                    <span className="badge badge-success">
                      <CheckCircle2 size={11} />
                      <span>Active</span>
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteStaff(staff._id, staff.name)}
                      disabled={deletingId === staff._id}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem' }}
                      title="Revoke access and remove staff member"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Staff Member Modal */}
      {isModalOpen && (
        <Modal
          title="Add Staff Member (Read-Only Access)"
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSaveStaff}>
            {formError && (
              <div
                style={{
                  background: 'var(--danger-light)',
                  color: 'var(--danger)',
                  border: '1px solid var(--danger-border)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertTriangle size={16} />
                <span>{formError}</span>
              </div>
            )}

            {/* Read-Only Security Policy Notice */}
            <div
              style={{
                background: 'rgba(240, 249, 255, 0.85)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                lineHeight: '1.5',
                color: 'var(--cyan-700)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
              }}
            >
              <Lock size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
              <div>
                <strong>Security Policy:</strong> This staff member will have strict <strong>Read-Only</strong> permissions. They can view SKUs, check stock counts, and inspect movements, but <em>cannot</em> add, update, or delete products, categories, or suppliers.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Karan Singh"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Work Email *</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="e.g. karan.singh@bharatstock.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Initial Password *</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  placeholder="Password for staff login"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Title / Designation</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Floor Inventory Supervisor"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Warehouse Facility</label>
              <select
                className="form-control"
                value={formData.warehouseLocation}
                onChange={(e) => setFormData({ ...formData, warehouseLocation: e.target.value })}
              >
                {warehouseHubs.map((hub) => (
                  <option key={hub} value={hub}>
                    {hub}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <UserPlus size={15} />
                <span>{saving ? 'Creating Staff Account...' : 'Create Staff Member'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Staff;
