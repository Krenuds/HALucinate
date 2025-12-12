import { app, shell, BrowserWindow, ipcMain, screen, dialog, protocol, net } from 'electron'
import { pathToFileURL } from 'url'
import { join } from 'path'
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import chokidar, { type FSWatcher } from 'chokidar'
import icon from '../../resources/icon.png?asset'

// File watcher instance
let fileWatcher: FSWatcher | null = null
let mainWindow: BrowserWindow | null = null

// Start watching a folder for image changes
function startFileWatcher(folderPath: string): void {
  // Stop existing watcher if any
  if (fileWatcher) {
    fileWatcher.close()
    fileWatcher = null
  }

  // Watch folder and immediate subfolders for image files
  fileWatcher = chokidar.watch(folderPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    depth: 1, // watch root and one level of subfolders
    ignoreInitial: true // don't fire events for existing files
  })

  const notifyChange = (): void => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('files-changed')
    }
  }

  // Debounce to avoid rapid-fire updates
  let debounceTimer: NodeJS.Timeout | null = null
  const debouncedNotify = (): void => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(notifyChange, 100)
  }

  fileWatcher
    .on('add', (path) => {
      if (isImageFile(path)) debouncedNotify()
    })
    .on('unlink', (path) => {
      if (isImageFile(path)) debouncedNotify()
    })
    .on('change', (path) => {
      if (isImageFile(path)) debouncedNotify()
    })
}

// Supported image extensions
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff', '.tif']

interface ImageFile {
  path: string
  name: string
  modifiedAt: number
  folder: string | null // null for root, folder name for subfolder
}

interface WindowBounds {
  x: number
  y: number
  width: number
  height: number
}

interface AppConfig {
  windowBounds: WindowBounds
  projectFolder: string | null
}

const defaultConfig: AppConfig = {
  windowBounds: {
    x: 0,
    y: 0,
    width: 900,
    height: 670
  },
  projectFolder: null
}

function getConfigPath(): string {
  return join(app.getPath('userData'), 'config.json')
}

function loadConfig(): AppConfig {
  try {
    const configPath = getConfigPath()
    if (existsSync(configPath)) {
      const data = readFileSync(configPath, 'utf-8')
      return { ...defaultConfig, ...JSON.parse(data) }
    }
  } catch {
    // If config is corrupted, use defaults
  }
  return defaultConfig
}

function saveConfig(config: AppConfig): void {
  try {
    const configPath = getConfigPath()
    const dir = app.getPath('userData')
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(configPath, JSON.stringify(config, null, 2))
  } catch {
    // Silently fail if we can't save
  }
}

function isImageFile(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'))
  return IMAGE_EXTENSIONS.includes(ext)
}

function scanForImages(folderPath: string): ImageFile[] {
  const images: ImageFile[] = []

  try {
    const entries = readdirSync(folderPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(folderPath, entry.name)

      if (entry.isFile() && isImageFile(entry.name)) {
        // Image in root folder
        const stats = statSync(fullPath)
        images.push({
          path: fullPath,
          name: entry.name,
          modifiedAt: stats.mtimeMs,
          folder: null
        })
      } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
        // Scan one level deep into subfolders
        try {
          const subEntries = readdirSync(fullPath, { withFileTypes: true })
          for (const subEntry of subEntries) {
            if (subEntry.isFile() && isImageFile(subEntry.name)) {
              const subPath = join(fullPath, subEntry.name)
              const stats = statSync(subPath)
              images.push({
                path: subPath,
                name: subEntry.name,
                modifiedAt: stats.mtimeMs,
                folder: entry.name
              })
            }
          }
        } catch {
          // Skip folders we can't read
        }
      }
    }
  } catch {
    // Return empty array if we can't read the folder
  }

  // Sort by modification date, most recent first
  return images.sort((a, b) => b.modifiedAt - a.modifiedAt)
}

function getWindowBounds(): Partial<WindowBounds> {
  const config = loadConfig()
  const saved = config.windowBounds
  const { width, height } = saved

  // Validate that the saved position is still on a visible display
  const displays = screen.getAllDisplays()
  const isOnScreen = displays.some((display) => {
    const { x, y, width: dw, height: dh } = display.bounds
    return saved.x >= x && saved.x < x + dw && saved.y >= y && saved.y < y + dh
  })

  if (isOnScreen) {
    return { x: saved.x, y: saved.y, width, height }
  }

  // If position is off-screen, only use size (window will be centered)
  return { width, height }
}

function createWindow(): void {
  const bounds = getWindowBounds()

  // Create the browser window.
  const win = new BrowserWindow({
    ...bounds,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow = win

  // Save window bounds on move or resize
  const saveBounds = (): void => {
    if (!win.isMaximized() && !win.isMinimized()) {
      const config = loadConfig()
      config.windowBounds = win.getBounds()
      saveConfig(config)
    }
  }

  win.on('resize', saveBounds)
  win.on('move', saveBounds)

  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Start file watcher if project folder is already configured
  const config = loadConfig()
  if (config.projectFolder && existsSync(config.projectFolder)) {
    startFileWatcher(config.projectFolder)
  }
}

// Register custom protocol scheme before app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local-image',
    privileges: {
      secure: true,
      supportFetchAPI: true,
      bypassCSP: true
    }
  }
])

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Register protocol handler for local images
  protocol.handle('local-image', (request) => {
    // URL format: local-image://host/C:/path/to/file.png
    // We ignore the host and extract the path
    const url = new URL(request.url)
    // On Windows, pathname starts with /C:/ so we need to remove the leading slash
    let filePath = decodeURIComponent(url.pathname)
    if (process.platform === 'win32' && filePath.startsWith('/')) {
      filePath = filePath.slice(1)
    }
    return net.fetch(pathToFileURL(filePath).toString())
  })

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Window control handlers
  ipcMain.on('window-minimize', () => {
    const win = BrowserWindow.getFocusedWindow()
    win?.minimize()
  })

  ipcMain.on('window-maximize', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })

  ipcMain.on('window-close', () => {
    const win = BrowserWindow.getFocusedWindow()
    win?.close()
  })

  // Project folder handlers
  ipcMain.handle('get-project-folder', () => {
    const config = loadConfig()
    return config.projectFolder
  })

  ipcMain.handle('select-project-folder', async () => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return null

    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
      title: 'Select Project Folder'
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    const folderPath = result.filePaths[0]
    const config = loadConfig()
    config.projectFolder = folderPath
    saveConfig(config)

    // Start watching the new folder
    startFileWatcher(folderPath)

    return folderPath
  })

  // Scan project folder for images
  ipcMain.handle('scan-images', () => {
    const config = loadConfig()
    if (!config.projectFolder) {
      return []
    }
    return scanForImages(config.projectFolder)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
