import { Plugin } from "obsidian";

import {
  createArchiveAction,
  registerArchiveCommand,
} from "./commands/archive";
import { ARCHIVE_RIBBON } from "./constants";

/** Entry point for Hermes Vault Tools. */
export default class HermesVaultToolsPlugin extends Plugin {
  onload(): void {
    const archiveAction = createArchiveAction(this.app);

    registerArchiveCommand(this, archiveAction);
    this.addRibbonIcon(
      ARCHIVE_RIBBON.icon,
      ARCHIVE_RIBBON.title,
      archiveAction,
    );
  }
}
