const SEGMENTS = [
  { key: 'completed', label: 'Completed', color: '#12805C' },
  { key: 'pending', label: 'Pending', color: '#F0AA4E' },
  { key: 'overdue', label: 'Overdue', color: '#C0301D' },
  { key: 'notCompleted', label: 'Not completed', color: '#C7CBD3' },
];

export default function StackedBar({ stats }) {
  const total = stats.total || 1;
  return (
    <div>
      <div className="flex w-full h-2.5 rounded-full overflow-hidden bg-border-soft">
        {SEGMENTS.map((s) => {
          const value = stats[s.key] || 0;
          const pct = (value / total) * 100;
          if (!pct) return null;
          return <div key={s.key} style={{ width: `${pct}%`, backgroundColor: s.color }} className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500" />;
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {SEGMENTS.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-[12px] text-text-secondary">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label} · <span className="font-medium text-text-primary">{stats[s.key] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
