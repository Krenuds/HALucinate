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
      <Box as="header" px="3" py="2" borderBottomWidth="1px" borderColor="whiteAlpha.300">
        <HStack justify="space-between">
          <Text fontFamily="mono" fontSize="sm" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
            {folderName || '-- no folder --'}
          </Text>
          <Button
            size="xs"
            variant="outline"
            colorPalette="gray"
            fontFamily="mono"
            borderRadius="none"
            textTransform="uppercase"
            letterSpacing="wide"
            disabled={selectedImages.length === 0 || ocr.isRunning}
            loading={ocr.isRunning}
            loadingText="..."
            onClick={handleRunOCR}
          >
            <LuScanText />
            Extract
          </Button>
        </HStack>
      </Box>

      {/* Main Content Area */}
      <Box flex="1" overflow="auto" p="3">
        {isLoading ? (
          <Text fontFamily="mono" fontSize="xs" color="fg.muted">loading...</Text>
        ) : selectedImages.length === 0 ? (
          <Flex h="100%" align="center" justify="center">
            <Text fontFamily="mono" fontSize="xs" color="fg.muted">-- select images from sidebar --</Text>
          </Flex>
        ) : (
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap="2"
          >
            {selectedImages.map((image) => (
              <Box
                key={image.path}
                bg="black"
                rounded="none"
                overflow="hidden"
                border="1px solid"
                borderColor="whiteAlpha.300"
                _hover={{ borderColor: 'whiteAlpha.500' }}
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
      <Box as="footer" px="3" py="2" borderTopWidth="1px" borderColor="whiteAlpha.300">
        <HStack justify="space-between">
          <Text fontFamily="mono" fontSize="xs" color="fg.muted">
            {selectedImages.length > 0
              ? `[${selectedImages.length}] selected`
              : '-- none --'}
          </Text>

          {ocr.isRunning && (
            <HStack gap="2">
              <Text fontFamily="mono" fontSize="xs" color="fg.muted">
                [{ocr.progress.currentIndex + 1}/{ocr.progress.totalImages}]
              </Text>
              <Button
                size="xs"
                variant="outline"
                colorPalette="gray"
                fontFamily="mono"
                borderRadius="none"
                textTransform="uppercase"
                onClick={handleCancelOCR}
              >
                Cancel
              </Button>
            </HStack>
          )}

          {ocr.results.length > 0 && !ocr.isRunning && (
            <Button
              size="xs"
              variant="outline"
              colorPalette="gray"
              fontFamily="mono"
              borderRadius="none"
              textTransform="uppercase"
              onClick={() => setOCRDrawerOpen(true)}
            >
              Results [{ocr.results.length}]
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
