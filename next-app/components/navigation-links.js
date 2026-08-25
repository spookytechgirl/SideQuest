import Link from "next/link";

export const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/quiz", label: "Find My Quest" },
  { href: "/chat", label: "SideQuest Guide" },
];

const memberLinks = [
  { href: "/adventure-log", label: "Adventure Log" },
  { href: "/saved-quests", label: "Saved Quests" },
  { href: "/profile", label: "Profile" },
  { href: "/my-quests", label: "My Quests" },
];

export function getPrimaryLinks(isSignedIn, isAdmin = false) {
  if (!isSignedIn) {
    return [...publicLinks, { href: "/login", label: "Login" }];
  }

  return [
    ...publicLinks,
    ...memberLinks,
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];
}

export const informationLinks = [
  { href: "/about", label: "About" },
  { href: "/categories", label: "Quest Categories" },
  { href: "/how-it-works", label: "How It Works" },
];

export function getFooterLinks(isSignedIn, isAdmin = false) {
  return [
    ...getPrimaryLinks(isSignedIn, isAdmin),
    ...informationLinks,
    { href: "/privacy", label: "Privacy Policy" },
  ];
}

export default function NavigationLinks({
  links,
  pathname,
  className,
  label,
  onNavigate,
}) {
  return (
    <nav className={className} aria-label={label}>
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            href={link.href}
            key={link.href}
            aria-current={isActive ? "page" : undefined}
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
