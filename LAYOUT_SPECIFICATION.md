# 企业级 Web/H5 响应式布局规范

## 📋 版本信息
- **文档版本**: 1.0
- **更新日期**: 2026-01-06
- **适用项目**: React DocQA 应用
- **参考标准**: ChatGPT Web、WeChat Web、Slack 等业界标准

---

## 1. 核心设计原则

### 1.1 设备差异化处理
```
┌─ Web 端 (≥768px)           ┌─ H5 端 (<768px)
│  ├─ Header (固定, 56px)    │  ├─ Header (固定, 56px)
│  ├─ Sidebar (可选)          │  ├─ Content (内部或全局滚)
│  ├─ Content (滚动)          │  └─ TabBar (固定, 64px, safe-area)
│  └─ Footer (可选)           │
│                            └─ 无 Sidebar
```

### 1.2 关键高度常量
```javascript
const HEIGHTS = {
  HEADER: 56,           // 顶部导航栏
  MOBILE_TABBAR: 64,    // H5 底部导航（含 safe-area）
  DESKTOP_SIDEBAR: 256, // 桌面侧边栏宽度
  INPUT_MIN: 44,        // 输入框最小高度
};
```

### 1.3 滚动策略矩阵

| 页面类型 | 场景 | Web 滚动 | H5 滚动 | 推荐布局 |
|---------|------|--------|--------|---------|
| **数据展示** | 文档列表、首页 | 全局滚 | 全局滚 | ScrollablePageLayout |
| **实时交互** | 聊天、客服 | 消息独占 | 消息独占 | InteractivePageLayout |
| **混合型** | 设置页面 | 分区滚 | 分区滚 | HybridPageLayout |

---

## 2. 三层布局系统

### 2.1 ScrollablePageLayout（数据展示类）

**适用页面**：DocumentsPage、HomePage、SettingsPage（列表模式）

**结构**：
```
┌─────────────────────────────┐
│  Header (flex-shrink-0)     │  56px
├─────────────────────────────┤
│                             │
│  Main Content (flex-1)      │  全局 overflow-y-auto
│  - Can scroll globally      │
│                             │
├─────────────────────────────┤
│  TabBar (md:hidden)         │  64px (H5 only)
└─────────────────────────────┘
```

**关键 CSS**：
```tailwind
<div class="flex flex-col h-screen bg-background">
  <Header /> {/* flex-shrink-0 h-14 */}
  <main class="flex-1 overflow-y-auto overflow-x-hidden">
    {/* pb-20 md:pb-6 for TabBar clearance */}
  </main>
  <MobileNav /> {/* md:hidden */}
</div>
```

**使用示例**：
```tsx
import { ScrollablePageLayout } from '@/shared/components/layout';

export function DocumentsPage() {
  return (
    <ScrollablePageLayout hideBottomNav={false}>
      {/* Content scrolls globally */}
      <DocumentList />
    </ScrollablePageLayout>
  );
}
```

### 2.2 InteractivePageLayout（实时交互类）

**适用页面**：ChatPage、RealTimeApp

**结构**：
```
┌──────────────────────────────────────┐
│  Header (flex-shrink-0)              │  56px
├──────────────────────────────────────┤
│ Sidebar  │                           │
│ (w-64)   │  Main Content (flex-1)    │
│          │  - overflow-y-auto       │
│          │  - Independent scroll    │
│          ├──────────────────────────┤
│          │  Footer / Input (shrink) │
└──────────────────────────────────────┘
         H5: Sidebar hidden via md:hidden
         TabBar: 64px (H5 only)
```

**关键 CSS 属性**：
```tailwind
{/* 外层 */}
<div class="flex flex-col h-screen overflow-hidden">
  {/* 内层 flex 容器 */}
  <div class="flex flex-1 overflow-hidden min-h-0">
    {/* Sidebar - optional, Web only */}
    <aside class="hidden md:flex w-64">...</aside>
    
    {/* Chat Content */}
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      {/* Header */}
      <header class="flex-shrink-0 h-14">...</header>
      
      {/* Messages - 关键！min-h-0 让 flex 正确计算 */}
      <div class="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {/* Content */}
      </div>
      
      {/* Input */}
      <div class="flex-shrink-0 border-t bg-background">...</div>
    </div>
  </div>
</div>
```

**min-h-0 的作用**：
```
❌ 没有 min-h-0：
  <div class="flex-1 overflow-y-auto">
    内容超出容器，scrollbar 无效，不滚动

✅ 有 min-h-0：
  <div class="flex-1 overflow-y-auto min-h-0">
    flex 正确计算高度，scrollbar 有效，可滚动
```

