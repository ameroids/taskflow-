export function Spinner({ size = 20, className = '' }) {
  return (
    <svg className={`animate-spin text-brand-500 ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-canvas absolute inset-0 z-50">
      <Spinner size={36} />
      <div className="text-lg font-bold tracking-widest text-brand-500/80 animate-pulse">
        AMEROIDS
      </div>
    </div>
  );
}

export function SkeletonRow({ cols = 4 }) {
  return (
    <div className="flex items-center gap-4 py-3.5 px-4 animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-3 bg-border-soft rounded flex-1" />
      ))}
    </div>
  );
}
