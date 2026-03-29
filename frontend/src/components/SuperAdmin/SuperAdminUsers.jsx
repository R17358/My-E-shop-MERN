import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, Edit2, Trash2, X, UserCog } from 'lucide-react';
import { toast } from 'react-toastify';
import SuperAdminLayout from './SuperAdminLayout';
import {
  getSuperAdminUsers,
  updateUserRole,
  deleteSuperAdminUser,
} from '../../actions/superadminAction';
import {
  SUPERADMIN_UPDATE_USER_RESET,
  SUPERADMIN_DELETE_USER_RESET,
} from '../../constants/superadminConstants';
import './SuperAdmin.css';

const ROLE_COLORS = {
  superadmin: 'sa-badge--purple',
  admin:      'sa-badge--blue',
  seller:     'sa-badge--green',
  user:       'sa-badge--gray',
};

export default function SuperAdminUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.user);
  const { loading, users = [] } = useSelector(s => s.superadminUsers);
  const { isUpdated, isDeleted, error } = useSelector(s => s.superadminUserAction);

  const [search, setSearch]   = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editUser, setEditUser]   = useState(null); // {_id, name, email, role}
  const [editForm, setEditForm]   = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (user?.role !== 'superadmin') { navigate('/login'); return; }
    dispatch(getSuperAdminUsers());
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (isUpdated) {
      toast.success('User updated!');
      dispatch({ type: SUPERADMIN_UPDATE_USER_RESET });
      setEditUser(null);
      dispatch(getSuperAdminUsers());
    }
    if (isDeleted) {
      toast.success('User deleted!');
      dispatch({ type: SUPERADMIN_DELETE_USER_RESET });
      setDeleteConfirm(null);
      dispatch(getSuperAdminUsers());
    }
    if (error) toast.error(error);
  }, [isUpdated, isDeleted, error, dispatch]);

  const filtered = users.filter(u => {
    const matchRole   = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const openEdit = (u) => { setEditUser(u); setEditForm({ name: u.name, email: u.email, role: u.role }); };

  const handleUpdate = () => {
    if (!editForm.name || !editForm.email || !editForm.role) { toast.error('All fields required'); return; }
    dispatch(updateUserRole(editUser._id, editForm));
  };

  const handleDelete = () => dispatch(deleteSuperAdminUser(deleteConfirm._id));

  return (
    <SuperAdminLayout title="Manage Users">
      <div className="sa-card">
        <p className="sa-card__title"><Users size={18} /> All Users ({users.length})</p>

        <div className="sa-filter-bar">
          <input
            placeholder="Search name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="superadmin">SuperAdmin</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="user">User</option>
          </select>
        </div>

        {loading ? (
          <div className="sa-loading">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="sa-empty"><div className="sa-empty__icon">👤</div>No users found</div>
        ) : (
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u._id}>
                    <td style={{ color:'#9ca3af', fontWeight:600 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color:'#6b7280' }}>{u.email}</td>
                    <td>
                      <span className={`sa-badge ${ROLE_COLORS[u.role] || 'sa-badge--gray'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ color:'#9ca3af' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button
                          className="sa-btn sa-btn--outline sa-btn--sm"
                          onClick={() => openEdit(u)}
                          title="Edit Role"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        {u.role !== 'superadmin' && (
                          <button
                            className="sa-btn sa-btn--danger sa-btn--sm"
                            onClick={() => setDeleteConfirm(u)}
                            title="Delete User"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="sa-modal-overlay" onClick={() => setEditUser(null)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <p className="sa-modal__title"><UserCog size={18} /> Edit User</p>
            <label className="sa-modal__label">Name</label>
            <input className="sa-modal__input" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            <label className="sa-modal__label">Email</label>
            <input className="sa-modal__input" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
            <label className="sa-modal__label">Role</label>
            <select className="sa-modal__input" value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}>
              <option value="user">User</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
              <option value="superadmin">SuperAdmin</option>
            </select>
            <div className="sa-modal__actions">
              <button className="sa-btn sa-btn--outline" onClick={() => setEditUser(null)}><X size={14} /> Cancel</button>
              <button className="sa-btn sa-btn--primary" onClick={handleUpdate}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="sa-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <p className="sa-modal__title"><Trash2 size={18} /> Delete User</p>
            <p style={{ color:'#6b7280' }}>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?<br />This action cannot be undone.
            </p>
            <div className="sa-modal__actions">
              <button className="sa-btn sa-btn--outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="sa-btn sa-btn--danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}
