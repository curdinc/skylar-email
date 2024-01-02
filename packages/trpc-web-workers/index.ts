export { workerLink } from "./src/link";

export { sharedWorkerAdapter } from "./src/adapter/shared-worker";

export type {
  workerLinkOptions as SharedWorkerLinkOptions,
  workerMessageRequest as TRPCPostMessageRequest,
  workerMessageResponse as TRPCPostMessageResponse,
} from "./src/types";
