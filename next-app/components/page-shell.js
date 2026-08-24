import Footer from "./footer";
import Header from "./header";

export default function PageShell({
  children,
  shellClassName = "info-page-shell",
  pageClassName = "info-page",
  footerNote,
}) {
  return (
    <>
      <main className={`page-shell ${shellClassName}`}>
        <section className={`hero ${pageClassName}`} aria-labelledby="page-title">
          <Header />
          {children}
        </section>
      </main>
      <Footer note={footerNote} />
      <div className="orb orb-one" aria-hidden="true" />
      <div className="orb orb-two" aria-hidden="true" />
    </>
  );
}
