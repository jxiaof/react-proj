import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const DocumentsPage = lazy(() => import('@/features/documents/pages/DocumentsPage'));
const ChatPage = lazy(() => import('@/features/chat/pages/ChatPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));

// Loading fallback
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/documents',
    element: (
      <Suspense fallback={<PageLoader />}>
        <DocumentsPage />
      </Suspense>
    ),
  },
  {
    path: '/chat',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ChatPage />
      </Suspense>
    ),
  },
  {
    path: '/chat/:conversationId',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ChatPage />
      </Suspense>
    ),
  },
  {
    path: '/settings',
    element: (
      <Suspense fallback={<PageLoader />}>
        <SettingsPage />
      </Suspense>
    ),
  },
]);
