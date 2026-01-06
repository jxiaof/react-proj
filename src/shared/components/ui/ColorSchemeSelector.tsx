import { useState, useRef, useEffect } from 'react';
import { useThemeStore, type ColorSchemeKey } from '@/store/themeStore';
import { Palette } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const colorSchemes: Array<{ key: ColorSchemeKey; color: string; label: string }> = [
	{ key: 'green', color: '#22c55e', label: '清爽绿' },
	{ key: 'blue', color: '#3b82f6', label: '天空蓝' },
	{ key: 'purple', color: '#a855f7', label: '深邃紫' },
	{ key: 'pink', color: '#ec4899', label: '魅力粉' },
	{ key: 'orange', color: '#f97316', label: '温暖橙' },
	{ key: 'red', color: '#ef4444', label: '热情红' },
	{ key: 'cyan', color: '#06b6d4', label: '清澈青' },
	{ key: 'indigo', color: '#6366f1', label: '深邃靛' },
];

export function ColorSchemeSelector() {
	const { colorScheme, setColorScheme } = useThemeStore();
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// 关闭下拉菜单
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				triggerRef.current &&
				!dropdownRef.current.contains(e.target as Node) &&
				!triggerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false);
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen]);

	// 获取当前标签
	const currentLabel = colorSchemes.find(s => s.key === colorScheme)?.label || '清爽绿';

	return (
		<div className="relative">
			{/* Trigger Button - 调色板图标 */}
			<button
				ref={triggerRef}
				onClick={() => setIsOpen(!isOpen)}
				className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-all duration-200 hover:scale-110 active:scale-95 group"
				title={`切换主题色 (当前: ${currentLabel})`}
				aria-label="主题色选择器"
				aria-expanded={isOpen}
			>
				<Palette className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
			</button>

			{/* Dropdown Menu - 两行四列布局 */}
			{isOpen && (
				<div
					ref={dropdownRef}
					className={cn(
						'absolute top-full right-0 mt-2 z-50 bg-background border border-border rounded-xl shadow-lg p-3 animate-fadeInUp',
						'flex flex-col gap-2'
					)}
				>
					{/* Row 1 */}
					<div className="flex gap-2">
						{colorSchemes.slice(0, 4).map(({ key, color, label }) => (
							<button
								key={key}
								onClick={() => {
									setColorScheme(key);
									setIsOpen(false);
								}}
								className={cn(
									'flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 active:scale-95',
									'h-10 w-10 min-h-10 min-w-10',
									colorScheme === key
										? 'ring-2 ring-offset-2 ring-offset-background shadow-md'
										: 'hover:shadow-md'
								)}
								style={{
									backgroundColor: color,
									ringColor: colorScheme === key ? color : undefined,
								}}
								title={label}
							/>
						))}
					</div>

					{/* Row 2 */}
					<div className="flex gap-2">
						{colorSchemes.slice(4, 8).map(({ key, color, label }) => (
							<button
								key={key}
								onClick={() => {
									setColorScheme(key);
									setIsOpen(false);
								}}
								className={cn(
									'flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 active:scale-95',
									'h-10 w-10 min-h-10 min-w-10',
									colorScheme === key
										? 'ring-2 ring-offset-2 ring-offset-background shadow-md'
										: 'hover:shadow-md'
								)}
								style={{
									backgroundColor: color,
									ringColor: colorScheme === key ? color : undefined,
								}}
								title={label}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}