import BrandLink from "@/components/brand-link";
import LoginPanel from "@/components/login-panel";
import PageShell from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your SideQuest account with email or Google.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const initialError =
    params?.error === "oauth_callback"
      ? "Google sign-in could not be completed. Please try again."
      : "";

  return (
    <PageShell pageClassName="info-page login-page">
      <BrandLink />

      <p className="eyebrow">Account access</p>
      <h1 id="page-title" className="info-page-title">
        Welcome
        <br />
        <span>back.</span>
      </h1>
      <p className="intro info-page-intro">
        Pick up where your small adventures left off.
      </p>

      <section
        className="info-surface login-panel"
        aria-label="SideQuest account sign in"
        data-server-auth={user ? "signed-in" : "signed-out"}
      >
        <LoginPanel initialSignedIn={Boolean(user)} initialError={initialError} />
      </section>
    </PageShell>
  );
}
