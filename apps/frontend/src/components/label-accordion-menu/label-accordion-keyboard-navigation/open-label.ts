import {
  DATA_LABEL_ITEM,
  DATA_THREAD_ITEM,
  DATA_THREAD_WRAPPER,
  focusLabelAccordion,
  getLabelFromDataThreadItem,
  goDownToNextLabel,
  isActiveElementInLabelAccordion,
} from "./helpers";

export const openLabelOrGoToNextLabel = () => {
  const active = document.activeElement;

  if (!isActiveElementInLabelAccordion(active)) {
    return focusLabelAccordion();
  }

  const activeThreadDetail = active.getAttribute(DATA_THREAD_ITEM);
  const activeLabelDetail = active.getAttribute(DATA_LABEL_ITEM);

  if (activeThreadDetail) {
    // go to the next label
    const threadLabel = getLabelFromDataThreadItem(activeThreadDetail);
    if (!threadLabel) {
      return;
    }
    goDownToNextLabel({
      currentLabel: threadLabel,
    });
  } else if (activeLabelDetail) {
    const isOpen = !!document.querySelector(
      `[${DATA_THREAD_WRAPPER}=${activeLabelDetail}]`,
    );
    if (!isOpen) {
      (active as HTMLElement).click();
      (active as HTMLElement).focus();
    } else {
      // go to the next label
      goDownToNextLabel({
        currentLabel: activeLabelDetail,
      });
    }
  } else {
    console.warn("openLabelOrGoToNextLabel: unknown item type");
  }
};
