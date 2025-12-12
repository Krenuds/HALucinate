# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Development (starts Electron with HMR)
npm run dev

# Type checking
npm run typecheck          # Both main and renderer
npm run typecheck:node     # Main/preload processes only
npm run typecheck:web      # Renderer process only

# Linting and formatting
npm run lint
npm run format

# Build for production
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## Architecture

This is an Electron application built with electron-vite, React 19, and TypeScript.

### Process Structure

Electron apps run multiple processes that communicate via IPC:

- **Main process** (`src/main/index.ts`): Node.js process that creates windows, handles system events, and manages app lifecycle. Uses `ipcMain` for receiving messages from renderer.

- **Preload script** (`src/preload/index.ts`): Bridge between main and renderer. Runs in renderer context but has access to Node.js APIs. Exposes `window.electron` and `window.api` via `contextBridge`.

- **Renderer process** (`src/renderer/`): React application rendered in Chromium. Communicates with main via `window.electron.ipcRenderer`. Entry point is `src/renderer/src/main.tsx`.

### Build Configuration

- `electron.vite.config.ts`: Configures Vite for all three contexts (main, preload, renderer)
- `electron-builder.yml`: Configures app packaging and installers
- Separate TypeScript configs: `tsconfig.node.json` (main/preload) and `tsconfig.web.json` (renderer)
- Path alias: `@renderer` maps to `src/renderer/src`
