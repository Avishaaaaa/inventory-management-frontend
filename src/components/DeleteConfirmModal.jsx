import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, product, isDeleting = false }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card delete-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-icon-wrapper">
          <AlertTriangle size={36} className="delete-warning-icon" />
        </div>

        <h3 className="delete-title">Delete Product?</h3>
        <p className="delete-message">
          Are you sure you want to delete <strong className="product-name-highlight">"{product.name}"</strong>? This action cannot be undone.
        </p>

        <div className="product-summary-box">
          <div><strong>Category:</strong> {product.category}</div>
          <div><strong>Brand:</strong> {product.brand}</div>
          <div><strong>Price:</strong> ${product.price?.toFixed(2)}</div>
        </div>

        <div className="modal-footer justify-center">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(product._id)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
