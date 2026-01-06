import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { PageTransition } from '@/shared/components/PageTransition';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ChatInput } from '../components/ChatInput';
import { Plus, MessageSquare, Menu, X, Search, Loader, ChevronLeft } from 'lucide-react';
import { useConversations, useCreateConversation } from '@/features/conversations/hooks/useConversations';
import { useMessages, useSendMessage } from '../hooks/useChat';
import { cn } from '@/shared/utils/cn';

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const { data: conversationsData, isLoading: loadingConversations } = useConversations();
  const { data: messagesData, isLoading: loadingMessages } = useMessages(conversationId);
  const createConversation = useCreateConversation();
  const sendMessage = useSendMessage();

  const conversations = conversationsData?.data ?? [];
  const messages = messagesData?.data ?? [];

  const activeConversation = conversations.find(c => c.id === conversationId);

  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchValue.toLowerCase())
  );

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

  useEffect(() => {
    if (!conversationId && conversations.length > 0) {
      navigate(`/chat/${conversations[0].id}`, { replace: true });
    }
  }, [conversationId, conversations, navigate]);

  useEffect(() => {
    // 使用微任务而不是直接 setState
    queueMicrotask(() => {
      setSidebarOpen(false);
      chatInputRef.current?.focus();
    });
  }, [conversationId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setTimeout(() => {
        chatInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const handleNewChat = () => {
    setShowNewChatDialog(true);
  };

  const confirmNewChat = () => {
    createConversation.mutate(
      { document_ids: [] },
      {
        onSuccess: (response) => {
          navigate(`/chat/${response.data.id}`);
          setShowNewChatDialog(false);
        },
      }
    );
  };

  const handleSendMessage = () => {
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
  };

  return (
    <PageTransition>
      <MainLayout hideBottomNav={false} fullWidth>
        {/* 
          容器高度计算:
          - 100vh: 视口高度
          - 减 3.5rem (56px): Header 高度
          - H5: 减 4rem (64px): 底部导航栏高度
          - 使用 max() 确保在有 safe-area 时自动适应
        */}
        <div className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] flex overflow-hidden bg-background" style={{
          height: 'calc(100vh - 3.5rem - max(0px, env(safe-area-inset-bottom)))'
        }}>
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Left Sidebar - 对话列表容器 - 独立滚动 */}
          <div
            className={cn(
              'fixed md:relative inset-y-0 left-0 z-40 w-64 bg-background rounded-none md:rounded-lg border-r border-border/30 transition-all duration-300 flex flex-col overflow-hidden',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
              'top-14 md:top-0 md:flex-shrink-0'
            )}
            style={{
              height: 'calc(100vh - 3.5rem - max(0px, env(safe-area-inset-bottom)))'
            }}
          >
            {/* New Chat Button */}
            <div className="p-3 border-b border-border/30 flex-shrink-0">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary text-primary-foreground active:scale-95 text-sm" 
                onClick={handleNewChat}
                size="sm"
                disabled={createConversation.isPending}
              >
                <Plus className="mr-2 h-4 w-4" />
                {createConversation.isPending ? '创建中...' : '新建对话'}
              </Button>
            </div>

            {/* Search */}
            <div className="px-3 py-2 border-b border-border/30 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索对话..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-input/30 bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Conversations List - 独立滚动区域 */}
            <div className="flex-1 overflow-y-auto min-w-0">
              {loadingConversations ? (
                <div className="flex justify-center items-center h-32">
                  <LoadingSpinner size="sm" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-center px-4">
                  <p className="text-xs text-muted-foreground">
                    {searchValue ? '无搜索结果' : '暂无对话'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 p-3">
                  {filteredConversations.map((conv) => {
                    const isActive = conv.id === conversationId;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => {
                          navigate(`/chat/${conv.id}`);
                          setSidebarOpen(false);
                          setSearchValue('');
                        }}
                        className={cn(
                          'px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 text-sm relative flex items-center gap-2 min-w-0 hover:bg-muted/50',
                          isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{conv.title || 'Untitled'}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area - 三层布局，整体不滚动 */}
          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
            {/* Header - 固定不滚动 */}
            <div className="flex items-center justify-between px-3 md:px-4 py-3 border-b border-border/30 flex-shrink-0 bg-background/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {/* Back Button - Mobile Only */}
                {sidebarOpen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}

                {/* Title */}
                <div className="min-w-0">
                  <h2 className="text-sm md:text-base font-semibold truncate text-foreground">
                    {activeConversation?.title || '新对话'}
                  </h2>
                  <p className="text-xs text-muted-foreground">AI 助手</p>
                </div>
              </div>
            </div>

            {/* Messages Container - 只有这里滚动 */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto min-h-0 flex flex-col"
            >
              {!conversationId ? (
                <div className="flex flex-1 items-center justify-center p-4">
                  <div className="text-center max-w-sm">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">选择一个对话开始</h3>
                    <p className="text-muted-foreground text-sm mt-2">
                      或创建一个新的对话来开始提问
                    </p>
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

            {/* Input Area - 固定底部不滚动 */}
            {conversationId && (
              <div className="flex-shrink-0 border-t border-border/30 bg-background/95 backdrop-blur-sm p-3 md:p-4 safe-area-pb">
                <ChatInput
                  ref={chatInputRef}
                  value={inputValue}
                  onChange={setInputValue}
                  onSend={handleSendMessage}
                  disabled={sendMessage.isPending || !conversationId}
                  onNewChat={handleNewChat}
                  placeholder="输入您的问题..."
                />
              </div>
            )}
          </div>
        </div>

        {/* New Chat Dialog */}
        {showNewChatDialog && (
          <NewChatDialog
            open={showNewChatDialog}
            onOpenChange={setShowNewChatDialog}
            onConfirm={confirmNewChat}
            isLoading={createConversation.isPending}
          />
        )}
      </MainLayout>
    </PageTransition>
  );
}

function NewChatDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 animate-fadeInUp"
        onClick={() => onOpenChange(false)}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-sm pointer-events-auto animate-scaleIn shadow-2xl">
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-center">开始新对话</h3>
              <p className="text-sm text-muted-foreground text-center">
                创建一个新对话，开始新的提问和讨论
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                取消
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader className="h-4 w-4 animate-spin" />
                    创建中
                  </span>
                ) : (
                  '创建'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}