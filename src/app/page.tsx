'use client';

import { FileText, Image, FileSpreadsheet, Scissors, Merge, Trash2, Zap, Download, Maximize, Grid3X3, User, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Logo from '@/components/Logo';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All' },
    { name: 'Convert to PDF' },
    { name: 'Convert to JPG' },
    { name: 'Resizer' },
    { name: 'Other Tools' }
  ];

  const features = [
    {
      title: 'Image Resizer',
      description: 'Resize images with quality control',
      icon: Maximize,
      href: '/image-resizer',
      color: 'bg-purple-600'
    },
    {
      title: 'Image to PDF',
      description: 'Convert images to PDF documents',
      icon: Image,
      href: '/image-to-pdf',
      color: 'bg-blue-500'
    },
    {
      title: 'JPEG to PDF',
      description: 'Convert JPEG images to PDF',
      icon: Image,
      href: '/jpeg-to-pdf',
      color: 'bg-green-500'
    },
    {
      title: 'PDF Merge',
      description: 'Combine multiple PDFs into one',
      icon: Merge,
      href: '/pdf-merge',
      color: 'bg-red-500'
    },
    {
      title: 'PDF Resizer',
      description: 'Resize PDF pages and documents',
      icon: Maximize,
      href: '/pdf-resizer',
      color: 'bg-orange-500'
    },
    {
      title: 'PDF Compress',
      description: 'Reduce PDF file size',
      icon: Zap,
      href: '/pdf-compress',
      color: 'bg-yellow-500'
    },
    {
      title: 'Remove Pages',
      description: 'Delete pages from PDF',
      icon: Trash2,
      href: '/pdf-remove-pages',
      color: 'bg-pink-500'
    },
    {
      title: 'PDF Split',
      description: 'Split PDF into multiple files',
      icon: Scissors,
      href: '/pdf-split',
      color: 'bg-indigo-500'
    },
    {
      title: 'PDF to JPG',
      description: 'Convert PDF pages to JPG images',
      icon: Download,
      href: '/pdf-to-jpg',
      color: 'bg-teal-500'
    },
    {
      title: 'PDF to JPEG',
      description: 'Convert PDF to JPEG format',
      icon: Download,
      href: '/pdf-to-jpg',
      color: 'bg-cyan-500'
    },
    {
      title: 'Word to PDF',
      description: 'Convert Word documents to PDF',
      icon: FileText,
      href: '/word-to-pdf',
      color: 'bg-blue-600'
    },
    {
      title: 'Excel to PDF',
      description: 'Convert Excel spreadsheets to PDF',
      icon: FileSpreadsheet,
      href: '/excel-to-pdf',
      color: 'bg-green-600'
    }
  ];

  const filteredFeatures = activeCategory === 'All' 
    ? features 
    : activeCategory === 'Convert to PDF' 
    ? features.filter(f => ['Image to PDF', 'JPEG to PDF', 'Word to PDF', 'Excel to PDF'].includes(f.title))
    : activeCategory === 'Convert to JPG'
    ? features.filter(f => ['PDF to JPG', 'PDF to JPEG'].includes(f.title))
    : activeCategory === 'Resizer'
    ? features.filter(f => ['Image Resizer', 'PDF Resizer'].includes(f.title))
    : features.filter(f => ['PDF Merge', 'PDF Compress', 'Remove Pages', 'PDF Split'].includes(f.title));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/">
              <Logo size="md" />
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-blue-600 font-semibold">Home</Link>
              <Link href="/about" className="text-gray-900 hover:text-gray-600 font-semibold">About</Link>
              <Link href="/contact" className="text-gray-900 hover:text-gray-600 font-semibold">Contact</Link>
              <div className="relative group">
                <button className="text-gray-900 hover:text-gray-600 font-semibold flex items-center">
                  TOOLS
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link href="/image-resizer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Image Resizer</Link>
                    <Link href="/image-to-pdf" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Image to PDF</Link>
                    <Link href="/jpeg-to-pdf" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">JPEG to PDF</Link>
                    <Link href="/pdf-merge" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PDF Merge</Link>
                    <Link href="/pdf-resizer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PDF Resizer</Link>
                    <Link href="/pdf-compress" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PDF Compress</Link>
                    <Link href="/pdf-remove-pages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Remove Pages</Link>
                    <Link href="/pdf-split" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Split PDF</Link>
                    <Link href="/pdf-to-jpg" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PDF to JPG</Link>
                    <Link href="/pdf-to-jpeg" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PDF to JPEG</Link>
                    <Link href="/word-to-pdf" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Word to PDF</Link>
                    <Link href="/excel-to-pdf" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Excel to PDF</Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-900 hover:text-gray-600 font-semibold flex items-center">
                  LEGAL
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link href="/privacy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Privacy Policy</Link>
                    <Link href="/terms" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Terms of Service</Link>
                    <Link href="/disclaimer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Disclaimer</Link>
                  </div>
                </div>
              </div>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link href="/signup" className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 to-pink-50/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100/20 to-pink-100/20 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-100/20 to-pink-100/20 rounded-full translate-y-48 -translate-x-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ImagePDFly - Every tool you need to work with PDFs in one place
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! 
            Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  activeCategory === category.name
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {activeCategory === 'All' ? 'All PDF Tools' : 
               activeCategory === 'Convert to PDF' ? 'Convert to PDF Tools' : 
               activeCategory === 'Convert to JPG' ? 'Convert to JPG Tools' :
               activeCategory === 'Resizer' ? 'Resizer Tools' :
               'Other Tools'}
            </h2>
            <p className="text-lg text-gray-600">
              {activeCategory === 'All' ? 'Choose from our comprehensive collection of PDF processing tools' :
               activeCategory === 'Convert to PDF' ? 'Convert your documents to PDF format' :
               activeCategory === 'Convert to JPG' ? 'Convert PDF documents to JPG images' :
               activeCategory === 'Resizer' ? 'Resize and optimize your documents and images' :
               'Additional PDF processing and management tools'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFeatures.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of users who trust ImagePDFly for their document needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div>
              <div className="mb-4">
                <Logo size="sm" />
              </div>
              <p className="text-gray-400">
                Professional PDF processing tools for your business needs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Convert To PDF</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/image-to-pdf" className="hover:text-white transition-colors">Image to PDF</Link></li>
                <li><Link href="/jpeg-to-pdf" className="hover:text-white transition-colors">JPEG to PDF</Link></li>
                <li><Link href="/word-to-pdf" className="hover:text-white transition-colors">Word to PDF</Link></li>
                <li><Link href="/excel-to-pdf" className="hover:text-white transition-colors">Excel to PDF</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">PDF Tools</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/image-resizer" className="hover:text-white transition-colors">Image Resizer</Link></li>
                <li><Link href="/pdf-merge" className="hover:text-white transition-colors">Merge PDF</Link></li>
                <li><Link href="/pdf-split" className="hover:text-white transition-colors">Split PDF</Link></li>
                <li><Link href="/pdf-compress" className="hover:text-white transition-colors">Compress PDF</Link></li>
                <li><Link href="/pdf-remove-pages" className="hover:text-white transition-colors">Remove Pages</Link></li>
                <li><Link href="/pdf-resizer" className="hover:text-white transition-colors">PDF Resizer</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Convert From PDF</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pdf-to-jpg" className="hover:text-white transition-colors">PDF to JPG</Link></li>
                <li><Link href="/pdf-to-jpg" className="hover:text-white transition-colors">PDF to JPEG</Link></li>
                <li><Link href="/word-to-pdf" className="hover:text-white transition-colors">PDF to Word</Link></li>
                <li><Link href="/excel-to-pdf" className="hover:text-white transition-colors">PDF to Excel</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ImagePDFly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}