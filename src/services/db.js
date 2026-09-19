import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';

// Isolated client used purely to sign up new users without altering the admin's active session
const adminAuthClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ---------- Users ----------
export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return data ? data.map(toCamelCase) : [];
}

export async function getUserById(id) {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return toCamelCase(data);
}

export async function addUser(user) {
  // 1. Register the user in Supabase Auth securely
  const email = `${user.username.trim().toLowerCase()}@taskflow.local`;
  const { data: authData, error: authError } = await adminAuthClient.auth.signUp({
    email,
    password: user.password,
  });
  
  if (authError) throw new Error(authError.message);
  if (!authData?.user) throw new Error("Failed to create auth user.");

  // 2. Insert their profile into the public table using the Admin's RLS privileges
  const { data, error } = await supabase
    .from('users')
    .insert([{ id: authData.user.id, status: 'active', role: 'employee', ...user }])
    .select()
    .single();
    
  if (error) {
    // Attempt rollback if profile insertion fails
    console.error("Profile insertion failed, manual cleanup of auth user may be required:", error.message);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateUser(id, patch) {
  const { data, error } = await supabase
    .from('users')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

// ---------- Tasks ----------
export async function getTasks() {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ? data.map(toCamelCase) : [];
}

export async function addTask(task) {
  // If assignedTo is an empty string, set it to null for foreign key constraints
  const payload = {
    status: 'pending',
    note: '',
    reason: '',
    ...task,
  };
  if (payload.assigned_to === '') payload.assigned_to = null;
  if (payload.assignedBy) {
    payload.assigned_by = payload.assignedBy;
    delete payload.assignedBy;
  }
  if (payload.assignedTo) {
    payload.assigned_to = payload.assignedTo;
    delete payload.assignedTo;
  }
  if (payload.deadlineDate) {
    payload.deadline_date = payload.deadlineDate;
    delete payload.deadlineDate;
  }
  if (payload.deadlineTime) {
    payload.deadline_time = payload.deadlineTime;
    delete payload.deadlineTime;
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([payload])
    .select()
    .single();
  if (error) throw new Error(error.message);
  
  // Transform back to camelCase for frontend
  return toCamelCase(data);
}

export async function updateTask(id, patch) {
  const payload = { ...patch };
  if (payload.assignedTo !== undefined) {
    payload.assigned_to = payload.assignedTo === '' ? null : payload.assignedTo;
    delete payload.assignedTo;
  }
  if (payload.assignedBy !== undefined) {
    payload.assigned_by = payload.assignedBy === '' ? null : payload.assignedBy;
    delete payload.assignedBy;
  }
  if (payload.deadlineDate !== undefined) {
    payload.deadline_date = payload.deadlineDate;
    delete payload.deadlineDate;
  }
  if (payload.deadlineTime !== undefined) {
    payload.deadline_time = payload.deadlineTime;
    delete payload.deadlineTime;
  }
  if (payload.completedAt !== undefined) {
    payload.completed_at = payload.completedAt;
    delete payload.completedAt;
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  
  return toCamelCase(data);
}

export async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

// Utility to convert snake_case back to camelCase for the frontend components
function toCamelCase(obj) {
  if (!obj) return obj;
  return {
    ...obj,
    assignedTo: obj.assigned_to,
    assignedBy: obj.assigned_by,
    deadlineDate: obj.deadline_date,
    deadlineTime: obj.deadline_time,
    createdAt: obj.created_at,
    completedAt: obj.completed_at,
  };
}
