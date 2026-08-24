export default function MobileMenuToggle({ isOpen, onToggle }) {
  return (
    <button
      className="nav-toggle"
      type="button"
      aria-controls="site-navigation"
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      onClick={onToggle}
    >
      <span>Menu</span>
      <span className="nav-toggle-icon" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
