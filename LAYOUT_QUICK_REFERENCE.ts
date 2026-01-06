/**
 * 快速参考：三层布局系统选择指南
 * 
 * 该文件帮助快速判断应该使用哪个布局组件
 */

// ============================================================================
// 1️⃣ ScrollablePageLayout - 数据展示类（全局可滚）
// ============================================================================

import { ScrollablePageLayout } from '@/shared/components/layout';

/**
 * ✅ 适用场景：
 * - 文档列表（DocumentsPage）
 * - 首页（HomePage）
 * - 设置列表（SettingsPage - 列表模式）
 * - 任何全局可滚动的页面
 * 
 * ❌ 不适用：
 * - 需要固定 Footer/Input 的页面
 * - 实时交互的页面（聊天、直播）
 * 
 * 高度计算：
 * - Web:  100vh - Header(56px) = 可用高度
 * - H5:   100vh - Header(56px) - TabBar(64px) = 可用高度
 * 
 * 使用方式：
 */
function DocumentsPageExample() {
  return (
    <ScrollablePageLayout 
      hideBottomNav={false}  // 是否隐藏底部导航
      fullWidth={false}      // 是否全宽（默认 max-w-7xl）
    >
      {/* 内容会自动全局滚动 */}
      <h1>My Documents</h1>
      <DocumentList />
    </ScrollablePageLayout>
  );
}

// ============================================================================
// 2️⃣ InteractivePageLayout - 实时交互类（内部滚动）
// ============================================================================

import { InteractivePageLayout } from '@/shared/components/layout';

/**
 * ✅ 适用场景：
 * - 聊天页面（ChatPage）⭐ 最常用
 * - 实时客服系统
 * - 直播评论区
 * - 需要 Input 固定在底部的所有页面
 * 
 * ❌ 不适用：
 * - 简单的列表展示页面
 * - 全局滚动的页面
 * 
 * 特点：
 * - Header 固定
 * - Content 区域独占滚动权（关键！）
 * - Footer/Input 固定在底部
 * - H5 虚拟键盘会推起 Input（自动处理）
 * 
 * 高度计算：
 * - Content 高度 = 可用空间 - Header - Footer
 * - Sidebar (可选，W3 only)
 * 
 * 使用方式：
 */
function ChatPageExample() {
  const [messages, setMessages] = useState([]);

  return (
    <InteractivePageLayout
      // Sidebar（可选，Web only，md:hidden）
      sidebar={<ChatSidebar />}
      sidebarWidth="w-64"  // 默认宽度
      
      // Header（页面顶部，固定）
      header={
        <div className="h-14 px-4 flex items-center justify-between">
          <h2>Chat Title</h2>
          <button>⭐</button>
        </div>
      }
      
      // Content（中间，可独立滚动）
      content={
        <div className="space-y-4 p-4">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      }
      
      // Footer（底部，固定，通常是 Input）
      footer={
        <div className="border-t bg-background p-4">
          <ChatInput onSend={handleSend} />
        </div>
      }
      
      hideBottomNav={false}  // H5 底部导航
    />
  );
}

/**
 * 🎯 关键点：min-h-0
 * 
 * 在 InteractivePageLayout 的消息区域，必须使用：
 * <div class="flex-1 overflow-y-auto min-h-0">
 * 
 * 不能用：
 * <div class="flex-1 overflow-y-auto">  ❌ 不会滚动！
 * 
 * 原因：Flex 容器需要 min-h-0 来正确计算子元素高度
 */

// ============================================================================
// 3️⃣ HybridPageLayout - 混合型（灵活组合）
// ============================================================================

import { HybridPageLayout } from '@/shared/components/layout';

/**
 * ✅ 适用场景：
 * - 复杂后台系统（有左右侧边栏）
 * - 详情页 + 操作栏
 * - 设置页（分区控制滚动策略）
 * 
 * 特点：
 * - 最灵活的布局
 * - 支持左/右侧边栏
 * - 支持顶部/底部固定区域
 * - 内容可全局滚动或内部滚动
 * 
 * 使用方式：
 */
function AdminPageExample() {
  return (
    <HybridPageLayout
      // 左侧边栏（Web only，lg:flex）
      sidebar={<AdminSidebar />}
      
      // 右侧边栏（Web only，xl:flex）
      rightSidebar={<PropertyPanel />}
      
      // 顶部操作栏（可选）
      topBar={<FilterBar />}
      
      // 主内容区
      mainContent={<DataGrid />}
      
      // 底部操作栏（可选）
      bottomBar={<ActionButtons />}
      
      // 内容滚动策略
      internalScroll={false}  // true: 内部滚，false: 全局滚
      
      hideBottomNav={false}
      fullWidth={false}
    />
  );
}

