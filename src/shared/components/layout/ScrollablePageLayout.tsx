import { ReactNode } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { cn } from '@/shared/utils/cn';

interface ScrollablePageLayoutProps {
  children: ReactNode;
  /** 隐藏底部导航（针对全屏页面） */
  hideBottomNav?: boolean;
  /** 内容是否撑满宽度 */
  fullWidth?: boolean;
  /** 自定义主容器 className */
  mainClassName?: string;
}

/**
 * 数据展示类页面布局
 * 特点：全局可滚动，Header/TabBar 固定
 * 
 * 适用场景：
 * - DocumentsPage（文档列表）
 * - HomePage（首页）
 * - SettingsPage（设置列表）
 * 
 * H5 高度计算：100vh - Header(56px) - TabBar(64px, safe-area aware)
 * Web 高度计算：100vh - Header(56px)
 */
export function ScrollablePageLayout({
  children,
  hideBottomNav = false,
  fullWidth = false,
  mainClassName = '',
}: ScrollablePageLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header - 固定，Z-index 40 */}
      <Header />

      {/* Main Content - 可全局滚动 */}
      <main
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden',
          // Web: 全宽内容容器
          !fullWidth && 'max-w-7xl mx-auto w-full',
          // H5: 考虑 safe-area
          'pb-20 md:pb-6',
          mainClassName
        )}
      >
        <div className={cn(!fullWidth && 'p-3 sm:p-4 md:p-6')}>
          {children}
        </div>
      </main>

      {/* Mobile TabBar - H5 固定，Web 隐藏 */}
      {!hideBottomNav && <MobileNav />}
    </div>
  );
}
