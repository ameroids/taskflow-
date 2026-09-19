import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(username, password);
      navigate(user.role === 'admin' ? '/admin' : '/app', { replace: true });
    } catch (err) {
      if (err.message.includes('inactive')) {
        alert(err.message);
      } else {
        setError(err.message || 'Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Brand panel */}
      <div className="hidden lg:flex w-[42%] bg-ink-950 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-brand-500/10" />
        <div className="absolute -right-10 bottom-10 w-56 h-56 rounded-full bg-brand-500/10" />
        <div className="flex items-center gap-2.5 relative">
          <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path d="M9 16.5l4.5 4.5L23 11" stroke="white" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[16px] font-semibold">TaskFlow</span>
        </div>

        <div className="relative max-w-sm">
          <p className="text-[26px] font-semibold leading-snug">
            Know exactly what your team is working on, every day.
          </p>
          <p className="text-[14px] text-white/50 mt-4 leading-relaxed">
            Assign tasks, track deadlines, and see completion across the whole team in one place — no spreadsheets, no status meetings.
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-6 max-w-sm">
          <div>
            <p className="text-[20px] font-semibold">6</p>
            <p className="text-[11.5px] text-white/45">Team members</p>
          </div>
          <div>
            <p className="text-[20px] font-semibold">24</p>
            <p className="text-[11.5px] text-white/45">Active tasks</p>
          </div>
          <div>
            <p className="text-[20px] font-semibold">100%</p>
            <p className="text-[11.5px] text-white/45">Local & private</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <path d="M9 16.5l4.5 4.5L23 11" stroke="white" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-[16px] font-semibold text-text-primary">TaskFlow</span>
          </div>

          <h1 className="text-[22px] font-semibold text-text-primary">Sign in</h1>
          <p className="text-[13.5px] text-text-secondary mt-1.5">Enter your username and password to continue.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-danger-50 border border-danger-500/15 px-3 py-2.5">
                <AlertCircle size={15} className="text-danger-500 mt-0.5 shrink-0" />
                <p className="text-[13px] text-danger-600">{error}</p>
              </div>
            )}
            <div>
              <label className="label">Username</label>
              <input
                className="input"
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button className="btn-primary w-full py-2.5" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
