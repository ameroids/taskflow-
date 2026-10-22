import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import StatusBadge from '../../components/ui/StatusBadge';
import PriorityBadge from '../../components/ui/PriorityBadge';
import EmptyState from '../../components/ui/EmptyState';
import { applyTaskFilters, getDerivedStatus, sortTasksByUrgency } from '../../utils/taskUtils';
import { formatDateShort, formatRelativeTimestamp } from '../../utils/dateUtils';
import { History } from 'lucide-react';

export default function UserTaskHistory() {
  const { user } = useAuth();
  const { tasks, editTask } = useData();
  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', date: '' });
  const [activeTask, setActiveTask] = useState(null);

  const [taskType, setTaskType] = useState('all'); // 'all' | 'regular' | 'daily'

  const userTasks = useMemo(() => tasks.filter((t) => t.assignedTo === user.id), [tasks, user.id]);
  const regularCount = useMemo(() => userTasks.filter((t) => !t.isDaily).length, [userTasks]);
  const dailyCount = useMemo(() => userTasks.filter((t) => t.isDaily).length, [userTasks]);

  const myTasks = useMemo(() => {
    if (taskType === 'regular') return userTasks.filter((t) => !t.isDaily);
    if (taskType === 'daily') return userTasks.filter((t) => t.isDaily);
    return userTasks;
  }, [userTasks, taskType]);
  const filtered = useMemo(() => sortTasksByUrgency(applyTaskFilters(myTasks, filters)).reverse(), [myTasks, filters]);

  const handleUpdateStatus = async (id, patch) => { await editTask(id, patch); };

  return (
    <div className="space-y-5">
      <div className="flex bg-canvas p-1 rounded-lg border border-border w-fit items-center gap-1">
        <button
          className={`px-3.5 py-1.5 text-[13px] rounded-md transition-all flex items-center gap-1.5 ${
            taskType === 'all'
              ? 'bg-surface text-text-primary font-semibold shadow-sm border border-border/70'
              : 'text-text-secondary hover:text-text-primary font-medium'
          }`}
          onClick={() => setTaskType('all')}
        >
          <span>All Tasks</span>
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
              taskType === 'all' ? 'bg-canvas text-text-primary' : 'bg-surface/80 text-text-muted'
            }`}
          >
            {userTasks.length}
          </span>
        </button>
        <button
          className={`px-3.5 py-1.5 text-[13px] rounded-md transition-all flex items-center gap-1.5 ${
            taskType === 'regular'
              ? 'bg-surface text-text-primary font-semibold shadow-sm border border-border/70'
              : 'text-text-secondary hover:text-text-primary font-medium'
          }`}
          onClick={() => setTaskType('regular')}
        >
          <span>Regular Tasks</span>
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
              taskType === 'regular' ? 'bg-canvas text-text-primary' : 'bg-surface/80 text-text-muted'
            }`}
          >
            {regularCount}
          </span>
        </button>
        <button
          className={`px-3.5 py-1.5 text-[13px] rounded-md transition-all flex items-center gap-1.5 ${
            taskType === 'daily'
              ? 'bg-surface text-text-primary font-semibold shadow-sm border border-border/70'
              : 'text-text-secondary hover:text-text-primary font-medium'
          }`}
          onClick={() => setTaskType('daily')}
        >
          <span>Daily Tasks</span>
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
              taskType === 'daily' ? 'bg-canvas text-text-primary' : 'bg-surface/80 text-text-muted'
            }`}
          >
            {dailyCount}
          </span>
        </button>
      </div>

      <TaskFilters filters={filters} setFilters={setFilters} />

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={History} title="No history yet" description="Tasks you've completed or missed will show up here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="text-[11.5px] uppercase tracking-wide text-text-muted border-b border-border">
                  <th className="font-medium px-4 py-2.5">Task</th>
                  <th className="font-medium px-3 py-2.5">Date</th>
                  <th className="font-medium px-3 py-2.5">Priority</th>
                  <th className="font-medium px-3 py-2.5">Status</th>
                  <th className="font-medium px-3 py-2.5">Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const status = getDerivedStatus(t);
                  return (
                    <tr key={t.id} onClick={() => setActiveTask(t)} className="border-b border-border-soft last:border-0 hover:bg-canvas/70 cursor-pointer">
                      <td className="px-4 py-3 max-w-[240px]">
                        <div className="flex items-center gap-2">
                          <p className="text-[13.5px] font-medium text-text-primary truncate">{t.title}</p>
                          {t.isDaily && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-500/20 shrink-0">
                              Daily
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[13px] text-text-secondary whitespace-nowrap">{formatDateShort(t.date)}</td>
                      <td className="px-3 py-3"><PriorityBadge priority={t.priority} size="sm" /></td>
                      <td className="px-3 py-3"><StatusBadge status={status} size="sm" /></td>
                      <td className="px-3 py-3 max-w-[220px]">
                        {t.status === 'completed' && <p className="text-[12px] text-text-secondary truncate">{formatRelativeTimestamp(t.completedAt)}</p>}
                        {t.status === 'not_completed' && <p className="text-[12px] text-text-secondary truncate">{t.reason || '—'}</p>}
                        {status !== 'completed' && status !== 'not_completed' && <span className="text-text-muted text-[12px]">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskDetailModal
        open={!!activeTask}
        onClose={() => setActiveTask(null)}
        task={activeTask}
        user={user}
        role="employee"
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
