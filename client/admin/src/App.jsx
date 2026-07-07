import { useEffect } from 'react';
import AppRouter from '@/routes/AppRouter';
import ToastContainer from '@/components/ui/ToastContainer';
import { useAuthStore } from '@/stores/authStore';

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
}

export default App;
