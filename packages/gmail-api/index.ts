export {
  batchCreateLabels,
  batchModifyLabels,
  batchTrashThreads,
  batchUntrashThreads,
} from "./src/core-api";

export {
  getAccessToken,
  listLabels,
  modifyLabels,
  sendMail,
  trashMessage,
  trashThread,
  untrashMessage,
  untrashThread,
} from "./src/core-api";
export { incrementalSync } from "./src/routines/incremental-sync";
export { partialSync } from "./src/routines/partial-sync";
