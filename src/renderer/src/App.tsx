import { useState, useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { Titlebar } from './components/titlebar'
import { Sidebar } from './components/sidebar'
import { MainContent } from './components/main-content'
import { LoginPage } from './components/login'
import { AppProvider, UIProvider, useUI } from './context'

interface AppLayoutProps {
  projectFolder: string
}

function AppLayout({ projectFolder }: AppLayoutProps): React.JSX.Element {
  const { setProjectFolder } = useUI()

  // Store project folder in context for MainContent header
  useEffect(() => {
    setProjectFolder(projectFolder)
  }, [projectFolder, setProjectFolder])

  const handleChangeFolder = (): void => {
    window.api.selectProjectFolder()
  }

  return (
    <Flex direction="column" h="100vh">
      <Titlebar onChangeFolder={handleChangeFolder} />
      <Flex flex="1" overflow="hidden">
        <Sidebar />
        <MainContent />
      </Flex>
    </Flex>
  )
}

function App(): React.JSX.Element {
  const [projectFolder, setProjectFolder] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    window.api.getProjectFolder().then((folder) => {
      setProjectFolder(folder)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return <Flex h="100vh" bg="bg" />
  }

  if (!projectFolder) {
    return <LoginPage onFolderSelected={setProjectFolder} />
  }

  return (
    <AppProvider>
      <UIProvider>
        <AppLayout projectFolder={projectFolder} />
      </UIProvider>
    </AppProvider>
  )
}

export default App
