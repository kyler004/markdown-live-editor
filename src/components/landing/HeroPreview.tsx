import type { ReactNode } from "react";
import type { ThemeKey } from "../../pages/landing-themes";

interface HeroPreviewProps {
  theme: ThemeKey;
}

function EditorLine({
  n,
  children,
  highlight = false,
  lineNumClass,
  highlightClass,
}: {
  n: string;
  children: ReactNode;
  highlight?: boolean;
  lineNumClass: string;
  highlightClass: string;
}) {
  return (
    <div
      className={`flex items-start gap-1 text-left ${highlight ? highlightClass : ""}`}
    >
      <span
        className={`${lineNumClass} w-8 shrink-0 select-none text-[11px] md:text-xs ${highlight ? "opacity-40" : ""}`}
      >
        {n}
      </span>
      <span className="flex-1 whitespace-pre text-left">{children}</span>
    </div>
  );
}

function WindowChrome({
  title,
  barClass,
  borderClass,
}: {
  title: string;
  barClass: string;
  borderClass: string;
}) {
  return (
    <div
      className={`relative flex items-center gap-2 px-5 py-3 border-b ${barClass} ${borderClass}`}
    >
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>
      <span className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] md:text-xs tracking-wider uppercase">
        {title}
      </span>
    </div>
  );
}

function LightBluePreview() {
  const blue = "text-[#0055ff]";
  const muted = "text-slate-400";
  const lineNum = "text-slate-300";

  return (
    <div className="w-full rounded-sm overflow-hidden border border-slate-200 bg-white shadow-[0_24px_80px_rgba(0,85,255,0.12)] text-left">
      <WindowChrome
        title="NEURAL_EDITOR_V1.0 — ARCHITECT_OS"
        barClass="bg-slate-50 text-slate-400"
        borderClass="border-slate-200"
      />

      <div className="grid grid-cols-[200px_1fr] min-h-[400px] md:min-h-[440px] font-mono text-xs md:text-sm leading-[1.65]">
        <aside className="bg-slate-50 border-r border-slate-200 p-5 text-left">
          <div className="text-[11px] font-bold tracking-[0.2em] text-slate-400 mb-5">
            WORKSPACE
          </div>
          <div className="space-y-2.5 text-[11px]">
            <div className={`${blue} flex items-center gap-1.5 font-semibold`}>
              <span className="opacity-60">▸</span>
              <span>project_alpha</span>
            </div>
            <div className={`${blue} pl-4 font-semibold`}>neural_core.md</div>
            <div className={`${muted} pl-4`}>readme.md</div>
            <div className={`${muted} flex items-center gap-1.5 pt-1`}>
              <span className="opacity-60">▸</span>
              <span>assets/docs</span>
            </div>
          </div>
        </aside>

        <div className="relative bg-white text-slate-700 p-5 md:p-6 pr-32 text-left">
          <span className="absolute top-4 right-5 border border-[#0055ff]/30 text-[#0055ff] text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase">
            PREVIEW: LIVE
          </span>

          <EditorLine n="01" lineNumClass={lineNum} highlightClass="">
            <span className={`${blue} font-bold`}># Markdown_Workspace</span>
          </EditorLine>
          <EditorLine n="02" lineNumClass={lineNum} highlightClass="">
            {" "}
          </EditorLine>
          <EditorLine n="03" lineNumClass={lineNum} highlightClass="">
            <span className={muted}>// Precision architect environment</span>
          </EditorLine>
          <EditorLine n="04" lineNumClass={lineNum} highlightClass="">
            {" "}
          </EditorLine>
          <EditorLine n="05" lineNumClass={lineNum} highlightClass="">
            <span className={`${blue} font-bold`}>## Core Features</span>
          </EditorLine>
          <EditorLine n="06" lineNumClass={lineNum} highlightClass="">
            - <span className={`${blue} font-bold`}>Real-time</span> Canvas
            Rendering
          </EditorLine>
          <EditorLine n="07" lineNumClass={lineNum} highlightClass="">
            - <span className={`${blue} font-bold`}>Adaptive</span> Typography
          </EditorLine>
          <EditorLine n="08" lineNumClass={lineNum} highlightClass="">
            - <span className={`${blue} font-bold`}>Cloud</span> Sync [Active]
          </EditorLine>
          <EditorLine n="09" lineNumClass={lineNum} highlightClass="">
            {" "}
          </EditorLine>
          <EditorLine n="10" lineNumClass={lineNum} highlightClass="">
            <span className={muted}>```javascript</span>
          </EditorLine>
          <EditorLine n="11" lineNumClass={lineNum} highlightClass="">
            <span className="text-violet-600">const</span> editor ={" "}
            <span className="text-amber-600">new</span> NeuralCore();
          </EditorLine>
          <EditorLine
            n="12"
            lineNumClass={lineNum}
            highlightClass="bg-[#0055ff] text-white -mx-2 px-2"
            highlight
          >
            editor.sync();
            <span className="animate-pulse">|</span>
          </EditorLine>
          <EditorLine n="13" lineNumClass={lineNum} highlightClass="">
            <span className={muted}>```</span>
          </EditorLine>
          <EditorLine n="14" lineNumClass={lineNum} highlightClass="">
            {" "}
          </EditorLine>
        </div>
      </div>
    </div>
  );
}

