import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/shared/utils/cn';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg animate-in fade-in zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] duration-200">
        {/* Header with icon */}
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex-shrink-0 rounded-full p-2',
              isDangerous ? 'bg-destructive/10' : 'bg-amber-500/10'
            )}
          >
            <AlertCircle
              className={cn(
                'h-6 w-6',
                isDangerous ? 'text-destructive' : 'text-amber-600'
              )}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="transition-all"
          >
            {cancelText}
          </Button>
          <Button
            variant={isDangerous ? 'destructive' : 'default'}
            size="sm"
            onClick={onConfirm}
            className="transition-all"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </>
  );
}
