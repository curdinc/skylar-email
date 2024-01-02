const USELESS_WORDS = [
  "",
  " ",
  "-",
  "–",
  "&",
  "!",
  "!!",
  "*",
  ":",
  ">",
  "<",
  ",",
  "(",
  ")",
];

export function buildSearchableString(text: string, delimiter = " ") {
  const allWordsIncludingDuplicates = text.split(delimiter);
  const wordSet = allWordsIncludingDuplicates.reduce(function (prev, current) {
    if (USELESS_WORDS.includes(current)) {
      return prev;
    }
    const firstAlphaIndex = current.search(/[a-z]/i);
    // converts "\"This\"" to "this" so that we can search for "this" and find "\"This\"""
    const firstAlpha = current.substring(firstAlphaIndex).toLowerCase();

    prev.add(firstAlpha);
    return prev;
  }, new Set<string>());
  return Array.from(wordSet);
}
