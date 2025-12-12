// Application-level state types

export interface AppState {
  isLoading: boolean
  error: string | null
}

export interface AppContextValue extends AppState {
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}
