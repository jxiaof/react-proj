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
    // 触发淡入动画
    setFadeIn(true);
  }, [content, error, isLoading]);

  const getDocumentType = (mimeType: string) => {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('markdown') || mimeType.includes('text/plain')) return 'text';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'text';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'excel';
    if (mimeType.includes('image')) return 'image';
    if (
      mimeType.includes('json') ||
      mimeType.includes('xml') ||
      mimeType.includes('javascript') ||
      mimeType.includes('typescript')
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
      <div className={cn('flex items-center justify-center h-80 md:h-96', className)}>
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
          'flex items-center justify-center h-80 md:h-96 transition-all duration-300',
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

  // 图片预览
  if (docType === 'image') {
    return (
      <div
        className={cn(
          'w-full h-80 md:h-96 rounded-xl overflow-hidden bg-muted flex items-center justify-center transition-opacity duration-300',
          fadeIn ? 'opacity-100' : 'opacity-0',
          className
        )}
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
          'flex items-center justify-center h-80 md:h-96 bg-muted rounded-xl transition-opacity duration-300',
          fadeIn ? 'opacity-100' : 'opacity-0',
          className
        )}
      >
        <div className="text-center space-y-4 animate-fadeInUp">
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
          'flex items-center justify-center h-80 md:h-96 bg-muted rounded-xl transition-opacity duration-300',
          fadeIn ? 'opacity-100' : 'opacity-0',
          className
        )}
      >
        <div className="text-center space-y-4 animate-fadeInUp">
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

  // 文本/代码预览
  return (
    <div
      className={cn(
        'w-full rounded-xl overflow-hidden border border-border/50 bg-muted/30 transition-all duration-300',
        fadeIn ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-border/30 bg-muted/50">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FileText className="h-4 w-4 text-primary flex-shrink-0" />
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
          className="text-xs flex-shrink-0 hover:bg-muted"
          title="复制全部内容"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">已复制</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">复制</span>
            </>
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="overflow-auto max-h-80 md:max-h-96 bg-background">
        {docType === 'code' ? (
          <pre className="p-4 md:p-5 text-xs md:text-sm font-mono text-foreground leading-relaxed whitespace-pre-wrap break-words">
            <code>{content}</code>
          </pre>
        ) : (
          <div className="p-4 md:p-5 text-xs md:text-sm leading-relaxed">
            <div className="whitespace-pre-wrap break-words text-foreground text-justify">
              {content}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 md:px-5 py-2 md:py-3 border-t border-border/30 bg-muted/50 text-xs text-muted-foreground flex items-center justify-between">
        <span>{(content || '').length} 字符</span>
        <span>{document.mime_type.split('/')[1]?.toUpperCase() || '文本'}</span>
      </div>
    </div>
  );
}