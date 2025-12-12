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
      borderColor="whiteAlpha.100"
      p={isCollapsed ? '0' : '4'}
      overflow="hidden"
      transition="all 0.2s"
      display="flex"
      flexDirection="column"
    >
      <VStack align="stretch" gap="2" flex="1" minH="0">
        <Text fontSize="sm" color="fg.muted" fontWeight="medium" px="2">
          Images
        </Text>
        <Box flex="1" overflowY="auto" overflowX="hidden">
          <FileBrowser />
        </Box>
      </VStack>
    </Box>
  )
}

export default Sidebar
