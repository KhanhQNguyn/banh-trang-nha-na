import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react';
import httpHelper from '@/services/httpHelper';
import { API } from '@/config/apiConfig';
import ProductCard from '@/components/product/ProductCard';

const ProductGridSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="overflow-hidden rounded-2xl border border-stone-100">
        <div className="aspect-square animate-pulse bg-stone-100" />
        <div className="space-y-2 p-4">
          <div className="h-3.5 w-4/5 animate-pulse rounded bg-stone-100" />
          <div className="h-3.5 w-1/2 animate-pulse rounded bg-stone-100" />
        </div>
      </div>
    ))}
  </div>
);

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    httpHelper
      .get(API.PRODUCTS.FEATURED)
      .then((res) => {
        if (cancelled) return;
        setProducts(res.data.data);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 md:text-5xl">
              Bánh tráng phơi sương, cuốn trọn vị quê nhà.
            </h1>
            <p className="mt-4 max-w-[46ch] text-stone-600 leading-relaxed">
              Bánh Tráng Nhà Na làm thủ công từ gạo Tây Ninh, không chất bảo quản, giao tận nơi trong ngày.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Xem sản phẩm
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-stone-100">
            <img
              src="https://picsum.photos/seed/banh-trang-nha-na-hero/900/675"
              alt="Bánh tráng Nhà Na phơi sương"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-semibold text-stone-900 md:text-2xl">Sản phẩm nổi bật</h2>
          <Link
            to="/products"
            className="hidden text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors sm:inline-flex items-center gap-1"
          >
            Xem tất cả
            <ArrowRight size={14} />
          </Link>
        </div>

        {status === 'loading' && <ProductGridSkeleton />}

        {status === 'error' && (
          <div className="rounded-2xl border border-stone-100 py-16 text-center text-stone-500">
            Không thể tải sản phẩm lúc này. Vui lòng thử lại sau.
          </div>
        )}

        {status === 'ready' && products.length === 0 && (
          <div className="rounded-2xl border border-stone-100 py-16 text-center text-stone-500">
            Chưa có sản phẩm nổi bật nào.
          </div>
        )}

        {status === 'ready' && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section id="lien-he" className="bg-stone-50 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-xl font-semibold text-stone-900 md:text-2xl">Liên hệ</h2>
          <p className="mt-2 max-w-[52ch] text-stone-600">
            Có câu hỏi về sản phẩm hoặc đơn hàng? Liên hệ với chúng tôi qua các kênh dưới đây.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-0.5 flex-shrink-0 text-brand-600" />
              <span className="text-sm text-stone-700">
                123 Đường Trần Hưng Đạo, Phường 1, Tây Ninh
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="mt-0.5 flex-shrink-0 text-brand-600" />
              <span className="text-sm text-stone-700">0909 123 456</span>
            </div>
            <div className="flex items-start gap-3">
              <EnvelopeSimple size={20} className="mt-0.5 flex-shrink-0 text-brand-600" />
              <span className="text-sm text-stone-700">hi@banhtrangnhana.vn</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
