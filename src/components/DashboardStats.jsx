import React from 'react';
import { Package, Tags, Layers, DollarSign, AlertCircle } from 'lucide-react';

const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  const {
    totalProducts = 0,
    totalCategories = 0,
    totalStock = 0,
    totalValue = 0,
    lowStockCount = 0
  } = stats;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const statCards = [
    {
      id: 'products',
      title: 'Total Products',
      value: totalProducts,
      icon: <Package size={24} className="stat-icon primary" />,
      colorClass: 'card-primary',
      description: 'Active items in database'
    },
    {
      id: 'categories',
      title: 'Total Categories',
      value: totalCategories,
      icon: <Tags size={24} className="stat-icon secondary" />,
      colorClass: 'card-secondary',
      description: 'Unique product groups'
    },
    {
      id: 'stock',
      title: 'Total Stock Quantity',
      value: totalStock.toLocaleString(),
      icon: <Layers size={24} className="stat-icon accent" />,
      colorClass: 'card-accent',
      description: 'Items across all warehouses'
    },
    {
      id: 'value',
      title: 'Total Inventory Value',
      value: formatCurrency(totalValue),
      icon: <DollarSign size={24} className="stat-icon success" />,
      colorClass: 'card-success',
      description: 'Gross asset valuation'
    }
  ];

  return (
    <div className="dashboard-stats-wrapper">
      <div className="stats-grid">
        {statCards.map((card) => (
          <div key={card.id} className={`stat-card glass-card ${card.colorClass}`}>
            <div className="stat-header">
              <span className="stat-title">{card.title}</span>
              <div className="stat-icon-wrapper">{card.icon}</div>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-description">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {lowStockCount > 0 && (
        <div className="low-stock-alert-banner">
          <AlertCircle size={22} className="alert-icon" />
          <div className="alert-content">
            <h4>Low Stock Alert!</h4>
            <p>
              {lowStockCount} {lowStockCount === 1 ? 'product has' : 'products have'} less than 10 units remaining. Consider restocking soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;
