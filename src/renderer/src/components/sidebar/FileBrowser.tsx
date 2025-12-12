import { useState, useEffect, useMemo } from 'react'
import { Box, Text, HStack, Spinner, Image, Listbox, createListCollection } from '@chakra-ui/react'
import { Tooltip } from '../ui/tooltip'
import type { ImageFile } from '../../../../preload/index.d'

function getLocalImageUrl(filePath: string): string {
  // Convert local file path to custom protocol URL
  // Format: local-image://local/C:/path/to/file.png
  return `local-image://local/${encodeURIComponent(filePath).replace(/%2F/g, '/').replace(/%3A/g, ':')}`
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

  if (isToday) {
    return `Today ${timeStr}`
  } else if (isYesterday) {
    return `Yesterday ${timeStr}`
  } else {
    const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    return `${dateStr} ${timeStr}`
  }
}

function extractPrefix(filename: string): string | null {
  const underscoreIndex = filename.indexOf('_')
  if (underscoreIndex > 0) {
    const prefix = filename.slice(0, underscoreIndex)
    return prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase()
  }
  return null
}

function FileBrowser(): React.JSX.Element {
  const [images, setImages] = useState<ImageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPaths, setSelectedPaths] = useState<string[]>([])

  const loadImages = async (): Promise<void> => {
    try {
      const result = await window.api.scanImages()
      setImages(result)
    } catch (error) {
      console.error('Failed to scan images:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadImages()
  }, [])

  // Subscribe to file changes
  useEffect(() => {
    const unsubscribe = window.api.onFilesChanged(() => {
      loadImages()
    })
    return unsubscribe
  }, [])

  // Create collection from images
  const collection = useMemo(
    () =>
      createListCollection({
        items: images,
        itemToValue: (item) => item.path,
        itemToString: (item) => item.name
      }),
    [images]
  )

  if (loading) {
    return (
      <Box py="4" textAlign="center">
        <Spinner size="sm" color="fg.muted" />
      </Box>
    )
  }

  if (images.length === 0) {
    return (
      <Box py="4">
        <Text fontSize="xs" color="fg.muted" textAlign="center">
          No images found
        </Text>
      </Box>
    )
  }

  return (
    <Listbox.Root
      collection={collection}
      selectionMode="extended"
      value={selectedPaths}
      onValueChange={(details) => setSelectedPaths(details.value)}
      height="100%"
    >
      <Listbox.Content
        border="0"
        bg="transparent"
        p="0"
        gap="0"
        height="auto"
        maxH="none"
        overflowX="hidden"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.3)'
          }
        }}
      >
        {images.map((image) => {
          const prefix = extractPrefix(image.name)
          const imageUrl = getLocalImageUrl(image.path)
          return (
            <Tooltip
              key={image.path}
              openDelay={100}
              closeDelay={0}
              positioning={{ placement: 'right', gutter: 8 }}
              content={
                <Box p="1">
                  <Image
                    src={imageUrl}
                    alt={image.name}
                    maxW="600px"
                    maxH="400px"
                    objectFit="contain"
                    rounded="md"
                  />
                </Box>
              }
              contentProps={{
                css: {
                  bg: 'transparent',
                  boxShadow: 'lg',
                  p: 0
                }
              }}
            >
              <Listbox.Item
                item={image}
                py="1"
                px="2"
                rounded="sm"
                cursor="pointer"
                _hover={{ bg: 'whiteAlpha.100' }}
                _selected={{ bg: 'blue.900/50' }}
              >
                <HStack gap="1.5" flex="1">
                  <Text fontSize="sm" color="fg" truncate title={image.name}>
                    {formatTimestamp(image.modifiedAt)}
                  </Text>
                  {prefix && (
                    <>
                      <Text fontSize="sm" color="fg.muted">|</Text>
                      <Text fontSize="sm" color="fg.muted" truncate>
                        {prefix}
                      </Text>
                    </>
                  )}
                </HStack>
              </Listbox.Item>
            </Tooltip>
          )
        })}
      </Listbox.Content>
    </Listbox.Root>
  )
}

export default FileBrowser
