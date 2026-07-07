import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from '@phosphor-icons/react';
import { useCartStore } from '@/stores/cartStore';

const DRAG_THRESHOLD = 6;

const CartButton = () => {
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const hasDragged = useRef(false);
  const constraintsRef = useRef(null);

  return (
    <div ref={constraintsRef} className="fixed inset-0 z-40 pointer-events-none">
      <motion.button
        type="button"
        aria-label="Giỏ hàng"
        drag
        dragMomentum={false}
        dragElastic={0.08}
        dragConstraints={constraintsRef}
        onDragStart={() => {
          hasDragged.current = false;
        }}
        onDrag={(_, info) => {
          if (Math.abs(info.offset.x) > DRAG_THRESHOLD || Math.abs(info.offset.y) > DRAG_THRESHOLD) {
            hasDragged.current = true;
          }
        }}
        onClick={() => {
          if (!hasDragged.current) toggleCart();
        }}
        whileTap={{ scale: 0.94 }}
        className="pointer-events-auto absolute bottom-6 right-6 flex h-14 w-14 cursor-grab items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-900/20 active:cursor-grabbing"
      >
        <ShoppingCart size={24} weight="fill" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1 text-xs font-semibold text-white">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default CartButton;
