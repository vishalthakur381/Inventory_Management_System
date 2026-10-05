import React, { useState, useEffect } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  Trash2,
  Download,
  Search,
  ClipboardList,
} from 'lucide-react';
import api from '../services/api.js';

export const StockRecords = () => {
  const [records, setRecords] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await api.getTransactions();
      setRecords(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter((rec) => {
    const matchesType = filterType === 'all' || rec.type === filterType;
    const s = search.toLowerCase();
    const matchesSearch =
      !search ||
      rec.productName?.toLowerCase().includes(s) ||
      rec.productId?.toLowerCase().includes(s) ||
      rec.performedBy?.toLowerCase().includes(s);
    return matchesType && matchesSearch;
  });

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert('No records to export');
      return;
    }

    const headers = ['Timestamp', 'SKU', 'Product Name', 'Movement Type', 'Quantity Delta', 'Previous Qty', 'New Qty', 'Operator', 'Operational Notes'];
    const rows = filteredRecords.map((r) => [
      new Date(r.timestamp).toLocaleString('en-IN'),
      r.productId || 'N/A',
      `"${r.productName || 'N/A'}"`,
      r.type,
      r.change > 0 ? `+${r.change}` : r.change,
      r.previousQty ?? 0,
      r.newQty ?? 0,
      `"${r.performedBy || 'System'}"`,
      `"${r.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BharatStock_Audit_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'restock':
        return (
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowDownLeft size={13} />
            <span>Inbound Intake</span>
          </span>
        );
      case 'adjustment':
        return (
          <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowUpRight size={13} />
            <span>Outbound Dispatch</span>
          </span>
        );
      case 'creation':
        return (
          <span className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <PlusCircle size={13} />
            <span>New SKU</span>
          </span>
        );
      case 'deletion':
        return (
          <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Trash2 size={13} />
            <span>Archived</span>
          </span>
        );
      default:
        return <span className="badge badge-neutral">{type}</span>;
    }
  };

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Stock Movement Records</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Chronological audit trail of all warehouse freight arrivals, dispatch orders, and cycle corrections
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Download size={14} />
          <span>Export Audit Log (CSV)</span>
        </button>
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
              placeholder="Search by SKU, item name, or operator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Action:</span>
            {['all', 'restock', 'adjustment', 'creation', 'deletion'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Records Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
          Loading audit trail records...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ClipboardList size={44} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Movement Records Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
            {search || filterType !== 'all'
              ? 'No transactions matched your search or filter criteria. Try resetting the filters.'
              : 'As products are restocked, edited, or adjusted, records will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp (IST)</th>
                <th>Product & SKU Code</th>
                <th>Action</th>
                <th>Units Shifted</th>
                <th>Stock State</th>
                <th>Operator</th>
                <th>Operational Notes / Consignment</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                    {new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{r.productName}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      <code>{r.productId}</code>
                    </div>
                  </td>
                  <td>{getTypeBadge(r.type)}</td>
                  <td>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        color: r.change > 0 ? 'var(--success)' : r.change < 0 ? 'var(--danger)' : 'var(--text-muted)',
                      }}
                    >
                      {r.change > 0 ? `+${r.change}` : r.change}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{r.previousQty ?? 0}</span>
                    <span style={{ margin: '0 0.35rem', color: 'var(--primary)' }}>→</span>
                    <strong>{r.newQty ?? 0} units</strong>
                  </td>
                  <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.performedBy}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                    {r.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockRecords;
