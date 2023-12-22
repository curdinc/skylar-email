export const DATA_LABEL = "data-list-item";
export const DATA_LIST_ITEM_THREAD_PREFIX = "thread";
export const DATA_LIST_ITEM_LABEL_PREFIX = "label";
export const getLabelDataListItem = (label: string) =>
  `${DATA_LIST_ITEM_LABEL_PREFIX}-${label}`;
export const getThreadDataListItem = (label: string, idx: number) =>
  `${DATA_LIST_ITEM_THREAD_PREFIX}-${label}-${idx}`;

export const goUpMessageList = () => {
  const active = document.activeElement;
  if (
    !active
      ?.getAttribute(DATA_LABEL)
      ?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX) &&
    !active?.getAttribute(DATA_LABEL)?.startsWith(DATA_LIST_ITEM_THREAD_PREFIX)
  ) {
    (
      document.querySelector(`[${DATA_LABEL}]`) as HTMLElement | undefined
    )?.focus();
    return;
  }

  if (active.previousSibling) {
    const previousItemType =
      active.previousElementSibling?.getAttribute(DATA_LABEL);
    if (
      !previousItemType?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX) &&
      !previousItemType?.startsWith(DATA_LIST_ITEM_THREAD_PREFIX)
    ) {
      // on a label and going up into the thread list
      const label = active?.getAttribute(DATA_LABEL)?.split("-")[1];
      if (!label) {
        return;
      }
      const labelRef = document.querySelector<HTMLElement>(
        `[${DATA_LABEL}="${getLabelDataListItem(label)}"]`,
      );
      labelRef?.focus();
    } else {
      (active.previousElementSibling as HTMLElement | undefined)?.focus();
    }
  } else {
    // Top of thread list, going up into the label or
    // On a label, going up into the last thread
    const currentDataLabel = active?.getAttribute(DATA_LABEL);
    const dataLabelSplit = currentDataLabel?.split("-");
    console.log("dataLabelSplit", dataLabelSplit);
    if (!dataLabelSplit) {
      return;
    }
    const [itemType, label] = dataLabelSplit;
    if (itemType === DATA_LIST_ITEM_THREAD_PREFIX) {
      // on a thread, going up into the label
      if (!label) {
        return;
      }
      const labelRef = document.querySelector<HTMLElement>(
        `[${DATA_LABEL}="${getLabelDataListItem(label)}"]`,
      );
      labelRef?.focus();
      return;
    } else if (itemType === DATA_LIST_ITEM_LABEL_PREFIX) {
      // THis is not happening here
      // on a label, going up into the last thread
      const labelsRef = document.querySelectorAll(`[${DATA_LABEL}^="label-"]`);
      console.log("labelsRef", labelsRef);
      for (let i = 0; i < labelsRef.length; ++i) {
        const labelRef = labelsRef[i];
        const labelDataLabel = labelRef?.getAttribute(DATA_LABEL);
        const labelName = labelDataLabel?.split("-")[1];
        if (labelName === label) {
          const priorLabelRef = labelsRef[i - 1];
          console.log("priorLabelRef", priorLabelRef);
          if (!priorLabelRef) {
            return;
          }
          const priorLabelName = priorLabelRef
            .getAttribute(DATA_LABEL)
            ?.split("-")[1];
          console.log("priorLabelName", priorLabelName);
          if (!priorLabelName) {
            return;
          }
          const threadRef = document.querySelectorAll<HTMLElement>(
            `[${DATA_LABEL}^=${DATA_LIST_ITEM_THREAD_PREFIX}-${priorLabelName}]`,
          );
          threadRef?.[threadRef.length - 1]?.focus();
          break;
        }
      }
      const threads = document.querySelectorAll(
        `[${DATA_LABEL}^="${DATA_LIST_ITEM_THREAD_PREFIX}-${label}"]`,
      );
      const lastThread = threads[threads.length - 1];
      (lastThread as HTMLElement | undefined)?.focus();
      return;
    }
  }
};

export const goDownMessageList = () => {
  const active = document.activeElement;
  if (
    !active
      ?.getAttribute(DATA_LABEL)
      ?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX) &&
    !active?.getAttribute(DATA_LABEL)?.startsWith(DATA_LIST_ITEM_THREAD_PREFIX)
  ) {
    (
      document.querySelector(`[${DATA_LABEL}]`) as HTMLElement | undefined
    )?.focus();
    return;
  }
  if (active.nextSibling) {
    const nextItemType = active.nextElementSibling?.getAttribute(DATA_LABEL);
    if (
      !nextItemType?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX) &&
      !nextItemType?.startsWith(DATA_LIST_ITEM_THREAD_PREFIX)
    ) {
      // on a label and going down into the thread list
      const label = active?.getAttribute(DATA_LABEL)?.split("-")[1];
      if (!label) {
        return;
      }
      const firstMessageRef = document.querySelector<HTMLElement>(
        `[${DATA_LABEL}="${getThreadDataListItem(label, 0)}"]`,
      );
      firstMessageRef?.focus();
    } else {
      (active.nextElementSibling as HTMLElement | undefined)?.focus();
    }
  } else {
    // end of thread list, going down into the next label
    const currentDataLabel = active?.getAttribute(DATA_LABEL);
    const messageLabel = currentDataLabel?.split("-")[1];
    const labelsRef = document.querySelectorAll<HTMLElement>(
      `[${DATA_LABEL}^="${DATA_LIST_ITEM_LABEL_PREFIX}-"]`,
    );
    for (let i = 0; i < labelsRef.length; ++i) {
      const labelRef = labelsRef[i];
      if (!labelRef) {
        return;
      }
      const labelName = labelRef.getAttribute(DATA_LABEL)?.split("-")[1];
      if (labelName === messageLabel) {
        if (labelsRef[i + 1]) {
          const nextLabel = labelsRef[i + 1];
          nextLabel?.focus();
        } else {
          const firstLabel = labelsRef[0];
          firstLabel?.focus();
        }
        break;
      }
    }
  }
};
