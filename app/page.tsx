import { getArticles } from "@/lib/rss";

const dateParts = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Atlantic/Reykjavik",
});

/** Formats as "dd.MM.yyyy HH:mm" in Icelandic time. */
function formatDate(iso: string): string {
  const p = Object.fromEntries(
    dateParts.formatToParts(new Date(iso)).map(({ type, value }) => [type, value]),
  );
  return `${p.day}.${p.month}.${p.year} ${p.hour}:${p.minute}`;
}

export default async function Home() {
  const { articles, failed } = await getArticles();

  return (
    <>
      <header className="header">
        <h1 className="header__title">📰 Frétta sarpur&shy;inn</h1>
      </header>

      <main className="main">
        {failed.length > 0 && (
          <div className="error-message">
            <p>Ekki tókst að sækja fréttir frá: {failed.join(", ")}</p>
          </div>
        )}

        {articles.length > 0 && (
          <ul className="feeds">
            {articles.map((article) => (
              <li key={article.link} className="item">
                <span className={`badge ${article.slug}`}>{article.source}</span>
                <h2 className="item__headline">
                  <a
                    className="item__link"
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {article.title}
                  </a>
                  {article.date && (
                    <time className="item__timestamp" dateTime={article.date}>
                      ({formatDate(article.date)})
                    </time>
                  )}
                </h2>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
