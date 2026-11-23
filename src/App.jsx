import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import ArchitectureShowcase from './components/ArchitectureShowcase';
import Skills from './components/Skills';
import Contact from './components/Contact';
import { Download, Mail, ArrowUp, Heart, FileText } from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from './components/SocialIcons';
import { Link } from 'react-scroll';

function MainLayout() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white transition-colors duration-200">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <ArchitectureShowcase />
        <Skills />
        <Contact />
      </main>

      {/* Thoughtful, Human Footer */}
      <footer className="pt-16 pb-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070a10]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            
            {/* Col 1: Bio / Brand */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  RP
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Raj Poddar
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                Full-Stack & AI Software Engineer specializing in Next.js, TypeScript, Python, FastAPI, and PostgreSQL. Engineering autonomous AI systems, multi-tenant ERP platforms, and scalable data pipelines.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Preferred Locations: Kolkata, Delhi, Noida • Remote & Hybrid</span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-900 dark:text-white mb-4">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link to="about" smooth={true} duration={500} offset={-80} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                    About Me
                  </Link>
                </li>
                <li>
                  <Link to="experience" smooth={true} duration={500} offset={-80} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                    Experience & Career
                  </Link>
                </li>
                <li>
                  <Link to="projects" smooth={true} duration={500} offset={-80} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                    Featured Projects
                  </Link>
                </li>
                <li>
                  <Link to="architecture" smooth={true} duration={500} offset={-80} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                    Architecture & Code
                  </Link>
                </li>
                <li>
                  <Link to="skills" smooth={true} duration={500} offset={-80} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                    Skills Arsenal
                  </Link>
                </li>
                <li>
                  <Link to="contact" smooth={true} duration={500} offset={-80} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                    Get In Touch
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Documents & Connect */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-900 dark:text-white mb-4">
                Resources & Links
              </h4>
              <div className="space-y-3 text-xs sm:text-sm">
                <a
                  href="./resume-ats.html"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  <FileText size={14} />
                  <span>ATS & AI Resume (Web / Print)</span>
                </a>
                <a
                  href="./Raj_Poddar_SoftwareDev.pdf"
                  download
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Download size={14} />
                  <span>Software Developer CV (PDF)</span>
                </a>
                <a
                  href="./Raj_Poddar_Data_Analyst_Resume-compressed.pdf"
                  download
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Download size={14} />
                  <span>Data Analyst Resume</span>
                </a>
                <a
                  href="./Thesis.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Health Insurance ML Thesis (PDF)
                </a>
                <a
                  href="./Dairy.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Dairy ERP System Report (PDF)
                </a>

                <div className="flex gap-2.5 pt-2">
                  <a
                    href="https://www.linkedin.com/in/raj-poddar-23a0841bb/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="LinkedIn"
                  >
                    <LinkedInIcon size={16} />
                  </a>
                  <a
                    href="https://github.com/rajakrp18"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="GitHub"
                  >
                    <GitHubIcon size={16} />
                  </a>
                  <a
                    href="mailto:rajpoddar8907@gmail.com"
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Email"
                  >
                    <Mail size={16} />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
            <p>
              &copy; {currentYear} Raj Poddar. Built with craft, React, Tailwind CSS, & Framer Motion.
            </p>
            <div className="flex items-center gap-4">
              <span>Noida • Kolkata • Remote</span>
              <Link
                to="home"
                smooth={true}
                duration={500}
                className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
              >
                <span>Back to top</span>
                <ArrowUp size={13} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
}

export default App;
