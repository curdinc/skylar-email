import { Fragment, useEffect, useState } from "react";

import { filterForLabels } from "@skylar/client-db";
import { useActiveEmails } from "@skylar/logic";

import { Icons } from "~/components/icons";
import { useLogger } from "~/lib/logger";
import { useListLabels } from "../use-list-labels";
import { EmailList } from "./email-list";

export const EmailListViewer = () => {
  const logger = useLogger();
  const { data: labels, isLoading } = useListLabels();
  const activeEmails = useActiveEmails();

  const [activeLabels, setActiveLabels] = useState<
    { name: string; id: string }[]
  >([]);
  const [visibleLabels, setVisibleLabels] = useState<Record<string, boolean>>(
    {},
  );

  const onClickLabel = (labelId: string) => {
    return () => {
      setVisibleLabels((prev) => ({
        ...prev,
        [labelId]: !prev[labelId],
      }));
    };
  };

  useEffect(() => {
    if (!labels) {
      return;
    }
    const activeLabels = activeEmails
      .map((email) => {
        return labels[email];
      })
      .filter((labels) => !!labels)
      .flat() as (typeof labels)[keyof typeof labels];

    setActiveLabels(activeLabels);
  }, [activeEmails, labels]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!labels) {
    logger.warn("Done loading but no labels found");
    return;
  }

  return (
    <div className="relative h-full w-full overflow-auto">
      {activeLabels.map((label) => {
        let ButtonIcon = <Icons.chevronRight className="w-4" />;
        if (visibleLabels[label.id]) {
          ButtonIcon = <Icons.chevronDown className="w-4" />;
        }
        return (
          <Fragment key={label.id}>
            <button
              className="sticky top-0 z-10 flex w-full items-center gap-1 bg-secondary px-2 py-1 text-sm"
              onClick={onClickLabel(label.id)}
            >
              {ButtonIcon} {label.name}
            </button>
            {visibleLabels[label.id] && (
              <EmailList
                filters={[filterForLabels([label.id])]}
                uniqueListId={label.id}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};
