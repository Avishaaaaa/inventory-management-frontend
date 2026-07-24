import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductFormModal from '../components/ProductFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { ArrowLeft, Edit, Trash2, Package, Tag, ShieldCheck, DollarSign, Layers, Clock } from 'lucide-react';

const ProductDetailsPage = ({ showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getProductById(id);
      if (res.success) {
        setProduct(res.data);
      }
    } catch (err) {
      console.error('Error loading product details:', err);
      showToast('error', 'Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Fetching product specifications..." />;
  }

  if (!product) return null;

  const getImageSource = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads')) {
      return `http://localhost:5001${url}`;
    }
    return url;
  };

  const handleEditSubmit = async (formDataOrObj, productId) => {
    try {
      setIsSubmitting(true);
      await productAPI.updateProduct(productId, formDataOrObj);
      showToast('success', 'Product updated successfully!');
      setEditModalOpen(false);
      fetchProduct();
    } catch (err) {
      showToast('error', 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async (productId) => {
    try {
      setIsDeleting(true);
      await productAPI.deleteProduct(productId);
      showToast('success', 'Product deleted successfully!');
      navigate('/products');
    } catch (err) {
      showToast('error', 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const imgSrc = getImageSource(product.imageUrl);

  return (
    <div className="product-details-page">
      {/* Top Back Navigation */}
      <Link to="/products" className="back-link">
        <ArrowLeft size={18} />
        <span>Back to Product List</span>
      </Link>

      {/* Main Details Card */}
      <div className="details-card glass-card">
        <div className="details-grid">
          {/* Left Column: Image Preview */}
          <div className="details-image-section">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={product.name}
                className="details-main-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';
                }}
              />
            ) : (
              <div className="details-image-placeholder">
                <Package size={64} className="text-muted" />
                <span>No image available</span>
              </div>
            )}
          </div>

          {/* Right Column: Spec Info & Actions */}
          <div className="details-info-section">
            <div className="details-header-badges">
              <span className="badge badge-category">{product.category}</span>
              <span className={`badge ${product.stock === 0 ? 'badge-danger' : product.stock < 10 ? 'badge-warning' : 'badge-success'}`}>
                {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? `Low Stock (${product.stock})` : `In Stock (${product.stock})`}
              </span>
            </div>

            <span className="details-brand-title">{product.brand}</span>
            <h1 className="details-product-title">{product.name}</h1>

            <div className="details-price-row">
              <span className="details-price-label">Price:</span>
              <span className="details-price-value">${product.price?.toFixed(2)}</span>
            </div>

            {/* Spec Cards */}
            <div className="specs-grid">
              <div className="spec-card">
                <Layers size={18} className="spec-icon" />
                <div>
                  <span className="spec-label">Stock Quantity</span>
                  <span className="spec-val">{product.stock} units</span>
                </div>
              </div>

              <div className="spec-card">
                <Tag size={18} className="spec-icon" />
                <div>
                  <span className="spec-label">Brand</span>
                  <span className="spec-val">{product.brand}</span>
                </div>
              </div>

              <div className="spec-card">
                <ShieldCheck size={18} className="spec-icon" />
                <div>
                  <span className="spec-label">Status</span>
                  <span className="spec-val">{product.stock > 0 ? 'Available' : 'Unavailable'}</span>
                </div>
              </div>

              <div className="spec-card">
                <Clock size={18} className="spec-icon" />
                <div>
                  <span className="spec-label">Last Updated</span>
                  <span className="spec-val">
                    {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="details-description-box">
              <h3>Product Description</h3>
              <p>{product.description || 'No detailed description provided for this product item.'}</p>
            </div>

            {/* Action Buttons */}
            <div className="details-actions">
              <button
                onClick={() => setEditModalOpen(true)}
                className="btn btn-primary"
              >
                <Edit size={18} />
                <span>Edit Product</span>
              </button>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="btn btn-danger"
              >
                <Trash2 size={18} />
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={product}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        product={product}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ProductDetailsPage;
