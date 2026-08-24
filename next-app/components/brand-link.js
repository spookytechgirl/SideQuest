import Link from "next/link";

export default function BrandLink() {
  return (
    <Link className="brand-mark brand-link" href="/" aria-label="SideQuest home">
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
