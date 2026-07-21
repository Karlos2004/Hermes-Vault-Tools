# Hermes Vault Tools

Hermes Vault Tools is an Obsidian community plugin that provides a central home
for custom vault actions. The current release contains one command: **Archive
Current Note**.

The command confirms the source and destination paths, creates missing archive
folders, and moves the active Markdown note without changing its contents,
frontmatter, or metadata.

## Project structure

```text
hermes-vault-tools/
├── commands/
│   └── archive.ts             # Archive workflow and command registration
├── modals/
│   └── ConfirmArchiveModal.ts # Archive confirmation UI
├── utils/
│   ├── error.ts               # Unknown-error handling
│   ├── path.ts                # Archive and parent-path calculations
│   ├── vault.ts               # Recursive folder creation
│   └── workspace.ts           # Active Markdown file lookup
├── constants.ts               # Shared command, ribbon, path, and UI constants
├── main.ts                    # Plugin entry point and feature registration
├── manifest.json              # Obsidian plugin metadata
└── styles.css                 # Confirmation modal styles
```

The production build bundles the TypeScript entry point into `main.js`.

## Build

Node.js and npm are required.

```bash
npm install
npm run build
```

The build first runs TypeScript type checking and then creates the production
`main.js` bundle with esbuild.

For development with automatic rebuilds:

```bash
npm run dev
```

## Install

1. Build the plugin.
2. Create this folder inside the target vault:
   `.obsidian/plugins/hermes-vault-tools/`
3. Copy `main.js`, `manifest.json`, and `styles.css` into that folder.
4. Reload Obsidian.
5. Enable **Hermes Vault Tools** under **Settings → Community plugins**.

## Command architecture

Each vault action should remain a self-contained command module under
`commands/`. A command module owns its workflow and exposes a single action that
can be shared by Command Palette and ribbon registrations. Supporting concerns
belong in focused modules:

- Reusable path and vault operations go in `utils/`.
- Confirmation or input UI goes in `modals/`.
- Shared identifiers, labels, paths, and messages go in `constants.ts`.
- `main.ts` only composes and registers features.

This layout allows future commands to be added without coupling their business
logic to the plugin entry point or to other commands.
