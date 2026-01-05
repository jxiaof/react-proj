import { Link, useLocation } from 'react-router-dom';
import { FileText, MessageSquare, Home, Settings } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const navItems = [
	{ path: '/', label: '首页', icon: Home },
	{ path: '/documents', label: '文档', icon: FileText },
	{ path: '/chat', label: '问答', icon: MessageSquare },
	{ path: '/settings', label: '设置', icon: Settings },
];

export function MobileNav() {
	const location = useLocation();

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden safe-area-pb h-16 flex items-center">
			<div className="w-full h-full flex items-center justify-around px-0">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive =
						location.pathname === item.path ||
						(item.path !== '/' && location.pathname.startsWith(item.path));
					return (
						<Link
							key={item.path}
							to={item.path}
							className={cn(
								'flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all duration-200 hover:scale-110 active:scale-95',
								isActive ? 'text-primary' : 'text-muted-foreground'
							)}
						>
							<Icon className={cn('h-5 w-5', isActive && 'scale-110')} />
							<span className={cn('text-xs', isActive && 'font-medium')}>
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
