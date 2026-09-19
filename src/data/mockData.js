import { addDaysISO, todayISO } from '../utils/dateUtils';

// --- Demo users -------------------------------------------------------
// In the Supabase version, `password` disappears entirely — Supabase Auth
// owns credentials and this table only stores profile fields.
export const seedUsers = [
  {
    id: 'u-admin',
    name: 'SMS Admin',
    username: 'admin',
    password: 'sms515253',
    role: 'admin',
    title: 'Operations Supervisor',
    status: 'active',
    color: '#3F5CF5',
    createdAt: '2026-01-06T09:00:00.000Z',
  },
  {
    id: 'u-1',
    name: 'Husain',
    username: 'husain',
    password: 'sms001',
    role: 'employee',
    title: '',
    status: 'active',
    color: '#B5650A',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'u-2',
    name: 'Zainab',
    username: 'zainab',
    password: 'sms002',
    role: 'employee',
    title: '',
    status: 'active',
    color: '#12805C',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'u-3',
    name: 'Mariya',
    username: 'mariya',
    password: 'sms003',
    role: 'employee',
    title: '',
    status: 'active',
    color: '#C0301D',
    createdAt: '2026-01-14T09:00:00.000Z',
  },
  {
    id: 'u-4',
    name: 'Taha',
    username: 'taha',
    password: 'sms004',
    role: 'employee',
    title: '',
    status: 'active',
    color: '#6A82F8',
    createdAt: '2026-02-02T09:00:00.000Z',
  },
  {
    id: 'u-5',
    name: 'Alefiya',
    username: 'alefiya',
    password: 'sms005',
    role: 'employee',
    title: '',
    status: 'active',
    color: '#8A90A0',
    createdAt: '2026-02-18T09:00:00.000Z',
  },
];

const today = todayISO();
const y = addDaysISO(-1);
const y2 = addDaysISO(-2);
const y3 = addDaysISO(-3);
const t1 = addDaysISO(1);
const t2 = addDaysISO(2);
const t3 = addDaysISO(3);

let counter = 1;
const id = () => `t-${counter++}`;

export const seedTasks = [];
