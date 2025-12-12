import { useUI } from '@renderer/context'

/**
 * Hook for sidebar-specific functionality.
 * Provides a focused API for sidebar concerns.
 */
export function useSidebar() {
  const {
    sidebar,
    activeView,
    toggleSidebar,
    setSidebarCollapsed,
    setSidebarWidth,
    setActiveView
  } = useUI()

  return {
    // State
    isCollapsed: sidebar.isCollapsed,
    width: sidebar.width,
    activeView,

    // Actions
    toggle: toggleSidebar,
    collapse: () => setSidebarCollapsed(true),
    expand: () => setSidebarCollapsed(false),
    setWidth: setSidebarWidth,
    navigateTo: setActiveView
  }
}
