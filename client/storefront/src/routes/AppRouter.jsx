import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Page imports
import HomePage from '@/pages/HomePage';
import ProductListPage from '@/pages/ProductListPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CategoryPage from '@/pages/CategoryPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import OrderHistoryPage from '@/pages/OrderHistoryPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import OrderLookupPage from '@/pages/OrderLookupPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<OrderSuccessPage />} />
          <Route path="/order-lookup" element={<OrderLookupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes (customer) */}
          <Route
            path="/account/orders"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
