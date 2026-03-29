import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Store, IndianRupee, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import SuperAdminLayout from './SuperAdminLayout';
import { getSuperAdminSellers } from '../../actions/superadminAction';
import './SuperAdmin.css';

export default function SuperAdminSellers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.user);
  const { loading, sellers = [] } = useSelector(s => s.superadminSellers);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user?.role !== 'superadmin') { navigate('/login'); return; }
    dispatch(getSuperAdminSellers());
  }, [dispatch, user, navigate]);

  const fmt = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const filtered = sellers.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalCommission = sellers.reduce((acc, s) => acc + (s.totalCommission || 0), 0);
  const totalEarnings   = sellers.reduce((acc, s) => acc + (s.totalEarnings || 0), 0);

  return (
    <SuperAdminLayout title="Manage Sellers">
      {/* Summary */}
      <div className="sa-summary">
        <div className="sa-summary__item">
          <div className="sa-summary__item__label">Total Sellers</div>
          <div className="sa-summary__item__value">{sellers.length}</div>
        </div>
        <div className="sa-summary__item">
          <div className="sa-summary__item__label">Platform Commissions</div>
          <div className="sa-summary__item__value" style={{ color:'#4338ca' }}>{fmt(totalCommission)}</div>
        </div>
        <div className="sa-summary__item">
          <div className="sa-summary__item__label">Total Seller Earnings</div>
          <div className="sa-summary__item__value" style={{ color:'#10b981' }}>{fmt(totalEarnings)}</div>
        </div>
      </div>

      <div className="sa-card">
        <p className="sa-card__title"><Store size={18} /> All Sellers</p>

        <div className="sa-filter-bar">
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="sa-loading">Loading sellers…</div>
        ) : filtered.length === 0 ? (
          <div className="sa-empty"><div className="sa-empty__icon">🏪</div>No sellers found</div>
        ) : (
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Seller</th>
                  <th>Role</th>
                  <th><Package size={13} style={{ verticalAlign:'middle' }} /> Products</th>
                  <th><ShoppingBag size={13} style={{ verticalAlign:'middle' }} /> Orders</th>
                  <th><TrendingUp size={13} style={{ verticalAlign:'middle' }} /> Commission</th>
                  <th><IndianRupee size={13} style={{ verticalAlign:'middle' }} /> Earnings</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s._id}>
                    <td style={{ color:'#9ca3af', fontWeight:600 }}>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight:600 }}>{s.name}</div>
                      <div style={{ color:'#9ca3af', fontSize:'0.76rem' }}>{s.email}</div>
                    </td>
                    <td>
                      <span className={`sa-badge ${s.role === 'admin' ? 'sa-badge--blue' : 'sa-badge--green'}`}>
                        {s.role}
                      </span>
                    </td>
                    <td style={{ fontWeight:700, textAlign:'center' }}>{s.productCount || 0}</td>
                    <td style={{ fontWeight:700, textAlign:'center' }}>{s.orderCount || 0}</td>
                    <td style={{ fontWeight:700, color:'#4338ca' }}>{fmt(s.totalCommission)}</td>
                    <td style={{ fontWeight:700, color:'#10b981' }}>{fmt(s.totalEarnings)}</td>
                    <td style={{ color:'#9ca3af' }}>{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
}
