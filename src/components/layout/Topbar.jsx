import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

export default function Topbar({ title, subtitle, onMenu, actions }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="h-14 shrink-0 border-b border-border bg-white/90 backdrop-blur flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button className="lg:hidden text-text-secondary hover:text-text-primary" onClick={onMenu}>
          <Menu size={19} />
        </button>
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold text-text-primary truncate leading-tight">{title}</h1>
          {subtitle && <p className="text-[12px] text-text-secondary truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions}
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-neutral-50">
            <Avatar name={user?.name} color={user?.color} size="sm" />
            <span className="hidden sm:block text-left leading-tight">
              <span className="block text-[12.5px] font-medium text-text-primary">{user?.name}</span>
              <span className="block text-[10.5px] text-text-muted -mt-0.5">{user?.role === 'admin' ? 'Administrator' : user?.title}</span>
            </span>
            <ChevronDown size={14} className="text-text-muted hidden sm:block" />
          </button>
          {open && (
            <div className="absolute right-0 mt-1.5 w-48 card shadow-pop py-1.5 animate-fadeIn">
              <button
                onClick={() => { setOpen(false); navigate(user?.role === 'admin' ? '/admin/settings' : '/app/settings'); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-text-secondary hover:bg-neutral-50 hover:text-text-primary"
              >
                <Settings size={15} /> Settings
              </button>
              <div className="h-px bg-border-soft my-1" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-danger-600 hover:bg-danger-50"
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
