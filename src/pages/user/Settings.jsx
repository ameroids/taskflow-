import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/ui/Avatar';

export default function UserSettings() {
  const { user } = useAuth();

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
          <input className="input max-w-xs" value={user?.username} disabled />
        </div>
        <p className="text-[11.5px] text-text-muted mt-3">
          Your profile details and credentials are securely managed by your administrator.
        </p>
      </div>
    </div>
  );
}
