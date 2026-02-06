import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavLink {
  label: string;
  href: string;
}

interface NavigationProps {
  links: NavLink[];
  logo: string;
  logoHref?: string;
  variant?: 'dark' | 'kaolin';
}

export function Navigation({ links, logo, logoHref = '/', variant = 'dark' }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgClass = variant === 'kaolin' 
    ? (isScrolled ? 'bg-kaolin-dark/95' : 'bg-transparent')
    : (isScrolled ? 'bg-black/80' : 'bg-transparent');

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? `${bgClass} backdrop-blur-xl shadow-lg` : ''
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href={logoHref}
              className={`font-brand text-xl font-bold transition-colors ${
                variant === 'kaolin' ? 'text-kaolin-text' : 'text-white'
              } hover:text-blue-500`}
            >
              {logo}
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10 ${
                    variant === 'kaolin' ? 'text-kaolin-text' : 'text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${variant === 'kaolin' ? 'text-kaolin-text' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-30 pt-16 ${
              variant === 'kaolin' ? 'bg-kaolin-dark/98' : 'bg-black/98'
            } backdrop-blur-xl md:hidden`}
          >
            <nav className="flex flex-col items-center justify-center h-full gap-6">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-medium transition-colors hover:text-blue-500 ${
                    variant === 'kaolin' ? 'text-kaolin-text' : 'text-white'
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
