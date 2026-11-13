import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Modal({ open, onClose, title, subtitle, children, footer, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-[2px] animate-fadeIn"
        onClick={onClose}
      />
      <div
        className={`relative bg-surface w-full ${width} rounded-t-2xl sm:rounded-xl shadow-pop animate-slideUp max-h-[92vh] sm:max-h-[90vh] flex flex-col`}
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
        }}
      >
        <div className="flex items-start justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border shrink-0">
          <div className="min-w-0 pr-2">
            <h2 className="text-[15px] font-semibold text-text-primary truncate">{title}</h2>
            {subtitle && <p className="text-[12px] sm:text-[12.5px] text-text-secondary mt-0.5 line-clamp-2">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary hover:bg-canvas rounded-md p-1 -mt-1 -mr-1 shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 overflow-y-auto">{children}</div>
        {footer && <div className="px-4 sm:px-5 py-3 border-t border-border flex items-center justify-end gap-2 shrink-0">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
