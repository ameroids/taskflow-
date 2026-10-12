
import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { PRIORITY_OPTIONS } from '../../utils/taskUtils';
import { todayISO } from '../../utils/dateUtils';

const emptyForm = {
  title: '',
  description: '',
  assignedTo: '',
  date: todayISO(),
  deadlineDate: todayISO(),
  deadlineTime: '18:00',
  priority: 'Medium',
};

export default function TaskFormModal({ open, onClose, onSubmit, users, initialTask, currentUser }) {
  const [form, setForm] = useState(emptyForm);
  const [isDaily, setIsDaily] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isEmployee = currentUser && currentUser.role === 'employee';

  useEffect(() => {
    if (open) {
      if (initialTask) {
        setForm({
          title: initialTask.title,
          description: initialTask.description,
          assignedTo: initialTask.assignedTo,
          date: initialTask.date,
          deadlineDate: initialTask.deadlineDate,
          deadlineTime: initialTask.deadlineTime,
          priority: initialTask.priority,
        });
        setIsDaily(!!initialTask.isDaily);
      } else {
        const defaultAssignee = isEmployee
          ? currentUser.id
          : users?.[0]?.id || '';
        setForm({ ...emptyForm, assignedTo: defaultAssignee });
        setIsDaily(false);
      }
      setErrors({});
    }
  }, [open, initialTask, users, currentUser, isEmployee]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (!form.assignedTo) errs.assignedTo = 'Select a team member.';
    if (!form.date) errs.date = 'Required.';
    if (!form.deadlineDate) errs.deadlineDate = 'Required.';
    if (!form.deadlineTime) errs.deadlineTime = 'Required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await onSubmit({ ...form, isDaily });
    setSaving(false);
  };

  const activeUsers = (users || []).filter((u) => u.status === 'active');

  const modalTitle = initialTask
    ? 'Edit task'
    : isEmployee
    ? 'Create your task'
    : 'Create task';

  const modalSubtitle = initialTask
    ? 'Update the details below.'
    : isEmployee
    ? 'Add a task to your workspace. Admin will also be able to view and track it.'
    : 'Assign a new task to a team member.';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalTitle}
      subtitle={modalSubtitle}
      width="max-w-xl"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose} type="button">Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : initialTask ? 'Save changes' : 'Create task'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Task title</label>
          <input
            className="input"
            placeholder="e.g. Prepare daily sales report"
            value={form.title}
            onChange={set('title')}
          />
          {errors.title && <p className="text-[12px] text-danger-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input min-h-[80px] resize-none"
            placeholder="Add details the assignee will need…"
            value={form.description}
            onChange={set('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Assign to</label>
            {isEmployee ? (
              <div className="input bg-canvas text-text-primary flex items-center justify-between text-[13px] py-2">
                <span>{currentUser.name}</span>
                <span className="text-[11px] font-medium bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded">You</span>
              </div>
            ) : (
              <select className="input" value={form.assignedTo} onChange={set('assignedTo')}>
                <option value="" disabled>Select team member</option>
                {activeUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            )}
            {errors.assignedTo && <p className="text-[12px] text-danger-500 mt-1">{errors.assignedTo}</p>}
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="input" value={form.priority} onChange={set('priority')}>
              {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Task date</label>
            <input type="date" className="input" value={form.date} onChange={set('date')} />
            {errors.date && <p className="text-[12px] text-danger-500 mt-1">{errors.date}</p>}
          </div>
          <div>
            <label className="label">Deadline date</label>
            <input type="date" className="input" value={form.deadlineDate} onChange={set('deadlineDate')} />
            {errors.deadlineDate && <p className="text-[12px] text-danger-500 mt-1">{errors.deadlineDate}</p>}
          </div>
          <div>
            <label className="label">Deadline time</label>
            <input type="time" className="input" value={form.deadlineTime} onChange={set('deadlineTime')} />
            {errors.deadlineTime && <p className="text-[12px] text-danger-500 mt-1">{errors.deadlineTime}</p>}
          </div>
        </div>

        {!initialTask && (
          <div className="pt-2 border-t border-border-soft">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-border text-brand-500 focus:ring-brand-500 mt-0.5 h-4 w-4"
                checked={isDaily}
                onChange={(e) => setIsDaily(e.target.checked)}
              />
              <div>
                <span className="text-[13.5px] text-text-primary font-medium block">
                  Daily task (repeats daily until stopped)
                </span>
                <span className="text-[12px] text-text-secondary block mt-0.5">
                  This task will appear for the user every day until stopped.
                </span>
              </div>
            </label>
          </div>
        )}
      </form>
    </Modal>
  );
}
