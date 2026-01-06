import { useMemo, useRef, useState, useEffect } from 'react';
import { cn } from '@/shared/utils/cn';
import type { Document } from '../api/documentTypes';

interface DocumentTabsProps {
	documents: Document[];
	activeTab: string;
	onTabChange: (tab: string) => void;
}

export type DocumentCategory = 'all' | 'pdf' | 'word' | 'excel' | 'text' | 'other';

const getCategoryLabel = (category: DocumentCategory): string => {
	const labels: Record<DocumentCategory, string> = {
		all: '全部',
		pdf: 'PDF',
		word: 'Word',
		excel: 'Excel',
		text: '文本',
		other: '其他',
	};
	return labels[category];
};

function getDocumentCategory(mimeType: string): DocumentCategory {
	if (mimeType.includes('pdf')) return 'pdf';
	if (mimeType.includes('word') || mimeType.includes('document')) return 'word';
	if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'excel';
	if (
		mimeType.includes('markdown') ||
		mimeType.includes('text/plain') ||
		mimeType.includes('json') ||
		mimeType.includes('xml')
	)
		return 'text';
	return 'other';
}

export function DocumentTabs({ documents, activeTab, onTabChange }: DocumentTabsProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const categories = useMemo(() => {
		const counts: Record<DocumentCategory, number> = {
			all: documents.length,
			pdf: 0,
			word: 0,
			excel: 0,
			text: 0,
			other: 0,
		};

		documents.forEach(doc => {
			// ✅ 只传一个参数
			const category = getDocumentCategory(doc.mime_type);
			counts[category]++;
		});

		return counts;
	}, [documents]);

	const tabs: DocumentCategory[] = ['all', 'pdf', 'word', 'excel', 'text', 'other'];

	// 检查滚动位置
	const checkScroll = () => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const hasScrollLeft = container.scrollLeft > 0;
		const hasScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 10;

		setCanScrollLeft(hasScrollLeft);
		setCanScrollRight(hasScrollRight);
	};

	// 监听滚动和窗口大小变化
	useEffect(() => {
		checkScroll();
		const container = scrollContainerRef.current;

		container?.addEventListener('scroll', checkScroll);
		window.addEventListener('resize', checkScroll);

		// 初始化时延迟检查
		const timer = setTimeout(checkScroll, 100);

		return () => {
			container?.removeEventListener('scroll', checkScroll);
			window.removeEventListener('resize', checkScroll);
			clearTimeout(timer);
		};
	}, [tabs, documents]);

	return (
		<div className="w-full border-b border-border/30 bg-background/50 backdrop-blur-sm sticky top-0 z-10 relative">
			{/* 左侧渐变提示 - H5 */}
			{canScrollLeft && (
				<div className="absolute left-0 top-0 bottom-0 w-6 md:w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
			)}

			{/* 右侧渐变提示 - H5 */}
			{canScrollRight && (
				<div className="absolute right-0 top-0 bottom-0 w-6 md:w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />
			)}

			<div
				ref={scrollContainerRef}
				className="flex overflow-x-auto scrollbar-hide scroll-smooth"
				onScroll={checkScroll}
			>
				{tabs.map(tab => {
					const count = categories[tab];
					const isActive = activeTab === tab;

					return (
						<button
							key={tab}
							onClick={() => onTabChange(tab)}
							className={cn(
								// 基础样式
								'flex items-center gap-1.5 md:gap-2 py-3 md:py-4 px-3 md:px-6 text-sm md:text-base font-medium transition-all duration-200 relative whitespace-nowrap flex-shrink-0',
								// 文字颜色
								'hover:text-foreground/90',
								isActive ? 'text-primary' : 'text-muted-foreground'
							)}
						>
							{/* 标签文本 */}
							<span className="truncate max-w-[60px] md:max-w-none">
								{getCategoryLabel(tab as DocumentCategory)}
							</span>

							{/* 计数徽章 - H5 优化 */}
							<span
								className={cn(
									'inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-semibold flex-shrink-0 transition-colors duration-200',
									isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
								)}
							>
								{count > 99 ? '99+' : count}
							</span>

							{/* 活跃指示器 */}
							{isActive && (
								<div className="absolute bottom-0 left-3 md:left-6 right-3 md:right-6 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full" />
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
