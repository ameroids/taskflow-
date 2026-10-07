import { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskTable from '../../components/tasks/TaskTable';
import TaskFormModal from '../../components/tasks/TaskFormModal';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import ExtendDeadlineModal from '../../components/tasks/ExtendDeadlineModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { applyTaskFilters } from '../../utils/taskUtils';
import { addDaysISO, combineDateTime } from '../../utils/dateUtils';
import { Plus } from 'lucide-react';

export default function AdminTasks() {
  const { users, tasks, addTask, editTask, removeTask, getUserById } = useData();
  const { notify } = useToast();

  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', date: '', user: 'all' });
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [extendingTask, setExtendingTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => applyTaskFilters(tasks, filters), [tasks, filters]);

  const handleCreate = async (form) => {
    try {
      const { isRecurring, recurrenceDays, ...taskData } = form;
      if (isRecurring && recurrenceDays > 1) {
        const baseTaskDate = combineDateTime(taskData.date, '00:00') || new Date();
        const baseDeadlineDate = combineDateTime(taskData.deadlineDate, '00:00') || new Date();
        
        for (let i = 0; i < recurrenceDays; i++) {
          await addTask({
            ...taskData,
            date: addDaysISO(i, baseTaskDate),
            deadlineDate: addDaysISO(i, baseDeadlineDate),
          });
        }
        notify(`${recurrenceDays} daily tasks for "${taskData.title}" were assigned to ${getUserById(taskData.assignedTo)?.name}.`, 'success', { title: 'Recurring tasks created' });
      } else {
        await addTask(taskData);
        notify(`"${taskData.title}" was assigned to ${getUserById(taskData.assignedTo)?.name}.`, 'success', { title: 'Task created' });
      }
      setFormOpen(false);
    } catch (err) {
      notify(err.message, 'error', { title: 'Task creation failed' });
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

  const handleUpdateStatus = async (id, patch) => {
    try {
      await editTask(id, patch);
      notify('Task status updated.', 'success');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleExtendDeadline = async (id, newDeadlineDate) => {
    try {
      await editTask(id, { deadlineDate: newDeadlineDate });
      notify('Task deadline extended.', 'success');
      setExtendingTask(null);
    } catch (err) {
      notify(err.message, 'error', { title: 'Failed to extend deadline' });
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
          onExtend={(t) => setExtendingTask(t)}
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
        onExtend={(t) => { setActiveTask(null); setExtendingTask(t); }}
      />

      <ExtendDeadlineModal
        open={!!extendingTask}
        onClose={() => setExtendingTask(null)}
        task={extendingTask}
        onConfirm={handleExtendDeadline}
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
