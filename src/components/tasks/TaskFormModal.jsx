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

export default function TaskFormModal({ open, onClose, onSubmit, users, initialTask }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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
      } else {
        setForm({ ...emptyForm, assignedTo: users?.[0]?.id || '' });
      }
      setErrors({});
    }
  }, [open, initialTask, users]);

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
    await onSubmit(form);
    setSaving(false);
  };

  const activeUsers = (users || []).filter((u) => u.status === 'active');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialTask ? 'Edit task' : 'Create task'}
      subtitle={initialTask ? 'Update the details below.' : 'Assign a new task to a team member.'}
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
          <input className="input" placeholder="e.g. Prepare daily sales report" value={form.title} onChange={set('title')} />
          {errors.title && <p className="text-[12px] text-danger-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[80px] resize-none" placeholder="Add details the assignee will need…" value={form.description} onChange={set('description')} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Assign to</label>
            <select className="input" value={form.assignedTo} onChange={set('assignedTo')}>
              <option value="" disabled>Select team member</option>
              {activeUsers.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
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
      </form>
    </Modal>
  );
}
