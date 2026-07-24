import React, { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, AlertCircle } from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Electronics',
  'Furniture',
  'Home & Kitchen',
  'Footwear',
  'Clothing',
  'Accessories',
  'Books & Stationery',
  'Sports & Fitness',
  'Beauty & Personal Care',
  'Other'
];

const ProductFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const isEditMode = Boolean(initialData && initialData._id);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    brand: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: ''
  });

  const [imageTab, setImageTab] = useState('url'); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Electronics',
        brand: initialData.brand || '',
        price: initialData.price !== undefined ? initialData.price : '',
        stock: initialData.stock !== undefined ? initialData.stock : '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || ''
      });
      if (initialData.imageUrl && initialData.imageUrl.startsWith('/uploads')) {
        setPreviewUrl(`http://localhost:5001${initialData.imageUrl}`);
      } else {
        setPreviewUrl(initialData.imageUrl || '');
      }
    } else {
      setFormData({
        name: '',
        category: 'Electronics',
        brand: '',
        price: '',
        stock: '',
        description: '',
        imageUrl: ''
      });
      setPreviewUrl('');
      setSelectedFile(null);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setPreviewUrl(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.category.trim()) errs.category = 'Category is required';
    if (!formData.brand.trim()) errs.brand = 'Brand is required';

    if (formData.price === '' || isNaN(formData.price)) {
      errs.price = 'Valid price is required';
    } else if (Number(formData.price) < 0) {
      errs.price = 'Price cannot be negative';
    }

    if (formData.stock === '' || isNaN(formData.stock)) {
      errs.stock = 'Valid stock quantity is required';
    } else if (Number(formData.stock) < 0) {
      errs.stock = 'Stock cannot be negative';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (selectedFile && imageTab === 'file') {
      // Use FormData for file upload
      const data = new FormData();
      data.append('name', formData.name.trim());
      data.append('category', formData.category.trim());
      data.append('brand', formData.brand.trim());
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('description', formData.description.trim());
      data.append('image', selectedFile);

      onSubmit(data, isEditMode ? initialData._id : null);
    } else {
      // Use standard JSON object
      onSubmit(
        {
          name: formData.name.trim(),
          category: formData.category.trim(),
          brand: formData.brand.trim(),
          price: Number(formData.price),
          stock: Number(formData.stock),
          description: formData.description.trim(),
          imageUrl: formData.imageUrl.trim()
        },
        isEditMode ? initialData._id : null
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitForm} className="modal-form">
          <div className="form-grid">
            {/* Product Name */}
            <div className="form-group full-width">
              <label className="form-label">
                Product Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Bluetooth Headphones"
                className={`form-input ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-select ${errors.category ? 'error' : ''}`}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            {/* Brand */}
            <div className="form-group">
              <label className="form-label">
                Brand <span className="required">*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Sony, Apple, Nike"
                className={`form-input ${errors.brand ? 'error' : ''}`}
              />
              {errors.brand && <span className="error-text">{errors.brand}</span>}
            </div>

            {/* Price */}
            <div className="form-group">
              <label className="form-label">
                Price ($) <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`form-input ${errors.price ? 'error' : ''}`}
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            {/* Stock */}
            <div className="form-group">
              <label className="form-label">
                Stock Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className={`form-input ${errors.stock ? 'error' : ''}`}
              />
              {errors.stock && <span className="error-text">{errors.stock}</span>}
            </div>
          </div>

          {/* Image Upload / URL Tabs */}
          <div className="form-group full-width">
            <label className="form-label">Product Image</label>
            <div className="image-tabs">
              <button
                type="button"
                className={`tab-btn ${imageTab === 'url' ? 'active' : ''}`}
                onClick={() => setImageTab('url')}
              >
                <LinkIcon size={14} /> Image URL
              </button>
              <button
                type="button"
                className={`tab-btn ${imageTab === 'file' ? 'active' : ''}`}
                onClick={() => setImageTab('file')}
              >
                <Upload size={14} /> Upload File
              </button>
            </div>

            {imageTab === 'url' ? (
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="form-input"
              />
            ) : (
              <div className="file-upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="product-image-file"
                  className="file-input-hidden"
                />
                <label htmlFor="product-image-file" className="file-upload-label">
                  <Upload size={24} />
                  <span>{selectedFile ? selectedFile.name : 'Click to upload image file'}</span>
                </label>
              </div>
            )}

            {previewUrl && (
              <div className="image-preview-wrapper">
                <span className="preview-title">Preview:</span>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="image-preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description, specifications, features..."
              className="form-textarea"
            />
          </div>

          {/* Modal Actions */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
