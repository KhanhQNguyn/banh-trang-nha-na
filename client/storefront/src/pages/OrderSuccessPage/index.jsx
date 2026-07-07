import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from '@phosphor-icons/react';
import { formatCurrency } from '@/utils/formatCurrency';

const PAYMENT_LABELS = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  bank_transfer: 'Chuyển khoản ngân hàng',
};

const OrderSuccessPage = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <CheckCircle size={40} weight="fill" className="mx-auto text-brand-500" />
        <h1 className="mt-4 text-2xl font-bold text-stone-900">Đặt hàng thành công!</h1>
        <p className="mt-2 text-stone-600">Cảm ơn bạn đã đặt hàng tại Bánh Tráng Nhà Na.</p>
        <Link
          to="/order-lookup"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Tra cứu đơn hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <CheckCircle size={40} weight="fill" className="mx-auto text-brand-500" />
        <h1 className="mt-4 text-2xl font-bold text-stone-900">Đặt hàng thành công!</h1>
        <p className="mt-2 text-stone-600">
          Cảm ơn {order.customerSnapshot.fullName}, đơn hàng của bạn đã được ghi nhận.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-100 bg-white p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-stone-500">Mã đơn hàng</span>
          <span className="font-mono text-sm font-semibold text-stone-900">{order.orderNumber}</span>
        </div>

        <div className="mt-3 divide-y divide-stone-100 border-t border-stone-100">
          {order.items.map((item) => {
            const attrs = [item.variant.attributes?.size, item.variant.attributes?.flavor]
              .filter(Boolean)
              .join(' · ');
            return (
              <div key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-900">{item.product.name}</p>
                  <p className="text-xs text-stone-500">
                    {attrs && `${attrs} · `}x{item.quantity}
                  </p>
                </div>
                <span className="flex-shrink-0 text-sm font-semibold text-stone-900 tabular-nums">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 space-y-2 border-t border-stone-100 pt-3 text-sm">
          <div className="flex items-center justify-between text-stone-600">
            <span>Tạm tính</span>
            <span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between text-brand-700">
              <span>Giảm giá {order.voucherCode ? `(${order.voucherCode})` : ''}</span>
              <span className="tabular-nums">-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-base font-semibold text-stone-900">
            <span>Tổng cộng</span>
            <span className="tabular-nums">{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-1 border-t border-stone-100 pt-3 text-sm text-stone-600">
          <p>Giao đến: {order.customerSnapshot.address}</p>
          <p>Số điện thoại: {order.customerSnapshot.phone}</p>
          <p>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <Link
          to="/"
          className="rounded-full border border-stone-200 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
        >
          Về trang chủ
        </Link>
        <Link
          to="/order-lookup"
          className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Tra cứu đơn hàng
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
