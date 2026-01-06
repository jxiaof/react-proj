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
 * 内容全局可滚动，Header/TabBar 固定
 */
export function ScrollablePageLayout({
  children,
  hideBottomNav = false,
  fullWidth = false,
  mainClassName = '',
}: ScrollablePageLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header - 固定顶部 */}
      <Header />

      {/* Main Content - 可滚动 */}
      <main
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden min-h-0',
          // Web: 全宽内容容器
          !fullWidth && 'max-w-7xl mx-auto w-full',
          mainClassName
        )}
      >
        {/* 内容 wrapper */}
        <div className={cn(!fullWidth && 'p-3 sm:p-4 md:p-6')}>
          {children}
        </div>

        {/* H5 底部安全间距 - 重要！防止 TabBar 遮挡 */}
        <div className="h-20 md:h-6" />
      </main>

      {/* Mobile TabBar - H5 固定，隐藏滚动条 */}
      {!hideBottomNav && <MobileNav />}
    </div>
  );
}
