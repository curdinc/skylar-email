import { forwardRef } from "react";
import Image from "next/image";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/ui";

const imageLogoVariants = cva("rounded-md", {
  variants: {
    size: {
      sm: "w-6 h-6",
      md: "w-7 h-7",
      lg: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type ImageLogoProps = Parameters<typeof Image>[0] &
  VariantProps<typeof imageLogoVariants>;

const ImageLogo = forwardRef<HTMLImageElement, ImageLogoProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        className={cn(
          imageLogoVariants({
            size,
            className,
          }),
        )}
        {...props}
      />
    );
  },
);
ImageLogo.displayName = "ImageLogo";

export { ImageLogo, imageLogoVariants };
