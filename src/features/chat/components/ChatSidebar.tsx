import { useCallback, useMemo } from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ConversationItem } from './ConversationItem';
import { cn } from '@/shared/utils/cn';
import { useChatStore } from '@/store/chatStore';
import type { Conversation } from '@/features/conversations/api/conversationTypes';

interface ChatSidebarProps {
  conversations: Conversation[];
  isLoading: boolean;
  activeConversationId?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreateNew: () => void;
  onSelectConversation: (id: string) => void;
  onFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function ChatSidebar({
  conversations,
  isLoading,
  activeConversationId,
  searchValue,
  onSearchChange,
  onCreateNew,
  onSelectConversation,
  onFavorite,
  onDelete,
  isMobile,
  onClose,
}: ChatSidebarProps) {
  const { isFavorite } = useChatStore();

  // 按收藏和最近使用时间分组
  const groupedConversations = useMemo(() => {
    const filtered = conversations.filter((conv) =>
      conv.title?.toLowerCase().includes(searchValue.toLowerCase())
    );

    const favorites = filtered.filter((c) => isFavorite(c.id));
    const others = filtered.filter((c) => !isFavorite(c.id));

    return { favorites, others };
  }, [conversations, searchValue, isFavorite]);

  const handleConversationSelect = useCallback(
    (id: string) => {
      onSelectConversation(id);
      if (isMobile) onClose?.();
    },
    [onSelectConversation, isMobile, onClose]
  );

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex-shrink-0 p-3 border-b border-border/30 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground hidden sm:block">对话</h2>
          <Button
            onClick={onCreateNew}
            size="sm"
            className="flex-1 sm:flex-none bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">新建</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索对话..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input/50 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner size="sm" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-center px-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">暂无对话</p>
              <p className="text-xs text-muted-foreground">点击"新建"开始对话</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-3">
            {/* Favorites Section */}
            {groupedConversations.favorites.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-xs font-semibold text-muted-foreground">收藏</h3>
                </div>
                <div className="space-y-1">
                  {groupedConversations.favorites.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      id={conv.id}
                      title={conv.title || 'Untitled'}
                      isActive={conv.id === activeConversationId}
                      isFavorite={isFavorite(conv.id)}
                      onClick={() => handleConversationSelect(conv.id)}
                      onFavorite={onFavorite}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Others Section */}
            {groupedConversations.others.length > 0 && (
              <div className="space-y-1">
                {groupedConversations.favorites.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold text-muted-foreground">最近</h3>
                  </div>
                )}
                <div className="space-y-1">
                  {groupedConversations.others.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      id={conv.id}
                      title={conv.title || 'Untitled'}
                      isActive={conv.id === activeConversationId}
                      isFavorite={isFavorite(conv.id)}
                      onClick={() => handleConversationSelect(conv.id)}
                      onFavorite={onFavorite}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}