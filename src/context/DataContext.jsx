import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as db from '../services/db';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [u, t] = await Promise.all([db.getUsers(), db.getTasks()]);
    setUsers(u);
    setTasks(t);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

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
    getUserById, tasksForUser, resetDemoData, refresh,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
