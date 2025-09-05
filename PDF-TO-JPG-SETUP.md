# PDF to JPG Conversion Setup

This application now uses server-side PDF to image conversion using `pdf2pic` for better reliability and quality.

## Prerequisites

The `pdf2pic` library requires the following system dependencies:

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y graphicsmagick ghostscript
```

### CentOS/RHEL
```bash
sudo yum install -y GraphicsMagick ghostscript
```

### macOS
```bash
brew install graphicsmagick ghostscript
```

### Windows
Download and install:
- [GraphicsMagick](https://www.graphicsmagick.org/download.html)
- [Ghostscript](https://www.ghostscript.com/download/gsdnld.html)

## Quick Setup

Run the setup script:
```bash
./setup-pdf2pic.sh
```

## How It Works

1. **Client Side**: User uploads PDF file through the web interface
2. **Server Side**: PDF is processed using `pdf2pic` with 300 DPI quality
3. **Response**: Server returns base64-encoded JPEG images
4. **Client Side**: Images are converted to Blobs and displayed for download

## Benefits

- ✅ **No browser compatibility issues** - Server-side processing
- ✅ **High quality** - 300 DPI output
- ✅ **Reliable** - No worker setup problems
- ✅ **Fast** - Optimized server processing
- ✅ **Clean** - No complex client-side PDF.js setup

## API Endpoint

The conversion happens at `/api/pdf-to-jpg` which:
- Accepts multipart/form-data with PDF file
- Returns JSON with base64-encoded images
- Handles cleanup of temporary files
- Provides proper error handling

## Troubleshooting

If you encounter issues:

1. **Check dependencies**: Ensure GraphicsMagick and Ghostscript are installed
2. **Check permissions**: Ensure the server can write to `/tmp` directory
3. **Check logs**: Look at server console for error messages
4. **Test manually**: Try converting a simple PDF first

## Configuration

You can modify the conversion settings in `/src/app/api/pdf-to-jpg/route.ts`:

```typescript
const convert = fromBuffer(pdfBuffer, {
  density: 300,        // DPI (higher = better quality, larger files)
  saveFilename: 'page', // Output filename pattern
  savePath: tempDir,   // Temporary directory
  format: 'jpeg',      // Output format
  width: 2000,         // Max width
  height: 2000,        // Max height
  quality: 95          // JPEG quality (1-100)
});
```
