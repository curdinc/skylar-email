import type { TRPCRequest, TRPCResponse } from "@trpc/server/rpc";

export type workerLinkOptions = {
  createWorker: () => SharedWorker;
};

export type workerMessageRequest = {
  trpc: TRPCRequest & { id: number }; // force id to be a number for simplicity
};

export type workerMessageResponse = {
  trpc: TRPCResponse & { id: number }; // force id to be a number for simplicity
};
