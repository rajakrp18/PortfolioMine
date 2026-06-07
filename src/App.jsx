import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

function App() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-50 selection:bg-blue-500/30">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer className="pt-20 pb-10 border-t border-gray-800 bg-slate-950/80 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 mb-12 relative z-10">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Raj<span className="text-blue-500">Poddar.</span></h3>
            <p className="text-gray-400 mb-6">Transforming complex data into actionable insights and building robust backend services.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" className="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#experience" className="hover:text-blue-400 transition-colors">Experience</a></li>
              <li><a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Let's Connect</h4>
            <p className="text-gray-400 mb-4">Feel free to reach out for collaborations or just a friendly hello!</p>
            <a href="mailto:rajpoddar8907@gmail.com" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">rajpoddar8907@gmail.com</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 border-t border-gray-800/50 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 relative z-10">
          <p>&copy; {new Date().getFullYear()} Raj Poddar. All rights reserved.</p>
          <p className="mt-4 md:mt-0 text-sm">Built with React & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
