import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const TIPS = [
  "INITIALIZING GAME ENGINE...",
  "LOADING ASSETS...",
  "SYNCING PLAYER DATA...",
  "CALIBRATING CONTROLS...",
  "ENTERING THE ARENA...",
];

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const wrapperRef = useRef(null);

  /* ── progress ticker ── */
  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(t); return 100; }
        return p + 1;
      });
    }, 28);
    return () => clearInterval(t);
  }, []);

  /* ── cycle loading tips ── */
  useEffect(() => {
    const t = setInterval(() => setTip((p) => (p + 1) % TIPS.length), 900);
    return () => clearInterval(t);
  }, []);

  /* ── random glitch flashes ── */
  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  /* ── exit animation ── */
  useEffect(() => {
    if (progress < 100) return;
    const tl = gsap.timeline({ onComplete });
    tl.to(".pre-hud", { opacity: 0, duration: 0.3 })
      .to(".pre-bar-fill", { scaleX: 1, duration: 0.2 }, "<")
      .to(".pre-screen", {
        scaleY: 0,
        transformOrigin: "center center",
        duration: 0.55,
        ease: "power4.in",
      })
      .to(wrapperRef.current, { opacity: 0, duration: 0.25 });
  }, [progress, onComplete]);

  const pct = Math.min(progress, 100);

  return (
    <div
      ref={wrapperRef}
      className="preloader fixed inset-0 z-[200] overflow-hidden bg-black"
    >
      {/* ── scanlines overlay ── */}
      <div className="pointer-events-none absolute inset-0 z-30 opacity-[0.06]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0px,#fff 1px,transparent 1px,transparent 4px)" }}
      />

      {/* ── animated grid ── */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
        style={{ backgroundImage: "linear-gradient(rgba(139,92,246,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.8) 1px,transparent 1px)", backgroundSize: "48px 48px" }}
      />

      {/* ── glow blobs ── */}
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-violet-600/25 blur-[90px]" />
      <div className="pointer-events-none absolute -right-20 bottom-1/3 h-72 w-72 rounded-full bg-yellow-400/15 blur-[90px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-[60px]" />

      {/* ── floating particles ── */}
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full bg-violet-300"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            left: `${5 + (i * 5.3) % 90}%`,
            top: `${10 + (i * 7.1) % 80}%`,
            opacity: 0.15 + (i % 5) * 0.07,
            animation: `pre-float ${3 + (i % 4)}s ease-in-out ${(i * 0.3) % 2}s infinite alternate`,
          }}
        />
      ))}

      {/* ══════════════ MAIN SCREEN ══════════════ */}
      <div className="pre-screen absolute inset-0 z-10 flex flex-col items-center justify-center px-6">

        {/* ── HUD corner brackets ── */}
        <div className="pre-hud pointer-events-none absolute inset-4 sm:inset-8">
          {/* top-left */}
          <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-violet-400 sm:h-12 sm:w-12" />
          {/* top-right */}
          <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-violet-400 sm:h-12 sm:w-12" />
          {/* bottom-left */}
          <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-yellow-300 sm:h-12 sm:w-12" />
          {/* bottom-right */}
          <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-yellow-300 sm:h-12 sm:w-12" />

          {/* corner dots */}
          <span className="absolute left-0 top-0 h-2 w-2 -translate-x-0.5 -translate-y-0.5 rounded-full bg-violet-400" />
          <span className="absolute right-0 top-0 h-2 w-2 translate-x-0.5 -translate-y-0.5 rounded-full bg-violet-400" />
          <span className="absolute bottom-0 left-0 h-2 w-2 -translate-x-0.5 translate-y-0.5 rounded-full bg-yellow-300" />
          <span className="absolute bottom-0 right-0 h-2 w-2 translate-x-0.5 translate-y-0.5 rounded-full bg-yellow-300" />

          {/* top status bar */}
          <div className="absolute left-10 top-0 flex items-center gap-3 sm:left-14">
            <span className="font-general text-[9px] uppercase tracking-[0.25em] text-violet-400/70 sm:text-[10px]">SYS BOOT</span>
            <span className="h-px w-8 bg-violet-400/40 sm:w-16" />
            <span className="font-general text-[9px] uppercase tracking-[0.25em] text-violet-400/70 sm:text-[10px]">v2.0.25</span>
          </div>

          {/* bottom status bar */}
          <div className="absolute bottom-0 right-10 flex items-center gap-3 sm:right-14">
            <span className="font-general text-[9px] uppercase tracking-[0.25em] text-yellow-300/60 sm:text-[10px]">PLAYER 1</span>
            <span className="h-px w-8 bg-yellow-300/40 sm:w-16" />
            <span className="font-general text-[9px] uppercase tracking-[0.25em] text-yellow-300/60 sm:text-[10px]">READY</span>
          </div>
        </div>

        {/* ── center content ── */}
        <div className="pre-hud flex flex-col items-center gap-6 sm:gap-8">

          {/* logo + orbit ring */}
          <div className="relative flex items-center justify-center">
            {/* outer orbit */}
            <div
              className="absolute rounded-full border border-violet-400/20"
              style={{ width: 160, height: 160, animation: "pre-spin 12s linear infinite" }}
            />
            {/* orbit dot */}
            <div
              className="absolute rounded-full"
              style={{ width: 160, height: 160, animation: "pre-spin 12s linear infinite" }}
            >
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,1)]" />
            </div>

            {/* inner dashed ring */}
            <div
              className="absolute rounded-full border border-dashed border-yellow-300/25"
              style={{ width: 120, height: 120, animation: "pre-spin 7s linear infinite reverse" }}
            />
            {/* inner orbit dot */}
            <div
              className="absolute rounded-full"
              style={{ width: 120, height: 120, animation: "pre-spin 7s linear infinite reverse" }}
            >
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 shadow-[0_0_6px_rgba(253,224,71,1)]" />
            </div>

            {/* logo */}
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-violet-400/40 bg-black shadow-[0_0_24px_rgba(139,92,246,0.5)] sm:h-20 sm:w-20">
              <img src="/52.png" alt="logo" className="h-10 w-auto sm:h-12" />
            </div>
          </div>

          {/* glitch title */}
          <div className="relative text-center">
            <h1
              className="font-zentry text-4xl font-black uppercase tracking-[0.12em] text-white sm:text-5xl md:text-6xl"
              style={glitch ? {
                textShadow: "3px 0 #a855f7, -3px 0 #eab308",
                transform: "skewX(-4deg)",
                filter: "brightness(1.4)",
              } : {
                textShadow: "0 0 30px rgba(139,92,246,0.6), 0 0 60px rgba(139,92,246,0.2)",
              }}
            >
              GAME<span className="text-violet-400">ZONE</span>
              <span className="text-yellow-300">365</span>
            </h1>
            <p className="mt-1 font-general text-[10px] uppercase tracking-[0.35em] text-white/30 sm:text-xs">
              Ultimate Gaming Platform
            </p>
          </div>

          {/* progress section */}
          <div className="w-full max-w-[280px] sm:max-w-xs">
            {/* percentage + label row */}
            <div className="mb-2 flex items-center justify-between">
              <span className="font-general text-[10px] uppercase tracking-[0.2em] text-violet-400/80 sm:text-xs">
                {TIPS[tip]}
              </span>
              <span className="font-zentry text-sm font-black text-yellow-300 sm:text-base">
                {pct}%
              </span>
            </div>

            {/* bar track */}
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              {/* glow layer */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-violet-400/30 blur-sm transition-all duration-100"
                style={{ width: `${pct}%` }}
              />
              {/* fill */}
              <div
                className="pre-bar-fill absolute inset-y-0 left-0 rounded-full transition-all duration-100"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, #7c3aed, #a855f7, #eab308)",
                }}
              />
              {/* shimmer */}
              <div
                className="absolute inset-y-0 w-8 rounded-full bg-white/40 blur-sm"
                style={{
                  left: `calc(${pct}% - 16px)`,
                  opacity: pct > 0 && pct < 100 ? 1 : 0,
                  transition: "left 0.1s",
                }}
              />
            </div>

            {/* tick marks */}
            <div className="mt-1.5 flex justify-between">
              {[0, 25, 50, 75, 100].map((v) => (
                <div key={v} className="flex flex-col items-center gap-0.5">
                  <div className={`h-1 w-px transition-colors duration-300 ${pct >= v ? "bg-violet-400" : "bg-white/15"}`} />
                  <span className={`font-general text-[8px] transition-colors duration-300 ${pct >= v ? "text-violet-400/70" : "text-white/20"}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* power cells */}
          <div className="flex items-center gap-2">
            {[...Array(10)].map((_, i) => {
              const filled = i < Math.floor(pct / 10);
              const active = i === Math.floor(pct / 10) && pct < 100;
              return (
                <div
                  key={i}
                  className="h-3 w-4 rounded-sm border transition-all duration-200 sm:h-4 sm:w-5"
                  style={{
                    borderColor: filled || active ? "rgba(139,92,246,0.8)" : "rgba(255,255,255,0.1)",
                    background: filled
                      ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                      : active
                        ? "rgba(139,92,246,0.3)"
                        : "transparent",
                    boxShadow: filled ? "0 0 6px rgba(139,92,246,0.6)" : "none",
                    animation: active ? "pre-pulse 0.6s ease-in-out infinite" : "none",
                  }}
                />
              );
            })}
          </div>

        </div>
      </div>

      {/* ── keyframes injected via style tag ── */}
      <style>{`
        @keyframes pre-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pre-float {
          from { transform: translateY(0px); }
          to   { transform: translateY(-14px); }
        }
        @keyframes pre-pulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.4; }
        }
      `}</style>
    </div>
  );
};

export default Preloader;
