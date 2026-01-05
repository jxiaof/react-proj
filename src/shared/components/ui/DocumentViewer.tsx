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
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-fadeInUp"
        style={{ animationDelay: '0ms' }}
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex flex-col md:items-center md:justify-center p-3 md:p-4 pointer-events-none md:p-4">
        <div className="flex flex-col h-full md:h-auto md:max-h-[85vh] md:w-full md:max-w-5xl bg-background rounded-lg md:rounded-2xl pointer-events-auto shadow-xl md:shadow-2xl border border-border/30 overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border/20 flex-shrink-0 bg-background">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm md:text-base font-semibold truncate text-foreground">
                  {document.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(document.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="flex-shrink-0 hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">
              <DocumentPreview
                document={document}
                content={document.content}
                isLoading={isLoading}
                error={!document.content ? '文档内容不可用' : undefined}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-4 md:px-6 py-3 md:py-4 border-t border-border/20 flex-shrink-0 bg-muted/30">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs md:text-sm"
            >
              关闭
            </Button>
            <Button
              size="sm"
              className="text-xs md:text-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary text-primary-foreground active:scale-95 transition-all"
              onClick={() => {
                const link = document.createElement('a');
                link.href = `/api/documents/${document.id}/download`;
                link.download = document.name;
                link.click();
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              下载
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}