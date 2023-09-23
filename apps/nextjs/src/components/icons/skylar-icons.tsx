"use client";

import Link from "next/link";

import { useUser } from "@skylar/auth/client";

import { siteConfig } from "~/lib/config";
import { cn } from "~/lib/ui";
import SkylarLogoSrc from "../../../public/favicon-32x32.png";
import { ImageLogo } from "../ui/image-logo";

export const SkylarIcon = ({ className }: { className?: string }) => {
  return (
    <ImageLogo src={SkylarLogoSrc} alt="Skylar Icon" className={className} />
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
  const user = useUser();
  const defaultHref = user ? "/inbox" : "/";
  return (
    <Link
      href={href ?? defaultHref}
      className={cn("flex items-center space-x-2", linkClassName)}
    >
      <SkylarIcon className={logoClassName} />
      <span className={cn("hidden font-bold sm:inline-block", textClassName)}>
        {siteConfig.name}
      </span>
    </Link>
  );
};
