import { Link } from 'react-router-dom';
import { Plus } from '@phosphor-icons/react';
import { useCartStore } from '@/stores/cartStore';
import { formatCurrency } from '@/utils/formatCurrency';

const ProductCard = ({ product }) => {
  const addItem = useCartStore((s) => s.addItem);
  const variant = product.variants[0];
  const unitPrice = (product.promoPrice ?? product.basePrice) + (variant.priceModifier || 0);
  const image = product.images?.[0]?.url || `https://picsum.photos/seed/${product.slug}/480/480`;
  const onSale = product.promoPrice != null && product.promoPrice < product.basePrice;

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        slug: product.slug,
        image,
        unitPrice,
        stockQuantity: variant.stockQuantity,
        attributes: variant.attributes,
      },
      1
    );
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white">
      <Link to={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-semibold text-white">
            Khuyến mãi
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-stone-900 line-clamp-2 leading-snug hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-stone-900 tabular-nums">
              {formatCurrency(unitPrice)}
            </span>
            {onSale && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatCurrency(product.basePrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label={`Thêm ${product.name} vào giỏ`}
            onClick={handleAddToCart}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-stone-900 text-white transition-transform hover:bg-brand-600 active:scale-95"
          >
            <Plus size={16} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
