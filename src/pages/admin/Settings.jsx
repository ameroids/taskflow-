import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../../components/ui/Avatar';
import Modal from '../../components/ui/Modal';
import { AlertTriangle, Trash2, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';

const FRESH_START_PASSWORD = 'ameroids786';

export default function AdminSettings() {
  const { user } = useAuth();
  const { users, tasks, clearAllData } = useData();
  const { notify } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [deleteEmployees, setDeleteEmployees] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => {
    setPassword('');
    setShowPw(false);
    setDeleteEmployees(false);
    setError('');
    setModalOpen(true);
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
    <div className="space-y-6 max-w-2xl">
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
          <input className="input max-w-xs" value={user?.username || ''} disabled />
        </div>
        <p className="text-[11.5px] text-text-muted mt-3">
          Profile credentials and authentication are managed securely through Supabase Auth.
        </p>
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
    </div>
  );
}
