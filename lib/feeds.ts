export type Feed = {
  name: string;
  url: string;
};

export const feeds: Feed[] = [
  { name: "RÚV", url: "https://www.ruv.is/rss/frettir" },
  { name: "mbl.is", url: "https://www.mbl.is/feeds/fp/" },
  { name: "Vísir", url: "https://www.visir.is/rss/allt" },
];
