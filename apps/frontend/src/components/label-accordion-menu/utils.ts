export const DATA_LABEL = "data-list-item";
export const DATA_LIST_ITEM_THREAD_PREFIX = "thread";
export const DATA_LIST_ITEM_LABEL_PREFIX = "label";
export const getLabelDataListItem = (label: string) =>
  `${DATA_LIST_ITEM_LABEL_PREFIX}-${label}`;
export const getThreadDataListItem = (label: string, idx: number) =>
  `${DATA_LIST_ITEM_THREAD_PREFIX}-${label}-${idx}`;

const isActiveElementInLabelAccordion = (
  activeElement: Element | null,
): activeElement is Element => {
  const currentItemType = activeElement?.getAttribute(DATA_LABEL);
  return (
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    (currentItemType?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX) ||
      currentItemType?.startsWith(DATA_LIST_ITEM_THREAD_PREFIX)) ??
    false
  );
};

const focusLabelAccordion = () => {
  document.querySelector<HTMLElement>(`[${DATA_LABEL}]`)?.focus();
};

const getPreviousLabelRef = (currentItemType: string) => {
  // on a label, going up into the last thread
  const currentLabel = currentItemType.split("-")[1];
  if (!currentLabel) {
    return;
  }
  const labelsRef = document.querySelectorAll<HTMLElement>(
    `[${DATA_LABEL}^="${DATA_LIST_ITEM_LABEL_PREFIX}-"]`,
  );
  for (let i = 0; i < labelsRef.length; ++i) {
    const labelRef = labelsRef[i];
    const dataLabel = labelRef?.getAttribute(DATA_LABEL);
    const labelName = dataLabel?.split("-")[1];
    if (labelName === currentLabel) {
      return labelsRef[i - 1];
    }
  }
};

const upMessageListWithoutPreviousSibling = (activeElement: Element) => {
  const currentItemType = activeElement.getAttribute(DATA_LABEL);

  if (currentItemType?.startsWith(DATA_LIST_ITEM_THREAD_PREFIX)) {
    // on a thread, going up into the label of the thread list
    const currentLabel = currentItemType.split("-")[1];
    if (!currentLabel) {
      return;
    }
    const labelRef = document.querySelector<HTMLElement>(
      `[${DATA_LABEL}="${getLabelDataListItem(currentLabel)}"]`,
    );
    labelRef?.focus();
  } else if (currentItemType?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX)) {
    // on a label, going up into the last thread
    const previousLabelRef = getPreviousLabelRef(currentItemType);

    const previousLabelName = previousLabelRef
      ?.getAttribute(DATA_LABEL)
      ?.split("-")[1];
    if (!previousLabelName) {
      return;
    }
    const threadRef = document.querySelectorAll<HTMLElement>(
      `[${DATA_LABEL}^=${DATA_LIST_ITEM_THREAD_PREFIX}-${previousLabelName}]`,
    );
    if (threadRef.length === 0) {
      // go to the previous label
      previousLabelRef?.focus();
    } else {
      threadRef?.[threadRef.length - 1]?.focus();
    }
    return;
  } else {
    console.warn("upMessageListWithoutPreviousSibling: unknown item type");
  }
};

const goDownToNextLabel = (currentItemType: string) => {
  // on a thread, going down into the label of the next thread list
  const currentLabel = currentItemType.split("-")[1];
  if (!currentLabel) {
    return;
  }
  const labelsRef = document.querySelectorAll<HTMLElement>(
    `[${DATA_LABEL}^="${DATA_LIST_ITEM_LABEL_PREFIX}-"]`,
  );
  for (let i = 0; i < labelsRef.length; ++i) {
    const labelRef = labelsRef[i];
    const dataLabel = labelRef?.getAttribute(DATA_LABEL);
    const labelName = dataLabel?.split("-")[1];
    if (labelName === currentLabel) {
      const nextLabelRef = labelsRef[i + 1];
      nextLabelRef?.focus();
      return;
    }
  }
};

