import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Mail, User, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

export default function ServiceAppointments() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferredDate: '',
    endDate: '',
    message: '',
  });
  const [specifyEndDate, setSpecifyEndDate] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent('Service Appointment Request');
    const body = encodeURIComponent(
      `Hello Protolab Team,\n\n` +
      `I would like to request a service appointment with the following details:\n\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Preferred Date: ${formData.preferredDate}${
        specifyEndDate && formData.endDate ? ` to ${formData.endDate}` : ''
      }\n\n` +
      `Message:\n${formData.message || 'No additional message'}\n\n` +
      `Please confirm my appointment.\n\n` +
      `Best regards,\n${formData.name}`
    );
    
    window.location.href = `mailto:info@protolab.tech?subject=${subject}&body=${body}`;
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Get minimum date (today)
  const today = new Date().toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-white">Service Appointments</h1>
            <a
              href="/"
              className="text-neutral-400 hover:text-amber-500 transition-colors"
            >
              protolab.tech
            </a>
          </div>
        </div>
      </header>

      <main id="main-content" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Calendar Section */}
          <motion.section
            {...fadeInUp}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              My Schedule
            </h2>
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src="https://calendar.google.com/calendar/embed?src=alban.zalli%40outlook.com&ctz=Europe%2FRome&mode=WEEK&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1&hl=en"
                style={{ border: 0 }}
                width="100%"
                height="500"
                frameBorder="0"
                scrolling="no"
                title="Protolab Schedule"
                className="bg-white"
              />
            </div>
            <p className="text-neutral-400 text-sm mt-4 text-center">
              View our availability and find a suitable time slot for your appointment.
            </p>
          </motion.section>

          {/* Appointment Form */}
          <motion.section
            {...fadeInUp}
            className="bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-800"
          >
            <h2 className="text-2xl font-bold text-amber-500 mb-2 flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Request an Appointment
            </h2>
            
            <div className="mb-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-neutral-300 text-sm">
                Clicking &quot;Submit Appointment Request&quot; will open your default email application 
                with a pre-filled message ready for you to review and send to{' '}
                <a
                  href="mailto:info@protolab.tech"
                  className="text-amber-500 hover:text-amber-400 underline"
                >
                  info@protolab.tech
                </a>.
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                <p className="text-neutral-400 mb-6">
                  Your email client should have opened with the appointment request. 
                  Please send the email to complete your request.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="border-neutral-700 text-white hover:bg-white/10"
                >
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-500" />
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-amber-500" />
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredDate" className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    Preferred Date & Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="datetime-local"
                    required
                    min={today}
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="bg-neutral-800 border-neutral-700 text-white focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="specifyEnd"
                    checked={specifyEndDate}
                    onCheckedChange={(checked) => setSpecifyEndDate(checked as boolean)}
                    className="border-neutral-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                  <Label htmlFor="specifyEnd" className="text-neutral-300 text-sm cursor-pointer">
                    Specify End Date and Time
                  </Label>
                </div>

                {specifyEndDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="endDate" className="text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      End Date & Time
                    </Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      min={formData.preferredDate || today}
                      value={formData.endDate}
                      onChange={handleChange}
                      className="bg-neutral-800 border-neutral-700 text-white focus:border-amber-500 focus:ring-amber-500"
                    />
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your project or any special requirements..."
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-amber-500 focus:ring-amber-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-amber-500 text-black hover:bg-amber-600 font-semibold"
                >
                  Submit Appointment Request
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            )}
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} protolab.tech. All rights reserved.
          </p>
          <a
            href="/policy.html"
            className="text-neutral-500 text-sm hover:text-amber-500 transition-colors mt-2 inline-block"
          >
            Privacy & Cookie Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
