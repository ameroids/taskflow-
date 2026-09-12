import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';

const COLORS = ['#3F5CF5', '#12805C', '#B5650A', '#C0301D', '#6A82F8', '#8A90A0', '#0E6B4C', '#94530A'];
const emptyForm = { name: '', username: '', password: '', title: '', role: 'employee', status: 'active', color: COLORS[0] };

export default function UserFormModal({ open, onClose, onSubmit, initialUser, existingUsernames = [] }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialUser) {
        setForm({
          name: initialUser.name, username: initialUser.username, password: initialUser.password,
          title: initialUser.title, role: initialUser.role, status: initialUser.status, color: initialUser.color,
        });
      } else {
        setForm({ ...emptyForm, color: COLORS[Math.floor(Math.random() * COLORS.length)] });
      }
      setErrors({});
    }
  }, [open, initialUser]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.username.trim()) errs.username = 'Username is required.';
    else {
      const taken = existingUsernames.some(
        (u) => u.toLowerCase() === form.username.trim().toLowerCase() && u.toLowerCase() !== (initialUser?.username || '').toLowerCase()
      );
      if (taken) errs.username = 'This username is already in use.';
    }
    if (!form.password || form.password.length < 4) errs.password = 'At least 4 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialUser ? 'Edit user' : 'Add new user'}
      subtitle={initialUser ? 'Update this team member\'s details.' : 'Create a demo account for a new team member.'}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} type="button">Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : initialUser ? 'Save changes' : 'Add user'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Full name</label>
            <input className="input" placeholder="e.g. Divya Rao" value={form.name} onChange={set('name')} />
            {errors.name && <p className="text-[12px] text-danger-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label">Job title (optional)</label>
            <input className="input" placeholder="e.g. Developer" value={form.title} onChange={set('title')} />
            {errors.title && <p className="text-[12px] text-danger-500 mt-1">{errors.title}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Username</label>
            <input className="input" placeholder="e.g. divya" value={form.username} onChange={set('username')} autoCapitalize="none" />
            {errors.username && <p className="text-[12px] text-danger-500 mt-1">{errors.username}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" placeholder="Demo password" value={form.password} onChange={set('password')} />
            {errors.password && <p className="text-[12px] text-danger-500 mt-1">{errors.password}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={set('role')}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={set('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <p className="text-[11.5px] text-text-muted leading-relaxed">
          This is a demo credential system for local testing. Real authentication will be handled by Supabase Auth in a later phase.
        </p>
      </form>
    </Modal>
  );
}
