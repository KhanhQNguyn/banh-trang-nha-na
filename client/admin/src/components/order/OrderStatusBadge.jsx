const STATUS_META = {
  pending_confirmation: { label: 'Chờ xử lý', className: 'bg-brand-100 text-brand-700' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-sky-100 text-sky-700' },
  shipping: { label: 'Đang giao', className: 'bg-indigo-100 text-indigo-700' },
  completed: { label: 'Hoàn tất', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-700' },
};

const OrderStatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || { label: status, className: 'bg-stone-100 text-stone-600' };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}>
      {meta.label}
    </span>
  );
};

export default OrderStatusBadge;
