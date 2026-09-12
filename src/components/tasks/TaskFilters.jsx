import { Search } from 'lucide-react';
import { DISPLAY_STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../utils/taskUtils';

export default function TaskFilters({ filters, setFilters, users, showUserFilter = false }) {
  const update = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
      <div className="relative flex-1 min-w-[180px]">
        <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          className="input pl-8"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={update('search')}
        />
      </div>
      {showUserFilter && (
        <select className="input sm:w-44" value={filters.user} onChange={update('user')}>
          <option value="all">All team members</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      )}
      <select className="input sm:w-40" value={filters.status} onChange={update('status')}>
        <option value="all">All statuses</option>
        {DISPLAY_STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
      <select className="input sm:w-36" value={filters.priority} onChange={update('priority')}>
        <option value="all">All priorities</option>
        {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <input type="date" className="input sm:w-40" value={filters.date} onChange={update('date')} />
    </div>
  );
}
