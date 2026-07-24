import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, LayoutDashboard, Boxes, Plus, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logo from "../assets/logo.png";


const Navbar = ({ onOpenAddModal }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header glass-card">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
        <div className="logo-image-wrapper">
        <img src={logo} alt="NexStock Logo" className="logo-image" />
        </div>
          
          <span className="brand-name">
            Nex<span className="gradient-text">stock</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/products"
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
          >
            <Boxes size={18} />
            <span>Products List</span>
          </Link>
        </nav>

        {/* Actions (Add Product + Theme Toggle) */}
        <div className="navbar-actions">
          <button
            onClick={onOpenAddModal}
            className="btn btn-primary btn-add-product"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>

          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} className="theme-icon sun" /> : <Moon size={20} className="theme-icon moon" />}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <Link
            to="/"
            className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/products"
            className={`mobile-nav-link ${isActive('/products') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Boxes size={20} />
            <span>Products List</span>
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAddModal();
            }}
            className="btn btn-primary mobile-add-btn"
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
