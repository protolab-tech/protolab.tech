import { Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  email?: string;
  showLinks?: boolean;
  variant?: 'dark' | 'kaolin';
}

export function Footer({ email = 'info@protolab.tech', showLinks = true, variant = 'dark' }: FooterProps) {
  const bgClass = variant === 'kaolin' ? 'bg-kaolin-dark' : 'bg-neutral-950';
  const textClass = variant === 'kaolin' ? 'text-kaolin-text' : 'text-white';
  const mutedClass = variant === 'kaolin' ? 'text-kaolin-text/60' : 'text-neutral-400';

  return (
    <footer className={`${bgClass} border-t border-white/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className={`font-brand text-xl font-bold ${textClass} mb-4`}>
              protolab.tech
            </h3>
            <p className={`${mutedClass} text-sm`}>
              Innovative prototyping solutions for creative realities.
            </p>
          </div>

          {/* Quick Links */}
          {showLinks && (
            <div>
              <h4 className={`font-medium ${textClass} mb-4`}>Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/Chosko/" className={`${mutedClass} text-sm hover:text-blue-500 transition-colors`}>
                    Chosko
                  </a>
                </li>
                <li>
                  <a href="/Kaolin/" className={`${mutedClass} text-sm hover:text-blue-500 transition-colors`}>
                    Kaolin
                  </a>
                </li>
                <li>
                  <a href="/service-appointments/" className={`${mutedClass} text-sm hover:text-blue-500 transition-colors`}>
                    Service Appointments
                  </a>
                </li>
                <li>
                  <a href="/policy.html" className={`${mutedClass} text-sm hover:text-blue-500 transition-colors`}>
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h4 className={`font-medium ${textClass} mb-4`}>Contact Us</h4>
            <a
              href={`mailto:${email}`}
              className={`inline-flex items-center gap-2 ${mutedClass} text-sm hover:text-blue-500 transition-colors`}
            >
              <Mail className="w-4 h-4" />
              {email}
            </a>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <p className={`${mutedClass} text-sm`}>
            &copy; {new Date().getFullYear()} protolab.tech. All rights reserved.
          </p>
          <a
            href="/policy.html"
            className={`inline-flex items-center gap-1 ${mutedClass} text-sm hover:text-blue-500 transition-colors`}
          >
            Privacy & Cookie Policy
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
