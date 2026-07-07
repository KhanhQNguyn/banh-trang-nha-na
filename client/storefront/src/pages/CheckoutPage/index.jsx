import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircleNotch, ShoppingCartSimple, Tag } from '@phosphor-icons/react';
import { useCartStore } from '@/stores/cartStore';
import httpHelper from '@/services/httpHelper';
import { API } from '@/config/apiConfig';
import { formatCurrency } from '@/utils/formatCurrency';
import CartItemRow from '@/components/cart/CartItemRow';

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
  { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
];

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  note: '',
  paymentMethod: 'cod',
};

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs text-chili-600">{message}</p> : null;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);

  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherStatus, setVoucherStatus] = useState('idle'); // idle | loading | applied | error
  const [voucherError, setVoucherError] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null); // { code, discountAmount, finalTotal }

  const discountAmount = appliedVoucher?.discountAmount || 0;
  const total = appliedVoucher ? appliedVoucher.finalTotal : subtotal;

  // A voucher's discount/finalTotal is a snapshot from the validate call. If the
  // cart changes afterward (quantity edited, item removed), that snapshot is stale
  // and must be re-validated rather than silently applied to the new total.
  useEffect(() => {
    if (appliedVoucher && appliedVoucher.baseSubtotal !== subtotal) {
      setAppliedVoucher(null);
      setVoucherStatus('error');
      setVoucherError('Giỏ hàng đã thay đổi, vui lòng áp dụng lại mã giảm giá.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFormErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleApplyVoucher = async () => {
    const code = voucherInput.trim();
    if (!code) return;

    setVoucherStatus('loading');
    setVoucherError('');
    try {
      const res = await httpHelper.post(API.VOUCHERS.VALIDATE, { code, orderTotal: subtotal });
      setAppliedVoucher({ code: code.toUpperCase(), baseSubtotal: subtotal, ...res.data.data });
      setVoucherStatus('applied');
    } catch (err) {
      setAppliedVoucher(null);
      setVoucherStatus('error');
      setVoucherError(err.response?.data?.error?.message || 'Mã giảm giá không hợp lệ');
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherStatus('idle');
    setVoucherError('');
  };

  const validateForm = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại';
    if (!form.address.trim()) errors.address = 'Vui lòng nhập địa chỉ giao hàng';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0 || submitting) return;
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        customerInfo: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          address: form.address.trim(),
        },
        paymentMethod: form.paymentMethod,
        voucherCode: appliedVoucher?.code || undefined,
        note: form.note.trim() || undefined,
      };

      const res = await httpHelper.post(API.ORDERS.PLACE, payload);
      const order = res.data.data;

      clearCart();
      navigate('/checkout/success', { state: { order } });
    } catch (err) {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <ShoppingCartSimple size={40} className="mx-auto text-stone-300" />
        <h1 className="mt-4 text-xl font-semibold text-stone-900">Giỏ hàng của bạn đang trống</h1>
        <p className="mt-2 text-stone-500">Thêm sản phẩm vào giỏ trước khi đặt hàng.</p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Thanh toán</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
        {/* Customer info form */}
        <div className="space-y-8 lg:order-1">
          <section>
            <h2 className="text-base font-semibold text-stone-900">Thông tin giao hàng</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="text-sm font-medium text-stone-700">
                  Họ và tên
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleFieldChange('fullName')}
                  aria-invalid={Boolean(formErrors.fullName)}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Nguyễn Văn A"
                />
                <FieldError message={formErrors.fullName} />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium text-stone-700">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleFieldChange('phone')}
                  aria-invalid={Boolean(formErrors.phone)}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="0909 123 456"
                />
                <FieldError message={formErrors.phone} />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-stone-700">
                  Email <span className="font-normal text-stone-400">(không bắt buộc)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleFieldChange('email')}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="ban@email.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="text-sm font-medium text-stone-700">
                  Địa chỉ giao hàng
                </label>
                <textarea
                  id="address"
                  rows={2}
                  value={form.address}
                  onChange={handleFieldChange('address')}
                  aria-invalid={Boolean(formErrors.address)}
                  className="mt-1.5 w-full resize-none rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                />
                <FieldError message={formErrors.address} />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="note" className="text-sm font-medium text-stone-700">
                  Ghi chú <span className="font-normal text-stone-400">(không bắt buộc)</span>
                </label>
                <textarea
                  id="note"
                  rows={2}
                  value={form.note}
                  onChange={handleFieldChange('note')}
                  className="mt-1.5 w-full resize-none rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Giao giờ hành chính, gọi trước khi giao..."
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-900">Phương thức thanh toán</h2>
            <div className="mt-4 space-y-2">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    form.paymentMethod === method.value
                      ? 'border-brand-500 bg-brand-50 text-stone-900'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={form.paymentMethod === method.value}
                    onChange={handleFieldChange('paymentMethod')}
                    className="h-4 w-4 accent-brand-600"
                  />
                  {method.label}
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Order summary */}
        <aside className="rounded-2xl border border-stone-100 bg-white p-5 lg:order-2 lg:sticky lg:top-24">
          <h2 className="text-base font-semibold text-stone-900">Đơn hàng của bạn</h2>

          <div className="mt-2 divide-y divide-stone-100">
            {items.map((item) => (
              <CartItemRow key={`${item.productId}-${item.variantId}`} item={item} />
            ))}
          </div>

          <div className="mt-2 border-t border-stone-100 pt-4">
            <label htmlFor="voucher" className="text-sm font-medium text-stone-700">
              Mã giảm giá
            </label>
            {appliedVoucher ? (
              <div className="mt-1.5 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2.5">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  <Tag size={14} weight="fill" />
                  {appliedVoucher.code}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveVoucher}
                  className="text-xs font-medium text-stone-500 hover:text-stone-800"
                >
                  Xóa
                </button>
              </div>
            ) : (
              <div className="mt-1.5 flex gap-2">
                <input
                  id="voucher"
                  type="text"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="min-w-0 flex-1 rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm uppercase text-stone-900 placeholder:normal-case placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={handleApplyVoucher}
                  disabled={!voucherInput.trim() || voucherStatus === 'loading'}
                  className="flex-shrink-0 rounded-xl bg-stone-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
                >
                  {voucherStatus === 'loading' ? (
                    <CircleNotch size={16} className="animate-spin" />
                  ) : (
                    'Áp dụng'
                  )}
                </button>
              </div>
            )}
            <FieldError message={voucherStatus === 'error' ? voucherError : ''} />
          </div>

          <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-sm">
            <div className="flex items-center justify-between text-stone-600">
              <span>Tạm tính</span>
              <span className="tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-brand-700">
                <span>Giảm giá</span>
                <span className="tabular-nums">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-stone-100 pt-2 text-base font-semibold text-stone-900">
              <span>Tổng cộng</span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
          >
            {submitting && <CircleNotch size={16} className="animate-spin" />}
            Hoàn tất đặt hàng
          </button>
        </aside>
      </div>
    </form>
  );
};

export default CheckoutPage;