const downMessageListWithoutNextSibling = (activeElement: Element) => {
  const currentItemType = activeElement.getAttribute(DATA_LABEL);

  if (currentItemType?.startsWith(DATA_LIST_ITEM_THREAD_PREFIX)) {
    // on a thread, going down into the label of the next thread list
    goDownToNextLabel(currentItemType);
  } else if (currentItemType?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX)) {
    // on a label, going up into the last thread
    const currentLabel = currentItemType.split("-")[1];
    if (!currentLabel) {
      return;
    }
    const threadsRef = document.querySelectorAll<HTMLElement>(
      `[${DATA_LABEL}^="${DATA_LIST_ITEM_THREAD_PREFIX}-${currentLabel}-"]`,
    );
    if (threadsRef.length === 0) {
      goDownToNextLabel(currentItemType);
    } else {
      threadsRef?.[0]?.focus();
    }
  } else {
    console.warn("downMessageListWithoutNextSibling: unknown item type");
  }
};

export const goUpMessageList = () => {
  const active = document.activeElement;
  // If no message is focused, focus the first thing on the list
  if (!isActiveElementInLabelAccordion(active)) {
    focusLabelAccordion();
    return;
  }

  // if we have a sibling to go up to, go up to it
  if (active?.previousSibling) {
    const previousItemType =
      active.previousElementSibling?.getAttribute(DATA_LABEL);
    if (
      !previousItemType?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX) &&
      !previousItemType?.startsWith(DATA_LIST_ITEM_THREAD_PREFIX)
    ) {
      upMessageListWithoutPreviousSibling(active);
    } else {
      (active.previousElementSibling as HTMLElement | undefined)?.focus();
    }
  } else {
    upMessageListWithoutPreviousSibling(active);
  }
};

export const goDownMessageList = () => {
  const active = document.activeElement;
  if (!isActiveElementInLabelAccordion(active)) {
    return focusLabelAccordion();
  }
  if (active.nextSibling) {
    const nextItemType = active.nextElementSibling?.getAttribute(DATA_LABEL);
    if (
      !nextItemType?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX) &&
      !nextItemType?.startsWith(DATA_LIST_ITEM_THREAD_PREFIX)
    ) {
      downMessageListWithoutNextSibling(active);
    } else {
      (active.nextElementSibling as HTMLElement | undefined)?.focus();
    }
  } else {
    downMessageListWithoutNextSibling(active);
  }
};

export const openLabelOrGoToNextLabel = () => {
  const active = document.activeElement;

  if (!isActiveElementInLabelAccordion(active)) {
    return focusLabelAccordion();
  }

  const currentItemType = active.getAttribute(DATA_LABEL);

  if (currentItemType?.startsWith(DATA_LIST_ITEM_THREAD_PREFIX)) {
    // go to the next label
    goDownToNextLabel(currentItemType);
  } else if (currentItemType?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX)) {
    const isOpen = !active.nextElementSibling
      ?.getAttribute(DATA_LABEL)
      ?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX);
    if (!isOpen) {
      (active as HTMLElement).click();
      (active as HTMLElement).focus();
    } else {
      // go to the next label
      goDownToNextLabel(currentItemType);
    }
  } else {
    console.warn("openLabelOrGoToNextLabel: unknown item type");
  }
};

export const closeCurrentOrGoToPreviousLabel = () => {
  const active = document.activeElement;

  if (!isActiveElementInLabelAccordion(active)) {
    return focusLabelAccordion();
  }

  const currentItemType = active.getAttribute(DATA_LABEL);

  if (currentItemType?.startsWith(DATA_LIST_ITEM_THREAD_PREFIX)) {
    // Close the label
    const currentLabel = currentItemType.split("-")[1];
    if (!currentLabel) {
      return;
    }
    const labelRef = document.querySelector<HTMLElement>(
      `[${DATA_LABEL}="${getLabelDataListItem(currentLabel)}"]`,
    );
    labelRef?.click();
    labelRef?.focus();
  } else if (currentItemType?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX)) {
    // GO to the previous label
    const isOpen = !active.nextElementSibling
      ?.getAttribute(DATA_LABEL)
      ?.startsWith(DATA_LIST_ITEM_LABEL_PREFIX);
    if (isOpen) {
      (active as HTMLElement).click();
    } else {
      // go to the previous label
      const previousLabelRef = getPreviousLabelRef(currentItemType);
      previousLabelRef?.focus();
    }
  } else {
    console.warn("openLabelOrGoToNextLabel: unknown item type");
  }
};
