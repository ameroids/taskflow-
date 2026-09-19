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
    <>
      <style>{`
        #ats-splash { position: fixed; inset: 0; z-index: 10000; background: #F5F6F8; display: flex; align-items: center; justify-content: center; opacity: 1; transition: opacity .5s cubic-bezier(.22,1,.36,1),visibility .5s; }
        #ats-splash .ats-inner { display: flex; flex-direction: column; align-items: center; transition: transform .5s cubic-bezier(.22,1,.36,1); }
        .ats-mark { position: relative; width: 92px; height: 92px; margin-bottom: 24px; }
        .ats-mark svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .ats-ring { fill: none; stroke: #3F5CF5; stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 289.03; stroke-dashoffset: 289.03; animation: ats-ring .95s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes ats-ring { to { stroke-dashoffset: 0; } }
        .ats-a { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: 'Amiri', Georgia, serif; font-size: 46px; line-height: 1; color: #3F5CF5; opacity: 0; transform: scale(.7); animation: ats-pop .55s cubic-bezier(.22,1,.36,1) .3s forwards; }
        @keyframes ats-pop { to { opacity: 1; transform: scale(1); } }
        .ats-word { display: flex; font-family: 'DM Sans', sans-serif; font-size: 21px; font-weight: 600; letter-spacing: .3em; margin-left: .3em; color: #171A21; }
        .ats-word span { opacity: 0; transform: translateY(12px); animation: ats-up .5s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes ats-up { to { opacity: 1; transform: translateY(0); } }
        .ats-tag { font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: .42em; margin-left: .42em; text-transform: uppercase; color: #666D7C; margin-top: 10px; opacity: 0; animation: ats-fade .35s ease-out .5s forwards; }
        @keyframes ats-fade { to { opacity: 1; } }
        .ats-bar { width: 150px; height: 2px; background: #E3E5EA; border-radius: 2px; margin-top: 28px; overflow: hidden; }
        .ats-bar span { display: block; height: 100%; width: 0; background: #3F5CF5; border-radius: 2px; animation: ats-load .75s cubic-bezier(.4,0,.2,1) .15s forwards; }
        @keyframes ats-load { to { width: 100%; } }
      `}</style>
      <div id="ats-splash" aria-hidden="true">
        <div className="ats-inner">
          <div className="ats-mark">
            <svg viewBox="0 0 100 100"><circle className="ats-ring" cx="50" cy="50" r="46" /></svg>
            <span className="ats-a">A</span>
          </div>
          <div className="ats-word">
            {'AMEROIDS'.split('').map((ch, i) => (
              <span key={i} style={{ animationDelay: `${(0.45 + i * 0.055).toFixed(3)}s` }}>{ch}</span>
            ))}
          </div>
          <div className="ats-tag">Tech Studio</div>
          <div className="ats-bar"><span></span></div>
        </div>
      </div>
    </>
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
