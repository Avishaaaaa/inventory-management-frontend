import React from 'react';
import { Eye, Edit, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductTable = ({ products, onEdit, onDelete }) => {
  const getImageSource = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads')) {
      return `http://localhost:5001${url}`;
    }
    return url;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val || 0);
  };

  const getStockBadge = (qty) => {
    if (qty === 0) return <span className="badge badge-danger">Out of Stock</span>;
    if (qty < 10) return <span className="badge badge-warning">Low Stock ({qty})</span>;
    return <span className="badge badge-success">In Stock ({qty})</span>;
  };

  if (!products || products.length === 0) {
    return (
      <div className="table-empty-state">
        <Package size={48} className="empty-icon" />
        <p>No products found matching your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive glass-card">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const { _id, name, category, brand, price, stock, imageUrl } = product;
            const imgSrc = getImageSource(imageUrl);

            return (
              <tr key={_id}>
                <td>
                  <div className="table-product-cell">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={name}
                        className="table-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    ) : (
                      <div className="table-thumb-placeholder">
                        <Package size={20} />
                      </div>
                    )}
                    <div className="table-product-info">
                      <Link to={`/products/${_id}`} className="product-title-link">
                        {name}
                      </Link>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-category">{category}</span>
                </td>
                <td className="text-secondary">{brand}</td>
                <td className="font-semibold">{formatCurrency(price)}</td>
                <td>{getStockBadge(stock)}</td>
                <td>
                  <div className="table-actions">
                    <Link
                      to={`/products/${_id}`}
                      className="btn btn-secondary btn-icon"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => onEdit(product)}
                      className="btn btn-secondary btn-icon"
                      title="Edit Product"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="btn btn-secondary btn-icon text-danger"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
