import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

export default function Sidebar({ items, open, onClose, brandSub }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[228px] bg-ink-950 text-white/90 flex flex-col shrink-0 transition-transform duration-200 ease-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-14 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 32 32" fill="none">
                <path d="M9 16.5l4.5 4.5L23 11" stroke="white" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="text-[13.5px] font-semibold text-white">TaskFlow</p>
              <p className="text-[10.5px] text-white/40 -mt-0.5">{brandSub}</p>
            </div>
          </div>
          <button className="lg:hidden text-white/50 hover:text-white" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors
                ${isActive ? 'bg-white/10 text-white' : 'text-white/55 hover:text-white hover:bg-white/[0.06]'}`
              }
            >
              <item.icon size={16.5} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 pt-2 border-t border-white/10">
          <p className="px-3 text-[10.5px] text-white/30 leading-relaxed">
            Demo build — data stored locally in this browser.
          </p>
        </div>
      </aside>
    </>
  );
}
