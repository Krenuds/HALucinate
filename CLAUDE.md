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

### Configuration / Persistence

The app uses a native fs-based configuration system in the main process (`src/main/index.ts`):

- **Config file**: `config.json` stored in `app.getPath('userData')`
  - Windows: `%APPDATA%/electron-app/config.json`
  - macOS: `~/Library/Application Support/electron-app/config.json`
  - Linux: `~/.config/electron-app/config.json`

- **Functions**:
  - `loadConfig()`: Synchronously reads config on startup, merges with defaults
  - `saveConfig(config)`: Writes config to disk
  - `getConfigPath()`: Returns the full path to `config.json`

- **Current settings**:
  - `windowBounds`: Persists window position (x, y) and size (width, height)
  - `projectFolder`: Path to the project folder (string or null if not set)

- **Adding new settings**: Extend the `AppConfig` interface and `defaultConfig` object:
  ```typescript
  interface AppConfig {
    windowBounds: WindowBounds
    // Add new settings here
  }
  ```

- **Design notes**:
  - Uses synchronous fs operations (no ESM/async issues)
  - Window bounds are validated against available displays on startup
  - Bounds are saved on window `move` and `resize` events (skipped when maximized/minimized)

## UI Framework

This app uses **Chakra UI v3** with a dark-only theme.

### Chakra Setup

- **Provider**: `src/renderer/src/components/ui/provider.tsx` wraps the app with ChakraProvider
- **Color Mode**: Forced to dark mode via `forcedTheme="dark"` in the ColorModeProvider (no light mode toggle)
- **Snippets**: Chakra CLI snippets are in `src/renderer/src/components/ui/`

### Custom Titlebar

The app uses a frameless window with a custom titlebar (`src/renderer/src/components/titlebar/Titlebar.tsx`):

- **Frameless**: `frame: false` in BrowserWindow config removes native titlebar
- **Static Title**: Always displays "Mr. Parsyface" - title is not dynamic
- **Draggable**: Header uses `-webkit-app-region: drag` for window dragging
- **Window Controls**: Minimize/maximize/close buttons flush to right edge via IPC:
  - Renderer calls `window.api.windowMinimize()`, `windowMaximize()`, `windowClose()`
  - Main process handles via `ipcMain.on('window-minimize' | 'window-maximize' | 'window-close')`
- **Optional Folder Button**: Pass `onChangeFolder` prop to show folder picker button
- **Styling**: Background color matches app (`bg="bg"`), bottom border for separation, `zIndex="banner"` ensures visibility

### Design Principles

- **Consistent titlebar**: Same titlebar component used in both LoginPage and main app
- **IconButton styling**: Use `variant="ghost"` with `bg="transparent"` and explicit `color="fg.muted"`

## State Management

The app uses React Context for inter-region communication between Titlebar, Sidebar, and MainContent.

### Contexts

- **AppContext** (`src/renderer/src/context/AppContext.tsx`): Global app state (loading, errors)
  - `useApp()` hook provides: `isLoading`, `error`, `setLoading()`, `setError()`, `clearError()`

- **UIContext** (`src/renderer/src/context/UIContext.tsx`): UI/layout state
  - `useUI()` hook provides: `sidebar`, `activeView`, `projectFolder`, `images`, `selectedPaths`, `ocr`, plus setters

### Types

Type definitions are in `src/renderer/src/types/`:
- `app.types.ts`: `AppState`, `AppContextValue`
- `ui.types.ts`: `UIState`, `UIContextValue`, `ViewId`, `SidebarState`

## Component Organization

Components are organized by region with dedicated folders:

```
src/renderer/src/components/
├── titlebar/
│   ├── Titlebar.tsx      # Static window titlebar with controls
│   └── index.ts
├── sidebar/
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── useSidebar.ts     # Hook: isCollapsed, width, navigateTo
│   └── index.ts
├── main-content/
│   ├── MainContent.tsx   # Main content area with header/footer
│   ├── useMainContent.ts # Hook: activeView, folderName, OCR handlers
│   ├── OCRResultsDrawer.tsx # Slide-out panel for OCR results
│   └── index.ts
├── login/
│   ├── LoginPage.tsx     # Initial folder selection screen
│   └── index.ts
└── ui/                   # Chakra UI snippets
```

### Region Hooks

Each region has a focused hook that provides a clean API:

- `useSidebar()`: Collapse state, width, navigation (`navigateTo()`)
- `useMainContent()`: Active view, folder name, OCR state and handlers

### Import Pattern

Use barrel exports for clean imports:
```typescript
import { Sidebar, useSidebar } from './components/sidebar'
import { useUI } from './context'
```

## File Browser

The sidebar contains a file browser (`src/renderer/src/components/sidebar/FileBrowser.tsx`) that displays images from the project folder.

### Selection Behavior

Uses Chakra UI's `Listbox` component with `selectionMode="extended"` for standard file-browser selection:

| Action | Behavior |
|--------|----------|
| Click | Select single item, deselect others |
| Ctrl+Click | Toggle item in selection |
| Shift+Click | Select contiguous range |

- Selected items stored in `selectedPaths` state (array of file paths)
- Selection highlighted with muted blue (`blue.900/50`)
- Collection created via `createListCollection()` with `itemToValue: (item) => item.path`

### Image Preview

Hovering over an item shows a tooltip preview of the image (max 600x400px) using the `local-image://` custom protocol registered in main process.

## OCR System

The app uses **tesseract.js** for OCR text extraction from selected images.

### Architecture

```
[Renderer] Button Click
    │
    ▼
window.api.runOCR(paths) ──invoke──▶ [Main] ipcMain.handle('run-ocr')
    │                                         │
    │                                         ▼ (loop per image)
    │                                    webContents.send('ocr-progress')
    │                                         │
    ◀──────────────────────────────────────────
    │ onOCRProgress callback fires
    │
    ▼ (on complete)
Promise resolves with { success, results }
```

### IPC Methods

| Method | Type | Description |
|--------|------|-------------|
| `runOCR(paths)` | invoke/handle | Process images, returns `OCRResponse` |
| `cancelOCR()` | send/on | Set cancellation flag |
| `onOCRProgress(cb)` | event | Subscribe to progress updates |

### State Management

OCR state lives in UIContext (`src/renderer/src/context/UIContext.tsx`):

```typescript
interface OCRState {
  isRunning: boolean
  progress: OCRProgress  // status, currentIndex, totalImages, etc.
  results: OCRResult[]   // path, text, confidence, error
  error: string | null
  drawerOpen: boolean
}
```

### Key Files

- `src/main/index.ts`: OCR handlers, Tesseract worker management
- `src/preload/index.ts`: IPC bridge methods
- `src/renderer/src/components/main-content/useMainContent.ts`: OCR handlers + IPC subscription
- `src/renderer/src/components/main-content/OCRResultsDrawer.tsx`: Results panel

### Current Limitations

- **Sequential processing**: CPU-only, one image at a time
- **English only**: Hardcoded to `'eng'` language

### Future Extensions

- Parallel processing with `p-limit` when GPU available
- Language selection (tesseract.js supports 100+ languages)
- Output formats: hOCR, PDF, TSV

---

**NEXT STEPS**
- READ LATEST 4 GIT COMMIT COMMENTS IN FULL RIGHT NOW
- ECHO "GIT INGESTED, HOSS" IMMEDIATELY AFTER