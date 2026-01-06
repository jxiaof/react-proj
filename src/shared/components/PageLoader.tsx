import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';

/**
 * Loading fallback component for lazy-loaded routes
 */
export function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
