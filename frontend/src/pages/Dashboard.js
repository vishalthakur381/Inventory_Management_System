import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  IndianRupee,
  AlertTriangle,
  AlertOctagon,
  ClipboardList,
  FolderTree,
  ArrowRight,
  Plus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api.js';
import StatCard from '../components/StatCard.js';
import StockBadge from '../components/StockBadge.js';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restockingId, setRestockingId] = useState(null);

  const fetchStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickRestock = async (productId) => {
    try {
      setRestockingId(productId);
      await api.adjustStock(productId, 10, 'Operations Quick Restock');
      await fetchStats();
    } finally {
      setRestockingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        <Loader2 size={36} color="var(--primary)" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <div>Loading real-time warehouse inventory metrics...</div>
      </div>
    );
  }

  const { kpis = {}, lowStockAlerts = [], categoryStats = [], recentTransactions = [] } = stats || {};

  const totalProducts = kpis.totalProducts || 0;
  const inStockPct = totalProducts ? Math.round(((kpis.inStockCount || 0) / totalProducts) * 100) : 0;
  const lowStockPct = totalProducts ? Math.round(((kpis.lowStockCount || 0) / totalProducts) * 100) : 0;
  const outOfStockPct = totalProducts ? Math.round(((kpis.outOfStockCount || 0) / totalProducts) * 100) : 0;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Warehouse Operations Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Live status of stock counts, holding valuation, and procurement channels across Indian hubs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>New Product SKU</span>
          </Link>
          <Link to="/records" className="btn btn-secondary btn-sm">
            <span>Movement Audit Log</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Banner if items need attention */}
      {(kpis.lowStockCount > 0 || kpis.outOfStockCount > 0) && (
        <div className="alert alert-warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} color="var(--warning)" style={{ flexShrink: 0 }} />
            <div>
              <strong>Reorder Attention Required:</strong> You have{' '}
              <strong style={{ color: 'var(--danger)' }}>{kpis.outOfStockCount} out-of-stock</strong> and{' '}
              <strong style={{ color: 'var(--warning)' }}>{kpis.lowStockCount} low-stock</strong> item(s) requiring replenishment.
            </div>
          </div>
          <Link to="/products" className="btn btn-dark btn-sm">
            <span>Inspect Low Stock</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* KPI Stats Grid in INR */}
      <div className="stats-grid">
        <StatCard
          title="Total SKUs"
          value={kpis.totalProducts ?? 0}
          sub={`${(kpis.totalUnits || 0).toLocaleString('en-IN')} physical units in stock`}
          icon={<Package size={20} />}
          color="var(--primary)"
        />
        <StatCard
          title="Inventory Valuation"
          value={`₹${(kpis.totalInventoryValue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub="Total retail holding capital (INR)"
          icon={<IndianRupee size={20} />}
          color="var(--success)"
        />
        <StatCard
          title="Low Stock Warning"
          value={kpis.lowStockCount ?? 0}
          sub="Items with ≤ 10 quantity"
          icon={<AlertTriangle size={20} />}
          color="var(--warning)"
        />
        <StatCard
          title="Stockout Critical"
          value={kpis.outOfStockCount ?? 0}
          sub="Requires immediate PO generation"
          icon={<AlertOctagon size={20} />}
          color="var(--danger)"
        />
      </div>

      {/* Stock Health Progress Bar */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Stock Health Distribution</h3>
            <p className="card-subtitle">Breakdown of inventory catalog availability</p>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
            {totalProducts} Total Registered SKUs
          </span>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div style={{ height: '14px', borderRadius: 'var(--radius-full)', background: 'var(--bg-subtle)', display: 'flex', overflow: 'hidden', margin: '0.75rem 0 1.25rem' }}>
          <div
            style={{ width: `${inStockPct}%`, background: 'var(--success)', transition: 'width 0.5s ease' }}
            title={`In Stock: ${inStockPct}%`}
          />
          <div
            style={{ width: `${lowStockPct}%`, background: 'var(--warning)', transition: 'width 0.5s ease' }}
            title={`Low Stock: ${lowStockPct}%`}
          />
          <div
            style={{ width: `${outOfStockPct}%`, background: 'var(--danger)', transition: 'width 0.5s ease' }}
            title={`Out of Stock: ${outOfStockPct}%`}
          />
        </div>

        {/* Progress Legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.88rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }}></span>
            <span>In Stock ({kpis.inStockCount || 0} items — {inStockPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)' }}></span>
            <span>Low Stock ({kpis.lowStockCount || 0} items — {lowStockPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--danger)' }}></span>
            <span>Stockout ({kpis.outOfStockCount || 0} items — {outOfStockPct}%)</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Low Stock Alert List & Recent Movements */}
      <div className="dashboard-split-grid">
        {/* Urgent Low Stock Replenishment List */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="var(--warning)" />
                <span>Low Stock Replenishment Queue</span>
              </h3>
              <p className="card-subtitle">Items at or below safe buffer limits</p>
            </div>
            <Link to="/products" className="btn btn-secondary btn-sm">
              <span>All Products</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {lowStockAlerts.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={36} color="var(--success)" style={{ margin: '0 auto 0.75rem' }} />
              <div>All warehouse SKUs are adequately stocked!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {lowStockAlerts.map((prod) => (
                <div
                  key={prod._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-heading)' }}>
                      {prod.productName}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      SKU: <code>{prod.productId}</code> • Qty: <strong style={{ color: prod.quantity === 0 ? 'var(--danger)' : 'var(--warning)' }}>{prod.quantity} units</strong> • ₹{(prod.price || 0).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <StockBadge status={prod.stockStatus} />
                    <button
                      type="button"
                      onClick={() => handleQuickRestock(prod._id)}
                      disabled={restockingId === prod._id}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.76rem', padding: '0.35rem 0.65rem' }}
                      title="Quickly restock +10 units"
                    >
                      <Plus size={13} />
                      <span>{restockingId === prod._id ? 'Restocking...' : '+10 Restock'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inventory Movements */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClipboardList size={18} color="var(--primary)" />
                <span>Recent Stock Movement Activity</span>
              </h3>
              <p className="card-subtitle">Audit trail of latest stock intakes and dispatch dispatches</p>
            </div>
            <Link to="/records" className="btn btn-secondary btn-sm">
              <span>Full Log</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No recent movements logged yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, marginRight: '1rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tx.productName}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {tx.performedBy} • {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        color: tx.change > 0 ? 'var(--success)' : 'var(--danger)',
                      }}
                    >
                      {tx.change > 0 ? `+${tx.change}` : tx.change} units
                    </span>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      New: {tx.newQty}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Distribution Cards */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderTree size={18} color="var(--primary)" />
              <span>Category Distribution</span>
            </h3>
            <p className="card-subtitle">Active inventory distribution across operational categories</p>
          </div>
          <Link to="/categories" className="btn btn-secondary btn-sm">
            <span>Manage Categories</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {categoryStats.map((cat, i) => (
            <div
              key={i}
              style={{
                padding: '1.25rem',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {cat.name}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'Outfit', marginTop: '0.25rem' }}>
                {cat.count} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-dim)' }}>SKUs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
