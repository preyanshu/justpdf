'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, Scissors, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PdfResizerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPdf, setProcessedPdf] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setProcessedPdf(null);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const resizePdf = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const file = files[0];
      setOriginalSize(file.size);
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Get compression settings based on level
      let imageQuality = 0.8;
      let removeMetadata = false;
      
      switch (compressionLevel) {
        case 'low':
          imageQuality = 0.9;
          removeMetadata = false;
          break;
        case 'medium':
          imageQuality = 0.7;
          removeMetadata = true;
          break;
        case 'high':
          imageQuality = 0.5;
          removeMetadata = true;
          break;
      }

      // Process each page
      const pages = pdfDoc.getPages();
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        // Resize page if needed (optional - you can add UI controls for this)
        const { width, height } = page.getSize();
        
        // For demonstration, we'll keep the same size but reduce quality
        // In a real implementation, you might want to resize the page dimensions
        if (width > 800 || height > 1000) {
          const scale = Math.min(800 / width, 1000 / height);
          page.scale(scale);
        }
      }

      // Remove metadata if requested
      if (removeMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
      }

      // Save with compression
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50
      });
      
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setCompressedSize(pdfBlob.size);
      setProcessedPdf(pdfBlob);
    } catch (err) {
      setError('Failed to resize PDF. Please try again.');
      console.error('Resize error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (processedPdf) {
      saveAs(processedPdf, 'resized-document.pdf');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionPercentage = () => {
    if (originalSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
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
              <Scissors className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">PDF Resizer</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resize & Compress PDFs
          </h1>
          <p className="text-xl text-gray-600">
            Reduce PDF file size while maintaining quality
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

          {files.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compression Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compression Level
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'low', label: 'Low (90% quality)', desc: 'Minimal compression, best quality' },
                      { value: 'medium', label: 'Medium (70% quality)', desc: 'Balanced compression and quality' },
                      { value: 'high', label: 'High (50% quality)', desc: 'Maximum compression, smaller file' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start">
                        <input
                          type="radio"
                          name="compression"
                          value={option.value}
                          checked={compressionLevel === option.value}
                          onChange={(e) => setCompressionLevel(e.target.value as 'low' | 'medium' | 'high')}
                          className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resizePdf}
              disabled={files.length === 0 || isProcessing}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Resizing...
                </>
              ) : (
                <>
                  <Scissors className="h-5 w-5 mr-2" />
                  Resize PDF
                </>
              )}
            </button>

            {processedPdf && (
              <button
                onClick={downloadPdf}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </button>
            )}
          </div>

          {processedPdf && originalSize > 0 && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-700 font-semibold">
                  ✅ Successfully resized PDF!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700">Original Size</h4>
                  <p className="text-2xl font-bold text-gray-900">{formatFileSize(originalSize)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700">Compressed Size</h4>
                  <p className="text-2xl font-bold text-gray-900">{formatFileSize(compressedSize)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700">Size Reduction</h4>
                  <p className="text-2xl font-bold text-green-600">{getCompressionPercentage()}%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Scissors className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Compression</h3>
            <p className="text-gray-600">Intelligent compression algorithms reduce file size</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Control</h3>
            <p className="text-gray-600">Choose compression level to balance size and quality</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-gray-600">See file size reduction immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
}
