import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Code2, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Database, 
  ExternalLink 
} from 'lucide-react';

const About = () => {
  const highlights = [
    {
      title: 'Real-Time Systems & Hardware Streaming',
      desc: 'Engineered Python serial pipelines (PyQt6/PyQtGraph + Arduino) streaming bio-signals at 60+ FPS with sub-50ms latency.',
      tag: 'Python / Serial'
    },
    {
      title: 'High-Throughput Backends & Database Tuning',
      desc: 'Built FastAPI microservices and optimized PostgreSQL schema indexes for medical imaging workflows, reducing query latency by 35%.',
      tag: 'FastAPI / PostgreSQL'
    },
    {
      title: 'NLP & Vector Similarity Search',
      desc: 'Engineered a medicine matching engine using Hugging Face Sentence Transformers and vector embeddings with 95%+ precision and 40% faster retrieval.',
      tag: 'Vector Search / NLP'
    },
    {
      title: 'Multi-Tenant ERP Platforms',
      desc: 'Architected multi-tenant cloud platforms comprising 18 modular API microservices handling inventory, billing, CRM, and audit logging.',
      tag: 'Full-Stack / ERP'
    }
  ];

  const education = [
    {
      degree: 'Master of Computer Applications (MCA)',
      school: 'JIS College of Engineering',
      period: 'Jul 2022 – Jul 2024',
      grade: 'Grade: 70%',
      focus: 'Computer Programming, Relational Database Management, Machine Learning Algorithms, Distributed Systems.'
    },
    {
      degree: "Bachelor's Degree in Computer Science (B.Sc. CS)",
      school: 'Kanchrapara College',
      period: 'Jun 2019 – Jul 2022',
      grade: 'Grade: 83% (First Class)',
      focus: 'Data Structures & Algorithms, C/C++, Database Systems, Computer Networks & Operating Systems.'
    }
  ];

  return (
    <section id="about" className="py-24 px-6 relative bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-mono font-medium mb-3">
            <Terminal size={12} />
            <span>01 // ABOUT THE ENGINEER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pragmatic Engineering, <span className="text-gradient-primary">Measurable Impact</span>.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mt-3 text-sm sm:text-base">
            From low-level serial streams to multi-tenant cloud architectures — here is who I am, what I build, and how I think.
          </p>
        </div>

        {/* Story & Dossier Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Left Column: Personal Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-base"
          >
            <div className="card-crafted rounded-2xl p-6 sm:p-8 space-y-5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>The Story So Far</span>
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-slate-800">Full-Stack & Backend</span>
              </h3>

              <p>
                I'm a <strong className="text-slate-900 dark:text-white">Full-Stack Software Engineer</strong> based in Noida (Delhi NCR), holding a Master of Computer Applications (MCA) and a Bachelor’s in Computer Science. My primary engineering focus revolves around backend architecture, real-time data pipelines, REST APIs, and responsive full-stack applications.
              </p>

              <p>
                I've always been drawn to the plumbing of software systems — what happens beneath the surface when data needs to move swiftly, reliably, and without failure. Whether it's writing <strong>Arduino serial stream handlers in Python to render 60+ FPS bio-signals with sub-50ms latency</strong>, or optimizing <strong>PostgreSQL indexing for medical imaging workflows to slash query response times by 35%</strong>, I care deeply about latency, data integrity, and pragmatic system design.
              </p>

              <p>
                Currently, I work as an <strong className="text-slate-900 dark:text-white">AI Automation Developer at Miraaj Associates</strong>, engineering intelligent agentic workflows and full-stack integrations that eliminate manual operations. Before this, I developed production backend services at Vision Innovations and engineered NLP vector similarity engines at Weloin Global.
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">📍 Noida & Kolkata</span>
                <span>•</span>
                <span className="flex items-center gap-1">💼 On-site, Hybrid, or Remote</span>
                <span>•</span>
                <span className="flex items-center gap-1">⚡ He / Him</span>
              </div>
            </div>

            {/* Core Competency Highlights Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, idx) => (
                <div 
                  key={idx}
                  className="card-crafted p-5 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-slate-800">
                      {item.tag}
                    </span>
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Education & Quick Dossier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Education Card */}
            <div className="card-crafted rounded-2xl p-6 sm:p-7">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <GraduationCap size={18} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Formal Education
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Accredited</span>
              </div>

              <div className="space-y-6">
                {education.map((edu, idx) => (
                  <div key={idx} className="relative pl-5 border-l-2 border-blue-500/30">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {edu.degree}
                      </h4>
                      <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        {edu.grade}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                      {edu.school}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                      {edu.period}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {edu.focus}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Human Factsheet */}
            <div className="card-crafted rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span>Behind the Terminal</span>
              </h3>

              <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-slate-400 font-bold shrink-0">01.</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Favorite Stack:</strong> Python (FastAPI) + PostgreSQL on the backend; React & Next.js on the frontend.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-slate-400 font-bold shrink-0">02.</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Engineering Principle:</strong> Measure actual query times and serial bottlenecks before adding premature complexity.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-slate-400 font-bold shrink-0">03.</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Location Flexibility:</strong> Living in Noida, open to On-site, Hybrid, and Remote roles across India & globally.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-slate-400 font-bold shrink-0">04.</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Open Source & Community:</strong> 1,470+ LinkedIn professional network, active code contributor.
                  </div>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
