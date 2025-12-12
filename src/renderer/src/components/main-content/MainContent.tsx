import { Box, Flex, Text, Grid, Image } from '@chakra-ui/react'
import { useMainContent } from './useMainContent'

function getLocalImageUrl(filePath: string): string {
  return `local-image://local/${encodeURIComponent(filePath).replace(/%2F/g, '/').replace(/%3A/g, ':')}`
}

function MainContent(): React.JSX.Element {
  const { title, isLoading, selectedImages } = useMainContent()

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
      <Box flex="1" overflow="auto" p="4">
        {isLoading ? (
          <Text color="fg.muted">Loading...</Text>
        ) : selectedImages.length === 0 ? (
          <Flex h="100%" align="center" justify="center">
            <Text color="fg.muted">Select images from the sidebar</Text>
          </Flex>
        ) : (
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap="4"
          >
            {selectedImages.map((image) => (
              <Box
                key={image.path}
                bg="whiteAlpha.50"
                rounded="md"
                overflow="hidden"
                _hover={{ bg: 'whiteAlpha.100' }}
                aspectRatio={4 / 3}
                position="relative"
              >
                <Image
                  src={getLocalImageUrl(image.path)}
                  alt={image.name}
                  position="absolute"
                  inset="0"
                  w="100%"
                  h="100%"
                  objectFit="contain"
                  bg="black"
                />
              </Box>
            ))}
          </Grid>
        )}
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
          {selectedImages.length > 0
            ? `${selectedImages.length} image${selectedImages.length !== 1 ? 's' : ''} selected`
            : 'No selection'}
        </Text>
      </Box>
    </Flex>
  )
}

export default MainContent
