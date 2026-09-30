import type { ThemeKey } from "../../pages/landing-themes";
import { useTranslation } from "react-i18next";

const barClass: Record<ThemeKey, string> = {
  "light-blue": "border-slate-200 bg-slate-50/80 text-slate-400",
  "cyber-green": "border-[#2a1525] bg-[#0a0208]/80 text-[#00ff66]/70",
  "obsidian-silver": "border-zinc-900 bg-zinc-950/50 text-zinc-600",
};

export default function LandingTicker({ theme }: { theme: ThemeKey }) {
  const { t } = useTranslation("landing");
  const list = t(`ticker.${theme}`, { returnObjects: true }) as string[];
  const items = Array.isArray(list) ? list : [];
  const track = [...items, ...items];

  return (
    <div
      className={`border-y overflow-hidden py-3 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase ${barClass[theme]}`}
    >
      <div className="landing-ticker-track flex w-max gap-12 px-6">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-12 shrink-0">
            {item}
            <span className="opacity-40">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
