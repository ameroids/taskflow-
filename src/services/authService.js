import { getUsers } from './db';

const SESSION_KEY = 'taskflow_session';

// Simulated auth — swap this file's internals for Supabase Auth
// (supabase.auth.signInWithPassword / onAuthStateChange) later without
// touching AuthContext or any page that consumes it.
export async function login(username, password) {
  const users = await getUsers();
  const match = users.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
  );
  if (!match) {
    throw new Error('Incorrect username or password.');
  }
  if (match.status === 'inactive') {
    throw new Error('You are inactive, kindly contact your admin.');
  }
  const session = { id: match.id, username: match.username, role: match.role, name: match.name };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
