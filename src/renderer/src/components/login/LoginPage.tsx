import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { LuFolderOpen } from 'react-icons/lu'
import { Titlebar } from '../titlebar'

interface LoginPageProps {
  onFolderSelected: (path: string) => void
}

function LoginPage({ onFolderSelected }: LoginPageProps): React.JSX.Element {
  const handleSelectFolder = async (): Promise<void> => {
    const folderPath = await window.api.selectProjectFolder()
    if (folderPath) {
      onFolderSelected(folderPath)
    }
  }

  return (
    <Flex direction="column" h="100vh">
      <Titlebar />
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="bg"
      >
        <VStack gap="6" textAlign="center" maxW="400px" px="4">
          <VStack gap="2">
            <Heading size="2xl">Welcome</Heading>
            <Text color="fg.muted">
              To get started, please select your project folder.
            </Text>
          </VStack>

          <Button size="lg" colorPalette="blue" onClick={handleSelectFolder}>
            <LuFolderOpen />
            Select Folder
          </Button>
        </VStack>
      </Box>
    </Flex>
  )
}

export default LoginPage
