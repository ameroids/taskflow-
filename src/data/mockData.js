import { addDaysISO, todayISO } from '../utils/dateUtils';

// --- Demo users -------------------------------------------------------
// In the Supabase version, `password` disappears entirely — Supabase Auth
// owns credentials and this table only stores profile fields.
export const seedUsers = [
  {
    id: 'u-admin',
    name: 'SMS Admin',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    title: 'Operations Supervisor',
    status: 'active',
    color: '#3F5CF5',
    createdAt: '2026-01-06T09:00:00.000Z',
  },
  {
    id: 'u-1',
    name: 'Taha',
    username: 'taha',
    password: 'user123',
    role: 'employee',
    title: '',
    status: 'active',
    color: '#B5650A',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'u-2',
    name: 'Husain',
    username: 'husain',
    password: 'user123',
    role: 'employee',
    title: '',
    status: 'active',
    color: '#12805C',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'u-3',
    name: 'Ammar',
    username: 'ammar',
    password: 'user123',
    role: 'employee',
    title: '',
    status: 'active',
    color: '#C0301D',
    createdAt: '2026-01-14T09:00:00.000Z',
  },
  {
    id: 'u-4',
    name: 'Shabbir',
    username: 'shabbir',
    password: 'user123',
    role: 'employee',
    title: '',
    status: 'active',
    color: '#6A82F8',
    createdAt: '2026-02-02T09:00:00.000Z',
  },
  {
    id: 'u-5',
    name: 'Mustafa',
    username: 'mustafa',
    password: 'user123',
    role: 'employee',
    title: '',
    status: 'inactive',
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

export const seedTasks = [
  // Arjun Mehta
  { id: id(), title: 'Prepare daily sales report', description: 'Compile yesterday\'s regional sales figures into the standard report template and share with the leadership channel.', assignedTo: 'u-1', assignedBy: 'u-admin', date: today, deadlineDate: today, deadlineTime: '17:00', priority: 'High', status: 'pending', createdAt: `${today}T09:00:00.000Z`, note: '', reason: '' },
  { id: id(), title: 'Follow up with 12 leads from webinar', description: 'Call or email the leads captured during Tuesday\'s product webinar and log outcomes in the CRM.', assignedTo: 'u-1', assignedBy: 'u-admin', date: today, deadlineDate: today, deadlineTime: '15:30', priority: 'Medium', status: 'completed', createdAt: `${y}T09:00:00.000Z`, completedAt: `${today}T11:20:00.000Z`, note: '9 of 12 leads reached, 3 voicemails left.', reason: '' },
  { id: id(), title: 'Update client pricing sheet', description: 'Reflect the new Q3 discount tiers agreed with finance.', assignedTo: 'u-1', assignedBy: 'u-admin', date: y, deadlineDate: y, deadlineTime: '16:00', priority: 'Low', status: 'pending', createdAt: `${y2}T09:00:00.000Z`, note: '', reason: '' },
  { id: id(), title: 'Submit weekly expense claims', description: 'Attach receipts for client lunches and travel from this week.', assignedTo: 'u-1', assignedBy: 'u-admin', date: y2, deadlineDate: y2, deadlineTime: '18:00', priority: 'Low', status: 'not_completed', createdAt: `${y3}T09:00:00.000Z`, reason: 'Waiting on one receipt from the vendor, will submit once received.' },
  { id: id(), title: 'Prep proposal for Meridian Corp', description: 'Draft the enterprise proposal deck ahead of Monday\'s call.', assignedTo: 'u-1', assignedBy: 'u-admin', date: t1, deadlineDate: t1, deadlineTime: '12:00', priority: 'High', status: 'pending', createdAt: `${today}T09:00:00.000Z`, note: '', reason: '' },

  // Priya Nair
  { id: id(), title: 'Clear support ticket backlog', description: 'Triage and respond to all tickets older than 24 hours in the support queue.', assignedTo: 'u-2', assignedBy: 'u-admin', date: today, deadlineDate: today, deadlineTime: '13:00', priority: 'High', status: 'completed', createdAt: `${y}T09:00:00.000Z`, completedAt: `${today}T12:40:00.000Z`, note: 'Backlog cleared, 2 tickets escalated to engineering.', reason: '' },
  { id: id(), title: 'Publish updated FAQ page', description: 'Add answers for the five most common questions from this month\'s tickets.', assignedTo: 'u-2', assignedBy: 'u-admin', date: today, deadlineDate: today, deadlineTime: '17:30', priority: 'Medium', status: 'pending', createdAt: `${today}T09:00:00.000Z`, note: '', reason: '' },
  { id: id(), title: 'Customer satisfaction survey review', description: 'Summarize last week\'s CSAT responses and flag any recurring complaints.', assignedTo: 'u-2', assignedBy: 'u-admin', date: y, deadlineDate: y, deadlineTime: '17:00', priority: 'Medium', status: 'completed', createdAt: `${y2}T09:00:00.000Z`, completedAt: `${y}T16:10:00.000Z`, note: 'Shared summary in team channel.', reason: '' },
  { id: id(), title: 'Onboard new support macro templates', description: 'Roll out the revised canned-response templates to the support team.', assignedTo: 'u-2', assignedBy: 'u-admin', date: y2, deadlineDate: y2, deadlineTime: '15:00', priority: 'Low', status: 'pending', createdAt: `${y3}T09:00:00.000Z`, note: '', reason: '' },
  { id: id(), title: 'Escalation review with engineering', description: 'Walk through open P1 tickets with the engineering on-call.', assignedTo: 'u-2', assignedBy: 'u-admin', date: t2, deadlineDate: t2, deadlineTime: '11:00', priority: 'High', status: 'pending', createdAt: `${today}T09:00:00.000Z`, note: '', reason: '' },

  // Rohit Sharma
  { id: id(), title: 'Cycle count — Aisle 4 to 7', description: 'Physical stock count and reconcile against the inventory system.', assignedTo: 'u-3', assignedBy: 'u-admin', date: today, deadlineDate: today, deadlineTime: '14:00', priority: 'High', status: 'pending', createdAt: `${y}T09:00:00.000Z`, note: '', reason: '' },
  { id: id(), title: 'Inbound shipment check-in', description: 'Verify and log the shipment from Global Freight against the purchase order.', assignedTo: 'u-3', assignedBy: 'u-admin', date: y, deadlineDate: y, deadlineTime: '10:00', priority: 'High', status: 'not_completed', createdAt: `${y2}T09:00:00.000Z`, reason: 'Shipment arrived with two pallets missing — flagged to the carrier, awaiting resolution.' },
  { id: id(), title: 'Update forklift maintenance log', description: 'Record this week\'s inspection checklist for both forklifts.', assignedTo: 'u-3', assignedBy: 'u-admin', date: y3, deadlineDate: y3, deadlineTime: '16:00', priority: 'Low', status: 'completed', createdAt: `${addDaysISO(-4)}T09:00:00.000Z`, completedAt: `${y3}T15:30:00.000Z`, note: 'Both units passed inspection.', reason: '' },
  { id: id(), title: 'Prep outbound orders for courier pickup', description: 'Pack and label the 18 orders scheduled for afternoon pickup.', assignedTo: 'u-3', assignedBy: 'u-admin', date: today, deadlineDate: today, deadlineTime: '15:00', priority: 'Medium', status: 'pending', createdAt: `${today}T09:00:00.000Z`, note: '', reason: '' },
  { id: id(), title: 'Warehouse safety walkthrough', description: 'Complete the monthly safety checklist and report any hazards.', assignedTo: 'u-3', assignedBy: 'u-admin', date: t1, deadlineDate: t1, deadlineTime: '09:30', priority: 'Medium', status: 'pending', createdAt: `${today}T09:00:00.000Z`, note: '', reason: '' },

  // Sneha Kapoor
  { id: id(), title: 'Schedule social posts for product launch', description: 'Queue the launch-week content calendar across Instagram and LinkedIn.', assignedTo: 'u-4', assignedBy: 'u-admin', date: today, deadlineDate: today, deadlineTime: '16:30', priority: 'High', status: 'pending', createdAt: `${y}T09:00:00.000Z`, note: '', reason: '' },
  { id: id(), title: 'Analyze last campaign performance', description: 'Pull CTR, CPC, and conversion numbers from the spring campaign.', assignedTo: 'u-4', assignedBy: 'u-admin', date: y, deadlineDate: y, deadlineTime: '18:00', priority: 'Medium', status: 'completed', createdAt: `${y2}T09:00:00.000Z`, completedAt: `${y}T17:15:00.000Z`, note: 'CTR up 14% vs. previous campaign, deck shared.', reason: '' },
  { id: id(), title: 'Coordinate influencer shipment', description: 'Confirm addresses and ship product samples to the three confirmed creators.', assignedTo: 'u-4', assignedBy: 'u-admin', date: y2, deadlineDate: y2, deadlineTime: '12:00', priority: 'Low', status: 'not_completed', reason: 'One creator hasn\'t confirmed their shipping address yet.', createdAt: `${y3}T09:00:00.000Z` },
  { id: id(), title: 'Draft newsletter copy', description: 'Write the monthly customer newsletter, focus on the new feature rollout.', assignedTo: 'u-4', assignedBy: 'u-admin', date: t1, deadlineDate: t1, deadlineTime: '17:00', priority: 'Medium', status: 'pending', createdAt: `${today}T09:00:00.000Z`, note: '', reason: '' },
  { id: id(), title: 'Refresh brand asset library', description: 'Organize and tag this quarter\'s design assets in the shared drive.', assignedTo: 'u-4', assignedBy: 'u-admin', date: t3, deadlineDate: t3, deadlineTime: '17:00', priority: 'Low', status: 'pending', createdAt: `${today}T09:00:00.000Z`, note: '', reason: '' },

  // Karan Verma
  { id: id(), title: 'Reconcile vendor invoices', description: 'Match this month\'s vendor invoices against purchase orders before closing the books.', assignedTo: 'u-5', assignedBy: 'u-admin', date: today, deadlineDate: today, deadlineTime: '17:00', priority: 'High', status: 'pending', createdAt: `${y}T09:00:00.000Z`, note: '', reason: '' },
  { id: id(), title: 'Send overdue payment reminders', description: 'Email the 6 clients with invoices more than 15 days overdue.', assignedTo: 'u-5', assignedBy: 'u-admin', date: y, deadlineDate: y, deadlineTime: '14:00', priority: 'Medium', status: 'completed', createdAt: `${y2}T09:00:00.000Z`, completedAt: `${y}T13:45:00.000Z`, note: 'All 6 reminders sent, 2 replies already received.', reason: '' },
  { id: id(), title: 'Prepare month-end financial summary', description: 'Compile revenue, expenses and outstanding receivables for the leadership review.', assignedTo: 'u-5', assignedBy: 'u-admin', date: y3, deadlineDate: y3, deadlineTime: '18:00', priority: 'High', status: 'not_completed', createdAt: `${addDaysISO(-4)}T09:00:00.000Z`, reason: 'Waiting on the sales team\'s final numbers before the summary can be finalized.' },
];
