import { useEffect, useCallback, useMemo } from 'react'
import { useUI } from '@renderer/context'
import { useApp } from '@renderer/context'

/**
 * Hook for main content area functionality.
 * Combines app state (loading/errors) with UI state (active view).
 */
export function useMainContent() {
  const {
    activeView,
    title,
    setTitle,
    projectFolder,
    selectedImages,
    ocr,
    setOCRRunning,
    setOCRProgress,
    setOCRResults,
    setOCRError,
    setOCRDrawerOpen
  } = useUI()

  // Derive folder name for header display
  const folderName = useMemo(() => {
    if (!projectFolder) return null
    return projectFolder.split(/[/\\]/).pop() || projectFolder
  }, [projectFolder])
  const { isLoading, error, setLoading, setError, clearError } = useApp()

  // Subscribe to OCR progress events
  useEffect(() => {
    const unsubscribe = window.api.onOCRProgress((progress) => {
      setOCRProgress(progress)

      if (progress.status === 'completed' || progress.status === 'error' || progress.status === 'cancelled') {
        setOCRRunning(false)
      }
    })
    return unsubscribe
  }, [setOCRProgress, setOCRRunning])

  // Run OCR on selected images
  const handleRunOCR = useCallback(async () => {
    if (selectedImages.length === 0) return

    setOCRRunning(true)
    setOCRError(null)

    const paths = selectedImages.map((img) => img.path)
    const response = await window.api.runOCR(paths)

    if (response.success) {
      setOCRResults(response.results)
      setOCRDrawerOpen(true)
    } else {
      setOCRError(response.error || 'OCR failed')
    }

    setOCRRunning(false)
  }, [selectedImages, setOCRRunning, setOCRError, setOCRResults, setOCRDrawerOpen])

  // Cancel OCR
  const handleCancelOCR = useCallback(() => {
    window.api.cancelOCR()
  }, [])

  return {
    // View state
    activeView,
    title,
    setTitle,
    folderName,

    // Selected images from sidebar
    selectedImages,

    // App state
    isLoading,
    error,
    setLoading,
    setError,
    clearError,

    // OCR state and handlers
    ocr,
    handleRunOCR,
    handleCancelOCR,
    setOCRDrawerOpen
  }
}
