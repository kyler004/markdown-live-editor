import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactElement,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import { FileText, Share2, Download, Printer } from "lucide-react";
import CodeBlock from "./CodeBlock";
import Mermaid from "./Mermaid";

interface PreviewProps {
  markdown: string;
  onScroll?: (e: React.UIEvent<HTMLElement>) => void;
}

const markdownComponents: Components = {
  pre({ children }) {
    const codeEl = children as ReactElement<{
      className?: string;
      children?: React.ReactNode;
    }>;
    const className = codeEl?.props?.className ?? "";
    const match = /language-(\w+)/.exec(className);
    const language = match?.[1];
    const code = String(codeEl?.props?.children ?? "").replace(/\n$/, "");

    if (language === "mermaid") return <Mermaid chart={code} />;
    return <CodeBlock code={code} language={language} />;
  },
  code({ children, ...props }) {
    return (
      <code
        {...props}
        className="px-1.5 py-0.5 rounded bg-neon-bg/40 text-neon font-mono text-[0.85em]"
      >
        {children}
      </code>
    );
  },
};

const Preview = forwardRef<HTMLElement, PreviewProps>(({ markdown, onScroll }, ref) => {
  const containerRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => containerRef.current as HTMLElement);

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      // clipboard may be unavailable (insecure context / permissions)
    }
  };

  return (
    <section
      ref={containerRef}
      onScroll={onScroll}
      className="flex flex-col h-full w-full bg-preview overflow-y-auto overflow-x-hidden min-w-0 relative"
    >
      <div className="h-10 flex items-center px-4 font-mono text-[0.7rem] text-inactive tracking-widest uppercase sticky top-0 bg-preview/90 backdrop-blur-sm z-10 shrink-0">
        RENDERED PREVIEW
      </div>

      <div
        className="preview-content px-8 pb-12 font-sans text-main leading-relaxed text-[0.95rem] min-w-0 wrap-break-word
                      [&_h1]:text-heading [&_h1]:text-[2.8rem] [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:border-l-[6px] [&_h1]:border-neon [&_h1]:pl-6 [&_h1]:-ml-[2.1rem]
                      [&_h2]:text-heading [&_h2]:text-[1.6rem] [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4
                      [&_h3]:text-dimmed [&_h3]:text-[1.1rem] [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-4
                      [&_p]:text-main [&_p]:mb-4
                      [&_code]:font-mono [&_code]:text-neon [&_code]:break-all
                      [&_ul]:list-none [&_ul]:pl-0 [&_ul]:mb-6
                      [&_ol]:list-decimal [&_ol]:pl-10 [&_ol]:mb-6 [&_ol]:text-main
                      [&_li]:relative [&_li]:mb-2 [&_li]:text-main
                      [&_ul_li:not(.task-list-item)]:pl-6
                      [&_ul_li:not(.task-list-item)::before]:content-['—'] [&_ul_li:not(.task-list-item)::before]:absolute [&_ul_li:not(.task-list-item)::before]:left-0 [&_ul_li:not(.task-list-item)::before]:text-neon
                      [&_li.task-list-item]:list-none [&_li.task-list-item]:pl-1
                      [&_li_input[type='checkbox']]:mr-2 [&_li_input[type='checkbox']]:accent-neon
                      [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6 [&_table]:text-sm
                      [&_th]:text-heading [&_th]:font-bold [&_th]:p-3 [&_th]:border [&_th]:border-inactive [&_th]:bg-activity/50 [&_th]:text-left
                      [&_td]:text-main [&_td]:p-3 [&_td]:border [&_td]:border-inactive
                      [&_hr]:border-inactive [&_hr]:my-10 [&_hr]:border-t-2
                      [&_del]:line-through [&_del]:text-dimmed"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              { behavior: "wrap", properties: { className: ["heading-anchor"] } },
            ],
            rehypeHighlight,
            rehypeKatex,
          ]}
          components={markdownComponents}
        >
          {markdown}
        </ReactMarkdown>
      </div>

      <div
        className="absolute top-4 right-8 p-2.5 rounded shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col gap-4 z-20"
        style={{ backgroundColor: "var(--color-sidebar)" }}
      >
        <FileText size={20} className="text-main" aria-hidden="true" />
        <button
          type="button"
          onClick={handleShare}
          aria-label="Copy markdown to clipboard"
          title="Copy to clipboard"
          className="text-dimmed hover:text-white cursor-pointer transition-colors"
        >
          <Share2 size={20} />
        </button>
        <button
          type="button"
          onClick={handleDownload}
          aria-label="Download as Markdown"
          title="Download .md"
          className="text-dimmed hover:text-white cursor-pointer transition-colors"
        >
          <Download size={20} />
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          aria-label="Print preview"
          title="Print / Save as PDF"
          className="text-dimmed hover:text-white cursor-pointer transition-colors"
        >
          <Printer size={20} />
        </button>
      </div>
    </section>
  );
});

Preview.displayName = "Preview";

export default Preview;
