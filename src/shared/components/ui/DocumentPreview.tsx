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

  // PDF 提示
  if (docType === 'pdf') {
    return (
      <div
        className={cn(
          'flex items-center justify-center w-full rounded-lg border border-border/30 bg-muted transition-opacity duration-300',
          fadeIn ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          height: 'min(80vh, calc(100dvh - 200px))',
        }}
      >
        <div className="text-center space-y-4 animate-fadeInUp px-4">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">PDF 文档</p>
            <p className="text-xs text-muted-foreground mt-1">请下载文件查看完整内容</p>
          </div>
        </div>
      </div>
    );
  }

  // Excel 提示
  if (docType === 'excel') {
    return (
      <div
        className={cn(
          'flex items-center justify-center w-full rounded-lg border border-border/30 bg-muted transition-opacity duration-300',
          fadeIn ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{
          height: 'min(80vh, calc(100dvh - 200px))',
        }}
      >
        <div className="text-center space-y-4 animate-fadeInUp px-4">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">表格文档</p>
            <p className="text-xs text-muted-foreground mt-1">请下载文件在 Excel 中查看</p>
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 bg-background">
        {docType === 'code' ? (
          <pre className="p-3 md:p-5 text-xs md:text-sm font-mono text-foreground leading-relaxed whitespace-pre-wrap break-words h-full">
            <code>{content}</code>
          </pre>
        ) : (
          <div className="p-3 md:p-5 text-xs md:text-sm leading-relaxed h-full">
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