"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import MobileMenuToggle from "./mobile-menu-toggle";
import NavigationLinks, {
  getPrimaryLinks,
  informationLinks,
} from "./navigation-links";
import ThemeToggle from "./theme-toggle";

export default function Header({ isSignedIn = false, isAdmin = false }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 60rem)");

    const handlePointerDown = (event) => {
      if (isOpen && headerRef.current && !headerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        headerRef.current?.querySelector(".nav-toggle")?.focus();
      }
    };

    const handleBreakpointChange = (event) => {
      if (!event.matches) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    mobileQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      mobileQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header" ref={headerRef}>
      <MobileMenuToggle
        isOpen={isOpen}
        onToggle={() => setIsOpen((open) => !open)}
      />
      <div className="top-nav-panel" id="site-navigation" data-open={isOpen}>
        <NavigationLinks
          links={getPrimaryLinks(isSignedIn, isAdmin)}
          pathname={pathname}
          className="site-nav"
          label="Main navigation"
          onNavigate={closeMenu}
        />
        <NavigationLinks
          links={informationLinks}
          pathname={pathname}
          className="info-nav"
          label="About SideQuest"
          onNavigate={closeMenu}
        />
      </div>
      <ThemeToggle />
    </header>
  );
}
