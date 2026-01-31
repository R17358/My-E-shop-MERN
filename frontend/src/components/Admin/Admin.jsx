import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';
import { useSelector } from 'react-redux';
import { Sun, Moon, Package, LayoutDashboard, ShoppingBag, PlusCircle } from 'lucide-react';

function Admin() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const isAdmin = () => {
    if (user?.role === "admin") return true;
    else return false;
  };

  return (
    <div className='admin-wrapper'>
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {isAuthenticated && isAdmin() ? (
        <div className="admin-container">
          <div className="admin-hero">
            <h1 className="hero-title">Welcome, {user?.name || 'Admin'}!</h1>
            <p className="hero-subtitle">Manage your e-commerce platform</p>
          </div>

          <div className="admin-grid">
            <Link to="/newproduct" className="admin-card">
              <div className="card-icon create">
                <PlusCircle size={32} />
              </div>
              <h3>Create Product</h3>
              <p>Add new products to your catalog</p>
            </Link>

            <Link to="/dashboard" className="admin-card">
              <div className="card-icon dashboard">
                <LayoutDashboard size={32} />
              </div>
              <h3>Dashboard</h3>
              <p>View analytics and insights</p>
            </Link>

            <Link to="/admin/orders" className="admin-card">
              <div className="card-icon orders">
                <ShoppingBag size={32} />
              </div>
              <h3>Orders</h3>
              <p>Manage customer orders</p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="no-access-state">
          <Package size={64} />
          <h3>Access Restricted</h3>
          <p>You need admin privileges to access this area</p>
        </div>
      )}
    </div>
  );
}

export default Admin;