import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const dialogVariants = cva(
  " fixed left-1/2 top-1/2 z-[9999] grid w-full -translate-x-1/2 -translate-y-1/2 bg-background p-6 sm:p-8 md:p-9 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-3xl border border-slate-200/90 dark:border-slate-800 grid gap-4",
  {
    variants: {
      size: {
        xs: "max-w-[380px] w-[92%]",
        sm: "max-w-[500px] w-[92%]",
        md: "max-w-[680px] w-[94%]",
        lg: "w-[95%] max-w-[880px] lg:max-w-[960px]",
        xl: "w-[96%] max-w-[1040px]",
        "2xl": "w-[96%] max-w-[1180px]",
        "3xl": "w-[96%] max-w-[1280px]",
        "4xl": "w-[98%] max-w-[1400px]",
        "5xl": "w-[98%] max-w-[1500px]",
        full: "h-screen max-w-full rounded-none",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  }
);
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed z-[9990] inset-0 bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}


function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
      {...props}
    />
  );
}


function DialogContent({
  className,
  children,
  size,
  overlayClass,
  overlayScroll = false,
  hiddenCloseIcon = false,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  overlayClass?: string;
  overlayScroll?: boolean;
  hiddenCloseIcon?: boolean;
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay className={overlayClass} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(dialogVariants({ size }), className)}
        {...props}
      >
        <DialogTitle className="sr-only">Dialog Title</DialogTitle>
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute right-5 top-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer z-50 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Tutup</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}



function DialogHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left  relative",
      className
    )}
      {...props}
    />
  );
}


function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 ",
      className
    )}
      {...props}
    />
  );
}



function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
    className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}



export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
