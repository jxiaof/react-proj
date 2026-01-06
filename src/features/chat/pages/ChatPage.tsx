import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { PageTransition } from '@/shared/components/PageTransition';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ChatInput } from '../components/ChatInput';
import { ChatSidebar } from '../components/ChatSidebar';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { Plus, Menu, X, Star } from 'lucide-react';
import { useConversations, useCreateConversation, useDeleteConversation } from '@/features/conversations/hooks/useConversations';
import { useMessages, useSendMessage } from '../hooks/useChat';
import { useChatStore } from '@/store/chatStore';
import { cn } from '@/shared/utils/cn';

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  
  // UI State
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [attachments, setAttachments] = useState<Array<{ id: string; name: string; type: 'file' | 'document' | 'folder'; size?: number }>>([]);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // Chat Store
  const { addFavorite, removeFavorite, isFavorite } = useChatStore();

  // Queries & Mutations
  const { data: conversationsData, isLoading: loadingConversations } = useConversations();
  const { data: messagesData, isLoading: loadingMessages } = useMessages(conversationId);
  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage();
  const deleteConversation = useDeleteConversation();

  // Data
  const conversations = conversationsData?.data ?? [];
  const messages = messagesData?.data ?? [];
  const activeConversation = conversations.find((c) => c.id === conversationId);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Redirect to first conversation if no active conversation
  useEffect(() => {
    if (!conversationId && conversations.length > 0) {
      navigate(`/chat/${conversations[0].id}`, { replace: true });
    }
  }, [conversationId, conversations, navigate]);

  // Focus input on conversation change
  useEffect(() => {
    setSidebarOpen(false);
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 100);
  }, [conversationId]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Handlers
  const handleNewChat = useCallback(() => {
    createConversation.mutate(
      { document_ids: [] },
      {
        onSuccess: (response) => {
          navigate(`/chat/${response.data.id}`);
        },
      }
    );
  }, [createConversation, navigate]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || !conversationId) return;

    sendMessage.mutate(
      { conversation_id: conversationId, content: inputValue },
      {
        onSuccess: () => {
          setInputValue('');
          setTimeout(() => {
            chatInputRef.current?.focus();
            scrollToBottom();
          }, 100);
        },
      }
    );
  }, [inputValue, conversationId, sendMessage, scrollToBottom]);

  const handleFavorite = useCallback(
    (id: string) => {
      if (isFavorite(id)) {
        removeFavorite(id);
      } else {
        addFavorite(id);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  const handleDeleteConversation = useCallback(
    (id: string) => {
      const conv = conversations.find((c) => c.id === id);
      if (conv) {
        setDeleteConfirm({ id, title: conv.title || 'Untitled' });
      }
    },
    [conversations]
  );

  const confirmDelete = useCallback(() => {
    if (!deleteConfirm) return;
    deleteConversation.mutate(deleteConfirm.id, {
      onSuccess: () => {
        setDeleteConfirm(null);
        if (conversationId === deleteConfirm.id) {
          navigate('/chat');
        }
      },
    });
  }, [deleteConfirm, deleteConversation, conversationId, navigate]);

  return (
    <PageTransition>
      <MainLayout hideBottomNav={false} fullWidth>
        <div className="flex h-full overflow-hidden bg-background">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={cn(
              'fixed md:relative inset-y-0 left-0 z-50 w-64 h-full transition-all duration-300',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
              'md:flex md:flex-col md:border-r md:border-border/30'
            )}
          >
            <ChatSidebar
              conversations={conversations}
              isLoading={loadingConversations}
              activeConversationId={conversationId}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onCreateNew={handleNewChat}
              onSelectConversation={(id) => navigate(`/chat/${id}`)}
              onFavorite={handleFavorite}
              onDelete={handleDeleteConversation}
              isMobile={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>

          {/* Main Chat Area */}
          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3 md:px-4 py-3 border-b border-border/30 flex-shrink-0 bg-background/50 backdrop-blur-sm h-14">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  title="切换侧边栏 (Cmd+K)"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {/* Title */}
                <div className="min-w-0">
                  <h2 className="text-sm md:text-base font-semibold truncate text-foreground">
                    {activeConversation?.title || '新对话'}
                  </h2>
                  <p className="text-xs text-muted-foreground">AI 助手</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Favorite Button */}
                {conversationId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => handleFavorite(conversationId)}
                    title={isFavorite(conversationId) ? '取消收藏' : '收藏对话'}
                  >
                    <Star
                      className={cn(
                        'h-5 w-5',
                        isFavorite(conversationId)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-muted-foreground'
                      )}
                    />
                  </Button>
                )}

                {/* New Chat Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={handleNewChat}
                  disabled={createConversation.isPending}
                  title="新建对话"
                >
                  {createConversation.isPending ? (
                    <div className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Messages Container */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto min-h-0 flex flex-col"
            >
              {!conversationId ? (
                <div className="flex flex-1 items-center justify-center p-4">
                  <div className="text-center max-w-sm space-y-4">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">创建新对话</h3>
                    <p className="text-sm text-muted-foreground">
                      选择一个对话或创建新的对话来开始提问
                    </p>
                    <Button onClick={handleNewChat} disabled={createConversation.isPending}>
                      新建对话
                    </Button>
                  </div>
                </div>
              ) : loadingMessages ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="sm" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">开始提问吧</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-3 md:p-4 flex flex-col">
                  {messages.map((msg, idx) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex animate-fadeInUp gap-3 md:gap-4',
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      {msg.role === 'assistant' && (
                        <div className="h-7 md:h-8 w-7 md:w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="h-4 md:h-5 w-4 md:w-5 rounded-full bg-gradient-to-br from-primary to-primary/80" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-xs lg:max-w-md rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm leading-relaxed break-words',
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        )}
                      >
                        {msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <div className="h-7 md:h-8 w-7 md:w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-xs font-medium text-primary">U</span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            {conversationId && (
              <div className="flex-shrink-0 border-t border-border/30 bg-background/95 backdrop-blur-sm p-3 md:p-4">
                <ChatInput
                  ref={chatInputRef}
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSendMessage}
                  disabled={sendMessage.isPending || !conversationId}
                  placeholder="输入您的问题..."
                  attachments={attachments}
                  onAttachFile={(files) => setAttachments([...attachments, ...files])}
                  onRemoveAttachment={(fileId) => setAttachments(attachments.filter((f) => f.id !== fileId))}
                />
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <ConfirmDialog
            open={!!deleteConfirm}
            title="删除对话"
            description={`确定要删除"${deleteConfirm.title}"吗？此操作无法撤销。`}
            confirmText="删除"
            cancelText="取消"
            isDangerous
            onConfirm={confirmDelete}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </MainLayout>
    </PageTransition>
  );
}