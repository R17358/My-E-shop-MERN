import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Icon.css'
import { useSelector } from 'react-redux'
import { User, ShoppingBag, LogOut, Shield } from 'lucide-react'

function Icon() {

  const {isAuthenticated, user} = useSelector((state) => state.user);
  const isAdmin = ()=>{
    if(user.role === "admin")
      return true;
    else
      return false;
  }
  return (
    <div className='icon-page'>
       {isAuthenticated ? (
            <div className="user-welcome-section">
                <div className="welcome-header">
                  <User size={48} strokeWidth={1.5} className="user-icon" />
                  <h1>Welcome back, {user?.name || 'User'}!</h1>
                  <p className="user-subtitle">Manage your account and orders</p>
                </div>
                <div className="action-cards">
                  {isAdmin() && (
                    <Link to="/admin" className="action-card admin-card">
                      <Shield size={32} />
                      <h3>Admin Panel</h3>
                      <p>Manage products and orders</p>
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