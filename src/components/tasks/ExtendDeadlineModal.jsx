import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

export default function ExtendDeadlineModal({ open, onClose, task, onConfirm }) {
  const [newDate, setNewDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && task) {
      setNewDate(task.deadlineDate);
    }
  }, [open, task]);

  const handleSubmit = async () => {
    setSaving(true);
    await onConfirm(task.id, newDate);
    setSaving(false);
    onClose();
  };

  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose} title="Extend Deadline" width="max-w-sm">
      <div className="space-y-4">
        <p className="text-[13.5px] text-text-secondary">Select a new deadline date for "{task.title}".</p>
        <div>
          <label className="label">New Deadline Date</label>
          <input
            type="date"
            className="input"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={saving || !newDate || newDate === task.deadlineDate}
          >
            {saving ? 'Saving...' : 'Extend'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
