import { useCallback } from 'react';
import { MessageSquare, Star, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/shared/utils/cn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/Dropdown';

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

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200',
        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Icon */}
        <MessageSquare
          className={cn(
            'h-4 w-4 flex-shrink-0',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )}
        />

        {/* Title */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className={cn('truncate text-sm', isActive ? 'font-medium' : 'font-normal')}>
            {title || 'Untitled'}
          </span>
          {isFavorite && <Star className="h-3 w-3 flex-shrink-0 fill-amber-400 text-amber-400" />}
        </div>

        {/* Actions - Desktop */}
        <div className="hidden sm:flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleStarClick}
            title={isFavorite ? '取消收藏' : '收藏对话'}
          >
            <Star
              className={cn(
                'h-4 w-4',
                isFavorite ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
              )}
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => {}}>
                编辑标题
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除对话
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Actions - Mobile */}
        <div className="flex sm:hidden flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleStarClick}>
                <Star className={cn('h-4 w-4 mr-2', isFavorite && 'fill-amber-400 text-amber-400')} />
                {isFavorite ? '取消收藏' : '收藏对话'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                编辑标题
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除对话
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Timestamp */}
      {updatedAt && (
        <p className="text-xs text-muted-foreground mt-1 pl-6">{updatedAt}</p>
      )}
    </div>
  );
}