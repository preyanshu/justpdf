'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, FileSpreadsheet, File } from 'lucide-react';
import Link from 'next/link';

export default function ExcelToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPdf, setProcessedPdf] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setProcessedPdf(null);
  };

  const convertExcelToPdf = async () => {
    if (files.length === 0) {
      setError('Please select an Excel file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Process each worksheet
        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) continue;
          
          // Create HTML table from Excel data
          let html = `
            <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #000;">
              <h2 style="margin-bottom: 20px; color: #000; font-size: 18px; font-weight: bold;">${sheetName}</h2>
              <table style="border-collapse: collapse; width: 100%; border: 2px solid #333;">
          `;
          
          jsonData.forEach((row: any[], rowIndex: number) => {
            html += '<tr>';
            row.forEach((cell: any, cellIndex: number) => {
              const cellValue = cell || '';
              const cellStyle = `
                border: 1px solid #333;
                padding: 8px 12px;
                text-align: left;
                background-color: ${rowIndex === 0 ? '#e8e8e8' : 'white'};
                font-weight: ${rowIndex === 0 ? 'bold' : 'normal'};
                color: #000;
                font-size: 11px;
              `;
              html += `<td style="${cellStyle}">${cellValue}</td>`;
            });
            html += '</tr>';
          });
          
          html += '</table></div>';
          
          // Create a temporary div to render the HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          tempDiv.style.position = 'absolute';
          tempDiv.style.left = '-9999px';
          tempDiv.style.top = '-9999px';
          tempDiv.style.width = '210mm'; // A4 width
          tempDiv.style.fontFamily = 'Arial, sans-serif';
          tempDiv.style.fontSize = '10px';
          tempDiv.style.lineHeight = '1.2';
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
            logging: false,
            letterRendering: true
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
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedPdf(pdfBlob);
    } catch (err) {
      setError('Failed to convert Excel file to PDF. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (processedPdf) {
      saveAs(processedPdf, 'converted-spreadsheet.pdf');
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
              <FileSpreadsheet className="h-8 w-8 text-orange-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Excel to PDF</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Convert Excel to PDF
          </h1>
          <p className="text-xl text-gray-600">
            Upload your Excel spreadsheets and convert them to PDF format
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                'application/vnd.ms-excel': ['.xls'],
                'text/csv': ['.csv']
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
              onClick={convertExcelToPdf}
              disabled={files.length === 0 || isProcessing}
              className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Converting...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
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
                ✅ Successfully converted {files.length} Excel file(s) to PDF!
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">XLS & XLSX Support</h3>
            <p className="text-gray-600">Supports .xls, .xlsx, and .csv formats</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <File className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Sheets</h3>
            <p className="text-gray-600">Converts all worksheets to separate PDF pages</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Table Formatting</h3>
            <p className="text-gray-600">Preserves table structure and formatting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
