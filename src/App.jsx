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
      <footer className="py-8 text-center border-t border-gray-800 bg-slate-950 mt-20">
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} Raj Poddar. Built with React & Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}

export default App;
