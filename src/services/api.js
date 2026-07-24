import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper for multipart/form-data requests (Image uploads)
const multipartConfig = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
};

export const productAPI = {
  // Get all products (supports search, category, sort, page, limit)
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product (accepts FormData if file upload, or standard JSON object)
  createProduct: async (productData) => {
    const isFormData = productData instanceof FormData;
    const response = await api.post(
      '/products',
      productData,
      isFormData ? multipartConfig : {}
    );
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const isFormData = productData instanceof FormData;
    const response = await api.put(
      `/products/${id}`,
      productData,
      isFormData ? multipartConfig : {}
    );
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await api.get('/products/stats/summary');
    return response.data;
  }
};

export default api;
