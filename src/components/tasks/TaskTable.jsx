import { MoreHorizontal, Pencil, Trash2, Calendar, Repeat, StopCircle, PlayCircle } from 'lucide-react';
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
  const sorted = sortTasksByUrgency(tasks);

  if (sorted.length === 0) {
    return <EmptyState icon={ListChecks} title="No tasks match these filters" description="Try adjusting your search or filters." />;
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full min-w-[760px] text-left">
        <thead>
          <tr className="text-[11.5px] uppercase tracking-wide text-text-muted border-b border-border">
            <th className="font-medium px-4 sm:px-3 py-2.5">Task</th>
            {showUser && <th className="font-medium px-3 py-2.5">Assigned to</th>}
            <th className="font-medium px-3 py-2.5">Deadline</th>
            <th className="font-medium px-3 py-2.5">Priority</th>
            <th className="font-medium px-3 py-2.5">Status</th>
            <th className="font-medium px-3 py-2.5 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => {
            const user = getUser?.(t.assignedTo);
            const status = getDerivedStatus(t);
            return (
              <tr
                key={t.id}
                onClick={() => onRowClick(t)}
                className="border-b border-border-soft last:border-0 hover:bg-canvas/70 cursor-pointer transition-colors"
              >
                <td className="px-4 sm:px-3 py-3 max-w-[280px]">
                  <div className="flex items-center gap-2">
                    <p className="text-[13.5px] font-medium text-text-primary truncate">{t.title}</p>
                    {t.isDaily && (
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                        t.dailyStatus === 'stopped'
                          ? 'bg-canvas text-text-muted border border-border'
                          : 'bg-brand-50 text-brand-600 border border-brand-500/20'
                      }`}>
                        <Repeat size={10} /> {t.dailyStatus === 'stopped' ? 'Daily · Stopped' : 'Daily'}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-text-muted truncate">{t.description}</p>
                </td>
                {showUser && (
                  <td className="px-3 py-3">
                    {user ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={user.name} color={user.color} size="sm" />
                        <span className="text-[13px] text-text-secondary whitespace-nowrap">{user.name}</span>
                      </div>
                    ) : <span className="text-text-muted text-[12.5px]">Unassigned</span>}
                  </td>
                )}
                <td className="px-3 py-3 whitespace-nowrap">
                  <p className="text-[13px] text-text-secondary">{formatDateShort(t.deadlineDate)}</p>
                  <p className="text-[11.5px] text-text-muted">{formatTime(t.deadlineTime)}</p>
                </td>
                <td className="px-3 py-3"><PriorityBadge priority={t.priority} size="sm" /></td>
                <td className="px-3 py-3"><StatusBadge status={status} size="sm" /></td>
                <td className="px-3 py-3">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
