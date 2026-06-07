import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Get In <span className="text-blue-500">Touch</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">Have a project in mind or just want to connect? Feel free to reach out. I'm always open to discussing new opportunities and ideas.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="card-glass p-8 rounded-2xl flex flex-col gap-6">
              <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Location</h4>
                  <p className="text-gray-400">Kanchrapara, West Bengal, India</p>
                </div>
              </div>
              
              <a href="mailto:rajpoddar8907@gmail.com" className="flex items-center gap-4 text-gray-300 hover:text-blue-400 transition-colors">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Email</h4>
                  <p className="text-gray-400">rajpoddar8907@gmail.com</p>
                </div>
              </a>

              <a href="tel:+919073066073" className="flex items-center gap-4 text-gray-300 hover:text-blue-400 transition-colors">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Phone</h4>
                  <p className="text-gray-400">+91-9073066073</p>
                </div>
              </a>
            </div>

            <div className="flex gap-4">
              <a href="https://linkedin.com/in/raj-poddar-23a0841bb" target="_blank" rel="noreferrer" className="flex-1 card-glass py-4 rounded-xl flex justify-center items-center text-gray-400 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://github.com/rajakrp18" target="_blank" rel="noreferrer" className="flex-1 card-glass py-4 rounded-xl flex justify-center items-center text-gray-400 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.17a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.1 2.8 5 3.1 5 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.6 9.5c0 5.77 3.35 6.79 6.5 7.17A4.8 4.8 0 0 0 9 19.71V22"></path><path d="M9 19c-5 1.5-5-2.5-7-3"></path></svg>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form action="https://formsubmit.co/rajpoddar8907@gmail.com" method="POST" className="card-glass p-8 rounded-2xl space-y-6">
              <input type="hidden" name="_captcha" value="false" />
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                <input type="text" name="name" required className="w-full bg-slate-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Your Email</label>
                <input type="email" name="email" required className="w-full bg-slate-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea name="message" required rows="4" className="w-full bg-slate-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="How can I help you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-500/25">
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
