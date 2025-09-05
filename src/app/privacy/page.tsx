'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { Shield, Eye, Lock, Database, Trash2, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
              <Link href="/privacy" className="text-blue-600 font-medium">Privacy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Terms</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
              <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm opacity-90">Last updated: December 2024</p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Introduction</h2>
              <p className="text-lg text-gray-600 mb-4">
                At ImagePDFly, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
              <p className="text-lg text-gray-600">
                By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Information We Collect</h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <UserCheck className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                  </div>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Name and email address (when you contact us)</li>
                    <li>• Account information (if you create an account)</li>
                    <li>• Communication preferences</li>
                    <li>• Support requests and feedback</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <Database className="w-6 h-6 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Usage Information</h3>
                  </div>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Files you upload for conversion</li>
                    <li>• Conversion preferences and settings</li>
                    <li>• Website usage patterns and analytics</li>
                    <li>• Device and browser information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Provision</h3>
                    <p className="text-gray-600">To provide, maintain, and improve our conversion services and user experience.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics and Improvement</h3>
                    <p className="text-gray-600">To analyze usage patterns and improve our services, features, and performance.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Security and Compliance</h3>
                    <p className="text-gray-600">To ensure security, prevent fraud, and comply with legal obligations.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Communication</h3>
                    <p className="text-gray-600">To respond to your inquiries and provide customer support.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Security</h2>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">We implement multiple security measures:</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <Lock className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <span><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols.</span>
                  </li>
                  <li className="flex items-start">
                    <Trash2 className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <span><strong>Automatic Deletion:</strong> Your uploaded files are automatically deleted after processing (within 24 hours).</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <span><strong>Access Controls:</strong> Strict access controls limit who can view your data to authorized personnel only.</span>
                  </li>
                  <li className="flex items-start">
                    <Database className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <span><strong>Secure Infrastructure:</strong> Our servers are hosted on secure, compliant cloud infrastructure.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* File Processing */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">File Processing and Storage</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Processing:</strong> When you upload files for conversion, they are processed on our secure servers. 
                  We do not store your files permanently.
                </p>
                <p>
                  <strong>Retention:</strong> Files are automatically deleted from our servers within 24 hours of processing. 
                  We do not keep copies of your documents.
                </p>
                <p>
                  <strong>No Human Access:</strong> Your files are processed automatically by our systems. 
                  Our staff does not have access to view your documents.
                </p>
                <p>
                  <strong>Third-Party Services:</strong> We may use third-party services for file processing, 
                  but they are bound by strict confidentiality agreements.
                </p>
              </div>
            </div>

            {/* Cookies and Tracking */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookies and Tracking</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze usage, and improve our services.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Types of cookies we use:</h4>
                  <ul className="space-y-1">
                    <li>• <strong>Essential cookies:</strong> Required for basic website functionality</li>
                    <li>• <strong>Analytics cookies:</strong> Help us understand how you use our website</li>
                    <li>• <strong>Preference cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                </div>
                <p>
                  You can control cookie settings through your browser preferences. 
                  Note that disabling certain cookies may affect website functionality.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Rights</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Access and Control</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Access your personal information</li>
                    <li>• Correct inaccurate data</li>
                    <li>• Request data deletion</li>
                    <li>• Opt-out of communications</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Portability</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Export your data</li>
                    <li>• Transfer to another service</li>
                    <li>• Receive data in readable format</li>
                    <li>• Withdraw consent anytime</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Third-Party Services */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                We may use third-party services for analytics, hosting, and other functions. 
                These services have their own privacy policies and data practices.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Third-party services we use:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Google Analytics (website analytics)</li>
                  <li>• Cloud hosting providers (file processing)</li>
                  <li>• Email services (communications)</li>
                  <li>• CDN services (content delivery)</li>
                </ul>
              </div>
            </div>

            {/* Changes to Policy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Posting the new Privacy Policy on this page</li>
                <li>• Updating the "Last updated" date</li>
                <li>• Sending you an email notification (for significant changes)</li>
                <li>• Displaying a notice on our website</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p><strong>Email:</strong> privacy@imagepdfly.com</p>
                <p><strong>Address:</strong> ImagePDFly Privacy Team</p>
                <p><strong>Response Time:</strong> We will respond within 30 days of receiving your inquiry.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="md" />
              <p className="mt-4 text-gray-400">
                Professional PDF and image conversion tools for all your document needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Tools</h3>
              <ul className="space-y-2">
                <li><Link href="/image-to-pdf" className="text-gray-400 hover:text-white transition-colors">Image to PDF</Link></li>
                <li><Link href="/pdf-to-jpg" className="text-gray-400 hover:text-white transition-colors">PDF to JPG</Link></li>
                <li><Link href="/pdf-merge" className="text-gray-400 hover:text-white transition-colors">PDF Merge</Link></li>
                <li><Link href="/pdf-compress" className="text-gray-400 hover:text-white transition-colors">PDF Compress</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/disclaimer" className="text-gray-400 hover:text-white transition-colors">Disclaimer</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
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
