# NexStock Frontend

A modern and responsive Product Inventory Management System frontend built using **React.js** and **Vite**. The application provides an intuitive interface to manage products, monitor inventory, search items, and view real-time dashboard analytics.

---

## Features

- Modern Dashboard with Inventory Analytics
- Product Listing (Grid & Table View)
- Add, Edit & Delete Products
- Product Details Page
- Search Products
- Category Filter
- Product Sorting
- Pagination
- Responsive Design
- Dark / Light Theme
- Loading Spinner
- Toast Notifications
- Professional UI Design
- REST API Integration

---

## Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Lucide React Icons
- CSS3
- JavaScript (ES6+)

---

## Project Structure

```
frontend
│
├── public
│
├── src
│   ├── assets
│   ├── components
│   │   ├── Navbar
│   │   ├── ProductCard
│   │   ├── ProductTable
│   │   ├── ProductFormModal
│   │   ├── DeleteConfirmModal
│   │   ├── DashboardStats
│   │   ├── Toast
│   │   └── LoadingSpinner
│   │
│   ├── context
│   │   └── ThemeContext
│   │
│   ├── pages
│   │   ├── Dashboard
│   │   ├── ProductsPage
│   │   └── ProductDetailsPage
│   │
│   ├── services
│   │   └── api.js
│   │
│   ├── styles
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/Avishaaaaa/inventory-management-frontend.git
```

Go to the project folder

```bash
cd inventory-management-frontend
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

## Backend API

The frontend communicates with the backend using REST APIs.

Example Base URL

```
http://localhost:5000/api
```

API file

```
src/services/api.js
```

---

## Main Functionalities

### Dashboard

- Total Products
- Total Categories
- Total Stock
- Total Inventory Value
- Low Stock Alert
- Category Distribution
- Recently Added Products

### Products

- View all products
- Search by product name
- Filter by category
- Sort products
- Pagination
- Grid View
- Table View

### Product Management

- Add Product
- Edit Product
- Delete Product
- View Product Details

---

## Screenshots

Add screenshots of:

- Dashboard
- Products Page
- Product Details
- Add Product Modal
- Dark Mode

---

## Future Enhancements

- User Authentication
- Role-Based Access Control
- Export Inventory (PDF/Excel)
- Image Upload to Cloud Storage
- Inventory Charts & Graphs
- Sales Analytics
- Email Notifications
- Barcode & QR Code Support

---

## Author

**Avisha Aswal**



## License

This project is developed for educational and learning purposes.
