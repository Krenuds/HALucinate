import { useUI } from '@renderer/context'

/**
 * Hook for titlebar-specific functionality.
 * Provides title management and sidebar toggle for hamburger menu.
 */
export function useTitlebar() {
  const { title, setTitle, toggleSidebar } = useUI()

  return {
    title,
    setTitle,
    toggleSidebar
  }
}
