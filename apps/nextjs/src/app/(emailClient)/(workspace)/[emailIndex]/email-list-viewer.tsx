import { useRef, useState } from "react";
import type { AllotmentHandle } from "allotment";
import { Allotment } from "allotment";

import { filterForLabels } from "@skylar/client-db";

import { Icons } from "~/components/icons";
import { useLogger } from "~/lib/logger";
import { useListLabels } from "../use-list-labels";
import { EmailList } from "./email-list";

const CLOSED_FOLDER_SIZE = 30;

export const EmailListViewer = () => {
  const logger = useLogger();
  const { data: labels, isLoading } = useListLabels();

  const allotmentRef = useRef<AllotmentHandle>(null);
  const [panelSizes, setPanelSizes] = useState<number[]>([]);

  const onChangePanelSizes = (sizes: number[]) => {
    console.log("sizes", sizes);
    setPanelSizes(sizes);
  };

  if (isLoading) {
    return;
  }

  if (!labels) {
    logger.warn("Done loading but no labels found");
    return;
  }
  const togglePanel = (index: number) => () => {
    const newSizes = [...panelSizes];
    if (newSizes[index] === CLOSED_FOLDER_SIZE) {
      newSizes[index] = 100;
      allotmentRef.current?.resize(newSizes);
    } else {
      const currentSize = newSizes[index];
      if (!currentSize) {
        throw new Error("Invalid siing");
      }
      newSizes[index - 1] += currentSize - CLOSED_FOLDER_SIZE;
      newSizes[index] = CLOSED_FOLDER_SIZE;
      console.log("newSizes", newSizes);
      allotmentRef.current?.resize(newSizes);
    }
  };

  return (
    <Allotment
      vertical
      ref={allotmentRef}
      onChange={onChangePanelSizes}
      minSize={CLOSED_FOLDER_SIZE}
      proportionalLayout={false}
    >
      {Object.values(labels)
        .flat()
        .map((label, index) => {
          return (
            <Allotment.Pane key={label.name}>
              <div className="h-full overflow-auto">
                <button
                  className="flex w-full items-center gap-2 bg-accent px-2 py-1 text-xs text-accent-foreground"
                  onClick={togglePanel(index)}
                >
                  <Icons.chevronDown className="w-4" /> {label.name}{" "}
                </button>

                <EmailList
                  uniqueListId={label.name}
                  filters={[filterForLabels([label.name])]}
                />
              </div>
            </Allotment.Pane>
          );
        })}
    </Allotment>
  );
};
