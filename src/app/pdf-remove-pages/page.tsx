'use client';

import { useState } from 'react';
import { saveAs } from 'file-saver';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, Trash2, FileText, X } from 'lucide-react';
import Link from 'next/link';

export default function PdfRemovePagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPdf, setProcessedPdf] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [pagesToRemove, setPagesToRemove] = useState<number[]>([]);

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setProcessedPdf(null);
    setPagesToRemove([]);
    
    if (selectedFiles.length > 0) {
      loadPdfInfo(selectedFiles[0]);
    }
  };

  const loadPdfInfo = async (file: File) => {
    // For now, we'll set a default page count
    // In a real implementation, you might want to call an API to get page count
    setPageCount(10); // Default assumption
  };

  const togglePage = (pageNumber: number) => {
    setPagesToRemove(prev => 
      prev.includes(pageNumber) 
        ? prev.filter(p => p !== pageNumber)
        : [...prev, pageNumber].sort((a, b) => a - b)
    );
  };

  const removePages = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file');
      return;
    }

    if (pagesToRemove.length === 0) {
      setError('Please select pages to remove');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pagesToRemove', pagesToRemove.join(','));

      const response = await fetch('/api/pdf-remove-pages', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Page removal failed');
      }

      const pdfBlob = await response.blob();
      setProcessedPdf(pdfBlob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Page removal failed. Please try again.');
      console.error('Remove pages error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (processedPdf) {
      saveAs(processedPdf, 'pdf-with-pages-removed.pdf');
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
              <Trash2 className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Remove Pages</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Remove Pages from PDF
          </h1>
          <p className="text-xl text-gray-600">
            Select and remove specific pages from your PDF document
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

          {pageCount > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Select Pages to Remove ({pageCount} total pages)
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => togglePage(pageNumber)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      pagesToRemove.includes(pageNumber)
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">{pageNumber}</div>
                      {pagesToRemove.includes(pageNumber) && (
                        <X className="h-4 w-4 mx-auto mt-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {pagesToRemove.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    <strong>{pagesToRemove.length}</strong> page(s) selected for removal: {pagesToRemove.join(', ')}
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={removePages}
              disabled={files.length === 0 || pagesToRemove.length === 0 || isProcessing}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Removing Pages...
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5 mr-2" />
                  Remove Selected Pages
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

          {processedPdf && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-700">
                ✅ Successfully removed {pagesToRemove.length} page(s) from PDF!
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Selective Removal</h3>
            <p className="text-gray-600">Choose specific pages to remove from your PDF</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Selection</h3>
            <p className="text-gray-600">See all pages and select which ones to remove</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Preserved</h3>
            <p className="text-gray-600">Maintains original quality of remaining pages</p>
          </div>
        </div>
      </div>
    </div>
  );
}
