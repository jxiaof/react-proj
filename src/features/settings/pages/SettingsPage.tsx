import { PageTransition } from '@/shared/components/PageTransition';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Switch } from '@/shared/components/ui/Switch';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { Plus, Moon, Sun, Monitor, Zap, Bell, Palette, FileText, Mail, BarChart3, Edit, Trash2, TestTube } from 'lucide-react';
import { useThemeStore, type ThemeMode, type ColorSchemeKey } from '@/store/themeStore';
import { AddModelDialog, type ModelConfig } from '../components/AddModelDialog';
import { mockProviders } from '@/infrastructure/mock/mockData';
import { cn } from '@/shared/utils/cn';
import { useState } from 'react';
import { ModelEditDialog } from '../components/ModelEditDialog';
import { ModelTestDialog } from '../components/ModelTestDialog';
import { ScrollablePageLayout } from '@/shared/components/layout/ScrollablePageLayout';

// Theme options
const themeOptions = [
  { value: 'light' as ThemeMode, label: '浅色', icon: <Sun className="h-5 w-5" /> },
  { value: 'dark' as ThemeMode, label: '深色', icon: <Moon className="h-5 w-5" /> },
  { value: 'system' as ThemeMode, label: '系统', icon: <Monitor className="h-5 w-5" /> },
];

// Color schemes
const colorSchemesList = [
  { key: 'blue', color: '#3b82f6', label: '蓝色' },
  { key: 'red', color: '#ef4444', label: '红色' },
  { key: 'green', color: '#10b981', label: '绿色' },
  { key: 'purple', color: '#8b5cf6', label: '紫色' },
  { key: 'orange', color: '#f97316', label: '橙色' },
  { key: 'pink', color: '#ec4899', label: '粉色' },
  { key: 'cyan', color: '#06b6d4', label: '青色' },
  { key: 'slate', color: '#64748b', label: '灰色' },
];

// Notification items
interface NotificationItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  key: keyof typeof defaultNotifications;
}

const defaultNotifications = {
  documentComplete: true,
  emailUpdates: true,
  dailySummary: false,
};

const notificationItems: NotificationItem[] = [
  {
    id: 'document-complete',
    icon: <FileText className="h-4 w-4 text-primary" />,
    title: '文档处理完成通知',
    description: '当文档分析完成时发送通知',
    key: 'documentComplete',
  },
  {
    id: 'email-updates',
    icon: <Mail className="h-4 w-4 text-primary" />,
    title: '邮件通知',
    description: '订阅产品更新和重要公告',
    key: 'emailUpdates',
  },
  {
    id: 'daily-summary',
    icon: <BarChart3 className="h-4 w-4 text-primary" />,
    title: '每日摘要',
    description: '获取您的文档问答使用统计',
    key: 'dailySummary',
  },
];

