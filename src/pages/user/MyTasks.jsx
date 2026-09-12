import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskCard from '../../components/tasks/TaskCard';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import EmptyState from '../../components/ui/EmptyState';
import { applyTaskFilters, sortTasksByUrgency } from '../../utils/taskUtils';
import { ListChecks } from 'lucide-react';

export default function MyTasks() {
  const { user } = useAuth();
  const { tasks, editTask } = useData();
  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', date: '' });
  const [activeTask, setActiveTask] = useState(null);

  const myTasks = useMemo(() => tasks.filter((t) => t.assignedTo === user.id), [tasks, user.id]);
  const filtered = useMemo(() => sortTasksByUrgency(applyTaskFilters(myTasks, filters)), [myTasks, filters]);

  const handleUpdateStatus = async (id, patch) => {
    await editTask(id, patch);
  };

  return (
    <div className="space-y-5">
      <TaskFilters filters={filters} setFilters={setFilters} />

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={ListChecks} title="No tasks match these filters" description="Try adjusting your search or filters." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} onClick={() => setActiveTask(t)} />
          ))}
        </div>
      )}

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
