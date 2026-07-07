import { CheckCircle, Info, WarningCircle, X } from '@phosphor-icons/react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/utils/cn';

const ICONS = {
  success: CheckCircle,
  error: WarningCircle,
  info: Info,
};

const TONES = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-stone-200 bg-white text-stone-800',
};

const ToastContainer = () => {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex w-full max-w-sm flex-col gap-2 print:hidden">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-lg',
              TONES[toast.type] || TONES.info
            )}
          >
            <Icon size={18} className="mt-0.5 flex-shrink-0" weight="fill" />
            <p className="flex-1">{toast.message}</p>
            <button
              type="button"
              aria-label="Đóng thông báo"
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
