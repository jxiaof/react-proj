import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PageLoader } from '@/shared/components/PageLoader';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const DocumentsPage = lazy(() => import('@/features/documents/pages/DocumentsPage'));
const ChatPage = lazy(() => import('@/features/chat/pages/ChatPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));

// Route configuration
const routeConfig = [
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
];

export const router = createBrowserRouter(routeConfig);
