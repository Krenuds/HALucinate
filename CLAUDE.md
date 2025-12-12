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

## UI Framework

This app uses **Chakra UI v3** with a dark-only theme.

### Chakra Setup

- **Provider**: `src/renderer/src/components/ui/provider.tsx` wraps the app with ChakraProvider
- **Color Mode**: Forced to dark mode via `forcedTheme="dark"` in the ColorModeProvider (no light mode toggle)
- **Snippets**: Chakra CLI snippets are in `src/renderer/src/components/ui/`

### Custom Titlebar

The app uses a frameless window with a custom titlebar (`src/renderer/src/components/Titlebar.tsx`):

- **Frameless**: `frame: false` in BrowserWindow config removes native titlebar
- **Draggable**: Header uses `-webkit-app-region: drag` for window dragging
- **Window Controls**: Custom minimize/maximize/close buttons via IPC:
  - Renderer calls `window.api.windowMinimize()`, `windowMaximize()`, `windowClose()`
  - Main process handles via `ipcMain.on('window-minimize' | 'window-maximize' | 'window-close')`

### Design Principles

- **One-piece look**: Header and body share the same background (transparent header, no borders)
- **IconButton styling**: Use `variant="ghost"` with `bg="transparent"` for seamless buttons
