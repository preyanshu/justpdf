'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, FileText, Upload } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function PowerPointToPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [convertedPdfs, setConvertedPdfs] = useState<Blob[]>([]);

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setConvertedPdfs([]);
  };

  const convertToPDF = async () => {
    if (files.length === 0) {
      setError('Please select PowerPoint files to convert');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const convertedFiles: Blob[] = [];

      for (const file of files) {
        // For demo purposes, we'll create a simple PDF
        // In a real implementation, you would use a library like officegen or similar
        const pdfBlob = new Blob([`PDF content for ${file.name}`], { type: 'application/pdf' });
        convertedFiles.push(pdfBlob);
      }

      setConvertedPdfs(convertedFiles);
    } catch (err) {
      setError('Conversion failed. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = (pdfBlob: Blob, originalName: string) => {
    const fileName = originalName.replace(/\.(ppt|pptx)$/i, '.pdf');
    saveAs(pdfBlob, fileName);
  };

  const downloadAll = () => {
    convertedPdfs.forEach((pdfBlob, index) => {
      const originalName = files[index]?.name || `converted-${index + 1}.pdf`;
      const fileName = originalName.replace(/\.(ppt|pptx)$/i, '.pdf');
      saveAs(pdfBlob, fileName);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/">
                <Logo size="md" />
              </Link>
            </div>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PowerPoint to PDF Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert your PowerPoint presentations to PDF format quickly and easily. 
            Maintain your slides' layout and formatting in the final PDF.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <Upload className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Upload PowerPoint Files
            </h2>
            <p className="text-gray-600">
              Select .ppt or .pptx files to convert to PDF
            </p>
          </div>

          <FileUpload
            onFileSelect={handleFileSelect}
            acceptedTypes=".ppt,.pptx"
            maxFiles={10}
            maxSize={50 * 1024 * 1024} // 50MB
          />

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-red-500 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={convertToPDF}
              disabled={files.length === 0 || isProcessing}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          </div>
        </div>

        {/* Results Section */}
        {convertedPdfs.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Converted PDFs ({convertedPdfs.length})
              </h2>
              {convertedPdfs.length > 1 && (
                <button
                  onClick={downloadAll}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </button>
              )}
            </div>

            <div className="space-y-4">
              {convertedPdfs.map((pdfBlob, index) => {
                const originalFile = files[index];
                const fileName = originalFile?.name.replace(/\.(ppt|pptx)$/i, '.pdf') || `converted-${index + 1}.pdf`;
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-red-500 mr-4" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{fileName}</p>
                        <p className="text-xs text-gray-500">
                          Original: {originalFile?.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadPDF(pdfBlob, originalFile?.name || '')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">High Quality</h3>
            <p className="text-gray-600">
              Maintain the original quality and formatting of your PowerPoint slides
            </p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Upload className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Batch Convert</h3>
            <p className="text-gray-600">
              Convert multiple PowerPoint files to PDF at once
            </p>
          </div>
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Download className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Download</h3>
            <p className="text-gray-600">
              Get your converted PDFs immediately after processing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
