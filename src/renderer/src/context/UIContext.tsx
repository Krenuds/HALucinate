import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import type { UIContextValue, UIState, ViewId, ImageFile, OCRProgress, OCRResult, OCRState } from '@renderer/types'

const initialOCRState: OCRState = {
  isRunning: false,
  progress: {
    status: 'idle',
    currentImage: null,
    currentIndex: 0,
    totalImages: 0,
    imageProgress: 0,
    overallProgress: 0
  },
  results: [],
  error: null,
  drawerOpen: false
}

const initialState: UIState = {
  sidebar: {
    isCollapsed: false,
    width: 280
  },
  activeView: 'home',
  title: 'Mr. Parsyface',
  projectFolder: null,
  images: [],
  selectedPaths: [],
  ocr: initialOCRState
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

  const setProjectFolder = useCallback((projectFolder: string | null) => {
    setState((prev) => ({ ...prev, projectFolder }))
  }, [])

  // Image/selection actions
  const setImages = useCallback((images: ImageFile[]) => {
    setState((prev) => ({ ...prev, images }))
  }, [])

  const setSelectedPaths = useCallback((selectedPaths: string[]) => {
    setState((prev) => ({ ...prev, selectedPaths }))
  }, [])

  // Derived: selected images from paths
  const selectedImages = useMemo(() => {
    const pathSet = new Set(state.selectedPaths)
    return state.images.filter((img) => pathSet.has(img.path))
  }, [state.images, state.selectedPaths])

  // OCR actions
  const setOCRRunning = useCallback((isRunning: boolean) => {
    setState((prev) => ({ ...prev, ocr: { ...prev.ocr, isRunning } }))
  }, [])

  const setOCRProgress = useCallback((progress: OCRProgress) => {
    setState((prev) => ({ ...prev, ocr: { ...prev.ocr, progress } }))
  }, [])

  const setOCRResults = useCallback((results: OCRResult[]) => {
    setState((prev) => ({ ...prev, ocr: { ...prev.ocr, results } }))
  }, [])

  const setOCRError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, ocr: { ...prev.ocr, error } }))
  }, [])

  const setOCRDrawerOpen = useCallback((drawerOpen: boolean) => {
    setState((prev) => ({ ...prev, ocr: { ...prev.ocr, drawerOpen } }))
  }, [])

  const clearOCRResults = useCallback(() => {
    setState((prev) => ({
      ...prev,
      ocr: { ...initialOCRState }
    }))
  }, [])

  const value = useMemo<UIContextValue>(
    () => ({
      ...state,
      toggleSidebar,
      setSidebarCollapsed,
      setSidebarWidth,
      setActiveView,
      setTitle,
      setProjectFolder,
      setImages,
      setSelectedPaths,
      selectedImages,
      setOCRRunning,
      setOCRProgress,
      setOCRResults,
      setOCRError,
      setOCRDrawerOpen,
      clearOCRResults
    }),
    [state, toggleSidebar, setSidebarCollapsed, setSidebarWidth, setActiveView, setTitle, setProjectFolder, setImages, setSelectedPaths, selectedImages, setOCRRunning, setOCRProgress, setOCRResults, setOCRError, setOCRDrawerOpen, clearOCRResults]
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
