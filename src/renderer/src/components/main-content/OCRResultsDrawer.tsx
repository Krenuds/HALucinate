import {
  Box,
  VStack,
  HStack,
  Text,
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
          <Drawer.Content borderRadius="none" borderLeft="1px solid" borderColor="whiteAlpha.300">
            <Drawer.Header borderBottomWidth="1px" borderColor="whiteAlpha.300" py="2">
              <HStack justify="space-between" flex="1">
                <Drawer.Title fontFamily="mono" fontSize="sm" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
                  OCR Results
                </Drawer.Title>
                <Clipboard.Root value={totalText}>
                  <Clipboard.Trigger asChild>
                    <Button
                      size="xs"
                      variant="outline"
                      colorPalette="gray"
                      fontFamily="mono"
                      borderRadius="none"
                      textTransform="uppercase"
                    >
                      <Clipboard.Indicator copied={<LuCheck />}>
                        <LuCopy />
                      </Clipboard.Indicator>
                      Copy All
                    </Button>
                  </Clipboard.Trigger>
                </Clipboard.Root>
              </HStack>
            </Drawer.Header>

            <Drawer.Body py="2" px="3">
              <VStack gap="2" align="stretch">
                {results.map((result) => (
                  <Box
                    key={result.path}
                    p="2"
                    bg="transparent"
                    rounded="none"
                    borderWidth="1px"
                    borderColor="whiteAlpha.300"
                  >
                    <HStack justify="space-between" mb="1">
                      <Text fontFamily="mono" fontSize="xs" fontWeight="medium" truncate maxW="200px">
                        {result.path.split(/[/\\]/).pop()}
                      </Text>
                      <HStack gap="1">
                        {result.error ? (
                          <Text fontFamily="mono" fontSize="xs" color="red.400">[ERR]</Text>
                        ) : (
                          <Text fontFamily="mono" fontSize="xs" color="fg.muted">[{Math.round(result.confidence)}%]</Text>
                        )}
                        <Clipboard.Root value={result.text}>
                          <Clipboard.Trigger asChild>
                            <IconButton size="xs" variant="ghost" rounded="none">
                              <Clipboard.Indicator copied={<LuCheck />}>
                                <LuCopy />
                              </Clipboard.Indicator>
                            </IconButton>
                          </Clipboard.Trigger>
                        </Clipboard.Root>
                      </HStack>
                    </HStack>

                    {result.error ? (
                      <Text fontFamily="mono" fontSize="xs" color="red.400">
                        {result.error}
                      </Text>
                    ) : (
                      <Code
                        display="block"
                        whiteSpace="pre-wrap"
                        p="2"
                        fontFamily="mono"
                        fontSize="xs"
                        bg="blackAlpha.500"
                        borderRadius="none"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        maxH="200px"
                        overflow="auto"
                        userSelect="text"
                        cursor="text"
                      >
                        {result.text || '-- no text --'}
                      </Code>
                    )}
                  </Box>
                ))}
              </VStack>
            </Drawer.Body>

            <Drawer.Footer borderTopWidth="1px" borderColor="whiteAlpha.300" py="2">
              <Text fontFamily="mono" fontSize="xs" color="fg.muted">
                [{results.length}] processed
              </Text>
            </Drawer.Footer>

            <Drawer.CloseTrigger asChild>
              <CloseButton size="xs" rounded="none" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}

export default OCRResultsDrawer
