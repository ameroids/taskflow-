import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/ui/StatCard';
import StackedBar from '../../components/ui/StackedBar';
import ProgressBar from '../../components/ui/ProgressBar';
import Avatar from '../../components/ui/Avatar';
import { computeStats, computeTodayStats } from '../../utils/taskUtils';
import { Users, ListChecks, CheckCircle2, Clock, AlertTriangle, XCircle, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const { users, tasks, loading } = useData();
  const navigate = useNavigate();

  const stats = useMemo(() => computeStats(tasks), [tasks]);
  const todayStats = useMemo(() => computeTodayStats(tasks), [tasks]);
  const activeUsers = users.filter((u) => u.role === 'employee');

  const perUser = useMemo(() => {
    return activeUsers.map((u) => {
      const userTasks = tasks.filter((t) => t.assignedTo === u.id);
      return { user: u, stats: computeStats(userTasks) };
    }).sort((a, b) => b.stats.total - a.stats.total);
  }, [activeUsers, tasks]);

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Team members" value={activeUsers.length} icon={Users} tone="brand" onClick={() => navigate('/admin/users')} />
        <StatCard label="Total tasks" value={stats.total} icon={ListChecks} onClick={() => navigate('/admin/tasks')} />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} tone="warning" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} tone="danger" />
        <StatCard label="Not completed" value={stats.notCompleted} icon={XCircle} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[13.5px] font-semibold text-text-primary">Team performance</h3>
            <button onClick={() => navigate('/admin/team-progress')} className="text-[12px] font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Full report <ArrowUpRight size={13} />
            </button>
          </div>
          <p className="text-[12.5px] text-text-secondary mb-3">Click a member to see their task history.</p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-text-muted">
                  <th className="text-left font-medium px-2 py-2">User</th>
                  <th className="text-right font-medium px-2 py-2">Total</th>
                  <th className="text-right font-medium px-2 py-2">Completed</th>
                  <th className="text-right font-medium px-2 py-2">Pending</th>
                  <th className="text-right font-medium px-2 py-2">Overdue</th>
                  <th className="text-right font-medium px-2 py-2 w-32">Completion</th>
                </tr>
              </thead>
              <tbody>
                {perUser.map(({ user, stats: s }) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className="border-t border-border-soft hover:bg-neutral-50/70 cursor-pointer"
                  >
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={user.name} color={user.color} size="sm" />
                        <div className="leading-tight">
                          <p className="text-[13px] font-medium text-text-primary">{user.name}</p>
                          <p className="text-[11px] text-text-muted">{user.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-right text-[13px] text-text-secondary">{s.total}</td>
                    <td className="px-2 py-2.5 text-right text-[13px] text-success-600">{s.completed}</td>
                    <td className="px-2 py-2.5 text-right text-[13px] text-warning-600">{s.pending}</td>
                    <td className="px-2 py-2.5 text-right text-[13px] text-danger-600">{s.overdue}</td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-[12.5px] font-medium text-text-primary w-9 text-right">{s.completionRate}%</span>
                        <ProgressBar value={s.completionRate} className="w-16" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-[13.5px] font-semibold text-text-primary mb-1">Overall completion</h3>
            <p className="text-[12.5px] text-text-secondary mb-4">Across all tasks ever assigned.</p>
            <StackedBar stats={stats} />
          </div>
          <div className="card p-5">
            <h3 className="text-[13.5px] font-semibold text-text-primary mb-1">Today</h3>
            <p className="text-[12.5px] text-text-secondary mb-4">
              {todayStats.completed} of {todayStats.total} tasks completed — {todayStats.completionRate}%
            </p>
            <ProgressBar value={todayStats.completionRate} height="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
