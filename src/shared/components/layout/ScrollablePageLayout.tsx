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
  /** 是否显示内容最大宽度约束 */
  maxWidthConstraint?: boolean;
  /** 自定义最大宽度 */
  maxWidth?: string;
  /** 内容内边距 */
  contentPadding?: string;
}

/**
 * 数据展示类页面布局
 * 内容全局可滚动，Header/TabBar 固定
 *
 * 特点：
 * - Header 固定不滚动
 * - 内容区域独占滚动权（min-h-0 关键）
 * - H5 自动预留 TabBar 空间（pb-20）
 * - Web 有最大宽度约束（可选）
 */
export function ScrollablePageLayout({
  children,
  hideBottomNav = false,
  fullWidth = false,
  mainClassName = '',
  maxWidthConstraint = true,
  maxWidth = 'max-w-7xl',
  contentPadding = 'p-3 sm:p-4 md:p-6',
}: ScrollablePageLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* ========== Header - 固定顶部 ========== */}
      <Header />

      {/* ========== Main Content Area - 可滚动 ========== */}
      {/* 
        关键属性说明：
        - flex-1: 占据所有剩余空间
        - overflow-y-auto: 允许纵向滚动
        - overflow-x-hidden: 禁止横向滚动
        - min-h-0: 关键！让 flex 正确计算高度（否则会溢出）
      */}
      <main
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden min-h-0',
          'scroll-smooth', // 平滑滚动
          mainClassName
        )}
      >
        {/* 内容容器 Wrapper */}
        <div
          className={cn(
            'w-full h-full flex flex-col',
            // 内容宽度约束
            !fullWidth && maxWidthConstraint && ['mx-auto', maxWidth],
            // 内边距
            contentPadding,
            // H5 底部安全间距（防止 TabBar 遮挡）
            'pb-20 md:pb-8'
          )}
        >
          {/* 实际内容 */}
          {children}

          {/* 底部安全间距（额外缓冲） */}
          <div className="h-4 md:h-0" />
        </div>
      </main>

      {/* ========== Mobile TabBar - H5 固定底部 ========== */}
      {!hideBottomNav && <MobileNav />}
    </div>
  );
}
