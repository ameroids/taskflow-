import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import ProgressRing from '../../components/ui/ProgressRing';
import StackedBar from '../../components/ui/StackedBar';
import { computeStats, filterByRange } from '../../utils/taskUtils';

const RANGES = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
  { key: 'all', label: 'All time' },
];

export default function MyProgress() {
  const { user } = useAuth();
  const { tasks } = useData();
  const [range, setRange] = useState('week');

  const myTasks = useMemo(() => tasks.filter((t) => t.assignedTo === user.id), [tasks, user.id]);
  const scoped = useMemo(() => filterByRange(myTasks, range), [myTasks, range]);
  const stats = useMemo(() => computeStats(scoped), [scoped]);
  const overall = useMemo(() => computeStats(myTasks), [myTasks]);

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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-6 flex flex-col items-center justify-center text-center sm:col-span-1">
          <ProgressRing value={stats.completionRate} size={110} stroke={9} sublabel="completion" />
          <p className="text-[12.5px] text-text-secondary mt-3">{stats.completed} of {stats.total} tasks completed</p>
        </div>

        <div className="sm:col-span-2 card p-5">
          <h3 className="text-[13.5px] font-semibold text-text-primary mb-1">Breakdown for this period</h3>
          <p className="text-[12.5px] text-text-secondary mb-4">How your tasks are currently distributed.</p>
          <StackedBar stats={stats} />
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-[13.5px] font-semibold text-text-primary mb-1">Lifetime totals</h3>
        <p className="text-[12.5px] text-text-secondary mb-4">Since you joined the team.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><p className="text-[19px] font-semibold text-text-primary leading-none">{overall.total}</p><p className="text-[11.5px] text-text-muted mt-1.5">Total tasks</p></div>
          <div><p className="text-[19px] font-semibold text-success-600 leading-none">{overall.completed}</p><p className="text-[11.5px] text-text-muted mt-1.5">Completed</p></div>
          <div><p className="text-[19px] font-semibold text-warning-600 leading-none">{overall.pending}</p><p className="text-[11.5px] text-text-muted mt-1.5">Pending</p></div>
          <div><p className="text-[19px] font-semibold text-danger-600 leading-none">{overall.overdue}</p><p className="text-[11.5px] text-text-muted mt-1.5">Overdue</p></div>
        </div>
      </div>
    </div>
  );
}
