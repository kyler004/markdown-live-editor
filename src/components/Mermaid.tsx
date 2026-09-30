import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

let initialized = false;
let renderCounter = 0;

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-${renderCounter++}`);

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "strict",
        fontFamily: "var(--font-mono)",
      });
      initialized = true;
    }

    let cancelled = false;
    mermaid
      .render(idRef.current, chart)
      .then(({ svg }) => {
        if (!cancelled) {
          setSvg(svg);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Invalid diagram");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = svg;
    }
  }, [svg]);

  if (error) {
    return (
      <pre className="text-red-400 text-xs whitespace-pre-wrap border border-red-400/40 rounded p-3 my-4">
        Mermaid error: {error}
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-diagram flex justify-center my-6"
    />
  );
}