**使用示例**：
```tsx
import { InteractivePageLayout } from '@/shared/components/layout';

export function ChatPage() {
  return (
    <InteractivePageLayout
      sidebar={<ChatSidebar />}
      header={<ChatHeader />}
      content={<MessagesList />}
      footer={<ChatInput />}
    />
  );
}
```

### 2.3 HybridPageLayout（混合类）

**适用页面**：复杂后台系统、DetailPage + Sidebar

**特点**：
- 支持左/右侧边栏
- 支持顶部/底部固定区域
- 灵活的内容滚动策略（全局 or 内部）

---

## 3. H5 安全区域处理

### 3.1 刘海屏/挖孔屏

```css
/* 使用 CSS 变量 */
env(safe-area-inset-top)     /* 顶部安全距离 */
env(safe-area-inset-bottom)  /* 底部安全距离 */
env(safe-area-inset-left)    /* 左侧安全距离 */
env(safe-area-inset-right)   /* 右侧安全距离 */

/* 应用到 TabBar */
.mobile-nav {
  padding-bottom: calc(1rem + max(0px, env(safe-area-inset-bottom)));
  /* 或 Tailwind: safe-area-pb */
}
```

### 3.2 虚拟键盘处理

```javascript
// 监听虚拟键盘弹起
const handleInput = (e) => {
  // iOS 虚拟键盘会推起页面
  // 解决方案：使用 InteractivePageLayout，Input 固定在底部
  e.currentTarget.scrollIntoView({ behavior: 'smooth' });
};

// Viewport Meta 标签
<meta name="viewport" 
  content="width=device-width, initial-scale=1, viewport-fit=cover, 
           minimum-scale=1, maximum-scale=5, user-scalable=yes" />
```

### 3.3 底部导航间距

```tsx
{/* H5 内容需要 pb-20（md:pb-6）为 TabBar 留空 */}
<main className="pb-20 md:pb-6">
  <div className="max-w-7xl mx-auto p-4">
    {/* Content */}
  </div>
</main>

{/* TabBar */}
<nav className="fixed bottom-0 left-0 right-0 md:hidden h-16">
  {/* Items */}
</nav>
```

---

## 4. 响应式断点策略

### 4.1 Tailwind 断点映射

```javascript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',    // 手机横屏
      'md': '768px',    // 平板 / Web
      'lg': '1024px',   // 桌面
      'xl': '1280px',   // 大桌面
      '2xl': '1536px',  // 超大屏
    },
  },
};

// 使用示例
<div className="w-full md:w-64 lg:w-80">
  {/* Mobile: full width, Tablet/Web: 256px or 320px */}
</div>
```

### 4.2 页面高度计算（关键公式）

```javascript
// Web 端（≥768px）
const webHeight = `calc(100vh - 56px)`;

// H5 端（<768px）
const h5Height = `calc(100vh - 56px - 64px - max(0px, env(safe-area-inset-bottom)))`;

// 消息区高度（Content 在 flex-1）
// 自动计算 = 总高度 - Header - Footer
```

---

## 5. 常见问题与解决方案

### Q1: 消息列表不能滚动？
```tsx
❌ <div class="flex-1 overflow-y-auto">  
✅ <div class="flex-1 overflow-y-auto min-h-0">
   // min-h-0 让 flex 容器正确计算高度
```

### Q2: H5 输入框被虚拟键盘遮挡？
```tsx
// ✅ 使用 InteractivePageLayout
<InteractivePageLayout
  footer={<ChatInput />}  // 固定在底部，键盘弹起时会推起
/>

// 手动处理：
input.addEventListener('focus', () => {
  setTimeout(() => {
    input.scrollIntoView({ behavior: 'smooth' });
  }, 300); // 等待键盘弹起
});
```

### Q3: Sidebar 在 H5 显示？
```tsx
// ✅ 使用响应式隐藏
<aside className="hidden md:flex w-64">
  {/* Sidebar - H5 隐藏 */}
</aside>
```

### Q4: TabBar 覆盖内容？
```tsx
// ✅ 为底部内容预留空间
<main className="pb-20 md:pb-6">
  {/* pb-20 在 H5，pb-6 在 Web */}
</main>
```

### Q5: Dark Mode 过渡不流畅？
```tsx
// ✅ 使用 transition 和 duration
<div className="bg-background transition-colors duration-300">
  {/* 背景颜色平滑切换 */}
</div>
```

---

## 6. 性能优化清单

