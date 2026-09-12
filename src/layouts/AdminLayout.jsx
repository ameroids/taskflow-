import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, ListChecks, Users, BarChart3, History, Settings as SettingsIcon } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/team-progress', label: 'Team progress', icon: BarChart3 },
  { to: '/admin/history', label: 'Task history', icon: History },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
];

const TITLES = {
  '/admin': ['Dashboard', 'Team overview and today\'s activity'],
  '/admin/tasks': ['Tasks', 'Create, assign and manage team tasks'],
  '/admin/users': ['Users', 'Manage your team members'],
  '/admin/team-progress': ['Team progress', 'Performance across the team'],
  '/admin/history': ['Task history', 'Full record of team activity'],
  '/admin/settings': ['Settings', 'Workspace preferences'],
};

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const key = Object.keys(TITLES).find((k) => (k === '/admin' ? pathname === k : pathname.startsWith(k))) || '/admin';
  const [title, subtitle] = TITLES[key];

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      <Sidebar items={NAV} open={open} onClose={() => setOpen(false)} brandSub="Admin workspace" />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} subtitle={subtitle} onMenu={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-[1240px] mx-auto animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
