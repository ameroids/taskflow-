import { STATUS_META } from '../../utils/taskUtils';

export default function StatusBadge({ status, size = 'md' }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[12px]';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${meta.badge} ${pad}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