- ✅ 使用 `min-h-0` 在 flex 容器中避免计算错误
- ✅ 用 `overflow-x-hidden` 代替 `overflow-hidden` 防止横向滚动条
- ✅ 消息列表使用虚拟滚动（大数据集）
- ✅ 使用 `useCallback` 避免不必要的重新渲染
- ✅ 图片使用 lazy loading 和 CDN 优化
- ✅ 消息区域使用 `scroll-behavior: smooth` 平滑滚动
- ✅ H5 上使用 `-webkit-overflow-scrolling: touch` 启用惯性滚动

```css
.messages-container {
  -webkit-overflow-scrolling: touch; /* H5 惯性滚动 */
  scroll-behavior: smooth;           /* 平滑滚动 */
}
```

---

## 7. 实际应用示例

### 示例 1：ChatPage（完整示例）

```tsx
import { InteractivePageLayout } from '@/shared/components/layout';

export function ChatPage() {
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 自动滚到底部
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <InteractivePageLayout
      sidebar={<ChatSidebar />}
      header={
        <div className="h-14 px-4 flex items-center">
          <h1>Chat</h1>
        </div>
      }
      content={
        <div ref={messagesRef} className="space-y-4 p-4">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      }
      footer={
        <div className="border-t bg-background p-4">
          <ChatInput onSend={handleSend} />
        </div>
      }
    />
  );
}
```

### 示例 2：DocumentsPage（简单示例）

```tsx
import { ScrollablePageLayout } from '@/shared/components/layout';

export function DocumentsPage() {
  const [documents] = useState([]);

  return (
    <ScrollablePageLayout hideBottomNav={false}>
      <div className="space-y-6">
        <h1>My Documents</h1>
        <DocumentList documents={documents} />
      </div>
    </ScrollablePageLayout>
  );
}
```

---

## 8. 迁移指南（从 MainLayout）

### 步骤 1：识别页面类型
- 是否需要固定 Input/Footer? → InteractivePageLayout
- 是否全局可滚动? → ScrollablePageLayout
- 是否支持侧边栏? → HybridPageLayout

### 步骤 2：替换导入
```tsx
// 旧
import { MainLayout } from '@/shared/components/layout/MainLayout';

// 新
import { ScrollablePageLayout } from '@/shared/components/layout';
// 或
import { InteractivePageLayout } from '@/shared/components/layout';
```

### 步骤 3：更新 JSX 结构
```tsx
// 旧
<MainLayout hideBottomNav={false} fullWidth={false}>
  <YourContent />
</MainLayout>

// 新（数据展示类）
<ScrollablePageLayout hideBottomNav={false}>
  <YourContent />
</ScrollablePageLayout>

// 新（实时交互类）
<InteractivePageLayout
  header={<Header />}
  content={<Content />}
  footer={<Footer />}
  sidebar={<Sidebar />}
/>
```

---

## 9. 监听与调试

### 调试工具
```javascript
// 检查布局高度
function debugLayoutHeights() {
  const viewport = window.innerHeight;
  const header = document.querySelector('header')?.offsetHeight;
  const tabbar = document.querySelector('[role="navigation"]')?.offsetHeight;
  const content = document.querySelector('[role="main"]')?.offsetHeight;
  
  console.log({
    viewport,
    header,
    tabbar,
    content,
    calculated: viewport - (header || 0) - (tabbar || 0),
  });
}

// 响应式断点监听
const mq = window.matchMedia('(min-width: 768px)');
mq.addEventListener('change', (e) => {
  console.log(e.matches ? 'Web mode' : 'H5 mode');
});
```

---

## 10. 总结对比表

| 特性 | ScrollablePageLayout | InteractivePageLayout | HybridPageLayout |
|------|---------------------|---------------------|------------------|
| **全局滚动** | ✅ | ❌ | ✅（可配置） |
| **内部滚动** | ❌ | ✅ | ✅（可配置） |
| **Sidebar** | ❌ | ✅ | ✅ |
| **Header 固定** | ✅ | ✅ | ✅ |
| **Footer 固定** | ❌ | ✅ | ✅ |
| **适合聊天** | ❌ | ✅⭐ | ⚠️ |
| **适合列表** | ✅⭐ | ❌ | ⚠️ |
| **适合后台** | ⚠️ | ❌ | ✅⭐ |
| **H5 友好** | ✅ | ✅⭐ | ✅ |
| **复杂度** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

**版权声明**：本规范参考业界标准应用（ChatGPT Web、WeChat、Slack 等），遵循 React 最佳实践。
