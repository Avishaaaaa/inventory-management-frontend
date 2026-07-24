import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductFormModal from './components/ProductFormModal';
import { productAPI } from './services/api';

const App = () => {
  const [toast, setToast] = useState(null);
  const [globalAddModalOpen, setGlobalAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleGlobalAddSubmit = async (formDataOrObj) => {
    try {
      setIsSubmitting(true);
      await productAPI.createProduct(formDataOrObj);
      showToast('success', 'Product created successfully!');
      setGlobalAddModalOpen(false);
      // Refresh page or broadcast trigger if needed
      window.location.reload();
    } catch (err) {
      console.error('Error creating product:', err);
      showToast('error', err.response?.data?.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Navbar onOpenAddModal={() => setGlobalAddModalOpen(true)} />

          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    onOpenAddModal={() => setGlobalAddModalOpen(true)}
                    showToast={showToast}
                  />
                }
              />
              <Route
                path="/products"
                element={<ProductsPage showToast={showToast} />}
              />
              <Route
                path="/products/:id"
                element={<ProductDetailsPage showToast={showToast} />}
              />
            </Routes>
          </main>

          {/* Global Toast Alert */}
          {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

          {/* Global Add Product Modal */}
          <ProductFormModal
            isOpen={globalAddModalOpen}
            onClose={() => setGlobalAddModalOpen(false)}
            onSubmit={handleGlobalAddSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
