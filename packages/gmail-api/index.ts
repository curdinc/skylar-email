export { batchModifyLabels, batchTrashThreads } from "./src/core-api";

export {
  batchCreateLabel,
  getAccessToken,
  listLabels,
  modifyLabels,
  sendMail,
  trashMessage,
  trashThread,
  untrashMessage,
  untrashThread,
} from "./src/core-api";
export { fullSync } from "./src/routines/full-sync";
export { partialSync } from "./src/routines/partial-sync";
