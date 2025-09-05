'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { AlertTriangle, Shield, FileText, Clock, Ban, Info } from 'lucide-react';

export default function DisclaimerPage() {
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
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Disclaimer</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Important information about the limitations and risks associated with using our services.
          </p>
          <p className="text-sm opacity-90">Last updated: December 2024</p>
        </div>
      </section>

      {/* Disclaimer Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            {/* Important Notice */}
            <div className="mb-12">
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold text-red-800 mb-2">Important Notice</h2>
                    <p className="text-red-700">
                      Please read this disclaimer carefully before using ImagePDFly services. 
                      By using our services, you acknowledge that you have read, understood, and agree to be bound by this disclaimer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Limitations */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Limitations</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Time</h3>
                    <p className="text-gray-600">
                      File processing times may vary based on file size, complexity, and server load. 
                      We do not guarantee specific processing times and are not responsible for delays.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">File Size Limits</h3>
                    <p className="text-gray-600">
                      We impose file size limits (currently 100MB per file). Files exceeding these limits 
                      will be rejected. We reserve the right to modify these limits without notice.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                    <Shield className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                    <p className="text-gray-600">
                      While we strive for high-quality conversions, we cannot guarantee perfect results 
                      for all file types or complex documents. Results may vary based on source file quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Limitations */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Technical Limitations</h2>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">We cannot guarantee:</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <Ban className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <span>Perfect conversion of all file formats or complex documents</span>
                  </li>
                  <li className="flex items-start">
                    <Ban className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <span>Preservation of all formatting, fonts, or special elements</span>
                  </li>
                  <li className="flex items-start">
                    <Ban className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <span>Conversion of password-protected or encrypted files</span>
                  </li>
                  <li className="flex items-start">
                    <Ban className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <span>Processing of corrupted or damaged files</span>
                  </li>
                  <li className="flex items-start">
                    <Ban className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <span>100% accuracy in OCR (Optical Character Recognition) results</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Data and Privacy */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Data and Privacy Disclaimer</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>File Processing:</strong> Your files are processed on our servers and may be temporarily stored 
                  during processing. While we implement security measures, you acknowledge that no method of transmission 
                  over the internet is 100% secure.
                </p>
                <p>
                  <strong>Automatic Deletion:</strong> We automatically delete your files after processing, typically within 24 hours. 
                  However, we cannot guarantee immediate deletion in all circumstances.
                </p>
                <p>
                  <strong>Third-Party Services:</strong> We may use third-party services for file processing. 
                  While we choose reputable providers, we are not responsible for their data handling practices.
                </p>
                <p>
                  <strong>Backup and Recovery:</strong> We do not maintain backups of your files. 
                  If you need your files after processing, please download them immediately.
                </p>
              </div>
            </div>

            {/* Service Availability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Availability</h2>
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">We do not guarantee:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Uninterrupted access to our services</li>
                  <li>• 100% uptime or availability</li>
                  <li>• Immediate response to technical issues</li>
                  <li>• Compatibility with all devices or browsers</li>
                  <li>• Support for all file formats or versions</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Service may be temporarily unavailable due to maintenance, updates, technical issues, 
                  or circumstances beyond our control.
                </p>
              </div>
            </div>

            {/* User Responsibility */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">User Responsibility</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>File Ownership:</strong> You are solely responsible for ensuring you have the right to upload 
                  and process any files you submit. We are not liable for copyright infringement or other legal issues.
                </p>
                <p>
                  <strong>Backup:</strong> You should maintain backups of important files before uploading them for processing. 
                  We are not responsible for data loss.
                </p>
                <p>
                  <strong>Compliance:</strong> You must comply with all applicable laws and regulations when using our services. 
                  We are not responsible for your compliance with such laws.
                </p>
                <p>
                  <strong>Security:</strong> You are responsible for maintaining the security of your account and any files you upload. 
                  We are not liable for unauthorized access to your account or files.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Important Legal Notice</h3>
                <p className="text-red-700 mb-4">
                  To the maximum extent permitted by law, ImagePDFly and its affiliates shall not be liable for any direct, 
                  indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                </p>
                <ul className="space-y-2 text-red-700">
                  <li>• Loss of data or files</li>
                  <li>• Loss of profits or business opportunities</li>
                  <li>• Service interruptions or downtime</li>
                  <li>• Conversion errors or quality issues</li>
                  <li>• Security breaches or data exposure</li>
                  <li>• Third-party actions or omissions</li>
                </ul>
                <p className="text-red-700 mt-4">
                  Our total liability to you shall not exceed the amount you paid us, if any, for using our services 
                  in the 12 months prior to the claim.
                </p>
              </div>
            </div>

            {/* No Warranty */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">No Warranty</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our services are provided "AS IS" and "AS AVAILABLE" without any warranties, express or implied. 
                  We disclaim all warranties, including but not limited to:
                </p>
                <ul className="space-y-2 ml-6">
                  <li>• Warranties of merchantability and fitness for a particular purpose</li>
                  <li>• Warranties of non-infringement</li>
                  <li>• Warranties regarding accuracy, reliability, or completeness</li>
                  <li>• Warranties regarding security or privacy</li>
                  <li>• Warranties regarding continuous or error-free operation</li>
                </ul>
              </div>
            </div>

            {/* Third-Party Content */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Third-Party Content and Services</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our services may include links to third-party websites or services. We are not responsible for the content, 
                  privacy policies, or practices of these third parties.
                </p>
                <p>
                  We may use third-party services for file processing, analytics, or other functions. 
                  We are not liable for any issues arising from these third-party services.
                </p>
              </div>
            </div>

            {/* Changes to Disclaimer */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Changes to This Disclaimer</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We reserve the right to modify this disclaimer at any time. Changes will be effective immediately 
                  upon posting on our website.
                </p>
                <p>
                  Your continued use of our services after changes are posted constitutes acceptance of the modified disclaimer.
                </p>
                <p>
                  We encourage you to review this disclaimer periodically to stay informed of any updates.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About This Disclaimer</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this disclaimer or our services, please contact us:
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
