import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading products...' }) => {
  return (
    <div className="spinner-container">
      <Loader2 className="spinner-icon" size={36} />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
