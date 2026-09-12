import { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import Avatar from '../../components/ui/Avatar';
import ProgressRing from '../../components/ui/ProgressRing';
import StackedBar from '../../components/ui/StackedBar';
import TaskTable from '../../components/tasks/TaskTable';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import TaskFormModal from '../../components/tasks/TaskFormModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { computeStats, applyTaskFilters } from '../../utils/taskUtils';
import { ArrowLeft } from 'lucide-react';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, tasks, getUserById, editTask, removeTask } = useData();
  const { notify } = useToast();
  const user = getUserById(id);

  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', date: '' });
  const [activeTask, setActiveTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const userTasks = useMemo(() => tasks.filter((t) => t.assignedTo === id), [tasks, id]);
  const stats = useMemo(() => computeStats(userTasks), [userTasks]);
  const filtered = useMemo(() => applyTaskFilters(userTasks, filters), [userTasks, filters]);

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-[14px] text-text-secondary">User not found.</p>
        <Link to="/admin/users" className="text-brand-600 text-[13px] font-medium mt-2 inline-block">Back to users</Link>
      </div>
    );
  }

  const handleUpdateStatus = async (taskId, patch) => {
    await editTask(taskId, patch);
    notify('Task status updated.', 'success');
  };

  const handleDelete = async () => {
    await removeTask(deleteTarget.id);
    notify('Task deleted.', 'success');
    setDeleteTarget(null);
    setActiveTask(null);
  };

  const handleEditSubmit = async (form) => {
    await editTask(editingTask.id, form);
    notify('Task updated.', 'success');
    setEditingTask(null);
    setActiveTask(null);
  };

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary">
        <ArrowLeft size={15} /> Back
      </button>

      <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} color={user.color} size="lg" />
          <div>
            <h2 className="text-[17px] font-semibold text-text-primary">{user.name}</h2>
            <p className="text-[13px] text-text-secondary">{user.title} · <span className="font-mono">{user.username}</span></p>
            <span className={`inline-flex items-center gap-1.5 mt-1 text-[11.5px] font-medium ${user.status === 'active' ? 'text-success-600' : 'text-text-muted'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-success-500' : 'bg-text-muted'}`} />
              {user.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <div className="flex-1" />
        <ProgressRing value={stats.completionRate} sublabel="completion" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 sm:border-l sm:pl-6 border-border-soft">
          <div><p className="text-[18px] font-semibold text-text-primary leading-none">{stats.total}</p><p className="text-[11.5px] text-text-muted mt-1">Total</p></div>
          <div><p className="text-[18px] font-semibold text-success-600 leading-none">{stats.completed}</p><p className="text-[11.5px] text-text-muted mt-1">Completed</p></div>
          <div><p className="text-[18px] font-semibold text-warning-600 leading-none">{stats.pending}</p><p className="text-[11.5px] text-text-muted mt-1">Pending</p></div>
          <div><p className="text-[18px] font-semibold text-danger-600 leading-none">{stats.overdue}</p><p className="text-[11.5px] text-text-muted mt-1">Overdue</p></div>
        </div>
      </div>

      <div className="card p-5">
        <StackedBar stats={stats} />
      </div>

      <div className="card p-5">
        <h3 className="text-[13.5px] font-semibold text-text-primary mb-3">Task history</h3>
        <TaskFilters filters={filters} setFilters={setFilters} users={users} />
        <div className="mt-4">
          <TaskTable
            tasks={filtered}
            getUser={() => user}
            showUser={false}
            onRowClick={setActiveTask}
            onEdit={(t) => { setEditingTask(t); }}
            onDelete={(t) => setDeleteTarget(t)}
          />
        </div>
      </div>

      <TaskDetailModal
        open={!!activeTask}
        onClose={() => setActiveTask(null)}
        task={activeTask}
        user={user}
        role="admin"
        onUpdateStatus={handleUpdateStatus}
        onEdit={(t) => setEditingTask(t)}
        onDelete={(t) => setDeleteTarget(t)}
      />

      <TaskFormModal
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditSubmit}
        users={users}
        initialTask={editingTask}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this task?"
        description={`"${deleteTarget?.title}" will be permanently removed from ${user.name}'s task list.`}
        confirmLabel="Delete task"
      />
    </div>
  );
}
