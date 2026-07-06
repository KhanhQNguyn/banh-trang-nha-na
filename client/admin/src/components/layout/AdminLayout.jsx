import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col min-h-screen">
      <div className="h-16 flex items-center justify-center font-bold text-white border-b border-stone-800">
        BTNN Admin
      </div>
      <nav className="flex-1 p-4 space-y-2 text-sm">
        <a href="/" className="block py-2 px-3 rounded hover:bg-stone-800 hover:text-white transition-colors">Tổng quan</a>
        <a href="/orders" className="block py-2 px-3 rounded hover:bg-stone-800 hover:text-white transition-colors">Đơn hàng</a>
        <a href="/products" className="block py-2 px-3 rounded hover:bg-stone-800 hover:text-white transition-colors">Sản phẩm</a>
        <a href="/categories" className="block py-2 px-3 rounded hover:bg-stone-800 hover:text-white transition-colors">Danh mục</a>
        <a href="/vouchers" className="block py-2 px-3 rounded hover:bg-stone-800 hover:text-white transition-colors">Vouchers</a>
      </nav>
    </aside>
  );
};

const TopBar = () => {
  const { logout } = useAuth();
  return (
    <header className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between">
      <h2 className="font-semibold text-stone-800">Bảng điều khiển</h2>
      <button 
        onClick={logout}
        className="text-sm font-medium text-stone-600 hover:text-red-600 transition-colors"
      >
        Đăng xuất
      </button>
    </header>
  );
};

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
