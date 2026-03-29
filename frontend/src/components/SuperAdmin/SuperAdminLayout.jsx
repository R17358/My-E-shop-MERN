import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  BadgeDollarSign,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import './SuperAdmin.css';

const navItems = [
  { path: '/superadmin/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { path: '/superadmin/users',     label: 'Users',        icon: Users },
  { path: '/superadmin/sellers',   label: 'Sellers',      icon: Store },
  { path: '/superadmin/products',  label: 'Products',     icon: Package },
  { path: '/superadmin/orders',    label: 'Orders',       icon: ShoppingBag },
  { path: '/superadmin/commissions', label: 'Commissions', icon: BadgeDollarSign },
];

export default function SuperAdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="sa-layout">
      {/* Sidebar */}
      <aside className={`sa-sidebar ${sidebarOpen ? 'sa-sidebar--open' : ''}`}>
        <div className="sa-sidebar__header">
          <ShieldCheck size={24} className="sa-sidebar__logo-icon" />
          <span className="sa-sidebar__logo-text">SuperAdmin</span>
          <button className="sa-sidebar__close" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="sa-sidebar__nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`sa-nav-item ${location.pathname === path ? 'sa-nav-item--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="sa-nav-item__arrow" />
            </Link>
          ))}
        </nav>

        <button className="sa-sidebar__logout" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="sa-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="sa-main">
        <header className="sa-topbar">
          <button className="sa-topbar__menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="sa-topbar__title">{title}</h1>
          <div className="sa-topbar__badge">
            <ShieldCheck size={16} />
            SuperAdmin
          </div>
        </header>

        <div className="sa-content">
          {children}
        </div>
      </main>
    </div>
  );
}
