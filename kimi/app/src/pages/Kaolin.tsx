import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Info, 
  Mail,
  ArrowRight,
  Palette,
  Building2,
  Shirt,
  Award
} from 'lucide-react';

const navLinks = [
  { label: 'Shop', href: '#shop' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const features = [
  { icon: Building2, label: 'Street Culture' },
  { icon: Palette, label: 'Digital Art' },
  { icon: Shirt, label: 'Urban Style' },
  { icon: Award, label: 'Premium Quality' },
];

const products = [
  {
    id: 'kaolin-urban-tee',
    name: 'KAOLIN Urban Tee',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    description: 'Premium streetwear tee featuring our signature urban design aesthetic.',
  },
  {
    id: 'kaolin-hoodie',
    name: 'Digital Print Hoodie',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    description: 'Comfort meets style with our signature digital art print design.',
  },
  {
    id: 'kaolin-stickers',
    name: 'Signature Sticker Pack',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
    description: 'Express your style with our exclusive street art sticker collection.',
  },
];

const galleryImages = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' as const },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

export default function Kaolin() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-kaolin-dark">
      {/* Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-kaolin-dark/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/Kaolin/" className="font-brand text-xl font-bold text-kaolin-text tracking-wider">
              KAOLIN
            </a>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-kaolin-text/80 hover:text-kaolin-text hover:bg-white/10 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <Button
              size="sm"
              className="bg-kaolin-accent text-kaolin-dark hover:bg-kaolin-accent/90"
              asChild
            >
              <a href="#shop">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop
              </a>
            </Button>
          </div>
        </nav>
      </motion.header>

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-kaolin via-kaolin-light to-kaolin-dark">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(52, 211, 153, 0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto bg-kaolin-text rounded-full flex items-center justify-center mb-6">
                <span className="font-brand text-4xl font-bold text-kaolin">K</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-kaolin-text mb-4 tracking-wider"
            >
              KAOLIN
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl text-kaolin-accent mb-8"
            >
              Premium Streetwear
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-kaolin-accent text-kaolin-dark hover:bg-kaolin-accent/90 font-semibold"
                asChild
              >
                <a href="#shop">
                  Shop Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-kaolin-text text-kaolin-text hover:bg-kaolin-text/10"
                asChild
              >
                <a href="#about">
                  <Info className="mr-2 w-5 h-5" />
                  Our Story
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-kaolin-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center p-4 bg-kaolin-accent/10 rounded-full mb-3">
                    <feature.icon className="w-6 h-6 text-kaolin-accent" />
                  </div>
                  <p className="text-kaolin-text font-medium">{feature.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Shop Section */}
        <section id="shop" className="py-24 bg-kaolin">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-kaolin-text mb-4">
                Latest Collection
              </h2>
              <p className="text-kaolin-text/70 max-w-2xl mx-auto">
                Discover our curated selection of premium streetwear pieces designed for the modern urban lifestyle.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group bg-kaolin-dark border-kaolin-light/30 overflow-hidden hover:border-kaolin-accent/50 transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-kaolin-text mb-1">
                        {product.name}
                      </h3>
                      <p className="text-kaolin-text/60 text-sm mb-3">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-kaolin-accent">
                          €{product.price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          className="bg-kaolin-accent text-kaolin-dark hover:bg-kaolin-accent/90"
                          asChild
                        >
                          <a href={`mailto:info@protolab.tech?subject=Inquiry: ${encodeURIComponent(product.name)}`}>
                            Inquire
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 bg-kaolin-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-kaolin-text mb-4">
                Street Gallery
              </h2>
              <p className="text-kaolin-text/70 max-w-2xl mx-auto">
                A visual journey through urban culture and style.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-kaolin-accent/0 group-hover:bg-kaolin-accent/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-kaolin">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeInUp} className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-kaolin-text mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-kaolin-text/80">
                <p>
                  KAOLIN was born from a passion for street culture and digital art. 
                  We believe that fashion is more than just clothing—it&apos;s a form of self-expression, 
                  a canvas for creativity, and a way to connect with like-minded individuals.
                </p>
                <p>
                  Each piece in our collection is carefully designed and crafted with premium materials, 
                  ensuring both style and comfort. From our signature urban tees to our digital print hoodies, 
                  every item tells a story of urban exploration and artistic expression.
                </p>
                <p>
                  Join us on our journey to redefine streetwear, one piece at a time.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-kaolin-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl sm:text-4xl font-bold text-kaolin-text mb-6">
                Get in Touch
              </h2>
              <p className="text-kaolin-text/70 mb-8 max-w-xl mx-auto">
                Have questions about our collection or want to collaborate? 
                We&apos;d love to hear from you.
              </p>
              <Button
                size="lg"
                className="bg-kaolin-accent text-kaolin-dark hover:bg-kaolin-accent/90"
                asChild
              >
                <a href="mailto:info@protolab.tech">
                  <Mail className="mr-2 w-5 h-5" />
                  Contact Us
                </a>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-kaolin-dark border-t border-kaolin-light/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-brand text-2xl font-bold text-kaolin-text mb-2">KAOLIN</h3>
              <p className="text-kaolin-text/60 text-sm">Premium Streetwear</p>
            </div>
            <div className="flex items-center gap-6">
              <a href="#shop" className="text-kaolin-text/60 hover:text-kaolin-accent transition-colors">
                Shop
              </a>
              <a href="#gallery" className="text-kaolin-text/60 hover:text-kaolin-accent transition-colors">
                Gallery
              </a>
              <a href="#about" className="text-kaolin-text/60 hover:text-kaolin-accent transition-colors">
                About
              </a>
              <a href="/policy.html" className="text-kaolin-text/60 hover:text-kaolin-accent transition-colors">
                Privacy
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-kaolin-light/20 text-center">
            <p className="text-kaolin-text/40 text-sm">
              &copy; {new Date().getFullYear()} KAOLIN. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
