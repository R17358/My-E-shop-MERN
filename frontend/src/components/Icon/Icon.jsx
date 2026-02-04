import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Icon.css'
import { useSelector } from 'react-redux'
import { User, ShoppingBag, LogOut, Shield, Store, Sun, Moon } from 'lucide-react'

function Icon() {
  const {isAuthenticated, user} = useSelector((state) => state.user);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const isAdmin = () => {
    return user?.role === "admin";
  }

  const isSeller = () => {
    return user?.role === "seller";
  }

  return (
    <div className='icon-page'>
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {isAuthenticated ? (
        <div className="user-welcome-section">
          <div className="welcome-header">
            <User size={48} strokeWidth={1.5} className="user-icon" />
            <h1>Welcome back, {user?.name || 'User'}!</h1>
            <p className="user-subtitle">
              {isAdmin() ? 'Platform Administrator' : isSeller() ? 'Seller Account' : 'Manage your account and orders'}
            </p>
          </div>
          <div className="action-cards">
            {isAdmin() && (
              <Link to="/admin" className="action-card admin-card">
                <Shield size={32} />
                <h3>Admin Panel</h3>
                <p>Manage products and orders</p>
              </Link>
            )}
            {isSeller() && (
              <Link to="/seller/dashboard" className="action-card seller-card">
                <Store size={32} />
                <h3>Seller Dashboard</h3>
                <p>Manage your products and orders</p>
              </Link>
            )}
            <Link to="/myorders" className="action-card orders-card">
              <ShoppingBag size={32} />
              <h3>My Orders</h3>
              <p>Track your purchases</p>
            </Link>
            <Link to="/logout" className="action-card logout-card">
              <LogOut size={32} />
              <h3>Log Out</h3>
              <p>Sign out of your account</p>
            </Link>
          </div>
        </div>
      ) : (
        <div className="auth-prompt-section">
          <div className="auth-header">
            <User size={64} strokeWidth={1.5} className="auth-icon" />
            <h1>Welcome!</h1>
            <p className="auth-subtitle">Sign in to access your account</p>
          </div>
          <div className="auth-buttons">
            <Link to="/register" className="auth-btn signup-btn">
              <span>Create Account</span>
            </Link>
            <Link to="/login" className="auth-btn login-btn">
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Icon              
