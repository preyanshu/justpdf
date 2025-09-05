'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, Merge, FileText, X, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

export default function PdfMergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPdf, setProcessedPdf] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setProcessedPdf(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      setFiles(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      // @ts-ignore
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedPdf(pdfBlob);
    } catch (err) {
      setError('Failed to merge PDFs. Please try again.');
      console.error('Merge error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (processedPdf) {
      saveAs(processedPdf, 'merged-document.pdf');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              <Merge className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">PDF Merge</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Merge PDFs
          </h1>
          <p className="text-xl text-gray-600">
            Combine multiple PDF files into one document
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                'application/pdf': ['.pdf']
              }}
              multiple={true}
              maxFiles={10}
              maxSize={50 * 1024 * 1024} // 50MB per file
            />
          </div>

          {files.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                PDF Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveFile(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => moveFile(index, 'down')}
                        disabled={index === files.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-500"
                        title="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                Use the arrows to reorder files. The merge will follow this order.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={mergePdfs}
              disabled={files.length < 2 || isProcessing}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Merging...
                </>
              ) : (
                <>
                  <Merge className="h-5 w-5 mr-2" />
                  Merge PDFs
                </>
              )}
            </button>

            {processedPdf && (
              <button
                onClick={downloadPdf}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Merged PDF
              </button>
            )}
          </div>

          {processedPdf && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-700">
                ✅ Successfully merged {files.length} PDF file(s)!
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Merge className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag & Drop Reorder</h3>
            <p className="text-gray-600">Easily reorder files before merging</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple PDFs</h3>
            <p className="text-gray-600">Merge up to 10 PDF files at once</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Preserve Quality</h3>
            <p className="text-gray-600">Maintains original PDF quality and formatting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
