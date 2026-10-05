import React, { useState, useEffect } from 'react';
import {
  Building2,
  Truck,
  Plus,
  Mail,
  Phone,
  MapPin,
  FileText,
  Pencil,
  Trash2,
  Lock,
} from 'lucide-react';
import api from '../services/api.js';
import Modal from '../components/Modal.js';
import { useAuth } from '../context/AuthContext.js';

export const Suppliers = () => {
  const { isAdmin } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
  });

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await api.getSuppliers();
      setSuppliers(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleOpenModal = (sup = null) => {
    if (sup) {
      setEditingSupplier(sup);
      setFormData({
        name: sup.name,
        contactPerson: sup.contactPerson || '',
        email: sup.email || '',
        phone: sup.phone || '',
        address: sup.address || '',
        gstin: sup.gstin || '',
      });
    } else {
      setEditingSupplier(null);
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        gstin: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingSupplier) {
      await api.updateSupplier(editingSupplier._id, formData);
    } else {
      await api.createSupplier(formData);
    }

    setIsModalOpen(false);
    loadSuppliers();
  };

  const handleDelete = async (id, supName, productCount) => {
    if (productCount > 0) {
      alert(`Cannot delete supplier "${supName}" because it supplies ${productCount} active SKU(s). Please reassign products first.`);
      return;
    }

    if (window.confirm(`Are you sure you want to remove supplier "${supName}"?`)) {
      await api.deleteSupplier(id);
      loadSuppliers();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Suppliers & Logistics Partners</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Centralized directory of verified procurement vendors and freight contacts
          </p>
        </div>

        {isAdmin ? (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleOpenModal()}
          >
            <Plus size={15} />
            <span>Register New Supplier</span>
          </button>
        ) : (
          <span className="badge badge-neutral" style={{ fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Lock size={12} />
            <span>Staff View (Read-Only)</span>
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading supplier network...
        </div>
      ) : suppliers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Truck size={44} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Suppliers Registered</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Add your primary vendors to link SKUs and manage direct communication.
          </p>
          {isAdmin && (
            <button type="button" onClick={() => handleOpenModal()} className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Register First Supplier</span>
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {suppliers.map((sup) => (
            <div key={sup._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-cyan)' }}>
                    <Building2 size={22} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{sup.name}</h3>
                    {sup.contactPerson && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Rep: <strong>{sup.contactPerson}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <span className="badge badge-neutral">
                  {sup.productCount || 0} Products
                </span>
              </div>

              {/* Contact information rows */}
              <div style={{ background: 'var(--bg-subtle)', padding: '0.95rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.86rem', marginBottom: '1.25rem', flex: 1 }}>
                {sup.gstin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={15} color="var(--text-dim)" style={{ flexShrink: 0 }} />
                    <span>GSTIN: <strong>{sup.gstin}</strong></span>
                  </div>
                )}
                {sup.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <a href={`mailto:${sup.email}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                      {sup.email}
                    </a>
                  </div>
                )}
                {sup.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={15} color="var(--success)" style={{ flexShrink: 0 }} />
                    <span>{sup.phone}</span>
                  </div>
                )}
                {sup.address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <MapPin size={15} color="var(--text-dim)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-muted)' }}>{sup.address}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {sup.email && (
                    <a href={`mailto:${sup.email}`} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem', gap: '0.35rem' }}>
                      <Mail size={12} />
                      <span>Email</span>
                    </a>
                  )}
                  {sup.phone && (
                    <a href={`tel:${sup.phone}`} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem', gap: '0.35rem' }}>
                      <Phone size={12} />
                      <span>Call</span>
                    </a>
                  )}
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem', gap: '0.35rem' }}
                      onClick={() => handleOpenModal(sup)}
                    >
                      <Pencil size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem', gap: '0.35rem' }}
                      onClick={() => handleDelete(sup._id, sup.name, sup.productCount)}
                    >
                      <Trash2 size={12} />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Supplier Modal */}
      {isModalOpen && (
        <Modal
          title={editingSupplier ? 'Edit Supplier Details' : 'Register New Vendor Partner'}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSaveSupplier}>
            <div className="form-group">
              <label className="form-label">Company / Supplier Name *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Bharat Electricals & Logistics Ltd"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN / Tax ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="07AAACB2211D1Z8"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="orders@bharatelectricals.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (+91)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+91 98112 45678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Distribution / Warehouse Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Plot 42, Okhla Industrial Area Phase-III, New Delhi 110020"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="modal-footer" style={{ margin: '1.5rem -1.75rem -1.75rem', padding: '1rem 1.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                {editingSupplier ? 'Save Changes' : 'Register Supplier'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Suppliers;
