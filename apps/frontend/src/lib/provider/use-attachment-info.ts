import { useQuery } from "@tanstack/react-query";

import { gmailApiWorker } from "@skylar/web-worker-logic";

export const useAttachmentInfo = () => {
  return useQuery({
    queryKey: ["ATTACHMENT_INFO"],
    queryFn: async () => {
      gmailApiWorker.message;
      return "OK";
    },
  });
};
