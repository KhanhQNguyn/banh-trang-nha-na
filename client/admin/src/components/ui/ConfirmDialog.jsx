import { useState } from 'react';

/**
 * Minimal confirm dialog for a consequential action (e.g. cancelling an order).
 * When `withReason` is set, captures an optional free-text reason and passes it
 * to onConfirm.
 */
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Xác nhận',
  withReason = false,
  onConfirm,
  onClose,
}) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(withReason ? reason.trim() : undefined);
    } finally {
      setSubmitting(false);
      setReason('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <h3 className="text-base font-semibold text-stone-900">{title}</h3>
        {description && <p className="mt-1.5 text-sm text-stone-600">{description}</p>}

        {withReason && (
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Lý do (không bắt buộc)"
            className="mt-3 w-full resize-none rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
