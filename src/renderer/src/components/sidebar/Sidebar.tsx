import { Box, VStack, Text } from '@chakra-ui/react'
import { useSidebar } from './useSidebar'

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
    >
      <VStack align="stretch" gap="2">
        <Text fontSize="sm" color="fg.muted" fontWeight="medium" px="2">
          Navigation
        </Text>
        {/* Sidebar content will go here */}
      </VStack>
    </Box>
  )
}

export default Sidebar
