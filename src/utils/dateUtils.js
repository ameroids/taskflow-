// Lightweight date helpers — no external date library required.

const pad = (n) => String(n).padStart(2, '0');

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDaysISO(days, base = new Date()) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Combine an ISO date (yyyy-mm-dd) and time (HH:mm) into a Date object.
export function combineDateTime(dateISO, time) {
  if (!dateISO) return null;
  const [h, m] = (time || '18:00').split(':').map(Number);
  const [y, mo, da] = dateISO.split('-').map(Number);
  return new Date(y, (mo || 1) - 1, da || 1, h || 0, m || 0);
}

export function isPastDeadline(dateISO, time) {
  const d = combineDateTime(dateISO, time);
  if (!d) return false;
  return d.getTime() < Date.now();
}

export function formatDate(dateISO) {
  if (!dateISO) return '—';
  const d = combineDateTime(dateISO, '00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(dateISO) {
  if (!dateISO) return '—';
  const d = combineDateTime(dateISO, '00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTime(time) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${pad(m)} ${period}`;
}

export function formatDateTime(dateISO, time) {
  return `${formatDateShort(dateISO)}, ${formatTime(time)}`;
}

export function formatRelativeTimestamp(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

export function isSameDay(dateISO, otherISO = todayISO()) {
  return dateISO === otherISO;
}

export function isWithinDays(dateISO, days) {
  const d = combineDateTime(dateISO, '00:00');
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = (d - start) / 86400000;
  return diff <= 0 && diff > -days;
}

export function startOfWeekISO(base = new Date()) {
  const d = new Date(base);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1; // week starts Monday
  d.setDate(d.getDate() - diff);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function startOfMonthISO(base = new Date()) {
  const d = new Date(base);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
}
