export type GmailBackgroundSyncParams = {
  emailAddress: string;
};

export type GmailBackgroundSyncWorker = {
  port: {
    postMessage: (params: GmailBackgroundSyncParams) => void;
    start: () => void;
  };
} & Omit<SharedWorker, "port">;
