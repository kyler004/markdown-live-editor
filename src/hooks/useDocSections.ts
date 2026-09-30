import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface DocSection {
  id: string;
  title: string;
  content: DocBlock[];
}

export type DocBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "code"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export const DOC_SECTION_IDS = [
  "getting-started",
  "markdown",
  "latex",
  "themes",
  "terminal",
  "keyboard",
  "auth",
  "deployment",
] as const;

export function useDocSections(): DocSection[] {
  const { t } = useTranslation("docs");

  return useMemo(
    () =>
      DOC_SECTION_IDS.map((id) => {
        const section = t(`sections.${id}`, {
          returnObjects: true,
        }) as {
          title: string;
          blocks: DocBlock[];
        };

        return {
          id,
          title: section?.title ?? id,
          content: Array.isArray(section?.blocks) ? section.blocks : [],
        };
      }),
    [t],
  );
}
