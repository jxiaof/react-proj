import { MainLayout } from '@/shared/components/layout/MainLayout';
import { PageTransition } from '@/shared/components/PageTransition';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Switch } from '@/shared/components/ui/Switch';
import { Plus, Moon, Sun, Monitor, Zap, Shield, Bell, Palette, Palette as PaletteIcon } from 'lucide-react';
import { useThemeStore, type ThemeMode, type ColorSchemeKey } from '@/store/themeStore';
import { cn } from '@/shared/utils/cn';
import { useState } from 'react';

const mockProviders = [
    {
        id: '1',
        name: 'OpenAI GPT-4o-mini',
        model: 'gpt-4o-mini',
        isDefault: true,
        status: 'active' as const,
        icon: '🤖',
        description: '高速、高效的模型',
    },
    {
        id: '2',
        name: 'Anthropic Claude',
        model: 'claude-3-5-sonnet',
        isDefault: false,
        status: 'inactive' as const,
        icon: '🧠',
        description: '深度推理能力强',
    },
];

const themeOptions: Array<{ value: ThemeMode; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: '浅色', icon: <Sun className="h-5 w-5" /> },
    { value: 'dark', label: '深色', icon: <Moon className="h-5 w-5" /> },
    { value: 'system', label: '系统', icon: <Monitor className="h-5 w-5" /> },
];

const colorSchemesList: Array<{ key: ColorSchemeKey; color: string; label: string }> = [
    { key: 'green', color: '#22c55e', label: '清爽绿' },
    { key: 'blue', color: '#3b82f6', label: '天空蓝' },
    { key: 'purple', color: '#a855f7', label: '深邃紫' },
    { key: 'pink', color: '#ec4899', label: '魅力粉' },
    { key: 'orange', color: '#f97316', label: '温暖橙' },
    { key: 'red', color: '#ef4444', label: '热情红' },
    { key: 'cyan', color: '#06b6d4', label: '清澈青' },
    { key: 'indigo', color: '#6366f1', label: '深邃靛' },
];

export default function SettingsPage() {
    const { theme, setTheme, colorScheme, setColorScheme } = useThemeStore();
    
    // 通知状态
    const [notifications, setNotifications] = useState({
      documentComplete: true,
      emailUpdates: true,
      dailySummary: false,
    });

    return (
        <PageTransition>
            <MainLayout>
                <div className="space-y-6 md:space-y-8 pb-8">
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
                            <Button size="sm" className="flex-shrink-0">
                                <Plus className="h-4 w-4 mr-2" />
                                添加模型
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {mockProviders.map((provider, idx) => (
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
                                                    <span className="font-medium text-foreground">{provider.model}</span>
                                                </span>
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs',
                                                        provider.status === 'active'
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'h-1.5 w-1.5 rounded-full',
                                                            provider.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                                                        )}
                                                    />
                                                    {provider.status === 'active' ? '活跃' : '不活跃'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
                                        <Button variant="ghost" size="sm" className="flex-1 md:flex-none text-xs h-8">
                                            测试
                                        </Button>
                                        <Button variant="ghost" size="sm" className="flex-1 md:flex-none text-xs h-8">
                                            编辑
                                        </Button>
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
                                    <PaletteIcon className="h-4 w-4 text-primary" />
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
						<CardContent className="space-y-3">
							{/* 文档处理完成通知 */}
							<div
							  className={cn(
								'group flex items-center justify-between p-4 rounded-lg border transition-all duration-300 cursor-pointer',
								'hover:border-primary/50 hover:bg-primary/5',
								notifications.documentComplete 
								  ? 'border-primary/30 bg-primary/5' 
								  : 'border-border/30'
							  )}
							  onClick={(e: React.MouseEvent) => {
								if ((e.target as HTMLElement).closest('button, input')) return;
								setNotifications(prev => ({
								  ...prev,
								  documentComplete: !prev.documentComplete
								}));
							  }}
							>
							  <div className="space-y-1 flex-1 min-w-0">
								<p className="font-medium text-sm text-foreground">文档处理完成通知</p>
								<p className="text-xs text-muted-foreground">当文档分析完成时发送通知</p>
							  </div>
							  <Switch
								checked={notifications.documentComplete}
								onCheckedChange={(checked) => setNotifications(prev => ({
								  ...prev,
								  documentComplete: checked
								}))}
								className="flex-shrink-0 ml-4"
							  />
							</div>

							{/* 邮件通知 */}
							<div
							  className={cn(
								'group flex items-center justify-between p-4 rounded-lg border transition-all duration-300 cursor-pointer',
								'hover:border-primary/50 hover:bg-primary/5',
								notifications.emailUpdates 
								  ? 'border-primary/30 bg-primary/5' 
								  : 'border-border/30'
							  )}
							  onClick={(e: React.MouseEvent) => {
								if ((e.target as HTMLElement).closest('button, input')) return;
								setNotifications(prev => ({
								  ...prev,
								  emailUpdates: !prev.emailUpdates
								}));
							  }}
							>
							  <div className="space-y-1 flex-1 min-w-0">
								<p className="font-medium text-sm text-foreground">邮件通知</p>
								<p className="text-xs text-muted-foreground">订阅产品更新和重要公告</p>
							  </div>
							  <Switch
								checked={notifications.emailUpdates}
								onCheckedChange={(checked) => setNotifications(prev => ({
								  ...prev,
								  emailUpdates: checked
								}))}
								className="flex-shrink-0 ml-4"
							  />
							</div>

							{/* 每日摘要 */}
							<div
							  className={cn(
								'group flex items-center justify-between p-4 rounded-lg border transition-all duration-300 cursor-pointer',
								'hover:border-primary/50 hover:bg-primary/5',
								notifications.dailySummary 
								  ? 'border-primary/30 bg-primary/5' 
								  : 'border-border/30'
							  )}
							  onClick={(e: React.MouseEvent) => {
								if ((e.target as HTMLElement).closest('button, input')) return;
								setNotifications(prev => ({
								  ...prev,
								  dailySummary: !prev.dailySummary
								}));
							  }}
							>
							  <div className="space-y-1 flex-1 min-w-0">
								<p className="font-medium text-sm text-foreground">每日摘要</p>
								<p className="text-xs text-muted-foreground">获取您的文档问答使用统计</p>
							  </div>
							  <Switch
								checked={notifications.dailySummary}
								onCheckedChange={(checked) => setNotifications(prev => ({
								  ...prev,
								  dailySummary: checked
								}))}
								className="flex-shrink-0 ml-4"
							  />
							</div>
						</CardContent>
					</Card>
                </div>
            </MainLayout>
        </PageTransition>
    );
}