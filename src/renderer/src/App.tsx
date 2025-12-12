import { Flex, Text } from '@chakra-ui/react'
import Titlebar from './components/Titlebar'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'

function App(): React.JSX.Element {
  return (
    <Flex direction="column" h="100vh">
      <Titlebar />
      <Flex flex="1" overflow="hidden">
        <Sidebar />
        <MainContent>
          <Text color="fg.muted">Main content goes here</Text>
        </MainContent>
      </Flex>
    </Flex>
  )
}

export default App
