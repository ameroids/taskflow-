import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as db from '../services/db';
import { useAuth } from './AuthContext';
import { todayISO } from '../utils/dateUtils';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [u, t] = await Promise.all([db.getUsers(), db.getTasks()]);
    
    // Retroactively identify recurring/daily tasks by checking for duplicate titles per user
    const titleCounts = {};
    t.forEach(task => {
      const key = `${task.assignedTo}-${task.title.toLowerCase().trim()}`;
      titleCounts[key] = (titleCounts[key] || 0) + 1;
    });

    t.forEach(task => {
      const key = `${task.assignedTo}-${task.title.toLowerCase().trim()}`;
      if (!task.hasExplicitDailyMeta) {
        task.isDaily = task.isDaily || titleCounts[key] > 1;
      }
      if (task.isDaily && !task.dailyStatus) {
        task.dailyStatus = 'active';
      }
    });

    // For active daily tasks, ensure an instance exists for today
    const today = todayISO();
    const activeDailyGroups = new Map();

    t.forEach(task => {
      if (task.isDaily && task.dailyStatus === 'active') {
        const groupKey = task.dailyGroupId || `${task.assignedTo}::${task.title.toLowerCase().trim()}`;
        if (!activeDailyGroups.has(groupKey)) {
          activeDailyGroups.set(groupKey, []);
        }
        activeDailyGroups.get(groupKey).push(task);
      }
    });

    const newGeneratedTasks = [];
    for (const [groupKey, groupTasks] of activeDailyGroups.entries()) {
      const hasTodayTask = groupTasks.some(task => task.date === today);
      if (!hasTodayTask && groupTasks.length > 0) {
        const baseTask = [...groupTasks].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0];
        try {
          const generated = await db.addTask({
            title: baseTask.title,
            description: baseTask.description,
            assignedTo: baseTask.assignedTo,
            assignedBy: baseTask.assignedBy,
            date: today,
            deadlineDate: today,
            deadlineTime: baseTask.deadlineTime || '18:00',
            priority: baseTask.priority || 'Medium',
            status: 'pending',
            isDaily: true,
            dailyStatus: 'active',
            dailyGroupId: baseTask.dailyGroupId || groupKey,
          });
          newGeneratedTasks.push(generated);
        } catch (err) {
          console.error('Failed to auto-instantiate daily task for today:', err);
        }
      }
    }

    const allTasks = newGeneratedTasks.length > 0 ? [...newGeneratedTasks, ...t] : t;
    setUsers(u);
    setTasks(allTasks);
  }, []);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      (async () => {
        setLoading(true);
        await refresh();
        setLoading(false);
      })();
    } else {
      setUsers([]);
      setTasks([]);
    }
  }, [user, refresh]);

  // ---- Users ----
  const addUser = useCallback(async (payload) => {
    const created = await db.addUser(payload);
    setUsers((prev) => [...prev, created]);
    return created;
  }, []);

  const editUser = useCallback(async (id, patch) => {
    const updated = await db.updateUser(id, patch);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  }, []);

  const removeUser = useCallback(async (id) => {
    await db.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  // ---- Tasks ----
  const addTask = useCallback(async (payload) => {
    const created = await db.addTask(payload);
    setTasks((prev) => [created, ...prev]);
    return created;
  }, []);

  const editTask = useCallback(async (id, patch) => {
    const updated = await db.updateTask(id, patch);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const removeTask = useCallback(async (id) => {
    await db.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const stopDailyTask = useCallback(async (task) => {
    const updated = await db.updateTask(task.id, { dailyStatus: 'stopped' });
    const groupKey = task.dailyGroupId || `${task.assignedTo}::${task.title.toLowerCase().trim()}`;
    setTasks((prev) =>
      prev.map((t) => {
        const tGroupKey = t.dailyGroupId || `${t.assignedTo}::${t.title.toLowerCase().trim()}`;
        return (t.isDaily && tGroupKey === groupKey) ? { ...t, dailyStatus: 'stopped' } : t;
      })
    );
    return updated;
  }, []);

  const resumeDailyTask = useCallback(async (task) => {
    const updated = await db.updateTask(task.id, { dailyStatus: 'active' });
    const groupKey = task.dailyGroupId || `${task.assignedTo}::${task.title.toLowerCase().trim()}`;
    setTasks((prev) =>
      prev.map((t) => {
        const tGroupKey = t.dailyGroupId || `${t.assignedTo}::${t.title.toLowerCase().trim()}`;
        return (t.isDaily && tGroupKey === groupKey) ? { ...t, dailyStatus: 'active' } : t;
      })
    );
    await refresh();
    return updated;
  }, [refresh]);

  const clearAllData = useCallback(async (deleteEmployees = false) => {
    await db.clearAllTasks(deleteEmployees);
    await refresh();
  }, [refresh]);

  const resetDemoData = useCallback(async () => {
    await db.resetDemoData();
    await refresh();
  }, [refresh]);

  const getUserById = useCallback((id) => users.find((u) => u.id === id) || null, [users]);
  const tasksForUser = useCallback((userId) => tasks.filter((t) => t.assignedTo === userId), [tasks]);

  const value = {
    users, tasks, loading,
    addUser, editUser, removeUser,
    addTask, editTask, removeTask,
    stopDailyTask, resumeDailyTask,
    clearAllData,
    getUserById, tasksForUser, resetDemoData, refresh,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