function CyberGreenPreview() {
  const green = "text-[#00ff66]";
  const greenGlow =
    "text-[#00ff66] drop-shadow-[0_0_6px_rgba(0,255,102,0.45)]";
  const muted = "text-[#5a6b5a]";
  const lineNum = "text-[#2a3d2a]";

  return (
    <div className="w-full rounded-sm overflow-hidden border border-[#2a1525] shadow-[0_0_50px_rgba(0,255,102,0.1)] text-left">
      <WindowChrome
        title="MAIN_CONSOLE.SH — ARCHITECT_OS"
        barClass="bg-[#1a0b16] text-[#6b5a6b]"
        borderClass="border-[#2a1525]"
      />

      <div className="grid grid-cols-[200px_1fr] min-h-[400px] md:min-h-[440px] font-mono text-xs md:text-sm leading-[1.65]">
        <aside className="bg-[#1a0b16] border-r border-[#2a1525] p-5 text-left">
          <div
            className={`${green} text-[11px] font-bold tracking-[0.2em] mb-5`}
          >
            EXPLORER
          </div>
          <div className="space-y-2.5 text-[11px]">
            <div className={`${green} flex items-center gap-1.5`}>
              <span className="opacity-70">▸</span>
              <span>src/engine</span>
            </div>
            <div className={`${muted} pl-4`}>neural_core.c</div>
            <div className={`${muted} pl-4`}>renderer.vulkan</div>
            <div className={`${muted} flex items-center gap-1.5 pt-1`}>
              <span className="opacity-70">▸</span>
              <span>assets/shaders</span>
            </div>
          </div>
        </aside>

        <div className="relative bg-black text-[#00ff66] p-5 md:p-6 pr-32 text-left">
          <span
            className={`absolute top-4 right-5 border border-[#00ff66]/50 ${green} text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase`}
          >
            PREVIEW: LIVE
          </span>

          <EditorLine n="01" lineNumClass={lineNum} highlightClass="">
            <span className={`${greenGlow} font-bold`}># Neural_Editor_v1.0</span>
          </EditorLine>
          <EditorLine n="02" lineNumClass={lineNum} highlightClass="">
            {" "}
          </EditorLine>
          <EditorLine n="03" lineNumClass={lineNum} highlightClass="">
            <span className={muted}>// The architect&apos;s workspace</span>
          </EditorLine>
          <EditorLine n="04" lineNumClass={lineNum} highlightClass="">
            {" "}
          </EditorLine>
          <EditorLine n="05" lineNumClass={lineNum} highlightClass="">
            <span className={`${greenGlow} font-bold`}>## Core Features</span>
          </EditorLine>
          <EditorLine n="06" lineNumClass={lineNum} highlightClass="">
            - <span className="font-bold">Real-time</span> Cathode Rendering
          </EditorLine>
          <EditorLine n="07" lineNumClass={lineNum} highlightClass="">
            - <span className="font-bold">Adaptive</span> Typography
          </EditorLine>
          <EditorLine n="08" lineNumClass={lineNum} highlightClass="">
            - <span className="font-bold">Collaborative</span> Grid
          </EditorLine>
          <EditorLine n="09" lineNumClass={lineNum} highlightClass="">
            {" "}
          </EditorLine>
          <EditorLine n="10" lineNumClass={lineNum} highlightClass="">
            <span className={muted}>``` c</span>
          </EditorLine>
          <EditorLine n="11" lineNumClass={lineNum} highlightClass="">
            void init_neural_core() {"{"}
          </EditorLine>
          <EditorLine
            n="12"
            lineNumClass={lineNum}
            highlightClass="bg-[#00ff66] text-black -mx-2 px-2"
            highlight
          >
            {"    system_sync_start();"}
            <span className="animate-pulse">|</span>
          </EditorLine>
          <EditorLine n="13" lineNumClass={lineNum} highlightClass="">
            <span className={muted}>
              {"    // Initializing collaborative bridge..."}
            </span>
          </EditorLine>
          <EditorLine n="14" lineNumClass={lineNum} highlightClass="">
            {"}"}
          </EditorLine>
        </div>
      </div>
    </div>
  );
}

function ObsidianPreview() {
  const white = "text-white";
  const muted = "text-zinc-600";
  const dim = "text-zinc-500";
  const lineNum = "text-zinc-800";

  return (
    <div className="w-full rounded-sm overflow-hidden border border-zinc-800 shadow-[0_24px_80px_rgba(255,255,255,0.04)] text-left">
      <WindowChrome
        title="OBSIDIAN_CORE.MD — OBSIDIAN_OS"
        barClass="bg-zinc-950 text-zinc-600"
        borderClass="border-zinc-900"
      />

      <div className="grid grid-cols-[200px_1fr] min-h-[400px] md:min-h-[440px] font-mono text-xs md:text-sm leading-[1.65]">
        <aside className="bg-zinc-950 border-r border-zinc-900 p-5 text-left">
          <div className="text-[11px] font-bold tracking-[0.2em] text-zinc-500 mb-5">
            VAULT
          </div>
          <div className="space-y-2.5 text-[11px]">
            <div className={`${white} flex items-center gap-1.5 font-semibold`}>
              <span className="opacity-50">▸</span>
              <span>projects</span>
            </div>
            <div className={`${white} pl-4 font-semibold`}>genesis.md</div>
            <div className={`${dim} pl-4`}>graph.config</div>
            <div className={`${dim} flex items-center gap-1.5 pt-1`}>
              <span className="opacity-50">▸</span>
              <span>plugins</span>
            </div>
          </div>
        </aside>

        <div className="relative bg-black text-zinc-300 p-5 md:p-6 pr-32 text-left">
          <span className="absolute top-4 right-5 border border-zinc-700 text-zinc-400 text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase">
            PREVIEW: LIVE
          </span>

          <EditorLine n="01" lineNumClass={lineNum} highlightClass="">
            <span className={`${white} font-bold`}># Project_Genesis</span>
          </EditorLine>
          <EditorLine n="02" lineNumClass={lineNum} highlightClass="">
            {" "}
          </EditorLine>
          <EditorLine n="03" lineNumClass={lineNum} highlightClass="">
            <span className={muted}>// Direct-to-metal workspace</span>
          </EditorLine>
          <EditorLine n="04" lineNumClass={lineNum} highlightClass="">
            {" "}
          </EditorLine>
          <EditorLine n="05" lineNumClass={lineNum} highlightClass="">
            <span className={`${white} font-bold`}>## Neural Graph</span>
          </EditorLine>
          <EditorLine n="06" lineNumClass={lineNum} highlightClass="">
            - <span className={white}>Low-latency</span> node rendering
          </EditorLine>
          <EditorLine n="07" lineNumClass={lineNum} highlightClass="">
            - <span className={white}>Encrypted</span> vault sync
          </EditorLine>
          <EditorLine n="08" lineNumClass={lineNum} highlightClass="">
            - <span className={white}>Plugin</span> bridge [Active]
          </EditorLine>
          <EditorLine n="09" lineNumClass={lineNum} highlightClass="">
            {" "}
          </EditorLine>
          <EditorLine n="10" lineNumClass={lineNum} highlightClass="">
            <span className={muted}>```rust</span>
          </EditorLine>
          <EditorLine n="11" lineNumClass={lineNum} highlightClass="">
            fn init_graph_engine() {"{"}
          </EditorLine>
          <EditorLine
            n="12"
            lineNumClass={lineNum}
            highlightClass="bg-white text-black -mx-2 px-2"
            highlight
          >
            {"    vault.sync_nodes();"}
            <span className="animate-pulse">|</span>
          </EditorLine>
          <EditorLine n="13" lineNumClass={lineNum} highlightClass="">
            <span className={muted}>
              {"    // Obsidian-grade backlink mesh"}
            </span>
          </EditorLine>
          <EditorLine n="14" lineNumClass={lineNum} highlightClass="">
            {"}"}
          </EditorLine>
        </div>
      </div>
    </div>
  );
}

export default function HeroPreview({ theme }: HeroPreviewProps) {
  if (theme === "light-blue") return <LightBluePreview />;
  if (theme === "cyber-green") return <CyberGreenPreview />;
  return <ObsidianPreview />;
}
