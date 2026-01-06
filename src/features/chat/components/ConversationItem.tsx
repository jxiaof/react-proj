import { useCallback } from 'react';
import { MessageSquare, Star, Trash2, MoreVertical, Copy } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/shared/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/DropdownMenu';

interface ConversationItemProps {
  id: string;
  title: string;
  isActive: boolean;
  isFavorite: boolean;
  updatedAt?: string;
  onClick: () => void;
  onFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationItem({
  id,
  title,
  isActive,
  isFavorite,
  updatedAt,
  onClick,
  onFavorite,
  onDelete,
}: ConversationItemProps) {
  const handleStarClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onFavorite(id);
    },
    [id, onFavorite]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(id);
    },
    [id, onDelete]
  );

  const handleCopyTitle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(title);
    },
    [title]
  );

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative px-2 py-2 rounded-md cursor-pointer transition-all duration-200',
        'hover:bg-muted/40',
        isActive
          ? 'bg-primary/10 text-primary shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Icon */}
        <MessageSquare
          className={cn(
            'h-4 w-4 flex-shrink-0',
            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
          )}
        />

        {/* Title */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <span className={cn(
            'truncate text-sm',
            isActive ? 'font-medium' : 'font-normal'
          )}>
            {title || 'Untitled'}
          </span>
          {isFavorite && (
            <Star className="h-3 w-3 flex-shrink-0 fill-amber-400 text-amber-400" />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Star Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-muted"
            onClick={handleStarClick}
            title={isFavorite ? '取消收藏' : '收藏对话'}
          >
            <Star
              className={cn(
                'h-3.5 w-3.5',
                isFavorite ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground hover:text-foreground'
              )}
            />
          </Button>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-muted"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              {/* Copy Title */}
              <DropdownMenuItem onClick={handleCopyTitle}>
                <Copy className="h-4 w-4 mr-2" />
                复制标题
              </DropdownMenuItem>

              {/* Edit Title - 未来功能 */}
              <DropdownMenuItem disabled>
                编辑标题
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Delete */}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除对话
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Timestamp - 可选 */}
      {updatedAt && (
        <p className="text-xs text-muted-foreground mt-1 pl-6 truncate">
          {new Date(updatedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}