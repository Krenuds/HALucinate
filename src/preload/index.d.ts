import { ElectronAPI } from '@electron-toolkit/preload'

interface WindowAPI {
  windowMinimize: () => void
  windowMaximize: () => void
  windowClose: () => void
  getProjectFolder: () => Promise<string | null>
  selectProjectFolder: () => Promise<string | null>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: WindowAPI
  }
}
