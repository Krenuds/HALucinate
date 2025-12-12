import { Box, Button, Container, VStack } from '@chakra-ui/react'
import Titlebar from './components/Titlebar'

function App(): React.JSX.Element {
  // IPC example - sends 'ping' to main process
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Box minH="100vh">
      <Titlebar />
      <Container centerContent pt="14" pb="6">
        <VStack gap="6">
          <Button colorPalette="teal" onClick={ipcHandle}>
            Send IPC
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

export default App
