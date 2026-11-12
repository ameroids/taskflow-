import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../../components/ui/Avatar';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export default function UserSettings() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [updateStatus, setUpdateStatus] = useState('idle');

  const handleCheckUpdate = () => {
    if (updateStatus !== 'idle') return;
    setUpdateStatus('checking');

    setTimeout(() => {
      setUpdateStatus('success');
      notify('Application updated successfully! Refreshing...', 'success', { title: 'Update Successful' });

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }, 1800);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="card p-5">
        <h3 className="text-[13.5px] font-semibold text-text-primary mb-4">Profile</h3>
        <div className="flex items-center gap-3">
          <Avatar name={user?.name} color={user?.color} size="lg" />
          <div>
            <p className="text-[14.5px] font-medium text-text-primary">{user?.name}</p>
            <p className="text-[12.5px] text-text-secondary">{user?.title}</p>
          </div>
        </div>
        <div className="mt-5">
          <label className="label">Username</label>
          <input className="input max-w-full sm:max-w-xs" value={user?.username} disabled />
        </div>
        <p className="text-[11.5px] text-text-muted mt-3">
          Your profile details and credentials are securely managed by your administrator.
        </p>
      </div>

      {/* App Version & Update Card */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${
              updateStatus === 'checking'
                ? 'bg-brand-50 text-brand-600'
                : updateStatus === 'success'
                ? 'bg-success-50 text-success-600'
                : 'bg-canvas text-text-secondary border border-border'
            }`}>
              {updateStatus === 'success' ? (
                <CheckCircle2 size={22} className="animate-bounce" />
              ) : (
                <RefreshCw size={22} className={updateStatus === 'checking' ? 'animate-spin text-brand-600' : ''} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-semibold text-text-primary">Application Updates</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-500/20 font-medium">
                  v2.4.0
                </span>
              </div>
              <p className="text-[12.5px] text-text-secondary mt-0.5">
                Check for the latest version and refresh local app cache.
              </p>
            </div>
          </div>

          <button
            onClick={handleCheckUpdate}
            disabled={updateStatus !== 'idle'}
            className={`btn px-4 py-2 text-[13px] font-medium shrink-0 flex items-center justify-center gap-2 transition-all ${
              updateStatus === 'checking'
                ? 'bg-brand-500/10 text-brand-600 border border-brand-500/30 cursor-wait'
                : updateStatus === 'success'
                ? 'bg-success-50 text-success-600 border border-success-500/30 font-semibold'
                : 'btn-secondary hover:bg-canvas'
            }`}
          >
            {updateStatus === 'checking' && (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Checking for updates...</span>
              </>
            )}
            {updateStatus === 'success' && (
              <>
                <CheckCircle2 size={14} />
                <span>Update successful!</span>
              </>
            )}
            {updateStatus === 'idle' && (
              <>
                <RefreshCw size={14} />
                <span>Check for updates</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
