import { useMemo } from 'react';
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
		all: '全部文档',
		pdf: 'PDF',
		word: 'Word',
		excel: 'Excel',
		text: '文本',
		other: '其他',
	};
	return labels[category];
};

export const getDocumentCategory = (mimeType: string, fileName: string): DocumentCategory => {
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
};

export function DocumentTabs({ documents, activeTab, onTabChange }: DocumentTabsProps) {
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
			const category = getDocumentCategory(doc.mime_type, doc.name);
			counts[category]++;
		});

		return counts;
	}, [documents]);

	const tabs: DocumentCategory[] = ['all', 'pdf', 'word', 'excel', 'text', 'other'];

	return (
		<div className="w-full border-b border-border/30 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
			<div className="flex overflow-x-auto scrollbar-hide">
				{tabs.map(tab => {
					const count = categories[tab];
					const isActive = activeTab === tab;

					return (
						<button
							key={tab}
							onClick={() => onTabChange(tab)}
							className={cn(
								'px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium transition-all duration-200 relative whitespace-nowrap flex items-center gap-2',
								'hover:text-foreground/80',
								isActive ? 'text-primary' : 'text-muted-foreground'
							)}
						>
							<span>{getCategoryLabel(tab as DocumentCategory)}</span>
							<span
								className={cn(
									'inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-semibold transition-colors duration-200',
									isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
								)}
							>
								{count}
							</span>

							{/* Active indicator */}
							{isActive && (
								<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
