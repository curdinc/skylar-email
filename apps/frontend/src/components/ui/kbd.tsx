import { forwardRef } from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/ui";

const kbdVariants = cva(
  "tracking-widest border border-secondary bg-muted text-xs font-semibold text-muted-foreground",
  {
    variants: {
      size: {
        md: "px-1 py-0.5 rounded-sm",
        sm: "px-0.5 rounded-xs",
        lg: "px-1.5 py-1 rounded-md",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export type KbdProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof kbdVariants>;

const Kbd = forwardRef<HTMLDivElement, KbdProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(kbdVariants({ size, className }))}
        {...props}
      />
    );
  },
);
Kbd.displayName = "Kbd";

export { Kbd, kbdVariants };
