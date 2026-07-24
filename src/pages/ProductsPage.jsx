import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductTable from '../components/ProductTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductFormModal from '../components/ProductFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { Search, Filter, ArrowUpDown, LayoutGrid, List, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Furniture',
  'Kitchen',
  'Footwear',
  'Clothing',
  'Accessories',
  'Books & Stationery',
  'Sports & Fitness',
  'Beauty & Personal Care',
  'Other'
];

const ProductsPage = ({ showToast }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const itemsPerPage = 8;

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);



  const fetchProducts = async () => {
   try {
    setLoading(true);

    const params = {
      page: currentPage,
      limit: itemsPerPage,
      sort: sortBy !== "newest" ? sortBy : undefined,
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      search: searchTerm.trim() || undefined,
    };

    const res = await productAPI.getProducts(params);

    setProducts(res.products || []);
    setTotalPages(res.totalPages || 1);
    setTotalProductsCount(res.totalProducts || 0);

  } catch (err) {
    console.error("Error fetching products:", err);
    showToast("error", "Failed to load products");
  } finally {
    setLoading(false);
  }
};

  

  useEffect(() => {
    // Reset page to 1 on filter changes
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, sortBy]);

  // Modal Handlers
  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setFormModalOpen(true);
  };

  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formDataOrObj, productId) => {
    try {
      setIsSubmitting(true);
      if (productId) {
        await productAPI.updateProduct(productId, formDataOrObj);
        showToast('success', 'Product updated successfully!');
      } else {
        await productAPI.createProduct(formDataOrObj);
        showToast('success', 'New product added successfully!');
      }
      setFormModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Save error:', err);
      const msg = err.response?.data?.message || 'Error saving product';
      showToast('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      setIsDeleting(true);
      await productAPI.deleteProduct(id);
      showToast('success', 'Product deleted successfully!');
      setDeleteModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      showToast('error', 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">
            Product <span className="gradient-text">Inventory</span>
          </h1>
          <p className="page-subtitle">
            Showing {totalProductsCount} {totalProductsCount === 1 ? 'item' : 'items'} in catalogue
          </p>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Control Bar: Search, Category Filter, Sort, View Toggle */}
      <div className="controls-bar glass-card">
        {/* Search */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-sort-group">
          {/* Category Filter */}
          <div className="select-wrapper">
            <Filter size={16} className="select-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="control-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="select-wrapper">
            <ArrowUpDown size={16} className="select-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="control-select"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              
            </select>
          </div>

          {/* View Toggle */}
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Content Display */}
      {loading ? (
        <LoadingSpinner text="Loading products catalog..." />
      ) : products.length === 0 ? (
        <div className="glass-card empty-catalog-state">
          <h3>No products match your criteria</h3>
          <p>Try adjusting your search query, clearing filters, or adding a new product.</p>
          <button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} className="btn btn-secondary mt-3">
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="btn btn-secondary btn-icon"
          >
            <ChevronLeft size={18} />
            <span>Prev</span>
          </button>

          <span className="pagination-info">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="btn btn-secondary btn-icon"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedProduct}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        product={productToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ProductsPage;
