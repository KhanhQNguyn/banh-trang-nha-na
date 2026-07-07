import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartSimple, X } from '@phosphor-icons/react';
import { useCartStore } from '@/stores/cartStore';
import { formatCurrency } from '@/utils/formatCurrency';
import CartItemRow from './CartItemRow';

const CartDrawer = () => {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-stone-900/40"
          />

          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
              <h2 className="text-base font-semibold text-stone-900">Giỏ hàng</h2>
              <button
                type="button"
                aria-label="Đóng giỏ hàng"
                onClick={closeCart}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-stone-400">
                  <ShoppingCartSimple size={40} />
                  <p className="text-sm">Giỏ hàng của bạn đang trống.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {items.map((item) => (
                    <CartItemRow key={`${item.productId}-${item.variantId}`} item={item} />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-stone-100 px-5 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-stone-600">Tổng cộng</span>
                <span className="text-lg font-semibold text-stone-900 tabular-nums">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              <button
                type="button"
                disabled={items.length === 0}
                onClick={handleCheckout}
                className="w-full rounded-full bg-brand-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
              >
                Đặt hàng
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
