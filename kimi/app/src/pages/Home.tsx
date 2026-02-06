import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Printer, 
  Scissors, 
  PenTool, 
  Code,
  ArrowRight, 
  ChevronDown,
  Mail
} from 'lucide-react';

const navLinks = [
  { label: 'Chosko', href: '/Chosko/' },
  { label: 'Kaolin', href: '/Kaolin/' },
  { label: 'EvoSimGame', href: '/EvoSimGame/' },
  { label: 'Service Appointments', href: '/service-appointments/' },
];

const services = [
  {
    icon: Printer,
    title: '3D Printed Prototype',
    description: 'Experience our state-of-the-art 3D printing capabilities. From concept to physical model with precision and speed.',
    image: '/assets/images/3dprinters.jpg',
  },
  {
    icon: Scissors,
    title: 'Laser Cutting',
    description: 'Precision laser cutting for intricate and detailed designs. Perfect for custom parts and artistic creations.',
    image: '/assets/images/laser.jpg',
  },
  {
    icon: PenTool,
    title: 'CNC Engraving',
    description: 'Intricate engraving that brings bespoke designs to life. Detailed craftsmanship for unique products.',
    image: '/assets/images/cnc.jpg',
  },
  {
    icon: Code,
    title: 'Software Solutions',
    description: 'Custom software development for automation, design tools, and digital experiences tailored to your needs.',
    image: '/assets/images/hero.jpg',
  },
];



const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

const staggerContainer = {
  initial: {},
  whileInView: {},
  viewport: { once: true },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Navigation links={navLinks} logo="protolab.tech" />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
          
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                }}
                animate={{
                  y: [null, -20, 20],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                Welcome to{' '}
                <span className="text-gradient-blue">protolab.tech</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-lg sm:text-xl text-neutral-400 max-w-3xl mx-auto mb-10"
            >
              We provide services to creative realities wanting to prototype their product ideas 
              using innovative methods. Our expertise includes 3D printing, laser cutting, 
              CNC engraving, and creative design support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-blue-500 text-white hover:bg-blue-600 font-semibold px-8"
                asChild
              >
                <a href="#services">
                  Explore Services
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-neutral-700 text-white hover:bg-white/10"
                asChild
              >
                <a href="/service-appointments/">
                  Book Appointment
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-8 h-8 text-neutral-500" />
            </motion.div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-neutral-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Our Services
              </h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">
                From concept to prototype, we offer comprehensive solutions to bring your ideas to life.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  variants={staggerItem}
                  custom={index}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group bg-neutral-900 border-neutral-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <service.icon className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-neutral-400">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-neutral-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              {...fadeInUp}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Bring Your Ideas to Life?
              </h2>
              <p className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto">
                Contact us today to discuss your project and get a quote for your prototyping needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-blue-500 text-white hover:bg-blue-600 font-semibold"
                  asChild
                >
                  <a href="mailto:info@protolab.tech">
                    <Mail className="mr-2 w-5 h-5" />
                    Contact Us
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-neutral-700 text-white hover:bg-white/10"
                  asChild
                >
                  <a href="/service-appointments/">
                    Book an Appointment
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer email="info@protolab.tech" />
    </div>
  );
}
