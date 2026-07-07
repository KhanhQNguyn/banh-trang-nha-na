import { Minus, Plus, Trash } from '@phosphor-icons/react';
import { useCartStore } from '@/stores/cartStore';
import { formatCurrency } from '@/utils/formatCurrency';

const CartItemRow = ({ item }) => {
  const decrementItem = useCartStore((s) => s.decrementItem);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const attrs = [item.attributes?.size, item.attributes?.flavor].filter(Boolean).join(' · ');

  return (
    <div className="flex gap-3 py-4">
      <img
        src={item.image}
        alt={item.name}
        className="h-16 w-16 flex-shrink-0 rounded-lg object-cover bg-stone-100"
      />

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-stone-900 leading-snug line-clamp-2">
            {item.name}
          </p>
          <button
            type="button"
            aria-label="Xóa sản phẩm"
            onClick={() => removeItem(item.productId, item.variantId)}
            className="flex-shrink-0 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <Trash size={16} />
          </button>
        </div>

        {attrs && <p className="text-xs text-stone-500">{attrs}</p>}

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center rounded-full border border-stone-200">
            <button
              type="button"
              aria-label="Giảm số lượng"
              onClick={() => decrementItem(item.productId, item.variantId)}
              className="flex h-7 w-7 items-center justify-center text-stone-600 hover:text-stone-900"
            >
              <Minus size={13} />
            </button>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                updateQuantity(item.productId, item.variantId, Number.isNaN(value) ? 1 : value);
              }}
              className="h-7 w-9 border-x border-stone-200 text-center text-sm tabular-nums focus:outline-none"
            />
            <button
              type="button"
              aria-label="Tăng số lượng"
              onClick={() => incrementItem(item.productId, item.variantId)}
              className="flex h-7 w-7 items-center justify-center text-stone-600 hover:text-stone-900"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-stone-900 tabular-nums">
              {formatCurrency(item.unitPrice * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-stone-400 tabular-nums">
                {formatCurrency(item.unitPrice)} / sản phẩm
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
