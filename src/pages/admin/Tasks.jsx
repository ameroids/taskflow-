import { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskTable from '../../components/tasks/TaskTable';
import TaskFormModal from '../../components/tasks/TaskFormModal';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { applyTaskFilters } from '../../utils/taskUtils';
import { Plus } from 'lucide-react';

export default function AdminTasks() {
  const { users, tasks, addTask, editTask, removeTask, getUserById } = useData();
  const { notify } = useToast();

  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', date: '', user: 'all' });
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => applyTaskFilters(tasks, filters), [tasks, filters]);

  const handleCreate = async (form) => {
    await addTask(form);
    notify(`"${form.title}" was assigned to ${getUserById(form.assignedTo)?.name}.`, 'success', { title: 'Task created' });
    setFormOpen(false);
  };

  const handleEdit = async (form) => {
    await editTask(editingTask.id, form);
    notify('Task updated.', 'success');
    setEditingTask(null);
    setActiveTask(null);
  };

  const handleUpdateStatus = async (id, patch) => {
    await editTask(id, patch);
    notify('Task status updated.', 'success');
  };

  const handleDelete = async () => {
    await removeTask(deleteTarget.id);
    notify('Task deleted.', 'success');
    setDeleteTarget(null);
    setActiveTask(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <TaskFilters filters={filters} setFilters={setFilters} users={users.filter((u) => u.role === 'employee')} showUserFilter />
        <button className="btn-primary shrink-0" onClick={() => { setEditingTask(null); setFormOpen(true); }}>
          <Plus size={15} /> Create task
        </button>
      </div>

      <div className="card p-2 sm:p-4">
        <TaskTable
          tasks={filtered}
          getUser={getUserById}
          onRowClick={setActiveTask}
          onEdit={(t) => setEditingTask(t)}
          onDelete={(t) => setDeleteTarget(t)}
        />
      </div>

      <TaskFormModal
        open={formOpen || !!editingTask}
        onClose={() => { setFormOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleEdit : handleCreate}
        users={users}
        initialTask={editingTask}
      />

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
