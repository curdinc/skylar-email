import {
  DATA_LABEL_ITEM,
  DATA_THREAD_ITEM,
  focusLabelAccordion,
  getLabelFromDataThreadItem,
  getPreviousLabel,
  isActiveElementInLabelAccordion,
} from "./helpers";

const upLabelListWithoutPreviousSibling = (activeElement: Element) => {
  const activeThreadDetail = activeElement.getAttribute(DATA_THREAD_ITEM);
  const activeLabelDetail = activeElement.getAttribute(DATA_LABEL_ITEM);

  if (activeThreadDetail) {
    // on a thread, going up into the label of the thread list
    const currentLabel = getLabelFromDataThreadItem(activeThreadDetail);
    if (!currentLabel) {
      return;
    }
    const labelRef = document.querySelector<HTMLElement>(
      `[${DATA_LABEL_ITEM}="${currentLabel}"]`,
    );
    labelRef?.focus();
  } else if (activeLabelDetail) {
    // on a label, going up into the last thread
    const previousLabelDetail = getPreviousLabel({
      currentLabel: activeLabelDetail,
    });

    if (!previousLabelDetail?.previousLabelName) {
      return;
    }

    const threadRef = document.querySelectorAll<HTMLElement>(
      `[${DATA_THREAD_ITEM}^="${previousLabelDetail.previousLabelName}-"]`,
    );
    if (threadRef.length === 0) {
      // go to the previous label
      previousLabelDetail?.previousLabelRef?.focus();
    } else {
      threadRef?.[threadRef.length - 1]?.focus();
    }
    return;
  } else {
    console.warn("upMessageListWithoutPreviousSibling: unknown item type");
  }
};

export const goUpLabelList = (e: KeyboardEvent) => {
  e.preventDefault();
  const active = document.activeElement;
  // If no message is focused, focus the first thing on the list
  if (!isActiveElementInLabelAccordion(active)) {
    focusLabelAccordion();
    return;
  }

  // if we have a sibling to go up to, go up to it
  if (active?.previousSibling) {
    const isThread =
      !!active.previousElementSibling?.getAttribute(DATA_THREAD_ITEM);
    const isLabel =
      !!active.previousElementSibling?.getAttribute(DATA_LABEL_ITEM);

    if (!isThread && !isLabel) {
      upLabelListWithoutPreviousSibling(active);
    } else {
      (active.previousElementSibling as HTMLElement | undefined)?.focus();
    }
  } else {
    upLabelListWithoutPreviousSibling(active);
  }
};
