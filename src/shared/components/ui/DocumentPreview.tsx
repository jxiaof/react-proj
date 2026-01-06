import { useEffect, useState } from 'react';
import { FileText, AlertCircle, Copy, Check } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/shared/utils/cn';

interface DocumentPreviewProps {
  document: {
    id: string;
    name: string;
    mime_type: string;
    size: number;
  };
  content?: string;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export function DocumentPreview({
  document,
  content,
  isLoading = false,
  error,
  className,
}: DocumentPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, [content, error, isLoading]);

  const getDocumentType = (mimeType: string) => {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('markdown')) return 'text';
    if (mimeType.includes('text/plain')) return 'text';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'text';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'excel';
    if (mimeType.includes('image')) return 'image';
    if (
      mimeType.includes('json') ||
      mimeType.includes('xml') ||
      mimeType.includes('javascript') ||
      mimeType.includes('typescript') ||
      mimeType.includes('text/plain')
    )
      return 'code';
    return 'unsupported';
  };

  const getFileExtension = (name: string) => {
    return name.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const docType = getDocumentType(document.mime_type);

  // 加载状态
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center w-full h-64 md:h-96', className)}>
        <div className="text-center space-y-4 animate-fadeInUp">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
          <p className="text-sm text-muted-foreground">加载文档中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error || !content) {
    return (
      <div
        className={cn(
          'flex items-center justify-center w-full h-64 md:h-96 transition-all duration-300 rounded-lg border border-border/30 bg-muted/50',
          fadeIn ? 'opacity-100' : 'opacity-0',
          className
        )}
      >
        <div className="text-center space-y-4 px-4 animate-fadeInUp">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">无法加载文档</p>
            <p className="text-xs text-muted-foreground mt-1">
              {error || '当前文档不可访问或格式不支持'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 图片预览 - 充分利用空间
  if (docType === 'image') {
    return (
      <div
        className={cn(
          'w-full rounded-lg overflow-hidden bg-muted flex items-center justify-center transition-opacity duration-300',
          fadeIn ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          // H5: 充分使用高度 (70vh)
          // Web: 更大的显示空间 (80vh)
          maxHeight: 'min(80vh, calc(100dvh - 200px))',
          height: 'auto',
        }}
      >
        <img
          src={content}
          alt={document.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  // PDF 提示 - 优化宽度
  if (docType === 'pdf') {
    return (
      <div
        className={cn(
          'flex items-center justify-center w-full rounded-lg border border-border/30 bg-gradient-to-br from-muted to-muted/50 transition-all duration-300',
          'hover:border-primary/30 hover:shadow-md',
          fadeIn ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          height: 'min(80vh, calc(100dvh - 200px))',
          // H5: 最小宽度充分利用，Web: 自适应宽度
          minWidth: '100%',
        }}
      >
        <div className="text-center space-y-4 md:space-y-6 animate-fadeInUp px-4 md:px-12 max-w-xl">
          {/* Icon Container - 响应式大小 */}
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center h-16 md:h-20 w-16 md:w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <FileText className="h-8 md:h-10 w-8 md:w-10 text-primary" />
            </div>
          </div>

          {/* Title - 响应式字体 */}
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
              PDF 文档预览
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              此 PDF 文档无法在线预览。请点击下方按钮下载文件，使用 PDF 阅读器查看完整内容。
            </p>
          </div>

          {/* Features List - 仅 Web 显示 */}
          <div className="hidden md:grid md:grid-cols-2 gap-3 md:gap-4 pt-2 md:pt-4">
            <div className="text-left space-y-1.5 p-3 rounded-lg bg-background/50 border border-border/30">
              <p className="text-xs font-medium text-primary flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary text-xs">✓</span>
                完整保存
              </p>
              <p className="text-xs text-muted-foreground">保留原始格式和内容</p>
            </div>
            <div className="text-left space-y-1.5 p-3 rounded-lg bg-background/50 border border-border/30">
              <p className="text-xs font-medium text-primary flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary text-xs">✓</span>
                离线查看
              </p>
              <p className="text-xs text-muted-foreground">随时随地打开查看</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 md:pt-4">
            <p className="text-xs text-muted-foreground mb-3">
              推荐使用 Adobe Reader、Chrome 或其他 PDF 阅读器
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Excel 提示 - 同样优化
  if (docType === 'excel') {
    return (
      <div
        className={cn(
          'flex items-center justify-center w-full rounded-lg border border-border/30 bg-gradient-to-br from-muted to-muted/50 transition-all duration-300',
          'hover:border-primary/30 hover:shadow-md',
          fadeIn ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          height: 'min(80vh, calc(100dvh - 200px))',
          minWidth: '100%',
        }}
      >
        <div className="text-center space-y-4 md:space-y-6 animate-fadeInUp px-4 md:px-12 max-w-xl">
          {/* Icon Container */}
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center h-16 md:h-20 w-16 md:w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <FileText className="h-8 md:h-10 w-8 md:w-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground">
              表格文档预览
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              此表格文档无法在线预览。请点击下方按钮下载文件，使用 Excel、Google Sheets 或其他电子表格应用查看。
            </p>
          </div>

          {/* Features List - 仅 Web 显示 */}
          <div className="hidden md:grid md:grid-cols-2 gap-3 md:gap-4 pt-2 md:pt-4">
            <div className="text-left space-y-1.5 p-3 rounded-lg bg-background/50 border border-border/30">
              <p className="text-xs font-medium text-primary flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary text-xs">✓</span>
                公式保留
              </p>
              <p className="text-xs text-muted-foreground">保留所有公式和计算</p>
            </div>
            <div className="text-left space-y-1.5 p-3 rounded-lg bg-background/50 border border-border/30">
              <p className="text-xs font-medium text-primary flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary text-xs">✓</span>
                格式完整
              </p>
              <p className="text-xs text-muted-foreground">保留图表、样式等内容</p>
            </div>
          </div>

          {/* Info */}
          <div className="pt-2 md:pt-4">
            <p className="text-xs text-muted-foreground">
              支持的应用：Excel、Google Sheets、LibreOffice 等
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 文本/代码预览 - 充分利用全部空间
  return (
    <div
      className={cn(
        'w-full rounded-lg overflow-hidden border border-border/50 bg-muted/30 transition-all duration-300 flex flex-col',
        fadeIn ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        // 关键改进：充分利用可用高度
        // H5: min(80vh, calc(100dvh - 200px))
        // Web: 同样逻辑，但由于有更多空间，实际显示会更大
        height: 'min(80vh, calc(100dvh - 200px))',
        maxHeight: 'min(80vh, calc(100dvh - 200px))',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 md:px-5 py-2 md:py-3 border-b border-border/30 bg-muted/50 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FileText className="h-4 md:h-5 w-4 md:w-5 text-primary flex-shrink-0" />
          <span className="text-xs md:text-sm font-medium truncate text-foreground">
            {document.name}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            ({getFileExtension(document.name)})
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="text-xs flex-shrink-0 hover:bg-muted h-8 md:h-9"
          title="复制全部内容"
        >
          {copied ? (
            <>
              <Check className="h-3 md:h-4 w-3 md:w-4 mr-1" />
              <span className="hidden sm:inline">已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-3 md:h-4 w-3 md:w-4 mr-1" />
              <span className="hidden sm:inline">复制</span>
            </>
          )}
        </Button>
      </div>

      {/* Content - 占据所有剩余空间 */}
      <div className="flex-1 overflow-auto min-h-0 bg-background">
        {docType === 'code' ? (
          // 代码块：最小宽度 + 左右滚动
          <pre className="p-3 md:p-5 text-xs md:text-sm font-mono text-foreground leading-relaxed whitespace-pre h-full inline-block min-w-full md:min-w-[800px]">
            <code>{content}</code>
          </pre>
        ) : (
          // 文本：最小宽度 + 左右滚动
          <div className="p-3 md:p-5 text-xs md:text-sm leading-relaxed h-full inline-block min-w-full md:min-w-[600px]">
            <div className="whitespace-pre-wrap break-words text-foreground text-justify">
              {content}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 md:px-5 py-2 border-t border-border/30 bg-muted/50 text-xs text-muted-foreground flex items-center justify-between flex-shrink-0">
        <span className="truncate">{(content || '').length} 字符</span>
        <span className="hidden sm:inline">{document.mime_type.split('/')[1]?.toUpperCase() || '文本'}</span>
      </div>
    </div>
  );
}