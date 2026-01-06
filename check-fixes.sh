#!/bin/bash

# 快速检查修复状态

echo "✅ 检查修复列表："
echo ""

# 1. 检查 QueryClientProvider
if grep -q "QueryClientProvider" src/main.tsx; then
    echo "✅ [1/5] QueryClientProvider 已添加到 main.tsx"
else
    echo "❌ [1/5] QueryClientProvider 缺失"
fi

# 2. 检查 index.css 禁用滚动
if grep -q "overflow: hidden" src/index.css; then
    echo "✅ [2/5] index.css 已禁用全局滚动"
else
    echo "❌ [2/5] index.css 未禁用全局滚动"
fi

# 3. 检查 index.html 禁用滚动
if grep -q "overflow: hidden" index.html; then
    echo "✅ [3/5] index.html 已禁用全局滚动"
else
    echo "❌ [3/5] index.html 未禁用全局滚动"
fi

# 4. 检查 InteractivePageLayout 存在
if [ -f src/shared/components/layout/InteractivePageLayout.tsx ]; then
    echo "✅ [4/5] InteractivePageLayout.tsx 已创建"
else
    echo "❌ [4/5] InteractivePageLayout.tsx 不存在"
fi

# 5. 检查 ScrollablePageLayout 存在
if [ -f src/shared/components/layout/ScrollablePageLayout.tsx ]; then
    echo "✅ [5/5] ScrollablePageLayout.tsx 已创建"
else
    echo "❌ [5/5] ScrollablePageLayout.tsx 不存在"
fi

echo ""
echo "📝 下一步："
echo "1. npm run dev (重新启动开发服务器)"
echo "2. 打开浏览器检查页面是否有全局滚动条"
echo "3. 在控制台运行: window.debugLayout() 查看高度信息"
