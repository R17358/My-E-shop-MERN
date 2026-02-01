import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SellerDashboard.css';
import { useSelector } from 'react-redux';
import { Sun, Moon, Package, LayoutDashboard, ShoppingBag, PlusCircle, TrendingUp, DollarSign } from 'lucide-react';

function SellerDashboard() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const isSeller = () => {
    return user?.role === "seller";
  };

  return (
    <div className='seller-dashboard-wrapper'>
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {isAuthenticated && isSeller() ? (
        <div className="seller-dashboard-container">
          <div className="dashboard-hero">
            <h1 className="hero-title">Welcome, {user?.name || 'Seller'}!</h1>
            <p className="hero-subtitle">Manage your store and track your earnings</p>
          </div>

          <div className="dashboard-grid">
            <Link to="/seller/product/new" className="dashboard-card create-card">
              <div className="card-icon create">
                <PlusCircle size={32} />
              </div>
              <h3>Add Product</h3>
              <p>List new items in your store</p>
            </Link>

            <Link to="/seller/products" className="dashboard-card products-card">
              <div className="card-icon products">
                <LayoutDashboard size={32} />
              </div>
              <h3>My Products</h3>
              <p>View and manage your listings</p>
            </Link>

            <Link to="/seller/orders" className="dashboard-card orders-card">
              <div className="card-icon orders">
                <ShoppingBag size={32} />
              </div>
              <h3>My Orders</h3>
              <p>Track and fulfill customer orders</p>
            </Link>

            <Link to="/seller/earnings" className="dashboard-card earnings-card">
              <div className="card-icon earnings">
                <DollarSign size={32} />
              </div>
              <h3>Earnings</h3>
              <p>View your revenue and payouts</p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="no-access-state">
          <Package size={64} />
          <h3>Access Restricted</h3>
          <p>You need seller privileges to access this area</p>
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
