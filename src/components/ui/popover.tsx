import * as React from "react";
import { cn } from "../../lib/utils";

export function Popover({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export function PopoverTrigger(
    props: React.HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
) {
    const { asChild, className, ...rest } = props;
    if (asChild) return <>{props.children}</>;
    return (
        <button
            type="button"
            className={cn(
                "outline-none focus:ring-2 focus:ring-blue-500",
                className
            )}
            {...rest}
        />
    );
}

export const PopoverContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => {
    return (
        <div
            ref={ref}
            role="dialog"
            className={cn(
                "z-50 rounded-xl border border-gray-200 bg-white p-3 text-sm shadow-lg",
                className
            )}
            style={{ minWidth: 200, ...style }}
            {...props}
        />
    );
});
PopoverContent.displayName = "PopoverContent";
