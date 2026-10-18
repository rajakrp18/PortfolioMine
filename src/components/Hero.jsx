import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  ChevronDown, 
  Copy, 
  Check, 
  MapPin, 
  Briefcase, 
  Mail, 
  FileText,
  Activity,
  Zap,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { LinkedInIcon, GitHubIcon } from './SocialIcons';
import { Link } from 'react-scroll';

const Hero = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [resumeDropdown, setResumeDropdown] = useState(false);

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('rajpoddar8907@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const metrics = [
    { label: 'EMG Signal Streaming', value: '60+ FPS', sub: '<50ms latency via serial', icon: Activity, color: 'text-emerald-500' },
    { label: 'Query Latency Reduction', value: '35%', sub: 'FastAPI & PostgreSQL indexing', icon: Zap, color: 'text-blue-500' },
    { label: 'Vector Matching Precision', value: '95%+', sub: 'Hugging Face Transformers', icon: Activity, color: 'text-purple-500' },
    { label: 'Enterprise ERP Modules', value: '18 APIs', sub: 'Multi-tenant architecture', icon: Layers, color: 'text-amber-500' },
  ];

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 px-6 dot-grid flex flex-col justify-center overflow-hidden">
      {/* Subtle background ambient lights (tasteful, not overwhelming) */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/10 dark:bg-blue-600/10 blur-[130px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Pitch */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Live Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium mb-6 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available for Full-Stack & Backend Roles • Noida (Delhi NCR)</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6"
            >
              Building scalable <span className="text-gradient-primary">web & ERP systems</span>, real-time pipelines, and robust APIs.
            </motion.h1>

            {/* Human Introduction */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl"
            >
              Hi, I'm <strong className="text-slate-900 dark:text-white font-semibold">Raj Poddar</strong> (He/Him). I turn complex operational challenges into dependable software. From processing bio-signals at <strong>60+ FPS with sub-50ms latency</strong> to architecting <strong>18-module multi-tenant ERP platforms</strong> and <strong>vector similarity search pipelines</strong>.
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-10"
            >
              <Link
                to="projects"
                smooth={true}
                duration={500}
                offset={-80}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Explore Featured Work</span>
                <ChevronDown size={16} />
              </Link>

              {/* Resume download with dropdown */}
              <div className="relative">
                <button
                  onClick={() => setResumeDropdown(!resumeDropdown)}
                  className="px-5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-blue-500 dark:hover:border-blue-400 font-semibold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download size={16} className="text-blue-500" />
                  <span>Download Resume</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${resumeDropdown ? 'rotate-180' : ''}`} />
                </button>

                {resumeDropdown && (
                  <div className="absolute left-0 mt-2 w-64 rounded-xl card-crafted p-2 shadow-xl z-30 animate-in fade-in slide-in-from-top-2">
                    <a
                      href="./Raj_Poddar_SoftwareDev.pdf"
                      download
                      onClick={() => setResumeDropdown(false)}
                      className="flex flex-col p-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        Software Developer CV
                        <Download size={13} className="text-blue-500" />
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Full-Stack, Python, React, PostgreSQL, Real-Time</span>
                    </a>
                    <a
                      href="./Raj_Poddar_Data_Analyst_Resume-compressed.pdf"
                      download
                      onClick={() => setResumeDropdown(false)}
                      className="flex flex-col p-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-100 dark:border-slate-800/80 mt-1"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                        Data & Analytics Resume
                        <Download size={13} className="text-purple-500" />
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">EDA, Machine Learning, Dashboards</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Quick Copy Email Button */}
              <button
                onClick={copyEmailToClipboard}
                className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
                title="Click to copy email address"
              >
                {copiedEmail ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                <span>{copiedEmail ? 'Copied rajpoddar8907@gmail.com!' : 'Copy Email'}</span>
              </button>
            </motion.div>

            {/* Quick Metrics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-6 border-t border-slate-200 dark:border-slate-800"
            >
              {metrics.map((m, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {m.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {m.label}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-500 mt-0.5">
                    {m.sub}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Personal Profile Card (Human, Crafted, Not AI-slop) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md card-crafted rounded-3xl p-6 sm:p-7 relative overflow-hidden"
            >
              {/* Top Card Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>RAJ_PODDAR // PROFILE</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                  <span>He / Him</span>
                </div>
              </div>

              {/* Photo & Identity */}
              <div className="flex flex-col sm:flex-row items-center gap-5 my-6">
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-md">
                    <img
                      src="./mypic.jpg"
                      alt="Raj Poddar - Full-Stack Software Engineer"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-md">
                    ⚡
                  </div>
                </div>

                <div className="flex flex-col text-center sm:text-left">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Raj Poddar
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    Full-Stack Software Engineer
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-2">
                    <MapPin size={13} className="text-red-500 shrink-0" />
                    <span>Noida, Uttar Pradesh, India</span>
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>1,470+ LinkedIn Network</span>
                  </div>
                </div>
              </div>

              {/* Current Role Callout */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-slate-800/60 border border-blue-100 dark:border-blue-900/40 mb-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  <Briefcase size={14} />
                  <span>Current Role</span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Automation Developer
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between mt-0.5">
                  <span>Miraaj Associates • Delhi, India</span>
                  <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Present</span>
                </div>
              </div>

              {/* Core Skill Tags */}
              <div className="mb-6">
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                  Primary Arsenal
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Python', 'FastAPI', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'Vector Search'].map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Social & Connect Links */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <a
                  href="https://www.linkedin.com/in/raj-poddar-23a0841bb/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-900 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs"
                >
                  <LinkedInIcon size={14} className="text-blue-600" />
                  <span>LinkedIn</span>
                  <ArrowUpRight size={12} className="opacity-60" />
                </a>

                <a
                  href="https://github.com/rajakrp18"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white bg-white dark:bg-slate-900 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-xs"
                >
                  <GitHubIcon size={14} />
                  <span>GitHub</span>
                  <ArrowUpRight size={12} className="opacity-60" />
                </a>

                <a
                  href="mailto:rajpoddar8907@gmail.com"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs"
                  title="Send email to Raj"
                >
                  <Mail size={16} />
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
