import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../../components/ui/Avatar';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { RotateCcw, Database } from 'lucide-react';

export default function AdminSettings() {
  const { user } = useAuth();
  const { resetDemoData, users, tasks } = useData();
  const { notify } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = async () => {
    await resetDemoData();
    notify('Demo data has been restored to its original state.', 'success', { title: 'Data reset' });
    setConfirmReset(false);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="card p-5">
        <h3 className="text-[13.5px] font-semibold text-text-primary mb-4">Profile</h3>
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} color={user?.color} size="lg" />
          <div>
            <p className="text-[14.5px] font-medium text-text-primary">{user?.name}</p>
            <p className="text-[12.5px] text-text-secondary">Operations Supervisor · Administrator</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-5">
          <div>
            <label className="label">Username</label>
            <input className="input" value={user?.username} disabled />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" value={user?.password} disabled type="password" />
          </div>
        </div>
        <p className="text-[11.5px] text-text-muted mt-3">
          Profile editing and password changes will be available once Supabase Auth is connected.
        </p>
      </div>

      <div className="card p-5">
        <h3 className="text-[13.5px] font-semibold text-text-primary mb-1">Workspace data</h3>
        <p className="text-[12.5px] text-text-secondary mb-4">
          This demo stores {users.length} users and {tasks.length} tasks in your browser's local storage.
        </p>
        <div className="flex items-center gap-3 rounded-lg border border-border-soft p-3.5">
          <span className="w-9 h-9 rounded-lg bg-neutral-50 flex items-center justify-center text-text-secondary shrink-0">
            <Database size={16} />
          </span>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-text-primary">Reset demo data</p>
            <p className="text-[12px] text-text-secondary">Restores the original demo users and tasks. This can't be undone.</p>
          </div>
          <button className="btn-secondary" onClick={() => setConfirmReset(true)}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReset}
        title="Reset all demo data?"
        description="This replaces all current users and tasks with the original demo set. Any changes you've made will be lost."
        confirmLabel="Reset data"
      />
    </div>
  );
}
