import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-harbor-gray bg-white px-3 py-2 text-base text-deep-charcoal ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-deep-charcoal placeholder:text-harbor-gray focus-visible:outline-none focus-visible:ring-0 focus-visible:border-2 focus-visible:border-clinical-slate disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
