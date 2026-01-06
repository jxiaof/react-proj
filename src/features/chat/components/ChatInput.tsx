import { useRef, useState, useEffect, forwardRef, useCallback } from 'react';
import { Send, Paperclip, X, File, FileText, Folder } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/shared/components/ui/Dropdown';
import { cn } from '@/shared/utils/cn';

interface AttachedFile {
  id: string;
  name: string;
  type: 'file' | 'document' | 'folder';
  size?: number;
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  onAttachFile?: (files: AttachedFile[]) => void;
  onRemoveAttachment?: (fileId: string) => void;
  attachments?: AttachedFile[];
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    {
      value,
      onChange,
      onSend,
      disabled = false,
      placeholder = '输入您的问题...',
      onAttachFile,
      onRemoveAttachment,
      attachments = [],
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [attachmentDropdownOpen, setAttachmentDropdownOpen] = useState(false);

    const inputRef = (ref as React.MutableRefObject<HTMLTextAreaElement | null>) || textareaRef;

    // 自动调整高度
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        const scrollHeight = inputRef.current.scrollHeight;
        const newHeight = Math.min(Math.max(scrollHeight, 44), 120);
        inputRef.current.style.height = `${newHeight}px`;
      }
    }, [value, inputRef]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmd = isMac ? e.metaKey : e.ctrlKey;

      if (e.key === 'Enter' && isCmd) {
        e.preventDefault();
        onSend();
      }
    };

    // 处理文件上传
    const handleFileSelect = useCallback(
      (type: 'file' | 'document' | 'folder') => {
        if (type === 'file') {
          fileInputRef.current?.click();
        } else if (type === 'document') {
          // 模拟选择文档
          onAttachFile?.([
            {
              id: `doc-${Date.now()}`,
              name: '示例文档.pdf',
              type: 'document',
              size: 2048,
            },
          ]);
        } else if (type === 'folder') {
          // 模拟选择文件夹
          onAttachFile?.([
            {
              id: `folder-${Date.now()}`,
              name: '项目文件夹',
              type: 'folder',
            },
          ]);
        }
        setAttachmentDropdownOpen(false);
      },
      [onAttachFile]
    );

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;
      if (files && onAttachFile) {
        const attachedFiles: AttachedFile[] = Array.from(files).map((file) => ({
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: 'file',
          size: file.size,
        }));
        onAttachFile(attachedFiles);
      }
      // 重置 input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    // 格式化文件大小
    const formatFileSize = (bytes?: number) => {
      if (!bytes) return '';
      if (bytes < 1024) return `${bytes}B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    };

    const canSend = value.trim().length > 0 && !disabled;

    return (
      <div className="w-full space-y-2">
        {/* Attachments Display */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 md:gap-2 px-0.5">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-2.5 md:px-3 py-1.5 md:py-2 bg-muted/50 hover:bg-muted/70 rounded-lg border border-border/40 text-xs md:text-sm group transition-all duration-200"
              >
                {/* File Icon - Responsive Size */}
                {file.type === 'document' && (
                  <FileText className="h-3.5 md:h-4 w-3.5 md:w-4 text-blue-500 flex-shrink-0" />
                )}
                {file.type === 'file' && (
                  <File className="h-3.5 md:h-4 w-3.5 md:w-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                )}
                {file.type === 'folder' && (
                  <Folder className="h-3.5 md:h-4 w-3.5 md:w-4 text-amber-500 flex-shrink-0" />
                )}

                {/* File Info */}
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="font-medium truncate text-foreground">{file.name}</span>
                  {file.size && (
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveAttachment?.(file.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-background rounded active:scale-90"
                  title="移除附件"
                >
                  <X className="h-3.5 md:h-4 w-3.5 md:w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Container */}
        <div
          className={cn(
            'flex gap-0 items-stretch rounded-lg border transition-all duration-200',
            isFocused
              ? 'border-primary ring-2 ring-primary/20 bg-background'
              : 'border-input/50 bg-background'
          )}
        >
          {/* Left Zone - Attachment Button */}
          <DropdownMenu open={attachmentDropdownOpen} onOpenChange={setAttachmentDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-auto min-h-[44px] w-10 md:w-11 rounded-l-[calc(0.5rem-1px)] rounded-r-none',
                  'text-muted-foreground hover:text-foreground transition-all duration-200',
                  'border-r border-border/30',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                disabled={disabled}
                title="引用文档或文件"
              >
                <Paperclip className="h-4 md:h-5 w-4 md:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-48 md:w-56 backdrop-blur-sm bg-popover/95 dark:bg-popover/95">
              <div className="px-2 py-1.5">
                <p className="text-xs font-semibold text-muted-foreground mb-2">引用内容</p>
              </div>
              
              <DropdownMenuItem onClick={() => handleFileSelect('document')} className="gap-2">
                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-sm">选择文档</span>
                  <span className="text-xs text-muted-foreground">从项目文档中选择</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleFileSelect('folder')} className="gap-2">
                <Folder className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-sm">选择文件夹</span>
                  <span className="text-xs text-muted-foreground">包含多个文件</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleFileSelect('file')} className="gap-2">
                <File className="h-4 w-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                <div className="flex flex-col gap-0.5 flex-1">
                  <span className="text-sm">上传文件</span>
                  <span className="text-xs text-muted-foreground">从本地上传</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />

          {/* Middle Zone - Textarea */}
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground',
              'resize-none overflow-hidden scrollbar-hide',
              'max-h-[120px] min-h-[44px]',
              'px-2.5 md:px-4 py-2.5 md:py-3 text-sm md:text-base',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            rows={1}
            style={{
              lineHeight: '1.5',
              fontFamily: 'inherit',
            }}
          />

          {/* Right Zone - Send Button */}
          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className={cn(
              'flex-shrink-0 flex items-center justify-center',
              'w-10 md:w-11 h-auto min-h-[44px]',
              'bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary hover:to-primary/90',
              'text-primary-foreground active:scale-95 transition-all duration-200',
              'border-l border-primary/30',
              'rounded-r-[calc(0.5rem-1px)]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary/90 disabled:hover:to-primary/80'
            )}
            title="发送 (Cmd/Ctrl + Enter)"
            aria-label="发送消息"
          >
            <Send className="h-4 md:h-5 w-4 md:w-5" />
          </button>
        </div>

        {/* Info Text - Web Only */}
        <div className="hidden md:flex items-center justify-center gap-1.5 text-xs text-muted-foreground px-1">
          <span className="text-xs">按</span>
          <kbd className="px-2 py-1 rounded bg-muted text-foreground font-semibold text-xs inline-flex items-center whitespace-nowrap">⌘</kbd>
          <span className="text-xs">+</span>
          <kbd className="px-2 py-1 rounded bg-muted text-foreground font-semibold text-xs inline-flex items-center whitespace-nowrap">Enter</kbd>
          <span className="text-xs">快速发送</span>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';