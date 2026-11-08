export type Feed = {
  name: string;
  url: string;
  /**
   * CSS class added to the source badge (e.g. `badge ruv`).
   * Badge colors are set per slug in app/globals.css.
   */
  slug: string;
};

export const feeds: Feed[] = [
  { name: "RÚV", url: "https://www.ruv.is/rss/frettir", slug: "ruv" },
  { name: "mbl.is", url: "https://www.mbl.is/feeds/fp/", slug: "mbl" },
  { name: "Vísir", url: "https://www.visir.is/rss/allt", slug: "visir" },
  { name: "DV", url: "https://www.dv.is/feed/", slug: "dv" },
  { name: "Heimildin", url: "https://heimildin.is/rss/", slug: "heimildin" },
  { name: "akureyri.net", url: "https://www.akureyri.net/feed/", slug: "akureyri" },
  { name: "Feykir", url: "https://www.feykir.is/feed/", slug: "feykir" },
  { name: "Bændablaðið", url: "https://www.bbl.is/rss/", slug: "baendabladid" },
  { name: "Grapevine", url: "https://grapevine.is/feed/", slug: "grapevine" },
  { name: "FÍB", url: "https://fibfrettir.is/feed/", slug: "fibfrettir" },
  { name: "Veðurstofan", url: "https://www.vedur.is/um-vi/frettir/rss.xml", slug: "vedur" },
];
