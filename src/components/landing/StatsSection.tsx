import type { ThemeKey } from "../../pages/landing-themes";
import { useLandingTheme } from "../../hooks/useLandingThemes";
import { LANDING_WIDE } from "../../pages/landing-layout";

interface StatsSectionProps {
  theme: ThemeKey;
}

function bgGlyph(sym: [string, string]): string {
  if (sym[0] === "/" && sym[1] === "/") return "//";
  if (sym[0] === "#") return "#";
  return `${sym[0]} ${sym[1]}`;
}

const themeStyles: Record<
  ThemeKey,
  {
    value: string;
    label: string;
    glyph: string;
    glyphOpacity: string;
  }
> = {
  "light-blue": {
    value: "text-[#0055ff] font-bold",
    label: "text-slate-400",
    glyph: "text-slate-300",
    glyphOpacity: "opacity-40",
  },
  "cyber-green": {
    value:
      "text-[#00ff66] font-bold drop-shadow-[0_0_10px_rgba(0,255,102,0.35)]",
    label: "text-zinc-600",
    glyph: "text-[#00ff66]",
    glyphOpacity: "opacity-[0.09]",
  },
  "obsidian-silver": {
    value: "text-white font-bold",
    label: "text-zinc-600",
    glyph: "text-zinc-800",
    glyphOpacity: "opacity-70",
  },
};

export default function StatsSection({ theme }: StatsSectionProps) {
  const t = useLandingTheme(theme);
  const s = themeStyles[theme];

  return (
    <section className={`${LANDING_WIDE} py-20 md:py-28`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 md:gap-y-20 gap-x-8 md:gap-x-6">
        {t.stats.map((item) => (
          <div
            key={item.lab}
            className="relative flex flex-col items-center justify-center min-h-[140px] md:min-h-[160px] text-center font-mono"
          >
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-0 flex items-center justify-center text-8xl md:text-[7rem] lg:text-[8rem] font-bold leading-none select-none ${s.glyph} ${s.glyphOpacity}`}
            >
              {bgGlyph(item.sym)}
            </span>

            <div className="relative z-10 flex flex-col items-center">
              <span
                className={`text-3xl md:text-4xl lg:text-[2.75rem] tracking-tight mb-3 ${s.value}`}
              >
                {item.val}
              </span>
              <span
                className={`text-[10px] md:text-[11px] uppercase tracking-[0.22em] ${s.label}`}
              >
                {item.lab}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
