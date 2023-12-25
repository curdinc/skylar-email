import {
  DATA_LABEL_ITEM,
  DATA_THREAD_ITEM,
  focusLabelAccordion,
  getLabelFromDataThreadItem,
  goDownToNextLabel,
  isActiveElementInLabelAccordion,
} from "./helpers";

const downLabelListWithoutNextSibling = (activeElement: Element) => {
  const activeThreadDetail = activeElement.getAttribute(DATA_THREAD_ITEM);
  const activeLabelDetail = activeElement.getAttribute(DATA_LABEL_ITEM);

  if (activeThreadDetail) {
    // on a thread, going down into the label of the next thread list
    const threadLabel = getLabelFromDataThreadItem(activeThreadDetail);
    if (!threadLabel) {
      return;
    }
    goDownToNextLabel({
      currentLabel: threadLabel,
    });
  } else if (activeLabelDetail) {
    // on a label, going down into the thread list
    const threadsRef = document.querySelectorAll<HTMLElement>(
      `[${DATA_THREAD_ITEM}^="${activeLabelDetail}"]`,
    );
    if (threadsRef.length === 0) {
      goDownToNextLabel({ currentLabel: activeLabelDetail });
    } else {
      threadsRef?.[0]?.focus();
    }
  } else {
    console.warn("downMessageListWithoutNextSibling: unknown item type");
  }
};

export const goDownLabelList = (e: KeyboardEvent) => {
  e.preventDefault();
  const active = document.activeElement;
  if (!isActiveElementInLabelAccordion(active)) {
    return focusLabelAccordion();
  }

  if (active.nextSibling) {
    const isThread =
      !!active.nextElementSibling?.getAttribute(DATA_THREAD_ITEM);
    const isLabel = !!active.nextElementSibling?.getAttribute(DATA_LABEL_ITEM);

    if (!isThread && !isLabel) {
      downLabelListWithoutNextSibling(active);
    } else {
      (active.nextElementSibling as HTMLElement | undefined)?.focus();
    }
  } else {
    downLabelListWithoutNextSibling(active);
  }
};
