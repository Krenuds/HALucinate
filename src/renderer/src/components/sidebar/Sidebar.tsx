import { Box, VStack, Text } from '@chakra-ui/react'
import { useSidebar } from './useSidebar'
import FileBrowser from './FileBrowser'

function Sidebar(): React.JSX.Element {
  const { isCollapsed, width } = useSidebar()

  return (
    <Box
      as="aside"
      w={isCollapsed ? '0px' : `${width}px`}
      minW={isCollapsed ? '0px' : `${width}px`}
      h="100%"
      borderRightWidth={isCollapsed ? '0' : '1px'}
      borderColor="whiteAlpha.300"
      p={isCollapsed ? '0' : '2'}
      overflow="hidden"
      transition="all 0.2s"
      display="flex"
      flexDirection="column"
    >
      <VStack align="stretch" gap="1" flex="1" minH="0">
        <Text
          fontFamily="mono"
          fontSize="xs"
          color="fg.muted"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wider"
          px="1"
          py="1"
        >
          Images
        </Text>
        <Box
          flex="1"
          overflowY="auto"
          overflowX="hidden"
          css={{
            '&::-webkit-scrollbar': {
              width: '6px'
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.05)'
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '0'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(255, 255, 255, 0.5)'
            }
          }}
        >
          <FileBrowser />
        </Box>
      </VStack>
    </Box>
  )
}

export default Sidebar
