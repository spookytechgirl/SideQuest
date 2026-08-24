import Link from "next/link";

export const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/quiz", label: "Find My Quest" },
];

export const informationLinks = [
  { href: "/about", label: "About" },
  { href: "/categories", label: "Quest Categories" },
  { href: "/how-it-works", label: "How It Works" },
];

export const footerLinks = [
  ...primaryLinks,
  ...informationLinks,
  { href: "/privacy", label: "Privacy Policy" },
];

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
