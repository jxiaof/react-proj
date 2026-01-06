import { useCallback, useMemo, useState } from 'react';
import { Plus, Search, ChevronDown, MessageSquare } from 'lucide-react';
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
  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    recent: true,
  });

  // 按收藏和最近使用时间分组
  const groupedConversations = useMemo(() => {
    const filtered = conversations.filter((conv) =>
      conv.title?.toLowerCase().includes(searchValue.toLowerCase())
    );

    const favorites = filtered.filter((c) => isFavorite(c.id));
    const others = filtered
      .filter((c) => !isFavorite(c.id))
      .sort((a, b) => {
        const timeA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const timeB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return timeB - timeA; // 最近的在前
      });

    return { favorites, others };
  }, [conversations, searchValue, isFavorite]);

  const handleConversationSelect = useCallback(
    (id: string) => {
      onSelectConversation(id);
      if (isMobile) onClose?.();
    },
    [onSelectConversation, isMobile, onClose]
  );

  const toggleSection = (section: 'favorites' | 'recent') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur-sm border-r border-border/30">
      {/* ============ Header Section - 固定 ============ */}
      <div className="flex-shrink-0 space-y-3 p-3">
        {/* Create New Button */}
        <Button
          onClick={onCreateNew}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary text-primary-foreground shadow-sm hover:shadow-md transition-all"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          新建对话
        </Button>

        {/* Search Input - 边框常显示 */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="搜索对话..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              'w-full pl-10 pr-3 py-2 text-sm rounded-lg',
              'border border-border/60 bg-background', // 边框常显示，提升可见度
              'text-foreground placeholder:text-muted-foreground/70',
              'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50',
              'transition-all duration-200',
              'hover:border-border/80' // Hover 时加深边框
            )}
          />
        </div>
      </div>

      {/* ============ Conversations List - 可滚动 ============ */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex items-center justify-center py-8 px-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-muted mb-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-xs font-medium text-foreground">暂无对话</p>
              <p className="text-xs text-muted-foreground">点击"新建对话"开始</p>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto overflow-x-hidden flex-1 min-h-0">
            <div className="space-y-0.5 p-2">
              {/* ===== Favorites Section ===== */}
              {groupedConversations.favorites.length > 0 && (
                <div className="space-y-1">
                  {/* Section Header - Collapsible */}
                  <button
                    onClick={() => toggleSection('favorites')}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded-md',
                      'text-xs font-semibold text-muted-foreground',
                      'hover:bg-muted/50 transition-colors',
                      'group'
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        !expandedSections.favorites && '-rotate-90'
                      )}
                    />
                    <span>已收藏</span>
                    <span className="ml-auto text-xs text-muted-foreground/60">
                      {groupedConversations.favorites.length}
                    </span>
                  </button>

                  {/* Section Content */}
                  {expandedSections.favorites && (
                    <div className="space-y-0.5 ml-1">
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
                  )}
                </div>
              )}

              {/* ===== Recent Section ===== */}
              {groupedConversations.others.length > 0 && (
                <div className="space-y-1">
                  {/* Section Header - Collapsible */}
                  <button
                    onClick={() => toggleSection('recent')}
                    className={cn(
                      'w-full flex items-center gap-2 px-2 py-1.5 rounded-md',
                      'text-xs font-semibold text-muted-foreground',
                      'hover:bg-muted/50 transition-colors',
                      groupedConversations.favorites.length > 0 && 'mt-1',
                      'group'
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        !expandedSections.recent && '-rotate-90'
                      )}
                    />
                    <span>最近</span>
                    <span className="ml-auto text-xs text-muted-foreground/60">
                      {groupedConversations.others.length}
                    </span>
                  </button>

                  {/* Section Content */}
                  {expandedSections.recent && (
                    <div className="space-y-0.5 ml-1">
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
                  )}
                </div>
              )}

              {/* No Results */}
              {searchValue && groupedConversations.favorites.length === 0 && groupedConversations.others.length === 0 && (
                <div className="flex items-center justify-center py-8 px-4 text-center">
                  <div className="space-y-2">
                    <Search className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                    <p className="text-xs text-muted-foreground">未找到匹配的对话</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============ Divider ============ */}
      <div className="flex-shrink-0 h-px bg-border/30" />

      {/* ============ Footer Info - 固定 ============ */}
      <div className="flex-shrink-0 px-3 py-2 text-xs text-muted-foreground/60 text-center">
        <p>Cmd+K 切换侧边栏</p>
      </div>
    </div>
  );
}