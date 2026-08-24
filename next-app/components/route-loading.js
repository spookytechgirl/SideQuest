export default function RouteLoading({
  eyebrow = "Following the trail",
  title = "Loading your next stop…",
}) {
  return (
    <main className="page-shell info-page-shell">
      <section className="hero info-page route-loading" aria-labelledby="loading-title">
        <div className="brand-mark" aria-hidden="true"><span>↗</span></div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="loading-title" className="route-loading-title">{title}</h1>
        <div className="loading-card" role="status" aria-live="polite" aria-busy="true">
          <span className="loading-orbit" aria-hidden="true" />
          <p>One moment while SideQuest gets things ready.</p>
        </div>
      </section>
    </main>
  );
}
