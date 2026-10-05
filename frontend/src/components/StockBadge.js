import React from 'react';

export const StockBadge = ({ status, quantity }) => {
  const getLabel = () => {
    switch (status) {
      case 'in-stock':
        return 'In Stock';
      case 'low-stock':
        return 'Low Stock Alert';
      case 'out-of-stock':
        return 'Stockout';
      default:
        return status;
    }
  };

  const getStyleClass = () => {
    switch (status) {
      case 'in-stock':
        return 'badge-in-stock';
      case 'low-stock':
        return 'badge-low-stock';
      case 'out-of-stock':
        return 'badge-out-of-stock';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <span className={`badge ${getStyleClass()}`}>
      <span className="status-dot" style={{ width: '6px', height: '6px' }}></span>
      {getLabel()} {quantity !== undefined ? `(${quantity})` : ''}
    </span>
  );
};

export default StockBadge;
