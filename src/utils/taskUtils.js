import { isPastDeadline, isSameDay, isWithinDays } from './dateUtils';

// Canonical statuses stored on a task: 'pending' | 'completed' | 'not_completed'
// Derived display status adds 'overdue' when a pending task's deadline has passed.
export function getDerivedStatus(task) {
  if (task.status === 'completed') return 'completed';
  if (task.status === 'not_completed') return 'not_completed';
  if (isPastDeadline(task.deadlineDate, task.deadlineTime)) return 'overdue';
  return 'pending';
}

export const STATUS_META = {
  completed: { label: 'Completed', dot: 'bg-success-500', badge: 'bg-success-50 text-success-600', text: 'text-success-600' },
  pending: { label: 'Pending', dot: 'bg-amber-400', badge: 'bg-warning-50 text-warning-600', text: 'text-warning-600' },
  overdue: { label: 'Overdue', dot: 'bg-danger-500', badge: 'bg-danger-50 text-danger-600', text: 'text-danger-600' },
  not_completed: { label: 'Not completed', dot: 'bg-text-muted', badge: 'bg-neutral-50 text-text-secondary', text: 'text-text-secondary' },
};

export const PRIORITY_META = {
  High: { badge: 'bg-danger-50 text-danger-600', dot: 'bg-danger-500' },
  Medium: { badge: 'bg-warning-50 text-warning-600', dot: 'bg-amber-400' },
  Low: { badge: 'bg-brand-50 text-brand-600', dot: 'bg-brand-500' },
};

export function computeStats(tasks) {
  const total = tasks.length;
  let completed = 0, pending = 0, overdue = 0, notCompleted = 0;
  for (const t of tasks) {
    const s = getDerivedStatus(t);
    if (s === 'completed') completed++;
    else if (s === 'overdue') overdue++;
    else if (s === 'not_completed') notCompleted++;
    else pending++;
  }
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, overdue, notCompleted, completionRate };
}

export function computeTodayStats(tasks) {
  const todays = tasks.filter((t) => isSameDay(t.date));
  const stats = computeStats(todays);
  return { ...stats, tasks: todays };
}

export function filterByRange(tasks, range) {
  // range: 'today' | 'week' | 'month' | 'all' | {start, end}
  if (range === 'all' || !range) return tasks;
  if (range === 'today') return tasks.filter((t) => isSameDay(t.date));
  if (range === 'week') return tasks.filter((t) => isWithinDays(t.date, 7));
  if (range === 'month') return tasks.filter((t) => isWithinDays(t.date, 31));
  if (typeof range === 'object' && range.start && range.end) {
    return tasks.filter((t) => t.date >= range.start && t.date <= range.end);
  }
  return tasks;
}

export const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];
export const STORED_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'not_completed', label: 'Not completed' },
];
export const DISPLAY_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'completed', label: 'Completed' },
  { value: 'not_completed', label: 'Not completed' },
];

export function applyTaskFilters(tasks, filters) {
  return tasks.filter((t) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !(t.description || '').toLowerCase().includes(q)) return false;
    }
    if (filters.status && filters.status !== 'all' && getDerivedStatus(t) !== filters.status) return false;
    if (filters.priority && filters.priority !== 'all' && t.priority !== filters.priority) return false;
    if (filters.date && t.date !== filters.date) return false;
    if (filters.user && filters.user !== 'all' && t.assignedTo !== filters.user) return false;
    return true;
  });
}

export function sortTasksByUrgency(tasks) {
  const rank = { overdue: 0, pending: 1, not_completed: 2, completed: 3 };
  return [...tasks].sort((a, b) => {
    const ra = rank[getDerivedStatus(a)];
    const rb = rank[getDerivedStatus(b)];
    if (ra !== rb) return ra - rb;
    return (a.deadlineDate + a.deadlineTime).localeCompare(b.deadlineDate + b.deadlineTime);
  });
}
