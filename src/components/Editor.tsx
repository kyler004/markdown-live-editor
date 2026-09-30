import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import CodeEditor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markdown";
import "prismjs/themes/prism.css";
import {
  Bold,
  Italic,
  Heading2,
  Link,
  List,
  Code,
  Quote,
  Table2,
} from "lucide-react";
import {
  wrapSelection,
  insertAtCursor,
  prefixLines,
  handleListContinuation,
  handleTab,
  readImageAsMarkdown,
} from "../utils/editorHelpers";

interface EditorProps {
  markdown: string;
  setMarkdown: (value: string) => void;
  onCursorChange: (line: number, column: number) => void;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  fileName?: string;
}

type ToolbarAction = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

const Editor = forwardRef<HTMLDivElement, EditorProps>(
  (
    { markdown, setMarkdown, onCursorChange, onScroll, fileName = "INDEX.MD" },
    ref,
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | null>(null);

    useImperativeHandle(
      ref,
      () => scrollContainerRef.current as HTMLDivElement,
    );

    useEffect(() => {
      return () => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      };
    }, []);

    const applyChange = useCallback(
      (next: string | null) => {
        if (next != null) setMarkdown(next);
      },
      [setMarkdown],
    );

    const toolbar: ToolbarAction[] = [
      {
        icon: <Bold size={14} />,
        label: "Bold",
        action: () => applyChange(wrapSelection("**", "**", "bold")),
      },
      {
        icon: <Italic size={14} />,
        label: "Italic",
        action: () => applyChange(wrapSelection("*", "*", "italic")),
      },
      {
        icon: <Heading2 size={14} />,
        label: "Heading",
        action: () => applyChange(prefixLines("## ")),
      },
      {
        icon: <Link size={14} />,
        label: "Link",
        action: () =>
          applyChange(wrapSelection("[", "](url)", "link text")),
      },
      {
        icon: <List size={14} />,
        label: "List",
        action: () => applyChange(prefixLines("- ")),
      },
      {
        icon: <Code size={14} />,
        label: "Code",
        action: () => applyChange(wrapSelection("`", "`", "code")),
      },
      {
        icon: <Quote size={14} />,
        label: "Quote",
        action: () => applyChange(prefixLines("> ")),
      },
      {
        icon: <Table2 size={14} />,
        label: "Table",
        action: () =>
          applyChange(
            insertAtCursor(
              "\n| Col 1 | Col 2 |\n|-------|-------|\n| A     | B     |\n",
            ),
          ),
      },
    ];

    const handleSelectionChange = (
      e: React.SyntheticEvent<HTMLTextAreaElement | HTMLDivElement>,
    ) => {
      const textarea = e.target as HTMLTextAreaElement;
      if (!textarea.value) return;
      const textBeforeCursor = textarea.value.slice(0, textarea.selectionStart);
      const lines = textBeforeCursor.split("\n");
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      onCursorChange(line, column);
    };

    const handleInput = () => {
      setIsEditing(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsEditing(false), 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const ta = e.target as HTMLTextAreaElement;
      if (!ta || ta.id !== "code-editor") return;

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        const key = e.key.toLowerCase();
        if (key === "b") {
          e.preventDefault();
          applyChange(wrapSelection("**", "**", "bold"));
          return;
        }
        if (key === "i") {
          e.preventDefault();
          applyChange(wrapSelection("*", "*", "italic"));
          return;
        }
        if (key === "k") {
          e.preventDefault();
          applyChange(wrapSelection("[", "](url)", "link text"));
          return;
        }
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const result = handleTab(
          markdown,
          ta.selectionStart,
          ta.selectionEnd,
          e.shiftKey,
        );
        setMarkdown(result.value);
        window.requestAnimationFrame(() => {
          ta.setSelectionRange(result.start, result.end);
        });
        return;
      }

      if (e.key === "Enter" && !e.shiftKey) {
        const result = handleListContinuation(markdown, ta.selectionStart);
        if (result) {
          e.preventDefault();
          setMarkdown(result.value);
          window.requestAnimationFrame(() => {
            ta.setSelectionRange(result.cursor, result.cursor);
          });
        }
      }
    };

    const insertImages = async (files: FileList | File[]) => {
      const parts: string[] = [];
      for (const file of Array.from(files)) {
        const md = await readImageAsMarkdown(file);
        if (md) parts.push(md);
      }
      if (parts.length) applyChange(insertAtCursor(parts.join("")));
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
      const items = e.clipboardData.files;
      if (items.length > 0) {
        e.preventDefault();
        await insertImages(items);
      }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
      if (!e.dataTransfer.files.length) return;
      e.preventDefault();
      await insertImages(e.dataTransfer.files);
    };

    return (
      <section className="flex flex-col h-full bg-editor min-w-0 overflow-hidden">
        <div className="h-10 flex items-center justify-between px-4 font-mono text-[0.7rem] text-inactive tracking-widest uppercase shrink-0 border-b border-white/5">
          <span>
            {fileName.toUpperCase()}{" "}
            {isEditing && (
              <span className="ml-2.5 text-[#a11c2e] animate-pulse">
                EDITING...
              </span>
            )}
          </span>
          <div className="flex items-center gap-1">
            {toolbar.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                title={item.label}
                aria-label={item.label}
                className="p-1.5 rounded text-dimmed hover:text-neon hover:bg-neon-bg/40 transition-colors"
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          onScroll={onScroll}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex-1 w-full overflow-auto custom-scrollbar"
        >
          <CodeEditor
            value={markdown}
            onValueChange={(code: string) => {
              setMarkdown(code);
              handleInput();
            }}
            highlight={(code: string) =>
              highlight(code, languages.markdown, "markdown")
            }
            padding={20}
            onSelect={handleSelectionChange}
            onClick={handleSelectionChange}
            onKeyUp={handleSelectionChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className="markdown-editor font-mono text-sm leading-relaxed text-main min-h-full"
            textareaClassName="outline-none"
            textareaId="code-editor"
            style={{
              fontFamily: "var(--font-mono)",
              minHeight: "100%",
            }}
          />
        </div>
      </section>
    );
  },
);

Editor.displayName = "Editor";

export default Editor;
