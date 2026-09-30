export function getTextarea(): HTMLTextAreaElement | null {
  return document.getElementById("code-editor") as HTMLTextAreaElement | null;
}

export function wrapSelection(
  before: string,
  after: string,
  placeholder = "",
): string | null {
  const ta = getTextarea();
  if (!ta) return null;

  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = ta.value.slice(start, end) || placeholder;
  const next =
    ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);

  window.requestAnimationFrame(() => {
    ta.focus();
    const cursorStart = start + before.length;
    const cursorEnd = cursorStart + selected.length;
    ta.setSelectionRange(cursorStart, cursorEnd);
  });

  return next;
}

export function insertAtCursor(text: string): string | null {
  const ta = getTextarea();
  if (!ta) return null;

  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const next = ta.value.slice(0, start) + text + ta.value.slice(end);

  window.requestAnimationFrame(() => {
    ta.focus();
    const pos = start + text.length;
    ta.setSelectionRange(pos, pos);
  });

  return next;
}

export function prefixLines(prefix: string): string | null {
  const ta = getTextarea();
  if (!ta) return null;

  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const before = ta.value.slice(0, start);
  const selected = ta.value.slice(start, end);
  const after = ta.value.slice(end);

  const lines = selected.split("\n");
  const prefixed = lines.map((l) => prefix + l).join("\n");
  const next = before + prefixed + after;

  window.requestAnimationFrame(() => {
    ta.focus();
    ta.setSelectionRange(start, start + prefixed.length);
  });

  return next;
}

export function handleListContinuation(
  value: string,
  selectionStart: number,
): { value: string; cursor: number } | null {
  const before = value.slice(0, selectionStart);
  const lineStart = before.lastIndexOf("\n") + 1;
  const currentLine = before.slice(lineStart);

  const ulMatch = /^(\s*)([-*+]|\d+\.)\s/.exec(currentLine);
  if (!ulMatch) return null;

  const indent = ulMatch[1];
  const marker = ulMatch[2];
  const content = currentLine.slice(ulMatch[0].length);

  if (content.trim() === "") {
    const next =
      value.slice(0, lineStart) + value.slice(selectionStart);
    return { value: next, cursor: lineStart };
  }

  const nextMarker = /^\d+\.$/.test(marker)
    ? `${parseInt(marker, 10) + 1}.`
    : marker;
  const insert = `\n${indent}${nextMarker} `;
  const next =
    value.slice(0, selectionStart) + insert + value.slice(selectionStart);
  return { value: next, cursor: selectionStart + insert.length };
}

export function handleTab(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  shiftKey: boolean,
): { value: string; start: number; end: number } {
  const indent = "  ";

  if (selectionStart !== selectionEnd) {
    const startLine = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const endLineEnd =
      value.indexOf("\n", selectionEnd) === -1
        ? value.length
        : value.indexOf("\n", selectionEnd);
    const block = value.slice(startLine, endLineEnd);
    const lines = block.split("\n");

    if (shiftKey) {
      const unindented = lines.map((l) =>
        l.startsWith(indent) ? l.slice(indent.length) : l.replace(/^\t/, ""),
      );
      const nextBlock = unindented.join("\n");
      const next =
        value.slice(0, startLine) + nextBlock + value.slice(endLineEnd);
      return { value: next, start: startLine, end: startLine + nextBlock.length };
    }

    const indented = lines.map((l) => indent + l).join("\n");
    const next =
      value.slice(0, startLine) + indented + value.slice(endLineEnd);
    return { value: next, start: startLine, end: startLine + indented.length };
  }

  if (shiftKey) {
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const linePrefix = value.slice(lineStart, selectionStart);
    if (linePrefix.endsWith(indent)) {
      const next =
        value.slice(0, selectionStart - indent.length) +
        value.slice(selectionStart);
      const pos = selectionStart - indent.length;
      return { value: next, start: pos, end: pos };
    }
    return { value, start: selectionStart, end: selectionEnd };
  }

  const next =
    value.slice(0, selectionStart) + indent + value.slice(selectionEnd);
  const pos = selectionStart + indent.length;
  return { value: next, start: pos, end: pos };
}

export async function readImageAsMarkdown(
  file: File,
): Promise<string | null> {
  if (!file.type.startsWith("image/")) return null;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? "");
      const alt = file.name.replace(/\.[^.]+$/, "");
      resolve(`\n![${alt}](${dataUrl})\n`);
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
