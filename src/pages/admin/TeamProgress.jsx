import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Avatar from '../../components/ui/Avatar';
import ProgressRing from '../../components/ui/ProgressRing';
import ProgressBar from '../../components/ui/ProgressBar';
import { computeStats, filterByRange } from '../../utils/taskUtils';

const RANGES = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
  { key: 'all', label: 'All time' },
  { key: 'custom', label: 'Custom' },
];

export default function TeamProgress() {
  const { users, tasks } = useData();
  const navigate = useNavigate();
  const [range, setRange] = useState('week');
  const [custom, setCustom] = useState({ start: '', end: '' });

  const employees = users.filter((u) => u.role === 'employee');

  const activeRange = range === 'custom' ? custom : range;
  const scopedTasks = useMemo(() => filterByRange(tasks, activeRange), [tasks, activeRange]);

  const cards = useMemo(() => {
    return employees.map((u) => ({
      user: u,
      stats: computeStats(scopedTasks.filter((t) => t.assignedTo === u.id)),
    })).sort((a, b) => b.stats.completionRate - a.stats.completionRate);
  }, [employees, scopedTasks]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors ${
              range === r.key ? 'bg-ink-950 text-white' : 'bg-white border border-border text-text-secondary hover:bg-neutral-50'
            }`}
          >
            {r.label}
          </button>
        ))}
        {range === 'custom' && (
          <div className="flex items-center gap-2 ml-1">
            <input type="date" className="input !w-auto" value={custom.start} onChange={(e) => setCustom((c) => ({ ...c, start: e.target.value }))} />
            <span className="text-text-muted text-[12.5px]">to</span>
            <input type="date" className="input !w-auto" value={custom.end} onChange={(e) => setCustom((c) => ({ ...c, end: e.target.value }))} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map(({ user, stats }) => (
          <button
            key={user.id}
            onClick={() => navigate(`/admin/users/${user.id}`)}
            className="card p-5 text-left hover:border-brand-400/50 hover:shadow-pop transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar name={user.name} color={user.color} />
                <div className="leading-tight">
                  <p className="text-[13.5px] font-medium text-text-primary">{user.name}</p>
                  <p className="text-[11.5px] text-text-muted">{user.title}</p>
                </div>
              </div>
              <ProgressRing value={stats.completionRate} size={54} stroke={5.5} label={`${stats.completionRate}%`} />
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              <div>
                <p className="text-[15px] font-semibold text-text-primary leading-none">{stats.total}</p>
                <p className="text-[10.5px] text-text-muted mt-1">Total</p>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-success-600 leading-none">{stats.completed}</p>
                <p className="text-[10.5px] text-text-muted mt-1">Done</p>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-warning-600 leading-none">{stats.pending}</p>
                <p className="text-[10.5px] text-text-muted mt-1">Pending</p>
              </div>
              <div>
                <p className="text-[15px] font-semibold text-danger-600 leading-none">{stats.overdue}</p>
                <p className="text-[10.5px] text-text-muted mt-1">Overdue</p>
              </div>
            </div>
            <ProgressBar value={stats.completionRate} className="mt-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
