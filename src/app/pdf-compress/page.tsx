'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, Zap, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PdfCompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPdf, setProcessedPdf] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high' | 'maximum'>('medium');

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setProcessedPdf(null);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const compressPdf = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const file = files[0];
      setOriginalSize(file.size);
      
      // Create FormData for server upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('compressionLevel', compressionLevel);

      // Send to server-side API
      const response = await fetch('/api/pdf-compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Compression failed');
      }

      // Convert base64 PDF to Blob
      const byteCharacters = atob(result.compressedPdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
      
      setCompressedSize(result.compressedSize);
      setProcessedPdf(pdfBlob);
    } catch (err) {
      console.error('Compression error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Invalid PDF')) {
          setError('Invalid PDF file. Please check the file and try again.');
        } else if (err.message.includes('password')) {
          setError('This PDF is password protected. Please provide an unprotected PDF.');
        } else if (err.message.includes('Server error')) {
          setError('Server error occurred. Please try again.');
        } else {
          setError(`Failed to compress PDF: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (processedPdf) {
      saveAs(processedPdf, 'compressed-document.pdf');
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

  const getCompressionDescription = () => {
    switch (compressionLevel) {
      case 'low':
        return '300 DPI, printer quality, minimal compression (5-20% reduction)';
      case 'medium':
        return '200 DPI, ebook quality, balanced compression (10-30% reduction)';
      case 'high':
        return '150 DPI, ebook quality, moderate compression (15-35% reduction)';
      case 'maximum':
        return '150 DPI, screen quality, maximum compression (20-40% reduction)';
      default:
        return '';
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
              <Zap className="h-8 w-8 text-orange-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Compress PDF</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compress PDF
          </h1>
          <p className="text-xl text-gray-600">
            Reduce PDF file size using advanced server-side compression
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
              maxSize={100 * 1024 * 1024} // 100MB
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
                      { value: 'low', label: 'Low Compression', desc: '300 DPI, printer quality (5-20% reduction)' },
                      { value: 'medium', label: 'Medium Compression', desc: '200 DPI, ebook quality (10-30% reduction)' },
                      { value: 'high', label: 'High Compression', desc: '150 DPI, ebook quality (15-35% reduction)' },
                      { value: 'maximum', label: 'Maximum Compression', desc: '150 DPI, screen quality (20-40% reduction)' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start">
                        <input
                          type="radio"
                          name="compression"
                          value={option.value}
                          checked={compressionLevel === option.value}
                          onChange={(e) => setCompressionLevel(e.target.value as 'low' | 'medium' | 'high' | 'maximum')}
                          className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-500">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {getCompressionDescription()}
                  </p>
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
              onClick={compressPdf}
              disabled={files.length === 0 || isProcessing}
              className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Compressing...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Compress PDF
                </>
              )}
            </button>

            {processedPdf && (
              <button
                onClick={downloadPdf}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Compressed PDF
              </button>
            )}
          </div>

          {processedPdf && originalSize > 0 && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-700 font-semibold">
                  ✅ Successfully compressed PDF!
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

        {/* Features Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Reliable PDF Compression
          </h3>
          <p className="text-blue-700 mb-4">
            Advanced server-side compression using Ghostscript and qpdf with intelligent fallback.
            Results are now more consistent and reliable.
          </p>
          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">Compression Expectations:</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li><strong>Image-heavy PDFs:</strong> 20-40% size reduction</li>
              <li><strong>Scanned documents:</strong> 15-35% size reduction</li>
              <li><strong>Text-only PDFs:</strong> 5-15% size reduction</li>
              <li><strong>Already compressed PDFs:</strong> May not compress further</li>
              <li><strong>Small PDFs:</strong> May not benefit from compression</li>
            </ul>
            <p className="text-xs text-gray-600 mt-2">
              The system automatically uses the best compression method and won't make files larger.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Compression</h3>
            <p className="text-gray-600">Advanced algorithms reduce file size efficiently</p>
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
            <p className="text-gray-600">See compression results immediately</p>
          </div>
        </div>
      </div>
    </div>
  );
}
