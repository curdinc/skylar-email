import {
  DATA_LABEL_ITEM,
  DATA_THREAD_ITEM,
  DATA_THREAD_WRAPPER,
  focusLabelAccordion,
  getLabelFromDataThreadItem,
  getPreviousLabel,
  isActiveElementInLabelAccordion,
} from "./helpers";

export const closeCurrentOrGoToPreviousLabel = () => {
  const active = document.activeElement;

  if (!isActiveElementInLabelAccordion(active)) {
    return focusLabelAccordion();
  }

  const activeThreadDetail = active.getAttribute(DATA_THREAD_ITEM);
  const activeLabelDetail = active.getAttribute(DATA_LABEL_ITEM);

  if (activeThreadDetail) {
    // Close the label
    const labelRef = document.querySelector<HTMLElement>(
      `[${DATA_LABEL_ITEM}="${getLabelFromDataThreadItem(
        activeThreadDetail,
      )}"]`,
    );
    labelRef?.click();
    labelRef?.focus();
  } else if (activeLabelDetail) {
    // GO to the previous label
    const isOpen =
      !!active.nextElementSibling?.getAttribute(DATA_THREAD_WRAPPER);
    if (isOpen) {
      (active as HTMLElement).click();
      (active as HTMLElement).focus();
    } else {
      // go to the previous label
      const previousLabelDetail = getPreviousLabel({
        currentLabel: activeLabelDetail,
      });
      previousLabelDetail?.previousLabelRef?.focus();
    }
  } else {
    console.warn("openLabelOrGoToNextLabel: unknown item type");
  }
};
