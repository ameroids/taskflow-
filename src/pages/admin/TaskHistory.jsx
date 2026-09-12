import { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import TaskFormModal from '../../components/tasks/TaskFormModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StatusBadge from '../../components/ui/StatusBadge';
import PriorityBadge from '../../components/ui/PriorityBadge';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import { applyTaskFilters, getDerivedStatus, sortTasksByUrgency } from '../../utils/taskUtils';
import { formatDateShort, formatRelativeTimestamp } from '../../utils/dateUtils';
import { History } from 'lucide-react';

export default function TaskHistory() {
  const { users, tasks, editTask, removeTask, getUserById } = useData();
  const { notify } = useToast();
  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', date: '', user: 'all' });
  const [activeTask, setActiveTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => sortTasksByUrgency(applyTaskFilters(tasks, filters)).reverse(), [tasks, filters]);

  const handleUpdateStatus = async (id, patch) => { await editTask(id, patch); notify('Task status updated.', 'success'); };
  const handleEdit = async (form) => { await editTask(editingTask.id, form); notify('Task updated.', 'success'); setEditingTask(null); setActiveTask(null); };
  const handleDelete = async () => { await removeTask(deleteTarget.id); notify('Task deleted.', 'success'); setDeleteTarget(null); setActiveTask(null); };

  return (
    <div className="space-y-5">
      <TaskFilters filters={filters} setFilters={setFilters} users={users.filter((u) => u.role === 'employee')} showUserFilter />

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={History} title="No task history yet" description="Completed and updated tasks will show up here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="text-[11.5px] uppercase tracking-wide text-text-muted border-b border-border">
                  <th className="font-medium px-4 py-2.5">Task</th>
                  <th className="font-medium px-3 py-2.5">User</th>
                  <th className="font-medium px-3 py-2.5">Date</th>
                  <th className="font-medium px-3 py-2.5">Priority</th>
                  <th className="font-medium px-3 py-2.5">Status</th>
                  <th className="font-medium px-3 py-2.5">Note / reason</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const user = getUserById(t.assignedTo);
                  const status = getDerivedStatus(t);
                  return (
                    <tr key={t.id} onClick={() => setActiveTask(t)} className="border-b border-border-soft last:border-0 hover:bg-neutral-50/70 cursor-pointer">
                      <td className="px-4 py-3 max-w-[220px]">
                        <p className="text-[13.5px] font-medium text-text-primary truncate">{t.title}</p>
                      </td>
                      <td className="px-3 py-3">
                        {user && (
                          <div className="flex items-center gap-2">
                            <Avatar name={user.name} color={user.color} size="sm" />
                            <span className="text-[13px] text-text-secondary whitespace-nowrap">{user.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-[13px] text-text-secondary whitespace-nowrap">{formatDateShort(t.date)}</td>
                      <td className="px-3 py-3"><PriorityBadge priority={t.priority} size="sm" /></td>
                      <td className="px-3 py-3"><StatusBadge status={status} size="sm" /></td>
                      <td className="px-3 py-3 max-w-[240px]">
                        {t.status === 'completed' && <p className="text-[12px] text-text-secondary truncate">{t.note || '—'}<span className="text-text-muted"> · {formatRelativeTimestamp(t.completedAt)}</span></p>}
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
        user={activeTask ? getUserById(activeTask.assignedTo) : null}
        role="admin"
        onUpdateStatus={handleUpdateStatus}
        onEdit={(t) => setEditingTask(t)}
        onDelete={(t) => setDeleteTarget(t)}
      />

      <TaskFormModal open={!!editingTask} onClose={() => setEditingTask(null)} onSubmit={handleEdit} users={users} initialTask={editingTask} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this task?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete task"
      />
    </div>
  );
}
