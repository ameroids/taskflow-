export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-border-soft text-center text-[12.5px] text-text-muted">
      Crafted by <span className="font-medium text-text-secondary">Ameroids Tech Studio</span>
      <span className="mx-2">·</span>
      Contact:{' '}
      <a
        href="https://wa.me/917223861653"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-brand-500 hover:text-brand-600 transition-colors"
      >
        7223861653
      </a>
    </footer>
  );
}
