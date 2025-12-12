import { useEffect, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { Titlebar } from './components/titlebar'
import { Sidebar } from './components/sidebar'
import { MainContent } from './components/main-content'
import { LoginPage } from './components/login'
import { AppProvider, UIProvider, useUI } from './context'

function AppLayout(): React.JSX.Element {
  const { title } = useUI()

  return (
    <Flex direction="column" h="100vh">
      <Titlebar title={title} />
      <Flex flex="1" overflow="hidden">
        <Sidebar />
        <MainContent>
          <Text color="fg.muted">Main content goes here</Text>
        </MainContent>
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
        <AppLayout />
      </UIProvider>
    </AppProvider>
  )
}

export default App