export default function SettingsPage() {
    const { theme, setTheme, colorScheme, setColorScheme } = useThemeStore();
    const [showAddModelDialog, setShowAddModelDialog] = useState(false);
    const [editingModel, setEditingModel] = useState<{ id: string; name: string; model: string; description: string; isDefault: boolean } | null>(null);
    const [testingModel, setTestingModel] = useState<{ name: string; id: string } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
    
    const [notifications, setNotifications] = useState(defaultNotifications);
    const [providers, setProviders] = useState(mockProviders);

    const handleAddModel = (data: ModelConfig) => {
      const newModel = {
        id: `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        model: data.model,
        isDefault: data.isDefault,
        status: 'active' as const,
        icon: '🤖',
        description: data.description,
      };

      if (data.isDefault) {
        setProviders(prev =>
          prev.map(p => ({ ...p, isDefault: false })).concat(newModel)
        );
      } else {
        setProviders(prev => [...prev, newModel]);
      }
    };

    const handleEditModel = (data: ModelConfig) => {
      if (!editingModel || !editingModel.id) return;
      setProviders(prev =>
        prev.map(p =>
          p.id === editingModel.id
            ? { ...p, name: data.name, model: data.model, description: data.description, isDefault: data.isDefault }
            : p.isDefault && data.isDefault
            ? { ...p, isDefault: false }
            : p
        )
      );
      setEditingModel(null);
    };

    const handleDeleteModel = (id: string) => {
      setProviders(prev => {
        const filtered = prev.filter(p => p.id !== id);
        // 如果删除的是默认模型，设置第一个为默认
        const hasDefault = filtered.some(p => p.isDefault);
        if (!hasDefault && filtered.length > 0) {
          filtered[0].isDefault = true;
        }
        return filtered;
      });
      setDeleteConfirm(null);
    };

    const handleNotificationChange = (key: keyof typeof notifications) => {
      setNotifications(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };

    return (
        <PageTransition>
            <ScrollablePageLayout 
              hideBottomNav={false}
              fullWidth={false}
              maxWidth="max-w-4xl"
              contentPadding="px-3 sm:px-4 md:px-6 py-6 md:py-8"
            >
                {/* 
                  ✅ 改进：统一使用 space-y，让 ScrollablePageLayout 处理底部间距
                */}
                <div className="space-y-6 md:space-y-8">
                    {/* Header */}
                    <div className="animate-fadeInDown space-y-2">
                        <h1 className="text-2xl md:text-4xl font-bold">设置</h1>
                        <p className="text-sm md:text-base text-muted-foreground">自定义您的文档问答系统</p>
                    </div>

                    {/* AI Providers Section */}
                    <Card className="animate-fadeInUp" style={{ animationDelay: '80ms' }}>
                        <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-base md:text-lg">AI 模型配置</CardTitle>
                                </div>
                                <p className="text-xs text-muted-foreground">选择您偏好的 AI 模型</p>
                            </div>
                            <Button 
                              size="sm" 
                              className="flex-shrink-0"
                              onClick={() => setShowAddModelDialog(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                添加模型
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {providers.map((provider, idx) => (
                                <div
                                    key={provider.id}
                                    className="group flex flex-col md:flex-row md:items-start md:justify-between rounded-lg border border-border/50 p-3 md:p-4 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 animate-fadeInUp"
                                    style={{ animationDelay: `${160 + idx * 80}ms` }}
                                >
                                    <div className="flex gap-3 flex-1 min-w-0 mb-3 md:mb-0">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg group-hover:bg-primary/20 transition-colors">
                                                {provider.icon}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-sm text-foreground">
                                                    {provider.name}
                                                </span>
                                                {provider.isDefault && (
                                                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                                                        默认
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-muted-foreground">{provider.description}</p>

                                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 flex-wrap">
                                                <span>
                                                    {provider.model}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Container */}
                                    <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                                        {/* Desktop: Full Text Buttons */}
                                        <div className="hidden sm:flex items-center gap-1.5">
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-xs h-8 px-2.5 text-blue-600 transition-all active:scale-95"
                                            onClick={() => setTestingModel({ name: provider.name, id: provider.model })}
                                            title="测试此模型"
                                          >
                                            <TestTube className="h-3.5 w-3.5 mr-1" />
                                            测试
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-xs h-8 px-2.5 text-amber-600 transition-all active:scale-95"
                                            onClick={() => setEditingModel(provider)}
                                            title="编辑模型配置"
                                          >
                                            <Edit className="h-3.5 w-3.5 mr-1" />
                                            编辑
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-xs h-8 px-2.5 text-destructive transition-all active:scale-95"
                                            onClick={() => setDeleteConfirm({ id: provider.id, name: provider.name })}
                                            title="删除此模型"
                                          >
                                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                                            删除
                                          </Button>
                                        </div>

                                        {/* Mobile: Compact Icon Buttons */}
                                        <div className="flex sm:hidden items-center gap-1">
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 flex items-center justify-center text-blue-600 transition-all active:scale-95"
                                            onClick={() => setTestingModel({ name: provider.name, id: provider.model })}
                                          >
                                            <TestTube className="h-4 w-4" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 flex items-center justify-center text-amber-600 transition-all active:scale-95"
                                            onClick={() => setEditingModel(provider)}
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 flex items-center justify-center text-destructive transition-all active:scale-95"
                                            onClick={() => setDeleteConfirm({ id: provider.id, name: provider.name })}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Theme Settings */}
                    <Card className="animate-fadeInUp" style={{ animationDelay: '240ms' }}>
                        <CardHeader className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Palette className="h-5 w-5 text-primary" />
                                <CardTitle className="text-base md:text-lg">外观设置</CardTitle>
                            </div>
                            <p className="text-xs text-muted-foreground">自定义应用的主题和配色</p>
                        </CardHeader>
                        <CardContent className="space-y-6 md:space-y-8">
                            {/* Theme Mode Selection */}
                            <div className="space-y-3">
                                <h4 className="text-xs md:text-sm font-semibold flex items-center gap-2">
                                    <Sun className="h-4 w-4 text-primary" />
                                    主题模式
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {themeOptions.map(option => (
                                        <button
                                            key={option.value}
                                            onClick={() => setTheme(option.value)}
                                            className={cn(
                                                'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300 active:scale-95',
                                                theme === option.value
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border/30 hover:border-primary/50 hover:bg-muted'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'h-8 w-8 rounded-lg flex items-center justify-center transition-colors',
                                                    theme === option.value
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground'
                                                )}
                                            >
                                                {option.icon}
                                            </div>
                                            <span className="text-xs font-medium">{option.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="rounded-lg bg-muted/50 p-2 md:p-3">
                                    <p className="text-xs text-muted-foreground">
                                        {theme === 'light' && '浅色模式：适合明亮环境使用'}
                                        {theme === 'dark' && '深色模式：保护眼睛，适合长时间使用'}
                                        {theme === 'system' && '系统模式：自动跟随系统设置'}
                                    </p>
                                </div>
                            </div>

                            {/* Color Scheme Selection */}
                            <div className="space-y-3 border-t pt-6">
                                <h4 className="text-xs md:text-sm font-semibold flex items-center gap-2">
                                    <Palette className="h-4 w-4 text-primary" />
                                    配色方案
                                </h4>

                                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                    {colorSchemesList.map(({ key, color, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => setColorScheme(key as ColorSchemeKey)}
                                            aria-pressed={colorScheme === key}
                                            className={cn(
                                                'flex flex-col items-center gap-2 p-2 rounded-md transition-colors text-xs',
                                                colorScheme === key
                                                    ? 'ring-1 ring-primary bg-primary/5'
                                                    : 'hover:bg-muted'
                                            )}
                                        >
                                            <span
                                                className="h-6 w-6 rounded-full block"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-center text-xs">{label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="rounded-lg bg-muted/50 p-2">
                                    <p className="text-xs text-muted-foreground">
                                        选择喜欢的配色，将应用到界面主题。
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification Settings */}
                    <Card className="animate-fadeInUp" style={{ animationDelay: '320ms' }}>
                        <CardHeader className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-primary" />
                                <CardTitle className="text-base md:text-lg">通知设置</CardTitle>
                            </div>
                            <p className="text-xs text-muted-foreground">管理应用通知和提醒</p>
                        </CardHeader>
                        <CardContent className="space-y-0 divide-y divide-border/30">
                          {notificationItems.map((item) => {
                            const isEnabled = notifications[item.key];
                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 transition-all duration-200"
                              >
                                {/* Left: Icon + Text Content */}
                                <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                                  {/* Icon - Fixed size */}
                                  <div className={cn(
                                    'flex-shrink-0 h-5 w-5 rounded-lg flex items-center justify-center mt-0.5 transition-colors',
                                    isEnabled ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                                  )}>
                                    {item.icon}
                                  </div>

                                  {/* Text Content */}
                                  <div className="flex-1 min-w-0">
                                    <h5 className={cn(
                                      'text-sm font-medium transition-colors',
                                      isEnabled ? 'text-foreground' : 'text-muted-foreground'
                                    )}>
                                      {item.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Right: Switch - Fixed size */}
                                <div className="flex-shrink-0 ml-4">
                                  <Switch
                                    checked={isEnabled}
                                    onCheckedChange={() => handleNotificationChange(item.key)}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </CardContent>
                    </Card>

                    {/* 
                      ✅ 不需要额外的缓冲 div
                      ScrollablePageLayout 会自动处理底部安全间距
                    */}
                </div>
            </ScrollablePageLayout>

            {/* Dialogs - 保持不变 */}
            <AddModelDialog 
              open={showAddModelDialog} 
              onOpenChange={setShowAddModelDialog}
              onConfirm={handleAddModel}
            />

            {/* Edit Model Dialog */}
            <ModelEditDialog
              open={!!editingModel}
              onOpenChange={() => setEditingModel(null)}
              onConfirm={handleEditModel}
              model={editingModel ? { ...editingModel, id: editingModel.id || '' } : null}
            />

            {/* Test Model Dialog */}
            {testingModel && (
              <ModelTestDialog
                open={!!testingModel}
                onOpenChange={() => setTestingModel(null)}
                modelName={testingModel.name}
                modelId={testingModel.id}
              />
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
              open={!!deleteConfirm}
              title="删除 AI 模型"
              description={`确定要删除模型 "${deleteConfirm?.name}" 吗？此操作无法撤销。`}
              confirmText="删除"
              cancelText="取消"
              isDangerous
              onConfirm={() => deleteConfirm && handleDeleteModel(deleteConfirm.id)}
              onCancel={() => setDeleteConfirm(null)}
            />
        </PageTransition>
    );
}