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

  const myTasks = useMemo(() => tasks.filter((t) => t.assignedTo === user.id), [tasks, user.id]);
  const filtered = useMemo(() => sortTasksByUrgency(applyTaskFilters(myTasks, filters)).reverse(), [myTasks, filters]);

  const handleUpdateStatus = async (id, patch) => { await editTask(id, patch); };

  return (
    <div className="space-y-5">
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
                    <tr key={t.id} onClick={() => setActiveTask(t)} className="border-b border-border-soft last:border-0 hover:bg-neutral-50/70 cursor-pointer">
                      <td className="px-4 py-3 max-w-[240px]"><p className="text-[13.5px] font-medium text-text-primary truncate">{t.title}</p></td>
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
        role="employee"
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
