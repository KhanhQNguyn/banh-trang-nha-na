import { NavLink, Outlet } from 'react-router-dom';
import { SignOut } from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { to: '/orders', label: 'Quản lý đơn hàng' },
  { to: '/customers', label: 'Khách hàng đã mua' },
  { to: '/order-history', label: 'Đơn hàng đã mua' },
  { to: '/products', label: 'Quản lý sản phẩm' },
];

const TopNav = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <span className="text-base font-semibold text-stone-900">Bánh Tráng Nhà Na</span>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user?.email && <span className="hidden text-sm text-stone-500 sm:inline">{user.email}</span>}
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <SignOut size={16} />
            Đăng xuất
          </button>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-stone-100 px-4 py-2 md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-stone-600 hover:bg-stone-50'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

const AdminLayout = () => {
  return (
    <div className="flex min-h-[100dvh] flex-1 flex-col bg-stone-50 print:bg-white">
      <TopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 print:px-0 print:py-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
