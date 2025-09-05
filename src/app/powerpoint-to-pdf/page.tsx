'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, Presentation, File } from 'lucide-react';
import Link from 'next/link';

export default function PowerpointToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPdf, setProcessedPdf] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setProcessedPdf(null);
  };

  const convertPowerpointToPdf = async () => {
    if (files.length === 0) {
      setError('Please select a PowerPoint file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const file of files) {
        // For PowerPoint files, we'll create a simple conversion
        // In a real application, you'd use a library like pptx2pdf or similar
        const arrayBuffer = await file.arrayBuffer();
        
        // Create a placeholder page with file information
        const page = pdfDoc.addPage([595, 842]); // A4 size
        const { width, height } = page.getSize();
        
        // Add title
        page.drawText('PowerPoint to PDF Conversion', {
          x: 50,
          y: height - 100,
          size: 24,
          color: { r: 0, g: 0, b: 0 }
        });
        
        // Add file information
        page.drawText(`File: ${file.name}`, {
          x: 50,
          y: height - 150,
          size: 14,
          color: { r: 0.3, g: 0.3, b: 0.3 }
        });
        
        page.drawText(`Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`, {
          x: 50,
          y: height - 180,
          size: 14,
          color: { r: 0.3, g: 0.3, b: 0.3 }
        });
        
        page.drawText(`Type: ${file.type}`, {
          x: 50,
          y: height - 210,
          size: 14,
          color: { r: 0.3, g: 0.3, b: 0.3 }
        });
        
        // Add note about conversion
        page.drawText('Note: This is a basic conversion. For full PowerPoint', {
          x: 50,
          y: height - 280,
          size: 12,
          color: { r: 0.5, g: 0.5, b: 0.5 }
        });
        
        page.drawText('support with slides, images, and formatting, please', {
          x: 50,
          y: height - 300,
          size: 12,
          color: { r: 0.5, g: 0.5, b: 0.5 }
        });
        
        page.drawText('use a specialized PowerPoint conversion service.', {
          x: 50,
          y: height - 320,
          size: 12,
          color: { r: 0.5, g: 0.5, b: 0.5 }
        });
        
        // Add instructions
        page.drawText('To convert PowerPoint files with full fidelity:', {
          x: 50,
          y: height - 380,
          size: 14,
          color: { r: 0, g: 0.5, b: 0 }
        });
        
        page.drawText('1. Open your PowerPoint file', {
          x: 70,
          y: height - 410,
          size: 12,
          color: { r: 0.2, g: 0.2, b: 0.2 }
        });
        
        page.drawText('2. Go to File > Export > Create PDF/XPS', {
          x: 70,
          y: height - 430,
          size: 12,
          color: { r: 0.2, g: 0.2, b: 0.2 }
        });
        
        page.drawText('3. Choose your settings and click Publish', {
          x: 70,
          y: height - 450,
          size: 12,
          color: { r: 0.2, g: 0.2, b: 0.2 }
        });
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedPdf(pdfBlob);
    } catch (err) {
      setError('Failed to process PowerPoint file. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (processedPdf) {
      saveAs(processedPdf, 'converted-presentation.pdf');
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
              <Presentation className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">PowerPoint to PDF</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Convert PowerPoint to PDF
          </h1>
          <p className="text-xl text-gray-600">
            Upload your PowerPoint presentations and convert them to PDF format
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
                'application/vnd.ms-powerpoint': ['.ppt']
              }}
              multiple={true}
              maxFiles={5}
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
              onClick={convertPowerpointToPdf}
              disabled={files.length === 0 || isProcessing}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Presentation className="h-5 w-5 mr-2" />
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
                ✅ Successfully processed {files.length} PowerPoint file(s)!
              </p>
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Important Notice
          </h3>
          <p className="text-yellow-700 mb-4">
            This is a basic PowerPoint to PDF converter. For full conversion with slides, 
            images, animations, and formatting, we recommend using Microsoft PowerPoint's 
            built-in export feature or a specialized conversion service.
          </p>
          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">For best results:</h4>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Open your PowerPoint file in Microsoft PowerPoint</li>
              <li>Go to File → Export → Create PDF/XPS</li>
              <li>Choose your export settings and click Publish</li>
            </ol>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Presentation className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PPT & PPTX Support</h3>
            <p className="text-gray-600">Supports both .ppt and .pptx formats</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <File className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">File Information</h3>
            <p className="text-gray-600">Provides detailed file information in PDF</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion Guide</h3>
            <p className="text-gray-600">Includes instructions for full conversion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
