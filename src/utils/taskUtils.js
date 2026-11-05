import { isPastDeadline, isSameDay, isWithinDays } from './dateUtils';

// Canonical statuses stored on a task: 'pending' | 'completed' | 'not_completed'
// If a task passes its deadline without being completed, it is marked as 'not_completed' (Not done)
export function getDerivedStatus(task) {
  if (task.status === 'completed') return 'completed';
  if (task.status === 'not_completed') return 'not_completed';
  if (isPastDeadline(task.deadlineDate, task.deadlineTime)) return 'not_completed';
  return 'pending';
}

export const STATUS_META = {
  completed: { label: 'Completed', dot: 'bg-success-500', badge: 'bg-success-50 text-success-600', text: 'text-success-600' },
  pending: { label: 'Pending', dot: 'bg-amber-400', badge: 'bg-warning-50 text-warning-600', text: 'text-warning-600' },
  not_completed: { label: 'Not done', dot: 'bg-danger-500', badge: 'bg-danger-50 text-danger-600', text: 'text-danger-600' },
};

export const PRIORITY_META = {
  High: { badge: 'bg-danger-50 text-danger-600', dot: 'bg-danger-500' },
  Medium: { badge: 'bg-warning-50 text-warning-600', dot: 'bg-amber-400' },
  Low: { badge: 'bg-brand-50 text-brand-600', dot: 'bg-brand-500' },
};

// Compute statistics for unique tasks (e.g. "Site visits" = 1 task).
// A unique task's status is derived from its latest active run (e.g. today).
export function computeStats(tasks) {
  const uniqueList = groupUniqueTasks(tasks);
  const total = uniqueList.length;
  let completed = 0, pending = 0, notCompleted = 0;

  for (const t of uniqueList) {
    const s = getDerivedStatus(t);
    if (s === 'completed') completed++;
    else if (s === 'not_completed') notCompleted++;
    else pending++;
  }
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, overdue: notCompleted, notCompleted, completionRate };
}

// Compute statistics across all historical task logs/runs (all day instances)
export function computeAllRunsStats(tasks) {
  const total = tasks.length;
  let completed = 0, pending = 0, notCompleted = 0;

  for (const t of tasks) {
    const s = getDerivedStatus(t);
    if (s === 'completed') completed++;
    else if (s === 'not_completed') notCompleted++;
    else pending++;
  }
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, overdue: notCompleted, notCompleted, completionRate };
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
  { value: 'completed', label: 'Completed' },
  { value: 'not_completed', label: 'Not done' },
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
    if (filters.type && filters.type !== 'all') {
      if (filters.type === 'daily' && !t.isDaily) return false;
      if (filters.type === 'regular' && t.isDaily) return false;
    }
    return true;
  });
}

// Group recurring/daily tasks so each distinct task appears as a single unique entry,
// keeping track of all historical/daily run instances in `history`.
export function groupUniqueTasks(tasks) {
  const groups = new Map();

  for (const t of tasks) {
    // Unique key: for daily tasks, group by user + title (or dailyGroupId if present);
    // for non-daily regular tasks, each task is its own unique entry.
    const isDaily = !!t.isDaily;
    const groupKey = isDaily
      ? (t.dailyGroupId || `${t.assignedTo}::${(t.title || '').toLowerCase().trim()}`)
      : `single::${t.id}`;

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        ...t,
        isDaily,
        instances: [t],
      });
    } else {
      const existing = groups.get(groupKey);
      existing.instances.push(t);
      // Pick the most recent instance (by date/deadline) to represent the main entry
      const existingTime = (existing.date || '') + (existing.deadlineTime || '');
      const currentTime = (t.date || '') + (t.deadlineTime || '');
      if (currentTime >= existingTime) {
        // Keep accumulated instances, update representative task fields
        const allInstances = existing.instances;
        Object.assign(existing, t);
        existing.instances = allInstances;
        existing.isDaily = true;
      }
    }
  }

  // Sort each group's instances from newest to oldest
  for (const group of groups.values()) {
    group.instances.sort((a, b) => {
      const ta = (a.date || '') + (a.deadlineTime || '');
      const tb = (b.date || '') + (b.deadlineTime || '');
      return tb.localeCompare(ta);
    });
  }

  return Array.from(groups.values());
}

export function sortTasksByUrgency(tasks) {
  const rank = { not_completed: 0, pending: 1, completed: 2 };
  return [...tasks].sort((a, b) => {
    const ra = rank[getDerivedStatus(a)] ?? 1;
    const rb = rank[getDerivedStatus(b)] ?? 1;
    if (ra !== rb) return ra - rb;
    return (a.deadlineDate + a.deadlineTime).localeCompare(b.deadlineDate + b.deadlineTime);
  });
}
