import { useRef, useState, useEffect, forwardRef } from 'react';
import { Send, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/shared/utils/cn';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  onNewChat?: () => void;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    {
      value,
      onChange,
      onSend,
      disabled = false,
      placeholder = '输入问题...',
      onNewChat,
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = useState(false);

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

    return (
      <div className="w-full space-y-0">
        {/* Input Container */}
        <div
          className={cn(
            'flex gap-0 items-stretch rounded-lg border transition-all duration-200',
            isFocused
              ? 'border-primary ring-2 ring-primary/20 bg-background'
              : 'border-input/50 bg-background hover:border-primary/30'
          )}
        >
          {/* Left Zone - New Chat Button */}
          <button
            type="button"
            onClick={onNewChat}
            disabled={disabled}
            className={cn(
              'flex-shrink-0 flex items-center justify-center',
              'w-11 h-auto min-h-[44px]',
              'bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10',
              'text-primary transition-all duration-200 active:scale-95 border-r border-border/30',
              'rounded-l-[calc(0.5rem-1px)]',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            title="新建对话"
            aria-label="新建对话"
          >
            <Plus className="h-5 w-5" />
          </button>

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
              'px-3 md:px-4 py-3',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            rows={1}
            style={{ 
              lineHeight: '1.5',
              fontFamily: 'inherit'
            }}
          />

          {/* Right Zone - Send Button */}
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className={cn(
              'flex-shrink-0 flex items-center justify-center',
              'w-11 h-auto min-h-[44px]',
              'bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary hover:to-primary/90',
              'text-primary-foreground active:scale-95 transition-all',
              'border-l border-primary/30',
              'rounded-r-[calc(0.5rem-1px)]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary/90 disabled:hover:to-primary/80'
            )}
            title="发送 (Cmd/Ctrl + Enter)"
            aria-label="发送消息"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';