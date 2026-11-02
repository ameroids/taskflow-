import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import UserFormModal from '../../components/users/UserFormModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { AlertTriangle, Trash2, Lock, Eye, EyeOff, ShieldAlert, Plus, Pencil, Users as UsersIcon, Power } from 'lucide-react';

const FRESH_START_PASSWORD = 'ameroids786';

export default function AdminSettings() {
  const { user } = useAuth();
  const { users, tasks, clearAllData, addUser, editUser, removeUser } = useData();
  const { notify } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [deleteEmployees, setDeleteEmployees] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // User management states in settings
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);

  const handleOpenModal = () => {
    setPassword('');
    setShowPw(false);
    setDeleteEmployees(false);
    setError('');
    setModalOpen(true);
  };

  const handleUserSubmit = async (form) => {
    try {
      if (editingUser) {
        await editUser(editingUser.id, form);
        notify(`${form.name}'s details were updated.`, 'success', { title: 'User updated' });
      } else {
        await addUser(form);
        notify(`${form.name} can now log in with the credentials you set.`, 'success', { title: 'User added' });
      }
      setUserFormOpen(false);
      setEditingUser(null);
    } catch (err) {
      notify(err.message, 'error', { title: 'Action failed' });
    }
  };

  const toggleUserStatus = async (u) => {
    try {
      const next = u.status === 'active' ? 'inactive' : 'active';
      await editUser(u.id, { status: next });
      notify(`${u.name} is now ${next}.`, next === 'active' ? 'success' : 'warning');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await removeUser(deleteTargetUser.id);
      notify(`${deleteTargetUser.name} was removed.`, 'success', { title: 'User deleted' });
      setDeleteTargetUser(null);
    } catch (err) {
      notify(err.message, 'error', { title: 'Delete failed' });
    }
  };

  const handleConfirmReset = async (e) => {
    e?.preventDefault();
    if (password !== FRESH_START_PASSWORD) {
      setError('Incorrect authorization password. Please try again.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await clearAllData(deleteEmployees);
      notify(
        deleteEmployees
          ? 'All tasks and employee accounts have been deleted. System reset complete.'
          : 'All tasks have been deleted from the system. Ready for a fresh start.',
        'success',
        { title: 'System Reset Complete' }
      );
      setModalOpen(false);
      setPassword('');
    } catch (err) {
      setError(err.message || 'Failed to reset system data.');
      notify(err.message || 'System reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Card */}
      <div className="card p-5">
        <h3 className="text-[13.5px] font-semibold text-text-primary mb-4">Profile</h3>
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} color={user?.color} size="lg" />
          <div>
            <p className="text-[14.5px] font-medium text-text-primary">{user?.name}</p>
            <p className="text-[12.5px] text-text-secondary">Operations Supervisor · Administrator</p>
          </div>
        </div>
        <div className="mt-5">
          <label className="label">Username</label>
          <input className="input max-w-full sm:max-w-xs" value={user?.username || ''} disabled />
        </div>
        <p className="text-[11.5px] text-text-muted mt-3">
          Profile credentials and authentication are managed securely through Supabase Auth.
        </p>
      </div>

      {/* User Profiles & Team Management Card */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <UsersIcon size={16} className="text-brand-500" />
              <h3 className="text-[14px] font-semibold text-text-primary">User Profiles & Accounts</h3>
            </div>
            <p className="text-[12.5px] text-text-secondary mt-0.5">
              Create new user profiles, change usernames, names, roles, or edit existing credentials.
            </p>
          </div>
          <button
            className="btn-primary shrink-0 self-start sm:self-auto"
            onClick={() => {
              setEditingUser(null);
              setUserFormOpen(true);
            }}
          >
            <Plus size={15} /> Add user
          </button>
        </div>

        <div className="border border-border rounded-lg divide-y divide-border-soft overflow-hidden">
          {users.map((u) => (
            <div key={u.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface hover:bg-canvas/50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={u.name} color={u.color} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13.5px] font-medium text-text-primary truncate">{u.name}</p>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-canvas border border-border text-text-secondary shrink-0">
                      @{u.username}
                    </span>
                    {u.role === 'admin' ? (
                      <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-500/20 shrink-0">
                        Admin
                      </span>
                    ) : (
                      <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded bg-surface border border-border text-text-muted shrink-0 capitalize">
                        {u.role}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-text-muted truncate mt-0.5">
                    {u.title || 'No title set'} · <span className={u.status === 'active' ? 'text-success-600 font-medium' : 'text-text-muted'}>{u.status === 'active' ? 'Active' : 'Inactive'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  className="btn-secondary text-[12px] px-2.5 py-1.5"
                  onClick={() => {
                    setEditingUser(u);
                    setUserFormOpen(true);
                  }}
                  title="Edit user profile & credentials"
                >
                  <Pencil size={13} /> Edit
                </button>
                {u.role !== 'admin' && (
                  <>
                    <button
                      className="btn-secondary text-[12px] px-2.5 py-1.5 text-text-secondary hover:text-text-primary"
                      onClick={() => toggleUserStatus(u)}
                      title={u.status === 'active' ? 'Deactivate user' : 'Activate user'}
                    >
                      <Power size={13} className={u.status === 'active' ? 'text-success-600' : 'text-text-muted'} />
                      <span className="hidden xs:inline">{u.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                    </button>
                    <button
                      className="btn-ghost text-[12px] px-2 py-1.5 text-danger-600 hover:bg-danger-50"
                      onClick={() => setDeleteTargetUser(u)}
                      title="Delete user"
                    >
                      <Trash2 size={13} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone / Fresh Start Card */}
      <div className="card p-5 border border-danger-500/25 bg-danger-50/10">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-danger-100/80 text-danger-600 shrink-0 mt-0.5">
            <ShieldAlert size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14.5px] font-semibold text-danger-600">Danger Zone · System Fresh Start</h3>
            <p className="text-[13px] text-text-secondary mt-1 leading-relaxed">
              Permanently delete all task data, completion history, notes, and daily schedules for all people in the system to give everyone a completely fresh start.
            </p>

            <div className="mt-4 p-3 rounded-lg bg-surface border border-border flex flex-wrap gap-4 text-[12.5px]">
              <div>
                <span className="text-text-muted block text-[11.5px]">Tasks in system</span>
                <span className="font-semibold text-text-primary text-[14px]">{tasks.length} tasks</span>
              </div>
              <div className="border-l border-border pl-4">
                <span className="text-text-muted block text-[11.5px]">Team members</span>
                <span className="font-semibold text-text-primary text-[14px]">
                  {users.filter((u) => u.role !== 'admin').length} employees
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-danger-500/15">
              <button
                type="button"
                className="btn-danger flex items-center gap-2"
                onClick={handleOpenModal}
              >
                <Trash2 size={14.5} /> Delete all data & fresh start
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        open={modalOpen}
        onClose={() => !loading && setModalOpen(false)}
        title="Delete All Data & Fresh Start"
        subtitle="Permanent system reset authorization"
        width="max-w-lg"
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setModalOpen(false)}
              disabled={loading}
              type="button"
            >
              Cancel
            </button>
            <button
              className="btn-danger flex items-center gap-2"
              onClick={handleConfirmReset}
              disabled={loading || !password}
            >
              <Trash2 size={14} />
              {loading ? 'Deleting all data…' : 'Authorize & delete all data'}
            </button>
          </>
        }
      >
        <form onSubmit={handleConfirmReset} className="space-y-4">
          <div className="rounded-lg bg-danger-50 border border-danger-500/25 p-3.5 flex items-start gap-3">
            <AlertTriangle size={18} className="text-danger-600 shrink-0 mt-0.5" />
            <div className="text-[12.5px] text-danger-800 leading-relaxed">
              <p className="font-semibold">Warning: This action is permanent and cannot be undone.</p>
              <p className="mt-0.5">
                All {tasks.length} tasks across all team members will be permanently erased from the database.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-canvas/60">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-border text-brand-500 focus:ring-brand-500 mt-0.5 h-4 w-4"
                checked={deleteEmployees}
                onChange={(e) => setDeleteEmployees(e.target.checked)}
              />
              <div className="text-[12.5px]">
                <span className="font-medium text-text-primary block">
                  Also remove employee accounts ({users.filter((u) => u.role !== 'admin').length} members)
                </span>
                <span className="text-text-muted block mt-0.5">
                  If unchecked, employee logins stay active so they begin with a clean 0-task plate.
                </span>
              </div>
            </label>
          </div>

          <div>
            <label className="label text-[13px]">
              Enter administrator password to confirm:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Lock size={15} />
              </div>
              <input
                type={showPw ? 'text' : 'password'}
                className="input pl-9 pr-10 font-mono tracking-wide"
                placeholder="Enter administrator password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                autoFocus
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && (
              <p className="text-[12px] text-danger-500 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle size={12} /> {error}
              </p>
            )}
          </div>
        </form>
      </Modal>

      <UserFormModal
        open={userFormOpen}
        onClose={() => {
          setUserFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleUserSubmit}
        initialUser={editingUser}
        existingUsernames={users.map((u) => u.username)}
      />

      <ConfirmDialog
        open={!!deleteTargetUser}
        onClose={() => setDeleteTargetUser(null)}
        onConfirm={handleDeleteUser}
        title="Delete this user?"
        description={`${deleteTargetUser?.name} will be permanently removed. Their tasks will remain in history but will no longer be assigned to anyone.`}
        confirmLabel="Delete user"
      />
    </div>
  );
}
