import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clinical-slate focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-clinical-slate text-parchment hover:bg-clinical-slate/90",
                destructive:
                    "bg-critical-crimson text-parchment hover:bg-critical-crimson/90",
                outline:
                    "border border-clinical-slate bg-transparent text-clinical-slate hover:bg-clinical-slate/10",
                secondary:
                    "bg-harbor-gray text-deep-charcoal hover:bg-harbor-gray/80",
                ghost: "text-clinical-slate hover:bg-clinical-slate/10",
                link: "text-clinical-slate underline-offset-4 hover:underline",
                success:
                    "bg-vital-green text-parchment hover:bg-vital-green/90",
                warning:
                    "bg-urgent-amber text-deep-charcoal hover:bg-urgent-amber/90",
            },
            size: {
                default: "h-10 px-4 py-2 text-base",
                sm: "h-9 rounded-md px-3 text-sm",
                lg: "h-11 rounded-md px-8 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
