import type { ThemeKey } from "../../pages/landing-themes";

const gridStyle = {
  backgroundImage: `
    linear-gradient(to right, currentColor 1px, transparent 1px),
    linear-gradient(to bottom, currentColor 1px, transparent 1px)
  `,
  backgroundSize: "48px 48px",
};

export default function LandingAmbient({ theme }: { theme: ThemeKey }) {
  if (theme === "light-blue") {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 text-slate-200 opacity-[0.35]"
          style={gridStyle}
        />
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#0055ff]/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-slate-300/30 blur-3xl" />
        <SideRails className="text-slate-200/60" />
      </div>
    );
  }

  if (theme === "cyber-green") {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 text-[#00ff66] opacity-[0.04]"
          style={gridStyle}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,102,0.08),transparent_55%)]" />
        <div className="absolute -top-24 left-0 h-[480px] w-[480px] rounded-full bg-[#00ff66]/10 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[560px] w-[560px] rounded-full bg-purple-900/30 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,102,0.5)_2px,rgba(0,255,102,0.5)_3px)]" />
        <SideRails className="text-[#00ff66]/20" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 text-zinc-800 opacity-40"
        style={gridStyle}
      />
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-white/[0.02] blur-3xl" />
      <div className="absolute bottom-20 left-0 h-[350px] w-[350px] rounded-full bg-zinc-800/20 blur-3xl" />
      <SideRails className="text-zinc-800" />
    </div>
  );
}

function SideRails({ className }: { className: string }) {
  return (
    <>
      <div
        className={`hidden xl:block absolute left-6 top-32 bottom-32 w-px ${className}`}
      />
      <div
        className={`hidden xl:block absolute right-6 top-32 bottom-32 w-px ${className}`}
      />
      <span
        className={`hidden 2xl:block absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[9px] tracking-[0.5em] uppercase ${className}`}
      >
        NEURAL_EDITOR // v1.6
      </span>
      <span
        className={`hidden 2xl:block absolute right-8 top-1/2 -translate-y-1/2 rotate-90 font-mono text-[9px] tracking-[0.5em] uppercase ${className}`}
      >
        ARCHITECT_OS // LIVE
      </span>
    </>
  );
}
