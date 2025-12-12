import { Box, Flex, Text, Grid, Image, HStack, Button } from '@chakra-ui/react'
import { LuScanText } from 'react-icons/lu'
import { useMainContent } from './useMainContent'
import OCRResultsDrawer from './OCRResultsDrawer'

function getLocalImageUrl(filePath: string): string {
  return `local-image://local/${encodeURIComponent(filePath).replace(/%2F/g, '/').replace(/%3A/g, ':')}`
}

function MainContent(): React.JSX.Element {
  const { folderName, isLoading, selectedImages, ocr, handleRunOCR, handleCancelOCR, setOCRDrawerOpen } =
    useMainContent()

  return (
    <Flex direction="column" flex="1" h="100%" overflow="hidden">
      {/* Content Header */}
      <Box as="header" px="6" py="3" borderBottomWidth="1px" borderColor="whiteAlpha.100">
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            {folderName || 'No folder selected'}
          </Text>
          <Button
            size="sm"
            variant="outline"
            disabled={selectedImages.length === 0 || ocr.isRunning}
            loading={ocr.isRunning}
            loadingText="Running..."
            onClick={handleRunOCR}
          >
            <LuScanText />
            Run OCR
          </Button>
        </HStack>
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
      <Box as="footer" px="6" py="3" borderTopWidth="1px" borderColor="whiteAlpha.100">
        <HStack justify="space-between">
          <Text fontSize="sm" color="fg.muted">
            {selectedImages.length > 0
              ? `${selectedImages.length} image${selectedImages.length !== 1 ? 's' : ''} selected`
              : 'No selection'}
          </Text>

          {ocr.isRunning && (
            <HStack gap="2">
              <Text fontSize="sm" color="fg.muted">
                Processing {ocr.progress.currentIndex + 1} of {ocr.progress.totalImages}...
              </Text>
              <Button size="xs" variant="ghost" colorPalette="red" onClick={handleCancelOCR}>
                Cancel
              </Button>
            </HStack>
          )}

          {ocr.results.length > 0 && !ocr.isRunning && (
            <Button size="xs" variant="ghost" onClick={() => setOCRDrawerOpen(true)}>
              View Results ({ocr.results.length})
            </Button>
          )}
        </HStack>
      </Box>

      {/* OCR Results Drawer */}
      <OCRResultsDrawer
        open={ocr.drawerOpen}
        onOpenChange={setOCRDrawerOpen}
        results={ocr.results}
      />
    </Flex>
  )
}

export default MainContent
