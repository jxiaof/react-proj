import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { GripVertical, X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
  }
>(({ side = 'right', className, children, ...props }, ref) => {
  const [translateY, setTranslateY] = React.useState(0);
  const isDragging = React.useRef(false);
  const startY = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    // 只在向下拖拽时响应（关闭侧边栏）
    if (diff > 0 && side === 'bottom') {
      setTranslateY(diff);
    }
    // 向左拖拽关闭（左侧侧边栏）
    if (diff < 0 && side === 'left') {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    isDragging.current = false;
    const currentY = e.changedTouches[0].clientY;
    const diff = currentY - startY.current;
    
    // 如果拖拽超过 60px，关闭 Sheet
    if (Math.abs(diff) > 60) {
      const closeButton = document.querySelector('[data-sheet-close]') as HTMLButtonElement;
      closeButton?.click();
    } else {
      setTranslateY(0);
    }
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 bg-background p-0 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 flex flex-col',
          side === 'top' &&
            'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
          side === 'bottom' &&
            'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          side === 'left' &&
            'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
          side === 'right' &&
            'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
          className
        )}
        style={{
          transform: translateY !== 0 ? `translateY(${translateY}px)` : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {/* Header - 关闭按钮单独一行 */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border/10">
          {/* Drag Handle - 视觉提示可拖拽关闭 */}
          {(side === 'bottom' || side === 'left') && (
            <div className="flex items-center justify-center">
              <GripVertical className="h-4 w-4 text-muted-foreground/40" />
            </div>
          )}
          
          {/* Spacer */}
          {side !== 'bottom' && side !== 'left' && <div />}

          {/* Close Button - 专业设计 */}
          <SheetPrimitive.Close 
            data-sheet-close
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg opacity-60 ring-offset-background transition-all duration-200 hover:opacity-100 hover:bg-secondary active:scale-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">关闭</span>
          </SheetPrimitive.Close>
        </div>

        {/* Accessible Title - 隐藏但存在 */}
        <SheetPrimitive.Title className="sr-only">
          侧边栏
        </SheetPrimitive.Title>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
