'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

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
            'w-full fixed inset-0 z-50 bg-primaryLight  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            className
        )}
        {...props}
        ref={ref}
    />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
    'fixed w-screen left-0 z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 ',
    {
        variants: {
            side: {
                special:
                    'top-0 border-b h-screen w-full data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top aaa md:inset-y-0 md:right-0 md:h-full md:border-l md:data-[state=closed]:slide-out-to-right md:data-[state=open]:slide-in-from-right ',
                top: 'inset-x-0 top-0 border-b h-screen  data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
                bottom: 'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
                left: 'inset-y-0 left-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left ',
                right: 'inset-y-0 right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right ',
            },
            size: {
                special: 'w-64 md:w-[1200px]',
                small: 'w-64',
                medium: 'w-96',
                large: 'w-[800px]',
                extraLarge: 'w-[1200px]',
            },
            colorScheme: {
                light: 'bg-primaryLight ',
                dark: 'bg-primaryDark ',
            },
        },
        defaultVariants: {
            side: 'right',
            size: 'extraLarge',
            colorScheme: 'light',
        },
    }
);

interface SheetContentProps
    extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
        VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    SheetContentProps
>(
    (
        {
            side = 'right',
            size = 'extraLarge',
            colorScheme = 'light',
            className,
            children,
            ...props
        },
        ref
    ) => (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
                ref={ref}
                className={cn(
                    sheetVariants({ side, size, colorScheme }),
                    className,
                    'overflow-y-auto'
                )}
                {...props}
            >
                {children}
                <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-primaryLight dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-primaryDark">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fechar</span>
                </SheetPrimitive.Close>
            </SheetPrimitive.Content>
        </SheetPortal>
    )
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex  flex-col space-y-2 text-center sm:text-left',
            className
        )}
        {...props}
    />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex flex-col-reverse  sm:flex-row sm:justify-end sm:space-x-2',
            className
        )}
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
        className={cn(
            'text-lg font-semibold text-primaryDark text-4xl -light ',
            className
        )}
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
        className={cn('text-sm   text-primaryDark -light ', className)}
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
