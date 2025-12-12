import { app, shell, BrowserWindow, ipcMain, screen, dialog } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

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
  const mainWindow = new BrowserWindow({
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

  // Save window bounds on move or resize
  const saveBounds = (): void => {
    if (!mainWindow.isMaximized() && !mainWindow.isMinimized()) {
      const config = loadConfig()
      config.windowBounds = mainWindow.getBounds()
      saveConfig(config)
    }
  }

  mainWindow.on('resize', saveBounds)
  mainWindow.on('move', saveBounds)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
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

    return folderPath
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
