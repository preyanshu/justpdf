#!/bin/bash

echo "Setting up pdf2pic dependencies..."

# Check if we're on Ubuntu/Debian
if command -v apt-get &> /dev/null; then
    echo "Installing GraphicsMagick and Ghostscript on Ubuntu/Debian..."
    sudo apt-get update
    sudo apt-get install -y graphicsmagick ghostscript
elif command -v yum &> /dev/null; then
    echo "Installing GraphicsMagick and Ghostscript on CentOS/RHEL..."
    sudo yum install -y GraphicsMagick ghostscript
elif command -v brew &> /dev/null; then
    echo "Installing GraphicsMagick and Ghostscript on macOS..."
    brew install graphicsmagick ghostscript
else
    echo "Please install GraphicsMagick and Ghostscript manually for your system:"
    echo "- GraphicsMagick: https://www.graphicsmagick.org/download.html"
    echo "- Ghostscript: https://www.ghostscript.com/download/gsdnld.html"
fi

echo "Setup complete! You can now use pdf2pic for PDF to image conversion."
