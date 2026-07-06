import { Outlet } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-stone-900">
          Bánh Tráng Nhà Na
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a href="/products" className="hover:text-stone-900 transition-colors">Sản phẩm</a>
          <a href="/cart" className="hover:text-stone-900 transition-colors">Giỏ hàng</a>
          <a href="/order-lookup" className="hover:text-stone-900 transition-colors">Tra cứu đơn</a>
          <a href="/login" className="hover:text-stone-900 transition-colors">Đăng nhập</a>
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
    </>
  );
};

export default MainLayout;
