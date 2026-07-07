import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CircleNotch, Lock, User } from '@phosphor-icons/react';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    const redirectTo = location.state?.from || '/orders';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError('');
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(location.state?.from || '/orders', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Đăng nhập thất bại.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-stone-900">Bánh Tráng Nhà Na</h1>
          <p className="mt-1 text-sm text-stone-500">Đăng nhập vào trang quản trị</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-stone-700">
              Email
            </label>
            <div className="relative mt-1.5">
              <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="admin@banhtrangnhana.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-stone-700">
              Mật khẩu
            </label>
            <div className="relative mt-1.5">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {submitting && <CircleNotch size={16} className="animate-spin" />}
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
