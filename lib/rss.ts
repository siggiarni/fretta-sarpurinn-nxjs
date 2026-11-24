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
/**
 * Newest articles taken from each feed. There is no overall cap, so every
 * source always appears and the page holds at most feeds × this many items.
 */
const MAX_PER_FEED = 10;
/** Give up on a feed that hasn't answered in time, so one slow site can't stall the page. */
const FEED_TIMEOUT_MS = 10_000;
/** Total tries per feed: one retry after a server error (5xx), timeout or network failure. */
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1_000;

/**
 * Identify the app to feed servers instead of sending Node's generic default,
 * which bot filters tend to block.
 */
const USER_AGENT =
  "FrettaSarpurinn/1.0 (+https://github.com/siggiarni/fretta-sarpurinn-nxjs)";

const parser = new Parser();

const byNewest = (a: Article, b: Article) => (b.date ?? "").localeCompare(a.date ?? "");

/**
 * Resolve a feed item's link against the feed URL (so relative links work)
 * and accept only http(s) links. Returns null for anything else.
 */
function safeLink(link: string | undefined, base: string): string | null {
  if (!link) return null;
  try {
    const url = new URL(link.trim(), base);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

/** Keep the first article for each link; input order decides which one wins. */
function uniqueByLink(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((a) => !seen.has(a.link) && seen.add(a.link));
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch a feed, retrying once on a server error (5xx), timeout or network
 * failure — the kind of blip a busy host recovers from. Client errors (4xx)
 * are returned as-is, since retrying won't change them.
 */
async function fetchWithRetry(url: string): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    const isLastAttempt = attempt >= MAX_ATTEMPTS;
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8",
        },
        signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
      });
      if (res.status < 500 || isLastAttempt) return res;
      await res.body?.cancel();
    } catch (err) {
      if (isLastAttempt) throw err;
    }
    await sleep(RETRY_DELAY_MS);
  }
}

async function fetchFeed(feed: Feed): Promise<Article[]> {
  const res = await fetchWithRetry(feed.url);
  if (!res.ok) {
    throw new Error(`${feed.name}: HTTP ${res.status}`);
  }
  const parsed = await parser.parseString(await res.text());

  const articles: Article[] = [];
  for (const item of parsed.items) {
    const link = safeLink(item.link, feed.url);
    if (!link) continue;
    articles.push({
      title: item.title?.trim() || link,
      link,
      source: feed.name,
      slug: feed.slug,
      date: item.isoDate ?? null,
    });
  }

  return uniqueByLink(articles.sort(byNewest)).slice(0, MAX_PER_FEED);
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

  // Drop links shared across feeds (keeping the newest copy) so each story
  // shows once and list keys stay unique.
  return { articles: uniqueByLink(articles.sort(byNewest)), failed };
}
