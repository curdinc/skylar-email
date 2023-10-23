import type { TreeItem } from "react-complex-tree";
import { Tree, UncontrolledTreeEnvironment } from "react-complex-tree";

import "react-complex-tree/lib/style-modern.css";

import { useMemo } from "react";

import {
  EMAIL_PROVIDER_LABELS,
  useThreadSnippetsInfinite,
} from "@skylar/client-db";
import type { ThreadType } from "@skylar/client-db/schema/thread";
import { useActiveEmails } from "@skylar/logic";

import { useListLabels } from "../use-list-labels";
import { FileExplorerDataProvider } from "./file-explorer-data";

export function FileExplorer() {
  const activeEmails = useActiveEmails();
  const { data: emailLabelsMap } = useListLabels();
  const { threads, fetchNextPage, hasNextPage } = useThreadSnippetsInfinite({
    userEmails: activeEmails,
  });
  console.log("hasNextPage", hasNextPage);
  console.log("threads", threads);
  const treeViewerData = useMemo(() => {
    console.log("computing labels");
    const root = {
      root: {
        index: "root",
        canMove: false,
        canRename: false,
        isFolder: true,
        children: activeEmails,
        data: { name: "root" },
      },
    } satisfies { root: TreeItem<{ name: string }> };

    const emailFolders = activeEmails
      .map((email) => {
        return {
          [email]: {
            index: email,
            canMove: false,
            canRename: true,
            isFolder: true,
            children:
              emailLabelsMap?.[email]?.map((label) => `${email}_${label.id}`) ??
              [],
            data: { name: email },
          },
        } satisfies Record<string, TreeItem<{ name: string }>>;
      })
      .reduce((acc, emailFolder) => {
        return {
          ...acc,
          ...emailFolder,
        };
      }, {});

    const labelFolders = activeEmails
      .map((email) => {
        return emailLabelsMap?.[email]?.map((label) => {
          const relevantThreads = threads?.pages.flat().filter((thread) => {
            return thread.email_provider_labels.includes(label.id);
          });
          const relevantThreadsIds = hasNextPage
            ? relevantThreads
                ?.map((thread) => {
                  return thread.email_provider_thread_id;
                })
                .concat([`${email}_${label.id}_loadMore`])
            : relevantThreads?.map((thread) => {
                return thread.email_provider_thread_id;
              });

          return {
            [`${email}_${label.id}`]: {
              index: `${email}_${label.id}`,
              canMove: false,
              canRename: !Object.values(EMAIL_PROVIDER_LABELS.GMAIL).some(
                (stockLabel) => stockLabel === label.id,
              ),
              isFolder: true,
              children: relevantThreadsIds,
              data: { name: label.name },
            },
          };
        }) satisfies Record<string, TreeItem<{ name: string }>>[] | undefined;
      })
      .flat()
      .reduce((acc, labelFolder) => {
        return {
          ...acc,
          ...labelFolder,
        };
      }, {});

    if (!labelFolders) {
      return {
        ...root,
        ...emailFolders,
      };
    }

    const threadsLeaf = threads?.pages
      .flat()
      .map((thread) => {
        return {
          [thread.email_provider_thread_id]: {
            index: thread.email_provider_thread_id,
            canMove: true,
            canRename: true,
            isFolder: false,
            children: [],
            data: { name: thread.subject, ...thread },
          },
        };
      })
      .reduce((acc, threads) => {
        return {
          ...acc,
          ...threads,
        };
      }, {});

    const result = {
      ...root,
      ...emailFolders,
      ...labelFolders,
      ...threadsLeaf,
    };
    console.log("result", result);
    return result;
  }, [activeEmails, emailLabelsMap, hasNextPage, threads?.pages]);

  return (
    <UncontrolledTreeEnvironment<Partial<ThreadType> & { name: string }>
      key={
        activeEmails.join("") +
        JSON.stringify(emailLabelsMap) +
        JSON.stringify(threads?.pages)
      }
      dataProvider={
        new FileExplorerDataProvider<{ name: string }>(
          treeViewerData,
          (item, newName) => {
            return {
              ...item,
              data: {
                ...item.data,
                name: newName,
              },
            };
          },
        )
      }
      getItemTitle={(item) => {
        if (item.data.from) {
          return `${item.data.from.at(-1)} - ${item.data.subject}`;
        }
        return item.data.name.toLowerCase();
      }}
      onMissingItems={(items) => {
        console.log("missing items", items);
        fetchNextPage().catch(console.error);
      }}
      viewState={{}}
    >
      <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  );
}
