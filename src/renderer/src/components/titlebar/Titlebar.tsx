import { HStack, Heading, IconButton, Spacer, Box } from '@chakra-ui/react'
import { VscChromeMinimize, VscChromeMaximize, VscChromeClose } from 'react-icons/vsc'

interface TitlebarProps {
  title?: string
}

function Titlebar({ title = 'Mr. Parsypants' }: TitlebarProps): React.JSX.Element {

  const handleMinimize = (): void => window.api.windowMinimize()
  const handleMaximize = (): void => window.api.windowMaximize()
  const handleClose = (): void => window.api.windowClose()

  return (
    <Box
      as="header"
      flexShrink={0}
      bg="transparent"
      css={{ WebkitAppRegion: 'drag' }}
    >
      <HStack h="10" px="4">
        <Heading size="sm" fontWeight="semibold">
          {title}
        </Heading>
        <Spacer />
        <HStack gap="0" css={{ WebkitAppRegion: 'no-drag' }}>
          <IconButton
            aria-label="Minimize"
            variant="ghost"
            size="sm"
            rounded="none"
            bg="transparent"
            onClick={handleMinimize}
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            <VscChromeMinimize />
          </IconButton>
          <IconButton
            aria-label="Maximize"
            variant="ghost"
            size="sm"
            rounded="none"
            bg="transparent"
            onClick={handleMaximize}
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            <VscChromeMaximize />
          </IconButton>
          <IconButton
            aria-label="Close"
            variant="ghost"
            size="sm"
            rounded="none"
            bg="transparent"
            onClick={handleClose}
            _hover={{ bg: 'red.600', color: 'white' }}
          >
            <VscChromeClose />
          </IconButton>
        </HStack>
      </HStack>
    </Box>
  )
}

export default Titlebar
