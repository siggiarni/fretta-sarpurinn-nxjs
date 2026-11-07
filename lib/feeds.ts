export type Feed = {
  name: string;
  url: string;
  /** Badge background color; text is white, so keep it dark enough for contrast. */
  color: string;
};

export const feeds: Feed[] = [
  { name: "RÚV", url: "https://www.ruv.is/rss/frettir", color: "#b3261e" },
  { name: "mbl.is", url: "https://www.mbl.is/feeds/fp/", color: "#00005f" },
  { name: "Vísir", url: "https://www.visir.is/rss/allt", color: "#2f5396" },
  { name: "DV", url: "https://www.dv.is/feed/", color: "#6b21a8" },
  { name: "Heimildin", url: "https://heimildin.is/rss/", color: "#c2410c" },
  { name: "Viðskiptablaðið", url: "https://vb.is/rss/", color: "#0f766e" },
  { name: "akureyri.net", url: "https://www.akureyri.net/feed/", color: "#be185d" },
  { name: "Feykir", url: "https://www.feykir.is/feed/", color: "#92400e" },
  { name: "Bændablaðið", url: "https://www.bbl.is/rss/", color: "#4d7c0f" },
  { name: "Grapevine", url: "https://grapevine.is/feed/", color: "#334155" },
  { name: "FÍB", url: "https://fibfrettir.is/feed/", color: "#4338ca" },
  { name: "Veðurstofan", url: "https://www.vedur.is/um-vi/frettir/rss.xml", color: "#0369a1" },
];
