import {
  Box,
  VStack,
  HStack,
  Text,
  Code,
  Button,
  IconButton,
  Flex,
  Clipboard
} from '@chakra-ui/react'
import { LuCopy, LuCheck } from 'react-icons/lu'
import type { OCRResult } from '@renderer/types'

interface OCRFlyoutPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  results: OCRResult[]
}

function OCRFlyoutPanel({ open, onOpenChange, results }: OCRFlyoutPanelProps): React.JSX.Element {
  const totalText = results.map((r) => r.text).join('\n\n---\n\n')
  const hasResults = results.length > 0

  const handleTabClick = (): void => {
    if (hasResults) {
      onOpenChange(!open)
    }
  }

  return (
    <Flex
      position="absolute"
      right="0"
      top="0"
      bottom="0"
      zIndex="overlay"
      pointerEvents="none"
    >
      {/* Tab handle (always visible) */}
      <Flex
        as="button"
        direction="column"
        align="center"
        justify="center"
        w="24px"
        h="80px"
        mt="16"
        bg={open ? 'gray.700' : 'gray.800'}
        borderWidth="1px"
        borderRightWidth="0"
        borderColor="whiteAlpha.300"
        cursor={hasResults ? 'pointer' : 'not-allowed'}
        opacity={hasResults ? 1 : 0.4}
        pointerEvents="auto"
        transition="all 0.15s"
        _hover={hasResults ? { bg: 'gray.600' } : {}}
        onClick={handleTabClick}
        aria-label={open ? 'Close OCR results' : 'Open OCR results'}
        aria-disabled={!hasResults}
      >
        <Text
          fontFamily="mono"
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          letterSpacing="wider"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed'
          }}
        >
          OCR
        </Text>
        {hasResults && (
          <Text
            fontFamily="mono"
            fontSize="10px"
            color="fg.muted"
            mt="1"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed'
            }}
          >
            [{results.length}]
          </Text>
        )}
      </Flex>

      {/* Panel (collapsible) */}
      <Flex
        direction="column"
        w={open ? '320px' : '0px'}
        transition="width 0.2s ease-in-out"
        overflow="hidden"
        bg="bg"
        borderLeftWidth={open ? '1px' : '0'}
        borderColor="whiteAlpha.300"
        pointerEvents="auto"
      >
        {/* Inner container to prevent content squishing */}
        <Flex direction="column" w="320px" h="100%">
          {/* Header */}
          <Box
            px="3"
            py="1.5"
            borderBottomWidth="1px"
            borderColor="whiteAlpha.300"
          >
            <Text
              fontFamily="mono"
              fontSize="sm"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              OCR Results
            </Text>
          </Box>

          {/* Body */}
          <Box flex="1" overflow="auto" py="2" px="3">
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
          </Box>

          {/* Footer */}
          <HStack
            px="3"
            py="2"
            borderTopWidth="1px"
            borderColor="whiteAlpha.300"
            justify="space-between"
          >
            <Text fontFamily="mono" fontSize="xs" color="fg.muted">
              [{results.length}] processed
            </Text>
            <Clipboard.Root value={totalText}>
              <Clipboard.Trigger asChild>
                <Button
                  size="xs"
                  variant="outline"
                  colorPalette="gray"
                  fontFamily="mono"
                  borderRadius="none"
                  textTransform="uppercase"
                  disabled={!hasResults}
                >
                  <Clipboard.Indicator copied={<LuCheck />}>
                    <LuCopy />
                  </Clipboard.Indicator>
                  Copy All
                </Button>
              </Clipboard.Trigger>
            </Clipboard.Root>
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default OCRFlyoutPanel
