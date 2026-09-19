import { supabase } from './supabase';

const DOMAIN = '@taskflow.local';

export async function login(username, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: username.trim().toLowerCase() + DOMAIN,
    password: password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Incorrect username or password.');
    }
    throw new Error(error.message);
  }

  return { id: data.user.id };
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (data?.session) {
    return { id: data.session.user.id };
  }
  return null;
}
