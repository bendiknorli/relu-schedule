import * as React from "react";
import { cn } from "../../lib/utils";

type Variant = "yellow" | "blue" | "green" | "white" | "gray";

const styles: Record<Variant, string> = {
    yellow: "bg-yellow-100 text-yellow-900 border-yellow-300",
    blue: "bg-blue-100 text-blue-900 border-blue-300",
    green: "bg-green-100 text-green-900 border-green-300",
    white: "bg-white text-gray-700 border-gray-300",
    gray: "bg-gray-100 text-gray-800 border-gray-300",
};

export function Badge({
    className,
    variant = "gray",
    ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border",
                styles[variant],
                className
            )}
            {...props}
        />
    );
}
