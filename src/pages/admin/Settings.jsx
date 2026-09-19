import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../../components/ui/Avatar';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { RotateCcw, Database } from 'lucide-react';

export default function AdminSettings() {
  const { user } = useAuth();
  const { users, tasks } = useData();
  const { notify } = useToast();

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
        <div className="mt-5">
          <label className="label">Username</label>
          <input className="input max-w-xs" value={user?.username} disabled />
        </div>
        <p className="text-[11.5px] text-text-muted mt-3">
          Profile editing and password changes are securely managed by Supabase Auth and can be configured in your Supabase dashboard.
        </p>
      </div>

    </div>
  );
}
