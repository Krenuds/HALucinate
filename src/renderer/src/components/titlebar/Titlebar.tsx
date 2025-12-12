import { HStack, Text, IconButton, Spacer, Box } from '@chakra-ui/react'
import { VscChromeMinimize, VscChromeMaximize, VscChromeClose, VscFolderOpened } from 'react-icons/vsc'
import { Tooltip } from '@renderer/components/ui/tooltip'

interface TitlebarProps {
  onChangeFolder?: () => void
}

function Titlebar({ onChangeFolder }: TitlebarProps): React.JSX.Element {
  const handleMinimize = (): void => window.api.windowMinimize()
  const handleMaximize = (): void => window.api.windowMaximize()
  const handleClose = (): void => window.api.windowClose()

  return (
    <Box
      as="header"
      flexShrink={0}
      w="100%"
      bg="bg"
      borderBottomWidth="1px"
      borderColor="whiteAlpha.300"
      position="relative"
      zIndex="banner"
      css={{ WebkitAppRegion: 'drag' }}
    >
      <HStack h="8" pl="3" pr="0" gap="0">
        <Text fontFamily="mono" fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
          Mr. Parsyface
        </Text>
        <Spacer />

        {/* Folder button - only show if handler provided */}
        {onChangeFolder && (
          <HStack gap="0" mr="1" css={{ WebkitAppRegion: 'no-drag' }}>
            <Tooltip content="Change project folder" positioning={{ placement: 'bottom' }}>
              <IconButton
                aria-label="Change project folder"
                variant="ghost"
                size="xs"
                rounded="none"
                bg="transparent"
                color="fg.muted"
                onClick={onChangeFolder}
                _hover={{ bg: 'whiteAlpha.300', color: 'fg' }}
              >
                <VscFolderOpened />
              </IconButton>
            </Tooltip>
          </HStack>
        )}

        {/* Window controls - flush to right edge */}
        <HStack gap="0" css={{ WebkitAppRegion: 'no-drag' }}>
          <IconButton
            aria-label="Minimize"
            variant="ghost"
            size="xs"
            w="10"
            h="8"
            rounded="none"
            bg="transparent"
            color="fg.muted"
            onClick={handleMinimize}
            _hover={{ bg: 'whiteAlpha.300', color: 'fg' }}
          >
            <VscChromeMinimize />
          </IconButton>
          <IconButton
            aria-label="Maximize"
            variant="ghost"
            size="xs"
            w="10"
            h="8"
            rounded="none"
            bg="transparent"
            color="fg.muted"
            onClick={handleMaximize}
            _hover={{ bg: 'whiteAlpha.300', color: 'fg' }}
          >
            <VscChromeMaximize />
          </IconButton>
          <IconButton
            aria-label="Close"
            variant="ghost"
            size="xs"
            w="10"
            h="8"
            rounded="none"
            bg="transparent"
            color="fg.muted"
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
