import { ElectronAPI } from '@electron-toolkit/preload'

export interface ImageFile {
  path: string
  name: string
  modifiedAt: number
  folder: string | null
}

interface WindowAPI {
  windowMinimize: () => void
  windowMaximize: () => void
  windowClose: () => void
  getProjectFolder: () => Promise<string | null>
  selectProjectFolder: () => Promise<string | null>
  scanImages: () => Promise<ImageFile[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: WindowAPI
  }
}
