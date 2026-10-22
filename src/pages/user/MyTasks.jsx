import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskCard from '../../components/tasks/TaskCard';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import TaskFormModal from '../../components/tasks/TaskFormModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { applyTaskFilters, sortTasksByUrgency } from '../../utils/taskUtils';
import { ListChecks, Plus } from 'lucide-react';

export default function MyTasks() {
  const { user } = useAuth();
  const { tasks, addTask, editTask, removeTask, stopDailyTask, resumeDailyTask } = useData();
  const { notify } = useToast();

  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', date: '' });
  const [activeTask, setActiveTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [taskType, setTaskType] = useState('all'); // 'all' | 'regular' | 'daily'

  const userTasks = useMemo(() => tasks.filter((t) => t.assignedTo === user.id), [tasks, user.id]);
  const regularCount = useMemo(() => userTasks.filter((t) => !t.isDaily).length, [userTasks]);
  const dailyCount = useMemo(() => userTasks.filter((t) => t.isDaily).length, [userTasks]);

  const myTasks = useMemo(() => {
    if (taskType === 'regular') return userTasks.filter((t) => !t.isDaily);
    if (taskType === 'daily') return userTasks.filter((t) => t.isDaily);
    return userTasks;
  }, [userTasks, taskType]);
  const filtered = useMemo(() => sortTasksByUrgency(applyTaskFilters(myTasks, filters)), [myTasks, filters]);

  const handleCreate = async (form) => {
    try {
      const { isDaily, ...taskData } = form;
      await addTask({
        ...taskData,
        assignedTo: user.id,
        assignedBy: user.id,
        isDaily: !!isDaily,
        dailyStatus: isDaily ? 'active' : undefined,
      });
      notify(
        isDaily
          ? `Daily task "${taskData.title}" created. It will repeat daily until stopped.`
          : `Task "${taskData.title}" created successfully.`,
        'success',
        { title: 'Task created' }
      );
      setFormOpen(false);
    } catch (err) {
      notify(err.message, 'error', { title: 'Failed to create task' });
    }
  };

  const handleEdit = async (form) => {
    try {
      await editTask(editingTask.id, form);
      notify('Task updated.', 'success');
      setEditingTask(null);
      setActiveTask(null);
    } catch (err) {
      notify(err.message, 'error', { title: 'Update failed' });
    }
  };

  const handleDelete = async () => {
    try {
      await removeTask(deleteTarget.id);
      notify('Task deleted.', 'success');
      setDeleteTarget(null);
      setActiveTask(null);
    } catch (err) {
      notify(err.message, 'error', { title: 'Delete failed' });
    }
  };

  const handleUpdateStatus = async (id, patch) => {
    try {
      await editTask(id, patch);
      notify('Task status updated.', 'success');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleStopDaily = async (task) => {
    try {
      await stopDailyTask(task);
      notify(`Daily recurrence for "${task.title}" stopped.`, 'success');
      setActiveTask((prev) => (prev && prev.id === task.id ? { ...prev, dailyStatus: 'stopped' } : prev));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleResumeDaily = async (task) => {
    try {
      await resumeDailyTask(task);
      notify(`Daily task "${task.title}" resumed.`, 'success');
      setActiveTask((prev) => (prev && prev.id === task.id ? { ...prev, dailyStatus: 'active' } : prev));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

        <button
          className="btn-primary shrink-0"
          onClick={() => {
            setEditingTask(null);
            setFormOpen(true);
          }}
        >
          <Plus size={15} /> Create task
        </button>
      </div>

      <TaskFilters filters={filters} setFilters={setFilters} />

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={ListChecks}
            title={
              taskType === 'daily'
                ? 'No daily tasks found'
                : taskType === 'regular'
                ? 'No regular tasks found'
                : 'No tasks match these filters'
            }
            description={
              taskType === 'daily'
                ? 'You can create a daily task using the "+ Create task" button above.'
                : taskType === 'regular'
                ? 'You have no regular tasks right now. Any non-daily tasks will show up here.'
                : 'Try adjusting your search or filters.'
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} onClick={() => setActiveTask(t)} />
          ))}
        </div>
      )}

      <TaskFormModal
        open={formOpen || !!editingTask}
        onClose={() => {
          setFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEdit : handleCreate}
        users={[user]}
        currentUser={user}
        initialTask={editingTask}
      />

      <TaskDetailModal
        open={!!activeTask}
        onClose={() => setActiveTask(null)}
        task={activeTask}
        user={user}
        role="employee"
        onUpdateStatus={handleUpdateStatus}
        onEdit={(t) => setEditingTask(t)}
        onDelete={(t) => setDeleteTarget(t)}
        onStopDaily={handleStopDaily}
        onResumeDaily={handleResumeDaily}
      />

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
