import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import SuperAdminLayout from './SuperAdminLayout';
import { getSuperAdminOrders, deleteSuperAdminOrder } from '../../actions/superadminAction';
import { SUPERADMIN_DELETE_ORDER_RESET } from '../../constants/superadminConstants';
import './SuperAdmin.css';

export default function SuperAdminOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.user);
  const { loading, orders = [], totalRevenue } = useSelector(s => s.superadminOrders);
  const { isDeleted, error } = useSelector(s => s.superadminOrderAction);

  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (user?.role !== 'superadmin') { navigate('/login'); return; }
    dispatch(getSuperAdminOrders());
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (isDeleted) {
      toast.success('Order deleted!');
      dispatch({ type: SUPERADMIN_DELETE_ORDER_RESET });
      setDeleteConfirm(null);
      dispatch(getSuperAdminOrders());
    }
    if (error) toast.error(error);
  }, [isDeleted, error, dispatch]);

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    const matchSearch = !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const fmt = n => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  const statusBadge = (status) => {
    const map = { Delivered:'sa-badge--green', Shipped:'sa-badge--blue', Processing:'sa-badge--yellow', Cancelled:'sa-badge--red' };
    return map[status] || 'sa-badge--gray';
  };

  return (
    <SuperAdminLayout title="Manage Orders">
      <div className="sa-summary">
        <div className="sa-summary__item">
          <div className="sa-summary__item__label">Total Orders</div>
          <div className="sa-summary__item__value">{orders.length}</div>
        </div>
        <div className="sa-summary__item">
          <div className="sa-summary__item__label">Total Revenue</div>
          <div className="sa-summary__item__value" style={{ color:'#4338ca' }}>{fmt(totalRevenue)}</div>
        </div>
        {['Processing','Shipped','Delivered'].map(status => (
          <div key={status} className="sa-summary__item">
            <div className="sa-summary__item__label">{status}</div>
            <div className="sa-summary__item__value">
              {orders.filter(o => o.orderStatus === status).length}
            </div>
          </div>
        ))}
      </div>

      <div className="sa-card">
        <p className="sa-card__title"><ShoppingBag size={18} /> All Orders</p>

        <div className="sa-filter-bar">
          <input
            placeholder="Search by order ID or customer…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="sa-loading">Loading orders…</div>
        ) : filtered.length === 0 ? (
          <div className="sa-empty"><div className="sa-empty__icon">🛍️</div>No orders found</div>
        ) : (
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontFamily:'monospace', fontSize:'0.78rem', fontWeight:600 }}>
                      #{o._id.slice(-8).toUpperCase()}
                    </td>
                    <td>
                      <div style={{ fontWeight:600 }}>{o.user?.name || 'N/A'}</div>
                      <div style={{ color:'#9ca3af', fontSize:'0.75rem' }}>{o.user?.email}</div>
                    </td>
                    <td style={{ textAlign:'center' }}>{o.orderItems?.length || 0}</td>
                    <td style={{ fontWeight:700 }}>{fmt(o.totalPrice)}</td>
                    <td><span className={`sa-badge ${statusBadge(o.orderStatus)}`}>{o.orderStatus}</span></td>
                    <td>
                      <span className={`sa-badge ${o.paymentInfo?.status === 'succeeded' ? 'sa-badge--green' : 'sa-badge--yellow'}`}>
                        {o.paymentInfo?.status || 'pending'}
                      </span>
                    </td>
                    <td style={{ color:'#9ca3af' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <button
                        className="sa-btn sa-btn--danger sa-btn--sm"
                        onClick={() => setDeleteConfirm(o)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="sa-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <p className="sa-modal__title"><Trash2 size={18} /> Delete Order</p>
            <p style={{ color:'#6b7280' }}>
              Delete order <strong>#{deleteConfirm._id.slice(-8).toUpperCase()}</strong>?
              All related sub-orders will also be deleted.
            </p>
            <div className="sa-modal__actions">
              <button className="sa-btn sa-btn--outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="sa-btn sa-btn--danger" onClick={() => dispatch(deleteSuperAdminOrder(deleteConfirm._id))}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}
