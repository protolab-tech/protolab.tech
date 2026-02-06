import { motion } from 'framer-motion';
import { Shield, Cookie, Mail, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.section {...fadeInUp} className="mb-12">
    <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
    <div className="text-neutral-300 space-y-3">{children}</div>
  </motion.section>
);

export default function Policy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-neutral-900 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="text-neutral-400 hover:text-amber-500 transition-colors">
              protolab.tech
            </a>
            <h1 className="text-lg font-semibold text-white">Policies</h1>
          </div>
        </div>
      </header>

      <main id="main-content" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Privacy Policy */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-3 bg-amber-100 rounded-lg">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Privacy Policy</h1>
                <p className="text-neutral-500">Last updated: January 2025</p>
              </div>
            </motion.div>

            <Section title="Data Controller">
              <p>
                <strong>Protolab.tech</strong> operates as the data controller for personal 
                information collected through our websites. For any privacy-related inquiries, 
                please contact us at{' '}
                <a
                  href="mailto:info@protolab.tech"
                  className="text-amber-600 hover:text-amber-700 underline"
                >
                  info@protolab.tech
                </a>.
              </p>
            </Section>

            <Section title="What Personal Data We Collect">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Contact Information:</strong> Name, email address when you contact us 
                    or book appointments
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Usage Data:</strong> IP address, browser type, pages visited 
                    (only with consent for analytics)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Communication Data:</strong> Content of messages you send to us
                  </span>
                </li>
              </ul>
            </Section>

            <Section title="How We Use Your Data">
              <p className="mb-3">We process personal data based on the following legal grounds:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Consent:</strong> For analytics cookies and marketing communications
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Legitimate Interest:</strong> To respond to inquiries and improve our services
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Contract Performance:</strong> To fulfill service requests and appointments
                  </span>
                </li>
              </ul>
            </Section>

            <Section title="Data Retention">
              <p className="mb-3">
                We retain personal data only as long as necessary for the purposes collected 
                or as required by law. Typically:
              </p>
              <ul className="space-y-2">
                <li>Contact inquiries: 2 years from last contact</li>
                <li>Service appointments: 3 years for business records</li>
                <li>Analytics data: 26 months (Google Analytics default)</li>
              </ul>
            </Section>

            <Section title="Your Rights (GDPR/CCPA)">
              <p className="mb-3">You have the right to:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Access your personal data',
                  'Rectify inaccurate data',
                  'Delete your data',
                  'Restrict processing',
                  'Object to processing',
                  'Data portability',
                  'Withdraw consent at any time',
                ].map((right) => (
                  <li key={right} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    {right}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Data Sharing">
              <p>
                We do not sell personal data. We may share data with:
              </p>
              <ul className="space-y-2 mt-2">
                <li>Service providers (email, hosting) under data processing agreements</li>
                <li>Google Analytics (Ireland) for website analytics (with consent)</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </Section>

            <Section title="Contact for Privacy Requests">
              <p>
                To exercise your rights or for any privacy-related questions, please contact:
              </p>
              <div className="mt-3 p-4 bg-neutral-100 rounded-lg">
                <a
                  href="mailto:info@protolab.tech"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                >
                  <Mail className="w-5 h-5" />
                  info@protolab.tech
                </a>
              </div>
            </Section>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 my-12" />

          {/* Cookie Policy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="p-3 bg-amber-100 rounded-lg">
                <Cookie className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Cookie Policy</h1>
                <p className="text-neutral-500">Last updated: January 2025</p>
              </div>
            </motion.div>

            <Section title="What Are Cookies">
              <p>
                Cookies are small text files stored on your device that help websites function 
                properly and provide analytics information. They cannot harm your device and 
                do not contain viruses.
              </p>
            </Section>

            <Section title="Types of Cookies We Use">
              <div className="space-y-4">
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-2">Necessary Cookies</h3>
                  <p className="text-sm">
                    Essential for the website to function properly. These cannot be disabled 
                    as they are required for basic features like navigation and security.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-2">Analytics Cookies</h3>
                  <p className="text-sm">
                    Help us understand how visitors interact with our website by collecting 
                    anonymous information. We use Google Analytics for this purpose.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900 mb-2">Marketing Cookies</h3>
                  <p className="text-sm">
                    Used to deliver personalized advertisements and track their performance. 
                    Currently not in use on this website.
                  </p>
                </div>
              </div>
            </Section>

            <Section title="Managing Cookies">
              <p className="mb-3">
                You can manage your cookie preferences at any time by:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Using the cookie consent banner when you first visit our site
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Clearing your browser cookies to reset preferences
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Adjusting your browser settings to block cookies
                  </span>
                </li>
              </ul>
            </Section>

            <Section title="Third-Party Cookies">
              <p>
                We use Google Analytics which sets cookies to help us analyze website traffic. 
                These cookies are only set with your consent. For more information about 
                Google&apos;s privacy practices, please visit{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-700 underline inline-flex items-center gap-1"
                >
                  Google Privacy Policy
                  <ExternalLink className="w-3 h-3" />
                </a>.
              </p>
            </Section>

            <Section title="Updates to This Policy">
              <p>
                We may update this Cookie Policy from time to time. Any changes will be 
                posted on this page with an updated revision date. We encourage you to 
                review this policy periodically.
              </p>
            </Section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} protolab.tech. All rights reserved.
          </p>
          <a
            href="/"
            className="text-amber-500 hover:text-amber-400 text-sm mt-2 inline-block"
          >
            Return to Homepage
          </a>
        </div>
      </footer>
    </div>
  );
}
