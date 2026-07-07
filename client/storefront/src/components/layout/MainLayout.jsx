import { Outlet, Link } from 'react-router-dom';
import CartButton from '@/components/cart/CartButton';
import CartDrawer from '@/components/cart/CartDrawer';

const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-stone-900">
          Bánh Tráng Nhà Na
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link to="/" className="hover:text-stone-900 transition-colors">Trang chủ</Link>
          <Link to="/products" className="hover:text-stone-900 transition-colors">Sản phẩm</Link>
          <a href="/#lien-he" className="hover:text-stone-900 transition-colors">Liên hệ</a>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center text-sm">
          &copy; {new Date().getFullYear()} Bánh Tráng Nhà Na. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartButton />
      <CartDrawer />
    </>
  );
};

export default MainLayout;
