import { useEffect, useRef } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Send, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface ExpandedChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  disabled?: boolean;
}

export function ExpandedChatInput({
  value,
  onChange,
  onSend,
  onClose,
  disabled = false,
}: ExpandedChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isMetaKey = isMac ? e.metaKey : e.ctrlKey;

    if (e.key === 'Enter' && isMetaKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <h3 className="text-base font-semibold">输入消息</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-muted"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col p-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入您的问题..."
          disabled={disabled}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg border border-input bg-background',
            'text-sm placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent',
            'transition-all resize-none',
            'input-h5-optimized',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />

        {/* Word count */}
        <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
          <span>Cmd/Ctrl + Enter 发送</span>
          <span>{value.length} 字</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-2 p-4 border-t flex-shrink-0">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={disabled}
        >
          取消
        </Button>
        <Button
          className="flex-1 bg-gradient-to-r from-primary to-primary/90"
          onClick={onSend}
          disabled={!value.trim() || disabled}
        >
          <Send className="h-4 w-4 mr-2" />
          发送
        </Button>
      </div>
    </div>
  );
}