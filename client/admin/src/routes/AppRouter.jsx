import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Page imports
import OrderListPage from '@/pages/OrderListPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import OrderHistoryPage from '@/pages/OrderHistoryPage';
import CustomerListPage from '@/pages/CustomerListPage';
import ProductListPage from '@/pages/ProductListPage';
import ProductFormPage from '@/pages/ProductFormPage';
import CategoryListPage from '@/pages/CategoryListPage';
import VoucherListPage from '@/pages/VoucherListPage';
import VoucherFormPage from '@/pages/VoucherFormPage';
import LoginPage from '@/pages/LoginPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin layout */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<OrderListPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/vouchers" element={<VoucherListPage />} />
          <Route path="/vouchers/new" element={<VoucherFormPage />} />
          <Route path="/vouchers/:id/edit" element={<VoucherFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
