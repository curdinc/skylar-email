import type {
  HistoryObjectType,
  ModifiedLabelType,
} from "@skylar/parsers-and-types";

import { getHistoryListUnbounded } from "../unbounded-core-api";

function dedupe<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function subtractArray<T>(arr1: T[], arr2: T[]) {
  return arr1.filter((x) => !new Set(arr2).has(x));
}

function parseMessageChangesFromHistoryObject(
  historyObject: HistoryObjectType,
) {
  let messagesAdded: string[] = [];
  let messagesDeleted: string[] = [];
  let labelsModified: ModifiedLabelType[] = [];

  historyObject.history.map((historyObj) => {
    messagesAdded = messagesAdded.concat(
      historyObj.messagesAdded?.map((m) => m.message.id) ?? [],
    );
    messagesDeleted = messagesDeleted.concat(
      historyObj.messagesDeleted?.map((m) => m.message.id) ?? [],
    );
    labelsModified = labelsModified.concat(
      historyObj.labelsAdded?.map((m) => ({
        mid: m.message.id,
        newLabels: m.message.labelIds,
      })) ?? [],
    );
    labelsModified = labelsModified.concat(
      historyObj.labelsRemoved?.map((m) => ({
        mid: m.message.id,
        newLabels: m.message.labelIds,
      })) ?? [],
    );
  });

  return {
    messagesAdded,
    messagesDeleted,
    labelsModified: labelsModified.reverse(), // reverse since history list is ascending so dedupe takes last
  };
}

export async function getMessageChangesFromHistoryId({
  emailId,
  accessToken,
  startHistoryId,
  pageToken,
}: {
  emailId: string;
  startHistoryId: string;
  accessToken: string;
  pageToken?: string;
}) {
  const batchHistoryObject = await getHistoryListUnbounded({
    accessToken,
    emailId,
    startHistoryId,
    pageToken,
  });

  const lastCheckedHistoryId = batchHistoryObject
    .slice(-1)[0]
    ?.history.slice(-1)[0]?.id;
  if (!lastCheckedHistoryId) {
    throw new Error("Unknown error in getting history id.", {
      cause: "getMessageChangesFromHistoryId",
    });
  }

  let messagesAdded: string[] = [];
  let messagesDeleted: string[] = [];
  let labelsModified: ModifiedLabelType[] = [];

  batchHistoryObject.map((historyObj) => {
    const messageChanges = parseMessageChangesFromHistoryObject(historyObj);
    messagesAdded = messagesAdded.concat(messageChanges.messagesAdded);
    messagesDeleted = messagesDeleted.concat(messageChanges.messagesDeleted);
    labelsModified = labelsModified.concat(messageChanges.labelsModified);
  });

  const uniqueItems: Record<string, boolean> = {};
  const dedupedLabelsModified = labelsModified
    .reverse()
    .reduce((result, labelObj) => {
      if (!uniqueItems[labelObj.mid]) {
        result.push(labelObj);
        uniqueItems[labelObj.mid] = true;
      }
      return result;
    }, Array<ModifiedLabelType>());

  return {
    messagesAdded: dedupe(subtractArray(messagesAdded, messagesDeleted)),
    messagesDeleted: dedupe(messagesDeleted),
    labelsModified: dedupedLabelsModified,
    lastCheckedHistoryId,
  };
}
