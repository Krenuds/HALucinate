// UI/Layout state types

export type ViewId = 'home' | 'settings' | (string & {})

export interface SidebarState {
  isCollapsed: boolean
  width: number
}

export interface UIState {
  sidebar: SidebarState
  activeView: ViewId
  title: string
}

export interface UIContextValue extends UIState {
  // Sidebar actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSidebarWidth: (width: number) => void

  // View/navigation actions
  setActiveView: (view: ViewId) => void
  setTitle: (title: string) => void
}
