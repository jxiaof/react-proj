import { ReactNode } from 'react';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { cn } from '@/shared/utils/cn';

interface InteractivePageLayoutProps {
  /** 页面头部组件（下方会自动添加 border） */
  header?: ReactNode;
  /** 可滚动的主内容区域 */
  content: ReactNode;
  /** 固定在底部的 Input/Action 区域 */
  footer?: ReactNode;
  /** 侧边栏（Web only） */
  sidebar?: ReactNode;
  /** 隐藏 MobileNav */
  hideBottomNav?: boolean;
  /** 侧边栏宽度（Tailwind 类名）*/
  sidebarWidth?: string;
}

/**
 * 实时交互类页面布局（推荐给 ChatPage）
 * 
 * 特点：Header/Input 固定，中间消息区域独占滚动权
 * 结构：Header (固定) -> Content (滚动) -> Footer (固定)
 * 禁止全局滚动，只内部滚动
 * 
 * 适用场景：
 * - ChatPage（聊天对话）
 * - SupportPage（客服对话）
 * - RealtimeApp（实时应用）
 * 
 * H5 高度计算：
 * total_height = 100vh - safe-area-top - safe-area-bottom
 * content_height = total_height - header_height - footer_height - tabbar_height
 * 
 * Web 高度计算：
 * total_height = 100vh
 * content_height = total_height - header_height - footer_height
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
      {/* 全局 Header - 固定顶部 */}
      <Header />

      {/* Main Container - flex 容器，禁止全局滚动 */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Desktop Sidebar - 可选 */}
        {sidebar && (
          <div className={cn('hidden md:flex flex-col', sidebarWidth, 'border-r border-border/30 bg-background/95 overflow-hidden')}>
            {sidebar}
          </div>
        )}

        {/* Chat Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Page Header - 固定 */}
          {header && (
            <div className="flex-shrink-0 border-b border-border/30 bg-background/50 backdrop-blur-sm">
              {header}
            </div>
          )}

          {/* Content Area - 独占滚动权 */}
          {/* 
            关键属性说明：
            - flex-1: 占据所有剩余空间
            - overflow-y-auto: 只允许纵向滚动
            - overflow-x-hidden: 禁止横向滚动
            - min-h-0: 重要！让 flex 正确计算高度（否则会溢出）
          */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 flex flex-col">
            {content}
          </div>

          {/* Footer Area - 固定底部 */}
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
