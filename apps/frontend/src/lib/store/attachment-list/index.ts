import { atom, useAtom } from "jotai";

export type AttachmentListType = {
  mimeType: string;
  fileName: string;
  data?: string;
  preview?: string;
  sizeInBytes: number;
};

const attachmentListAtom = atom<AttachmentListType[]>([]);
export const useAttachmentList = () => useAtom(attachmentListAtom);
