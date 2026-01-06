# GitHub Pages 部署指南

## 📋 快速开始

### 方法一：使用现有 GitHub 账户（推荐）

```bash
# 1. 初始化本地 Git 仓库
cd /Users/soovv/ty/react-proj/web
git init
git add .
git commit -m "Initial commit: DocQA React App"

# 2. 在 GitHub 创建新仓库：https://github.com/new
#    仓库名称：react-docqa-web（或自定义）
#    勾选：Public（免费需要公开）

# 3. 添加远程仓库并推送
git remote add origin https://github.com/jxiaof/react-proj.git
git branch -M main
git push -u origin main
```

### 方法二：一条命令快速推送

```bash
git init && \
git add . && \
git commit -m "Initial commit" && \
git remote add origin https://github.com/jxiaof/react-proj.git && \
git branch -M main && \
git push -u origin main
```

## 🔧 配置 GitHub Pages

### 第 1 步：进入仓库设置
1. 访问 `https://github.com/YOUR_USERNAME/react-docqa-web`
2. 点击 **Settings** → **Pages**

### 第 2 步：选择部署源
- **Source**: 选择 `GitHub Actions`
- 系统自动检测到 `.github/workflows/deploy.yml`

### 第 3 步：配置 Vite Base URL

根据你的仓库类型修改 `vite.config.ts`：

**情况 1：项目站点（`github.com/username/repo-name`）**
```typescript
base: '/react-docqa-web/',  // 改为你的仓库名
```

**情况 2：用户站点或自定义域名**
```typescript
base: '/',
```

## 🚀 部署流程

### 自动部署（首选）
```bash
# 本地修改后，推送到 main 分支
git add .
git commit -m "Update content"
git push origin main

# GitHub Actions 自动运行，2-3 分钟后网站上线
# 访问：https://YOUR_USERNAME.github.io/react-docqa-web
```

### 本地预览
```bash
npm run build    # 构建为静态文件
npm run preview  # 预览生产版本
```

## ✅ 验证部署

部署成功后（查看 Actions 标签的绿色勾），访问：

- **项目站点**：`https://YOUR_USERNAME.github.io/react-docqa-web`
- **用户站点**：`https://YOUR_USERNAME.github.io`

## 🌐 添加自定义域名（可选）

### 步骤 1：创建 CNAME 文件
```
public/CNAME 已自动创建
编辑内容为你的域名：yourdomain.com
```

### 步骤 2：配置 DNS
| 记录类型 | 名称   | 值                      |
|--------|--------|------------------------|
| CNAME  | www    | YOUR_USERNAME.github.io |
| A      | @      | 185.199.108.153        |
|        |        | 185.199.109.153        |
|        |        | 185.199.110.153        |
|        |        | 185.199.111.153        |

### 步骤 3：Settings → Pages → Custom domain
输入 `yourdomain.com`，GitHub 自动启用 HTTPS

## 📊 对标业界方案对比

| 平台 | 成本 | 配置复杂度 | 特点 |
|------|------|--------|------|
| **GitHub Pages** ⭐ | 免费 | 极简 | 自动 CI/CD，与 GitHub 集成完美 |
| Vercel | 免费+ | 很简单 | 更快的全球 CDN，但付费功能较多 |
| Netlify | 免费+ | 简单 | 功能丰富（环境变量、预发布等） |
| Cloudflare Pages | 免费 | 中等 | 全球 CDN，但需配置 DNS |

**推荐理由**：
- ✅ 完全免费，无升级压力
- ✅ 与代码仓库紧密集成
- ✅ 自动 HTTPS/2
- ✅ 无冷启动时间
- ✅ 支持自定义域名

## 🔍 故障排查

### Pages 仍显示 404

```bash
# 1. 检查 Actions 是否成功
访问 Repo → Actions → 选择最新的 Deploy → 查看日志

# 2. 确认仓库设置
Settings → Pages → Source 应该是 "GitHub Actions"

# 3. 验证文件是否推送
git log --oneline  # 查看提交历史
git status         # 查看当前状态

# 4. 强制更新
git add .
git commit --allow-empty -m "Trigger rebuild"
git push
```

### 修改仓库名称后网站 404

1. 更新 `vite.config.ts` 中的 `base`
2. 推送更新
3. 等待 Action 完成

### 自定义域名不工作

1. 检查 DNS 记录（可能需要等待 DNS 传播，最多 48 小时）
2. Settings → Pages → Custom domain → 再次输入确认
3. 确保 CNAME 文件存在于 `public/CNAME`

## 📝 环境变量和密钥

如果后期需要 API 密钥，在 Settings → Secrets and variables → Actions 中添加：

```bash
# 示例：添加 API 密钥
VITE_API_KEY=your_api_key_here
```

在代码中使用：
```typescript
const apiKey = import.meta.env.VITE_API_KEY;
```

## 🎯 最佳实践

### 1. 分支策略
```bash
# main: 生产分支（自动部署）
# develop: 开发分支（不自动部署）
# feature/*: 功能分支

git checkout -b feature/new-feature
# ... 开发 ...
git push origin feature/new-feature
# 在 GitHub 创建 Pull Request 合并到 main
```

### 2. 提交消息规范
```bash
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复 bug"
git commit -m "style: 调整样式"
git commit -m "docs: 更新文档"
```

### 3. 性能优化
- ✅ 已配置：代码压缩、Tree-shaking
- ✅ 已配置：移除 console.log（生产环境）
- 可添加：图片压缩、CDN 加速

## 🔐 安全建议

- ✅ 使用 HTTPS（GitHub Pages 自动）
- ✅ 定期更新依赖：`npm outdated`
- ✅ 检查漏洞：`npm audit`
- ⚠️ 不要提交 `.env` 文件到仓库

## 📞 获取帮助

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [React Router v7 Hash 路由](https://reactrouter.com/start/library/routing)

---

**部署完成后，你的网站：**
- 🌍 全球可访问
- 🔒 自动 HTTPS
- ⚡ CDN 加速
- 🔄 每次推送自动更新
- 💰 完全免费
