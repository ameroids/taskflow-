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

  const [taskType, setTaskType] = useState('regular'); // 'regular' | 'daily'

  const myTasks = useMemo(() => tasks.filter((t) => t.assignedTo === user.id && (taskType === 'daily' ? t.isDaily : !t.isDaily)), [tasks, user.id, taskType]);
  const filtered = useMemo(() => sortTasksByUrgency(applyTaskFilters(myTasks, filters)), [myTasks, filters]);

  const handleUpdateStatus = async (id, patch) => {
    await editTask(id, patch);
  };

  return (
    <div className="space-y-5">
      <div className="flex bg-surface p-1 rounded-lg border border-border w-fit">
        <button
          className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${taskType === 'regular' ? 'bg-canvas text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setTaskType('regular')}
        >
          Regular Tasks
        </button>
        <button
          className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${taskType === 'daily' ? 'bg-canvas text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setTaskType('daily')}
        >
          Daily / Recurring
        </button>
      </div>

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
