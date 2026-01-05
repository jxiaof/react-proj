import { Link, useLocation } from 'react-router-dom';
import { FileText, MessageSquare, Home, Settings } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { ColorSchemeSelector } from '@/shared/components/ui/ColorSchemeSelector';
import { Logo } from '@/shared/components/ui/Logo';

const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/documents', label: '文档', icon: FileText },
    { path: '/chat', label: '问答', icon: MessageSquare },
];

export function Header() {
    const location = useLocation();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="w-full max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <div className="h-8 w-8 flex items-center justify-center transition-all duration-500">
                        <Logo className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-bold text-lg hidden sm:inline text-primary transition-all duration-500">
                        DocQA
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right side - 统一简洁设计，所有按钮无边框 */}
                <div className="flex items-center gap-1">
                    {/* 主题色选择器 - 仅颜色图标 */}
                    <ColorSchemeSelector />
                    
                    {/* 深色/浅色切换 - 图标模式 */}
                    <ThemeToggle />
                    
                    {/* 设置按钮 - 仅 Desktop，图标模式 */}
                    <Link 
                        to="/settings" 
                        className="hidden md:inline-flex items-center justify-center h-9 w-9 rounded-md transition-all duration-200 hover:scale-110 active:scale-95 group"
                        title="设置"
                    >
                        <Settings className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
