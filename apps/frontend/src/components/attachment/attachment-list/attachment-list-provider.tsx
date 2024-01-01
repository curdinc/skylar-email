import { useEffect } from "react";

import type { AttachmentListType } from "~/lib/store/attachment-list";
import { useAttachmentList } from "~/lib/store/attachment-list";

export const AttachmentListProvider = ({
  attachments,
  children,
}: {
  attachments: AttachmentListType[];
  children: React.ReactNode;
}) => {
  const [, setAttachments] = useAttachmentList();
  useEffect(() => {
    setAttachments(attachments);
  }, [attachments, setAttachments]);
  return children;
};
