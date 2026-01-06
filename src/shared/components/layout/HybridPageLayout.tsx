import type { ReactNode } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { cn } from '@/shared/utils/cn';

interface HybridPageLayoutProps {
  /** 顶部固定区域（如 Header、工具栏） */
  topBar?: ReactNode;
  /** 左侧区域（Web only） */
  sidebar?: ReactNode;
  /** 主内容区域（可滚动） */
  mainContent: ReactNode;
  /** 右侧边栏（可选） */
  rightSidebar?: ReactNode;
  /** 底部固定区域（如按钮组） */
  bottomBar?: ReactNode;
  /** 隐藏 MobileNav */
  hideBottomNav?: boolean;
  /** 内容是否全宽 */
  fullWidth?: boolean;
  /** 主内容是否内部滚动（vs 全局滚动） */
  internalScroll?: boolean;
}

/**
 * 混合类页面布局
 * 
 * 特点：灵活组合固定和滚动区域
 * 可用于复杂的后台管理系统或设置页面
 * 
 * 适用场景：
 * - SettingsPage（配置页面）
 * - AdminDashboard（管理后台）
 * - DetailPage（详情页面 + 侧边栏）
 */
export function HybridPageLayout({
  topBar,
  sidebar,
  mainContent,
  rightSidebar,
  bottomBar,
  hideBottomNav = false,
  fullWidth = false,
  internalScroll = false,
}: HybridPageLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* 全局 Header */}
      <Header />

      {/* 主容器 */}
      <div className={cn('flex flex-1 overflow-hidden min-h-0', internalScroll && 'flex-col')}>
        {/* 左侧边栏（Web only） */}
        {sidebar && (
          <aside className="hidden lg:flex lg:flex-col w-64 border-r border-border/30 bg-background/95 overflow-y-auto">
            {sidebar}
          </aside>
        )}

        {/* 中心内容区域 */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* 顶部栏（可选） */}
          {topBar && (
            <div className="flex-shrink-0 border-b border-border/30 bg-background/50 backdrop-blur-sm">
              {topBar}
            </div>
          )}

          {/* 主内容 */}
          {!internalScroll ? (
            // 全局滚动模式
            <main
              className={cn(
                'flex-1 overflow-y-auto overflow-x-hidden',
                !fullWidth && 'max-w-7xl mx-auto w-full',
                'pb-20 md:pb-6'
              )}
            >
              <div className={cn(!fullWidth && 'p-3 sm:p-4 md:p-6')}>
                {mainContent}
              </div>
            </main>
          ) : (
            // 内部滚动模式
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
              <div className={cn(!fullWidth && 'max-w-7xl mx-auto w-full', 'p-3 sm:p-4 md:p-6')}>
                {mainContent}
              </div>
            </div>
          )}

          {/* 底部栏（可选） */}
          {bottomBar && (
            <div className="flex-shrink-0 border-t border-border/30 bg-background/50 backdrop-blur-sm">
              {bottomBar}
            </div>
          )}
        </div>

        {/* 右侧边栏（可选，Web only） */}
        {rightSidebar && (
          <aside className="hidden xl:flex xl:flex-col w-80 border-l border-border/30 bg-background/95 overflow-y-auto">
            {rightSidebar}
          </aside>
        )}
      </div>

      {/* Mobile Navigation */}
      {!hideBottomNav && <MobileNav />}
    </div>
  );
}
