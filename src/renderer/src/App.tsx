import { Button, Container, Heading, VStack } from '@chakra-ui/react'
import { ColorModeButton } from './components/ui/color-mode'

function App(): React.JSX.Element {
  // IPC example - sends 'ping' to main process
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Container centerContent py="10">
      <VStack gap="6">
        <Heading size="3xl">Mr. Parsypants</Heading>
        <Button colorPalette="teal" onClick={ipcHandle}>
          Send IPC
        </Button>
        <ColorModeButton />
      </VStack>
    </Container>
  )
}

export default App
