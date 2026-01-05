import { ReactNode } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

interface MainLayoutProps {
  children: ReactNode;
  /** Hide bottom nav for full-screen pages like chat */
  hideBottomNav?: boolean;
  /** Use full width without max-width constraint */
  fullWidth?: boolean;
}

export function MainLayout({ children, hideBottomNav, fullWidth }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className={`flex-1 overflow-hidden ${!fullWidth ? 'max-w-7xl mx-auto w-full' : 'w-full'}`}>
        {!fullWidth && (
          <div className="p-3 sm:p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </div>
        )}
        {fullWidth && children}
      </main>

      {/* Mobile Navigation - 只在 H5 显示 */}
      {!hideBottomNav && <MobileNav />}
    </div>
  );
}
