import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/ui/StatCard';
import StackedBar from '../../components/ui/StackedBar';
import ProgressBar from '../../components/ui/ProgressBar';
import Avatar from '../../components/ui/Avatar';
import { computeStats, groupUniqueTasks } from '../../utils/taskUtils';
import { todayISO, addDaysISO, formatDateShort } from '../../utils/dateUtils';
import { Users, ListChecks, CheckCircle2, Clock, AlertTriangle, XCircle, ArrowUpRight, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

export default function AdminDashboard() {
  const { users, tasks, loading } = useData();
  const navigate = useNavigate();

  // Date filter: 'today' | 'tomorrow' | 'all' | 'custom'
  const [dateFilter, setDateFilter] = useState('today');
  const [customDate, setCustomDate] = useState(todayISO());

  const todayDate = todayISO();
  const tomorrowDate = addDaysISO(1);

  // Filter tasks based on selected date
  const filteredTasks = useMemo(() => {
    if (dateFilter === 'today') {
      return tasks.filter((t) => t.date === todayDate);
    }
    if (dateFilter === 'tomorrow') {
      return tasks.filter((t) => t.date === tomorrowDate);
    }
    if (dateFilter === 'custom') {
      return customDate ? tasks.filter((t) => t.date === customDate) : tasks;
    }
    return tasks; // 'all'
  }, [tasks, dateFilter, customDate, todayDate, tomorrowDate]);

  // Unique tasks: collapse repeating daily instances to their distinct tasks
  const uniqueTasks = useMemo(() => groupUniqueTasks(filteredTasks), [filteredTasks]);

  // Overall stats based on the active date filter
  const stats = useMemo(() => computeStats(filteredTasks), [filteredTasks]);
  const activeUsers = users.filter((u) => u.role === 'employee');

  const perUser = useMemo(() => {
    return activeUsers.map((u) => {
      const userTasks = filteredTasks.filter((t) => t.assignedTo === u.id);
      return {
        user: u,
        stats: computeStats(userTasks),
        uniqueCount: groupUniqueTasks(userTasks).length,
      };
    }).sort((a, b) => b.stats.total - a.stats.total);
  }, [activeUsers, filteredTasks]);

  const activeDateLabel = useMemo(() => {
    if (dateFilter === 'today') return 'Today';
    if (dateFilter === 'tomorrow') return 'Tomorrow';
    if (dateFilter === 'custom') return customDate ? formatDateShort(customDate) : 'Selected Date';
    return 'All time';
  }, [dateFilter, customDate]);

  if (loading) return null;

  return (
    <div className="space-y-6">
      {/* Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-2.5 sm:p-3 rounded-xl border border-border shadow-card">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all shrink-0 ${
              dateFilter === 'today'
                ? 'bg-ink-950 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('tomorrow')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all shrink-0 ${
              dateFilter === 'tomorrow'
                ? 'bg-ink-950 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
            }`}
          >
            Tomorrow
          </button>
          <button
            onClick={() => setDateFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all shrink-0 ${
              dateFilter === 'all'
                ? 'bg-ink-950 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
            }`}
          >
            All time
          </button>
        </div>

        {/* Calendar Picker */}
        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <CalendarIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="date"
              value={dateFilter === 'custom' ? customDate : ''}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setDateFilter('custom');
              }}
              placeholder="Pick a date"
              className={`input pl-8 py-1.5 text-[12.5px] !w-full sm:!w-44 ${
                dateFilter === 'custom' ? 'border-brand-500 ring-2 ring-brand-400/20 font-medium' : ''
              }`}
            />
          </div>
          {dateFilter !== 'all' && (
            <span className="hidden md:inline-flex text-[11.5px] font-medium px-2 py-1 rounded bg-brand-50 text-brand-600 border border-brand-500/20 whitespace-nowrap">
              Showing: {activeDateLabel}
            </span>
          )}
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <StatCard label="Team members" value={activeUsers.length} icon={Users} tone="brand" onClick={() => navigate('/admin/users')} />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="success" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} tone="warning" />
        <StatCard label="Not done" value={stats.notCompleted} icon={XCircle} tone="danger" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 card p-3.5 sm:p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[13.5px] font-semibold text-text-primary">Team performance ({activeDateLabel})</h3>
            <button onClick={() => navigate('/admin/team-progress')} className="text-[12px] font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 shrink-0">
              Full report <ArrowUpRight size={13} />
            </button>
          </div>
          <p className="text-[12px] sm:text-[12.5px] text-text-secondary mb-3">Click a member to see their task history.</p>
          <div className="overflow-x-auto -mx-3.5 sm:-mx-2 px-3.5 sm:px-2 scrollbar-thin">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-text-muted">
                  <th className="text-left font-medium px-2 py-2">User</th>
                  <th className="text-right font-medium px-2 py-2">Tasks</th>
                  <th className="text-right font-medium px-2 py-2">Completed</th>
                  <th className="text-right font-medium px-2 py-2">Pending</th>
                  <th className="text-right font-medium px-2 py-2">Not done</th>
                  <th className="text-right font-medium px-2 py-2 w-28 sm:w-32">Completion</th>
                </tr>
              </thead>
              <tbody>
                {perUser.map(({ user, stats: s }) => (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className="border-t border-border-soft hover:bg-canvas/70 cursor-pointer"
                  >
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={user.name} color={user.color} size="sm" />
                        <div className="leading-tight min-w-0">
                          <p className="text-[13px] font-medium text-text-primary truncate">{user.name}</p>
                          <p className="text-[11px] text-text-muted truncate">{user.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-right text-[13px] text-text-secondary font-medium">
                      {s.total}
                    </td>
                    <td className="px-2 py-2.5 text-right text-[13px] text-success-600 font-medium">{s.completed}</td>
                    <td className="px-2 py-2.5 text-right text-[13px] text-warning-600 font-medium">{s.pending}</td>
                    <td className="px-2 py-2.5 text-right text-[13px] text-danger-600 font-medium">{s.notCompleted}</td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
                        <span className="text-[12px] sm:text-[12.5px] font-medium text-text-primary w-8 sm:w-9 text-right">{s.completionRate}%</span>
                        <ProgressBar value={s.completionRate} className="w-12 sm:w-16" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4 sm:p-5">
            <h3 className="text-[13.5px] font-semibold text-text-primary mb-1">Completion Breakdown</h3>
            <p className="text-[12px] sm:text-[12.5px] text-text-secondary mb-3 sm:mb-4">
              Showing metrics for <span className="font-medium text-text-primary">{activeDateLabel}</span>.
            </p>
            <StackedBar stats={stats} />
          </div>
          <div className="card p-4 sm:p-5">
            <h3 className="text-[13.5px] font-semibold text-text-primary mb-1">Period Progress</h3>
            <p className="text-[12.5px] text-text-secondary mb-4">
              {stats.completed} of {stats.total} total runs completed — {stats.completionRate}%
            </p>
            <ProgressBar value={stats.completionRate} height="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
