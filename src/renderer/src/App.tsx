import { Flex, Text } from '@chakra-ui/react'
import { Titlebar } from './components/titlebar'
import { Sidebar } from './components/sidebar'
import { MainContent } from './components/main-content'
import { AppProvider, UIProvider } from './context'

function App(): React.JSX.Element {
  return (
    <AppProvider>
      <UIProvider>
        <Flex direction="column" h="100vh">
          <Titlebar />
          <Flex flex="1" overflow="hidden">
            <Sidebar />
            <MainContent>
              <Text color="fg.muted">Main content goes here</Text>
            </MainContent>
          </Flex>
        </Flex>
      </UIProvider>
    </AppProvider>
  )
}

export default App
