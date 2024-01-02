import {
  ATTACHMENT_SIZE_LIMIT_IN_BYTES,
  isAttachmentSizeValid,
} from "~/lib/email";
import { formatBytes } from "~/lib/format";
import { useAttachmentList } from "~/lib/store/attachment-list";

export const AttachmentListFileSize = ({
  customRender,
}: {
  customRender?: (args: { sizeInBytes: number }) => React.ReactNode;
}) => {
  const [attachments] = useAttachmentList();
  const totalAttachmentSize = attachments.reduce(
    (acc, attachment) => acc + attachment.sizeInBytes,
    0,
  );

  if (customRender) {
    return customRender({ sizeInBytes: totalAttachmentSize });
  }

  return <div>Total Attachment size: {formatBytes(totalAttachmentSize)}</div>;
};

export const withWarning = ({ sizeInBytes }: { sizeInBytes: number }) => {
  let AttachmentSizeWarning = (
    <div>Total Attachment size: {formatBytes(sizeInBytes)}</div>
  );
  if (!isAttachmentSizeValid(sizeInBytes)) {
    AttachmentSizeWarning = (
      <div className="text-red-500">
        Total Attachment size: {formatBytes(sizeInBytes)} (Max:{" "}
        {formatBytes(ATTACHMENT_SIZE_LIMIT_IN_BYTES)})
      </div>
    );
  }
  return AttachmentSizeWarning;
};
