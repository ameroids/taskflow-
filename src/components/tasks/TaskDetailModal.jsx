import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import Avatar from '../ui/Avatar';
import { getDerivedStatus } from '../../utils/taskUtils';
import { formatDate, formatDateTime, formatRelativeTimestamp } from '../../utils/dateUtils';
import { CheckCircle2, XCircle, Pencil, Trash2, RotateCcw, Calendar, Clock, Repeat, StopCircle, PlayCircle } from 'lucide-react';

export default function TaskDetailModal({
  open,
  onClose,
  task,
  user,
  role, // 'admin' | 'employee'
  onUpdateStatus, // (id, patch) => Promise
  onEdit,
  onDelete,
  onExtend,
  onStopDaily,
  onResumeDaily,
}) {
  const [mode, setMode] = useState(null); // 'complete' | 'not_completed' | null
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) { setMode(null); setText(''); }
  }, [open, task?.id]);

  if (!task) return null;
  const status = getDerivedStatus(task);

  const submitStatus = async (newStatus) => {
    setSaving(true);
    const patch = newStatus === 'completed'
      ? { status: 'completed', note: text, completedAt: new Date().toISOString(), reason: '' }
      : { status: 'not_completed', reason: text, note: '' };
    await onUpdateStatus(task.id, patch);
    setSaving(false);
    setMode(null);
    setText('');
    onClose();
  };

  const reopen = async () => {
    setSaving(true);
    await onUpdateStatus(task.id, { status: 'pending', note: '', reason: '', completedAt: '' });
    setSaving(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={task.title} width="max-w-lg">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={status} />
          <PriorityBadge priority={task.priority} />
          {task.isDaily && (
            task.dailyStatus === 'stopped' ? (
              <span className="inline-flex items-center gap-1 text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-canvas border border-border text-text-muted">
                <StopCircle size={12} /> Daily (Stopped)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11.5px] font-medium px-2 py-0.5 rounded-full bg-brand-50 border border-brand-500/20 text-brand-600">
                <Repeat size={12} /> Daily task
              </span>
            )
          )}
        </div>

        {task.description && (
          <p className="text-[13.5px] text-text-secondary leading-relaxed">{task.description}</p>
        )}

        <div className="grid grid-cols-2 gap-3 text-[13px]">
          {user && (
            <div className="flex items-center gap-2 col-span-2">
              <Avatar name={user.name} color={user.color} size="sm" />
              <div className="leading-tight">
                <p className="font-medium text-text-primary">{user.name}</p>
                <p className="text-[11.5px] text-text-muted">{user.title || (role === 'admin' ? 'Team member' : 'You')}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar size={14} className="text-text-muted" /> {formatDate(task.date)}
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Clock size={14} className="text-text-muted" /> Due {formatDateTime(task.deadlineDate, task.deadlineTime)}
          </div>
        </div>

        {task.isDaily && (
          <div className={`rounded-lg p-3 border flex items-center justify-between gap-3 ${
            task.dailyStatus === 'stopped'
              ? 'bg-canvas border-border text-text-secondary'
              : 'bg-brand-50/40 border-brand-500/20'
          }`}>
            <div className="text-[12.5px] min-w-0">
              <p className={`font-medium ${task.dailyStatus === 'stopped' ? 'text-text-primary' : 'text-brand-700'}`}>
                {task.dailyStatus === 'stopped' ? 'Daily recurrence stopped' : 'Repeats daily'}
              </p>
              <p className="text-[11.5px] text-text-muted truncate">
                {task.dailyStatus === 'stopped'
                  ? 'No future daily tasks will be scheduled.'
                  : 'Repeats every day until stopped.'}
              </p>
            </div>
            {task.dailyStatus === 'stopped' ? (
              onResumeDaily && (
                <button
                  className="btn-secondary text-[12px] shrink-0"
                  onClick={() => onResumeDaily(task)}
                >
                  <PlayCircle size={13} className="text-brand-500" /> Resume daily
                </button>
              )
            ) : (
              onStopDaily && (
                <button
                  className="btn-secondary text-[12px] text-danger-600 border-danger-500/20 hover:bg-danger-50 shrink-0"
                  onClick={() => onStopDaily(task)}
                >
                  <StopCircle size={13} /> Stop daily task
                </button>
              )
            )}
          </div>
        )}

        {task.status === 'completed' && (
          <div className="rounded-lg bg-success-50 border border-success-500/15 p-3">
            <p className="text-[12px] font-medium text-success-600">Completed {formatRelativeTimestamp(task.completedAt)}</p>
            {task.note && <p className="text-[13px] text-text-primary mt-1">{task.note}</p>}
          </div>
        )}
        {task.status === 'not_completed' && (
          <div className="rounded-lg bg-danger-50 border border-danger-500/15 p-3">
            <p className="text-[12px] font-medium text-danger-600">Marked not completed</p>
            {task.reason && <p className="text-[13px] text-text-primary mt-1">{task.reason}</p>}
          </div>
        )}

        {role === 'employee' && status !== 'completed' && status !== 'not_completed' && (
          <div className="border-t border-border-soft pt-4">
            {mode === null && (
              <div className="flex flex-col sm:flex-row gap-2">
                <button className="btn-primary flex-1" onClick={() => setMode('complete')}>
                  <CheckCircle2 size={15} /> Mark as completed
                </button>
                <button className="btn-secondary flex-1" onClick={() => setMode('not_completed')}>
                  <XCircle size={15} /> Mark as not completed
                </button>
              </div>
            )}
            {mode === 'complete' && (
              <div className="space-y-2">
                <label className="label">Add a note (optional)</label>
                <textarea className="input min-h-[70px] resize-none" placeholder="Anything the supervisor should know…" value={text} onChange={(e) => setText(e.target.value)} />
                <div className="flex justify-end gap-2">
                  <button className="btn-ghost" onClick={() => setMode(null)}>Back</button>
                  <button className="btn-primary" disabled={saving} onClick={() => submitStatus('completed')}>
                    {saving ? 'Saving…' : 'Confirm completed'}
                  </button>
                </div>
              </div>
            )}
            {mode === 'not_completed' && (
              <div className="space-y-2">
                <label className="label">Reason it wasn't completed</label>
                <textarea className="input min-h-[70px] resize-none" placeholder="Explain what happened…" value={text} onChange={(e) => setText(e.target.value)} />
                <div className="flex justify-end gap-2">
                  <button className="btn-ghost" onClick={() => setMode(null)}>Back</button>
                  <button className="btn-danger" disabled={saving || !text.trim()} onClick={() => submitStatus('not_completed')}>
                    {saving ? 'Saving…' : 'Confirm not completed'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {role === 'employee' && (status === 'completed' || status === 'not_completed') && (
          <button className="btn-ghost text-[12.5px]" onClick={reopen} disabled={saving}>
            <RotateCcw size={13} /> Reopen task
          </button>
        )}

        {/* Action buttons (Admin or Employee editing/deleting own task) */}
        {(role === 'admin' || onEdit || onDelete) && (
          <div className="border-t border-border-soft pt-4 flex items-center gap-2">
            {role === 'admin' && onExtend && (
              <button className="btn-secondary flex-1" onClick={() => onExtend(task)}>
                <Calendar size={14} /> Extend
              </button>
            )}
            {onEdit && (
              <button className="btn-secondary flex-1" onClick={() => onEdit(task)}>
                <Pencil size={14} /> Edit
              </button>
            )}
            {onDelete && (
              <button className="btn-danger flex-1" onClick={() => onDelete(task)}>
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
