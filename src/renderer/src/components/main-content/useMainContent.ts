import { useUI } from '@renderer/context'
import { useApp } from '@renderer/context'

/**
 * Hook for main content area functionality.
 * Combines app state (loading/errors) with UI state (active view).
 */
export function useMainContent() {
  const { activeView, title, setTitle } = useUI()
  const { isLoading, error, setLoading, setError, clearError } = useApp()

  return {
    // View state
    activeView,
    title,
    setTitle,

    // App state
    isLoading,
    error,
    setLoading,
    setError,
    clearError
  }
}
