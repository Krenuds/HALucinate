import { ElectronAPI } from '@electron-toolkit/preload'

export interface ImageFile {
  path: string
  name: string
  modifiedAt: number
  folder: string | null
}

export interface OCRProgress {
  status: 'idle' | 'initializing' | 'processing' | 'completed' | 'error' | 'cancelled'
  currentImage: string | null
  currentIndex: number
  totalImages: number
  imageProgress: number
  overallProgress: number
}

export interface OCRResult {
  path: string
  text: string
  confidence: number
  error?: string
}

export interface OCRResponse {
  success: boolean
  results: OCRResult[]
  error?: string
}

interface WindowAPI {
  windowMinimize: () => void
  windowMaximize: () => void
  windowClose: () => void
  getProjectFolder: () => Promise<string | null>
  selectProjectFolder: () => Promise<string | null>
  scanImages: () => Promise<ImageFile[]>
  onFilesChanged: (callback: () => void) => () => void
  runOCR: (imagePaths: string[]) => Promise<OCRResponse>
  cancelOCR: () => void
  onOCRProgress: (callback: (progress: OCRProgress) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: WindowAPI
  }
}
