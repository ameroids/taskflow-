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

  // Handle daily recurrence metadata
  let description = payload.description || '';
  if (payload.isDaily) {
    const meta = {
      isDaily: true,
      dailyStatus: payload.dailyStatus || 'active',
      dailyGroupId: payload.dailyGroupId || `daily-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    description = `${description}\n<!--TASKFLOW_DAILY:${JSON.stringify(meta)}-->`;
  }
  payload.description = description;

  // Clean non-database attributes before Supabase query
  delete payload.isDaily;
  delete payload.dailyStatus;
  delete payload.dailyGroupId;
  delete payload.isRecurring;
  delete payload.recurrenceDays;

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

  // Handle daily metadata update if applicable
  if (payload.dailyStatus !== undefined || payload.isDaily !== undefined) {
    let currentDesc = payload.description !== undefined ? payload.description : null;
    if (currentDesc === null) {
      const { data: currentData } = await supabase.from('tasks').select('description').eq('id', id).single();
      currentDesc = currentData?.description || '';
    }

    const metaMatch = currentDesc.match(/<!--TASKFLOW_DAILY:(.*?)-->/);
    let meta = metaMatch ? JSON.parse(metaMatch[1]) : { isDaily: true, dailyStatus: 'active' };
    if (payload.dailyStatus !== undefined) meta.dailyStatus = payload.dailyStatus;
    if (payload.isDaily !== undefined) meta.isDaily = payload.isDaily;
    if (payload.dailyGroupId !== undefined) meta.dailyGroupId = payload.dailyGroupId;

    const cleanDesc = currentDesc.replace(/<!--TASKFLOW_DAILY:.*?-->/g, '').trimEnd();
    payload.description = meta.isDaily
      ? `${cleanDesc}\n<!--TASKFLOW_DAILY:${JSON.stringify(meta)}-->`
      : cleanDesc;
  }

  delete payload.isDaily;
  delete payload.dailyStatus;
  delete payload.dailyGroupId;
  delete payload.isRecurring;
  delete payload.recurrenceDays;

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

export async function resetDemoData() {
  return true;
}

// Utility to convert snake_case back to camelCase for the frontend components
function toCamelCase(obj) {
  if (!obj) return obj;

  let isDaily = !!obj.is_daily;
  let dailyStatus = 'active';
  let dailyGroupId = null;
  let description = obj.description || '';

  if (description) {
    const metaMatch = description.match(/<!--TASKFLOW_DAILY:(.*?)-->/);
    if (metaMatch) {
      try {
        const meta = JSON.parse(metaMatch[1]);
        isDaily = !!meta.isDaily;
        dailyStatus = meta.dailyStatus || 'active';
        dailyGroupId = meta.dailyGroupId || null;
        description = description.replace(/<!--TASKFLOW_DAILY:.*?-->/g, '').trimEnd();
      } catch (e) {
        // Ignore parse error
      }
    }
  }

  return {
    ...obj,
    description,
    isDaily,
    dailyStatus,
    dailyGroupId,
    assignedTo: obj.assigned_to,
    assignedBy: obj.assigned_by,
    deadlineDate: obj.deadline_date,
    deadlineTime: obj.deadline_time,
    createdAt: obj.created_at,
    completedAt: obj.completed_at,
  };
}
