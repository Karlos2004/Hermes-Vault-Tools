import { normalizePath } from "obsidian";

import { ARCHIVE_ROOT, ARCHIVE_TEXT } from "../constants";

const PREFIXED_FOLDER_PATTERN = /^\d+_(.+)$/;

/**
 * Maps a note under `<number>_<FolderName>` to
 * `50_Archive/<FolderName>` while preserving the remaining path.
 */
export function getArchivePath(currentPath: string): string {
  const normalizedPath = normalizePath(currentPath);
  const pathParts = normalizedPath.split("/");
  const firstFolder = pathParts.shift();
  const remainingParts = pathParts;

  if (firstFolder === undefined) {
    throw new Error(ARCHIVE_TEXT.invalidVaultPath);
  }

  if (firstFolder === ARCHIVE_ROOT) {
    throw new Error(ARCHIVE_TEXT.alreadyArchived);
  }

  const match = PREFIXED_FOLDER_PATTERN.exec(firstFolder);
  const folderName = match?.[1];

  if (remainingParts.length === 0 || folderName === undefined) {
    throw new Error(ARCHIVE_TEXT.invalidTopLevelFolder);
  }

  return normalizePath(
    [ARCHIVE_ROOT, folderName, ...remainingParts].join("/"),
  );
}

/** Returns the containing folder for a normalized vault path. */
export function getParentPath(filePath: string): string {
  const normalizedPath = normalizePath(filePath);
  const separatorIndex = normalizedPath.lastIndexOf("/");

  return separatorIndex === -1 ? "" : normalizedPath.slice(0, separatorIndex);
}
