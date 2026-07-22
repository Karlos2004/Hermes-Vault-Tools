import type { IconName } from "obsidian";

/** Top-level vault folder used for archived notes. */
export const ARCHIVE_ROOT = "50_Archive";

/** Obsidian command metadata for Archive Current Note. */
export const ARCHIVE_COMMAND = {
  id: "archive-current-note",
  name: "Archive Current Note",
} as const;

/** Ribbon metadata for Archive Current Note. */
export const ARCHIVE_RIBBON: Readonly<{
  icon: IconName;
  title: string;
}> = {
  icon: "archive",
  title: "Archive current note",
};

/** User-facing text used by the archive workflow. */
export const ARCHIVE_TEXT = {
  modalTitle: "Archive this note?",
  currentLabel: "Current:",
  destinationLabel: "Destination:",
  archiveButton: "Archive",
  cancelButton: "Cancel",
  archivedPrefix: "Archived:",
  errorPrefix: "Could not archive note:",
  noActiveMarkdown: "Open a Markdown note in the active view before archiving.",
  invalidVaultPath: "The current note has no valid vault path.",
  invalidTopLevelFolder:
    "The note must be inside a top-level folder named <number>_<FolderName>.",
  alreadyArchived: "The note is already inside the archive.",
  sourceChanged: "The note moved or was renamed before archiving.",
  unknownError: "Unknown error",
} as const;
