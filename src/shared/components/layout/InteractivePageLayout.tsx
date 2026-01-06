import type { ReactNode } from 'react';
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
 * 
 * 特点：
 * - Sidebar: 独立滚动（Web only）
 * - Content: 独立滚动
 * - Header/Footer: 固定不滚动
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

      {/* Main Container - flex 布局，禁止溢出 */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* 
          ========== Sidebar - Web only ==========
          - 固定宽度（默认 16rem = 256px）
          - 左侧边栏，垂直分割线分隔
          - 内容可独立滚动（关键！）
          - H5 通过 Sheet Modal 显示
        */}
        {sidebar && (
          <div
            className={cn(
              'hidden md:flex flex-col',
              sidebarWidth,
              'border-r border-border/30 bg-background/95 flex-shrink-0',
              'overflow-hidden' // 关键：禁止 Sidebar 容器本身滚动
            )}
          >
            {sidebar}
          </div>
        )}

        {/* 
          ========== Main Chat Area ==========
          - flex 列式布局
          - 占据剩余空间
          - 内部分为 Header / Content / Footer
        */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Header - 固定高度，不滚动 */}
          {header && (
            <div className="flex-shrink-0 border-b border-border/30 bg-background/50 backdrop-blur-sm">
              {header}
            </div>
          )}

          {/* 
            ========== Content Area ==========
            - flex-1: 占据所有剩余空间
            - overflow-y-auto: 纵向可滚动
            - min-h-0: 关键！让 flex 正确计算高度
          */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 flex flex-col">
            {content}
          </div>

          {/* Footer - 固定底部，不滚动 */}
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
