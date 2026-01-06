import { ReactNode } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { cn } from '@/shared/utils/cn';

interface InteractivePageLayoutProps {
  header?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  hideBottomNav?: boolean;
  sidebarWidth?: string;
}

/**
 * 实时交互类页面布局
 * 严格控制高度，禁止溢出
 */
export function InteractivePageLayout({
  header,
  content,
  footer,
  sidebar,
  hideBottomNav = false,
  sidebarWidth = 'w-64',
}: InteractivePageLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Global Header - 固定 */}
      <Header />

      {/* Main Container - 禁止溢出 */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar - 可选，Web only */}
        {sidebar && (
          <div
            className={cn(
              'hidden md:flex flex-col',
              sidebarWidth,
              'border-r border-border/30 bg-background/95 overflow-hidden'
            )}
          >
            {/* Sidebar Content Area - 允许内部滚动 */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
              {sidebar}
            </div>
          </div>
        )}

        {/* Chat Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Page Header - 固定，不滚动 */}
          {header && (
            <div className="flex-shrink-0 border-b border-border/30 bg-background/50 backdrop-blur-sm">
              {header}
            </div>
          )}

          {/* Content Area - 独占滚动权，min-h-0 是关键 */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 flex flex-col">
            {content}
          </div>

          {/* Footer Area - 固定底部，不滚动 */}
          {footer && (
            <div className="flex-shrink-0 border-t border-border/20 bg-background">
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* Mobile TabBar - H5 固定底部 */}
      {!hideBottomNav && <MobileNav />}
    </div>
  );
}

export default InteractivePageLayout;
