import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import { getDerivedStatus } from '../../utils/taskUtils';
import { formatDateShort, formatTime } from '../../utils/dateUtils';
import { Clock } from 'lucide-react';

export default function TaskCard({ task, onClick }) {
  const status = getDerivedStatus(task);
  return (
    <button
      onClick={onClick}
      className="w-full text-left card p-4 hover:border-brand-400/50 hover:shadow-pop transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-text-primary group-hover:text-brand-600 transition-colors truncate">{task.title}</p>
          {task.description && <p className="text-[12.5px] text-text-secondary mt-1 line-clamp-2">{task.description}</p>}
        </div>
        <StatusBadge status={status} size="sm" />
      </div>
      <div className="flex items-center gap-3 mt-3">
        <PriorityBadge priority={task.priority} size="sm" />
        <span className="inline-flex items-center gap-1 text-[12px] text-text-muted">
          <Clock size={12.5} /> {formatDateShort(task.deadlineDate)}, {formatTime(task.deadlineTime)}
        </span>
      </div>
    </button>
  );
}
