import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { PageHeader, Card, CardBody, Button, Input } from '../../components/UI';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-emerald-200">
      
      {/* ── Navbar (Simplified) ── */}
      <nav className="absolute top-0 w-full z-50 border-b border-white/10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-lg shadow-lg">🥛</div>
            <span className="font-extrabold text-2xl tracking-tight text-white">DairyFresh</span>
          </Link>
          <Link to="/" className="text-sm font-semibold text-emerald-50 hover:text-emerald-300 transition-colors">
            Back to Home
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#022c22]">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-emerald-100 max-w-2xl mx-auto"
          >
            Whether you're looking to partner with us, have a question about your order, or just want to say hi, we're here for you.
          </motion.p>
        </div>
      </section>

      {/* ── Contact Content ── */}
      <section className="py-16 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="h-full">
                <CardBody className="space-y-8 p-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                          <Mail size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-semibold mb-1">Email Us</p>
                          <p className="text-gray-900 font-medium">hello@dairyfresh.com</p>
                          <p className="text-gray-900 font-medium">support@dairyfresh.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                          <Phone size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-semibold mb-1">Call Us</p>
                          <p className="text-gray-900 font-medium">+1 (800) 123-4567</p>
                          <p className="text-xs text-gray-400 mt-1">Mon-Fri from 8am to 5pm</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-semibold mb-1">Visit Us</p>
                          <p className="text-gray-900 font-medium">123 Dairy Farm Lane</p>
                          <p className="text-gray-900 font-medium">Agriculture Valley, CA 90210</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardBody className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent! We'll get back to you soon."); }}>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="First Name" placeholder="Jane" required />
                      <Input label="Last Name" placeholder="Doe" required />
                    </div>
                    <Input label="Email Address" type="email" placeholder="jane@example.com" required />
                    <Input label="Subject" placeholder="How can we help?" required />
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                      <textarea 
                        rows={4} 
                        className="w-full border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                        placeholder="Tell us more about your inquiry..."
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg" icon={Send}>
                      Send Message
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
