import { App, MarkdownView, TFile } from "obsidian";

/** Returns the Markdown file in the active view, or null when none is active. */
export function getActiveMarkdownFile(app: App): TFile | null {
  const file = app.workspace.getActiveViewOfType(MarkdownView)?.file;

  return file instanceof TFile && file.extension.toLowerCase() === "md"
    ? file
    : null;
}
