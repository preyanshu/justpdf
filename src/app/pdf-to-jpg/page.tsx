'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, Image, FileText } from 'lucide-react';
import Link from 'next/link';
// PDF.js will be imported dynamically to avoid SSR issues

export default function PdfToJpgPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedImages, setConvertedImages] = useState<Blob[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setConvertedImages([]);
  };

  const convertPdfToJpg = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const file = files[0];
      
      // Create FormData for server upload
      const formData = new FormData();
      formData.append('file', file);

      // Send to server-side API
      const response = await fetch('/api/pdf-to-jpg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Conversion failed');
      }

      // Convert base64 images to Blobs
      const images: Blob[] = result.images.map((imageData: any) => {
        const byteCharacters = atob(imageData.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'image/jpeg' });
      });

      setConvertedImages(images);
    } catch (err) {
      console.error('Conversion error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Invalid PDF')) {
          setError('Invalid PDF file. Please check the file and try again.');
        } else if (err.message.includes('password')) {
          setError('This PDF is password protected. Please provide an unprotected PDF.');
        } else if (err.message.includes('Server error')) {
          setError('Server error occurred. Please try again.');
        } else {
          setError(`Failed to convert PDF to JPG: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAllImages = () => {
    convertedImages.forEach((imageBlob, index) => {
      saveAs(imageBlob, `page-${index + 1}.jpg`);
    });
  };

  const downloadSingleImage = (index: number) => {
    saveAs(convertedImages[index], `page-${index + 1}.jpg`);
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
              <Image className="h-8 w-8 text-pink-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">PDF to JPG</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Convert PDF to JPG
          </h1>
          <p className="text-xl text-gray-600">
            Convert PDF pages to ultra-high-quality JPG images using server-side processing
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                'application/pdf': ['.pdf']
              }}
              multiple={false}
              maxFiles={1}
              maxSize={50 * 1024 * 1024} // 50MB
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={convertPdfToJpg}
              disabled={files.length === 0 || isProcessing}
              className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Converting...
                </>
              ) : (
                <>
                  <Image className="h-5 w-5 mr-2" />
                  Convert to JPG
                </>
              )}
            </button>

            {convertedImages.length > 0 && (
              <button
                onClick={downloadAllImages}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download All Images
              </button>
            )}
          </div>

          {convertedImages.length > 0 && (
            <div className="mt-8">
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg mb-6">
                <p className="text-green-700 font-semibold">
                  ✅ Successfully converted PDF to {convertedImages.length} ultra-high-quality JPG image(s)!
                </p>
                <p className="text-green-600 text-sm mt-1">
                  Each image contains the actual rendered content from your PDF pages with 300 DPI for maximum quality.
                </p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Converted Images:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {convertedImages.map((imageBlob, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="mb-3">
                      <img
                        src={URL.createObjectURL(imageBlob)}
                        alt={`Page ${index + 1}`}
                        className="w-full h-48 object-cover rounded border"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Page {index + 1}</span>
                      </div>
                      <button
                        onClick={() => downloadSingleImage(index)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {(imageBlob.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Features Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Ultra-High-Quality PDF to JPG Conversion
          </h3>
          <p className="text-blue-700 mb-4">
            This tool renders actual PDF content to ultra-high-quality JPG images using server-side pdf2pic processing. 
            Each page is converted with full fidelity including text, images, and formatting.
            Uses 300 DPI rendering for maximum quality and reliability.
          </p>
          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">What you get:</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Real PDF content rendered as ultra-high-quality JPG images</li>
              <li>Ultra-high-resolution output (300 DPI for maximum quality)</li>
              <li>Server-side processing for better reliability</li>
              <li>No browser compatibility issues</li>
              <li>Preserves text, images, and layout from original PDF</li>
              <li>Individual page downloads or bulk download</li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Image className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">JPG Format</h3>
            <p className="text-gray-600">Converts PDF pages to high-quality JPG images</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bulk Download</h3>
            <p className="text-gray-600">Download all images at once or individually</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Preview</h3>
            <p className="text-gray-600">Preview all converted images before downloading</p>
          </div>
        </div>
      </div>
    </div>
  );
}
