import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Package, Trash2, Percent, X } from 'lucide-react';
import { toast } from 'react-toastify';
import SuperAdminLayout from './SuperAdminLayout';
import {
  getSuperAdminProducts,
  deleteSuperAdminProduct,
  updateCommissionRate,
} from '../../actions/superadminAction';
import {
  SUPERADMIN_DELETE_PRODUCT_RESET,
  SUPERADMIN_UPDATE_COMMISSION_RESET,
} from '../../constants/superadminConstants';
import './SuperAdmin.css';

export default function SuperAdminProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.user);
  const { loading, products = [] } = useSelector(s => s.superadminProducts);
  const { isDeleted, isUpdated, error } = useSelector(s => s.superadminProductAction);

  const [search, setSearch]         = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [commModal, setCommModal]   = useState(null); // { _id, name, rate }
  const [newRate, setNewRate]       = useState('');

  useEffect(() => {
    if (user?.role !== 'superadmin') { navigate('/login'); return; }
    dispatch(getSuperAdminProducts());
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (isDeleted) {
      toast.success('Product deleted!');
      dispatch({ type: SUPERADMIN_DELETE_PRODUCT_RESET });
      setDeleteConfirm(null);
      dispatch(getSuperAdminProducts());
    }
    if (isUpdated) {
      toast.success('Commission rate updated!');
      dispatch({ type: SUPERADMIN_UPDATE_COMMISSION_RESET });
      setCommModal(null);
      dispatch(getSuperAdminProducts());
    }
    if (error) toast.error(error);
  }, [isDeleted, isUpdated, error, dispatch]);

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.seller?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const openComm = (p) => { setCommModal(p); setNewRate(String(p.platformCommissionPercent || 10)); };

  const handleUpdateComm = () => {
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 0 || rate > 100) { toast.error('Rate must be 0–100'); return; }
    dispatch(updateCommissionRate(commModal._id, rate));
  };

  return (
    <SuperAdminLayout title="Manage Products">
      <div className="sa-card">
        <p className="sa-card__title"><Package size={18} /> All Products ({products.length})</p>

        <div className="sa-filter-bar">
          <input
            placeholder="Search product or seller…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="sa-loading">Loading products…</div>
        ) : filtered.length === 0 ? (
          <div className="sa-empty"><div className="sa-empty__icon">📦</div>No products found</div>
        ) : (
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Seller</th>
                  <th>Commission %</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p._id}>
                    <td style={{ color:'#9ca3af', fontWeight:600 }}>{i + 1}</td>
                    <td style={{ fontWeight:600, maxWidth:180 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        {p.images?.[0]?.url && (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            style={{ width:36, height:36, borderRadius:6, objectFit:'cover', flexShrink:0 }}
                          />
                        )}
                        <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="sa-badge sa-badge--gray">{p.category}</span>
                    </td>
                    <td style={{ fontWeight:700 }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`sa-badge ${p.stock > 0 ? 'sa-badge--green' : 'sa-badge--red'}`}>
                        {p.stock > 0 ? p.stock : 'Out'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight:500 }}>{p.seller?.name || 'N/A'}</div>
                      <div style={{ color:'#9ca3af', fontSize:'0.75rem' }}>{p.seller?.email}</div>
                    </td>
                    <td style={{ fontWeight:700, color:'#4338ca' }}>{p.platformCommissionPercent || 10}%</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button
                          className="sa-btn sa-btn--outline sa-btn--sm"
                          onClick={() => openComm(p)}
                          title="Edit Commission"
                        >
                          <Percent size={13} />
                        </button>
                        <button
                          className="sa-btn sa-btn--danger sa-btn--sm"
                          onClick={() => setDeleteConfirm(p)}
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Commission Rate Modal */}
      {commModal && (
        <div className="sa-modal-overlay" onClick={() => setCommModal(null)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <p className="sa-modal__title"><Percent size={18} /> Update Commission Rate</p>
            <p style={{ color:'#6b7280', marginBottom:12 }}>Product: <strong>{commModal.name}</strong></p>
            <label className="sa-modal__label">Commission Percentage (0–100)</label>
            <input
              className="sa-modal__input"
              type="number"
              min="0" max="100" step="0.5"
              value={newRate}
              onChange={e => setNewRate(e.target.value)}
            />
            <div className="sa-modal__actions">
              <button className="sa-btn sa-btn--outline" onClick={() => setCommModal(null)}><X size={14} /> Cancel</button>
              <button className="sa-btn sa-btn--primary" onClick={handleUpdateComm}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="sa-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <p className="sa-modal__title"><Trash2 size={18} /> Delete Product</p>
            <p style={{ color:'#6b7280' }}>
              Delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.
            </p>
            <div className="sa-modal__actions">
              <button className="sa-btn sa-btn--outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="sa-btn sa-btn--danger" onClick={() => dispatch(deleteSuperAdminProduct(deleteConfirm._id))}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}
