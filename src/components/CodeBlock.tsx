import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    try {
      const result =
        language && hljs.getLanguage(language)
          ? hljs.highlight(code, { language })
          : hljs.highlightAuto(code);
      el.innerHTML = result.value;
    } catch {
      el.textContent = code;
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="code-block group relative my-5">
      <div className="flex items-center justify-between px-3 py-1.5 rounded-t-md bg-activity border border-surface-dim border-b-0">
        <span className="font-mono text-[0.65rem] tracking-widest uppercase text-dimmed">
          {language || "text"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          title="Copy code"
          className="flex items-center gap-1 text-[0.65rem] font-mono uppercase tracking-wider text-dimmed hover:text-neon transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="!mt-0 rounded-b-md rounded-t-none overflow-x-auto bg-editor border border-surface-dim p-4 text-[0.82rem] leading-relaxed">
        <code ref={codeRef} className={`hljs language-${language ?? "text"}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
