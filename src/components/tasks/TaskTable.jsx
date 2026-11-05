import { MoreHorizontal, Pencil, Trash2, Calendar, Repeat, StopCircle, PlayCircle, ChevronDown, ChevronRight, History } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import Avatar from '../ui/Avatar';
import EmptyState from '../ui/EmptyState';
import { getDerivedStatus, sortTasksByUrgency } from '../../utils/taskUtils';
import { formatDateShort, formatTime } from '../../utils/dateUtils';
import { ListChecks } from 'lucide-react';

function RowMenu({ task, onEdit, onDelete, onExtend, onStopDaily, onResumeDaily }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  return (
    <div className="relative" ref={ref} onClick={(e) => e.stopPropagation()}>
      <button className="p-1.5 rounded-md text-text-muted hover:bg-canvas hover:text-text-primary" onClick={() => setOpen((o) => !o)}>
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 card shadow-pop py-1 z-10 animate-fadeIn">
          {task?.isDaily && onStopDaily && task.dailyStatus !== 'stopped' && (
            <button
              onClick={() => { setOpen(false); onStopDaily(task); }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-danger-600 hover:bg-danger-50"
            >
              <StopCircle size={13} /> Stop Daily Recurrence
            </button>
          )}
          {task?.isDaily && onResumeDaily && task.dailyStatus === 'stopped' && (
            <button
              onClick={() => { setOpen(false); onResumeDaily(task); }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-brand-600 hover:bg-brand-50"
            >
              <PlayCircle size={13} /> Resume Daily Recurrence
            </button>
          )}
          {onExtend && (
            <button onClick={() => { setOpen(false); onExtend(task); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-text-secondary hover:bg-canvas hover:text-text-primary">
              <Calendar size={13} /> Extend Deadline
            </button>
          )}
          {onEdit && (
            <button onClick={() => { setOpen(false); onEdit(task); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-text-secondary hover:bg-canvas hover:text-text-primary">
              <Pencil size={13} /> Edit
            </button>
          )}
          {onDelete && (
            <button onClick={() => { setOpen(false); onDelete(task); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-danger-600 hover:bg-danger-50">
              <Trash2 size={13} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function TaskTable({ tasks, getUser, onRowClick, onEdit, onDelete, onExtend, onStopDaily, onResumeDaily, showUser = true }) {
  const [expandedRows, setExpandedRows] = useState({});
  const sorted = sortTasksByUrgency(tasks);

  const toggleRow = (e, taskId) => {
    e.stopPropagation();
    setExpandedRows((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  if (sorted.length === 0) {
    return <EmptyState icon={ListChecks} title="No tasks match these filters" description="Try adjusting your search or filters." />;
  }

  return (
    <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0 scrollbar-thin">
      <table className="w-full min-w-[680px] text-left">
        <thead>
          <tr className="text-[11px] sm:text-[11.5px] uppercase tracking-wide text-text-muted border-b border-border">
            <th className="font-medium px-3 sm:px-3 py-2.5">Task</th>
            {showUser && <th className="font-medium px-2.5 sm:px-3 py-2.5">Assigned to</th>}
            <th className="font-medium px-2.5 sm:px-3 py-2.5">Deadline</th>
            <th className="font-medium px-2.5 sm:px-3 py-2.5">Priority</th>
            <th className="font-medium px-2.5 sm:px-3 py-2.5">Status</th>
            <th className="font-medium px-2 py-2.5 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => {
            const user = getUser?.(t.assignedTo);
            const status = getDerivedStatus(t);
            const instances = t.instances || (t.isDaily ? [t] : null);
            const hasHistory = instances && instances.length > 1;
            const isExpanded = !!expandedRows[t.id];

            return (
              <tr key={t.id} className="border-b border-border-soft last:border-0 group">
                <td colSpan={showUser ? 6 : 5} className="p-0">
                  <div
                    onClick={() => onRowClick(t)}
                    className="flex items-center hover:bg-canvas/70 cursor-pointer transition-colors"
                  >
                    {/* Task Title Column */}
                    <div className="px-3 sm:px-3 py-3 flex-1 min-w-[200px] max-w-[280px]">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {hasHistory && (
                          <button
                            type="button"
                            onClick={(e) => toggleRow(e, t.id)}
                            className="p-1 rounded hover:bg-border-soft text-text-muted hover:text-text-primary transition-colors shrink-0"
                            title="Expand daily history"
                          >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                        )}
                        <p className="text-[13px] sm:text-[13.5px] font-medium text-text-primary truncate">{t.title}</p>
                        {t.isDaily && (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                            t.dailyStatus === 'stopped'
                              ? 'bg-canvas text-text-muted border border-border'
                              : 'bg-brand-50 text-brand-600 border border-brand-500/20'
                          }`}>
                            <Repeat size={10} /> {t.dailyStatus === 'stopped' ? 'Daily · Stopped' : 'Daily'}
                          </span>
                        )}
                        {hasHistory && (
                          <span
                            onClick={(e) => toggleRow(e, t.id)}
                            className="text-[10px] font-medium bg-canvas text-brand-600 border border-border px-1.5 py-0.5 rounded cursor-pointer hover:bg-brand-50 shrink-0"
                          >
                            {instances.length} days
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] sm:text-[12px] text-text-muted truncate ml-0 sm:ml-0">{t.description}</p>
                    </div>

                    {/* Assigned User Column */}
                    {showUser && (
                      <div className="px-2.5 sm:px-3 py-3 w-40 shrink-0">
                        {user ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={user.name} color={user.color} size="sm" />
                            <span className="text-[12.5px] sm:text-[13px] text-text-secondary whitespace-nowrap">{user.name}</span>
                          </div>
                        ) : <span className="text-text-muted text-[12px]">Unassigned</span>}
                      </div>
                    )}

                    {/* Deadline Column */}
                    <div className="px-2.5 sm:px-3 py-3 whitespace-nowrap w-28 shrink-0">
                      <p className="text-[12.5px] sm:text-[13px] text-text-secondary">{formatDateShort(t.deadlineDate)}</p>
                      <p className="text-[11px] sm:text-[11.5px] text-text-muted">{formatTime(t.deadlineTime)}</p>
                    </div>

                    {/* Priority Column */}
                    <div className="px-2.5 sm:px-3 py-3 w-20 shrink-0">
                      <PriorityBadge priority={t.priority} size="sm" />
                    </div>

                    {/* Status Column */}
                    <div className="px-2.5 sm:px-3 py-3 w-28 shrink-0">
                      <StatusBadge status={status} size="sm" />
                    </div>

                    {/* Row Menu Column */}
                    <div className="px-2 py-3 w-10 shrink-0">
                      {(onEdit || onDelete || onExtend || onStopDaily || onResumeDaily) && (
                        <RowMenu
                          task={t}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onExtend={onExtend}
                          onStopDaily={onStopDaily}
                          onResumeDaily={onResumeDaily}
                        />
                      )}
                    </div>
                  </div>

                  {/* Expanded Dropdown of Daily Task Instances */}
                  {isExpanded && instances && (
                    <div className="bg-canvas/70 border-t border-border-soft px-4 sm:px-8 py-3 space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <History size={13} /> Daily history & schedule logs ({instances.length} days total)
                        </span>
                        <span>Click any day to view notes or update</span>
                      </div>
                      <div className="divide-y divide-border-soft/60 rounded-lg border border-border bg-surface overflow-hidden">
                        {instances.map((inst, idx) => {
                          const instStatus = getDerivedStatus(inst);
                          return (
                            <div
                              key={inst.id || `${inst.date}-${idx}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onRowClick(inst);
                              }}
                              className="px-3 py-2 flex items-center justify-between hover:bg-canvas/80 cursor-pointer text-[12px] transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="font-mono text-text-secondary font-medium">
                                  {formatDateShort(inst.date || inst.deadlineDate)}
                                </span>
                                <span className="text-text-muted text-[11px]">Due {formatTime(inst.deadlineTime)}</span>
                                {inst.note && (
                                  <span className="text-[11.5px] text-text-muted truncate max-w-[200px]">
                                    — "{inst.note}"
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
