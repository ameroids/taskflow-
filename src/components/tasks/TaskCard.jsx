import { useState } from 'react';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import { getDerivedStatus } from '../../utils/taskUtils';
import { formatDateShort, formatTime } from '../../utils/dateUtils';
import { Clock, Repeat, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export default function TaskCard({ task, onClick, onSelectInstance }) {
  const [expanded, setExpanded] = useState(false);
  const status = getDerivedStatus(task);
  const instances = task.instances || (task.isDaily ? [task] : null);
  const hasHistory = instances && instances.length > 1;

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleInstanceClick = (e, inst) => {
    e.stopPropagation();
    if (onSelectInstance) {
      onSelectInstance(inst);
    } else if (onClick) {
      onClick(inst);
    }
  };

  return (
    <div className="card hover:border-brand-400/50 hover:shadow-pop transition-all group overflow-hidden">
      <div
        onClick={() => onClick?.(task)}
        className="w-full text-left p-4 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-medium text-text-primary group-hover:text-brand-600 transition-colors truncate">
                {task.title}
              </p>
              {task.isDaily && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                    task.dailyStatus === 'stopped'
                      ? 'bg-canvas text-text-muted border border-border'
                      : 'bg-brand-50 text-brand-600 border border-brand-500/20'
                  }`}
                >
                  <Repeat size={10} /> {task.dailyStatus === 'stopped' ? 'Stopped' : 'Daily'}
                </span>
              )}
            </div>
            {task.description && (
              <p className="text-[12.5px] text-text-secondary mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
          <StatusBadge status={status} size="sm" />
        </div>

        <div className="flex items-center justify-between gap-3 mt-3">
          <div className="flex items-center gap-2.5">
            <PriorityBadge priority={task.priority} size="sm" />
            <span className="inline-flex items-center gap-1 text-[12px] text-text-muted">
              <Clock size={12.5} /> {formatDateShort(task.deadlineDate)}, {formatTime(task.deadlineTime)}
            </span>
          </div>

          {/* If daily task has multiple runs, provide dropdown toggle */}
          {hasHistory && (
            <button
              type="button"
              onClick={handleToggleExpand}
              className="inline-flex items-center gap-1 text-[11.5px] font-medium text-brand-600 hover:text-brand-700 bg-brand-50/80 hover:bg-brand-100/80 border border-brand-500/20 px-2 py-1 rounded-md transition-colors"
            >
              <span>{instances.length} days</span>
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>
      </div>

      {/* Daily Task History Dropdown List */}
      {expanded && instances && (
        <div className="border-t border-border-soft bg-canvas/60 px-3 py-2.5 space-y-1.5 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] font-medium text-text-muted px-1 pb-1">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> Daily schedule records ({instances.length} days)
            </span>
            <span>Status</span>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {instances.map((inst, idx) => {
              const instStatus = getDerivedStatus(inst);
              return (
                <div
                  key={inst.id || `${inst.date}-${idx}`}
                  onClick={(e) => handleInstanceClick(e, inst)}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface hover:bg-brand-50/40 border border-border-soft hover:border-brand-500/30 cursor-pointer text-[12px] transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] font-mono text-text-muted">
                      {formatDateShort(inst.date || inst.deadlineDate)}
                    </span>
                    <span className="text-text-muted text-[10.5px]">({formatTime(inst.deadlineTime)})</span>
                    {inst.note && (
                      <span className="text-[11px] text-text-secondary truncate max-w-[120px]">
                        · {inst.note}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={instStatus} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
