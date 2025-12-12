import { Box, Flex, Text } from '@chakra-ui/react'
import { useMainContent } from './useMainContent'

interface MainContentProps {
  children?: React.ReactNode
}

function MainContent({ children }: MainContentProps): React.JSX.Element {
  const { title, isLoading } = useMainContent()

  return (
    <Flex direction="column" flex="1" h="100%" overflow="hidden">
      {/* Content Header */}
      <Box
        as="header"
        px="6"
        py="3"
        borderBottomWidth="1px"
        borderColor="whiteAlpha.100"
      >
        <Text fontSize="lg" fontWeight="semibold">
          {title}
        </Text>
      </Box>

      {/* Main Content Area */}
      <Box flex="1" overflow="auto" p="6">
        {isLoading ? <Text color="fg.muted">Loading...</Text> : children}
      </Box>

      {/* Content Footer */}
      <Box
        as="footer"
        px="6"
        py="3"
        borderTopWidth="1px"
        borderColor="whiteAlpha.100"
      >
        <Text fontSize="sm" color="fg.muted">
          Footer
        </Text>
      </Box>
    </Flex>
  )
}

export default MainContent
