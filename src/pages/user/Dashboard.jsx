import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/ui/StatCard';
import ProgressRing from '../../components/ui/ProgressRing';
import ProgressBar from '../../components/ui/ProgressBar';
import TaskCard from '../../components/tasks/TaskCard';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import EmptyState from '../../components/ui/EmptyState';
import { computeStats, computeTodayStats, sortTasksByUrgency } from '../../utils/taskUtils';
import { ListChecks, CheckCircle2, Clock, AlertTriangle, CalendarCheck } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const { tasks, editTask } = useData();
  const [activeTask, setActiveTask] = useState(null);

  const myTasks = useMemo(() => tasks.filter((t) => t.assignedTo === user.id), [tasks, user.id]);
  const stats = useMemo(() => computeStats(myTasks), [myTasks]);
  const today = useMemo(() => computeTodayStats(myTasks), [myTasks]);
  const upNext = useMemo(
    () => sortTasksByUrgency(myTasks).filter((t) => t.status === 'pending').slice(0, 4),
    [myTasks]
  );

  const handleUpdateStatus = async (id, patch) => {
    await editTask(id, patch);
  };

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[19px] font-semibold text-text-primary">{greeting}, {user.name.split(' ')[0]}</h2>
        <p className="text-[13.5px] text-text-secondary mt-0.5">Here's what's on your plate today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 sm:col-span-1 flex items-center gap-4">
          <ProgressRing value={today.completionRate} size={72} stroke={6.5} />
          <div>
            <p className="text-[13px] font-semibold text-text-primary">Today's progress</p>
            <p className="text-[12.5px] text-text-secondary mt-0.5">{today.completed} / {today.total} tasks completed</p>
          </div>
        </div>
        <div className="sm:col-span-2 grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard label="Total assigned" value={stats.total} icon={ListChecks} />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="success" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} tone="warning" />
          <StatCard label="Overdue" value={stats.overdue} icon={AlertTriangle} tone="danger" />
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[13.5px] font-semibold text-text-primary">Overall completion</h3>
          <span className="text-[13px] font-medium text-text-primary">{stats.completionRate}%</span>
        </div>
        <ProgressBar value={stats.completionRate} height="h-2" className="mt-2" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[14px] font-semibold text-text-primary">Up next</h3>
        </div>
        {upNext.length === 0 ? (
          <div className="card">
            <EmptyState icon={CalendarCheck} title="You're all caught up" description="No pending tasks right now — nice work." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upNext.map((t) => (
              <TaskCard key={t.id} task={t} onClick={() => setActiveTask(t)} />
            ))}
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
