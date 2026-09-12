// Data service layer.
//
// Every function here returns a Promise, even though the current
// implementation is synchronous localStorage. That's deliberate: it means
// the rest of the app already calls this layer the way it would call a
// real backend, so swapping these bodies for Supabase queries later is a
// contained change — no component or page needs to be rewritten.

import { seedUsers, seedTasks } from '../data/mockData';

const USERS_KEY = 'taskflow_users';
const TASKS_KEY = 'taskflow_tasks';

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded() {
  if (!localStorage.getItem(USERS_KEY)) write(USERS_KEY, seedUsers);
  if (!localStorage.getItem(TASKS_KEY)) write(TASKS_KEY, seedTasks);
}

ensureSeeded();

const delay = () => new Promise((res) => setTimeout(res, 120));
const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

// ---------- Users ----------
export async function getUsers() {
  await delay();
  return read(USERS_KEY, []);
}

export async function getUserById(id) {
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

export async function addUser(user) {
  const users = await getUsers();
  const newUser = { id: uid('u'), status: 'active', role: 'employee', createdAt: new Date().toISOString(), ...user };
  const next = [...users, newUser];
  write(USERS_KEY, next);
  return newUser;
}

export async function updateUser(id, patch) {
  const users = await getUsers();
  const next = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
  write(USERS_KEY, next);
  return next.find((u) => u.id === id);
}

export async function deleteUser(id) {
  const users = await getUsers();
  write(USERS_KEY, users.filter((u) => u.id !== id));
  return true;
}

// ---------- Tasks ----------
export async function getTasks() {
  await delay();
  return read(TASKS_KEY, []);
}

export async function addTask(task) {
  const tasks = await getTasks();
  const newTask = {
    id: uid('t'),
    status: 'pending',
    note: '',
    reason: '',
    createdAt: new Date().toISOString(),
    ...task,
  };
  write(TASKS_KEY, [newTask, ...tasks]);
  return newTask;
}

export async function updateTask(id, patch) {
  const tasks = await getTasks();
  const next = tasks.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t));
  write(TASKS_KEY, next);
  return next.find((t) => t.id === id);
}

export async function deleteTask(id) {
  const tasks = await getTasks();
  write(TASKS_KEY, tasks.filter((t) => t.id !== id));
  return true;
}

export async function resetDemoData() {
  write(USERS_KEY, seedUsers);
  write(TASKS_KEY, seedTasks);
  return true;
}
