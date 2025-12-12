import { Box, VStack, Text } from '@chakra-ui/react'

function Sidebar(): React.JSX.Element {
  return (
    <Box
      as="aside"
      w="200px"
      minW="200px"
      h="100%"
      borderRightWidth="1px"
      borderColor="whiteAlpha.100"
      p="4"
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
