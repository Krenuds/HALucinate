import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  windowMinimize: (): void => electronAPI.ipcRenderer.send('window-minimize'),
  windowMaximize: (): void => electronAPI.ipcRenderer.send('window-maximize'),
  windowClose: (): void => electronAPI.ipcRenderer.send('window-close'),
  getProjectFolder: (): Promise<string | null> =>
    electronAPI.ipcRenderer.invoke('get-project-folder'),
  selectProjectFolder: (): Promise<string | null> =>
    electronAPI.ipcRenderer.invoke('select-project-folder'),
  scanImages: (): Promise<ImageFile[]> => electronAPI.ipcRenderer.invoke('scan-images'),
  onFilesChanged: (callback: () => void): (() => void) => {
    const handler = (): void => callback()
    electronAPI.ipcRenderer.on('files-changed', handler)
    // Return unsubscribe function
    return (): void => {
      electronAPI.ipcRenderer.removeListener('files-changed', handler)
    }
  },
  runOCR: (imagePaths: string[]): Promise<OCRResponse> =>
    electronAPI.ipcRenderer.invoke('run-ocr', imagePaths),
  cancelOCR: (): void => electronAPI.ipcRenderer.send('cancel-ocr'),
  onOCRProgress: (callback: (progress: OCRProgress) => void): (() => void) => {
    const handler = (_event: unknown, progress: OCRProgress): void => callback(progress)
    electronAPI.ipcRenderer.on('ocr-progress', handler)
    return (): void => {
      electronAPI.ipcRenderer.removeListener('ocr-progress', handler)
    }
  }
}

interface ImageFile {
  path: string
  name: string
  modifiedAt: number
  folder: string | null
}

interface OCRProgress {
  status: 'idle' | 'initializing' | 'processing' | 'completed' | 'error' | 'cancelled'
  currentImage: string | null
  currentIndex: number
  totalImages: number
  imageProgress: number
  overallProgress: number
}

interface OCRResult {
  path: string
  text: string
  confidence: number
  error?: string
}

interface OCRResponse {
  success: boolean
  results: OCRResult[]
  error?: string
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
