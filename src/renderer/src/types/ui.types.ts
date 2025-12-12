// UI/Layout state types

import type { ImageFile, OCRProgress, OCRResult } from '../../../preload/index.d'

export type ViewId = 'home' | 'settings' | (string & {})

export interface SidebarState {
  isCollapsed: boolean
  width: number
}

export interface OCRState {
  isRunning: boolean
  progress: OCRProgress
  results: OCRResult[]
  error: string | null
  drawerOpen: boolean
}

export interface UIState {
  sidebar: SidebarState
  activeView: ViewId
  projectFolder: string | null
  // Image selection state
  images: ImageFile[]
  selectedPaths: string[]
  // OCR state
  ocr: OCRState
}

export interface UIContextValue extends UIState {
  // Sidebar actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSidebarWidth: (width: number) => void

  // View/navigation actions
  setActiveView: (view: ViewId) => void
  setProjectFolder: (folder: string | null) => void

  // Image/selection actions
  setImages: (images: ImageFile[]) => void
  setSelectedPaths: (paths: string[]) => void
  selectedImages: ImageFile[]

  // OCR actions
  setOCRRunning: (running: boolean) => void
  setOCRProgress: (progress: OCRProgress) => void
  setOCRResults: (results: OCRResult[]) => void
  setOCRError: (error: string | null) => void
  setOCRDrawerOpen: (open: boolean) => void
  clearOCRResults: () => void
}

// Re-export types for convenience
export type { ImageFile, OCRProgress, OCRResult }
