import React, { useState, useEffect } from 'react';
import {
  Table,
  LayoutGrid,
  Download,
  Plus,
  Minus,
  Search,
  Pencil,
  Trash2,
  Lock,
  PackageSearch,
  AlertTriangle,
} from 'lucide-react';
import api from '../services/api.js';
import StockBadge from '../components/StockBadge.js';
import Modal from '../components/Modal.js';
import { useAuth } from '../context/AuthContext.js';

export const Products = () => {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    supplier: '',
    price: '',
    quantity: 10,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, supRes] = await Promise.all([
        api.getProducts({
          search: search || undefined,
          category: categoryFilter || undefined,
          supplier: supplierFilter || undefined,
          stockStatus: statusFilter !== 'all' ? statusFilter : undefined,
        }),
        api.getCategories(),
        api.getSuppliers(),
      ]);

      setProducts(prodRes.data || []);
      setCategories(catRes || []);
      setSuppliers(supRes || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, supplierFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        productName: product.productName,
        category: product.category?._id || product.category || '',
        supplier: product.supplier?._id || product.supplier || '',
        price: product.price,
        quantity: product.quantity,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        productName: '',
        category: categories[0]?._id || '',
        supplier: suppliers[0]?._id || '',
        price: '',
        quantity: 15,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.productName || formData.price === undefined || formData.price === '') {
      alert('Please fill in Product Name and Unit Price (₹).');
      return;
    }

    const actor = user?.name || (isAdmin ? 'Rajesh Sharma (Admin)' : 'Amit Verma (Staff)');

    if (editingProduct) {
      await api.updateProduct(editingProduct._id, formData, actor);
    } else {
      await api.createProduct(formData, actor);
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleAdjustStock = async (productId, change) => {
    const actor = user?.name || (isAdmin ? 'Rajesh Sharma (Admin)' : 'Amit Verma (Staff)');
    await api.adjustStock(productId, change, actor);
    loadData();
  };

  const handleDeleteProduct = async (productId) => {
    const actor = user?.name || 'Administrator';
    await api.deleteProduct(productId, actor);
    setDeleteConfirmId(null);
    loadData();
  };

  const handleExportCSV = () => {
    if (products.length === 0) {
      alert('No products available to export.');
      return;
    }

    const headers = ['SKU', 'Product Name', 'Category', 'Supplier', 'Unit Price (INR)', 'Stock Quantity', 'Status', 'Holding Value (INR)'];
    const rows = products.map((p) => [
      p.productId || 'N/A',
      `"${p.productName || 'N/A'}"`,
      `"${p.category?.name || 'N/A'}"`,
      `"${p.supplier?.name || 'N/A'}"`,
      p.price || 0,
      p.quantity || 0,
      p.stockStatus || 'in-stock',
      (p.price || 0) * (p.quantity || 0),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BharatStock_Catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Products & Inventory Catalog</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Manage active SKUs, track real-time stock levels, and perform rapid cycle adjustments
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View Toggle */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '0.2rem', display: 'flex', gap: '0.2rem' }}>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none', padding: '0.35rem 0.65rem', gap: '0.35rem' }}
              title="Table View"
            >
              <Table size={14} />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none', padding: '0.35rem 0.65rem', gap: '0.35rem' }}
              title="Grid Cards View"
            >
              <LayoutGrid size={14} />
              <span>Grid</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          {isAdmin ? (
            <button
              type="button"
              onClick={() => handleOpenModal()}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={15} />
              <span>Add SKU</span>
            </button>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={13} />
              <span>Staff View (Strict Read-Only)</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: '1', minWidth: '220px' }} className="input-group">
            <span className="input-icon-left">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control input-with-icon"
              placeholder="Search by SKU code or item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier Dropdown */}
          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
            >
              <option value="">All Suppliers ({suppliers.length})</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="in-stock">In Stock Only</option>
              <option value="low-stock">Low Stock (≤ 10)</option>
              <option value="out-of-stock">Stockout (0)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0.65rem 1rem' }}>
            Filter
          </button>

          {(search || categoryFilter || supplierFilter || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategoryFilter('');
                setSupplierFilter('');
                setStatusFilter('all');
              }}
              style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, padding: '0.5rem' }}
            >
              Reset Filters
            </button>
          )}
        </form>
      </div>

      {/* Content: Table or Grid View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading warehouse catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <PackageSearch size={44} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            No inventory items matched your active search query or filter criteria.
          </p>
          {isAdmin && (
            <button type="button" onClick={() => handleOpenModal()} className="btn btn-primary btn-sm">
              <Plus size={14} />
              <span>Register First SKU</span>
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Product & SKU Code</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Unit Price (INR)</th>
                <th>Holding Capital</th>
                <th>Physical Stock</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const totalVal = (p.price || 0) * (p.quantity || 0);
                return (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>
                        {p.productName}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        <code>{p.productId}</code>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">
                        {p.category?.name || 'General'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{p.supplier?.name || 'Direct Vendor'}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{p.supplier?.email || ''}</div>
                    </td>
                    <td style={{ fontWeight: 700, fontFamily: 'Outfit', fontSize: '0.95rem' }}>
                      ₹{(p.price || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'Outfit' }}>
                      ₹{totalVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      {isAdmin ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-subtle)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(p._id, -1)}
                            style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#FFFFFF', fontWeight: 700, border: '1px solid var(--border-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Deduct 1 unit (Dispatch)"
                          >
                            <Minus size={11} />
                          </button>
                          <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 800 }}>
                            {p.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(p._id, +1)}
                            style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#FFFFFF', fontWeight: 700, border: '1px solid var(--border-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Add 1 unit (Intake)"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontWeight: 800, fontFamily: 'Outfit', fontSize: '0.95rem' }}>
                          {p.quantity} units
                        </span>
                      )}
                    </td>
                    <td>
                      <StockBadge status={p.stockStatus} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {isAdmin ? (
                        <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleAdjustStock(p._id, +10)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.74rem', gap: '0.25rem' }}
                            title="Quick Restock +10 units"
                          >
                            <Plus size={11} />
                            <span>10</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenModal(p)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.35rem 0.5rem' }}
                            title="Edit specifications"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p._id)}
                            className="btn btn-danger btn-sm"
                            style={{ padding: '0.35rem 0.5rem' }}
                            title="Archive SKU"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <span className="badge badge-neutral" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Lock size={11} /> Read-Only
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Card View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {products.map((p) => (
            <div key={p._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <span className="badge badge-neutral">{p.category?.name || 'General'}</span>
                <StockBadge status={p.stockStatus} />
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{p.productName}</h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                SKU: <code>{p.productId}</code>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Unit Price:</span>
                  <strong>₹{(p.price || 0).toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Stock Count:</span>
                  <strong style={{ color: p.quantity === 0 ? 'var(--danger)' : p.quantity <= 10 ? 'var(--warning)' : 'var(--text-heading)' }}>
                    {p.quantity} units
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Supplier:</span>
                  <span style={{ fontWeight: 600 }}>{p.supplier?.name || 'Standard'}</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
                {isAdmin ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(p._id, -1)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.5rem' }}
                        title="Deduct 1 unit"
                      >
                        <Minus size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(p._id, +1)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.5rem' }}
                        title="Add 1 unit"
                      >
                        <Plus size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustStock(p._id, +10)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.74rem', gap: '0.25rem' }}
                      >
                        <Plus size={11} />
                        <span>10</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenModal(p)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.5rem' }}
                        title="Edit SKU"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(p._id)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.35rem 0.5rem' }}
                        title="Delete SKU"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </>
                ) : (
                  <span
                    className="badge badge-neutral"
                    style={{
                      fontSize: '0.74rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.4rem',
                    }}
                  >
                    <Lock size={12} />
                    <span>Staff View (Read-Only)</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <Modal
          title={editingProduct ? 'Edit SKU Specifications' : 'Register New Product SKU'}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSaveProduct}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Luminous Pure Sine Wave Inverter 1050VA"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Supplier Partner</label>
                <select
                  className="form-control"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                >
                  {suppliers.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Unit Price (₹ INR) *</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 7499"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Quantity In Stock</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="e.g. 25"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ margin: '1.5rem -1.75rem -1.75rem', padding: '1rem 1.75rem' }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                {editingProduct ? 'Save Changes' : 'Register SKU'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <Modal title="Confirm Product Deletion" onClose={() => setDeleteConfirmId(null)}>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <AlertTriangle size={38} color="var(--warning)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Are you sure you want to remove this SKU?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
              This will remove the item from active warehouse catalogs and record an archived entry in the audit trail.
            </p>
          </div>
          <div className="modal-footer" style={{ margin: '1.5rem -1.75rem -1.75rem', padding: '1rem 1.75rem' }}>
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDeleteProduct(deleteConfirmId)}
              className="btn btn-danger btn-sm"
            >
              Permanently Remove
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Products;
