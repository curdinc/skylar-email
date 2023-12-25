export const DATA_THREAD_ITEM = "data-thread-item";
export const DATA_LABEL_ITEM = "data-label-item";
export const DATA_THREAD_WRAPPER = "data-thread-wrapper";

export const getDataThreadItem = (label: string, idx: number) =>
  `${label}-${idx}`;
export const getLabelFromDataThreadItem = (dataThreadItem: string) =>
  dataThreadItem.split("-")[0];

export const isActiveElementInLabelAccordion = (
  activeElement: Element | null,
): activeElement is Element => {
  const threadItem = activeElement?.getAttribute(DATA_THREAD_ITEM);
  const labelItem = activeElement?.getAttribute(DATA_LABEL_ITEM);
  return (!!threadItem || !!labelItem) ?? false;
};

export const focusLabelAccordion = () => {
  document.querySelector<HTMLElement>(`[${DATA_LABEL_ITEM}]`)?.focus();
};

export const getPreviousLabel = ({
  currentLabel,
}: {
  currentLabel: string;
}) => {
  // on a label, going up into the last thread
  const labelsRef = document.querySelectorAll<HTMLElement>(
    `[${DATA_LABEL_ITEM}]`,
  );
  for (let i = 0; i < labelsRef.length; ++i) {
    const labelRef = labelsRef[i];
    const labelName = labelRef?.getAttribute(DATA_LABEL_ITEM);
    if (labelName === currentLabel) {
      return {
        previousLabelRef: labelsRef[i - 1],
        previousLabelName: labelsRef[i - 1]?.getAttribute(DATA_LABEL_ITEM),
      };
    }
  }
};

export const goDownToNextLabel = ({
  currentLabel,
}: {
  currentLabel: string;
}) => {
  // on a thread, going down into the label of the next thread list
  const labelsRef = document.querySelectorAll<HTMLElement>(
    `[${DATA_LABEL_ITEM}]`,
  );
  for (let i = 0; i < labelsRef.length; ++i) {
    const labelRef = labelsRef[i];
    const labelName = labelRef?.getAttribute(DATA_LABEL_ITEM);
    if (labelName === currentLabel) {
      const nextLabelRef = labelsRef[i + 1];
      nextLabelRef?.focus();
      return;
    }
  }
};
