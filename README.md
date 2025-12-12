# Mr. Parsyface

A desktop app for extracting text from images using OCR. Built for screenshot workflows.

**Version 0.1.0**

## Features

- **Image Browser** - Point to a folder and see all images sorted by date. Hover for instant previews.
- **Real-time Updates** - New screenshots appear automatically. Works great with ShareX, Greenshot, or any screenshot tool.
- **Multi-select** - Click, Ctrl+click, or Shift+click to select multiple images.
- **OCR Extraction** - Extract text from selected images using Tesseract.js. Copy results to clipboard.
- **Dark UI** - Custom frameless window with a seamless dark theme.

## Screenshots

*Coming soon*

## Installation

### From Release

Download the installer for your platform from the [Releases](../../releases) page.

### From Source

```bash
# Clone the repository
git clone https://github.com/your-username/mr-parsyface.git
cd mr-parsyface

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for your platform
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## Usage

1. **Select a folder** - On first launch, pick the folder containing your images (e.g., your Screenshots folder).
2. **Browse images** - Images appear in the sidebar sorted by date. Hover to preview.
3. **Select images** - Click to select one image, or use Ctrl/Shift+click for multiple.
4. **Run OCR** - Click "Run OCR" to extract text from selected images.
5. **Copy results** - Results appear in a drawer. Click the copy button next to any result.

To change your folder later, click the folder icon in the titlebar.

## Supported Formats

PNG, JPG, JPEG, WebP, GIF, BMP, TIFF

## Tech Stack

- [Electron](https://www.electronjs.org/) - Desktop framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Chakra UI v3](https://chakra-ui.com/) - Component library
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR engine
- [electron-vite](https://electron-vite.org/) - Build tooling
- [chokidar](https://github.com/paulmillr/chokidar) - File watching

## Known Limitations

- OCR processes images sequentially (CPU-only)
- English language only for OCR
- Single folder depth scanning (folder + immediate subfolders)

## Roadmap

- [ ] Parallel OCR processing
- [ ] Language selection for OCR
- [ ] Export to different formats (PDF, hOCR)
- [ ] Batch operations
- [ ] Search/filter images

## Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Formatting
npm run format
```

## License

MIT

## Acknowledgments

Built with [Claude Code](https://claude.ai/code).
