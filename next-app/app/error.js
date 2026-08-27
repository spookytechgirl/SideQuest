"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="page-shell info-page-shell">
      <meta name="robots" content="noindex, nofollow" />
      <section className="hero info-page error-page" aria-labelledby="error-title">
        <div className="brand-mark" aria-hidden="true"><span>↗</span></div>
        <p className="eyebrow">Unexpected detour</p>
        <h1 id="error-title" className="info-page-title">
          Trail<br /><span>Interrupted.</span>
        </h1>
        <p className="intro info-page-intro">
          Something went sideways while opening this part of SideQuest. Your private details remain hidden.
        </p>
        <div className="error-actions">
          <button className="quest-button" type="button" onClick={() => reset()}>
            <span>Try Again</span><span className="button-arrow" aria-hidden="true">↻</span>
          </button>
          <Link className="admin-secondary-button" href="/">Return Home</Link>
        </div>
      </section>
    </main>
  );
}
