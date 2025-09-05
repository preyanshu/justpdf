'use client';

import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft, Download, Image as ImageIcon, Maximize, Settings, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function ImageResizerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizedImages, setResizedImages] = useState<Blob[]>([]);
  const [error, setError] = useState<string>('');
  const [resizeMode, setResizeMode] = useState<'percentage' | 'dimensions'>('percentage');
  const [resizeValue, setResizeValue] = useState<number>(50);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [quality, setQuality] = useState<number>(90);
  const [expectedDimensions, setExpectedDimensions] = useState<{width: number, height: number}[]>([]);
  const [isCalculatingDimensions, setIsCalculatingDimensions] = useState<boolean>(false);

  const calculateExpectedDimensions = async (files: File[]) => {
    setIsCalculatingDimensions(true);
    const dimensions: {width: number, height: number}[] = [];
    
    for (const file of files) {
      try {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });

        let newWidth: number;
        let newHeight: number;

        if (resizeMode === 'percentage') {
          newWidth = Math.round(img.width * (resizeValue / 100));
          newHeight = Math.round(img.height * (resizeValue / 100));
        } else {
          if (maintainAspectRatio) {
            const aspectRatio = img.width / img.height;
            if (width / height > aspectRatio) {
              newHeight = height;
              newWidth = Math.round(height * aspectRatio);
            } else {
              newWidth = width;
              newHeight = Math.round(width / aspectRatio);
            }
          } else {
            newWidth = width;
            newHeight = height;
          }
        }

        dimensions.push({ width: newWidth, height: newHeight });
        URL.revokeObjectURL(img.src);
      } catch (err) {
        dimensions.push({ width: 0, height: 0 });
      }
    }
    
    setExpectedDimensions(dimensions);
    setIsCalculatingDimensions(false);
  };

  const handleFileSelect = async (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setError('');
    setResizedImages([]);
    await calculateExpectedDimensions(selectedFiles);
  };

  const resizeImages = async () => {
    if (files.length === 0) {
      setError('Please select image files');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const resizedBlobs: Blob[] = [];

      for (const file of files) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });

        let newWidth: number;
        let newHeight: number;

        if (resizeMode === 'percentage') {
          newWidth = Math.round(img.width * (resizeValue / 100));
          newHeight = Math.round(img.height * (resizeValue / 100));
        } else {
          if (maintainAspectRatio) {
            const aspectRatio = img.width / img.height;
            if (width / height > aspectRatio) {
              newHeight = height;
              newWidth = Math.round(height * aspectRatio);
            } else {
              newWidth = width;
              newHeight = Math.round(width / aspectRatio);
            }
          } else {
            newWidth = width;
            newHeight = height;
          }
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Set high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw the resized image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            resolve(blob!);
          }, file.type, quality / 100);
        });

        resizedBlobs.push(blob);
        
        // Clean up
        URL.revokeObjectURL(img.src);
      }

      setResizedImages(resizedBlobs);
    } catch (err) {
      console.error('Resize error:', err);
      setError('Failed to resize images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAllImages = () => {
    resizedImages.forEach((imageBlob, index) => {
      const originalName = files[index].name;
      const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
      const extension = originalName.split('.').pop();
      saveAs(imageBlob, `${nameWithoutExt}_resized.${extension}`);
    });
  };

  const downloadSingleImage = (index: number) => {
    const originalName = files[index].name;
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const extension = originalName.split('.').pop();
    saveAs(resizedImages[index], `${nameWithoutExt}_resized.${extension}`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetSettings = () => {
    setResizeMode('percentage');
    setResizeValue(50);
    setWidth(800);
    setHeight(600);
    setMaintainAspectRatio(true);
    setQuality(90);
  };

  const estimateFileSize = (originalSize: number, quality: number) => {
    // Rough estimation based on quality setting
    const qualityFactor = quality / 100;
    const estimatedSize = originalSize * qualityFactor;
    return Math.round(estimatedSize);
  };

  // Recalculate dimensions when settings change
  useEffect(() => {
    if (files.length > 0) {
      calculateExpectedDimensions(files);
    }
  }, [resizeMode, resizeValue, width, height, maintainAspectRatio]);

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
              <Maximize className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Image Resizer</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resize Images
          </h1>
          <p className="text-xl text-gray-600">
            Resize multiple images at once with high quality and precise control
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept={{
                'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
              }}
              multiple={true}
              maxFiles={10}
              maxSize={50 * 1024 * 1024} // 50MB
            />
          </div>

          {files.length > 0 && (
            <div className="mb-8">
              {/* Expected Results Preview */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Expected Results</h3>
                {isCalculatingDimensions ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-blue-700">Calculating dimensions...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {files.map((file, index) => {
                      const expected = expectedDimensions[index];
                      const estimatedSize = estimateFileSize(file.size, quality);
                      return (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Original: {Math.round(file.size / 1024)} KB</div>
                            <div>Expected: {expected ? `${expected.width} × ${expected.height}px` : 'Calculating...'}</div>
                            <div>Est. size: ~{Math.round(estimatedSize / 1024)} KB</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Resize Settings</h3>
                <button
                  onClick={resetSettings}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Resize Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Resize Mode
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="resizeMode"
                        value="percentage"
                        checked={resizeMode === 'percentage'}
                        onChange={(e) => setResizeMode(e.target.value as 'percentage' | 'dimensions')}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Percentage</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="resizeMode"
                        value="dimensions"
                        checked={resizeMode === 'dimensions'}
                        onChange={(e) => setResizeMode(e.target.value as 'percentage' | 'dimensions')}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Specific Dimensions</span>
                    </label>
                  </div>
                </div>

                {/* Percentage Mode */}
                {resizeMode === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resize to {resizeValue}% of original size
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={resizeValue}
                      onChange={(e) => setResizeValue(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>10%</span>
                      <span>200%</span>
                    </div>
                  </div>
                )}

                {/* Dimensions Mode */}
                {resizeMode === 'dimensions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width (pixels)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="1"
                        max="10000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (pixels)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="1"
                        max="10000"
                      />
                    </div>
                  </div>
                )}

                {/* Aspect Ratio Option */}
                {resizeMode === 'dimensions' && (
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Maintain aspect ratio</span>
                    </label>
                  </div>
                )}

                {/* Quality Setting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10% (smaller file)</span>
                    <span>100% (best quality)</span>
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
              onClick={resizeImages}
              disabled={files.length === 0 || isProcessing}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Resizing...
                </>
              ) : (
                <>
                  <Maximize className="h-5 w-5 mr-2" />
                  Resize Images
                </>
              )}
            </button>

            {resizedImages.length > 0 && (
              <button
                onClick={downloadAllImages}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download All Images
              </button>
            )}
          </div>

          {resizedImages.length > 0 && (
            <div className="mt-8">
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg mb-6">
                <p className="text-green-700 font-semibold">
                  ✅ Successfully resized {resizedImages.length} image(s)!
                </p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resized Images:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resizedImages.map((imageBlob, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="mb-3">
                      <img
                        src={URL.createObjectURL(imageBlob)}
                        alt={`Resized ${index + 1}`}
                        className="w-full h-48 object-cover rounded border"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                                          <div className="flex items-center">
                      <ImageIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {files[index].name}
                      </span>
                    </div>
                      <button
                        onClick={() => downloadSingleImage(index)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <div>Original: {formatFileSize(files[index].size)}</div>
                      <div>Resized: {formatFileSize(imageBlob.size)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Features Info */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            High-Quality Image Resizing
          </h3>
          <p className="text-purple-700 mb-4">
            Resize multiple images with precise control over dimensions, quality, and aspect ratio.
            Preview expected results before processing. Uses high-quality canvas rendering for the best results.
          </p>
          <div className="bg-white p-4 rounded border">
            <h4 className="font-semibold text-gray-800 mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Resize by percentage or specific dimensions</li>
              <li>Maintain aspect ratio option</li>
              <li>Quality control (10-100%)</li>
              <li>Preview expected dimensions and file sizes</li>
              <li>Batch processing of multiple images</li>
              <li>High-quality canvas rendering</li>
              <li>Support for JPG, PNG, GIF, BMP, WebP</li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Maximize className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Resizing</h3>
            <p className="text-gray-600">Resize by percentage or exact dimensions</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Control</h3>
            <p className="text-gray-600">Adjust quality and maintain aspect ratio</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Batch Processing</h3>
            <p className="text-gray-600">Resize multiple images at once</p>
          </div>
        </div>
      </div>
    </div>
  );
}
