import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', tone = 'danger', loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title="" width="max-w-sm">
      <div className="flex flex-col items-start gap-3 -mt-1">
        <span className={`w-10 h-10 rounded-full flex items-center justify-center ${tone === 'danger' ? 'bg-danger-50 text-danger-500' : 'bg-warning-50 text-warning-500'}`}>
          <AlertTriangle size={18} />
        </span>
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary">{title}</h3>
          <p className="text-[13px] text-text-secondary mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-5">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className={tone === 'danger' ? 'btn-danger' : 'btn-primary'} onClick={onConfirm} disabled={loading}>
          {loading ? 'Please wait…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
