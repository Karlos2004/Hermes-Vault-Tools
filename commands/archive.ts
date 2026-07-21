import { App, Notice, Plugin, TFile } from "obsidian";

import { ARCHIVE_COMMAND, ARCHIVE_TEXT } from "../constants";
import { ConfirmArchiveModal } from "../modals/ConfirmArchiveModal";
import { getErrorMessage } from "../utils/error";
import { getArchivePath } from "../utils/path";
import { ensureParentFolders } from "../utils/vault";
import { getActiveMarkdownFile } from "../utils/workspace";

type ArchiveAction = () => void;

/** Registers the archive command in Obsidian's command palette. */
export function registerArchiveCommand(
  plugin: Plugin,
  archiveAction: ArchiveAction,
): void {
  plugin.addCommand({
    id: ARCHIVE_COMMAND.id,
    name: ARCHIVE_COMMAND.name,
    callback: archiveAction,
  });
}

/**
 * Creates a safe, void-returning action for Obsidian command and ribbon callbacks.
 */
export function createArchiveAction(app: App): ArchiveAction {
  return () => {
    void archiveCurrentNote(app);
  };
}

/** Prompts for confirmation and archives the active Markdown note. */
export async function archiveCurrentNote(app: App): Promise<void> {
  try {
    await executeArchiveCurrentNote(app);
  } catch (error) {
    showArchiveError(error);
  }
}

async function executeArchiveCurrentNote(app: App): Promise<void> {
  const file = getActiveMarkdownFile(app);

  if (file === null) {
    new Notice(ARCHIVE_TEXT.noActiveMarkdown);
    return;
  }

  const currentPath = file.path;
  const destinationPath = getArchivePath(currentPath);

  const confirmed = await ConfirmArchiveModal.open(
    app,
    currentPath,
    destinationPath,
  );

  if (!confirmed) {
    return;
  }

  assertSourceIsUnchanged(app, file, currentPath);
  assertDestinationIsAvailable(app, destinationPath);

  await ensureParentFolders(app.vault, destinationPath);
  await app.vault.rename(file, destinationPath);
  new Notice(`${ARCHIVE_TEXT.archivedPrefix}\n${destinationPath}`);
}

function assertSourceIsUnchanged(
  app: App,
  file: TFile,
  currentPath: string,
): void {
  if (app.vault.getAbstractFileByPath(currentPath) !== file) {
    throw new Error(ARCHIVE_TEXT.sourceChanged);
  }
}

function assertDestinationIsAvailable(app: App, destinationPath: string): void {
  if (app.vault.getAbstractFileByPath(destinationPath) !== null) {
    throw new Error(`A file already exists at ${destinationPath}`);
  }
}

function showArchiveError(error: unknown): void {
  const message = getErrorMessage(error, ARCHIVE_TEXT.unknownError);
  new Notice(`${ARCHIVE_TEXT.errorPrefix}\n${message}`);
}
