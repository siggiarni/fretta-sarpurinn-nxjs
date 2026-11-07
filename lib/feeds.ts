export type Feed = {
  name: string;
  url: string;
  /** Badge background color; text is white, so keep it dark enough for contrast. */
  color: string;
};

export const feeds: Feed[] = [
  { name: "RÚV", url: "https://www.ruv.is/rss/frettir", color: "#b3261e" },
  { name: "mbl.is", url: "https://www.mbl.is/feeds/fp/", color: "#1d4f91" },
  { name: "Vísir", url: "https://www.visir.is/rss/allt", color: "#1b7340" },
];
