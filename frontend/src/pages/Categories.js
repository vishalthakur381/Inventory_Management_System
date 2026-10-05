import React, { useState, useEffect } from 'react';
import { Folder, FolderTree, Plus, Pencil, Trash2, Tags, Lock } from 'lucide-react';
import api from '../services/api.js';
import Modal from '../components/Modal.js';
import { useAuth } from '../context/AuthContext.js';

export const Categories = () => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setDescription(cat.description || '');
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      await api.updateCategory(editingCategory._id, { name, description });
    } else {
      await api.createCategory({ name, description });
    }

    setName('');
    setDescription('');
    setIsModalOpen(false);
    loadCategories();
  };

  const handleDelete = async (id, catName, productCount) => {
    if (productCount > 0) {
      alert(`Cannot delete category "${catName}" because it is currently linked to ${productCount} active product(s). Please reassign those items first.`);
      return;
    }

    if (window.confirm(`Are you sure you want to permanently remove category "${catName}"?`)) {
      await api.deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Product Categories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Classify warehouse SKUs into structured storage sections
          </p>
        </div>

        {isAdmin ? (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleOpenModal()}
          >
            <Plus size={15} />
            <span>Add New Category</span>
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
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Tags size={44} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Categories Registered</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Create category groups to organize your SKUs and enable fast warehouse filtering.
          </p>
          {isAdmin && (
            <button type="button" onClick={() => handleOpenModal()} className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Add First Category</span>
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <div key={cat._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-cyan)' }}>
                    <Folder size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{cat.name}</h3>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>ID: {cat._id}</span>
                  </div>
                </div>

                <span className="badge badge-neutral">
                  {cat.productCount || 0} SKUs Linked
                </span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
                {cat.description || 'No description provided for this classification.'}
              </p>

              {isAdmin && (
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenModal(cat)}
                  >
                    <Pencil size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(cat._id, cat.name, cat.productCount)}
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <Modal
          title={editingCategory ? 'Edit Category' : 'Register New Category'}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSaveCategory}>
            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Electrical Components & Switchgear"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Brief summary of inventory items classified in this group..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
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
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Categories;
