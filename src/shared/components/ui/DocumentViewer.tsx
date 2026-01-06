import { useState } from 'react';
import { X, Download, FileText } from 'lucide-react';
import { Button } from './Button';
import { DocumentPreview } from './DocumentPreview';
import { cn } from '@/shared/utils/cn';


interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
    mime_type: string;
    size: number;
    content?: string;
  };
}

export function DocumentViewer({ open, onOpenChange, document }: DocumentViewerProps) {
  const [isLoading] = useState(false);

  if (!open) return null;

  return (
    <>
      {/* Backdrop - 固定全屏 */}
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-fadeInUp"
        style={{ animationDelay: '0ms' }}
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Container - 固定全屏，flex 布局 */}
      {/* 
        关键改进：
        - H5: 完全全屏，充分利用上下空间
        - Web: 居中显示，宽度可更大 (max-w-6xl)
        - 使用 100dvh 处理动态视口高度
      */}
      <div className="fixed inset-0 z-50 flex flex-col md:items-center md:justify-center md:p-6 pointer-events-none">
        {/* 
          ========== Dialog Content ==========
          H5: 完全铺满 (inset-0)
          Web: 限制尺寸 + 居中 (max-h-[90vh], max-w-6xl)
        */}
        <div
          className={cn(
            'flex flex-col pointer-events-auto bg-background border border-border/30 overflow-hidden animate-scaleIn',
            // H5 样式：完全全屏
            'w-full h-full md:h-auto md:w-auto',
            'md:max-h-[90vh] md:max-w-6xl',
            // 边角样式
            'rounded-none md:rounded-2xl md:shadow-2xl'
          )}
          style={{
            // H5：使用动态视口高度（处理地址栏变化）
            height: 'min(100vh, 100dvh)',
            maxHeight: 'min(100vh, 100dvh)',
          }}
        >
          {/* ========== Header - 固定顶部 ========== */}
          <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 border-b border-border/20 flex-shrink-0 bg-background/95 backdrop-blur-sm h-auto">
            {/* 左侧：文件信息 */}
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <div className="h-8 md:h-10 w-8 md:w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 md:h-5 w-4 md:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-semibold truncate text-foreground">
                  {document.name}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {(document.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>

            {/* 右侧：操作按钮 */}
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  // 下载文档逻辑
                  console.log('Download:', document.name);
                }}
                className="h-8 w-8 md:h-10 md:w-10 hover:bg-muted"
                title="下载文档"
              >
                <Download className="h-4 md:h-5 w-4 md:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 md:h-10 md:w-10 hover:bg-muted"
                title="关闭预览"
              >
                <X className="h-4 md:h-5 w-4 md:w-5" />
              </Button>
            </div>
          </div>

          {/* ========== Content Area - 可滚动内容 ========== */}
          {/* 
            关键改进：
            - flex-1: 占据所有剩余空间（充分利用高度）
            - min-h-0: 让 flex 正确计算高度
            - overflow-auto: 内容可独立滚动
            - H5: 直接使用全部剩余空间
            - Web: 有额外 padding，显示更舒适
          */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 bg-background/50">
            {/* 内容容器 - H5/Web 差异化处理 */}
            <div className="w-full h-full flex flex-col items-center justify-center">
              {/* 
                H5: 紧凑布局 (p-2)
                Web: 宽松布局 (p-6)
              */}
              <div className="w-full max-w-5xl px-2 py-4 md:px-6 md:py-6">
                <DocumentPreview
                  document={document}
                  content={document.content}
                  isLoading={isLoading}
                  error={!document.content ? '文档内容不可用' : undefined}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* ========== Footer - 固定底部 ========== */}
          <div className="flex items-center justify-end gap-2 px-3 md:px-6 py-2 md:py-3 border-t border-border/20 flex-shrink-0 bg-muted/30 h-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs md:text-sm h-8 md:h-10 px-3 md:px-4"
            >
              关闭
            </Button>
            <Button
              size="sm"
              onClick={() => {
                // 打开新标签页下载
                const link = document.createElement('a');
                link.href = document.content || '#';
                link.download = document.name;
                link.click();
              }}
              className="text-xs md:text-sm h-8 md:h-10 px-3 md:px-4"
            >
              <Download className="h-3 md:h-4 w-3 md:w-4 mr-1" />
              <span className="hidden sm:inline">下载</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}