import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Code,
  Button,
  IconButton,
  Drawer,
  Portal,
  CloseButton,
  Clipboard
} from '@chakra-ui/react'
import { LuCopy, LuCheck } from 'react-icons/lu'
import type { OCRResult } from '@renderer/types'

interface OCRResultsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  results: OCRResult[]
}

function OCRResultsDrawer({ open, onOpenChange, results }: OCRResultsDrawerProps): React.JSX.Element {
  const totalText = results.map((r) => r.text).join('\n\n---\n\n')

  return (
    <Drawer.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} placement="end" size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <HStack justify="space-between" flex="1">
                <Drawer.Title>OCR Results</Drawer.Title>
                <Clipboard.Root value={totalText}>
                  <Clipboard.Trigger asChild>
                    <Button size="sm" variant="outline">
                      <Clipboard.Indicator copied={<LuCheck />}>
                        <LuCopy />
                      </Clipboard.Indicator>
                      Copy All
                    </Button>
                  </Clipboard.Trigger>
                </Clipboard.Root>
              </HStack>
            </Drawer.Header>

            <Drawer.Body>
              <VStack gap="4" align="stretch">
                {results.map((result) => (
                  <Box
                    key={result.path}
                    p="3"
                    bg="whiteAlpha.50"
                    rounded="md"
                    borderWidth="1px"
                    borderColor="whiteAlpha.100"
                  >
                    <HStack justify="space-between" mb="2">
                      <Text fontSize="sm" fontWeight="medium" truncate maxW="200px">
                        {result.path.split(/[/\\]/).pop()}
                      </Text>
                      <HStack gap="2">
                        {result.error ? (
                          <Badge colorPalette="red">Error</Badge>
                        ) : (
                          <Badge colorPalette="green">{Math.round(result.confidence)}%</Badge>
                        )}
                        <Clipboard.Root value={result.text}>
                          <Clipboard.Trigger asChild>
                            <IconButton size="xs" variant="ghost">
                              <Clipboard.Indicator copied={<LuCheck />}>
                                <LuCopy />
                              </Clipboard.Indicator>
                            </IconButton>
                          </Clipboard.Trigger>
                        </Clipboard.Root>
                      </HStack>
                    </HStack>

                    {result.error ? (
                      <Text fontSize="sm" color="red.400">
                        {result.error}
                      </Text>
                    ) : (
                      <Code
                        display="block"
                        whiteSpace="pre-wrap"
                        p="2"
                        fontSize="xs"
                        bg="blackAlpha.300"
                        maxH="200px"
                        overflow="auto"
                      >
                        {result.text || '(No text detected)'}
                      </Code>
                    )}
                  </Box>
                ))}
              </VStack>
            </Drawer.Body>

            <Drawer.Footer>
              <Text fontSize="sm" color="fg.muted">
                {results.length} image{results.length !== 1 ? 's' : ''} processed
              </Text>
            </Drawer.Footer>

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}

export default OCRResultsDrawer
