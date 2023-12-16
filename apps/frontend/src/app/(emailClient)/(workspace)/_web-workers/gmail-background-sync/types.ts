export type GmailBackgroundSyncParams = {
  emailAddress: string;
};

export type GmailBackgroundSyncWorker = {
  postMessage: (message: GmailBackgroundSyncParams) => void;
} & Omit<Worker, "postMessage">;
