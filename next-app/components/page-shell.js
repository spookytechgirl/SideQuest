import Footer from "./footer";
import Header from "./header";
import { getViewerContext } from "@/lib/auth";

export default async function PageShell({
  children,
  shellClassName = "info-page-shell",
  pageClassName = "info-page",
  footerNote,
}) {
  const { user, role } = await getViewerContext();

  return (
    <>
      <main className={`page-shell ${shellClassName}`}>
        <section className={`hero ${pageClassName}`} aria-labelledby="page-title">
          <Header isAdmin={role === "admin"} isSignedIn={Boolean(user)} />
          {children}
        </section>
      </main>
      <Footer
        isAdmin={role === "admin"}
        isSignedIn={Boolean(user)}
        note={footerNote}
      />
      <div className="orb orb-one" aria-hidden="true" />
      <div className="orb orb-two" aria-hidden="true" />
    </>
  );
}
