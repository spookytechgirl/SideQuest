"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavigationLinks, { footerLinks } from "./navigation-links";

export default function Footer({ note = "Small adventures count." }) {
  const pathname = usePathname();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <Link className="footer-brand" href="/">
          Side<span>Quest.</span>
        </Link>
        <NavigationLinks
          links={footerLinks}
          pathname={pathname}
          className="footer-nav"
          label="Footer navigation"
        />
        <p className="footer-note">{note}</p>
      </div>
    </footer>
  );
}
