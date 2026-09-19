import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
const seedUsers = [
  { id: 'u-admin', name: 'SMS Admin', username: 'admin', password: 'sms515253', role: 'admin', title: 'Operations Supervisor', status: 'active', color: '#3F5CF5' },
  { id: 'u-1', name: 'Husain', username: 'husain', password: 'sms001', role: 'employee', title: '', status: 'active', color: '#B5650A' },
  { id: 'u-2', name: 'Zainab', username: 'zainab', password: 'sms002', role: 'employee', title: '', status: 'active', color: '#12805C' },
  { id: 'u-3', name: 'Mariya', username: 'mariya', password: 'sms003', role: 'employee', title: '', status: 'active', color: '#C0301D' },
  { id: 'u-4', name: 'Taha', username: 'taha', password: 'sms004', role: 'employee', title: '', status: 'active', color: '#6A82F8' },
  { id: 'u-5', name: 'Alefiya', username: 'alefiya', password: 'sms005', role: 'employee', title: '', status: 'active', color: '#8A90A0' },
];

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const DOMAIN = '@taskflow.local';

async function seed() {
  console.log('Seeding Supabase Database...');

  // 1. Seed Users
  for (const user of seedUsers) {
    console.log(`Creating user: ${user.username}...`);
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `${user.username}${DOMAIN}`,
      password: user.password,
    });

    if (authError) {
      console.error(`Failed to create auth user ${user.username}:`, authError.message);
      continue;
    }

    if (!authData.user) {
      console.log(`User ${user.username} might already exist or require email confirmation.`);
      continue;
    }

    // Create public profile
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      title: user.title || '',
      status: user.status,
      color: user.color,
    });

    if (profileError) {
      console.error(`Failed to create profile for ${user.username}:`, profileError.message);
    } else {
      console.log(`✅ Successfully seeded: ${user.username}`);
    }
  }

  console.log('\nSeed process complete!');
  console.log('NOTE: If you cannot log in, make sure you disabled "Confirm email" in your Supabase Auth Providers settings!');
}

seed();
