export type GmailBackgroundSyncParams = {
  emailAddress: string;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface GmailBackgroundSyncWorker extends Omit<Worker, "postMessage"> {
  postMessage: (message: GmailBackgroundSyncParams) => void;
}
