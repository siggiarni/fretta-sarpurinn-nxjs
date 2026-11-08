import Parser from "rss-parser";
import { cacheLife } from "next/cache";
import { feeds, type Feed } from "./feeds";

export type Article = {
  title: string;
  link: string;
  source: string;
  slug: string;
  date: string | null;
};

const REVALIDATE_SECONDS = 600;
const MAX_ARTICLES = 50;
/** Keep busy feeds from crowding out the rest. */
const MAX_PER_FEED = 15;

/**
 * Identify the app to feed servers instead of sending Node's generic default,
 * which bot filters tend to block.
 */
const USER_AGENT =
  "FrettaSarpurinn/1.0 (+https://github.com/siggiarni/fretta-sarpurinn-nxjs)";

const parser = new Parser();

async function fetchFeed(feed: Feed): Promise<Article[]> {
  const res = await fetch(feed.url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8",
    },
  });
  if (!res.ok) {
    throw new Error(`${feed.name}: HTTP ${res.status}`);
  }
  const parsed = await parser.parseString(await res.text());

  return parsed.items
    .filter((item) => item.link)
    .map((item) => ({
      title: item.title?.trim() || item.link!,
      link: item.link!,
      source: feed.name,
      slug: feed.slug,
      date: item.isoDate ?? null,
    }))
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, MAX_PER_FEED);
}

export async function getArticles(): Promise<{ articles: Article[]; failed: string[] }> {
  "use cache";
  cacheLife({ revalidate: REVALIDATE_SECONDS });

  const results = await Promise.allSettled(feeds.map(fetchFeed));

  const articles: Article[] = [];
  const failed: string[] = [];

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      console.error(`Failed to load feed ${feeds[i].name}:`, result.reason);
      failed.push(feeds[i].name);
    }
  });

  articles.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return { articles: articles.slice(0, MAX_ARTICLES), failed };
}
