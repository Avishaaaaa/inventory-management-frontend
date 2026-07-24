import React from 'react';
import { Eye, Edit, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { _id, name, category, brand, price, stock, imageUrl } = product;

  // Handle uploaded local image vs external URL vs fallback
  const getImageSource = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads')) {
      return `http://localhost:5001${url}`;
    }
    return url;
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price || 0);

  const getStockBadge = (qty) => {
    if (qty === 0) return <span className="badge badge-danger">Out of Stock</span>;
    if (qty < 10) return <span className="badge badge-warning">Low Stock ({qty})</span>;
    return <span className="badge badge-success">In Stock ({qty})</span>;
  };

  const imageSrc = getImageSource(imageUrl);

  return (
    <div className="product-card glass-card">
      {/* Image Thumbnail */}
      <div className="card-image-wrapper">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="card-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';
            }}
          />
        ) : (
          <div className="card-image-placeholder">
            <Package size={40} className="placeholder-icon" />
          </div>
        )}
        <span className="badge badge-category card-category-tag">{category}</span>
      </div>

      {/* Content */}
      <div className="card-body">
        <div className="card-brand">{brand}</div>
        <h3 className="card-title" title={name}>{name}</h3>

        <div className="card-meta">
          <div className="card-price">{formattedPrice}</div>
          {getStockBadge(stock)}
        </div>
      </div>

      {/* Card Actions */}
      <div className="card-footer">
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
    </div>
  );
};

export default ProductCard;
