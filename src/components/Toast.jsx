import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  if (!toast || !toast.message) return null;

  const { type, message } = toast;

  const icons = {
    success: <CheckCircle2 size={20} className="toast-icon success" />,
    warning: <AlertTriangle size={20} className="toast-icon warning" />,
    error: <XCircle size={20} className="toast-icon error" />,
    info: <Info size={20} className="toast-icon info" />
  };

  return (
    <div className={`toast-banner toast-${type || 'info'}`}>
      <div className="toast-content">
        {icons[type] || icons.info}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close-btn" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
