import { getArticles } from "@/lib/rss";

const dateFormat = new Intl.DateTimeFormat("is-IS", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Atlantic/Reykjavik",
});

export default async function Home() {
  const { articles, failed } = await getArticles();

  return (
    <main className="container">
      <h1>Fréttasarpurinn</h1>

      {failed.length > 0 && (
        <p className="notice">Ekki tókst að sækja: {failed.join(", ")}</p>
      )}

      {articles.length === 0 ? (
        <p className="empty">Engar fréttir fundust.</p>
      ) : (
        <ul className="articles">
          {articles.map((article) => (
            <li key={article.link} className="article">
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
              <div className="meta">
                {article.source}
                {article.date && (
                  <>
                    {" · "}
                    <time dateTime={article.date}>
                      {dateFormat.format(new Date(article.date))}
                    </time>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
