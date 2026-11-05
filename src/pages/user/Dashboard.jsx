import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import StatCard from '../../components/ui/StatCard';
import ProgressRing from '../../components/ui/ProgressRing';
import ProgressBar from '../../components/ui/ProgressBar';
import TaskCard from '../../components/tasks/TaskCard';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import TaskFormModal from '../../components/tasks/TaskFormModal';
import EmptyState from '../../components/ui/EmptyState';
import { computeStats, sortTasksByUrgency, groupUniqueTasks } from '../../utils/taskUtils';
import { todayISO, addDaysISO, formatDateShort } from '../../utils/dateUtils';
import { ListChecks, CheckCircle2, Clock, AlertTriangle, CalendarCheck, Plus, Calendar as CalendarIcon } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const { tasks, addTask, editTask, stopDailyTask, resumeDailyTask } = useData();
  const { notify } = useToast();
  const [activeTask, setActiveTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  // Date filter: 'today' | 'tomorrow' | 'all' | 'custom'
  const [dateFilter, setDateFilter] = useState('today');
  const [customDate, setCustomDate] = useState(todayISO());

  const todayDate = todayISO();
  const tomorrowDate = addDaysISO(1);

  const myAllTasks = useMemo(() => tasks.filter((t) => t.assignedTo === user.id), [tasks, user.id]);

  const filteredTasks = useMemo(() => {
    if (dateFilter === 'today') return myAllTasks.filter((t) => t.date === todayDate);
    if (dateFilter === 'tomorrow') return myAllTasks.filter((t) => t.date === tomorrowDate);
    if (dateFilter === 'custom') return customDate ? myAllTasks.filter((t) => t.date === customDate) : myAllTasks;
    return myAllTasks; // 'all'
  }, [myAllTasks, dateFilter, customDate, todayDate, tomorrowDate]);

  const stats = useMemo(() => computeStats(filteredTasks), [filteredTasks]);
  const uniqueTasks = useMemo(() => groupUniqueTasks(filteredTasks), [filteredTasks]);

  const upNext = useMemo(
    () => sortTasksByUrgency(filteredTasks).filter((t) => t.status === 'pending').slice(0, 4),
    [filteredTasks]
  );

  const activeDateLabel = useMemo(() => {
    if (dateFilter === 'today') return 'Today';
    if (dateFilter === 'tomorrow') return 'Tomorrow';
    if (dateFilter === 'custom') return customDate ? formatDateShort(customDate) : 'Selected Date';
    return 'All time';
  }, [dateFilter, customDate]);

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
          : `Task "${taskData.title}" created.`,
        'success',
        { title: 'Task created' }
      );
      setFormOpen(false);
    } catch (err) {
      notify(err.message, 'error', { title: 'Failed to create task' });
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
      notify(`Daily task "${task.title}" stopped.`, 'success');
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

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-semibold text-text-primary">{greeting}, {user.name.split(' ')[0]}</h2>
          <p className="text-[13.5px] text-text-secondary mt-0.5">Here's your work status for {activeDateLabel.toLowerCase()}.</p>
        </div>
        <button className="btn-primary shrink-0 self-start sm:self-auto" onClick={() => setFormOpen(true)}>
          <Plus size={15} /> Create task
        </button>
      </div>

      {/* Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-2.5 sm:p-3 rounded-xl border border-border shadow-card">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setDateFilter('today')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all shrink-0 ${
              dateFilter === 'today'
                ? 'bg-ink-950 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setDateFilter('tomorrow')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all shrink-0 ${
              dateFilter === 'tomorrow'
                ? 'bg-ink-950 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
            }`}
          >
            Tomorrow
          </button>
          <button
            onClick={() => setDateFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all shrink-0 ${
              dateFilter === 'all'
                ? 'bg-ink-950 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-canvas'
            }`}
          >
            All time
          </button>
        </div>

        {/* Calendar Picker */}
        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <CalendarIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="date"
              value={dateFilter === 'custom' ? customDate : ''}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setDateFilter('custom');
              }}
              className={`input pl-8 py-1.5 text-[12.5px] !w-full sm:!w-44 ${
                dateFilter === 'custom' ? 'border-brand-500 ring-2 ring-brand-400/20 font-medium' : ''
              }`}
            />
          </div>
          {dateFilter !== 'all' && (
            <span className="hidden md:inline-flex text-[11.5px] font-medium px-2 py-1 rounded bg-brand-50 text-brand-600 border border-brand-500/20 whitespace-nowrap">
              Showing: {activeDateLabel}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 sm:col-span-1 flex items-center gap-4">
          <ProgressRing value={stats.completionRate} size={72} stroke={6.5} />
          <div>
            <p className="text-[13px] font-semibold text-text-primary">{activeDateLabel}'s progress</p>
            <p className="text-[12.5px] text-text-secondary mt-0.5">{stats.completed} / {stats.total} completed</p>
          </div>
        </div>
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="success" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} tone="warning" />
          <StatCard label="Not done" value={stats.notCompleted} icon={AlertTriangle} tone="danger" />
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[13.5px] font-semibold text-text-primary">{activeDateLabel} completion rate</h3>
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
        user={user}
        role="employee"
        onUpdateStatus={handleUpdateStatus}
        onStopDaily={handleStopDaily}
        onResumeDaily={handleResumeDaily}
      />

      <TaskFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        users={[user]}
        currentUser={user}
      />
    </div>
  );
}