// ============================================================================
// 📋 快速决策树
// ============================================================================

/**
 * 问题 1: 需要固定 Input/Footer 在底部吗?
 *   ├─ 是 → 问题 2
 *   └─ 否 → ScrollablePageLayout ✅
 * 
 * 问题 2: 中间内容需要独占滚动权吗?
 *   ├─ 是 → 需要 Sidebar 吗?
 *   │   ├─ 是 → 不建议，这是 InteractivePageLayout 的核心用途
 *   │   └─ 否 → InteractivePageLayout ✅
 *   └─ 否 → HybridPageLayout
 * 
 * 问题 3: 支持左右侧边栏吗?
 *   ├─ 是 → HybridPageLayout ✅
 *   └─ 否 → InteractivePageLayout 或 ScrollablePageLayout
 * 
 * 问题 4: 这是后台管理系统吗?
 *   ├─ 是 → HybridPageLayout ✅
 *   └─ 否 → InteractivePageLayout 或 ScrollablePageLayout
 */

// ============================================================================
// ⚠️ 常见错误
// ============================================================================

/**
 * ❌ 错误 1: 在 ScrollablePageLayout 中强制内部滚动
 * 
 * <ScrollablePageLayout>
 *   <div class="overflow-y-auto max-h-96">  ❌
 *     ...
 *   </div>
 * </ScrollablePageLayout>
 * 
 * ✅ 解决：直接在 ScrollablePageLayout 中放内容，会自动全局滚
 * 
 * 
 * ❌ 错误 2: InteractivePageLayout 内容不滚
 * 
 * <InteractivePageLayout
 *   content={
 *     <div class="flex-1 overflow-y-auto">  ❌ 缺少 min-h-0
 *       ...
 *     </div>
 *   }
 * />
 * 
 * ✅ 解决：加上 min-h-0
 * <div class="flex-1 overflow-y-auto min-h-0">
 * 
 * 
 * ❌ 错误 3: H5 上 Sidebar 显示
 * 
 * <aside class="w-64">  ❌ 没有响应式隐藏
 *   ...
 * </aside>
 * 
 * ✅ 解决：使用 md:hidden 或 hidden md:flex
 * <aside class="hidden md:flex w-64">
 * 
 * 
 * ❌ 错误 4: 内容被 TabBar 遮挡
 * 
 * <main>  ❌ 没有 pb-20
 *   ...
 * </main>
 * 
 * ✅ 解决：加上 pb-20 md:pb-6
 * <main class="pb-20 md:pb-6">
 */

// ============================================================================
// 🚀 快速开始模板
// ============================================================================

/**
 * 复制粘贴，开箱即用
 */

// 模板 1: 文档列表页面
function DocumentsPageTemplate() {
  return (
    <ScrollablePageLayout hideBottomNav={false}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <DocumentList />
      </div>
    </ScrollablePageLayout>
  );
}

// 模板 2: 聊天页面
function ChatPageTemplate() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  return (
    <InteractivePageLayout
      header={<ChatHeader />}
      content={
        <div className="space-y-4 p-4">
          {messages.map(msg => <Message key={msg.id} {...msg} />)}
        </div>
      }
      footer={
        <div className="border-t p-4">
          <ChatInput value={input} onChange={setInput} />
        </div>
      }
      sidebar={<ChatSidebar />}
    />
  );
}

// 模板 3: 后台管理
function AdminPageTemplate() {
  return (
    <HybridPageLayout
      sidebar={<Sidebar />}
      topBar={<TopBar />}
      mainContent={<Content />}
      rightSidebar={<PropertyPanel />}
      internalScroll={false}
    />
  );
}

// ============================================================================
// 📚 相关文档
// ============================================================================

/**
 * 详细规范：./LAYOUT_SPECIFICATION.md
 * 
 * 主要内容：
 * 1. 核心设计原则（设备差异化、高度常量、滚动策略矩阵）
 * 2. 三层布局详解（完整 CSS、使用示例、关键属性说明）
 * 3. H5 安全区域处理（刘海屏、虚拟键盘、底部间距）
 * 4. 响应式断点策略（Tailwind 配置、高度计算公式）
 * 5. 常见问题与解决方案（QA 大全）
 * 6. 性能优化清单（10+ 优化建议）
 * 7. 实际应用示例（ChatPage、DocumentsPage）
 * 8. 迁移指南（从 MainLayout 升级）
 * 9. 监听与调试（工具函数、响应式监听）
 * 10. 总结对比表（三种布局对比）
 */
