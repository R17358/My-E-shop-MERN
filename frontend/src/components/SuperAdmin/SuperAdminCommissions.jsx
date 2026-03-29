import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BadgeDollarSign, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import SuperAdminLayout from './SuperAdminLayout';
import { getSuperAdminCommissions, markSellerPaid } from '../../actions/superadminAction';
import { SUPERADMIN_MARK_PAID_RESET } from '../../constants/superadminConstants';
import './SuperAdmin.css';

export default function SuperAdminCommissions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.user);
  const {
    loading,
    subOrders = [],
    totalCommissions,
    paidCommissions,
    pendingCommissions,
  } = useSelector(s => s.superadminCommissions);
  const { isUpdated, error } = useSelector(s => s.superadminOrderAction);

  const [search, setSearch]       = useState('');
  const [payFilter, setPayFilter] = useState('all');
  const [payConfirm, setPayConfirm] = useState(null);

  useEffect(() => {
    if (user?.role !== 'superadmin') { navigate('/login'); return; }
    dispatch(getSuperAdminCommissions());
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (isUpdated) {
      toast.success('Seller payment marked as completed!');
      dispatch({ type: SUPERADMIN_MARK_PAID_RESET });
      setPayConfirm(null);
      dispatch(getSuperAdminCommissions());
    }
    if (error) toast.error(error);
  }, [isUpdated, error, dispatch]);

  const fmt = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const filtered = subOrders.filter(s => {
    const matchPay = payFilter === 'all' || s.paymentStatus === payFilter;
    const matchSearch = !search ||
      s.seller?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s._id.toLowerCase().includes(search.toLowerCase());
    return matchPay && matchSearch;
  });

  return (
    <SuperAdminLayout title="Commission Management">
      {/* Summary */}
      <div className="sa-summary">
        <div className="sa-summary__item">
          <div className="sa-summary__item__label">Total Commissions</div>
          <div className="sa-summary__item__value" style={{ color:'#4338ca' }}>{fmt(totalCommissions)}</div>
        </div>
        <div className="sa-summary__item">
          <div className="sa-summary__item__label">Paid Out</div>
          <div className="sa-summary__item__value" style={{ color:'#10b981' }}>{fmt(paidCommissions)}</div>
        </div>
        <div className="sa-summary__item">
          <div className="sa-summary__item__label">Pending</div>
          <div className="sa-summary__item__value" style={{ color:'#ef4444' }}>{fmt(pendingCommissions)}</div>
        </div>
        <div className="sa-summary__item">
          <div className="sa-summary__item__label">Total Sub-Orders</div>
          <div className="sa-summary__item__value">{subOrders.length}</div>
        </div>
      </div>

      <div className="sa-card">
        <p className="sa-card__title"><BadgeDollarSign size={18} /> Sub-Orders & Commissions</p>

        <div className="sa-filter-bar">
          <input
            placeholder="Search seller or order ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={payFilter} onChange={e => setPayFilter(e.target.value)}>
            <option value="all">All Payments</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="sa-loading">Loading commissions…</div>
        ) : filtered.length === 0 ? (
          <div className="sa-empty"><div className="sa-empty__icon">💰</div>No records found</div>
        ) : (
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Sub-Order ID</th>
                  <th>Seller</th>
                  <th>Customer</th>
                  <th>Order Total</th>
                  <th>Commission</th>
                  <th>Seller Earns</th>
                  <th>Order Status</th>
                  <th>Pay Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s._id}>
                    <td style={{ fontFamily:'monospace', fontSize:'0.78rem', fontWeight:600 }}>
                      #{s._id.slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight:600 }}>{s.seller?.name || 'N/A'}</div>
                      <div style={{ color:'#9ca3af', fontSize:'0.75rem' }}>{s.seller?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight:500 }}>{s.customer?.name || 'N/A'}</div>
                      <div style={{ color:'#9ca3af', fontSize:'0.75rem' }}>{s.customer?.email}</div>
                    </td>
                    <td style={{ fontWeight:700 }}>{fmt(s.totalPrice)}</td>
                    <td style={{ fontWeight:800, color:'#4338ca' }}>{fmt(s.platformCommission)}</td>
                    <td style={{ fontWeight:700, color:'#10b981' }}>{fmt(s.sellerEarnings)}</td>
                    <td>
                      <span className={`sa-badge ${
                        s.orderStatus === 'Delivered' ? 'sa-badge--green' :
                        s.orderStatus === 'Shipped'   ? 'sa-badge--blue' :
                        s.orderStatus === 'Cancelled' ? 'sa-badge--red' :
                        'sa-badge--yellow'
                      }`}>{s.orderStatus}</span>
                    </td>
                    <td>
                      <span className={`sa-badge ${s.paymentStatus === 'Completed' ? 'sa-badge--green' : 'sa-badge--yellow'}`}>
                        {s.paymentStatus}
                      </span>
                    </td>
                    <td>
                      {s.paymentStatus !== 'Completed' ? (
                        <button
                          className="sa-btn sa-btn--success sa-btn--sm"
                          onClick={() => setPayConfirm(s)}
                          title="Mark Seller Paid"
                        >
                          <CheckCircle size={13} /> Pay
                        </button>
                      ) : (
                        <span style={{ color:'#10b981', fontSize:'0.78rem', fontWeight:600 }}>✓ Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pay Confirm */}
      {payConfirm && (
        <div className="sa-modal-overlay" onClick={() => setPayConfirm(null)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <p className="sa-modal__title"><CheckCircle size={18} /> Mark Seller Paid</p>
            <p style={{ color:'#6b7280' }}>
              Mark <strong>{fmt(payConfirm.sellerEarnings)}</strong> as paid to seller <strong>{payConfirm.seller?.name}</strong>?
            </p>
            <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, padding:'10px 14px', marginTop:10 }}>
              <div style={{ fontSize:'0.8rem', color:'#065f46' }}>
                Platform keeps commission: <strong>{fmt(payConfirm.platformCommission)}</strong>
              </div>
            </div>
            <div className="sa-modal__actions">
              <button className="sa-btn sa-btn--outline" onClick={() => setPayConfirm(null)}>Cancel</button>
              <button className="sa-btn sa-btn--success" onClick={() => dispatch(markSellerPaid(payConfirm._id))}>
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}
