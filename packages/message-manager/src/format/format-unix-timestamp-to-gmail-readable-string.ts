import { format } from "date-fns";

export const formatUnixTimestampToGmailReadableString = (date: number) => {
  return format(new Date(date), "ccc, MMM dd, yyyy 'at' K:mm a");
};
