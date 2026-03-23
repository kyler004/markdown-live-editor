import MonacoEditor from '@monaco-editor/react';

interface EditorProps {
  markdown: string;
  setMarkdown: (value: string) => void;
}

export default function Editor({ markdown, setMarkdown }: EditorProps) {
  
  // This function runs right before the editor mounts to define our custom aesthetic
  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('architectTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '4d4452', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00ff41' }, // Neon Green
        { token: 'string', foreground: 'b0b0b0' },
        { token: 'identifier', foreground: 'e0e0e0' },
      ],
      colors: {
        'editor.background': '#0d0a0f', // Match this to your Tailwind bg-editor color
        'editor.foreground': '#e0e0e0',
        'editorLineNumber.foreground': '#332b36', // Dimmed line numbers
        'editorLineNumber.activeForeground': '#00ff41', // Neon active line
        'editorCursor.foreground': '#00ff41', // Neon cursor
        'editor.selectionBackground': '#00ff4130', // Subtle neon selection highlight
        'editor.lineHighlightBackground': '#1a141a50', // Very subtle current line highlight
      }
    });
  };

  return (
    <section className="flex flex-col h-full bg-editor min-w-0">
      
      {/* Editor Header */}
      <div className="h-10 flex items-center px-4 font-mono text-[0.7rem] text-inactive tracking-widest uppercase shrink-0 border-b border-[#1a1a1a]">
        INDEX.MD <span className="ml-2.5 text-[#4d4452]">EDITING...</span>
      </div>
      
      {/* Monaco Editor Container */}
      <div className="flex-1 w-full relative pt-2">
        <MonacoEditor
          height="100%"
          language="markdown"
          theme="architectTheme"
          value={markdown}
          onChange={(value) => setMarkdown(value || '')}
          beforeMount={handleEditorWillMount}
          options={{
            minimap: { enabled: false }, 
            wordWrap: 'on',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: 13,
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderLineHighlight: 'all',
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            }
          }}
        />
      </div>
      
    </section>
  );
}