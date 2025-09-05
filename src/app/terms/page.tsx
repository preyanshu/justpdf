'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { Scale, AlertTriangle, Shield, FileText, Users, Ban } from 'lucide-react';

export default function TermsPage() {
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
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy</Link>
              <Link href="/terms" className="text-blue-600 font-medium">Terms</Link>
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Please read these terms carefully before using our services. 
            By using ImagePDFly, you agree to be bound by these terms.
          </p>
          <p className="text-sm opacity-90">Last updated: December 2024</p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            {/* Acceptance of Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
              <p className="text-lg text-gray-600 mb-4">
                By accessing and using ImagePDFly ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Important:</strong> These terms constitute a legally binding agreement between you and ImagePDFly. 
                  Please read them carefully before using our services.
                </p>
              </div>
            </div>

            {/* Description of Service */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Description of Service</h2>
              <p className="text-lg text-gray-600 mb-4">
                ImagePDFly provides online document conversion and manipulation tools, including but not limited to:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Conversion Tools</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Image to PDF conversion</li>
                    <li>• PDF to image conversion</li>
                    <li>• Word to PDF conversion</li>
                    <li>• Excel to PDF conversion</li>
                    <li>• JPEG to PDF conversion</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">PDF Tools</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• PDF merging</li>
                    <li>• PDF compression</li>
                    <li>• PDF splitting</li>
                    <li>• Page removal</li>
                    <li>• Image resizing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. User Responsibilities</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Lawful Use</h3>
                    <p className="text-gray-600">You agree to use the Service only for lawful purposes and in accordance with these Terms.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">File Ownership</h3>
                    <p className="text-gray-600">You must own or have proper authorization to use any files you upload for conversion.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-red-100 p-3 rounded-lg mr-4">
                    <Ban className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Prohibited Content</h3>
                    <p className="text-gray-600">You may not upload files containing illegal, harmful, or inappropriate content.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prohibited Uses */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Prohibited Uses</h2>
              <div className="bg-red-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">You may not use our Service:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>• To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>• To submit false or misleading information</li>
                  <li>• To upload or transmit viruses or any other type of malicious code</li>
                  <li>• To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>• For any obscene or immoral purpose</li>
                  <li>• To interfere with or circumvent the security features of the Service</li>
                </ul>
              </div>
            </div>

            {/* File Upload and Processing */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">5. File Upload and Processing</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>File Size Limits:</strong> Individual files must not exceed 100MB. 
                  We reserve the right to modify these limits at any time.
                </p>
                <p>
                  <strong>File Types:</strong> We support common image and document formats. 
                  Uploading unsupported file types may result in processing errors.
                </p>
                <p>
                  <strong>Processing Time:</strong> File processing times may vary based on file size, 
                  complexity, and server load. We do not guarantee specific processing times.
                </p>
                <p>
                  <strong>File Retention:</strong> Uploaded files are automatically deleted within 24 hours 
                  of processing. We do not store your files permanently.
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Intellectual Property Rights</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Service Ownership:</strong> The Service and its original content, features, and functionality 
                  are and will remain the exclusive property of ImagePDFly and its licensors.
                </p>
                <p>
                  <strong>User Content:</strong> You retain ownership of any files you upload. 
                  By uploading files, you grant us a limited license to process them for the purpose of providing our services.
                </p>
                <p>
                  <strong>Trademarks:</strong> The ImagePDFly name, logo, and related marks are trademarks of ImagePDFly. 
                  You may not use these marks without our prior written consent.
                </p>
              </div>
            </div>

            {/* Privacy and Data Protection */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Privacy and Data Protection</h2>
              <div className="bg-blue-50 p-6 rounded-xl">
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information.
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>• We do not store your uploaded files permanently</p>
                  <p>• All data transmission is encrypted</p>
                  <p>• We comply with applicable data protection laws</p>
                  <p>• You can request deletion of your personal data at any time</p>
                </div>
                <p className="text-gray-700 mt-4">
                  Please review our <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</Link> for more details.
                </p>
              </div>
            </div>

            {/* Service Availability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Service Availability</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Uptime:</strong> We strive to maintain high service availability but do not guarantee 
                  uninterrupted access to the Service.
                </p>
                <p>
                  <strong>Maintenance:</strong> We may temporarily suspend the Service for maintenance, 
                  updates, or technical improvements.
                </p>
                <p>
                  <strong>Force Majeure:</strong> We are not liable for any failure to perform due to 
                  circumstances beyond our reasonable control.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Limitation of Liability</h2>
              <div className="bg-yellow-50 p-6 rounded-xl">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Legal Notice</h3>
                    <p className="text-gray-700 mb-4">
                      In no event shall ImagePDFly, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                      be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                      limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                    </p>
                    <p className="text-gray-700">
                      Our total liability to you for any damages shall not exceed the amount you paid us, if any, 
                      for accessing the Service in the 12 months prior to the claim.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer of Warranties */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Disclaimer of Warranties</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. ImagePDFly expressly disclaims all warranties 
                  of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, 
                  fitness for a particular purpose, and non-infringement.
                </p>
                <p>
                  We do not warrant that the Service will be uninterrupted, timely, secure, or error-free, or that any defects 
                  will be corrected.
                </p>
              </div>
            </div>

            {/* Termination */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Termination</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We may terminate or suspend your access to the Service immediately, without prior notice or liability, 
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will cease immediately. All provisions of the Terms 
                  which by their nature should survive termination shall survive termination.
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">12. Changes to Terms</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p>
                  By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">13. Governing Law</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which ImagePDFly operates, 
                  without regard to its conflict of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p><strong>Email:</strong> legal@imagepdfly.com</p>
                <p><strong>Address:</strong> ImagePDFly Legal Department</p>
                <p><strong>Response Time:</strong> We will respond within 5 business days.</p>
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
