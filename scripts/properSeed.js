import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// We need the SERVICE_ROLE_KEY to bypass rate limits and create users administratively
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const seedUsers = [
  { name: 'SMS Admin', username: 'admin', password: 'sms515253', role: 'admin', title: 'Operations Supervisor', status: 'active', color: '#3F5CF5' },
  { name: 'Husain', username: 'husain', password: 'sms001', role: 'employee', title: '', status: 'active', color: '#B5650A' },
  { name: 'Zainab', username: 'zainab', password: 'sms002', role: 'employee', title: '', status: 'active', color: '#12805C' },
  { name: 'Mariya', username: 'mariya', password: 'sms003', role: 'employee', title: '', status: 'active', color: '#C0301D' },
  { name: 'Taha', username: 'taha', password: 'sms004', role: 'employee', title: '', status: 'active', color: '#6A82F8' },
  { name: 'Alefiya', username: 'alefiya', password: 'sms005', role: 'employee', title: '', status: 'active', color: '#8A90A0' },
];

const DOMAIN = '@taskflow.local';

async function seed() {
  console.log('Seeding Supabase Database using Admin API...');

  // 1. Clean up old users in public.users to allow recreating
  console.log('Cleaning up old records...');
  await supabaseAdmin.from('users').delete().neq('username', 'xxx'); // delete all

  for (const user of seedUsers) {
    const email = `${user.username}${DOMAIN}`;
    console.log(`Processing ${user.username}...`);

    // 2. Check if auth user exists, if so delete it so we can recreate it cleanly
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find(u => u.email === email);
    if (existing) {
      await supabaseAdmin.auth.admin.deleteUser(existing.id);
    }

    // 3. Create auth user properly via Admin API (bypasses rate limits and properly hashes)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: user.password,
      email_confirm: true,
    });

    if (authError) {
      console.error(`❌ Failed to create auth user ${user.username}:`, authError.message);
      continue;
    }

    const userId = authData.user.id;

    // 4. Create public profile
    const { error: profileError } = await supabaseAdmin.from('users').insert({
      id: userId,
      name: user.name,
      username: user.username,
      role: user.role,
      title: user.title || '',
      status: user.status,
      color: user.color,
    });

    if (profileError) {
      console.error(`❌ Failed to create profile for ${user.username}:`, profileError.message);
    } else {
      console.log(`✅ Successfully seeded: ${user.username}`);
    }
  }

  console.log('\nSeed process complete!');
}

seed();
