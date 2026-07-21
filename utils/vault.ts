import { normalizePath, TFolder, Vault } from "obsidian";

import { getParentPath } from "./path";

/** Creates every missing folder needed to contain the supplied file path. */
export async function ensureParentFolders(
  vault: Vault,
  filePath: string,
): Promise<void> {
  const parentPath = getParentPath(filePath);

  if (parentPath.length === 0) {
    return;
  }

  const segments = parentPath.split("/");
  let currentPath = "";

  for (const segment of segments) {
    currentPath = normalizePath(
      currentPath.length === 0 ? segment : `${currentPath}/${segment}`,
    );

    await ensureFolder(vault, currentPath);
  }
}

async function ensureFolder(vault: Vault, folderPath: string): Promise<void> {
  const existingEntry = vault.getAbstractFileByPath(folderPath);

  if (existingEntry instanceof TFolder) {
    return;
  }

  if (existingEntry !== null) {
    throw new Error(
      `Cannot create folder because a file exists at ${folderPath}`,
    );
  }

  try {
    await vault.createFolder(folderPath);
  } catch (error) {
    // Another vault operation may have created the same folder concurrently.
    if (!(vault.getAbstractFileByPath(folderPath) instanceof TFolder)) {
      throw error;
    }
  }
}
