import type { Config } from "dompurify";

export const RawHtmlDisplay = ({
  html,
  className,
}: {
  html: string;
  className?: string;
  options?: Config;
}) => {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
};
