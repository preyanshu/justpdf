'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, Scissors, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PdfSplitPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitPdfs, setSplitPdfs] = useState<Blob[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setSplitPdfs([]);
  };

  const splitPdf = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      const newPdfs: Blob[] = [];
      
      // Split each page into a separate PDF
      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        
        const pdfBytes = await newPdf.save();
        // @ts-ignore
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        newPdfs.push(pdfBlob);
      }
      
      setSplitPdfs(newPdfs);
    } catch (err) {
      setError('Failed to split PDF. Please try again.');
      console.error('Split error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAllPages = () => {
    splitPdfs.forEach((pdfBlob, index) => {
      saveAs(pdfBlob, `page-${index + 1}.pdf`);
    });
  };

  const downloadSinglePage = (index: number) => {
    saveAs(splitPdfs[index], `page-${index + 1}.pdf`);
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
              <Scissors className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">PDF Split</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Split PDF
          </h1>
          <p className="text-xl text-gray-600">
            Split your PDF into individual pages
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
              onClick={splitPdf}
              disabled={files.length === 0 || isProcessing}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Splitting...
                </>
              ) : (
                <>
                  <Scissors className="h-5 w-5 mr-2" />
                  Split PDF
                </>
              )}
            </button>

            {splitPdfs.length > 0 && (
              <button
                onClick={downloadAllPages}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download All Pages
              </button>
            )}
          </div>

          {splitPdfs.length > 0 && (
            <div className="mt-8">
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg mb-6">
                <p className="text-green-700 font-semibold">
                  ✅ Successfully split PDF into {splitPdfs.length} pages!
                </p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Pages:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {splitPdfs.map((pdfBlob, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-red-600 mr-2" />
                        <span className="font-medium text-gray-900">Page {index + 1}</span>
                      </div>
                      <button
                        onClick={() => downloadSinglePage(index)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {(pdfBlob.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Scissors className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Individual Pages</h3>
            <p className="text-gray-600">Each page becomes a separate PDF file</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bulk Download</h3>
            <p className="text-gray-600">Download all pages at once or individually</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">High Quality</h3>
            <p className="text-gray-600">Maintains original PDF quality and formatting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
