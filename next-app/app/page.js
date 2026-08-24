import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      <section className={styles.card} aria-labelledby="sidequest-title">
        <p className={styles.eyebrow}>Next.js migration · Phase 1</p>
        <div className={styles.mark} aria-hidden="true">↗</div>
        <h1 id="sidequest-title">
          Side<span>Quest.</span>
        </h1>
        <p className={styles.intro}>
          The new trailhead is ready. This isolated App Router foundation is
          running beside the original SideQuest application.
        </p>
        <div className={styles.status} role="status">
          <span aria-hidden="true" />
          Next.js foundation running
        </div>
      </section>
    </main>
  );
}
