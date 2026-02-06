import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider, useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

const products: Product[] = [
  {
    id: 'chosko-blue-tee',
    name: 'Chosko Blue Signature Tee',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    description: 'Premium cotton tee with signature Chosko design in royal blue.',
  },
  {
    id: 'chosko-brown-tee',
    name: 'Chosko Brown Classic Tee',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80',
    description: 'Earth-toned classic tee with minimalist Chosko branding.',
  },
  {
    id: 'chosko-black-hoodie',
    name: 'Chosko Black Hoodie',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    description: 'Premium black hoodie with embroidered Chosko logo.',
  },
  {
    id: 'chosko-white-tee',
    name: 'Chosko White Essential Tee',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80',
    description: 'Clean white essential tee for everyday wear.',
  },
  {
    id: 'chosko-cap',
    name: 'Chosko Logo Cap',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
    description: 'Adjustable cap with embroidered Chosko logo.',
  },
  {
    id: 'chosko-tote',
    name: 'Chosko Canvas Tote',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
    description: 'Durable canvas tote bag with printed design.',
  },
];

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="font-brand text-xl font-bold text-white">CHOSKO</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <nav className="flex flex-col items-center justify-center flex-1 gap-8">
                <a
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl text-white hover:text-amber-500 transition-colors"
                >
                  Home
                </a>
                <a
                  href="/Kaolin/"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl text-white hover:text-amber-500 transition-colors"
                >
                  Kaolin
                </a>
                <a
                  href="/service-appointments/"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl text-white hover:text-amber-500 transition-colors"
                >
                  Appointments
                </a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CartButton() {
  const { totalItems, setIsOpen } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative text-white hover:bg-white/10"
      onClick={() => setIsOpen(true)}
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <Badge className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs min-w-[20px] h-5 flex items-center justify-center">
          {totalItems}
        </Badge>
      )}
    </Button>
  );
}

function CartSidebar() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    const subject = encodeURIComponent('Chosko Order Inquiry');
    const body = encodeURIComponent(
      `Hello Chosko Team,\n\nI would like to inquire about the following items:\n\n${items
        .map((item) => `- ${item.name} (Qty: ${item.quantity}) - €${(item.price * item.quantity).toFixed(2)}`)
        .join('\n')}\n\nTotal: €${totalPrice.toFixed(2)}\n\nPlease let me know the next steps to complete my order.\n\nBest regards`
    );
    window.location.href = `mailto:chosko@protolab.tech?subject=${subject}&body=${body}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-neutral-900 border-neutral-800 text-white">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-500" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-200px)] mt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">Your cart is empty</p>
              <p className="text-sm mt-2">Add some items to get started</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-4 pr-2">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-3 bg-neutral-800 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{item.name}</h4>
                      <p className="text-amber-500 font-semibold">€{item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-white hover:bg-white/10"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-white hover:bg-white/10"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-auto"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <SheetFooter className="flex-col gap-4 mt-4 pt-4 border-t border-neutral-800">
                <div className="flex justify-between items-center w-full">
                  <span className="text-neutral-400">Total</span>
                  <span className="text-2xl font-bold text-white">€{totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-amber-500 text-black hover:bg-amber-600 font-semibold"
                  onClick={handleCheckout}
                >
                  Checkout (demo)
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-neutral-700 text-white hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-neutral-400 hover:text-white"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem, setIsOpen } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setTimeout(() => {
      setIsAdding(false);
      setIsOpen(true);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-square overflow-hidden bg-neutral-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
          <p className="text-neutral-400 text-sm mb-3">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-amber-500">€{product.price.toFixed(2)}</span>
            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="bg-amber-500 text-black hover:bg-amber-600"
              size="sm"
            >
              {isAdding ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center"
                >
                  Added!
                </motion.div>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChoskoContent() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-16">
          <MobileMenu />
          <a href="/Chosko/" className="font-brand text-xl font-bold text-white tracking-wider">
            CHOSKO
          </a>
          <CartButton />
        </div>
      </header>

      <main id="main-content" className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-6" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                CHOSKO
              </h1>
              <p className="text-xl sm:text-2xl text-amber-500 font-medium mb-6">
                Siamo nati per brillare
              </p>
              <p className="text-neutral-400 max-w-xl mx-auto">
                Premium fashion collection designed for those who dare to shine. 
                Each piece tells a story of craftsmanship and style.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-white mb-8 text-center"
            >
              Latest Collection
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-neutral-400 mb-6">
              Have questions about our products? We&apos;re here to help.
            </p>
            <a
              href="mailto:chosko@protolab.tech"
              className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors"
            >
              chosko@protolab.tech
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} CHOSKO. All rights reserved.
          </p>
          <a
            href="/policy.html"
            className="text-neutral-500 text-sm hover:text-amber-500 transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </footer>

      <CartSidebar />
    </div>
  );
}

export default function Chosko() {
  return (
    <CartProvider>
      <ChoskoContent />
    </CartProvider>
  );
}
