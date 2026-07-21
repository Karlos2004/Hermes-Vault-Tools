import { App, Modal, Setting } from "obsidian";

import { ARCHIVE_TEXT } from "../constants";

/** Confirmation dialog shown immediately before an archive operation. */
export class ConfirmArchiveModal extends Modal {
  private isResolved = false;

  private constructor(
    app: App,
    private readonly currentPath: string,
    private readonly destinationPath: string,
    private readonly resolveConfirmation: (confirmed: boolean) => void,
  ) {
    super(app);
  }

  /** Opens the modal and resolves whether the user confirmed the archive. */
  static open(
    app: App,
    currentPath: string,
    destinationPath: string,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      new ConfirmArchiveModal(
        app,
        currentPath,
        destinationPath,
        resolve,
      ).open();
    });
  }

  onOpen(): void {
    this.titleEl.setText(ARCHIVE_TEXT.modalTitle);
    this.contentEl.addClass("hermes-vault-tools-confirm");

    this.addPath(ARCHIVE_TEXT.currentLabel, this.currentPath);
    this.addPath(ARCHIVE_TEXT.destinationLabel, this.destinationPath);

    new Setting(this.contentEl)
      .addButton((button) =>
        button
          .setButtonText(ARCHIVE_TEXT.cancelButton)
          .onClick(() => this.complete(false)),
      )
      .addButton((button) =>
        button
          .setButtonText(ARCHIVE_TEXT.archiveButton)
          .setCta()
          .onClick(() => this.complete(true)),
      );
  }

  onClose(): void {
    this.contentEl.empty();

    if (!this.isResolved) {
      this.isResolved = true;
      this.resolveConfirmation(false);
    }
  }

  private addPath(label: string, path: string): void {
    const section = this.contentEl.createDiv({
      cls: "hermes-vault-tools-path-section",
    });
    section.createEl("strong", { text: label });
    section.createEl("code", { text: path });
  }

  private complete(confirmed: boolean): void {
    if (this.isResolved) {
      return;
    }

    this.isResolved = true;
    this.resolveConfirmation(confirmed);
    this.close();
  }
}
