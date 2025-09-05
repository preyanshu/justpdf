'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, Image as ImageIcon, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPdf, setProcessedPdf] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setProcessedPdf(null);
  };

  const convertImagesToPdf = async () => {
    if (files.length === 0) {
      setError('Please select at least one image file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const imageBytes = new Uint8Array(arrayBuffer);
        
        let image;
        const fileType = file.type.toLowerCase();
        
        if (fileType.includes('png')) {
          image = await pdfDoc.embedPng(imageBytes);
        } else if (fileType.includes('jpg') || fileType.includes('jpeg')) {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          // Convert other formats to PNG using canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0);
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to convert image'));
                }
              }, 'image/png');
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
          });
          
          const pngBlob = await new Promise<Blob>((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0);
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to convert image'));
                }
              }, 'image/png');
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
          });
          
          const pngArrayBuffer = await pngBlob.arrayBuffer();
          const pngBytes = new Uint8Array(pngArrayBuffer);
          image = await pdfDoc.embedPng(pngBytes);
        }

        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const imageSize = image.scale(1);
        
        // Calculate scaling to fit image on page
        const scaleX = width / imageSize.width;
        const scaleY = height / imageSize.height;
        const scale = Math.min(scaleX, scaleY);
        
        const scaledWidth = imageSize.width * scale;
        const scaledHeight = imageSize.height * scale;
        
        // Center the image on the page
        const x = (width - scaledWidth) / 2;
        const y = (height - scaledHeight) / 2;
        
        page.drawImage(image, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedPdf(pdfBlob);
    } catch (err) {
      setError('Failed to convert images to PDF. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (processedPdf) {
      saveAs(processedPdf, 'converted-images.pdf');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Image to PDF</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Convert Images to PDF
          </h1>
          <p className="text-xl text-gray-600">
            Upload your images and convert them to a single PDF document
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
              }}
              multiple={true}
              maxFiles={20}
              maxSize={10 * 1024 * 1024} // 10MB
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={convertImagesToPdf}
              disabled={files.length === 0 || isProcessing}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Converting...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Convert to PDF
                </>
              )}
            </button>

            {processedPdf && (
              <button
                onClick={downloadPdf}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </button>
            )}
          </div>

          {processedPdf && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-700">
                ✅ Successfully converted {files.length} image(s) to PDF!
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Formats</h3>
            <p className="text-gray-600">Supports PNG, JPG, JPEG, GIF, BMP, and WebP</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Batch Processing</h3>
            <p className="text-gray-600">Convert up to 20 images at once</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Download</h3>
            <p className="text-gray-600">Get your PDF immediately after conversion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
