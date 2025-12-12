import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react'
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
        <VStack gap="4" textAlign="center" maxW="400px" px="4">
          <VStack gap="1">
            <Text fontFamily="mono" fontSize="xl" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
              Welcome
            </Text>
            <Text fontFamily="mono" fontSize="xs" color="fg.muted">
              select project folder to continue
            </Text>
          </VStack>

          <Button
            size="sm"
            variant="outline"
            colorPalette="gray"
            fontFamily="mono"
            borderRadius="none"
            textTransform="uppercase"
            letterSpacing="wide"
            onClick={handleSelectFolder}
          >
            <LuFolderOpen />
            Select Folder
          </Button>
        </VStack>
      </Box>
    </Flex>
  )
}

export default LoginPage
