import type { Config } from "dompurify";
import { sanitize as domPurifySanitize } from "dompurify";

export const sanitize = (dirty: string, options?: Config) => {
  return {
    __html: domPurifySanitize(dirty, { ...options }) as string,
  };
};
