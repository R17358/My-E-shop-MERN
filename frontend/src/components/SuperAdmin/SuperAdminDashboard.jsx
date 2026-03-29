import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Users, Store, Package, ShoppingBag,
  BadgeDollarSign, TrendingUp, IndianRupee, Clock,
} from 'lucide-react';
import SuperAdminLayout from './SuperAdminLayout';
import { getSuperAdminDashboard } from '../../actions/superadminAction';
import './SuperAdmin.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function MiniChart({ data, keyName, colorClass }) {
  if (!data || data.length === 0) return <p style={{ color:'#9ca3af', fontSize:'0.8rem' }}>No data yet</p>;
  const values = data.map(d => d[keyName] || 0);
  const max = Math.max(...values, 1);
  return (
    <div className="sa-chart-bars">
      {data.map((d, i) => (
        <div key={i} className="sa-chart-bar__wrap">
          <div
            className={`sa-chart-bar ${colorClass || ''}`}
            style={{ height: `${Math.round((values[i] / max) * 100)}%` }}
            title={`₹${values[i].toLocaleString('en-IN')}`}
          />
          <span className="sa-chart-bar__label">
            {MONTHS[(d._id?.month || 1) - 1]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SuperAdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.user);
  const { loading, stats, monthlyData, monthlyCommissions, recentOrders } =
    useSelector(s => s.superadminDashboard);

  useEffect(() => {
    if (user?.role !== 'superadmin') { navigate('/login'); return; }
    dispatch(getSuperAdminDashboard());
  }, [dispatch, user, navigate]);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const statCards = stats ? [
    { label: 'Total Users',       value: stats.totalUsers,       icon: Users,          accent: '#6366f1', iconBg: '#ede9fe' },
    { label: 'Sellers',           value: stats.totalSellers,     icon: Store,          accent: '#0ea5e9', iconBg: '#e0f2fe' },
    { label: 'Admins',            value: stats.totalAdmins,      icon: Users,          accent: '#f59e0b', iconBg: '#fef3c7' },
    { label: 'Customers',         value: stats.totalCustomers,   icon: Users,          accent: '#10b981', iconBg: '#d1fae5' },
    { label: 'Products',          value: stats.totalProducts,    icon: Package,        accent: '#8b5cf6', iconBg: '#ede9fe' },
    { label: 'Orders',            value: stats.totalOrders,      icon: ShoppingBag,    accent: '#ec4899', iconBg: '#fce7f3' },
    { label: 'Total Revenue',     value: fmt(stats.totalRevenue),icon: IndianRupee,    accent: '#14b8a6', iconBg: '#ccfbf1' },
    { label: 'Total Commission',  value: fmt(stats.totalCommissions), icon: TrendingUp,accent: '#f97316', iconBg: '#ffedd5' },
    { label: 'Paid Commission',   value: fmt(stats.paidCommissions),  icon: BadgeDollarSign, accent: '#10b981', iconBg: '#d1fae5' },
    { label: 'Pending Commission',value: fmt(stats.pendingCommissions),icon: Clock,    accent: '#ef4444', iconBg: '#fee2e2' },
  ] : [];

  return (
    <SuperAdminLayout title="Dashboard">
      {loading ? (
        <div className="sa-loading">Loading dashboard…</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="sa-stat-grid">
            {statCards.map(({ label, value, icon: Icon, accent, iconBg }) => (
              <div key={label} className="sa-stat-card" style={{ '--sa-accent': accent }}>
                <div className="sa-stat-card__icon" style={{ background: iconBg, color: accent }}>
                  <Icon size={20} />
                </div>
                <span className="sa-stat-card__label">{label}</span>
                <span className="sa-stat-card__value">{value}</span>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="sa-charts-grid">
            <div className="sa-chart-card">
              <p className="sa-chart-card__title">Monthly Revenue (last 6 months)</p>
              <MiniChart data={monthlyData} keyName="revenue" />
            </div>
            <div className="sa-chart-card">
              <p className="sa-chart-card__title">Monthly Commission (last 6 months)</p>
              <MiniChart data={monthlyCommissions} keyName="commission" colorClass="sa-chart-bar--commission" />
            </div>
          </div>

          {/* Recent Orders */}
          <div className="sa-card">
            <p className="sa-card__title"><ShoppingBag size={18} /> Recent Orders</p>
            {recentOrders?.length ? (
              <div className="sa-table-wrap">
                <table className="sa-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(o => (
                      <tr key={o._id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                          {o._id.slice(-8).toUpperCase()}
                        </td>
                        <td>{o.user?.name || 'N/A'}<br /><span style={{ color:'#9ca3af', fontSize:'0.76rem' }}>{o.user?.email}</span></td>
                        <td style={{ fontWeight: 700 }}>{fmt(o.totalPrice)}</td>
                        <td>
                          <span className={`sa-badge ${
                            o.orderStatus === 'Delivered' ? 'sa-badge--green' :
                            o.orderStatus === 'Shipped'   ? 'sa-badge--blue' :
                            'sa-badge--yellow'
                          }`}>{o.orderStatus}</span>
                        </td>
                        <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="sa-empty">No recent orders</div>
            )}
          </div>
        </>
      )}
    </SuperAdminLayout>
  );
}
