import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, ListChecks, TrendingUp, History, Settings as SettingsIcon } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';

const NAV = [
  { to: '/app', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/app/my-tasks', label: 'My tasks', icon: ListChecks },
  { to: '/app/my-progress', label: 'My progress', icon: TrendingUp },
  { to: '/app/history', label: 'Task history', icon: History },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
];

const TITLES = {
  '/app': ['Dashboard', 'Your work at a glance'],
  '/app/my-tasks': ['My tasks', 'Everything assigned to you'],
  '/app/my-progress': ['My progress', 'How you\'re tracking over time'],
  '/app/history': ['Task history', 'Everything you\'ve completed or missed'],
  '/app/settings': ['Settings', 'Account preferences'],
};

export default function UserLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const key = Object.keys(TITLES).find((k) => (k === '/app' ? pathname === k : pathname.startsWith(k))) || '/app';
  const [title, subtitle] = TITLES[key];

  return (
    <div className="flex h-[100dvh] bg-canvas overflow-hidden w-full">
      <Sidebar items={NAV} open={open} onClose={() => setOpen(false)} brandSub="Employee workspace" />
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        <Topbar title={title} subtitle={subtitle} onMenu={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-3.5 sm:py-6 overscroll-contain" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}>
          <div className="max-w-[1100px] mx-auto animate-fadeIn min-h-[calc(100dvh-120px)] sm:min-h-[calc(100dvh-140px)] flex flex-col justify-between">
            <div>
              <Outlet />
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
