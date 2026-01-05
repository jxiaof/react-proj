# Document Q&A Frontend

基于 React 18 + TypeScript 的文档问答系统前端应用。

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite |
| 样式 | Tailwind CSS 4 |
| 服务端状态 | TanStack Query |
| 客户端状态 | Zustand |
| HTTP | Axios |
| 路由 | React Router |

## 架构设计

```
src/
├── infrastructure/     # 基础设施层
│   ├── http/          # HTTP 客户端、拦截器
│   └── mock/          # 模拟数据 (开发环境)
│
├── shared/            # 共享层
│   ├── components/    # 通用组件
│   │   ├── ui/       # 基础 UI (Button, Card)
│   │   ├── layout/   # 布局 (Header, MainLayout)
│   │   └── feedback/ # 反馈 (Loading, Toast)
│   ├── hooks/        # 通用 Hooks
│   └── utils/        # 工具函数
│
├── features/          # 业务特性层 (按领域划分)
│   ├── documents/    # 文档管理
│   ├── conversations/# 会话管理
│   ├── chat/         # 聊天问答
│   ├── settings/     # 系统设置
│   └── home/         # 首页
│
└── store/            # 全局状态 (Zustand)
```

### 特性模块结构

每个 feature 遵循统一结构：

```
feature/
├── api/           # API 调用 + 类型定义
├── hooks/         # TanStack Query Hooks
├── components/    # 特性专用组件
├── pages/         # 页面组件
└── index.ts       # 公开导出
```

## 状态管理策略

| 状态类型 | 工具 | 示例 |
|---------|------|------|
| 服务端状态 | TanStack Query | 文档列表、会话、消息 |
| 全局UI状态 | Zustand | 主题、侧边栏 |
| 局部状态 | useState | 表单输入、临时UI状态 |

## 数据流

```
用户操作 → Hook (useQuery/useMutation) → API → Mock/Backend
    ↓
  组件更新 ← Query Cache 自动更新
```

## 响应式设计

- **桌面端**: 完整侧边栏 + 顶部导航
- **移动端**: 底部导航栏 + 抽屉式侧边栏

断点: `md: 768px`

## 主题支持

- 浅色/深色模式切换
- 支持跟随系统偏好
- 状态持久化到 localStorage

## 开发模式

开发环境自动使用 Mock 数据，无需后端即可运行完整功能：

```typescript
// 在 api 文件中
const USE_MOCK = import.meta.env.DEV;
```

## 构建

```bash
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

## 目录说明

| 目录 | 说明 |
|------|------|
| `src/infrastructure` | 与业务无关的基础能力 |
| `src/shared` | 跨特性共享的代码 |
| `src/features` | 业务特性，高内聚低耦合 |
| `src/store` | 全局客户端状态 |
