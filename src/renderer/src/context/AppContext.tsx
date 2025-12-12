import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import type { AppContextValue, AppState } from '@renderer/types'

const initialState: AppState = {
  isLoading: false,
  error: null
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [state, setState] = useState<AppState>(initialState)

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }))
  }, [])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      setLoading,
      setError,
      clearError
    }),
    [state, setLoading, setError, clearError]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
