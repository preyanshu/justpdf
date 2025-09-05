'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, FileText, File } from 'lucide-react';
import Link from 'next/link';

export default function WordToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPdf, setProcessedPdf] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setProcessedPdf(null);
  };

  const convertWordToPdf = async () => {
    if (files.length === 0) {
      setError('Please select a Word document');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        
        // Convert Word document to HTML
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const html = result.value;
        
        // Create a temporary div to render the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.style.width = '210mm'; // A4 width
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '12px';
        tempDiv.style.lineHeight = '1.4';
        tempDiv.style.color = '#000'; // Ensure black text
        tempDiv.style.backgroundColor = '#ffffff'; // Ensure white background
        document.body.appendChild(tempDiv);

        // Convert HTML to canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size for A4 (210mm x 297mm at 96 DPI)
        const width = 794; // 210mm in pixels
        const height = 1123; // 297mm in pixels
        canvas.width = width;
        canvas.height = height;
        
        // Set white background
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
        }

        // Use html2canvas to convert the div to canvas
        const { default: html2canvas } = await import('html2canvas');
        const canvasResult = await html2canvas(tempDiv, {
          width: width,
          height: height,
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
        });

        // Clean up
        document.body.removeChild(tempDiv);

        // Convert canvas to image data
        const imageData = canvasResult.toDataURL('image/png');
        const response = await fetch(imageData);
        const imageBytes = new Uint8Array(await response.arrayBuffer());
        
        // Embed image in PDF
        const image = await pdfDoc.embedPng(imageBytes);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      // @ts-ignore
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedPdf(pdfBlob);
    } catch (err) {
      setError('Failed to convert Word document to PDF. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (processedPdf) {
      saveAs(processedPdf, 'converted-document.pdf');
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
              <FileText className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Word to PDF</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Convert Word to PDF
          </h1>
          <p className="text-xl text-gray-600">
            Upload your Word documents and convert them to PDF format
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'application/msword': ['.doc']
              }}
              multiple={true}
              maxFiles={5}
              maxSize={25 * 1024 * 1024} // 25MB
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={convertWordToPdf}
              disabled={files.length === 0 || isProcessing}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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
                ✅ Successfully converted {files.length} Word document(s) to PDF!
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">DOC & DOCX Support</h3>
            <p className="text-gray-600">Supports both .doc and .docx formats</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <File className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Format Preservation</h3>
            <p className="text-gray-600">Maintains formatting, fonts, and layout</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">High Quality</h3>
            <p className="text-gray-600">Produces high-quality PDF output</p>
          </div>
        </div>
      </div>
    </div>
  );
}
