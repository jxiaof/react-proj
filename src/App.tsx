import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/shared/components/ThemeProvider';
import { router } from './routes';
import { debugLayoutHeights } from '@/shared/utils/layoutDebug';

function App() {
  useEffect(() => {
    // 开发环境：监听高度变化
    const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    if (isDev) {
      const timer = setTimeout(() => {
        debugLayoutHeights();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
