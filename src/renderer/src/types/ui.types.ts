// UI/Layout state types

import type { ImageFile } from '../../../preload/index.d'

export type ViewId = 'home' | 'settings' | (string & {})

export interface SidebarState {
  isCollapsed: boolean
  width: number
}

export interface UIState {
  sidebar: SidebarState
  activeView: ViewId
  title: string
  // Image selection state
  images: ImageFile[]
  selectedPaths: string[]
}

export interface UIContextValue extends UIState {
  // Sidebar actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSidebarWidth: (width: number) => void

  // View/navigation actions
  setActiveView: (view: ViewId) => void
  setTitle: (title: string) => void

  // Image/selection actions
  setImages: (images: ImageFile[]) => void
  setSelectedPaths: (paths: string[]) => void
  selectedImages: ImageFile[]
}

// Re-export ImageFile for convenience
export type { ImageFile }
