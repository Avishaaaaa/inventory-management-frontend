import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import DashboardStats from '../components/DashboardStats';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowRight, Plus, Package, PieChart } from 'lucide-react';

const Dashboard = ({ onOpenAddModal, showToast }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const res = await productAPI.getDashboardStats();
      console.log("Dashboard Response:", res);
      setStats(res);

    } catch (err) {
      console.error('Failed to load dashboard data', err);
      showToast('error', 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching inventory analytics..." />;
  }

  const categoryCounts = stats?.categoryCounts || {};
  const totalProducts = stats?.totalProducts || 1;

  return (
    <div className="dashboard-page">

      {/* Header Banner */}
      <div className="dashboard-header-banner glass-card">
        <div>
          <h1 className="banner-title">
            Inventory <span className="gradient-text">Overview</span>
          </h1>

          <p className="banner-subtitle">
            Real-time analytics, stock monitoring, and inventory health metrics.
          </p>
        </div>

        <div className="banner-actions">
          <button onClick={onOpenAddModal} className="btn btn-primary">
            <Plus size={18} />
            <span>Add New Product</span>
          </button>

          <Link to="/products" className="btn btn-secondary">
            <span>View All Products</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Dashboard Cards */}
      <DashboardStats stats={stats} />

      {/* Widgets */}
      <div className="dashboard-grid">

        {/* Category Distribution */}
        <div className="glass-card widget-card">
          <div className="widget-header">
            <div className="flex items-center gap-2">
              <PieChart size={20} className="text-primary" />
              <h3>Category Distribution</h3>
            </div>

            <span className="badge badge-category">
              {stats?.totalCategories || 0} Categories
            </span>
          </div>

          <div className="category-breakdown-list">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-muted">No categories recorded yet.</p>
            ) : (
              Object.entries(categoryCounts).map(([catName, count]) => {
                const percentage = Math.round((count / totalProducts) * 100);

                return (
                  <div key={catName} className="category-progress-item">
                    <div className="category-info">
                      <span className="cat-name">{catName}</span>
                      <span className="cat-count">
                        {count} items ({percentage}%)
                      </span>
                    </div>

                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="glass-card widget-card">
          <div className="widget-header">
            <div className="flex items-center gap-2">
              <Package size={20} className="text-primary" />
              <h3>Recently Added Items</h3>
            </div>

            <Link to="/products" className="link-action">
              View All
            </Link>
          </div>

          <div className="recent-products-list">
            {!stats?.recentProducts || stats.recentProducts.length === 0 ? (
              <p className="text-muted">No products created yet.</p>
            ) : (
              stats.recentProducts.map((p) => (
                <div key={p._id} className="recent-item">
                  <div className="recent-item-info">
                    <h4 className="recent-title">{p.name}</h4>
                    <span className="recent-meta">
                      {p.brand} • {p.category}
                    </span>
                  </div>

                  <div className="recent-item-price-stock">
                    <span className="recent-price">
                      ${p.price?.toFixed(2)}
                    </span>

                    <span
                      className={`badge ${
                        p.stock < 10 ? 'badge-warning' : 'badge-success'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;