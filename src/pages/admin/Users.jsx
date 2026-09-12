import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../../components/ui/Avatar';
import ProgressBar from '../../components/ui/ProgressBar';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import UserFormModal from '../../components/users/UserFormModal';
import { computeStats } from '../../utils/taskUtils';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Power, Users as UsersIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

function RowMenu({ user, onEdit, onToggle, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  return (
    <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button className="p-1.5 rounded-md text-text-muted hover:bg-neutral-50 hover:text-text-primary" onClick={() => setOpen((o) => !o)}>
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-44 card shadow-pop py-1 z-10 animate-fadeIn">
          <button onClick={() => { setOpen(false); onEdit(); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-text-secondary hover:bg-neutral-50 hover:text-text-primary">
            <Pencil size={13} /> Edit user
          </button>
          <button onClick={() => { setOpen(false); onToggle(); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-text-secondary hover:bg-neutral-50 hover:text-text-primary">
            <Power size={13} /> {user.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
          <button onClick={() => { setOpen(false); onDelete(); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-danger-600 hover:bg-danger-50">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminUsers() {
  const { users, tasks, addUser, editUser, removeUser } = useData();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const employees = users.filter((u) => u.role !== 'admin' || u.role === 'admin');
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.title?.toLowerCase().includes(q));
  }, [employees, search]);

  const statsFor = (userId) => computeStats(tasks.filter((t) => t.assignedTo === userId));

  const handleSubmit = async (form) => {
    if (editing) {
      await editUser(editing.id, form);
      notify(`${form.name}'s details were updated.`, 'success', { title: 'User updated' });
    } else {
      await addUser(form);
      notify(`${form.name} can now log in with the credentials you set.`, 'success', { title: 'User added' });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const toggleStatus = async (u) => {
    const next = u.status === 'active' ? 'inactive' : 'active';
    await editUser(u.id, { status: next });
    notify(`${u.name} is now ${next}.`, next === 'active' ? 'success' : 'warning');
  };

  const handleDelete = async () => {
    await removeUser(confirmTarget.id);
    notify(`${confirmTarget.name} was removed.`, 'success', { title: 'User deleted' });
    setConfirmTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative sm:w-72">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input className="input pl-8" placeholder="Search team members…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus size={15} /> Add user
        </button>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No users found" description="Try a different search, or add a new team member." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="text-[11.5px] uppercase tracking-wide text-text-muted border-b border-border">
                  <th className="font-medium px-4 py-2.5">Name</th>
                  <th className="font-medium px-3 py-2.5">Username</th>
                  <th className="font-medium px-3 py-2.5">Role</th>
                  <th className="font-medium px-3 py-2.5">Status</th>
                  <th className="font-medium px-3 py-2.5 w-40">Completion</th>
                  <th className="font-medium px-3 py-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const s = statsFor(u.id);
                  return (
                    <tr key={u.id} onClick={() => navigate(`/admin/users/${u.id}`)} className="border-b border-border-soft last:border-0 hover:bg-neutral-50/70 cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={u.name} color={u.color} size="sm" />
                          <div className="leading-tight">
                            <p className="text-[13.5px] font-medium text-text-primary">{u.name}</p>
                            <p className="text-[11.5px] text-text-muted">{u.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[13px] text-text-secondary font-mono">{u.username}</td>
                      <td className="px-3 py-3 text-[13px] text-text-secondary capitalize">{u.role}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${u.status === 'active' ? 'text-success-600' : 'text-text-muted'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-success-500' : 'bg-text-muted'}`} />
                          {u.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {u.role === 'admin' ? (
                          <span className="text-[12px] text-text-muted">—</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[12.5px] font-medium text-text-primary w-9">{s.completionRate}%</span>
                            <ProgressBar value={s.completionRate} className="flex-1" />
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <RowMenu
                          user={u}
                          onEdit={() => { setEditing(u); setFormOpen(true); }}
                          onToggle={() => toggleStatus(u)}
                          onDelete={() => setConfirmTarget(u)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initialUser={editing}
        existingUsernames={users.map((u) => u.username)}
      />

      <ConfirmDialog
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleDelete}
        title="Delete this user?"
        description={`${confirmTarget?.name} will be permanently removed. Their tasks will remain in history but will no longer be assigned to anyone.`}
        confirmLabel="Delete user"
      />
    </div>
  );
}
