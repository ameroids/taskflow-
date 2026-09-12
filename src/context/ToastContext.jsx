import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: { Icon: CheckCircle2, cls: 'text-success-500' },
  error: { Icon: XCircle, cls: 'text-danger-500' },
  warning: { Icon: AlertTriangle, cls: 'text-warning-500' },
  info: { Icon: Info, cls: 'text-brand-500' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback((message, type = 'success', opts = {}) => {
    const id = ++counter.current;
    setToasts((t) => [...t, { id, message, type, title: opts.title }]);
    setTimeout(() => dismiss(id), opts.duration || 3600);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => {
          const meta = ICONS[t.type] || ICONS.success;
          const { Icon } = meta;
          return (
            <div
              key={t.id}
              className="animate-toastIn card px-3.5 py-3 flex items-start gap-2.5 shadow-pop"
            >
              <Icon size={18} className={`${meta.cls} mt-0.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                {t.title && <p className="text-[13px] font-semibold text-text-primary leading-tight">{t.title}</p>}
                <p className="text-[13px] text-text-secondary leading-snug">{t.message}</p>
              </div>
              <button onClick={() => dismiss(t.id)} className="text-text-muted hover:text-text-primary shrink-0">
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
