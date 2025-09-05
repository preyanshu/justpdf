import { FileText, Image, FileSpreadsheet, Presentation, Scissors, Merge, Download } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'Image to PDF',
      description: 'Convert images to PDF documents',
      icon: Image,
      href: '/image-to-pdf',
      color: 'bg-blue-500'
    },
    {
      title: 'Word to PDF',
      description: 'Convert Word documents to PDF',
      icon: FileText,
      href: '/word-to-pdf',
      color: 'bg-green-500'
    },
    {
      title: 'Excel to PDF',
      description: 'Convert Excel spreadsheets to PDF',
      icon: FileSpreadsheet,
      href: '/excel-to-pdf',
      color: 'bg-orange-500'
    },
    {
      title: 'PowerPoint to PDF',
      description: 'Convert PowerPoint presentations to PDF',
      icon: Presentation,
      href: '/powerpoint-to-pdf',
      color: 'bg-purple-500'
    },
    {
      title: 'PDF Resizer',
      description: 'Compress and resize PDF files',
      icon: Scissors,
      href: '/pdf-resizer',
      color: 'bg-red-500'
    },
    {
      title: 'PDF Merge',
      description: 'Merge multiple PDFs into one',
      icon: Merge,
      href: '/pdf-merge',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">JustPDF</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Convert, Merge & Resize
            <span className="text-blue-600"> PDFs</span> Online
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional PDF processing tools for your business. Convert documents, merge files, 
            and optimize PDFs with our secure, fast, and easy-to-use platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Get Started Free
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              View Features
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All-in-One PDF Solution
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to work with PDFs, all in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  href={feature.href}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Process Your PDFs?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust JustPDF for their document needs
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Processing Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-xl font-bold">JustPDF</span>
              </div>
              <p className="text-gray-400">
                Professional PDF processing tools for your business needs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Image to PDF</li>
                <li>Word to PDF</li>
                <li>Excel to PDF</li>
                <li>PowerPoint to PDF</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Tools</h3>
              <ul className="space-y-2 text-gray-400">
                <li>PDF Resizer</li>
                <li>PDF Merge</li>
                <li>PDF Split</li>
                <li>PDF Compress</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 JustPDF. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
