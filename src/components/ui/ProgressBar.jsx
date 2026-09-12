export default function ProgressBar({ value = 0, className = '', trackClass = 'bg-border-soft', barClass, height = 'h-1.5' }) {
  const pct = Math.max(0, Math.min(100, value));
  const color = barClass || (pct >= 80 ? 'bg-success-500' : pct >= 45 ? 'bg-brand-500' : 'bg-warning-500');
  return (
    <div className={`w-full rounded-full overflow-hidden ${trackClass} ${height} ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
