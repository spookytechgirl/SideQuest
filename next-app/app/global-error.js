"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

const globalErrorStyles = `
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 1rem; color: #f8f1df; background: #08120b; font-family: system-ui, sans-serif; }
  main { width: min(100%, 42rem); padding: clamp(1.5rem, 6vw, 3rem); border: 1px solid rgba(192,232,141,.25); border-radius: 1.5rem; background: linear-gradient(145deg,#142119,#0d1710); box-shadow: 0 28px 70px rgba(0,0,0,.4); text-align: center; }
  .mark { display: grid; width: 4rem; height: 4rem; margin: 0 auto 1.2rem; place-items: center; border-radius: 50%; color: #08120b; background: #c0e88d; font-size: 1.7rem; font-weight: 800; }
  p { color: #c6c8bd; line-height: 1.65; }
  h1 { margin: 0; color: #f8f1df; font-size: clamp(2.25rem,8vw,4.5rem); line-height: .98; letter-spacing: -.06em; }
  h1 span { color: #f4865a; }
  .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: .75rem; margin-top: 1.6rem; }
  button, a { min-height: 44px; padding: .8rem 1.2rem; border: 1px solid rgba(192,232,141,.3); border-radius: 999px; cursor: pointer; font: inherit; font-weight: 800; text-decoration: none; }
  button { color: #08120b; background: #f4865a; }
  a { color: #f8f1df; background: rgba(255,255,255,.05); }
  button:focus-visible, a:focus-visible { outline: 3px solid #c0e88d; outline-offset: 3px; }
  @media (prefers-color-scheme: light) { body { color: #152116; background: #f3eddc; } main { background: #fffaf0; border-color: rgba(29,86,50,.22); } h1 { color: #152116; } p { color: #4d5a4e; } a { color: #152116; background: rgba(29,86,50,.06); } }
`;

export default function GlobalError({ error, retry }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Unexpected Error | SideQuest</title>
        <meta name="robots" content="noindex, nofollow" />
        <style>{globalErrorStyles}</style>
      </head>
      <body>
        <main>
          <div className="mark" aria-hidden="true">↗</div>
          <h1>Unexpected<br /><span>Detour.</span></h1>
          <p>
            SideQuest hit a trail marker it could not read. Try again, or head home and choose another path.
          </p>
          <div className="actions">
            <button type="button" onClick={() => retry()}>Try Again</button>
            <Link href="/">Return Home</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
