import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import type { UIContextValue, UIState, ViewId } from '@renderer/types'

const initialState: UIState = {
  sidebar: {
    isCollapsed: false,
    width: 280
  },
  activeView: 'home',
  title: 'Mr. Parsypants'
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [state, setState] = useState<UIState>(initialState)

  // Sidebar actions
  const toggleSidebar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sidebar: { ...prev.sidebar, isCollapsed: !prev.sidebar.isCollapsed }
    }))
  }, [])

  const setSidebarCollapsed = useCallback((isCollapsed: boolean) => {
    setState((prev) => ({
      ...prev,
      sidebar: { ...prev.sidebar, isCollapsed }
    }))
  }, [])

  const setSidebarWidth = useCallback((width: number) => {
    setState((prev) => ({
      ...prev,
      sidebar: { ...prev.sidebar, width }
    }))
  }, [])

  // View actions
  const setActiveView = useCallback((activeView: ViewId) => {
    setState((prev) => ({ ...prev, activeView }))
  }, [])

  const setTitle = useCallback((title: string) => {
    setState((prev) => ({ ...prev, title }))
  }, [])

  const value = useMemo<UIContextValue>(
    () => ({
      ...state,
      toggleSidebar,
      setSidebarCollapsed,
      setSidebarWidth,
      setActiveView,
      setTitle
    }),
    [state, toggleSidebar, setSidebarCollapsed, setSidebarWidth, setActiveView, setTitle]
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI(): UIContextValue {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
