export { createFilter, getFilters } from "./src/filters-api";

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
export { fullSync } from "./src/routines/full-sync";
export { partialSync } from "./src/routines/partial-sync";
