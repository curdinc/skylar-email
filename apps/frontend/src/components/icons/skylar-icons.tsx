"use client";

import Link from "next/link";

import { siteConfig } from "~/lib/config";
import { cn } from "~/lib/ui";
import { ImageLogo } from "../ui/image-logo";

export const SkylarIcon = ({ className }: { className?: string }) => {
  return (
    <ImageLogo
      src={"/favicon-32x32.png"}
      alt="Skylar Icon"
      className={className}
      width={64}
      height={64}
    />
  );
};

export const SkylarIconWithText = ({
  href,
  linkClassName,
  logoClassName,
  textClassName,
}: {
  href?: string;
  linkClassName?: string;
  textClassName?: string;
  logoClassName?: string;
}) => {
  return (
    <Link
      href={href ?? "/"}
      className={cn("flex items-center space-x-2", linkClassName)}
    >
      <SkylarIcon className={logoClassName} />
      <span className={cn("hidden font-bold sm:inline-block", textClassName)}>
        {siteConfig.name}
      </span>
    </Link>
  );
};
