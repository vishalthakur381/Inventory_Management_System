import React from 'react';

export const StatCard = ({ title, value, sub, icon, color = 'var(--primary)' }) => {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-title">{title}</span>
        <div
          className="stat-icon"
          style={{
            color: color,
          }}
        >
          {icon}
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
};

export default StatCard;
